"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
      <div className="eyebrow">Admin error</div>
      <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        This admin action or page failed to load. No changes were made unless
        confirmed on screen.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button
          onClick={reset}
          className="rounded-sm bg-teal px-6 py-3 text-sm font-medium text-graphite hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/admin"
          className="rounded-sm border border-line-strong px-6 py-3 text-sm font-medium text-fg hover:border-teal/50"
        >
          Back to admin
        </Link>
      </div>
    </div>
  );
}
