import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sighting } from './sighting.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sighting, (sighting) => sighting.photos)
  sighting: Sighting;
}
