import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

// scrypt params — N=16384 (2^14) is reasonable for serverless cold starts.
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN = 32;
const SALT_LEN = 16;
const PREFIX = "scrypt$";

export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LEN);
  const hash = scryptSync(password, salt, KEY_LEN, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P });
  return `${PREFIX}${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function isHashed(value: string | null | undefined): boolean {
  return typeof value === "string" && value.startsWith(PREFIX);
}

// Constant-time compare for two strings of arbitrary length.
function ctEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still run a compare against itself to keep timing roughly constant.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export function verifyPassword(password: string, stored: string | null | undefined): boolean {
  if (!stored) return false;
  if (!stored.startsWith(PREFIX)) {
    return ctEquals(password, stored);
  }
  const parts = stored.slice(PREFIX.length).split("$");
  if (parts.length !== 2) return false;
  const [saltHex, hashHex] = parts;
  let salt: Buffer;
  let expected: Buffer;
  try {
    salt = Buffer.from(saltHex, "hex");
    expected = Buffer.from(hashHex, "hex");
  } catch {
    return false;
  }
  if (expected.length !== KEY_LEN) return false;
  const got = scryptSync(password, salt, expected.length, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P });
  return timingSafeEqual(got, expected);
}
