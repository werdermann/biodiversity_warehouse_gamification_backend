import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GamificationConfig } from '../gamification-config.entity';
import { Repository } from 'typeorm';
import { CreateGamificationConfigDto } from './models/create-gamification-config.dto';
import { GamificationResult } from './models/gamification-result.dto';
import { UnlockedBadge } from '../unlocked-badge.entity';
import { GamificationConfigResult } from './models/gamification-config-result.dto';
import { Sighting } from '../../sighting/entity/sighting.entity';
import { Constants } from '../../common/constants';
import { User } from '../../user/user.entity';
import { LockedBadge } from '../locked-badge.entity';
import { BadgeCondition } from './models/badge-condition.enum';

export class LeaderboardResponse {
  public currentPosition: number;
  public users: User[];
}

export class PointResponse {
  public gainedPoints: number;
  public commentsCount: number;
}

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

  async calculateResult(
    sighting: Sighting,
    userId: number,
  ): Promise<GamificationResult> {
    const { gainedPoints, commentsCount } = await this.calculatePoints(
      sighting,
    );

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['unlockedBadges', 'lockedBadges', 'sightings'],
    });

    user.points += gainedPoints;
    user.totalCommentCount += commentsCount;
    user.totalPhotoCount += sighting.photos.length;

    const newUnlockedBadges = await this.checkBadgeConditions(user);

    user.unlockedBadges.push(...newUnlockedBadges);

    // Update user entity in database
    await this.userRepository.save(user);

    // Get user to receive updated list of locked badges
    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['unlockedBadges', 'lockedBadges', 'sightings'],
    });

    // Fetch current leaderboard
    const leaderboard = await this.getLeaderboard(updatedUser);

    // Check if the player gained a new position on the leaderboard
    const hasNewLeaderboardPosition =
      user.leaderboardPosition != leaderboard.currentPosition;

    return {
      leaderboard,
      hasNewLeaderboardPosition,
      newUnlockedBadges,
      user: updatedUser,
      gainedPoints,
    };
  }

  private async calculatePoints(sighting: Sighting): Promise<PointResponse> {
    let points = 0;
    let commentsCount = 0;

    sighting.speciesEntries.forEach((entry) => {
      points += Constants.entryPoints;

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

    if (sighting.detailsComment) {
      points += Constants.commentPoints;
      commentsCount++;
    }

    return {
      gainedPoints: points,
      commentsCount,
    };
  }

  private async checkBadgeConditions(user: User): Promise<UnlockedBadge[]> {
    const newUnlockedBadges: Partial<UnlockedBadge>[] = [];

    for (const badge of user.lockedBadges) {
      switch (badge.condition) {
        case BadgeCondition.oneSightingReported: {
          if (user.sightings.length >= 1) {
            await this.lockedBadgeRepository.remove(badge);
            newUnlockedBadges.push({
              user,
              condition: badge.condition,
            });
          }
          break;
        }
        case BadgeCondition.fiveSightingsReported: {
          if (user.sightings.length >= 5) {
            await this.lockedBadgeRepository.remove(badge);
            newUnlockedBadges.push({
              user,
              condition: badge.condition,
            });
          }
          break;
        }
        case BadgeCondition.tenSightingsReported: {
          if (user.sightings.length >= 10) {
            await this.lockedBadgeRepository.remove(badge);
            newUnlockedBadges.push({
              user,
              condition: badge.condition,
            });
          }
          break;
        }
        case BadgeCondition.twentySightingsReported: {
          if (user.sightings.length >= 20) {
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

    // Check if all badges are unlocked
    if (
      user.unlockedBadges.length + newUnlockedBadges.length ==
      Constants.allBadges
    ) {
      newUnlockedBadges.push({
        user,
        condition: BadgeCondition.allBadgesUnlocked,
      });
    }

    // Save unlocked badges
    return await this.unlockedBadgeRepository.save(newUnlockedBadges);
  }

  private async findOne(id: number): Promise<GamificationConfig> {
    return this.gamificationRepository.findOneBy({ id });
  }

  async createConfig(createGamificationConfigDto: CreateGamificationConfigDto) {
    await this.gamificationRepository.save(createGamificationConfigDto);
  }

  async getConfiguration(): Promise<GamificationConfigResult | null> {
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

  async getLeaderboard(user: User): Promise<LeaderboardResponse> {
    const allUsers = await this.userRepository.find({
      order: {
        points: {
          direction: 'DESC',
        },
      },
    });

    const position = allUsers.findIndex((u) => u.username == user.username);

    return {
      currentPosition: position,
      users: allUsers,
    };
  }

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

  // TODO: Add gamification switcher
}
