import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSystemDto, UpdateSystemDto } from './dto';
import { Prisma, System, SystemStatus } from '@prisma/client';
import { PaginateQueryDto } from '../dto/paginate-query.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SystemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateSystemDto, currentUserId: number): Promise<System> {
    try {
      return await this.prisma.system.create({
        data: {
          acronym: dto.acronym,
          description: dto.description,
          email: dto.email,
          url: dto.url,
          status: SystemStatus.ACTIVE,
          createdById: currentUserId,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ConflictException('System already exists');
        }
      }

      throw new BadRequestException('Something went wrong');
    }
  }

  findManyAndPaginate(query: PaginateQueryDto, pathname: string) {
    try {
      return this.prisma.paginate<System>(this.prisma.system, query, pathname);
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

  async update(id: string, dto: UpdateSystemDto, currentUserId: number) {
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
          updatedById: currentUserId,
        },
      });

      return system;
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Something went wrong');
    }
  }
}
