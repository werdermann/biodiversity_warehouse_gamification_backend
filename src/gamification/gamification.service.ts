import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GamificationConfig } from './gamification-config.entity';
import { Repository } from 'typeorm';
import { CreateGamificationConfigDto } from './dto/create-gamification-config.dto';

@Injectable()
export class GamificationService {
  constructor(
    @InjectRepository(GamificationConfig)
    private readonly gamificationRepository: Repository<GamificationConfig>,
  ) {}

  async findOne(id: number): Promise<GamificationConfig> {
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
}
