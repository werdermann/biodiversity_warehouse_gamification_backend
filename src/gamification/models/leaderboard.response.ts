import { LeaderboardUserResponse } from './leaderboard-user.response';

/**
 * Response object that contains the current leaderboard.
 */
export class LeaderboardResponse {
  public currentPosition: number;
  public users: LeaderboardUserResponse[];
}
