import { BadgeCondition } from './badge-condition.enum';

/**
 * Response object that contains the conditions that is fulfilled by the user and the date of the unlocking.
 */
export class UnlockedBadgeResponse {
  public condition: BadgeCondition;
  public date: string;
}
