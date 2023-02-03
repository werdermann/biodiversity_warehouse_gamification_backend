import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  GamificationService,
  LeaderboardResponse,
} from '../domain/gamification.service';
import { GamificationConfigResult } from '../domain/models/gamification-config-result.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('config')
  async getGamificationConfig(): Promise<GamificationConfigResult> {
    return this.gamificationService.getConfiguration();
  }

  @UseGuards(JwtAuthGuard)
  @Get('leaderboard')
  async getLeaderboard(@Req() req): Promise<LeaderboardResponse> {
    const username = req.user.username;

    return this.gamificationService.getLeaderboard(username);
  }
}
