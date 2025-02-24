import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConnectDb } from './lib/db/dbConfig';
import { ValidationException } from './common/exceptions/validation.exception';

import { Logger, ValidationPipe } from '@nestjs/common';

const logger = new Logger('MAIN');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Project Ecommerce API')
    .setDescription('The Project Ecommerce API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Use global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: errors => {
        const messages = errors.reduce(
          (acc, err) => {
            acc[err.property] = Object.values(err.constraints || {}).join(', ');
            return acc;
          },
          {} as Record<string, string>,
        );

        return new ValidationException(messages);
      },
    }),
  );

  ConnectDb()
    .then(async () => {
      await app.listen(process.env.PORT ?? 3000);
      logger.log(
        `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
      );
    })
    .catch((error: Error) => {
      logger.error('Error connecting to the database', error);
    });
}

bootstrap();
