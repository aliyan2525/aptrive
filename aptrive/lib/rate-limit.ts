import "server-only";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Sliding-window rate limiter backed by Upstash Redis.
 *
 * Previously this was an in-memory Map, which meant each Vercel
 * serverless instance kept its own counter — an attacker distributed
 * across requests (and therefore across instances) could slip past it
 * even though a single script hammering one endpoint was still caught.
 * Redis gives every instance a shared counter, closing that gap.
 *
 * Same key structure as before (e.g. `contact:${ip}`), so call sites
 * don't need to change other than awaiting the (now async) result.
 *
 * Local dev / preview without Upstash env vars configured: falls back
 * to the original in-memory limiter rather than failing outright, so
 * `npm run dev` keeps working with zero setup. Set
 * UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (from the Vercel
 * Upstash integration or the Upstash console) to get the real,
 * cross-instance behavior in every deployed environment.
 */

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

// One Ratelimit instance per (limit, window) pair, cached so we don't
// recreate the sliding-window state on every call. Keyed by
// "limit:windowSeconds" since those two numbers fully determine the
// Ratelimit config; the actual per-caller key is passed to .limit().
const limiters = new Map<string, Ratelimit>();

function getLimiter(limit: number, windowSeconds: number): Ratelimit {
  const cacheKey = `${limit}:${windowSeconds}`;
  const existing = limiters.get(cacheKey);
  if (existing) return existing;

  const limiter = new Ratelimit({
    redis: redis!,
    limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
    analytics: false,
    prefix: "ratelimit",
  });
  limiters.set(cacheKey, limiter);
  return limiter;
}

// ---- In-memory fallback (local dev only — see module doc above) ----

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
let lastSweep = Date.now();

function sweep() {
  const now = Date.now();
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

function checkRateLimitInMemory(key: string, limit: number, windowSeconds: number): RateLimitResult {
  sweep();
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

// ---- Public API ------------------------------------------------------

/**
 * Checks and increments the counter for `key` within `windowSeconds`.
 * Call once per attempt, before doing the real work.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  if (!redis) {
    return checkRateLimitInMemory(key, limit, windowSeconds);
  }

  const limiter = getLimiter(limit, windowSeconds);
  const result = await limiter.limit(key);
  return {
    allowed: result.success,
    retryAfterSeconds: result.success ? 0 : Math.max(0, Math.ceil((result.reset - Date.now()) / 1000)),
  };
}

/** Best-effort client IP from standard proxy headers (Vercel sets these). */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}
