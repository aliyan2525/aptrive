import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";

import { cache } from "react";

/**
 * Supabase client for use in Server Components, Server Actions, and
 * Route Handlers. Must be created fresh on every call (it reads the
 * request's cookies via next/headers).
 *
 * Pass `{ persistSession: false }` (e.g. "Remember me" left unchecked
 * on the login form) to drop the cookie's maxAge/expires so the
 * browser treats it as a session cookie — cleared on browser close —
 * instead of the default persistent one.
 */
export const createClient = cache(async (options?: { persistSession?: boolean }) => {
  const cookieStore = await cookies();
  const persistSession = options?.persistSession ?? true;

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options: cookieOptions }) => {
              const finalOptions = persistSession
                ? cookieOptions
                : { ...cookieOptions, maxAge: undefined, expires: undefined };
              cookieStore.set(name, value, finalOptions);
            });
          } catch {
            // `setAll` was called from a Server Component render.
            // This is safe to ignore because middleware (see
            // lib/supabase/middleware.ts) refreshes the session on
            // every request instead.
          }
        },
      },
    }
  );
});

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client for static generation and cached queries.
 * Does NOT read cookies, so it doesn't opt routes into dynamic rendering.
 */
export function createStaticClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      }
    }
  );
}
