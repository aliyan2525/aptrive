/**
 * @deprecated Use `@/lib/cache` instead — it provides a two-tier
 * (in-memory LRU + Redis) cache with SWR support. This module is
 * kept as a thin redirect for backward compatibility.
 */
export { withCache as withRedisCache } from "@/lib/cache";
