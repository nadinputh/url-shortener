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

  async add(slug: string, deeplink: string): Promise<void> {
    await this.cache.set(slug, deeplink);
  }
}
