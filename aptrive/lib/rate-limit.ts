import "server-only";
import { headers } from "next/headers";

/**
 * In-memory sliding-window rate limiter.
 *
 * Known limitation: this state lives in the Node process, so on a
 * multi-instance/serverless deployment (Vercel scales to many isolated
 * lambda instances) each instance has its own counter — a determined
 * attacker distributed across instances isn't fully stopped by this
 * alone. It still meaningfully raises the bar for the common case
 * (single script hammering one endpoint) and costs nothing to run.
 * For real protection at scale, replace with an edge/Upstash-backed
 * limiter keyed the same way (see RateLimitKey below).
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Periodically drop expired buckets so this map doesn't grow forever
// on a long-lived instance.
let lastSweep = Date.now();
function sweep() {
  const now = Date.now();
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

/**
 * Checks and increments the counter for `key` within `windowSeconds`.
 * Call once per attempt, before doing the real work.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  sweep();
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Best-effort client IP from standard proxy headers (Vercel sets these). */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}
