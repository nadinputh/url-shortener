import {
  DEEPLINK_REPOSITORY,
  IDeeplinkRepository,
} from '@/adapter/repository/deeplink.repository';
import { unique } from '@/utils/string.utils';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DEEPLINK_SERVICE,
  IDeeplinkService,
} from 'src/adapter/cache/deeplink.service';

@Injectable()
export class AppService {
  constructor(
    @Inject(DEEPLINK_SERVICE)
    private readonly deeplink: IDeeplinkService,
    private readonly config: ConfigService,
    @Inject(DEEPLINK_REPOSITORY)
    private readonly repository: IDeeplinkRepository,
  ) {}

  read(slug: string): Promise<string> {
    return this.deeplink.get(slug).then(async (url) => {
      if (!url) {
        const deeplink = await this.repository.getBySlug(slug);
        if (deeplink) {
          await Promise.all([
            this.repository.incrementClicksBySlug(slug),
            this.deeplink.add({ slug, url, expiresAt: deeplink?.expiresAt }),
          ]);
          return deeplink?.url;
        }
        return null;
      }
      await Promise.all([
        this.repository.incrementClicksBySlug(slug),
        this.deeplink.add({ slug, url }),
      ]);
      return url;
    });
  }

  async write(url: string, options?: { expiresAt?: Date }): Promise<string> {
    const slug: string = unique();
    if (options?.expiresAt <= new Date()) {
      delete options?.expiresAt;
    }
    await Promise.all([
      this.deeplink.add({ slug, url, expiresAt: options?.expiresAt }),
      this.repository.add({ slug, url, expiresAt: options?.expiresAt }),
    ]);
    const baseUrl = this.config.get<string>('BASE_URL');
    return new URL(`/${slug}`, baseUrl).href;
  }
}
