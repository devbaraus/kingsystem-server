import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto';
import { PaginateQueryDto } from '../dto/paginate-query.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findManyAndPaginate(query: PaginateQueryDto, pathname: string) {
    try {
      const data = await this.prisma.paginate<User>(
        this.prisma.user,
        query,
        pathname,
      );

      const results = data?.results?.map((user) => {
        return {
          ...user,
          passwordHash: undefined,
        };
      });

      return {
        ...data,
        results,
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Something went wrong');
    }
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
