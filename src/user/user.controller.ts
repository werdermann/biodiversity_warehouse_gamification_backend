import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserService } from './user.service';
import { User } from './models/user.entity';

/**
 * Exposes the rest api to the mobile application.
 */
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getUser(@Request() req): Promise<User> {
    const username = req.user.username;

    return await this.userService.findByUsername(username);
  }
}
