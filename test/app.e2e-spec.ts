import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { AppModule } from '../src/app.module';
import { UpdateUserDto } from '../src/user/dto';
import { CreateSystemDto, UpdateSystemDto } from '../src/system/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { SystemStatus } from '@prisma/client';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const dto: AuthDto = {
    email: 'mock@mock.com',
    password: 'MOCKpass1234)',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://127.0.0.1:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/user/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Update user', () => {
      it('should update user', () => {
        const dto: UpdateUserDto = {
          name: 'Mock Name',
          email: 'mock@mock.com',
        };
        return pactum
          .spec()
          .patch('/user')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.name)
          .expectBodyContains(dto.email);
      });
    });
  });

  describe('System', () => {
    describe('Create system', () => {
      it('should create system', () => {
        const dto: CreateSystemDto = {
          acronym: 'MOCK',
          description: 'Mock description',
        };

        return pactum
          .spec()
          .post('/system')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .expectBodyContains(dto.acronym)
          .expectBodyContains(dto.description);
      });
    });

    describe('Update system', () => {
      it('should update system', async () => {
        const system = await prisma.system.findUnique({
          where: {
            acronym: 'MOCK',
          },
        });

        const dto: UpdateSystemDto = {
          reason: 'Mock reason',
          status: SystemStatus.CANCELED,
          email: 'mock-system@mock.com',
          url: 'http://mock.com',
        };

        return pactum
          .spec()
          .patch(`/system/${system?.id}`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.reason)
          .expectBodyContains(dto.status)
          .expectBodyContains(dto.email)
          .expectBodyContains(dto.url);
      });
    });
  });
});
