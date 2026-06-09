import { createHmac, timingSafeEqual } from "crypto";

function getSecret(): string {
  const s = process.env.INVOICE_LINK_SECRET || process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("INVOICE_LINK_SECRET or ADMIN_PASSWORD must be set.");
  return s;
}

export function signInvoiceId(id: string): string {
  return createHmac("sha256", getSecret()).update(`invoice:${id}`).digest("hex");
}

export function verifyInvoiceToken(id: string, token: string | null | undefined): boolean {
  if (!token) return false;
  const expected = signInvoiceId(id);
  if (token.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(token, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}
