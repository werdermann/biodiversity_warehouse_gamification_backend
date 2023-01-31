import { Controller, Get } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { GamificationConfigResult } from './dto/gamification-config-result.dto';

@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get()
  async getGamificationConfig(): Promise<GamificationConfigResult> {
    console.log('GET GAMIFICATION CONFIG');

    return this.gamificationService.getConfiguration();
  }
}
