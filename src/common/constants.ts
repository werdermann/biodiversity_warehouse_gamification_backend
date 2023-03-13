import { BadgeCondition } from '../gamification/models/badge-condition.enum';

export const Constants = {
  jwtSecret: 'secretKey',
  speciesPoints: 5,
  evidencePoints: 5,
  commentPoints: 5,
  reportMethodPoints: 5,
  photoPoints: 10,
  lockedStarterBadges: [
    BadgeCondition.oneSpeciesReported,
    BadgeCondition.fiveSpeciesReported,
    BadgeCondition.tenSpeciesReported,
    BadgeCondition.fifteenSpeciesReported,
    BadgeCondition.oneImageUploaded,
    BadgeCondition.fiveImagesUploaded,
    BadgeCondition.tenImagesUploaded,
    BadgeCondition.fifteenImagesUploaded,
    BadgeCondition.oneCommentWritten,
    BadgeCondition.fiveCommentsWritten,
    BadgeCondition.tenCommentsWritten,
    BadgeCondition.fifteenCommentsWritten,
    BadgeCondition.allBadgesUnlocked,
  ],
  allBadges: 12,
};
