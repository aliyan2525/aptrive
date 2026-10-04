import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// ---------------------------------------------------------------------------
// Security headers applied to every response. Defined once, reused across
// both redirect and non-redirect branches.
// ---------------------------------------------------------------------------

function securityHeaders(isProd: boolean): Record<string, string> {
  // CSP: locked down to specific origins instead of blanket https:/http:.
  // nonce-based inline would be ideal but requires per-request generation
  // that Next.js's Metadata API doesn't yet support cleanly — 'unsafe-inline'
  // is scoped to styles only; scripts use strict domain allowlists.
  const csp = [
    "default-src 'self'",
    [
      "script-src 'self'",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://va.vercel-scripts.com",
      // Next.js injects inline scripts for __NEXT_DATA__ — required for hydration.
      "'unsafe-inline'",
      isProd ? "" : "'unsafe-eval'",
    ]
      .filter(Boolean)
      .join(" "),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https:",
    "font-src 'self' data:",
    [
      "connect-src 'self'",
      "https://*.supabase.co",
      "https://www.google-analytics.com",
      "https://va.vercel-scripts.com",
      "https://vitals.vercel-insights.com",
    ].join(" "),
    "worker-src 'self' blob:",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "upgrade-insecure-requests",
  ].join("; ");

  return {
    "Content-Security-Policy": csp,
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "origin-when-cross-origin",
    "Strict-Transport-Security":
      "max-age=63072000; includeSubDomains; preload",
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  };
}

function applyHeaders(
  response: NextResponse,
  headers: Record<string, string>,
): void {
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export async function middleware(request: NextRequest) {
  const isProd = process.env.NODE_ENV === "production";
  const headers = securityHeaders(isProd);

  // --- Supabase session refresh + auth gate ---------------------------------
  const response = await updateSession(request);

  // Redirect responses (auth gate fired) — apply headers and return.
  if (response.status >= 300 && response.status < 400) {
    applyHeaders(response, headers);
    return response;
  }

  // --- Non-redirect: build a new response with security headers -------------
  const requestHeaders = new Headers(request.headers);
  // Forward CSP as a request header so server components can read it if needed.
  requestHeaders.set("Content-Security-Policy", headers["Content-Security-Policy"]);

  const newResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Carry over cookies set by Supabase (session refresh tokens).
  response.cookies.getAll().forEach((cookie) => {
    newResponse.cookies.set(cookie.name, cookie.value);
  });

  applyHeaders(newResponse, headers);

  // --- Cache-Control for static marketing pages -----------------------------
  // Vercel's Edge Network will cache these at the CDN, reducing origin hits.
  const path = request.nextUrl.pathname;
  const isStaticMarketing =
    path === "/" ||
    path === "/about" ||
    path === "/contact" ||
    path === "/privacy" ||
    path === "/terms" ||
    path.startsWith("/courses") ||
    path.startsWith("/blog") ||
    path.startsWith("/universities");

  if (isStaticMarketing && isProd) {
    // s-maxage = CDN cache for 10 min; stale-while-revalidate = serve stale
    // for up to 1 hour while revalidating in background.
    newResponse.headers.set(
      "Cache-Control",
      "public, s-maxage=600, stale-while-revalidate=3600",
    );
  }

  return newResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets and image files,
     * so the Supabase session cookie stays fresh on every navigation.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
