import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/models/user.entity';
import { ConfigService } from '@nestjs/config';
import { LoginResponse } from './models/login.response';

/**
 * Manages the business logic of the authentication process.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Checks if the user is existing in the database.
   * @param username
   * @param pass
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsername(username);

    if (user && user.password === pass) {
      // Remove the password from the user object.
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Logs the user into the backend application
   * @param user
   */
  async login(user: User): Promise<LoginResponse> {
    const tokenPayload: object = { ...user };
    const refreshTokenPayload: object = { id: user.id };

    return {
      user,
      accessToken: this.jwtService.sign(tokenPayload, {
        expiresIn: this.configService.get<string>('AUTH_ACCESS_TOKEN_LIFETIME'),
      }),
      refreshToken: this.jwtService.sign(refreshTokenPayload, {
        expiresIn: this.configService.get<string>(
          'AUTH_REFRESH_TOKEN_LIFETIME',
        ),
      }),
    };
  }
}
