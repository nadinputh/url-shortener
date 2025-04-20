import { registerAs } from '@nestjs/config';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { resolve } from 'path';

export default (name: string) =>
  registerAs(name, (): GrpcOptions & Partial<{ enabled: boolean }> => ({
    enabled: process.env.GRPC_ENABLED === 'true',
    transport: Transport.GRPC,
    options: {
      package: 'deeplink',
      url: `0.0.0.0:${process.env.PORT || 3000}`,
      protoPath: resolve('src/proto/deeplink.proto'),
    },
  }));
