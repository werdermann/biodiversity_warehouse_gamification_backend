import { BadgeCondition } from '../gamification/models/badge-condition.enum';

export const Constants = {
  jwtSecret: 'secretKey',
  entryPoints: 10,
  commentPoints: 5,
  photoPoints: 10,
  lockedStarterBadges: [
    BadgeCondition.oneSightingReported,
    BadgeCondition.fiveSightingsReported,
    BadgeCondition.tenSightingsReported,
    BadgeCondition.twentySightingsReported,
    BadgeCondition.oneImageUploaded,
    BadgeCondition.fiveImagesUploaded,
    BadgeCondition.tenImagesUploaded,
    BadgeCondition.twentyImagesUploaded,
    BadgeCondition.oneCommentWritten,
    BadgeCondition.fiveCommentsWritten,
    BadgeCondition.tenCommentsWritten,
    BadgeCondition.twentyCommentsWritten,
    BadgeCondition.allBadgesUnlocked,
  ],
  allBadges: 12,
};
