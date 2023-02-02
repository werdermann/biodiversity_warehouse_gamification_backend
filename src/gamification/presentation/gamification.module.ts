import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamificationConfig } from '../gamification-config.entity';
import { GamificationService } from '../domain/gamification.service';
import { UserModule } from '../../user/user.module';
import { GamificationController } from './gamification.controller';
import { User } from '../../user/user.entity';
import { LockedBadge } from '../locked-badge.entity';
import { UnlockedBadge } from '../unlocked-badge.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      GamificationConfig,
      User,
      LockedBadge,
      UnlockedBadge,
    ]),
  ],
  providers: [GamificationService],
  controllers: [GamificationController],
  exports: [GamificationService],
})
export class GamificationModule {}
