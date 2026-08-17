"use client";

import { useActionState } from "react";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import { requestPasswordReset, type AuthState } from "@/app/(marketing)/auth/actions";

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
            className="w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm text-fg outline-none transition placeholder:text-muted-2 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
          />
        </div>

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
          disabled={isPending}
          className="pressable w-full rounded-xl bg-violet-700 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(111,69,255,0.22)] transition hover:-translate-y-0.5 hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Sending link…" : "Send reset link"}
        </button>
      </form>
    </AuthShell>
  );
}
