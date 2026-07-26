"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function PracticeError({
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
    <section className="container-aptrive flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="eyebrow">Practice error</div>
      <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
        Something interrupted your session
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        We couldn&apos;t load or save this practice session. Your progress up
        to the last answered question should still be saved — try again, or
        head back to practice.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          onClick={reset}
          className="rounded-sm bg-teal px-6 py-3 text-sm font-medium text-graphite hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/practice"
          className="rounded-sm border border-line-strong px-6 py-3 text-sm font-medium text-fg hover:border-teal/50"
        >
          Back to practice
        </Link>
      </div>
    </section>
  );
}
