class User {
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  isAdmin: boolean;
  points: number;
  unlockedBadges: Array<Badge>;
  lockedBadges: Array<Badge>;
  leaderboardPosition: number;
}
