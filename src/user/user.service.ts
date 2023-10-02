import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany() {
    return 'findMany';
  }

  async findOne() {
    return 'findOne';
  }

  async update(userId: number, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    return {
      ...user,
      passwordHash: undefined,
    };
  }

  async delete(userId: number) {
    try {
      await this.prisma.user.delete({
        where: {
          id: userId,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
}
