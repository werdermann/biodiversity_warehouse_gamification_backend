import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GamificationConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  leaderboardActive: boolean;

  @Column({ default: false })
  badgesActive: boolean;

  @Column({ default: false })
  onBoardingActive: boolean;
}
