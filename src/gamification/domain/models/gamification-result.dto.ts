import {
  GamificationResultUserResponse,
  LeaderboardResponse,
  UnlockedBadgeResponse,
} from '../gamification.service';

export class GamificationResult {
  gainedPoints: number;
  newUnlockedBadges: UnlockedBadgeResponse[];
  hasNewLeaderboardPosition: boolean;
  leaderboard: LeaderboardResponse;
  user: GamificationResultUserResponse;
}
