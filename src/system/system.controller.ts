import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SystemService } from './system.service';
import { CreateSystemDto, UpdateSystemDto } from './dto';
import { Prisma } from '@prisma/client';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';

@UseGuards(JwtGuard)
@ApiTags('system')
@Controller('system')
export class SystemController {
  constructor(private readonly service: SystemService) {}

  @Post('')
  async create(@GetUser('id') userId: number, @Body() dto: CreateSystemDto) {
    return this.service.create(userId, dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @GetUser('id') userId: number,
    @Body()
    dto: UpdateSystemDto,
  ) {
    return this.service.update(id, userId, dto);
  }

  @Get()
  findMany(
    @Param()
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.SystemWhereUniqueInput;
      where?: Prisma.SystemWhereInput;
      orderBy?: Prisma.SystemOrderByWithRelationInput;
    },
  ) {
    const { skip = 0, take = 50, cursor, where, orderBy } = params;
    return this.service.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.service.update(+id, updateUserDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.service.remove(+id);
  // }
}
