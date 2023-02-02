import { Controller, Get, Req } from '@nestjs/common';
import {
  GamificationService,
  LeaderboardResponse,
} from '../domain/gamification.service';
import { GamificationConfigResult } from '../domain/models/gamification-config-result.dto';

@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get()
  async getGamificationConfig(): Promise<GamificationConfigResult> {
    return this.gamificationService.getConfiguration();
  }

  @Get()
  async getLeaderboard(@Req() req): Promise<LeaderboardResponse> {
    return this.gamificationService.getLeaderboard(req.user);
  }
}
