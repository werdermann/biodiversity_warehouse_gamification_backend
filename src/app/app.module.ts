import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from '../auth/auth.controller';
import { SightingController } from '../sighting/sighting.controller';
import { SightingModule } from '../sighting/sighting.module';
import { GamificationModule } from '../gamification/gamification.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeORMConfig from 'ormconfig';

@Module({
  imports: [
    SightingModule,
    GamificationModule,
    AuthModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => typeORMConfig(),
    }),
  ],
  controllers: [AppController, AuthController, SightingController],
  providers: [AppService],
})
export class AppModule {}
