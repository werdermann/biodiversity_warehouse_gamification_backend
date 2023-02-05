import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamificationConfig } from './models/gamification-config.entity';
import { GamificationService } from './gamification.service';
import { UserModule } from '../user/user.module';
import { GamificationController } from './gamification.controller';
import { User } from '../user/models/user.entity';
import { LockedBadge } from './models/locked-badge.entity';
import { UnlockedBadge } from './models/unlocked-badge.entity';

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
