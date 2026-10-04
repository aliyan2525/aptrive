import "server-only";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

/**
 * Sliding-window rate limiter backed by Upstash Redis.
 *
 * Architecture for 1M+ req/s:
 * ─────────────────────────────
 * 1. Redis-backed sliding window: every Vercel instance shares the same
 *    counter, so distributed attackers can't bypass per-instance limits.
 * 2. Tiered limits: different endpoints get different budgets
 *    (e.g. auth = strict, reads = generous).
 * 3. In-memory fallback for local dev: zero-config `npm run dev`.
 * 4. Ephemeral deny cache: once an IP is rate-limited, subsequent requests
 *    within the same serverless instance are rejected without a Redis call.
 *
 * Set UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN for production.
 */

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

// ---------------------------------------------------------------------------
// Preset tiers — import and use these instead of raw numbers
// ---------------------------------------------------------------------------

export const RATE_LIMIT_TIERS = {
  /** Auth endpoints: login, signup, password reset. Very strict. */
  auth: { limit: 5, windowSeconds: 60 },
  /** Contact form, feedback submissions. */
  contact: { limit: 3, windowSeconds: 60 },
  /** Mutating API calls: POST/PUT/PATCH/DELETE. */
  mutation: { limit: 30, windowSeconds: 60 },
  /** Read-heavy API calls: GET. Generous to support high traffic. */
  read: { limit: 120, windowSeconds: 60 },
  /** Global catch-all for unclassified requests. */
  global: { limit: 60, windowSeconds: 60 },
} as const;

// ---------------------------------------------------------------------------
// Redis-backed limiter (production)
// ---------------------------------------------------------------------------

// Cache Ratelimit instances by config to avoid re-creation.
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
    // Ephemeral cache: deny decisions are cached in-memory for up to 1s,
    // so a hammering client doesn't cause a Redis call on every request.
    ephemeralCache: new Map(),
  });
  limiters.set(cacheKey, limiter);
  return limiter;
}

// ---------------------------------------------------------------------------
// In-memory fallback (local dev only)
// ---------------------------------------------------------------------------

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

function checkRateLimitInMemory(
  key: string,
  limit: number,
  windowSeconds: number,
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

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Check and increment the counter for `key` within `windowSeconds`.
 * Call once per attempt, before doing the real work.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  if (!redis) {
    return checkRateLimitInMemory(key, limit, windowSeconds);
  }

  const limiter = getLimiter(limit, windowSeconds);
  const result = await limiter.limit(key);
  return {
    allowed: result.success,
    retryAfterSeconds: result.success
      ? 0
      : Math.max(0, Math.ceil((result.reset - Date.now()) / 1000)),
  };
}

/**
 * Convenience: check rate limit using a named tier.
 *
 * Usage:
 * ```ts
 * const { allowed } = await checkRateLimitTier("auth", `login:${ip}`);
 * ```
 */
export async function checkRateLimitTier(
  tier: keyof typeof RATE_LIMIT_TIERS,
  key: string,
): Promise<RateLimitResult> {
  const { limit, windowSeconds } = RATE_LIMIT_TIERS[tier];
  return checkRateLimit(key, limit, windowSeconds);
}

/** Best-effort client IP from standard proxy headers (Vercel sets these). */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}
