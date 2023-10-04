import { Controller, Get, Param, Query, Req, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { UserService } from "./user.service";
import { JwtGuard } from "../auth/guard";
import { Request } from "express";
import { PaginationDto, PaginationQueryDto } from "../dto";
import { UserDto } from "./dto";

@UseGuards(JwtGuard)
@ApiTags("user")
@ApiUnauthorizedResponse({
  description: "unauthorized",
})
@ApiBadRequestResponse({
  description: "bad request",
})
@Controller("user")
export class UserController {
  constructor(private readonly service: UserService) {}

  @ApiOperation({ summary: "List and paginate users" })
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

  @ApiOperation({ summary: "Find one user" })
  @ApiNotFoundResponse({
    description: "not found",
  })
  @ApiOkResponse({
    description: "success",
    type: UserDto,
  })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }
}
