import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { BadgeCondition } from './domain/models/badge-condition.enum';

// const UNLOCKED_BADGE = 'unlocked_badge';

@Entity()
export class UnlockedBadge {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column({
    type: 'enum',
    enum: BadgeCondition,
  })
  condition: BadgeCondition;

  @ManyToOne(() => User, (user) => user.unlockedBadges)
  user: User;

  @Column({
    default: '',
  })
  date: string;
}
