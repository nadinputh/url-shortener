import urlExist from 'url-exist';

/**
 * Verify if the URL exists
 *
 * @param url URL to check if it exists
 * @returns true if the URL exists, false otherwise
 */
export const isExist = (url: string): Promise<boolean> => {
  return urlExist(url);
};
