import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signIn(dto: AuthDto) {
    const user: User | null = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const valid = await argon.verify(user.passwordHash, dto.password);

    if (!valid) {
      throw new UnauthorizedException();
    }

    return this.signToken(user);
  }

  async signUp(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user: User = await this.prisma.user.create({
        data: {
          email: dto.email,
          passwordHash: hash,
        },
      });

      return this.signToken(user);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ConflictException('Credentials taken');
        }
      }

      throw new BadRequestException('Something went wrong');
    }
  }

  async signToken(user: User) {
    const token = this.jwt.sign(
      {
        sub: user.id,
        email: user.email,
      },
      {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_EXPIRES_IN'),
      },
    );

    return {
      user: {
        ...user,
        passwordHash: undefined,
      },
      access_token: token,
    };
  }
}
