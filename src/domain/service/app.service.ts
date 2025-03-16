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
        url = await this.repository
          .getBySlug(slug)
          .then((deeplink) => deeplink?.url);
      }
      await Promise.all([
        this.repository.incrementClicksBySlug(slug),
        this.deeplink.add(slug, url),
      ]);
      return url;
    });
  }

  async write(url: string): Promise<string> {
    const slug: string = unique();
    await Promise.all([
      this.deeplink.add(slug, url),
      this.repository.add(slug, url),
    ]);
    const baseUrl = this.config.get<string>('BASE_URL');
    return new URL(`/deeplink/${slug}`, baseUrl).href;
  }
}
