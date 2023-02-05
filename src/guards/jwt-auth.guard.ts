import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Short form for using the jwt authentication guard.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
