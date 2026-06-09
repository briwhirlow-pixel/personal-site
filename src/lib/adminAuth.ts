import { createHash, timingSafeEqual } from "crypto";

function deriveToken(password: string): string {
  return createHash("sha256").update(`bybrian-session:${password}`).digest("hex");
}

export function isAuthorized(request: Request): boolean {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return false;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const provided = auth.slice(7);
  const expected = deriveToken(adminPassword);
  if (provided.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  } catch {
    return false;
  }
}
