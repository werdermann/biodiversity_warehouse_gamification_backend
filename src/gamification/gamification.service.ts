import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GamificationConfig } from './gamification-config.entity';
import { Repository } from 'typeorm';
import { CreateGamificationConfigDto } from './dto/create-gamification-config.dto';
import { GamificationResult } from './dto/gamification-result.dto';
import { CreateSightingDto } from '../sighting/dto/create-sighting.dto';
import { Badge } from './badge.entity';
import { GamificationConfigResult } from './dto/gamification-config-result.dto';

@Injectable()
export class GamificationService {
  constructor(
    @InjectRepository(GamificationConfig)
    private readonly gamificationRepository: Repository<GamificationConfig> /*
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
     
     */,
  ) {}

  async calculateResult(
    createSightingDto: CreateSightingDto,
  ): Promise<GamificationResult> {
    const points = await this.calculatePoints(createSightingDto);

    const newLeaderboardPosition = await this.checkLeaderboardPosition(3, 4);

    const badges = await this.checkBadgeConditions(createSightingDto);

    const gamificationResult = new GamificationResult();

    return gamificationResult;
  }

  private async calculatePoints(
    createSightingDto: CreateSightingDto,
  ): Promise<number> {
    // TODO: Calculate points

    return 123;
  }

  private async checkLeaderboardPosition(
    oldPoints: number,
    newPoints: number,
  ): Promise<number> {
    return 4;
  }

  private async checkBadgeConditions(
    createSightingDto: CreateSightingDto,
  ): Promise<Badge[]> {
    // TODO: Check badge conditions

    return [];
  }

  private async findOne(id: number): Promise<GamificationConfig> {
    return this.gamificationRepository.findOneBy({ id });
  }

  async create(
    @Body() createGamificationConfigDto: CreateGamificationConfigDto,
  ) {
    const config = new GamificationConfig();
    config.onBoardingActive = createGamificationConfigDto.onBoardingActive;
    config.leaderboardActive = createGamificationConfigDto.leaderboardActive;
    config.badgesActive = createGamificationConfigDto.badgesActive;

    const result = await this.gamificationRepository.save(config);
  }

  async getConfiguration(): Promise<GamificationConfigResult> {
    const config = await this.findOne(1);

    // Remove id
    const { id, ...result } = config;

    return result;
  }

  // TODO: Add gamification switcher
}
