"use client";

import { useEffect } from "react";
import { event } from "@/lib/gtag";

/**
 * Fires a GA4 `sign_up` event once, on mount.
 *
 * Rendered on /signup/check-email, which only ever renders right after
 * `signUp()` in app/auth/actions.ts successfully creates the Supabase
 * account and redirects here — email confirmation is still pending, but
 * account creation itself is complete, so this is the right point to
 * count the conversion.
 */
export default function SignupCompleteEvent() {
  useEffect(() => {
    event("sign_up", { method: "email" });
  }, []);

  return null;
}
