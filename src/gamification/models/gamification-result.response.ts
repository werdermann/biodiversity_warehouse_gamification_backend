import { UnlockedBadgeResponse } from './unlocked-badge.response';
import { LeaderboardResponse } from './leaderboard.response';
import { GamificationResultUserResponse } from './gamification-result-user.response';

/**
 * Response object that shows the results of the gamification elements. It is being sent the user when he reports a
 * sighting.
 */
export class GamificationResultResponse {
  gainedPoints: number;
  newUnlockedBadges: UnlockedBadgeResponse[];
  hasNewLeaderboardPosition: boolean;
  leaderboard: LeaderboardResponse;
  user: GamificationResultUserResponse;
}
