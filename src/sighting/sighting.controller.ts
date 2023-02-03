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
import { CreateSightingDto } from './dto/create-sighting.dto';
import { GamificationService } from '../gamification/domain/gamification.service';
import { GamificationResult } from '../gamification/domain/models/gamification-result.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateSightingValidation } from '../pipe/form-data-validation.pipe';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

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
  ): Promise<GamificationResult> {
    // Parse files into base64 strings
    const photos = files.map((file) => {
      return file.buffer.toString('base64');
    });

    const userId = req.user.id;

    // Store sighting in database
    const sighting = await this.sightingService.create(
      userId,
      createSightingDto,
      photos,
    );

    return await this.gamificationService.calculateResult(sighting, userId);
  }
}
