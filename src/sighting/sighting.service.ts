import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sighting } from './models/sighting.entity';
import { CreateSightingDto } from './models/create-sighting.dto';
import { Photo } from './models/photo.entity';
import { User } from '../user/models/user.entity';

/**
 * Business logic for reporting a sighting.
 */
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

  /**
   * Creates a new sighting.
   * @param userId
   * @param createSightingDto
   * @param photos
   */
  async create(
    userId: number,
    createSightingDto: CreateSightingDto,
    photos: string[],
  ): Promise<Sighting | null> {
    try {
      // Find the current user
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['unlockedBadges', 'lockedBadges', 'sightings'],
      });

      /// Create an updated object that contains the user object
      const sightingBody = { ...createSightingDto, user };

      /// Store the sighting instance
      const sighting = await this.sightingRepository.save(sightingBody);

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
