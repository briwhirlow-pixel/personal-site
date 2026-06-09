import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { rateLimit, clientIp, sameOrigin } from "@/lib/rateLimit";

// Derive a session token from the password without exposing the password itself.
// The token is deterministic so no session store is needed in this serverless env.
function deriveToken(password: string): string {
  return createHash("sha256").update(`bybrian-session:${password}`).digest("hex");
}

function ctEqualsString(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  }

  const ip = clientIp(request);
  if (!rateLimit(`admin-auth:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  }

  try {
    const { password } = await request.json();
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || typeof password !== "string" || !ctEqualsString(password, expected)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    return NextResponse.json({ token: deriveToken(expected) });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
