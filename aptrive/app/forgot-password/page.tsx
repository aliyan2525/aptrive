"use client";

import { useActionState } from "react";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import { requestPasswordReset, type AuthState } from "@/app/auth/actions";

const initialState: AuthState = { error: null };

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordReset,
    initialState
  );

  return (
    <AuthShell
      eyebrow="Reset password"
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a link to reset it."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="text-teal hover:underline">
            Back to login
          </Link>
        </>
      }
    >
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
          {isPending ? "Sending link…" : "Send reset link"}
        </button>
      </form>
    </AuthShell>
  );
}
