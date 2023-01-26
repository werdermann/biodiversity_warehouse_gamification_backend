import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

export class Badge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  isUnlocked: boolean;

  // @ManyToOne(type => User, user => user.lockedBadges)

  // + image: Image
}
