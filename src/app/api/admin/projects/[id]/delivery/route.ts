import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAuthorized } from "@/lib/adminAuth";

const WORDS = [
  "pine", "oak", "sage", "blue", "gold", "wave", "stone", "dawn", "hill", "mist",
  "rain", "lake", "snow", "wind", "fire", "moon", "star", "leaf", "rose", "reef",
  "sand", "cedar", "ember", "fern", "grove", "ivory", "maple", "nova", "opal",
  "pearl", "ridge", "silver", "thorn", "violet", "willow", "amber", "birch",
  "coast", "delta", "echo", "flint", "harbor", "inlet", "jasper", "kestrel",
];

function generatePassword(): string {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${word}-${num}`;
}

function generateToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(12)))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

// Generate delivery page (token + password)
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const { driveLink, credentials } = body;

  const token = generateToken();
  const password = generatePassword();
  const sentAt = new Date();
  const expiresAt = new Date(sentAt.getTime() + 30 * 24 * 60 * 60 * 1000);

  const { error } = await getSupabaseAdmin()
    .from("projects")
    .update({
      delivery_token: token,
      delivery_password: password,
      drive_link: driveLink || null,
      client_credentials: credentials || null,
      delivery_sent_at: sentAt.toISOString(),
      delivery_expires_at: expiresAt.toISOString(),
      page_sent: true,
      files_uploaded: !!driveLink,
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ token, password, expiresAt });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();

  const { error } = await getSupabaseAdmin()
    .from("projects")
    .update(body)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
