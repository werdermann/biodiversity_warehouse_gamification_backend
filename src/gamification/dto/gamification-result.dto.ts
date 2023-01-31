import { User } from '../../user/user.entity';

export class GamificationResult {
  gainedPoints: number;
  newUnlockedBadges: number;
  newLeaderboardPosition: number;
  user: User;
}
