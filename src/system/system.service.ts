import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSystemDto, UpdateSystemDto } from './dto';
import { Prisma, System, SystemStatus } from '@prisma/client';

@Injectable()
export class SystemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateSystemDto): Promise<System> {
    try {
      return await this.prisma.system.create({
        data: {
          acronym: dto.acronym,
          description: dto.description,
          email: dto.email,
          url: dto.url,
          status: SystemStatus.ACTIVE,
          createdById: userId,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('System already exists');
        }
      }

      throw new BadRequestException('Something went wrong');
    }
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SystemWhereUniqueInput;
    where?: Prisma.SystemWhereInput;
    orderBy?: Prisma.SystemOrderByWithRelationInput;
  }) {
    try {
      const systems: System[] = await this.prisma.system.findMany(params);
      return systems;
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Something went wrong');
    }
  }

  async findOne(id: string) {
    const system: System | null = await this.prisma.system.findUnique({
      where: { id: parseInt(id) },
    });

    if (!system) {
      throw new NotFoundException('System not found');
    }

    return system;
  }

  async update(id: string, userId: number, dto: UpdateSystemDto) {
    try {
      const system = await this.prisma.system.update({
        where: {
          id: parseInt(id),
        },
        data: {
          email: dto.email,
          url: dto.url,
          updateReason: dto.reason,
          status: dto.status,
          updatedById: userId,
        },
      });

      return system;
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Something went wrong');
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.system.delete({
        where: {
          id: parseInt(id),
        },
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Something went wrong');
    }
  }
}
