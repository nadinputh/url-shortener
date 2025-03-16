export const DEEPLINK_SERVICE = 'DEEPLINK_SERVICE';

export interface IDeeplinkService {
  /**
   * Get deeplink URL by slug and renew TTL;
   *
   * if not found, return null
   * if found, renew TTL and return deeplink URL
   * @param slug ID of the deeplink
   * @returns Deeplink URL
   */
  get(slug: string): Promise<string>;

  /**
   * Add deeplink URL by slug
   *
   * @param slug ID of the deeplink
   * @param deeplink Deeplink URL
   */
  add(slug: string, deeplink: string): Promise<void>;
}
