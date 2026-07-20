"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Connect this to a real endpoint (see README step "Wire up the contact form")
    // e.g. fetch("/api/contact", { method: "POST", body: new FormData(e.currentTarget) })
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-md border border-teal/30 bg-teal-dim p-6">
        <div className="font-display text-lg font-semibold text-fg">
          Message sent.
        </div>
        <p className="mt-2 text-sm text-muted">
          Aptrive will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="eyebrow">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-2 w-full rounded-sm border border-line bg-panel px-4 py-3 text-sm text-fg outline-none placeholder:text-muted-2 focus:border-teal/50"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label htmlFor="email" className="eyebrow">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-sm border border-line bg-panel px-4 py-3 text-sm text-fg outline-none placeholder:text-muted-2 focus:border-teal/50"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="exam" className="eyebrow">
          Exam of interest
        </label>
        <select
          id="exam"
          name="exam"
          className="mt-2 w-full rounded-sm border border-line bg-panel px-4 py-3 text-sm text-fg outline-none focus:border-teal/50"
          defaultValue="nust-net"
        >
          <option value="nust-net">NUST NET</option>
          <option value="other">Other / not sure yet</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="eyebrow">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="mt-2 w-full rounded-sm border border-line bg-panel px-4 py-3 text-sm text-fg outline-none placeholder:text-muted-2 focus:border-teal/50"
          placeholder="Tell us what you need help with"
        />
      </div>

      <button
        type="submit"
        className="rounded-sm bg-teal px-6 py-3 text-sm font-medium text-graphite transition-opacity hover:opacity-90"
      >
        Send message
      </button>
    </form>
  );
}
