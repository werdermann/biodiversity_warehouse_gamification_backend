import { Body, Controller, Post, UploadedFiles } from '@nestjs/common';
import { SightingService } from './sighting.service';
import { CreateSightingDto } from './dto/create-sighting.dto';
import { GamificationService } from '../gamification/gamification.service';
import { GamificationResult } from '../gamification/dto/gamification-result.dto';

@Controller('sighting')
export class SightingController {
  constructor(
    private readonly sightingService: SightingService,
    private readonly gamificationService: GamificationService,
  ) {}

  @Post()
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createSightingDto: CreateSightingDto,
  ): Promise<GamificationResult> {
    console.log('files');
    console.log(files);

    await this.sightingService.create(createSightingDto);

    const gamificationResult = await this.gamificationService.calculateResult(
      createSightingDto,
    );

    console.log('RESULT');
    console.log(gamificationResult);

    return gamificationResult;
  }
}
