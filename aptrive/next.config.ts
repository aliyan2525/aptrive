import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // -------------------------------------------------------------------------
  // Performance & Scalability
  // -------------------------------------------------------------------------

  // Compress responses with gzip at the origin. Vercel's edge already does
  // Brotli for static assets; this covers dynamic SSR responses.
  compress: true,

  // Generate ETags for rendered pages — allows CDN + browser to skip
  // re-downloading unchanged content (304 Not Modified).
  generateEtags: true,

  // Reduce client-side JavaScript by stripping console.* and debugger
  // statements from the production bundle.
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },

  // -------------------------------------------------------------------------
  // Image Optimization
  // -------------------------------------------------------------------------

  images: {
    // Serve all optimized images as WebP/AVIF for smaller payloads.
    formats: ["image/avif", "image/webp"],
    // Limit generated sizes to what we actually use — avoids generating
    // hundreds of unused variants that eat memory on the build server.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // External image domains (Supabase storage, etc.)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
    // Aggressively cache optimized images at the CDN edge.
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // -------------------------------------------------------------------------
  // Headers — long-lived caching for static assets
  // -------------------------------------------------------------------------

  async headers() {
    return [
      {
        // Immutable static assets (JS/CSS chunks, fonts, images under _next/).
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            // These files are content-hashed — they never change.
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Public assets (logos, favicon, etc.)
        source: "/logos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },

  // -------------------------------------------------------------------------
  // Experimental / Turbopack
  // -------------------------------------------------------------------------

  turbopack: {
    root: process.cwd(),
  },

  // Output standalone mode for containerized deployments (Docker, k8s).
  // This traces dependencies and produces a minimal node_modules — the
  // resulting image is ~100MB instead of ~1GB+.
  // Uncomment if deploying outside Vercel:
  // output: "standalone",

  // -------------------------------------------------------------------------
  // Redirects — SEO-safe URL migrations
  // -------------------------------------------------------------------------

  async redirects() {
    return [
      // Legacy calculator URL → new tools/ namespace
      {
        source: "/calculator",
        destination: "/tools/calculator",
        permanent: true,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  silent: true,
  org: "aptrive",
  project: "aptrive-website",

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
  widenClientFileUpload: true,
  sourcemaps: {
    disable: true,
  },
});
