"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function LeaderboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-aptrive flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="eyebrow">Rankings unavailable</div>
      <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">We could not load the rankings just now.</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-muted">The Rankings page will recover without changing your account or practice history. Try again or continue with a focused session.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={reset} className="inline-flex h-11 items-center justify-center rounded-xl bg-violet-700 px-5 text-sm font-semibold text-white hover:bg-violet-800">Try again</button><Link href="/practice" className="inline-flex h-11 items-center justify-center rounded-xl border border-line bg-white px-5 text-sm font-semibold text-fg hover:border-violet-300">Go to Practice</Link></div>
    </section>
  );
}
