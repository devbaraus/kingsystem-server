import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as morgan from "morgan";
import * as Sentry from "@sentry/node";
import { SentryFilter } from "./filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  Sentry.init({
    dsn: process.env.NODE_ENV === "production" ? process.env.SENTRY_DSN || "" : undefined,
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });

  const config = new DocumentBuilder()
    .setTitle("KingSystem API")
    .setDescription("A KingSystem API to control your system")
    .setVersion("v1")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("", app, document);

  app.enableCors();
  app.use(morgan("tiny"));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new SentryFilter(httpAdapter));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(process.env.APP_PORT || 3000);
}

bootstrap();
