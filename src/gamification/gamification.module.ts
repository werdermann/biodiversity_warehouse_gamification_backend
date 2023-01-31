import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamificationConfig } from './gamification-config.entity';
import { GamificationService } from './gamification.service';
import { UserModule } from '../user/user.module';
import { GamificationController } from './gamification.controller';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([GamificationConfig])],
  providers: [GamificationService],
  controllers: [GamificationController],
  exports: [GamificationService],
})
export class GamificationModule {}
