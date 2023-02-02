import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { BadgeCondition } from './domain/models/badge-condition.enum';

@Entity()
export class LockedBadge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: BadgeCondition,
  })
  condition: BadgeCondition;

  @ManyToOne(() => User, (user) => user.lockedBadges)
  user: User;
}
