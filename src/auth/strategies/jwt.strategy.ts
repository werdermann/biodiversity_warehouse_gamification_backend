import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Constants } from '../../common/constants';

/**
 * Used for JWT authentication.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Constants.jwtSecret,
    });
  }

  async validate(payload: any) {
    return {
      id: payload.id,
      username: payload.username,
    };
  }
}
