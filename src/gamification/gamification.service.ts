import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GamificationConfig } from './models/gamification-config.entity';
import { Repository } from 'typeorm';
import { CreateGamificationConfigDto } from './models/create-gamification-config.dto';
import { GamificationResultResponse } from './models/gamification-result.response';
import { UnlockedBadge } from './models/unlocked-badge.entity';
import { GamificationConfigResponse } from './models/gamification-config.response';
import { Sighting } from '../sighting/models/sighting.entity';
import { Constants } from '../common/constants';
import { User } from '../user/models/user.entity';
import { LockedBadge } from './models/locked-badge.entity';
import { BadgeCondition } from './models/badge-condition.enum';
import { LeaderboardResponse } from './models/leaderboard.response';
import { UnlockedBadgeResponse } from './models/unlocked-badge.response';
import { Species } from '../sighting/models/species.enum';
import { EvidenceStatus } from '../sighting/models/evidence-status.enum';
import { ReportMethod } from '../sighting/models/report-method.enum';

/**
 * Contains the business logic for calculating the gamification result, to check which badges are being unlocked by the
 * user and how many points the user gets for reporting sightings.
 */
@Injectable()
export class GamificationService {
  constructor(
    @InjectRepository(GamificationConfig)
    private readonly gamificationRepository: Repository<GamificationConfig>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UnlockedBadge)
    private readonly unlockedBadgeRepository: Repository<UnlockedBadge>,
    @InjectRepository(LockedBadge)
    private readonly lockedBadgeRepository: Repository<LockedBadge>,
  ) {}

  /**
   * Calculates the gamification result based on the reported sighting of the user.
   * @param sighting
   * @param userId
   */
  async calculateResult(
    sighting: Sighting,
    userId: number,
  ): Promise<GamificationResultResponse> {
    const oldUser = await this.userRepository.findOneBy({ id: userId });

    const gainedPoints = await this.calculatePoints(sighting, userId);

    const newUnlockedBadges = await this.checkBadgeConditions(userId);

    const { hasNewLeaderboardPosition, leaderboard } =
      await this.checkLeaderboardPosition(userId, oldUser.leaderboardPosition);

    const currentUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['unlockedBadges', 'lockedBadges', 'sightings'],
    });

    console.log('### CURRENT USER ###');
    console.log(currentUser);
    console.log('### CURRENT USER END ###');

    let sightingCount = 0;
    currentUser.sightings.map((sighting) => {
      sightingCount += sighting.speciesEntries.length;
    });

    console.log(`Sighting Count ${sightingCount}`);

    return {
      leaderboard,
      hasNewLeaderboardPosition,
      newUnlockedBadges,
      user: currentUser,
      gainedPoints,
    };
  }

  /**
   * Calculates the points of the user based on the reported sighting.
   * @private
   * @param sighting
   * @param userId
   */
  private async calculatePoints(
    sighting: Sighting,
    userId: number,
  ): Promise<number> {
    let points = 0;

    sighting.speciesEntries.forEach((entry) => {
      // Give user points if the species is specified.
      if (entry.species != Species.notSpecified) {
        points += Constants.speciesPoints;
      }

      // Give user points if the evidence status is specified.
      if (entry.evidenceStatus != EvidenceStatus.notSpecified) {
        points += Constants.evidencePoints;
      }

      // Give user points if the comment is added.
      if (entry.comment) {
        points += Constants.commentPoints;
      }
    });

    if (sighting.locationComment) {
      points += Constants.commentPoints;
    }

    sighting.photos.forEach(() => {
      points += Constants.photoPoints;
    });

    // Give user points if the report method is specified.
    if (sighting.reportMethod != ReportMethod.notSpecified) {
      points += Constants.reportMethodPoints;
    }

    if (sighting.detailsComment) {
      points += Constants.commentPoints;
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    user.points += points;
    await this.userRepository.save(user);

    return points;
  }

  /**
   * Validates if the user has unlocked any new badges.
   * @private
   * @param userId
   */
  private async checkBadgeConditions(
    userId: number,
  ): Promise<UnlockedBadgeResponse[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['unlockedBadges', 'lockedBadges', 'sightings'],
    });

    const newUnlockedBadges: Partial<UnlockedBadge>[] = [];

    let speciesLength = 0;
    user.sightings.forEach((sighting) => {
      sighting.speciesEntries.forEach(() => {
        speciesLength++;
      });
    });

    /// Iterate through the badges that can still be unlocked
    for (const badge of user.lockedBadges) {
      // Check through the different conditions and remove the according badge if it is unlocked by the user
      switch (badge.condition) {
        case BadgeCondition.oneSpeciesReported: {
          if (speciesLength >= 1) {
            await this.lockedBadgeRepository.remove(badge);
            newUnlockedBadges.push({
              user,
              condition: badge.condition,
            });
          }
          break;
        }
        case BadgeCondition.fiveSpeciesReported: {
          if (speciesLength >= 5) {
            await this.lockedBadgeRepository.remove(badge);
            newUnlockedBadges.push({
              user,
              condition: badge.condition,
            });
          }
          break;
        }
        case BadgeCondition.tenSpeciesReported: {
          if (speciesLength >= 10) {
            await this.lockedBadgeRepository.remove(badge);
            newUnlockedBadges.push({
              user,
              condition: badge.condition,
            });
          }
          break;
        }
        case BadgeCondition.fifteenSpeciesReported: {
          if (speciesLength >= 15) {
            await this.lockedBadgeRepository.remove(badge);
            newUnlockedBadges.push({
              user,
              condition: badge.condition,
            });
          }
          break;
        }
        case BadgeCondition.oneCommentWritten: {
          if (user.totalCommentCount >= 1) {
            await this.lockedBadgeRepository.remove(badge);
            newUnlockedBadges.push({
              user,
              condition: badge.condition,
            });
          }
          break;
        }
        case BadgeCondition.fiveCommentsWritten: {
          if (user.totalCommentCount >= 5) {
            await this.lockedBadgeRepository.remove(badge);
            newUnlockedBadges.push({
              user,
              condition: badge.condition,
            });
          }
          break;
        }
        case BadgeCondition.tenCommentsWritten: {
          if (user.totalCommentCount >= 10) {
            await this.lockedBadgeRepository.remove(badge);
            newUnlockedBadges.push({
              user,
              condition: badge.condition,
            });
          }
          break;
        }
        case BadgeCondition.fifteenCommentsWritten: {
          if (user.totalCommentCount >= 15) {
            await this.lockedBadgeRepository.remove(badge);
            newUnlockedBadges.push({
              user,
              condition: badge.condition,
            });
          }
          break;
        }
        case BadgeCondition.oneImageUploaded: {
          if (user.totalPhotoCount >= 1) {
            await this.lockedBadgeRepository.remove(badge);
            newUnlockedBadges.push({
              user,
              condition: badge.condition,
            });
          }
          break;
        }
        case BadgeCondition.fiveImagesUploaded: {
          if (user.totalPhotoCount >= 5) {
            await this.lockedBadgeRepository.remove(badge);
            newUnlockedBadges.push({
              user,
              condition: badge.condition,
            });
          }
          break;
        }
        case BadgeCondition.tenImagesUploaded: {
          if (user.totalPhotoCount >= 10) {
            await this.lockedBadgeRepository.remove(badge);
            newUnlockedBadges.push({
              user,
              condition: badge.condition,
            });
          }
          break;
        }
        case BadgeCondition.fifteenImagesUploaded: {
          if (user.totalPhotoCount >= 15) {
            await this.lockedBadgeRepository.remove(badge);
            newUnlockedBadges.push({
              user,
              condition: badge.condition,
            });
          }
          break;
        }
      }
    }

    // Badge that indicates that all other badges have been unlocked
    const hasUnlockedAllBadgesBadge = user.lockedBadges.find(
      (badge) => badge.condition == BadgeCondition.allBadgesUnlocked,
    );

    // Check if all badges are unlocked
    if (
      user.unlockedBadges.length + newUnlockedBadges.length ==
        Constants.allBadges &&
      hasUnlockedAllBadgesBadge
    ) {
      newUnlockedBadges.push({
        user,
        condition: BadgeCondition.allBadgesUnlocked,
      });

      await this.lockedBadgeRepository.remove(hasUnlockedAllBadgesBadge);
    }

    const result = await this.unlockedBadgeRepository.save(newUnlockedBadges);

    const newBadges = result.map((entry) => {
      entry.user = undefined; // Set user as undefined to avoid circular parsing error
      return entry;
    });

    user.unlockedBadges.push(...newBadges);

    // Update user entity in database
    await this.userRepository.save(user);

    // Returns a list of unlocked badges
    return newBadges;
  }

  /**
   * Used at the application start to set up the current gamification config.
   * @param createGamificationConfigDto
   */
  async createConfig(createGamificationConfigDto: CreateGamificationConfigDto) {
    await this.gamificationRepository.save(createGamificationConfigDto);
  }

  async getConfiguration(): Promise<GamificationConfigResponse | null> {
    try {
      const configList = await this.gamificationRepository.find();

      if (!configList) return null;

      const config = configList[0];

      // Remove id
      const { id, ...result } = config;

      return result;
    } catch (e) {
      return null;
    }
  }

  /**
   * Returns the current leaderboard and the current position based on the username.
   * @param userId
   * @param oldUserPosition
   */
  async checkLeaderboardPosition(
    userId: number,
    oldUserPosition: number,
  ): Promise<{
    hasNewLeaderboardPosition: boolean;
    leaderboard: LeaderboardResponse;
  }> {
    const allUsers = await this.userRepository.find({
      order: {
        points: {
          direction: 'DESC',
        },
      },
    });

    const user = allUsers.find((u) => u.id === userId);

    const currentPosition = allUsers.indexOf(user);

    const hasNewLeaderboardPosition = oldUserPosition != currentPosition;

    const leaderboardUsers = allUsers.map((user) => {
      // Delete the given attributes of the user objects because only the points and the username of the user matter
      const {
        isAdmin,
        unlockedBadges,
        lockedBadges,
        sightings,
        totalCommentCount,
        totalPhotoCount,
        password,
        leaderboardPosition,
        ...leaderboardUser
      } = user;

      return leaderboardUser;
    });

    return {
      hasNewLeaderboardPosition,
      leaderboard: {
        currentPosition: currentPosition,
        users: leaderboardUsers,
      },
    };
  }

  /**
   * Used at the application start to set up the starter badges of the users.
   * @param user
   */
  async createStarterBadges(user: User) {
    await Promise.all(
      Constants.lockedStarterBadges.map(async (condition) =>
        this.lockedBadgeRepository.save({
          condition: condition,
          user: user,
        }),
      ),
    );
  }

  async getLeaderboardByUserId(userId: number): Promise<LeaderboardResponse> {
    const allUsers = await this.userRepository.find({
      order: {
        points: {
          direction: 'DESC',
        },
      },
    });

    const user = allUsers.find((u) => u.id === userId);

    const currentPosition = allUsers.indexOf(user);

    const leaderboardUsers = allUsers.map((user) => {
      // Delete the given attributes of the user objects because only the points and the username of the user matter
      const {
        isAdmin,
        unlockedBadges,
        lockedBadges,
        sightings,
        totalCommentCount,
        totalPhotoCount,
        password,
        leaderboardPosition,
        ...leaderboardUser
      } = user;

      return leaderboardUser;
    });

    return {
      currentPosition: currentPosition,
      users: leaderboardUsers,
    };
  }
}
