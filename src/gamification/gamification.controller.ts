import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { GamificationConfigResponse } from './models/gamification-config.response';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LeaderboardResponse } from './models/leaderboard.response';

/**
 * Exposes the rest api to the mobile application.
 */
@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('config')
  async getGamificationConfig(): Promise<GamificationConfigResponse> {
    return this.gamificationService.getConfiguration();
  }

  @UseGuards(JwtAuthGuard)
  @Get('leaderboard')
  async getLeaderboard(@Req() req): Promise<LeaderboardResponse> {
    const username = req.user.username;

    return this.gamificationService.getLeaderboard(username);
  }
}
