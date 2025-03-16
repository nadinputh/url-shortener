import { Module } from '@nestjs/common';
import { ConfigsModule } from './_config/configs.module';
import { CacheModule } from './cache/cache.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { IoModule } from './io/io.module';

@Module({
  imports: [SchedulerModule, ConfigsModule, CacheModule, IoModule],
  providers: [],
  exports: [IoModule, CacheModule],
})
export class InfrastructureModule {}
