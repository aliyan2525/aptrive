"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function DashboardError({
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
    <main className="min-h-[calc(100vh-4rem)] bg-graphite px-4 py-8 md:px-6 md:py-10">
      <div className="container-aptrive flex min-h-[50vh] flex-col items-center justify-center rounded-md border border-line bg-panel p-8 text-center">
        <div className="eyebrow">Dashboard error</div>
        <h1 className="font-display mt-3 text-2xl font-semibold tracking-tight text-fg">
          We couldn&apos;t load your dashboard
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          Something went wrong fetching your progress data. This is usually
          temporary.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-sm bg-teal px-6 py-3 text-sm font-medium text-graphite hover:opacity-90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-sm border border-line-strong px-6 py-3 text-sm font-medium text-fg hover:border-teal/50"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
