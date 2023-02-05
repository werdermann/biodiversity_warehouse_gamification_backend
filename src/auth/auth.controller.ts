import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { LoginBody } from './models/login.dto';
import { LoginResponse } from './models/login.response';

/**
 * Exposes the rest api to the mobile application.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Logs the user
   * @param req
   * @param body
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req, @Body() body: LoginBody): Promise<LoginResponse> {
    return this.authService.login(req.user);
  }
}
