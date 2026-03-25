import { getSupabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Logo from "@/components/Logo";
import PrintButton from "./PrintButton";

type LineItem = { description: string; quantity: number; rate: number };

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data, error } = await getSupabaseAdmin()
    .from("invoices")
    .select("invoice_number, client_name, client_email, project_name, line_items, notes, payment_instructions, due_date, status, created_at")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  const lineItems = data.line_items as LineItem[];
  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const issued = new Date(data.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const due = data.due_date
    ? new Date(data.due_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  return (
    <>
      <style>{`@media print { .no-print { display: none !important; } body { background: white; } }`}</style>
      <div className="min-h-screen bg-[#FAFAF7] py-12 px-5">
        <div className="max-w-3xl mx-auto">

          {/* Toolbar */}
          <div className="no-print flex items-center justify-between mb-8">
            <a href="/" className="text-[#737373] hover:text-[#1A1A1A] text-[13px] transition">← byBrian</a>
            <PrintButton />
          </div>

          {/* Invoice card */}
          <div className="bg-white border border-[#E5E4DF] rounded-2xl overflow-hidden">

            {/* Header */}
            <div className="px-8 py-8 flex items-start justify-between gap-6 border-b border-[#E5E4DF]">
              <div>
                <Logo />
                <p className="text-[#737373] text-[13px] mt-2">brianwhirlowbusiness@gmail.com</p>
              </div>
              <div className="text-right">
                <p className="text-[#1A1A1A] font-black text-2xl">{data.invoice_number}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-[#737373] text-[13px]">Issued: <span className="text-[#1A1A1A] font-semibold">{issued}</span></p>
                  {due && <p className="text-[#737373] text-[13px]">Due: <span className="text-[#1A1A1A] font-semibold">{due}</span></p>}
                </div>
                {data.status === "paid" && (
                  <span className="inline-block mt-3 bg-green-500/10 text-green-600 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-green-500/20">
                    Paid
                  </span>
                )}
              </div>
            </div>

            {/* Bill to */}
            <div className="px-8 py-6 border-b border-[#E5E4DF] grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#AEACA6] mb-2">Bill To</p>
                <p className="text-[#1A1A1A] font-bold text-[15px]">{data.client_name}</p>
                <p className="text-[#737373] text-[13px]">{data.client_email}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#AEACA6] mb-2">Project</p>
                <p className="text-[#1A1A1A] font-bold text-[15px]">{data.project_name}</p>
              </div>
            </div>

            {/* Line items */}
            <div className="px-8 py-6 border-b border-[#E5E4DF]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E4DF]">
                    <th className="text-left pb-3 text-[11px] font-semibold uppercase tracking-widest text-[#AEACA6]">Description</th>
                    <th className="text-right pb-3 text-[11px] font-semibold uppercase tracking-widest text-[#AEACA6] w-16">Qty</th>
                    <th className="text-right pb-3 text-[11px] font-semibold uppercase tracking-widest text-[#AEACA6] w-24">Rate</th>
                    <th className="text-right pb-3 text-[11px] font-semibold uppercase tracking-widest text-[#AEACA6] w-24">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, i) => (
                    <tr key={i} className="border-b border-[#E5E4DF] last:border-0">
                      <td className="py-3.5 text-[14px] text-[#1A1A1A] pr-4">{item.description}</td>
                      <td className="py-3.5 text-[14px] text-[#737373] text-right">{item.quantity}</td>
                      <td className="py-3.5 text-[14px] text-[#737373] text-right">{fmt(item.rate)}</td>
                      <td className="py-3.5 text-[14px] text-[#1A1A1A] font-semibold text-right">{fmt(item.quantity * item.rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mt-4 pt-4 border-t border-[#E5E4DF]">
                <div className="text-right">
                  <p className="text-[#737373] text-[13px] mb-1">Total</p>
                  <p className="text-[#1A1A1A] font-black text-3xl">{fmt(subtotal)}</p>
                </div>
              </div>
            </div>

            {/* Payment instructions */}
            {data.payment_instructions && (
              <div className="px-8 py-6 border-b border-[#E5E4DF] bg-[#FAFAF7]">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#AEACA6] mb-3">How to Pay</p>
                <p className="text-[#4A4A4A] text-[14px] leading-relaxed whitespace-pre-line">{data.payment_instructions}</p>
              </div>
            )}

            {/* Notes */}
            {data.notes && (
              <div className="px-8 py-6">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#AEACA6] mb-3">Notes</p>
                <p className="text-[#737373] text-[14px] leading-relaxed whitespace-pre-line">{data.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="px-8 py-5 bg-[#F2F1EC] border-t border-[#E5E4DF]">
              <p className="text-[#AEACA6] text-[12px] text-center">
                Thank you for your business. Questions? Reply to this invoice or email{" "}
                <a href="mailto:brianwhirlowbusiness@gmail.com" className="text-[#2563EB]">brianwhirlowbusiness@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
