import { createHash } from "crypto";

function deriveToken(password: string): string {
  return createHash("sha256").update(`bybrian-session:${password}`).digest("hex");
}

export function isAuthorized(request: Request): boolean {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return false;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return auth.slice(7) === deriveToken(adminPassword);
}
