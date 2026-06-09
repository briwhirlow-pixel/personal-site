// Per-instance, in-memory rate limiter. Best-effort in serverless: each warm
// instance has its own counters, but it still blocks single-instance flooders.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (b.count >= max) return false;
  b.count++;
  return true;
}

export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  // No Origin (server-to-server, curl) — let it through; auth still required.
  if (!origin) return true;
  const host = request.headers.get("host");
  if (!host) return false;
  try {
    const o = new URL(origin);
    return o.host === host;
  } catch {
    return false;
  }
}
