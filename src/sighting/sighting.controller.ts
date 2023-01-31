import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { SightingService } from './sighting.service';
import { CreateSightingDto } from './dto/create-sighting.dto';
import { GamificationService } from '../gamification/gamification.service';
import { GamificationResult } from '../gamification/dto/gamification-result.dto';
import { GamificationConfigResult } from '../gamification/dto/gamification-config-result.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateSightingValidation } from '../pipe/form-data-validation.pipe';

@Controller('sighting')
export class SightingController {
  constructor(
    private readonly sightingService: SightingService,
    private readonly gamificationService: GamificationService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body(new CreateSightingValidation()) createSightingDto: CreateSightingDto,
  ): Promise<GamificationResult> {
    console.log('RAW');
    console.log(createSightingDto);

    console.log('FILES');

    console.log(files);

    const photos = files.map((file) => {
      return file.buffer.toString('base64');
    });

    console.log('Parsed photos');
    console.log(photos);

    await this.sightingService.create(createSightingDto, photos);

    const gamificationResult = await this.gamificationService.calculateResult(
      createSightingDto,
    );

    console.log('RESULT');
    console.log(gamificationResult);

    // return gamificationResult;

    return new GamificationResult();
  }
}
