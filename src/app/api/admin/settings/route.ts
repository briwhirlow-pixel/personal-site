import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAuthorized } from "@/lib/adminAuth";

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data, error } = await getSupabaseAdmin()
    .from("settings")
    .select("key, value");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const map: Record<string, string> = {};
  for (const row of data ?? []) map[row.key] = row.value;
  return NextResponse.json(map);
}

const ALLOWED_KEYS = new Set([
  "email_quote_subject",
  "email_quote_greeting",
  "email_quote_intro",
  "email_quote_closing",
]);

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body: Record<string, string> = await request.json();
  const rows = Object.entries(body)
    .filter(([key]) => ALLOWED_KEYS.has(key))
    .map(([key, value]) => ({ key, value: String(value ?? ""), updated_at: new Date().toISOString() }));
  if (rows.length === 0) {
    return NextResponse.json({ error: "No valid keys" }, { status: 400 });
  }
  const { error } = await getSupabaseAdmin()
    .from("settings")
    .upsert(rows, { onConflict: "key" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
