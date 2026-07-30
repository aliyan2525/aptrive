import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vitals.vercel-insights.com https://www.googletagmanager.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https:;
      font-src 'self' data:;
      connect-src 'self' https:;
      worker-src 'self' blob:;
      frame-ancestors 'none';
      form-action 'self';
    `;
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          }
        ],
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
