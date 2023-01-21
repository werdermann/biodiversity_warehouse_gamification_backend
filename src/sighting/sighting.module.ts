import { Module } from '@nestjs/common';
import { SightingService } from './sighting.service';

@Module({
  providers: [SightingService]
})
export class SightingModule {}
