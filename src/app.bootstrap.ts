import { INestApplication } from '@nestjs/common';
import { UserService } from './user/user.service';
import { GamificationService } from './gamification/domain/gamification.service';

export async function createBaseData(app: INestApplication) {
  const userService = app.get(UserService);
  const gamificationService = app.get(GamificationService);

  const admin = await userService.findByUsername('admin');

  if (!admin) {
    const adminUser = await userService.create({
      username: 'admin',
      password: '123',
    });

    await gamificationService.createStarterBadges(adminUser);
  }

  const testUser1 = await userService.findByUsername('testUser1');

  if (!testUser1) {
    const test1 = await userService.create({
      username: 'testUser1',
      password: '123',
    });

    await gamificationService.createStarterBadges(test1);
  }

  const testUser2 = await userService.findByUsername('testUser2');

  if (!testUser2) {
    const test2 = await userService.create({
      username: 'testUser2',
      password: '123',
    });

    await gamificationService.createStarterBadges(test2);
  }

  const testUser3 = await userService.findByUsername('testUser3');

  if (!testUser3) {
    const test3 = await userService.create({
      username: 'testUser3',
      password: '123',
    });

    await gamificationService.createStarterBadges(test3);
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
