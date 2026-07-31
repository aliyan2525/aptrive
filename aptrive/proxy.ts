import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  let response = await updateSession(request);

  const nonce = crypto.randomUUID().replace(/-/g, "");
  const isProd = process.env.NODE_ENV === "production";
  
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http: 'unsafe-inline' ${isProd ? '' : "'unsafe-eval'"};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    connect-src 'self' https:;
    worker-src 'self' blob:;
    frame-ancestors 'none';
    form-action 'self';
  `.replace(/\s{2,}/g, ' ').trim();

  request.headers.set("x-nonce", nonce);
  request.headers.set("Content-Security-Policy", cspHeader);

  if (response.status >= 300 && response.status < 400) {
    return response;
  }

  const newResponse = NextResponse.next({
    request: {
      headers: request.headers,
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
