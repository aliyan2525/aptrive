"use client";

import { useActionState } from "react";
import { useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import GoogleIcon from "@/components/auth/GoogleIcon";
import { signUp, signInWithGoogle, type AuthState } from "@/app/(marketing)/auth/actions";

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
            className="w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm text-fg outline-none transition placeholder:text-muted-2 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
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
            className="w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm text-fg outline-none transition placeholder:text-muted-2 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
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
              className="w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm text-fg outline-none transition placeholder:text-muted-2 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
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
              className="w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm text-fg outline-none transition placeholder:text-muted-2 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
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
            className="mt-0.5 h-4 w-4 rounded border-neutral-300 accent-violet-600"
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
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending || !agreed}
          className="pressable w-full rounded-xl bg-violet-700 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(111,69,255,0.22)] transition hover:-translate-y-0.5 hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
