import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on every request except static assets and image optimization
     * files, which never need a session refresh or auth/onboarding
     * check. Kept broad (rather than only matching /dashboard, /admin,
     * /login, /signup) because updateSession() also needs to run on
     * every request to keep the Supabase session cookie refreshed —
     * see the "IMPORTANT" comment in lib/supabase/middleware.ts.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
