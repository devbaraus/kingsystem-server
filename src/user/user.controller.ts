import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { UserDto } from './dto';

@UseGuards(JwtGuard)
@ApiTags('user')
@ApiUnauthorizedResponse({
  description: 'unauthorized',
})
@ApiBadRequestResponse({
  description: 'bad request',
})
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponse({
    description: 'success',
    type: UserDto,
  })
  @Get('me')
  async me(@GetUser() user: User) {
    return user;
  }
}
