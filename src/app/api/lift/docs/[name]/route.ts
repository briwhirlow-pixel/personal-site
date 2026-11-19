import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const NAME = /^(weights|runs|habits|days|food|shop|lifts_\d{4}_\d{2})$/;
const MAX_BYTES = 400_000;

// Replaces one document. The dashboard sends whole documents, same as it did inside Claude.
export async function PUT(req: NextRequest, ctx: { params: Promise<{ name: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { name } = await ctx.params;
  if (!NAME.test(name)) {
    return NextResponse.json({ error: "Unknown document" }, { status: 400 });
  }
  const text = await req.text();
  if (text.length > MAX_BYTES) {
    return NextResponse.json({ error: "Too large" }, { status: 413 });
  }
  let body: { data?: unknown };
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }
  if (!body || typeof body.data !== "object" || body.data === null || Array.isArray(body.data)) {
    return NextResponse.json({ error: "Bad body" }, { status: 400 });
  }
  const updated_at = new Date().toISOString();
  try {
    const { error } = await getSupabaseAdmin()
      .from("lift_docs")
      .upsert({ name, data: body.data, updated_at }, { onConflict: "name" });
    if (error) throw error;
    return NextResponse.json({ ok: true, updated_at });
  } catch {
    return NextResponse.json({ error: "Storage unavailable" }, { status: 503 });
  }
}
