import { User } from '../../../user/user.entity';
import { LeaderboardResponse } from '../gamification.service';
import { UnlockedBadge } from '../../unlocked-badge.entity';

export class GamificationResult {
  gainedPoints: number;
  newUnlockedBadges: UnlockedBadge[];
  hasNewLeaderboardPosition: boolean;
  leaderboard: LeaderboardResponse;
  user: User;
}
