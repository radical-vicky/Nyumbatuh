/**
 * Minimal in-memory rate limiter.
 *
 * This is per-process/per-instance — fine for a single Render/Cloudflare
 * instance, but it will NOT share state across multiple server instances
 * behind a load balancer. If you scale horizontally, swap this for a
 * shared store (Upstash Redis is the easiest drop-in for serverless/edge).
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Periodically clear stale buckets so this Map doesn't grow forever.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}, 5 * 60 * 1000).unref?.();

export type RateLimitResult = { success: boolean; remaining: number; resetAt: number };

/**
 * @param key    unique identifier for the caller+route, e.g. `login:1.2.3.4`
 * @param limit  max requests allowed within the window
 * @param windowMs  window size in milliseconds
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { success: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

/** Best-effort client IP extraction behind common proxies (Render, Cloudflare). */
export function getClientIp(req: Request): string {
  const headers = req.headers;
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}
