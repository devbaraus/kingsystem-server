import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength } from "class-validator";

export class SignUpAuthDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
