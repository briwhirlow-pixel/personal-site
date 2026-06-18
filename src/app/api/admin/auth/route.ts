import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, sessionCookieOptions, clearCookieOptions, isAuthenticated } from '@/lib/admin-auth';

export async function GET() {
  const authed = await isAuthenticated();
  return NextResponse.json({ authenticated: authed });
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  const cookie = sessionCookieOptions();
  res.cookies.set(cookie.name, cookie.value, {
    httpOnly: cookie.httpOnly,
    secure: cookie.secure,
    sameSite: cookie.sameSite,
    path: cookie.path,
    maxAge: cookie.maxAge,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  const cookie = clearCookieOptions();
  res.cookies.set(cookie.name, cookie.value, {
    httpOnly: cookie.httpOnly,
    secure: cookie.secure,
    sameSite: cookie.sameSite,
    path: cookie.path,
    maxAge: cookie.maxAge,
  });
  return res;
}
