import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class SignAuthDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
