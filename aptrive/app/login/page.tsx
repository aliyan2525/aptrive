"use client";

import { useActionState } from "react";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import GoogleIcon from "@/components/auth/GoogleIcon";
import { signIn, signInWithGoogle, type AuthState } from "@/app/auth/actions";

const initialState: AuthState = { error: null };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to Aptrive"
      subtitle="Pick up your practice sets and progress right where you left off."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-teal hover:underline">
            Create account
          </Link>
        </>
      }
    >
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

      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-sm border border-line bg-graphite px-3.5 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-muted-2 focus:border-teal/50"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-xs font-medium uppercase tracking-wide text-muted"
            >
              Password
            </label>
            <Link href="/forgot-password" className="text-xs text-teal hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full rounded-sm border border-line bg-graphite px-3.5 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-muted-2 focus:border-teal/50"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            name="remember"
            defaultChecked
            className="h-4 w-4 rounded-sm border-line-strong bg-graphite accent-teal"
          />
          Remember me
        </label>

        {state?.error && (
          <p
            role="alert"
            className="rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400"
          >
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-sm bg-teal px-4 py-2.5 text-sm font-semibold text-graphite transition-colors hover:bg-teal/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Logging in…" : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}
