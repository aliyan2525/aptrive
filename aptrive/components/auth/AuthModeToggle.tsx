"use client";

import { GraduationCap, ShieldCheck } from "lucide-react";

export type AuthMode = "student" | "admin";

/**
 * Two-segment "Student Login / Admin Login" switch. The active pill
 * slides via a single translating indicator (transform, not
 * width/left) so it stays on the GPU-accelerated path and respects
 * prefers-reduced-motion through the shared --ease-smooth curve used
 * everywhere else in this codebase.
 */
export default function AuthModeToggle({
  mode,
  onChange,
}: {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Choose login type"
      className="relative grid grid-cols-2 rounded-full border border-line-strong bg-panel-2 p-1"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-teal shadow-[0_6px_20px_rgba(35,213,196,0.24)] transition-transform duration-300 [transition-timing-function:var(--ease-smooth)]"
        style={{
          transform: mode === "admin" ? "translateX(100%)" : "translateX(0%)",
        }}
      />

      <button
        type="button"
        role="tab"
        aria-selected={mode === "student"}
        onClick={() => onChange("student")}
        className={`relative z-10 flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
          mode === "student" ? "text-graphite" : "text-muted hover:text-fg"
        }`}
      >
        <GraduationCap className="h-4 w-4" aria-hidden="true" />
        Student Login
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={mode === "admin"}
        onClick={() => onChange("admin")}
        className={`relative z-10 flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
          mode === "admin" ? "text-graphite" : "text-muted hover:text-fg"
        }`}
      >
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        Admin Login
      </button>
    </div>
  );
}
