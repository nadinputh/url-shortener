import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enabled Helmet
  app.use(helmet());

  const config = app.get(ConfigService);
  app.connectMicroservice(config.get('transport'));

  // Enabled and Config CORS
  app.enableCors({
    credentials: true,
    origin: '*',
    methods: ['GET', 'POST', 'HEAD'],
    preflightContinue: false,
  });

  // Enabled Response Compression
  app.use(compression());

  app.useGlobalPipes(new ValidationPipe());
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
