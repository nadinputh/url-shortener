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
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
  ],
  providers,
  exports: providers,
})
export class IoModule {}
