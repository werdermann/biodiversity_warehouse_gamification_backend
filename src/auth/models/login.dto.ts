import { IsNotEmpty, IsString } from 'class-validator';

export class LoginBody {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
