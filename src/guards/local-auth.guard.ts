import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Short form for using the local authentication guard.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
