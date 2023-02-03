import { Injectable } from '@nestjs/common';
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
  public users: LeaderboardUserResponse[];
}

export class GamificationResultUserResponse {
  public username: string;
  public points: number;
  public unlockedBadges: UnlockedBadgeResponse[];
  public lockedBadges: LockedBadgeResponse[];
}

export class LeaderboardUserResponse {
  public username: string;
  public points: number;
}

export class PointResponse {
  public gainedPoints: number;
  public commentsCount: number;
}

export class UnlockedBadgeResponse {
  public condition: BadgeCondition;
  public date: string;
}

export class LockedBadgeResponse {
  public condition: BadgeCondition;
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

  private async checkBadgeConditions(
    user: User,
  ): Promise<UnlockedBadgeResponse[]> {
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

    console.log('UNLOCKED');
    console.log(newUnlockedBadges);

    const result = await this.unlockedBadgeRepository.save(newUnlockedBadges);

    const entries = result.map((entry) => {
      entry.user = undefined;
      // const { user, ...updatedEntry } = entry;
      return entry;
    });

    return entries;
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
