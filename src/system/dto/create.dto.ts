import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateSystemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  acronym: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  description: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(50)
  url?: string;
}
