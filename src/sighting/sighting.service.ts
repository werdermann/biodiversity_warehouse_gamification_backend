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
  ) // TODO: Create photo repository here
  {}

  async create(
    createSightingDto: CreateSightingDto,
    photos: string[],
  ): Promise<Sighting | null> {
    try {
      const sightingBody = { ...createSightingDto, photos };

      const sighting = await this.sightingRepository.save(sightingBody);

      return sighting;
    } catch (_) {
      return null;
    }
  }
}
