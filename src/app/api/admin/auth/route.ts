import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    return NextResponse.json({ token: process.env.ADMIN_PASSWORD });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
