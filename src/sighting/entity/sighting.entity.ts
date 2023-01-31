import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SpeciesEntry } from './species-entry.entity';
import { Photo } from './photo.entity';
import { ReportMethod } from './report-method.enum';

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

  @OneToMany(() => SpeciesEntry, (entry) => entry.sighting)
  speciesEntries: SpeciesEntry[];

  @OneToMany(() => Photo, (photo) => photo.sighting)
  photos: Photo[];

  @Column()
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
