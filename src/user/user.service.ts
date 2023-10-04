import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import { PaginationQueryDto } from "../dto";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findManyAndPaginate(query: PaginationQueryDto, pathname: string) {
    try {
      return this.prisma.paginate<User>(this.prisma.user, query, pathname);
    } catch (err) {
      throw new BadRequestException("Something went wrong");
    }
  }

  async findOne(id: string) {
    const user: User | null = await this.prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      throw new NotFoundException("System not found");
    }

    return user;
  }
}
