import { Module } from '@nestjs/common';
import { SightingService } from './sighting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sighting } from './entity/sighting.entity';
import { SpeciesEntry } from './entity/species-entry.entity';
import { Photo } from './entity/photo.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sighting, SpeciesEntry, Photo])],
  providers: [SightingService],
  exports: [SightingService],
})
export class SightingModule {}
