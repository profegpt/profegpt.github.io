/**
 * `node:crypto`, as far as identity.js needs it, on Apps Script's Utilities.
 */

/* global Utilities */

class Hmac {
  constructor(algorithm, key) {
    if (algorithm !== 'sha256') throw new Error(`Unsupported HMAC: ${algorithm}`);
    this.key = String(key);
    this.data = '';
  }

  update(data) { this.data += String(data); return this; }

  digest(encoding) {
    const bytes = Buffer.from(Utilities.computeHmacSha256Signature(this.data, this.key, Utilities.Charset.UTF_8));
    return encoding ? bytes.toString(encoding) : bytes;
  }
}

const DIGESTS = { md5: 'MD5', sha1: 'SHA_1', sha256: 'SHA_256', sha512: 'SHA_512' };

class Hash {
  constructor(algorithm) {
    const name = DIGESTS[algorithm];
    if (!name) throw new Error(`Unsupported hash: ${algorithm}`);
    this.algorithm = Utilities.DigestAlgorithm[name];
    this.data = '';
  }

  update(data) { this.data += String(data); return this; }

  digest(encoding) {
    const bytes = Buffer.from(Utilities.computeDigest(this.algorithm, this.data, Utilities.Charset.UTF_8));
    return encoding ? bytes.toString(encoding) : bytes;
  }
}

export function createHmac(algorithm, key) { return new Hmac(algorithm, key); }
export function createHash(algorithm) { return new Hash(algorithm); }
export function randomUUID() { return Utilities.getUuid(); }

/** Two UUIDs' worth of randomness per 32 bytes, from the platform's generator. */
export function randomBytes(size) {
  let hex = '';
  while (hex.length < size * 2) hex += Utilities.getUuid().replace(/-/g, '');
  return Buffer.from(hex.slice(0, size * 2), 'hex');
}

export function timingSafeEqual(a, b) {
  if (a.length !== b.length) throw new RangeError('Input buffers must have the same byte length');
  let difference = 0;
  for (let i = 0; i < a.length; i += 1) difference |= a[i] ^ b[i];
  return difference === 0;
}

const crypto = { createHmac, createHash, randomUUID, randomBytes, timingSafeEqual };
export { crypto as default };
