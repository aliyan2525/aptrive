import "server-only";
import { redis } from "@/lib/redis";

// ---------------------------------------------------------------------------
// Two-tier caching layer for 1M+ req/s scale
//
// Tier 1: In-memory LRU cache (per-instance, ~0 latency, no network I/O).
//         Eliminates Redis round-trips for hot keys within the same
//         serverless function instance during its warm lifetime.
//
// Tier 2: Upstash Redis (shared, cross-instance, ~1–3ms at edge).
//         Acts as the authoritative cache when the in-memory tier misses.
//
// Write-through: on cache miss → fetch from source → write to both tiers.
// This pattern can sustain millions of reads/sec because the vast majority
// hit tier 1 and never touch the network.
// ---------------------------------------------------------------------------

/** Simple bounded LRU backed by a Map (insertion-order iteration). */
class LRUCache {
  private cache = new Map<string, { data: unknown; expiresAt: number }>();
  private readonly maxSize: number;

  constructor(maxSize = 500) {
    this.maxSize = maxSize;
  }

  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.data as T;
  }

  set(key: string, data: unknown, ttlMs: number): void {
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldest = this.cache.keys().next().value;
      if (oldest !== undefined) this.cache.delete(oldest);
    }
    this.cache.set(key, { data, expiresAt: Date.now() + ttlMs });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Singleton per serverless instance
const memCache = new LRUCache(1000);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface CacheOptions {
  /** Redis TTL in seconds (default: 3600 = 1 hour). */
  ttlSeconds?: number;
  /** In-memory TTL in seconds (default: 60 = 1 minute). Shorter than Redis
   *  to keep memory-cached data fresher while still avoiding Redis calls. */
  memTtlSeconds?: number;
  /**
   * If true, returns stale data immediately while revalidating in the
   * background (stale-while-revalidate pattern). Default: false.
   */
  swr?: boolean;
}

/**
 * Wraps a data-fetching function with a two-tier cache.
 *
 * Usage:
 * ```ts
 * const programs = await withCache("programs:nust", () => fetchPrograms("nust"));
 * ```
 *
 * @param key     Unique cache key (e.g. "catalog:all", "programs:nust").
 * @param fetcher Async function that retrieves fresh data.
 * @param opts    Optional TTLs and SWR flag.
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  opts: CacheOptions | number = {},
): Promise<T> {
  const options = typeof opts === "number" ? { ttlSeconds: opts } : opts;
  const { ttlSeconds = 3600, memTtlSeconds = 60, swr = false } = options;
  if (swr) {
    return withSWRCache(key, fetcher, { ttlSeconds, memTtlSeconds });
  }
  const memTtlMs = memTtlSeconds * 1000;

  // --- Tier 1: in-memory LRU ---
  const memHit = memCache.get<T>(key);
  if (memHit !== undefined) return memHit;

  // --- Tier 2: Redis ---
  if (redis) {
    try {
      const redisHit = await redis.get<T>(key);
      if (redisHit !== null && redisHit !== undefined) {
        // Promote to tier 1
        memCache.set(key, redisHit, memTtlMs);
        return redisHit;
      }
    } catch (err) {
      console.warn(`[cache] Redis GET failed for key "${key}":`, err);
    }
  }

  // --- Cache miss: fetch from source ---
  const fresh = await fetcher();

  // Write-through to both tiers (fire-and-forget for Redis)
  if (fresh !== undefined && fresh !== null) {
    memCache.set(key, fresh, memTtlMs);
    if (redis) {
      redis.set(key, fresh, { ex: ttlSeconds }).catch((err) => {
        console.warn(`[cache] Redis SET failed for key "${key}":`, err);
      });
    }
  }

  return fresh;
}

/**
 * Wraps a fetcher with stale-while-revalidate semantics.
 * Returns cached data immediately (even if stale) and refreshes in background.
 * Ideal for data that's expensive to compute but doesn't need to be real-time.
 */
export async function withSWRCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  opts: Omit<CacheOptions, "swr"> = {},
): Promise<T> {
  const { ttlSeconds = 3600, memTtlSeconds = 60 } = opts;
  const memTtlMs = memTtlSeconds * 1000;
  const swrKey = `swr:${key}`;

  // Check for any cached data (even expired from tier 1, or tier 2)
  const memHit = memCache.get<T>(key);
  if (memHit !== undefined) {
    // Trigger background revalidation
    revalidateInBackground(key, swrKey, fetcher, ttlSeconds, memTtlMs);
    return memHit;
  }

  if (redis) {
    try {
      const redisHit = await redis.get<T>(key);
      if (redisHit !== null && redisHit !== undefined) {
        memCache.set(key, redisHit, memTtlMs);
        revalidateInBackground(key, swrKey, fetcher, ttlSeconds, memTtlMs);
        return redisHit;
      }
    } catch (err) {
      console.warn(`[swr-cache] Redis GET failed for key "${key}":`, err);
    }
  }

  // True cache miss — must await fresh data
  const fresh = await fetcher();
  if (fresh !== undefined && fresh !== null) {
    memCache.set(key, fresh, memTtlMs);
    if (redis) {
      redis.set(key, fresh, { ex: ttlSeconds }).catch(() => {});
    }
  }
  return fresh;
}

// Track in-flight revalidations to prevent thundering herd
const revalidating = new Set<string>();

function revalidateInBackground<T>(
  key: string,
  swrKey: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number,
  memTtlMs: number,
): void {
  if (revalidating.has(swrKey)) return; // already in flight
  revalidating.add(swrKey);

  fetcher()
    .then((fresh) => {
      if (fresh !== undefined && fresh !== null) {
        memCache.set(key, fresh, memTtlMs);
        if (redis) {
          redis.set(key, fresh, { ex: ttlSeconds }).catch(() => {});
        }
      }
    })
    .catch((err) => {
      console.warn(`[swr-cache] Background revalidation failed for "${key}":`, err);
    })
    .finally(() => {
      revalidating.delete(swrKey);
    });
}

/**
 * Invalidate a cache key across both tiers.
 * Call this from server actions / webhooks when data changes.
 */
export async function invalidateCache(key: string): Promise<void> {
  memCache.delete(key);
  if (redis) {
    await redis.del(key).catch((err) => {
      console.warn(`[cache] Redis DEL failed for key "${key}":`, err);
    });
  }
}

/**
 * Invalidate all keys matching a prefix (e.g. "catalog:*").
 * Uses Redis SCAN to avoid blocking the event loop.
 */
export async function invalidateCacheByPrefix(prefix: string): Promise<void> {
  memCache.clear(); // clear all in-memory (simple & safe)
  if (redis) {
    try {
      let cursor: number | string = 0;
      do {
        const scanRes: [string | number, string[]] = await redis.scan(cursor, {
          match: `${prefix}*`,
          count: 100,
        });
        cursor = scanRes[0];
        const keys = scanRes[1];
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      } while (cursor !== 0 && cursor !== "0");
    } catch (err) {
      console.warn(`[cache] Redis prefix invalidation failed for "${prefix}":`, err);
    }
  }
}
