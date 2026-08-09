import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { checkRateLimit } from "@/lib/rate-limit";

export async function proxy(request: NextRequest) {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    // Limit to 30 requests per minute
    const { allowed, retryAfterSeconds } = await checkRateLimit(`global-mut:${ip}`, 30, 60);
    if (!allowed) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": retryAfterSeconds.toString(),
        },
      });
    }
  }

  const response = await updateSession(request);

  const isProd = process.env.NODE_ENV === "production";
  
  const cspHeader = `
    default-src 'self';
    script-src 'self' https: http: 'unsafe-inline' ${isProd ? "" : "'unsafe-eval'"};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    connect-src 'self' https:;
    worker-src 'self' blob:;
    frame-ancestors 'none';
    form-action 'self';
  `.replace(/\s{2,}/g, ' ').trim();

  if (response.status >= 300 && response.status < 400) {
    response.headers.set("Content-Security-Policy", cspHeader);
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "origin-when-cross-origin");
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), browsing-topics=()"
    );
    return response;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const newResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.cookies.getAll().forEach(cookie => {
    newResponse.cookies.set(cookie.name, cookie.value);
  });

  newResponse.headers.set("Content-Security-Policy", cspHeader);
  newResponse.headers.set("X-Frame-Options", "DENY");
  newResponse.headers.set("X-Content-Type-Options", "nosniff");
  newResponse.headers.set("Referrer-Policy", "origin-when-cross-origin");
  newResponse.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  newResponse.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );

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
