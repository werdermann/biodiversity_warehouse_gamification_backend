import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SpeciesEntry } from './species-entry.entity';
import { Photo } from './photo.entity';
import { ReportMethod } from './report-method.enum';
import { User } from '../../user/models/user.entity';

/**
 * Entity that represents the sighting.
 */
@Entity()
export class Sighting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column({ default: '' })
  locationComment: string;

  @OneToMany(() => SpeciesEntry, (entry) => entry.sighting, { eager: true })
  speciesEntries: SpeciesEntry[];

  @OneToMany(() => Photo, (photo) => photo.sighting)
  photos: Photo[];

  @ManyToOne(() => User, (user) => user.sightings)
  user: User;

  @Column({ default: '' })
  date: string;

  @Column({
    type: 'enum',
    enum: ReportMethod,
    default: ReportMethod.notSpecified,
  })
  reportMethod: ReportMethod;

  @Column({ default: '' })
  detailsComment: string;
}
