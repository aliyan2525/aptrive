import "server-only";
import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Only initialize if we have the environment variables.
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

/**
 * Wraps a data-fetching function with an Upstash Redis cache layer.
 * This is incredibly useful for heavily accessed, non-user-specific data
 * (like the global catalog, university data, and program lists).
 * 
 * If Redis is not configured (e.g. local dev), it bypasses the cache 
 * and directly invokes the fetcher to prevent local environment crashes.
 */
export async function withRedisCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 3600
): Promise<T> {
  if (!redis) {
    // Fallback: no custom Redis caching if not configured.
    return fetcher();
  }

  try {
    const cached = await redis.get<T>(key);
    if (cached) {
      return cached;
    }
  } catch (err) {
    console.warn(`Redis GET failed for key: ${key}`, err);
  }

  const freshData = await fetcher();

  try {
    if (freshData !== undefined && freshData !== null) {
      await redis.set(key, freshData, { ex: ttlSeconds });
    }
  } catch (err) {
    console.warn(`Redis SET failed for key: ${key}`, err);
  }

  return freshData;
}
