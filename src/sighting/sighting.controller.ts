import {
  Body,
  Controller,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SightingService } from './sighting.service';
import { CreateSightingDto } from './models/create-sighting.dto';
import { GamificationService } from '../gamification/gamification.service';
import { GamificationResultResponse } from '../gamification/models/gamification-result.response';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateSightingValidation } from '../pipe/form-data-validation.pipe';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

/**
 * Exposes the rest api to the mobile application.
 */
@Controller('sighting')
export class SightingController {
  constructor(
    private readonly sightingService: SightingService,
    private readonly gamificationService: GamificationService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body(new CreateSightingValidation()) createSightingDto: CreateSightingDto,
    @Request() req,
  ): Promise<GamificationResultResponse> {
    // Parse files into base64 strings
    const photos = files.map((file) => {
      return file.buffer.toString('base64');
    });

    // Get current user id from token
    const userId = req.user.id;

    // Store sighting in database
    const sighting = await this.sightingService.create(
      userId,
      createSightingDto,
      photos,
    );

    /// Calculate the gamification result based on the reported sighting of the user
    return await this.gamificationService.calculateResult(sighting, userId);
  }
}
