import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Deeplink } from '../io/entity/deeplink.entity';

export default (name: string) =>
  registerAs(
    name,
    (): TypeOrmModuleOptions => ({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      database: process.env.DB_DATABASE || 'test',
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      logging: process.env.DB_LOGGING === 'true' ? true : false,
      cache: process.env.DB_CACHE === 'true',
      useUTC: true,
      entities: [Deeplink],
      synchronize: process.env.DB_SYNCHRONIZE === 'true' ? true : false,
    }),
  );
