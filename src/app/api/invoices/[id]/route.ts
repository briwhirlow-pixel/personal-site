import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAuthorized } from "@/lib/adminAuth";
import { verifyInvoiceToken } from "@/lib/invoiceTokens";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(request.url);
  const token = url.searchParams.get("t");

  if (!isAuthorized(request) && !verifyInvoiceToken(id, token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("invoices")
    .select("invoice_number, client_name, client_email, project_name, line_items, notes, payment_instructions, due_date, status, created_at")
    .eq("id", id)
    .single();
  if (error || !data) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  return NextResponse.json(data);
}
