"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Root error boundary. Catches any error thrown while rendering a route
 * segment under app/ that doesn't have its own closer error.tsx (see
 * dashboard/, practice/, admin/ for scoped ones). Without this, an
 * unhandled Supabase/repository throw falls through to Next's generic
 * unstyled crash screen.
 */
export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with real error reporting (Sentry, etc.) — logging to
    // console is the minimum so failures aren't silent in prod.
    console.error(error);
  }, [error]);

  return (
    <section className="container-aptrive flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="eyebrow">Error</div>
      <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        We hit an unexpected error loading this page. You can try again, or
        head back to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
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
    </section>
  );
}
