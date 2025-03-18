import { isEmpty as _isEmpty } from 'class-validator';
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

/**
 * Convert to kebab case from simple string
 * eg. one-two-three
 * @param str string
 * @returns string in kebab case
 */
export const toKebab = (str: string): string => {
  return str
    .split('')
    .map((letter) => {
      if (/[A-Z]/.test(letter)) {
        return ` ${letter.toLowerCase()}`;
      }
      return letter;
    })
    .join('')
    .trim()
    .replace(/[_\s]+/g, '-');
};

/**
 * Convert to snake case from simple string
 * eg. one_two_three
 * @param str string
 * @returns string in snake case
 */
export const toSnakeCase = (str: string): string => {
  return toKebab(str).split('-').join('_');
};

/**
 * Convert to camel case string from simple string
 * eg. oneTwoThree
 * @param str string
 * @returns string in camel case
 */
export const toCamelCase = (str: string): string => {
  return toKebab(str)
    .split('-')
    .map((word, index) => {
      if (index === 0) return word;
      return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
};

/**
 * Convert to capitalize the first letter of the string
 * @param str any string
 * @returns string
 */
export const toFirstCamelCase = (str: string) => {
  str = str.toLowerCase();
  return str[0].toUpperCase() + str.slice(1);
};

export const isEmpty = (str: any) => {
  return _isEmpty(str);
};

/**
 * Convert string to title case with separator
 * @param value
 * @param separator
 * @returns
 */
export const toTileCase = (value: string, separator = '_') => {
  try {
    return value
      .split(separator)
      .map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
      .join(' ');
  } catch (_) {
    return value;
  }
};
