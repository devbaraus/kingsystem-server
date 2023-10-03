import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, SignAuthDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up user' })
  @ApiCreatedResponse({
    description: 'created',
    type: AuthDto,
  })
  @ApiConflictResponse({
    description: 'conflict',
  })
  @ApiBadRequestResponse({
    description: 'bad request',
  })
  @Post('signup')
  async signUp(@Body() body: SignAuthDto) {
    return this.authService.signUp(body);
  }

  @ApiOperation({ summary: 'Sign in user' })
  @ApiOkResponse({
    description: 'success',
    type: AuthDto,
  })
  @ApiForbiddenResponse({
    description: 'forbidden',
  })
  @ApiBadRequestResponse({
    description: 'bad request',
  })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() body: SignAuthDto) {
    return this.authService.signIn(body);
  }
}
