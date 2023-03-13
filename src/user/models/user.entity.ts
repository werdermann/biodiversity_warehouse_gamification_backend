import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UnlockedBadge } from '../../gamification/models/unlocked-badge.entity';
import { LockedBadge } from '../../gamification/models/locked-badge.entity';
import { Sighting } from '../../sighting/models/sighting.entity';

/**
 * Entity that represents the user.
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ select: false })
  password: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: 0 })
  points: number;

  @OneToMany(() => UnlockedBadge, (badge) => badge.user)
  unlockedBadges: UnlockedBadge[];

  @OneToMany(() => LockedBadge, (badge) => badge.user)
  lockedBadges: LockedBadge[];

  @OneToMany(() => Sighting, (sighting) => sighting.user)
  sightings: Sighting[];

  @Column({ default: 0 })
  totalPhotoCount: number;

  @Column({ default: 0 })
  totalCommentCount: number;

  @Column({ default: 0 })
  totalSpeciesEntryCount: number;
}
