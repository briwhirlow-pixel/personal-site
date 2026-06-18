import { createHmac } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'bbb-admin-session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getSecret(): string {
  return process.env.ADMIN_PASSWORD || '';
}

export function createSessionToken(): string {
  return createHmac('sha256', getSecret()).update('bbb-admin-session-v1').digest('hex');
}

export function verifyPassword(input: string): boolean {
  return input === getSecret();
}

export function verifyToken(token: string): boolean {
  if (!getSecret()) return false;
  const expected = createSessionToken();
  return token === expected;
}

export async function isAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyToken(token);
}

export function sessionCookieOptions() {
  return {
    name: COOKIE_NAME,
    value: createSessionToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: MAX_AGE,
  };
}

export function clearCookieOptions() {
  return {
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };
}
