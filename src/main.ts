import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  const logger = new Logger('bootsrap')
  app
  
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  const port = process.env.PORT || 3000;

  await app.listen(port);
  logger.log(`App running on port ${port}`);
}
bootstrap();
