import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sighting } from './entity/sighting.entity';
import { CreateSightingDto } from './dto/create-sighting.dto';
import { Photo } from './entity/photo.entity';
import { User } from '../user/user.entity';

@Injectable()
export class SightingService {
  constructor(
    @InjectRepository(Sighting)
    private sightingRepository: Repository<Sighting>,
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    userId: number,
    createSightingDto: CreateSightingDto,
    photos: string[],
  ): Promise<Sighting | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['unlockedBadges', 'lockedBadges', 'sightings'],
      });

      const createSighting = {
        ...createSightingDto,
        user,
      };

      console.log('CREATE SIGHTING');

      console.log(createSighting);

      const sighting = await this.sightingRepository.save(createSighting);

      // Store the photos in the sighting response
      sighting.photos = await Promise.all(
        photos.map(async (photo) =>
          this.photoRepository.save({
            sighting: sighting,
            data: photo,
          }),
        ),
      );

      return sighting;
    } catch (_) {
      return null;
    }
  }
}
