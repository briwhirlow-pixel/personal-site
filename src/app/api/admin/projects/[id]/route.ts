import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { isAuthorized } from "@/lib/adminAuth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const allowed: Record<string, unknown> = {};
  const fields = ["status", "notes", "site_url", "deadline", "agreed_budget", "name"];
  fields.forEach(f => { if (body[f] !== undefined) allowed[f] = body[f]; });

  const { data, error } = await getSupabaseClient()
    .from("projects")
    .update(allowed)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
