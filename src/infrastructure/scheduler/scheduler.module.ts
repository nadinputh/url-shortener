import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot({
      cronJobs: true,
      intervals: false,
      timeouts: false,
    }),
  ],
})
export class SchedulerModule {}
