import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { IDeeplinkService } from 'src/adapter/cache/deeplink.service';

@Injectable()
export class DeeplinkService implements IDeeplinkService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  get(slug: string): Promise<string> {
    return this.cache.get<string>(slug).then(async (deeplink) => {
      if (deeplink) {
        await this.cache.set(slug, deeplink);
      }
      return deeplink;
    });
  }

  async add(payload: {
    slug: string;
    url: string;
    expiresAt?: Date;
  }): Promise<void> {
    if (payload.expiresAt) {
      const ttl = payload.expiresAt.getTime() - new Date().getTime();
      if (ttl > 0) {
        await this.cache.set(payload.slug, payload.url, ttl);
        return;
      }
    }
    await this.cache.set(payload.slug, payload.url);
  }
}
