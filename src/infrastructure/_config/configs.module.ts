import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './database.config';
import transportConfig from './transport.config';
import redisConfig from './redis.config';
import authConfig from './auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig('database'),
        transportConfig('transport'),
        redisConfig('redis'),
        authConfig('auth'),
      ],
    }),
  ],
  providers: [],
  exports: [],
})
export class ConfigsModule {}
