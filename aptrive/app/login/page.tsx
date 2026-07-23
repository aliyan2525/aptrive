"use client";

import { Suspense, useActionState, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import AuthModeToggle, { type AuthMode } from "@/components/auth/AuthModeToggle";
import GoogleIcon from "@/components/auth/GoogleIcon";
import Button from "@/components/ui/Button";
import { signIn, signInWithGoogle, type AuthState } from "@/app/auth/actions";

const initialState: AuthState = { error: null };

const inputClass =
  "w-full rounded-sm border border-line bg-graphite px-3.5 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-muted-2 focus:border-teal/50";

const labelClass =
  "mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted";

export default function LoginPage() {
  // useSearchParams requires a Suspense boundary in the App Router.
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [mode, setMode] = useState<AuthMode>("student");
  const [state, formAction, isPending] = useActionState(signIn, initialState);
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

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
      <div className="mb-6">
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
                className="flex w-full items-center justify-center gap-3 rounded-sm border border-line-strong bg-panel-2 px-4 py-2.5 text-sm font-medium text-fg transition-colors hover:border-teal/40 hover:bg-teal-dim"
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-line" />
              <span className="font-mono-data text-xs uppercase tracking-wide text-muted-2">
                or
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>
          </>
        ) : (
          <div className="mb-6 flex items-start gap-3 rounded-sm border border-gold/30 bg-gold-dim px-3.5 py-3">
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
                  className="h-4 w-4 rounded-sm border-line-strong bg-graphite accent-teal"
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
              className="rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400"
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
