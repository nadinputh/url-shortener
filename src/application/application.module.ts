import { Module } from '@nestjs/common';
import { DomainModule } from 'src/domain/domain.module';
import { AppController } from './controller/app.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Module({
  imports: [DomainModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  controllers: [AppController],
})
export class ApplicationModule {}
