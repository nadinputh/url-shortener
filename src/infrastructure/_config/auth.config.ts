import { registerAs } from '@nestjs/config';

export default (name: string) =>
  registerAs(name, () => ({
    baseUrl: process.env.AUTH_BASE_URL,
    endpoint: process.env.AUTH_ENDPOINT,
  }));
