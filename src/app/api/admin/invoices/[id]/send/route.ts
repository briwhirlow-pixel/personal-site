import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAuthorized } from "@/lib/adminAuth";
import nodemailer from "nodemailer";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const { data: inv, error } = await getSupabaseAdmin()
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !inv) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
  const invoiceUrl = `${siteUrl}/invoice/${id}`;

  const subtotal = (inv.line_items as { quantity: number; rate: number }[])
    .reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });

  await transporter.sendMail({
    from: `"Brian Whirlow" <${process.env.GMAIL_USER}>`,
    to: inv.client_email,
    subject: `Invoice ${inv.invoice_number} — ${inv.project_name}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A1A1A">
        <h2 style="margin-bottom:4px">Invoice ${inv.invoice_number}</h2>
        <p style="color:#737373;margin-top:0">Project: ${inv.project_name}</p>
        <hr style="border:none;border-top:1px solid #E5E4DF;margin:24px 0"/>
        <p>Hi ${inv.client_name},</p>
        <p>Please find your invoice for <strong>${inv.project_name}</strong> below.</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0">
          <thead>
            <tr style="background:#F2F1EC">
              <th style="text-align:left;padding:10px 12px;font-size:12px;color:#737373;font-weight:600">Description</th>
              <th style="text-align:right;padding:10px 12px;font-size:12px;color:#737373;font-weight:600">Qty</th>
              <th style="text-align:right;padding:10px 12px;font-size:12px;color:#737373;font-weight:600">Rate</th>
              <th style="text-align:right;padding:10px 12px;font-size:12px;color:#737373;font-weight:600">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${(inv.line_items as { description: string; quantity: number; rate: number }[]).map(item => `
              <tr style="border-bottom:1px solid #E5E4DF">
                <td style="padding:10px 12px;font-size:14px">${item.description}</td>
                <td style="padding:10px 12px;font-size:14px;text-align:right">${item.quantity}</td>
                <td style="padding:10px 12px;font-size:14px;text-align:right">${fmt(item.rate)}</td>
                <td style="padding:10px 12px;font-size:14px;text-align:right;font-weight:600">${fmt(item.quantity * item.rate)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        <div style="text-align:right;margin-bottom:24px">
          <span style="font-size:20px;font-weight:900">Total: ${fmt(subtotal)}</span>
        </div>
        ${inv.due_date ? `<p style="color:#737373;font-size:14px">Due by: <strong>${new Date(inv.due_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</strong></p>` : ""}
        ${inv.payment_instructions ? `<div style="background:#F2F1EC;border-radius:8px;padding:16px;margin:24px 0"><p style="margin:0 0 6px 0;font-weight:700;font-size:13px">How to Pay</p><p style="margin:0;font-size:14px;color:#4A4A4A;white-space:pre-line">${inv.payment_instructions}</p></div>` : ""}
        ${inv.notes ? `<p style="font-size:14px;color:#737373">${inv.notes}</p>` : ""}
        <a href="${invoiceUrl}" style="display:inline-block;background:#2563EB;color:white;font-weight:700;padding:14px 28px;border-radius:8px;text-decoration:none;margin-top:8px">View Invoice Online →</a>
        <hr style="border:none;border-top:1px solid #E5E4DF;margin:32px 0"/>
        <p style="color:#AEACA6;font-size:12px">Questions? Reply to this email or contact briwhirlow@gmail.com</p>
      </div>
    `,
  });

  await getSupabaseAdmin().from("invoices").update({ status: "sent" }).eq("id", id);

  return NextResponse.json({ success: true });
}
