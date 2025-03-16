import { customAlphabet } from 'nanoid';

/**
 * Custom nanoid alphabet with 8 characters long
 *
 * @returns a unique string
 */
const nanoid = customAlphabet(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  8,
);

/**
 * Generate a unique string
 *
 * @returns a unique string
 */
export const unique = (length = 8): string => {
  return nanoid(length);
};
