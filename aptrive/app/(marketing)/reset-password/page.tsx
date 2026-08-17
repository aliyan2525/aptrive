"use client";

import { useActionState } from "react";
import AuthShell from "@/components/auth/AuthShell";
import { updatePassword, type AuthState } from "@/app/(marketing)/auth/actions";

const initialState: AuthState = { error: null };

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    updatePassword,
    initialState
  );

  return (
    <AuthShell
      eyebrow="Almost done"
      title="Set a new password"
      subtitle="Choose a new password for your Aptrive account."
    >
      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted"
          >
            New password
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
            Confirm new password
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
          {isPending ? "Updating…" : "Update password"}
        </button>
      </form>
    </AuthShell>
  );
}
