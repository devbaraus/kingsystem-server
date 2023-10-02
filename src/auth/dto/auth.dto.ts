import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
