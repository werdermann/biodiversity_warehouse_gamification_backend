import { BadgeCondition } from './badge-condition.enum';

/**
 * Response object that contains the badge conditions that can be unlocked by the user.
 */
export class LockedBadgeResponse {
  public condition: BadgeCondition;
}
