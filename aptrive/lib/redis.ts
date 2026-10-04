import "server-only";
import { Redis } from "@upstash/redis";

// ---------------------------------------------------------------------------
// Upstash Redis singleton — shared across the caching, rate-limiting, and
// pub/sub layers. Provides connection pooling and automatic pipelining.
// ---------------------------------------------------------------------------

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

/**
 * Shared Redis client. `null` when env vars are absent (local dev).
 * Upstash's REST-based SDK is connectionless — each call is an HTTP request
 * routed through their global edge network — so there's no connection pool
 * to exhaust. A single instance is safe and recommended.
 */
export const redis =
  redisUrl && redisToken
    ? new Redis({
        url: redisUrl,
        token: redisToken,
        // Enable automatic pipelining: consecutive Redis calls within the
        // same tick are batched into a single HTTP round-trip, cutting
        // latency in half for common patterns like "get + set".
        automaticDeserialization: true,
      })
    : null;
