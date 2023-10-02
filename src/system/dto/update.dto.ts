import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { SystemStatus } from '@prisma/client';

export class UpdateSystemDto {
  // @IsString()
  // @IsNotEmpty()
  // @MaxLength(10)
  // acronym: string;
  //
  // @IsString()
  // @IsNotEmpty()
  // @MaxLength(100)
  // description: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(50)
  url?: string;

  @IsString()
  @MaxLength(500)
  reason: string;

  @IsEnum(SystemStatus)
  status: SystemStatus;
}
