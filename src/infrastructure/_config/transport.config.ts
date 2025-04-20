import { registerAs } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

export default (config: string) =>
  registerAs(config, (): RmqOptions & Partial<{ enabled: boolean }> => ({
    enabled: process.env.RABBIT_ENABLED === 'true',
    transport: Transport.RMQ,
    options: {
      urls: [
        {
          protocol: 'amqp',
          hostname: process.env.RABBIT_HOST,
          port: parseInt(process.env.RABBIT_PORT ?? '5672', 10),
          username: process.env.RABBIT_USER,
          password: process.env.RABBIT_PASSWORD,
        },
      ],
      consumerTag: 'deeplink-service',
    },
  }));
