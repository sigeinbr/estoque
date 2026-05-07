import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '20mb' }));

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
