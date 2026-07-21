import type { MetadataRoute } from "next";
import { categories } from "@/lib/library-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aptrive.com";

  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/calculator",
    "/courses",
    "/courses/nust-net",
    "/library",
    "/practice",
    "/leaderboard",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const libraryRoutes = categories
    .filter((c) => !c.comingSoon)
    .map((c) => ({
      url: `${siteUrl}/library/${c.slug}`,
      lastModified: new Date(),
    }));

  // NOTE: once the Phase 4 course pages (/courses/fast, /courses/giki,
  // /courses/pieas, /courses/comsats, /courses/uet) exist, add them here —
  // e.g. by mapping over lib/universities.ts entries with a matching route.
  return [...staticRoutes, ...libraryRoutes];
}
