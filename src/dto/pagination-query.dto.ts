import { IsOptional, IsString, Matches, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  page: number;

  @IsString()
  @IsOptional()
  @Matches(/^(-[a-zA-Z]+|[a-zA-Z]+)$/, {
    message: 'orderBy must be in the format "-field" or "field"',
  })
  orderBy?: string;

  @IsOptional()
  @Type(() => Object)
  @Transform(
    ({ value }) => {
      try {
        return JSON.parse(value);
      } catch (err) {
        throw new BadRequestException('Invalid where JSON format');
      }
    },
    { toClassOnly: true },
  )
  where?: Record<string, unknown>;
}
