import { IDeeplinkRepository } from '@/adapter/repository/deeplink.repository';
import { Injectable } from '@nestjs/common';
import { Deeplink } from '../entity/deeplink.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class DeeplinkService implements IDeeplinkRepository {
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager,
  ) {}

  async incrementClicksBySlug(slug: string): Promise<number> {
    await this.manager.increment(Deeplink, { slug }, 'clicks', 1);
    const deeplink = await this.manager.findOneBy(Deeplink, { slug });
    return deeplink?.clicks ?? 0;
  }

  get(id: number): Promise<Deeplink | undefined> {
    return this.manager.findOne(Deeplink, { where: { id } });
  }

  getBySlug(slug: string): Promise<Deeplink | undefined> {
    return this.manager.findOne(Deeplink, { where: { slug } });
  }

  add(slug: string, url: string): Promise<Deeplink> {
    return this.manager.save(Deeplink, { slug, url });
  }

  async incrementClicks(id: number): Promise<number> {
    await this.manager.increment(Deeplink, { id }, 'clicks', 1);
    const deeplink = await this.get(id);
    return deeplink?.clicks ?? 0;
  }
}
