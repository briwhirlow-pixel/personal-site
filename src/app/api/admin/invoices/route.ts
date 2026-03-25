import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAuthorized } from "@/lib/adminAuth";

export async function GET(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await getSupabaseAdmin()
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();

  // Generate next invoice number
  const { data: last } = await getSupabaseAdmin()
    .from("invoices")
    .select("invoice_number")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const lastNum = last ? parseInt(last.invoice_number.split("-")[1] || "0", 10) : 0;
  const invoice_number = `INV-${String(lastNum + 1).padStart(3, "0")}`;

  const { data, error } = await getSupabaseAdmin()
    .from("invoices")
    .insert({
      invoice_number,
      client_name: body.client_name,
      client_email: body.client_email,
      project_name: body.project_name,
      line_items: body.line_items || [],
      notes: body.notes || "",
      payment_instructions: body.payment_instructions || "",
      due_date: body.due_date || null,
      status: "draft",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
