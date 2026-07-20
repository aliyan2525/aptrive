"use client";

import { useActionState } from "react";
import AuthShell from "@/components/auth/AuthShell";
import { updatePassword, type AuthState } from "@/app/auth/actions";

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
            className="w-full rounded-sm border border-line bg-graphite px-3.5 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-muted-2 focus:border-teal/50"
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
          {isPending ? "Updating…" : "Update password"}
        </button>
      </form>
    </AuthShell>
  );
}
