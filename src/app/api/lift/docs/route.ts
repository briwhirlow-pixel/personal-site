import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Returns every lifting-log document: { docs: { [name]: { data, updated_at } } }
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("lift_docs")
      .select("name,data,updated_at");
    if (error) throw error;
    const docs: Record<string, { data: unknown; updated_at: string }> = {};
    for (const row of data ?? []) docs[row.name] = { data: row.data, updated_at: row.updated_at };
    return NextResponse.json({ docs }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Storage unavailable" }, { status: 503 });
  }
}
