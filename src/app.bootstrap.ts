import { INestApplication } from '@nestjs/common';
import { UserService } from './user/user.service';
import { GamificationService } from './gamification/gamification.service';

export async function createBaseData(app: INestApplication) {
  const userService = app.get(UserService);
  const gamificationService = app.get(GamificationService);

  const user = await userService.findOne(1);

  if (!user) {
    await userService.create({
      username: 'admin',
      password: '123',
    });
  }

  const gamificationConfig = await gamificationService.getConfiguration();

  if (!gamificationConfig) {
    await gamificationService.create({
      badgesActive: true,
      leaderboardActive: true,
      onBoardingActive: true,
    });
  }
}
