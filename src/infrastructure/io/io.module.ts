import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DeeplinkService } from './repository/deeplink.service';

const providers = [
  {
    provide: 'DEEPLINK_REPOSITORY',
    useClass: DeeplinkService,
  },
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        if (config.get<boolean>('database.cache')) {
          config.set('database.cache', {
            duration: 60000,
            alwaysEnabled: true,
            ignoreErrors: true,
            type: 'redis',
            options: {
              host: process.env.REDIS_HOST,
              port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
              password: process.env.REDIS_PASSWORD,
              db: parseInt(process.env.REDIS_DB ?? '0', 10),
            },
          });
        }
        return config.get('database');
      },
      inject: [ConfigService],
    }),
  ],
  providers,
  exports: providers,
})
export class IoModule {}
