import { Module } from '@nestjs/common';
import { SightingService } from './sighting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sighting } from './models/sighting.entity';
import { SpeciesEntry } from './models/species-entry.entity';
import { Photo } from './models/photo.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { User } from '../user/models/user.entity';
import { Constants } from '../common/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sighting, SpeciesEntry, Photo, User]),
    JwtModule.register({
      secret: Constants.jwtSecret,
      signOptions: { expiresIn: '60d' },
    }),
  ],
  providers: [SightingService, JwtStrategy],
  exports: [SightingService],
})
export class SightingModule {}
