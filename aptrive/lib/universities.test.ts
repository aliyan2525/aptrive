import { describe, it, expect } from "vitest";
import {
  universities,
  resolveUniversityByCourseSlug,
  getCourseSlugForUniversity,
  getAllCourseSlugs,
} from "@/lib/universities";

describe("universities database and utility functions", () => {
  it("should contain all major verified Pakistani universities", () => {
    expect(universities.length).toBeGreaterThanOrEqual(10);
    const nust = universities.find((u) => u.id === "nust");
    expect(nust).toBeDefined();
    expect(nust?.verified).toBe(true);
  });

  it("should have total weights summing to 1.0 for all verified formulas", () => {
    const verifiedUnis = universities.filter((u) => u.verified && u.components.length > 0);
    for (const uni of verifiedUnis) {
      const totalWeight = uni.components.reduce((sum, c) => sum + c.weight, 0);
      expect(Math.abs(totalWeight - 1.0)).toBeLessThan(0.01);
    }
  });

  it("should resolve university by course slug aliases correctly", () => {
    expect(resolveUniversityByCourseSlug("nust-net")?.id).toBe("nust");
    expect(resolveUniversityByCourseSlug("uet")?.id).toBe("uet-lahore");
    expect(resolveUniversityByCourseSlug("fast")?.id).toBe("fast");
    expect(resolveUniversityByCourseSlug("non-existent")).toBeUndefined();
  });

  it("should generate proper course slugs for universities", () => {
    expect(getCourseSlugForUniversity("nust")).toBe("nust-net");
    expect(getCourseSlugForUniversity("uet-lahore")).toBe("uet");
    expect(getCourseSlugForUniversity("comsats")).toBe("comsats");
  });

  it("should return a comprehensive set of all course slugs", () => {
    const allSlugs = getAllCourseSlugs();
    expect(allSlugs).toContain("nust-net");
    expect(allSlugs).toContain("uet");
    expect(allSlugs).toContain("comsats");
  });
});
