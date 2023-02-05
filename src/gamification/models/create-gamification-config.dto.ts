import { IsBoolean } from 'class-validator';

/**
 * Data transfer object that is used for updating the current gamification configuration.
 */
export class CreateGamificationConfigDto {
  @IsBoolean()
  leaderboardActive: boolean;

  @IsBoolean()
  badgesActive: boolean;

  @IsBoolean()
  onBoardingActive: boolean;
}
