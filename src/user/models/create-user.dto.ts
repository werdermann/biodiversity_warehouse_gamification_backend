import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * Used by the application to initialize test users.
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  points: number;
}
