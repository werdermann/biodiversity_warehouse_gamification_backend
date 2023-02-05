import { UnlockedBadgeResponse } from './unlocked-badge.response';
import { LockedBadgeResponse } from './locked-badge.response';

/**
 * Simplified user object that only contains the username, the points, the unlocked and locked badges.
 */
export class GamificationResultUserResponse {
  public username: string;
  public points: number;
  public unlockedBadges: UnlockedBadgeResponse[];
  public lockedBadges: LockedBadgeResponse[];
}
