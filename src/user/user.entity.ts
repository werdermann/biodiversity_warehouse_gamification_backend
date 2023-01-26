import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { gamificationConstants } from '../gamification/constants';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: 0 })
  points: number;

  /*
  @OneToMany((type) => Badge, (badge) => badge.user)
  unlockedBadges: Badge[];

  @Column({ default: gamificationConstants.lockedStarterBadges })
  lockedBadges: Badge[];

   */

  @Column({ default: null })
  leaderboardPosition: number | null;
}
