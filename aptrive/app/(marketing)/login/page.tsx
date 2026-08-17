"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import AuthModeToggle, { type AuthMode } from "@/components/auth/AuthModeToggle";
import GoogleIcon from "@/components/auth/GoogleIcon";
import Button from "@/components/ui/Button";
import { signIn, signInWithGoogle, type AuthState } from "@/app/(marketing)/auth/actions";

const initialState: AuthState = { error: null };

const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm text-fg outline-none transition placeholder:text-muted-2 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10";

const labelClass =
  "mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("student");
  const [state, formAction, isPending] = useActionState(signIn, initialState);
  const [next, setNext] = useState<string | null>(null);

  useEffect(() => {
    const nextParam = new URLSearchParams(window.location.search).get("next");
    // Query-string data is only available in the browser runtime.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNext(nextParam);
  }, []);

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to Aptrive"
      subtitle="Pick up your practice right where you left off."
      maxWidth="max-w-lg"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-teal hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <div className="mb-7 rounded-2xl border border-neutral-200/80 bg-neutral-50/80 p-1.5">
        <AuthModeToggle mode={mode} onChange={setMode} />
      </div>

      {/* Keyed so the enter-up animation replays on every mode switch,
          matching the reveal treatment used elsewhere in the app. */}
      <div key={mode} className="motion-card" style={{ animationDuration: "0.35s" }}>
        {mode === "student" ? (
          <>
            <form action={signInWithGoogle}>
              <button
                type="submit"
                className="pressable flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-800 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <span className="h-px flex-1 bg-line" />
              <span className="font-mono-data text-xs uppercase tracking-wide text-muted-2">
                or
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>
          </>
        ) : (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-muted">
              Admin access is restricted to staff accounts (instructor,
              content manager, or administrator). Sign-in attempts are
              logged for security.
            </p>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="mode" value={mode} />
          {next && <input type="hidden" name="next" value={next} />}

          <div>
            <label htmlFor="email" className={labelClass}>
              {mode === "admin" ? "Admin email" : "Email"}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={mode === "admin" ? "admin@aptrive.com" : "you@example.com"}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          {mode === "student" && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  name="rememberMe"
                  value="true"
                  defaultChecked
                  className="h-4 w-4 rounded border-neutral-300 accent-violet-600"
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-sm text-teal hover:underline">
                Forgot password?
              </Link>
            </div>
          )}

          {state?.error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {state.error}
            </p>
          )}

          <Button type="submit" variant="primary" fullWidth loading={isPending}>
            {mode === "admin" ? "Log in as admin" : "Log in"}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
