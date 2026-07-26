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
    "/courses/fast",
    "/courses/giki",
    "/courses/pieas",
    "/courses/comsats",
    "/courses/uet",
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

  return [...staticRoutes, ...libraryRoutes];
}
