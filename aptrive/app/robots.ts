import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aptrive.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/login",
        "/signup",
        "/signup/check-email",
        "/forgot-password",
        "/forgot-password/check-email",
        "/reset-password",
        "/onboarding",
        "/profile",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
