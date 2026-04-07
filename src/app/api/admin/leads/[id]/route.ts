import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAuthorized } from "@/lib/adminAuth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const allowed: Record<string, unknown> = {};
  if (body.status !== undefined) allowed.status = body.status;
  if (body.notes !== undefined) allowed.notes = body.notes;
  if (body.discount_type !== undefined) allowed.discount_type = body.discount_type;
  if (body.discount_value !== undefined) allowed.discount_value = body.discount_value;
  if (body.discount_note !== undefined) allowed.discount_note = body.discount_note;

  const { data, error } = await getSupabaseAdmin()
    .from("leads")
    .update(allowed)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
