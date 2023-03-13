import { INestApplication } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { GamificationService } from '../gamification/gamification.service';
import { CreateUserDto } from '../user/models/create-user.dto';

export async function createBaseData(app: INestApplication) {
  const userService = app.get(UserService);
  const gamificationService = app.get(GamificationService);

  const users: CreateUserDto[] = [
    {
      username: 'Testnutzer',
      password: '123',
      points: 0,
    },
    {
      username: 'HobbyEntdecker',
      password: '123',
      points: 40,
    },
    {
      username: 'Forscher123',
      password: '123',
      points: 80,
    },
    {
      username: 'deLamarck',
      password: '123',
      points: 100,
    },
    {
      username: 'Einstein',
      password: '123',
      points: 110,
    },
    {
      username: 'Mendel',
      password: '123',
      points: 200,
    },
    {
      username: 'CharlesDarwin',
      password: '123',
      points: 230,
    },
    {
      username: 'Bioexperte97',
      password: '123',
      points: 265,
    },
    {
      username: 'DerFlamingo',
      password: '123',
      points: 280,
    },
  ];

  // Create users in database
  for (const dto of users) {
    const user = await userService.findByUsername(dto.username);

    if (!user) {
      const userObject = await userService.create(dto);

      await gamificationService.createStarterBadges(userObject);
    }
  }

  const gamificationConfig = await gamificationService.getConfiguration();

  if (!gamificationConfig) {
    await gamificationService.createConfig({
      badgesActive: true,
      leaderboardActive: true,
      onBoardingActive: true,
    });
  }
}
