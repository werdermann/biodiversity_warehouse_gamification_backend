import { User } from '../../user/models/user.entity';

export class LoginResponse {
  public user: User;
  public accessToken: string;
  public refreshToken: string;
}
