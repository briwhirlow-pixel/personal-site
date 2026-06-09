import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAuthorized } from "@/lib/adminAuth";
import { signInvoiceId } from "@/lib/invoiceTokens";

type InvoiceRow = {
  id: string;
  invoice_number: string;
  [k: string]: unknown;
};

function withAccessToken<T extends { id: string }>(row: T): T & { access_token: string } {
  return { ...row, access_token: signInvoiceId(row.id) };
}

function nextInvoiceNumber(lastNumber: string | null | undefined): string {
  if (!lastNumber) return "INV-001";
  const part = lastNumber.split("-")[1];
  const parsed = parseInt(part || "", 10);
  const lastNum = Number.isFinite(parsed) ? parsed : 0;
  return `INV-${String(lastNum + 1).padStart(3, "0")}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await getSupabaseAdmin()
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(row => withAccessToken(row as InvoiceRow)));
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const supabase = getSupabaseAdmin();

  // Retry on unique-violation (Postgres 23505) to handle the SELECT-MAX → INSERT race.
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: last } = await supabase
      .from("invoices")
      .select("invoice_number")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const invoice_number = nextInvoiceNumber(last?.invoice_number);

    const { data, error } = await supabase
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
        project_id: body.project_id || null,
      })
      .select()
      .single();

    if (!error && data) return NextResponse.json(withAccessToken(data as InvoiceRow));

    // Postgres unique violation → another request grabbed the same number; retry.
    const code = (error as { code?: string } | null)?.code;
    if (code !== "23505") {
      return NextResponse.json({ error: error?.message || "Insert failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Could not allocate invoice number" }, { status: 500 });
}
