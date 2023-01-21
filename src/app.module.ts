import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { SighitngController } from './sighitng/sighitng.controller';
import { SightingController } from './sighting/sighting.controller';
import { SightingModule } from './sighting/sighting.module';
import { GamificationModule } from './gamification/gamification.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [SightingModule, GamificationModule, AuthModule, UserModule],
  controllers: [AppController, AuthController, SighitngController, SightingController],
  providers: [AppService, AuthService],
})
export class AppModule {}
