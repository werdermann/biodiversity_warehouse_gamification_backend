import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sighting } from './models/sighting.entity';
import { CreateSightingDto } from './models/create-sighting.dto';
import { Photo } from './models/photo.entity';
import { User } from '../user/models/user.entity';
import { SpeciesEntry } from './models/species-entry.entity';

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
    @InjectRepository(SpeciesEntry)
    private speciesEntryRepository: Repository<SpeciesEntry>,
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

      /// Store the sighting instance
      const sighting = await this.sightingRepository.save({
        user,
        ...createSightingDto,
      });

      // Store the sightings
      sighting.speciesEntries = await Promise.all(
        createSightingDto.speciesEntries.map(async (entry) => {
          user.totalSpeciesEntryCount++;

          if (entry.comment) {
            user.totalCommentCount++;
          }

          return await this.speciesEntryRepository.save({
            sighting: sighting,
            comment: entry.comment,
            count: entry.count,
            species: entry.species,
            evidenceStatus: entry.evidenceStatus,
          });
        }),
      );

      if (sighting.locationComment) {
        user.totalCommentCount++;
      }

      if (sighting.detailsComment) {
        user.totalCommentCount++;
      }

      // Store the photos in the sighting response
      sighting.photos = await Promise.all(
        photos.map(async (photo) => {
          user.totalPhotoCount++;

          return await this.photoRepository.save({
            sighting: sighting,
            data: photo,
          });
        }),
      );

      user.sightings.push(sighting);

      // Update user object
      await this.userRepository.save(user);

      return sighting;
    } catch (_) {
      return null;
    }
  }
}
