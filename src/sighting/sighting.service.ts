import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sighting } from './entity/sighting.entity';
import { CreateSightingDto } from './dto/create-sighting.dto';

@Injectable()
export class SightingService {
  constructor(
    @InjectRepository(Sighting)
    private sightingRepository: Repository<Sighting>,
  ) {}

  async create(
    @Body() createSightingDto: CreateSightingDto,
  ): Promise<Sighting | null> {
    console.log('Create Sighting in Service!');
    try {
      const sighting = await this.sightingRepository.save(createSightingDto);

      return sighting;
    } catch (_) {
      return null;
    }
  }
}
