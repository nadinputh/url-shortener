import { Module } from '@nestjs/common';
import { DomainModule } from 'src/domain/domain.module';
import { AppController } from './controller/app.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { RequestIdInterceptor } from './interceptor/request-id.interceptor';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from '@ababank/auth';

@Module({
  imports: [
    AuthModule.configAsync({
      imports: [],
      useFactory: (config) => config.get('auth'),
      inject: [ConfigService],
    }),
    DomainModule,
    ClientsModule.registerAsync([
      {
        name: 'DEEPLINK_SERVICE',
        useFactory: async (config: ConfigService) => config.get('transport'),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestIdInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  controllers: [AppController],
})
export class ApplicationModule {}
