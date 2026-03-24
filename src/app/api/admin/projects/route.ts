import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { isAuthorized } from "@/lib/adminAuth";

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data, error } = await getSupabaseClient()
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { data, error } = await getSupabaseClient()
    .from("projects")
    .insert({
      lead_id: body.lead_id || null,
      name: body.name,
      client_name: body.client_name,
      client_email: body.client_email,
      agreed_budget: body.agreed_budget,
      start_date: body.start_date || null,
      deadline: body.deadline || null,
      status: "discovery",
      notes: body.notes || "",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
