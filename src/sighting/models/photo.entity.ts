import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sighting } from './sighting.entity';

/**
 * Entity that represents an image of the reported species.
 */
@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sighting, (sighting) => sighting.photos)
  sighting: Sighting;

  @Column({
    type: 'mediumblob',
  })
  data: string;
}
