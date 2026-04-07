import { NextResponse } from "next/server";
import { createHash } from "crypto";

// Derive a session token from the password without exposing the password itself.
// The token is deterministic so no session store is needed in this serverless env.
function deriveToken(password: string): string {
  return createHash("sha256").update(`bybrian-session:${password}`).digest("hex");
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    return NextResponse.json({ token: deriveToken(password) });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
