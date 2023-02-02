import { IsBoolean } from 'class-validator';

export class CreateGamificationConfigDto {
  @IsBoolean()
  leaderboardActive: boolean;

  @IsBoolean()
  badgesActive: boolean;

  @IsBoolean()
  onBoardingActive: boolean;
}
