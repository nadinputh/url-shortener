import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  /**
   * Connect to Pub/Sub Microservice
   */
  if (config.get<boolean>('transport.enabled')) {
    app.connectMicroservice(config.get('transport'));
  }

  /**
   * Connect to GRPC Microservice
   */
  if (config.get<boolean>('grpc.enabled')) {
    app.connectMicroservice(config.get('grpc'));
  }

  // Enabled and Config CORS
  app.enableCors({
    credentials: true,
    origin: '*',
    methods: ['GET', 'POST', 'HEAD'],
    preflightContinue: false,
  });

  // Enabled Helmet
  app.use(helmet());

  // Enabled Response Compression
  app.use(compression());

  app.useGlobalPipes(new ValidationPipe());
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
