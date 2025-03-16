import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './database.config';
import transportConfig from './transport.config';
import redisConfig from './redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig('database'),
        transportConfig('transport'),
        redisConfig('redis'),
      ],
    }),
  ],
  providers: [],
  exports: [],
})
export class ConfigsModule {}
