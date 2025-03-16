import { RedisClientOptions } from '@keyv/redis';
import { registerAs } from '@nestjs/config';

export default (name: string) => {
  return registerAs(
    name,
    (): RedisClientOptions => ({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/`,
      name: process.env.REDIS_NAME || 'deaplinks',
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD || '',
      clientInfoTag: 'deaplinks',
    }),
  );
};
