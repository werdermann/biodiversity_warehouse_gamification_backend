import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .getMany();
  }

  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.username = createUserDto.username;
    user.password = createUserDto.password;

    const result = await this.userRepository.save(user);

    return result;
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
