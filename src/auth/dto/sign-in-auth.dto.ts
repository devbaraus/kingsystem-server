import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class SignInAuthDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
