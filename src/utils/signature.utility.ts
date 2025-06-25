import {
  generateKeyPairSync as _generateKeyPairSync,
  sign as _sign,
  constants,
  verify,
} from 'crypto';
import { forEach, join, orderBy } from 'lodash';

// Convert a string to Base64
export const base64 = (str: string) => Buffer.from(str).toString('base64');

// Convert a string to Base64URL
export const base64Url = (str: string) =>
  Buffer.from(str).toString('base64url');

// Convert a Base64 string to ACSII string
export const fromBase64 = (base64Str: string) =>
  Buffer.from(base64Str, 'base64').toString();

// Convert a Base64URL string to ACSII string
export const fromBase64Url = (base64UrlStr: string) =>
  Buffer.from(base64UrlStr, 'base64url').toString();

/**
 * Create Base String from Request payload
 * Format: {HTTP METHOD}&{endpoint URL}&{JSON body and path parameters}&{X-Nonce}
 *
 * @param param object of request payload
 * @returns string of base string
 */
export const baseString = ({
  method,
  url,
  query,
  nonce,
  body = {},
}: {
  method: string;
  url: string;
  query: any;
  nonce: string;
  body?: any;
}) =>
  `${method?.toUpperCase()}&${encodeURIComponent(url)}&${bodyString(
    body,
    query,
  )}&${encodeURIComponent(nonce)}`;

/**
 * To prepare the JSON body and path parameters for use in the base string
 * @param req Request
 * @returns string
 *
 */
export const bodyString = (body, query): string => {
  /**
   * Encode JSON body in Base64
   */
  const bodyBase64 = base64(JSON.stringify(body || {}));

  /**
   * Split the body and path parameters into key-value pairs and
   * sort them in the ascending order based on key names
   */
  const arr = [`body=${bodyBase64}`];
  forEach(query || {}, (value, key) => {
    arr.push(`${key}=${value}`);
  });

  /**
   * Join the sorted key-value pairs using an ampersand (&)
   */
  return encodeURIComponent(join(orderBy(arr), '&'));
};

// The `generateKeyPairSync` method accepts two arguments:
// 1. The type ok keys we want, which in this case is "rsa"
// 2. An object with the properties of the key
export const generateKeyPairSync = (): {
  publicKey: string | Buffer;
  privateKey: string | Buffer;
} => {
  const { privateKey, publicKey } = _generateKeyPairSync('rsa', {
    // The standard secure default length for RSA keys is 2048 bits
    modulusLength: 2048,
  });

  return {
    publicKey: publicKey.export({
      format: 'pem',
      type: 'pkcs1',
    }),
    privateKey: privateKey.export({
      format: 'pem',
      type: 'pkcs1',
    }),
  };
};

// The signature method takes the data we want to sign, the
// hashing algorithm, and the padding scheme, and generates
// a signature in the form of bytes
export const sign = (
  verifiableData: string,
  privateKey: string,
  passphrase?: string,
): string | undefined => {
  try {
    return _sign('sha256', Buffer.from(verifiableData), {
      key: privateKey,
      padding: constants.RSA_PKCS1_PSS_PADDING,
      passphrase,
    }).toString('base64');
  } catch (error) {
    console.error('[SIGNATURE] Sign Error:', error);

    return;
  }
};

// To verify the data, we provide the same hashing algorithm and
// padding scheme we provided to generate the signature, along
// with the signature itself, the data that we want to
// verify against the signature, and the public key
// If verified should be `true` if the signature is valid
export const verified = (
  verifiableData: string,
  publicKey: string,
  signature: string,
) => {
  try {
    if (!verifiableData || !signature || !publicKey) {
      return false;
    }
    return verify(
      'sha256',
      Buffer.from(verifiableData),
      {
        key: publicKey,
        padding: constants.RSA_PKCS1_PSS_PADDING,
      },
      Buffer.from(signature, 'base64'),
    );
  } catch (error) {
    console.error('[SIGNATURE] Verify Error:', error);

    return false;
  }
};
