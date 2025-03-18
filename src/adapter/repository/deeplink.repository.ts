import { CreateDeeplinkQuery } from '@/dto/query/create-deeplink.query';
import { Deeplink } from '@infrastructure/io/entity/deeplink.entity';

export const DEEPLINK_REPOSITORY = 'DEEPLINK_REPOSITORY';

export interface IDeeplinkRepository {
  /**
   * Get the deeplink by the given ID
   * @param id The ID of the deeplink
   * @returns The deeplink
   */
  get(id: number): Promise<Deeplink | undefined>;
  /**
   * Get the deeplink by the given slug
   * @param slug The slug of the deeplink
   * @returns The deeplink
   */
  getBySlug(slug: string): Promise<Deeplink | undefined>;
  /**
   * Add a new deeplink
   * @param slug The slug of the deeplink
   * @param url The URL of the deeplink
   * @returns The added deeplink
   */
  add(dto: CreateDeeplinkQuery): Promise<Deeplink>;
  /**
   * Increment the clicks of the deeplink
   * @param id The ID of the deeplink
   * @returns The updated deeplink
   */
  incrementClicks(id: number): Promise<number>;

  /**
   * Increment the clicks of the deeplink by slug
   * @param slug The slug of the deeplink
   * @returns The updated deeplink
   */
  incrementClicksBySlug(slug: string): Promise<number>;
}
