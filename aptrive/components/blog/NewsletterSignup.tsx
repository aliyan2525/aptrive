"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Connect this to a real endpoint (same pattern as components/ContactForm.tsx —
    // e.g. fetch("/api/newsletter", { method: "POST", body: new FormData(e.currentTarget) }))
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-md border border-teal/30 bg-teal-dim p-6 text-center">
        <div className="font-display text-lg font-semibold text-fg">You&apos;re on the list.</div>
        <p className="mt-2 text-sm text-muted">New prep guides will land in your inbox.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-md border border-line bg-panel p-6 sm:flex-row sm:items-center"
    >
      <div className="flex-1">
        <p className="font-display text-lg font-semibold text-fg">Get new prep guides by email</p>
        <p className="mt-1 text-sm text-muted">One email a month. No spam, unsubscribe anytime.</p>
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="w-full min-w-0 rounded-sm border border-line bg-graphite px-4 py-2.5 text-sm text-fg outline-none placeholder:text-muted-2 focus:border-teal/50 sm:w-64"
        />
        <button
          type="submit"
          className="shrink-0 rounded-sm bg-teal px-4 py-2.5 text-sm font-medium text-graphite transition-opacity hover:opacity-90"
        >
          Subscribe
        </button>
      </div>
    </form>
  );
}
