import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sighting } from './sighting.entity';
import { EvidenceStatus } from './evidence-status.enum';
import { Species } from './species.enum';

/**
 * The species entry is an entry that contains the species, the current state of the animal,
 * the amount of animals and a comment.
 */
@Entity()
export class SpeciesEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sighting, (sighting) => sighting.speciesEntries)
  sighting: Sighting;

  @Column({ default: '' })
  comment: string;

  @Column({})
  count: number;

  @Column({
    type: 'enum',
    enum: Species,
    default: Species.notSpecified,
  })
  species: Species;

  @Column({
    type: 'enum',
    enum: EvidenceStatus,
    default: EvidenceStatus.notSpecified,
  })
  evidenceStatus: EvidenceStatus;
}
