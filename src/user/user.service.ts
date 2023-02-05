import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './models/create-user.dto';

/**
 * Business logic that manages the user domain.
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.username = createUserDto.username;
    user.password = createUserDto.password;

    return await this.userRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.lockedBadges', 'lockedBadges')
      .leftJoinAndSelect('user.unlockedBadges', 'unlockedBadges')
      .addSelect('user.password')
      .where(`user.username = :username`, { username })
      .getOne();
  }
}
