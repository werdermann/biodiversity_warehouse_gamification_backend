import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamificationConfig } from './gamification-config.entity';
import { GamificationService } from './gamification.service';

@Module({
  imports: [TypeOrmModule.forFeature([GamificationConfig])],
  providers: [GamificationService],
  exports: [GamificationService],
})
export class GamificationModule {}
