import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['asvafasd'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      //Somente as infos que precisar nos controllers
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
