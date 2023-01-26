import { User } from '../../user/user.entity';

class LoginResultDto {
  token: string;
  refreshToken: string;
  user: User;
}
