import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { use } from 'passport';
import { ConfigService } from '@nestjs/config';

export class AuthResponse {
  public user: User;
  public accessToken: string;
  public refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsername(username);

    if (user && user.password === pass) {
      // Remove the password from the user object.
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<AuthResponse> {
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

    /*
    const payload = { username: user.username, sub: user.userId };

    return {
      accessToken: this.jwtService.sign(payload),
      user: user,
    };

     */
  }
}
