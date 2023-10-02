import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SystemService } from './system.service';
import { CreateSystemDto, UpdateSystemDto } from './dto';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { PaginateQueryDto } from '../dto/paginate-query.dto';
import { Request } from 'express';

@UseGuards(JwtGuard)
@ApiTags('system')
@Controller('system')
export class SystemController {
  constructor(private readonly service: SystemService) {}

  @Post('')
  async create(@GetUser('id') userId: number, @Body() dto: CreateSystemDto) {
    return this.service.create(dto, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @GetUser('id') userId: number,
    @Body()
    dto: UpdateSystemDto,
  ) {
    return this.service.update(id, dto, userId);
  }

  @Get()
  findMany(
    @Query()
    params: PaginateQueryDto,
    @Req() req: Request,
  ) {
    return this.service.findManyAndPaginate(params, req.path);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
