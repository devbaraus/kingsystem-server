import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as pactum from "pactum";
import { SignInAuthDto, SignUpAuthDto } from "../src/auth/dto";
import { AppModule } from "../src/app.module";
import { CreateSystemDto, UpdateSystemDto } from "../src/system/dto";
import { PrismaService } from "../src/prisma/prisma.service";
import { System, SystemStatus, User } from "@prisma/client";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const signUpAuthDto: SignUpAuthDto = {
    name: "Mock User",
    email: "mock@mock.com",
    password: "MOCKpass1234)",
  };

  const signInAuthDto: SignInAuthDto = {
    email: signUpAuthDto.email,
    password: signUpAuthDto.password,
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
    pactum.request.setBaseUrl("http://127.0.0.1:3333");
  });

  afterAll(() => {
    app.close();
  });

  describe("Auth", () => {
    describe("Signup", () => {
      it("should throw if email empty", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({
            name: signUpAuthDto.name,
            password: signUpAuthDto.password,
          })
          .expectStatus(400);
      });

      it("should throw if name empty", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({
            email: signUpAuthDto.email,
            password: signUpAuthDto.password,
          })
          .expectStatus(400);
      });

      it("should throw if password empty", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({
            name: signUpAuthDto.name,
            email: signUpAuthDto.email,
          })
          .expectStatus(400);
      });

      it("should throw if no body provided", () => {
        return pactum.spec().post("/auth/signup").expectStatus(400);
      });

      it("should signup", () => {
        return pactum.spec().post("/auth/signup").withBody(signUpAuthDto).expectStatus(201);
      });
    });

    describe("Signin", () => {
      it("should throw if email empty", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody({
            password: signInAuthDto.password,
          })
          .expectStatus(400);
      });

      it("should throw if password empty", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody({
            email: signInAuthDto.email,
          })
          .expectStatus(400);
      });

      it("should throw if no body provided", () => {
        return pactum.spec().post("/auth/signin").expectStatus(400);
      });

      it("should signin", () => {
        return pactum
          .spec()
          .post("/auth/signin")
          .withBody(signInAuthDto)
          .expectStatus(200)
          .stores("userAt", "access_token");
      });
    });

    describe("Get profile", () => {
      it("should throw if no auth", () => {
        return pactum.spec().get("/auth/profile").expectStatus(401);
      });

      it("should get current user", () => {
        return pactum
          .spec()
          .get("/auth/profile")
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(200);
      });
    });
  });

  describe("System", () => {
    describe("Create system", () => {
      const systemDto: CreateSystemDto = {
        acronym: "MOCK",
        description: "Mock description",
        email: "system@mock.com",
        url: "http://mock.com",
      };

      it("should throw if no auth", () => {
        return pactum.spec().post("/system").expectStatus(401);
      });

      it("should throw if no acronym", () => {
        return pactum
          .spec()
          .post("/system")
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .withBody({
            description: systemDto.description,
          })
          .expectStatus(400);
      });

      it("should throw if no description", () => {
        return pactum
          .spec()
          .post("/system")
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .withBody({
            acronym: systemDto.acronym,
          })
          .expectStatus(400);
      });

      it("should throw if no body", () => {
        return pactum
          .spec()
          .post("/system")
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(400);
      });

      it("should create system", () => {
        return pactum
          .spec()
          .post("/system")
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .withBody(systemDto)
          .expectStatus(201)
          .expectBodyContains(systemDto.acronym)
          .expectBodyContains(systemDto.description)
          .expectBodyContains(systemDto.email)
          .expectBodyContains(systemDto.url);
      });
    });

    describe("Get system", () => {
      it("should throw if no auth", async () => {
        const system = await prisma.system.findFirst();

        return pactum
          .spec()
          .get(`/system/${system?.id}`)
          .expectStatus(401);
      });

      it("should throw if not exist", async () => {
        return pactum
          .spec()
          .get(`/system/1234567890`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(404);
      });

      it("should get system", async () => {
        const system = (await prisma.system.findFirst()) as System;

        return pactum
          .spec()
          .get(`/system/${system?.id}`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(200)
          .expectBodyContains(system.id)
          .expectBodyContains(system.status)
          .expectBodyContains(system.acronym)
          .expectBodyContains(system.description)
          .expectBodyContains(system.email)
          .expectBodyContains(system.url);
      });
    });

    describe("List Systems", () => {
      it("should throw if no auth", async () => {
        return pactum.spec().get(`/system`).expectStatus(401);
      });

      it("should throw if no with existing orderBy", async () => {
        return pactum
          .spec()
          .get(`/system/?orderBy=blabla`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(400);
      });

      it("should throw if where not object", async () => {
        return pactum
          .spec()
          .get(`/system/?where=null`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(400);
      });

      it("should list if where is object", async () => {
        return pactum
          .spec()
          .get(`/system/?where={}`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(200)
          .expectBodyContains("data")
          .expectBodyContains("total")
          .expectBodyContains("page")
          .expectBodyContains("pages")
          .expectBodyContains("next")
          .expectBodyContains("previous");
      });

      it("should list if where is valid object", async () => {
        return pactum
          .spec()
          .get(`/system/?where={"id":1}`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(200)
          .expectBodyContains("data")
          .expectBodyContains("total")
          .expectBodyContains("page")
          .expectBodyContains("pages")
          .expectBodyContains("next")
          .expectBodyContains("previous");
      });

      it("should list if where is invalid object", async () => {
        return pactum
          .spec()
          .get(`/system/?where={"id":"blabla"}`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(400);
      });

      it("should throw if page negative", async () => {
        return pactum
          .spec()
          .get(`/system/?page=-1`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(400);
      });

      it("should list systems with page zero", async () => {
        return pactum
          .spec()
          .get(`/system/?page=0`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(200)
          .expectBodyContains("data")
          .expectBodyContains("total")
          .expectBodyContains("page")
          .expectBodyContains("pages")
          .expectBodyContains("next")
          .expectBodyContains("previous");
      });

      it("should list systems with existing orderBy asc", async () => {
        return pactum
          .spec()
          .get(`/system/?orderBy=acronym`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(200)
          .expectBodyContains("data")
          .expectBodyContains("total")
          .expectBodyContains("page")
          .expectBodyContains("pages")
          .expectBodyContains("next")
          .expectBodyContains("previous");
      });

      it("should list systems with existing orderBy desc", async () => {
        return pactum
          .spec()
          .get(`/system/?orderBy=-acronym`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(200)
          .expectBodyContains("data")
          .expectBodyContains("total")
          .expectBodyContains("page")
          .expectBodyContains("pages")
          .expectBodyContains("next")
          .expectBodyContains("previous");
      });

      it("should list systems", async () => {
        return pactum
          .spec()
          .get(`/system/`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(200)
          .expectBodyContains("data")
          .expectBodyContains("total")
          .expectBodyContains("page")
          .expectBodyContains("pages")
          .expectBodyContains("next")
          .expectBodyContains("previous");
      });
    });

    describe("Update system", () => {
      const updateSystemDto: UpdateSystemDto = {
        acronym: "MOCK",
        description: "Mock description",
        updateReason: "Mock update reason",
        status: SystemStatus.CANCELED,
        email: "mock-system@mock.com",
        url: "http://mock.com",
      };

      it("should throw if no auth", async () => {
        const system = await prisma.system.findFirst();

        return pactum
          .spec()
          .put(`/system/${system?.id}`)
          .expectStatus(401);
      });

      it("should throw if no body", async () => {
        const system = await prisma.system.findFirst();

        return pactum
          .spec()
          .put(`/system/${system?.id}`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(400);
      });

      it("should throw if no reason", async () => {
        const system = await prisma.system.findFirst();

        return pactum
          .spec()
          .put(`/system/${system?.id}`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .withBody({
            ...updateSystemDto,
            updateReason: undefined,
          })
          .expectStatus(400);
      });

      it("should throw if no status", async () => {
        const system = await prisma.system.findFirst();

        return pactum
          .spec()
          .put(`/system/${system?.id}`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .withBody({
            ...updateSystemDto,
            status: undefined,
          })
          .expectStatus(400);
      });

      it("should throw if no description", async () => {
        const system = await prisma.system.findFirst();

        return pactum
          .spec()
          .put(`/system/${system?.id}`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .withBody({
            ...updateSystemDto,
            description: undefined,
          })
          .expectStatus(400);
      });

      it("should throw if no acronym", async () => {
        const system = await prisma.system.findFirst();

        return pactum
          .spec()
          .put(`/system/${system?.id}`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .withBody({
            ...updateSystemDto,
            acronym: undefined,
          })
          .expectStatus(400);
      });

      it("should update if no email", async () => {
        const system = await prisma.system.findFirst();

        return pactum
          .spec()
          .put(`/system/${system?.id}`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .withBody({
            ...updateSystemDto,
            email: undefined,
          })
          .expectStatus(200);
      });

      it("should update if no url", async () => {
        const system = await prisma.system.findFirst();

        return pactum
          .spec()
          .put(`/system/${system?.id}`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .withBody({
            ...updateSystemDto,
            url: undefined,
          })
          .expectStatus(200);
      });

      it("should update system", async () => {
        const system = await prisma.system.findFirst();

        return pactum
          .spec()
          .put(`/system/${system?.id}`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .withBody(updateSystemDto)
          .expectStatus(200)
          .expectBodyContains(updateSystemDto.acronym)
          .expectBodyContains(updateSystemDto.description)
          .expectBodyContains(updateSystemDto.updateReason)
          .expectBodyContains(updateSystemDto.status)
          .expectBodyContains(updateSystemDto.email)
          .expectBodyContains(updateSystemDto.url);
      });
    });
  });

  describe("User", () => {
    describe("Get User", () => {
      it("should throw if no auth", async () => {
        const user = await prisma.user.findFirst();

        return pactum
          .spec()
          .get(`/user/${user?.id}`)
          .expectStatus(401);
      });

      it("should throw if not exist", async () => {
        return pactum
          .spec()
          .get(`/user/1234567890`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(404);
      });

      it("should get system", async () => {
        const user = (await prisma.user.findFirst()) as User;

        return pactum
          .spec()
          .get(`/user/${user?.id}`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(200)
          .expectBodyContains(user.id)
          .expectBodyContains(user.name)
          .expectBodyContains(user.email)
          .expectBodyContains(user.createdAt)
          .expectBodyContains(user.updatedAt);
      });
    });

    describe("List Users", () => {
      it("should throw if no auth", async () => {
        return pactum.spec().get(`/user`).expectStatus(401);
      });

      it("should throw if no with existing orderBy", async () => {
        return pactum
          .spec()
          .get(`/user/?orderBy=blabla`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(400);
      });

      it("should throw if where not object", async () => {
        return pactum
          .spec()
          .get(`/user/?where=null`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(400);
      });

      it("should list if where is object", async () => {
        return pactum
          .spec()
          .get(`/user/?where={}`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(200)
          .expectBodyContains("data")
          .expectBodyContains("total")
          .expectBodyContains("page")
          .expectBodyContains("pages")
          .expectBodyContains("next")
          .expectBodyContains("previous");
      });

      it("should list if where is valid object", async () => {
        return pactum
          .spec()
          .get(`/user/?where={"id":1}`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(200)
          .expectBodyContains("data")
          .expectBodyContains("total")
          .expectBodyContains("page")
          .expectBodyContains("pages")
          .expectBodyContains("next")
          .expectBodyContains("previous");
      });

      it("should list if where is invalid object", async () => {
        return pactum
          .spec()
          .get(`/user/?where={"id":"blabla"}`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(400);
      });

      it("should throw if page negative", async () => {
        return pactum
          .spec()
          .get(`/user/?page=-1`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(400);
      });

      it("should list systems with page zero", async () => {
        return pactum
          .spec()
          .get(`/user/?page=0`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(200)
          .expectBodyContains("data")
          .expectBodyContains("total")
          .expectBodyContains("page")
          .expectBodyContains("pages")
          .expectBodyContains("next")
          .expectBodyContains("previous");
      });

      it("should list systems with existing orderBy asc", async () => {
        return pactum
          .spec()
          .get(`/user/?orderBy=email`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(200)
          .expectBodyContains("data")
          .expectBodyContains("total")
          .expectBodyContains("page")
          .expectBodyContains("pages")
          .expectBodyContains("next")
          .expectBodyContains("previous");
      });

      it("should list systems with existing orderBy desc", async () => {
        return pactum
          .spec()
          .get(`/system/?orderBy=-email`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(200)
          .expectBodyContains("data")
          .expectBodyContains("total")
          .expectBodyContains("page")
          .expectBodyContains("pages")
          .expectBodyContains("next")
          .expectBodyContains("previous");
      });

      it("should list systems", async () => {
        return pactum
          .spec()
          .get(`/user/`)
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(200)
          .expectBodyContains("data")
          .expectBodyContains("total")
          .expectBodyContains("page")
          .expectBodyContains("pages")
          .expectBodyContains("next")
          .expectBodyContains("previous");
      });
    });
  });
});
