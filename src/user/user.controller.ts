import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update.dto';

@UseGuards(JwtGuard)
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('me')
  async me(@GetUser() user: User) {
    return user;
  }

  @Patch()
  update(@GetUser('id') userId: number, @Body() dto: UpdateUserDto) {
    return this.service.update(userId, dto);
  }
}
