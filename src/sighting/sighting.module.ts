import { Module } from '@nestjs/common';
import { SightingService } from './sighting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sighting } from './entity/sighting.entity';
import { SpeciesEntry } from './entity/species-entry.entity';
import { Photo } from './entity/photo.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { User } from '../user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sighting, SpeciesEntry, Photo, User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60d' },
    }),
  ],
  providers: [SightingService, JwtStrategy],
  exports: [SightingService],
})
export class SightingModule {}
