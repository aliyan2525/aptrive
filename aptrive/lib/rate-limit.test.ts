import { describe, it, expect } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  it("should allow requests under the defined limit", async () => {
    const key = `test-ip-${Date.now()}`;
    const res1 = await checkRateLimit(key, 3, 60);
    expect(res1.allowed).toBe(true);
    expect(res1.retryAfterSeconds).toBe(0);

    const res2 = await checkRateLimit(key, 3, 60);
    expect(res2.allowed).toBe(true);

    const res3 = await checkRateLimit(key, 3, 60);
    expect(res3.allowed).toBe(true);
  });

  it("should block requests exceeding the limit", async () => {
    const key = `test-block-ip-${Date.now()}`;
    await checkRateLimit(key, 2, 60);
    await checkRateLimit(key, 2, 60);

    const resOver = await checkRateLimit(key, 2, 60);
    expect(resOver.allowed).toBe(false);
    expect(resOver.retryAfterSeconds).toBeGreaterThan(0);
  });
});
