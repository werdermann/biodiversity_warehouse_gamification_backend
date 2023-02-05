import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/models/user.entity';
import { BadgeCondition } from './badge-condition.enum';

/**
 * Entity that represents a badge that can be unlocked by the user
 */
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
