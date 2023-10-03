import { System, SystemStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class SystemDto implements System {
  acronym: string;
  createdAt: Date;
  createdById: number | null;
  description: string;
  email: string | null;
  id: number;

  @ApiProperty({ type: 'enum', enum: SystemStatus })
  status: SystemStatus;
  updateReason: string | null;
  updatedAt: Date;
  updatedById: number | null;
  url: string | null;
}
