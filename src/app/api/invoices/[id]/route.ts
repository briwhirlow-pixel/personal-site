import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await getSupabaseAdmin()
    .from("invoices")
    .select("invoice_number, client_name, client_email, project_name, line_items, notes, payment_instructions, due_date, status, created_at")
    .eq("id", id)
    .single();
  if (error || !data) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  return NextResponse.json(data);
}
