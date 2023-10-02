import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update.dto';
import { PaginateQueryDto } from '../dto/paginate-query.dto';
import { Request } from 'express';

@UseGuards(JwtGuard)
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('me')
  async me(@GetUser() user: User) {
    return user;
  }

  @Get()
  findMany(
    @Query()
    params: PaginateQueryDto,
    @Req() req: Request,
  ) {
    return this.service.findManyAndPaginate(params, req.path);
  }

  @Patch()
  update(@GetUser('id') userId: number, @Body() dto: UpdateUserDto) {
    return this.service.update(userId, dto);
  }
}
