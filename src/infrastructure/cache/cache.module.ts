import KeyvRedis from '@keyv/redis';
import KeyvGzip from '@keyv/compress-gzip';
import { CacheModule as _CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DEEPLINK_SERVICE } from '@/adapter/cache/deeplink.service';
import { DeeplinkService } from './deeplink.service';

const providers = [
  {
    provide: DEEPLINK_SERVICE,
    useClass: DeeplinkService,
  },
];

@Module({
  imports: [
    _CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          stores: new KeyvRedis(config.get('redis')),
          namespace: 'links',
          keyPrefixSeparator: ':',
          ttl: 300000,
          compression: new KeyvGzip(),
        };
      },
    }),
  ],
  providers,
  exports: providers,
})
export class CacheModule {}
