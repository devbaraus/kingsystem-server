import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { SystemService } from "./system.service";
import { CreateSystemDto, UpdateSystemDto } from "./dto";
import { JwtGuard } from "../auth/guard";
import { GetUser } from "../auth/decorator";
import { PaginationQueryDto } from "../dto/pagination-query.dto";
import { Request } from "express";
import { PaginationDto } from "../dto";
import { SystemDto } from "./dto/system.dto";

@UseGuards(JwtGuard)
@ApiTags("system")
@ApiUnauthorizedResponse({
  description: "unauthorized",
})
@ApiBadRequestResponse({
  description: "bad request",
})
@Controller("system")
export class SystemController {
  constructor(private readonly service: SystemService) {}

  @ApiOperation({ summary: "Create system" })
  @ApiCreatedResponse({
    description: "created",
    type: SystemDto,
  })
  @ApiConflictResponse({
    description: "conflict",
  })
  @Post("")
  async create(@GetUser("id") userId: number, @Body() dto: CreateSystemDto) {
    return this.service.create(dto, userId);
  }

  @ApiOperation({ summary: "Update system" })
  @ApiOkResponse({
    description: "success",
    type: SystemDto,
  })
  @Put(":id")
  async update(
    @Param("id") id: string,
    @GetUser("id") userId: number,
    @Body()
    dto: UpdateSystemDto,
  ) {
    return this.service.update(id, dto, userId);
  }

  @ApiOperation({ summary: "List and paginate systems" })
  @ApiQuery({
    name: "page",
    description: "Page to be returned",
  })
  @ApiQuery({
    name: "orderBy",
    description: "Order by field",
  })
  @ApiOkResponse({
    description: "success",
    type: PaginationDto,
  })
  @Get()
  findMany(
    @Query()
    query: PaginationQueryDto,
    @Req() req: Request,
  ) {
    return this.service.findManyAndPaginate(query, req.path);
  }

  @ApiOperation({ summary: "Find one system" })
  @ApiNotFoundResponse({
    description: "not found",
  })
  @ApiOkResponse({
    description: "success",
    type: SystemDto,
  })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }
}
