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
import { PointResponse } from './models/point.response';
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
    // Calculate the points of the user
    const { gainedPoints, commentsCount } = await this.calculatePoints(
      sighting,
    );

    // Get the current user instance
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['unlockedBadges', 'lockedBadges', 'sightings'],
    });

    // Update the user object based on the new stats
    user.points += gainedPoints;
    user.totalCommentCount += commentsCount;
    user.totalPhotoCount += sighting.photos.length;

    // Check if the user unlocked a new badge
    const newUnlockedBadges = await this.checkBadgeConditions(user);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    user.unlockedBadges.push(...newUnlockedBadges);

    // Update user entity in database
    await this.userRepository.save(user);

    // Get user to receive updated list of locked badges
    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['unlockedBadges', 'lockedBadges', 'sightings'],
    });

    // Fetch current leaderboard
    const leaderboard = await this.getLeaderboard(updatedUser.username);

    // Check if the player gained a new position on the leaderboard
    let hasNewLeaderboardPosition =
      user.leaderboardPosition != leaderboard.currentPosition;
    if (!user.leaderboardPosition) {
      hasNewLeaderboardPosition = false;
    }

    const currentUser = await this.userRepository.save(updatedUser);

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
      user: updatedUser,
      gainedPoints,
    };
  }

  /**
   * Calculates the points of the user based on the reported sighting.
   * @param sighting
   * @private
   */
  private async calculatePoints(sighting: Sighting): Promise<PointResponse> {
    let points = 0;
    let commentsCount = 0;

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
        commentsCount++;
      }
    });

    if (sighting.locationComment) {
      points += Constants.commentPoints;
      commentsCount++;
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
      commentsCount++;
    }

    return {
      gainedPoints: points,
      commentsCount,
    };
  }

  /**
   * Validates if the user has unlocked any new badges.
   * @param user
   * @private
   */
  private async checkBadgeConditions(
    user: User,
  ): Promise<UnlockedBadgeResponse[]> {
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
        case BadgeCondition.twentySpeciesReported: {
          if (speciesLength >= 20) {
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
        case BadgeCondition.twentyCommentsWritten: {
          if (user.totalCommentCount >= 20) {
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
        case BadgeCondition.twentyImagesUploaded: {
          if (user.totalPhotoCount >= 20) {
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
    const allBadgesBadge = user.lockedBadges.find(
      (badge) => badge.condition == BadgeCondition.allBadgesUnlocked,
    );

    // Check if all badges are unlocked
    if (
      user.unlockedBadges.length + newUnlockedBadges.length ==
        Constants.allBadges &&
      allBadgesBadge
    ) {
      newUnlockedBadges.push({
        user,
        condition: BadgeCondition.allBadgesUnlocked,
      });

      await this.lockedBadgeRepository.remove(allBadgesBadge);
    }

    const result = await this.unlockedBadgeRepository.save(newUnlockedBadges);

    // Returns a list of unlocked badges
    return result.map((entry) => {
      entry.user = undefined; // Set user as undefined to avoid circular parsing error
      return entry;
    });
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
   * @param username
   */
  async getLeaderboard(username: string): Promise<LeaderboardResponse> {
    const allUsers = await this.userRepository.find({
      order: {
        points: {
          direction: 'DESC',
        },
      },
    });

    const position = allUsers.findIndex((u) => u.username == username);

    const leaderboardUsers = allUsers.map((user) => {
      // Delete the given attributes of the user objects because only the points and the username of the user matter
      const {
        id,
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
      currentPosition: position,
      users: leaderboardUsers,
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
}
