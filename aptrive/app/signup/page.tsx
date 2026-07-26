"use client";

import { useActionState } from "react";
import { useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import GoogleIcon from "@/components/auth/GoogleIcon";
import { signUp, signInWithGoogle, type AuthState } from "@/app/auth/actions";

const initialState: AuthState = { error: null };

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);
  const [agreed, setAgreed] = useState(false);

  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your account"
      subtitle="Join Aptrive and start practicing for NET, ECAT, MDCAT and more."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-teal hover:underline">
            Log in
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
            htmlFor="fullName"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted"
          >
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            placeholder="Ali Raza"
            className="w-full rounded-sm border border-line bg-graphite px-3.5 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-muted-2 focus:border-teal/50"
          />
        </div>

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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full rounded-sm border border-line bg-graphite px-3.5 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-muted-2 focus:border-teal/50"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full rounded-sm border border-line bg-graphite px-3.5 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-muted-2 focus:border-teal/50"
            />
          </div>
        </div>
        <p className="text-xs text-muted-2">Must be at least 8 characters.</p>

        <label className="flex items-start gap-2 text-sm text-muted">
          <input
            type="checkbox"
            required
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded-sm border-line-strong bg-graphite accent-teal"
          />
          <span>
            I agree to Aptrive&apos;s{" "}
            <Link href="/terms" className="text-teal hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-teal hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
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
          disabled={isPending || !agreed}
          className="w-full rounded-sm bg-teal px-4 py-2.5 text-sm font-semibold text-graphite transition-colors hover:bg-teal/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
