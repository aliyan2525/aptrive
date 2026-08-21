"use client";

import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import { emitHeroSignal } from "./heroSignal";

export default function HeroCTAButtons() {
  function activate() {
    emitHeroSignal({ active: true, source: "cta" });
  }

  function deactivate() {
    emitHeroSignal({ active: false, source: "cta" });
  }

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <Link
        href="/signup?source=homepage-diagnostic"
        data-cta="homepage-diagnostic"
        onMouseEnter={activate}
        onMouseLeave={deactivate}
        onFocus={activate}
        onBlur={deactivate}
        className="homepage-primary-cta group inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-7 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(76,91,230,.24)] transition duration-300 [transition-timing-function:var(--ease-smooth)] hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(76,91,230,.32)] focus:outline-none focus:ring-4 focus:ring-violet-400/25 sm:px-8"
      >
        See your score for free
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
      <Link
        href="/tools/calculator"
        data-cta="homepage-aggregate-calculator"
        onMouseEnter={activate}
        onMouseLeave={deactivate}
        onFocus={activate}
        onBlur={deactivate}
        className="group inline-flex h-14 items-center justify-center gap-3 rounded-xl border border-black/10 bg-white/85 px-7 text-[15px] font-semibold text-neutral-900 transition duration-300 [transition-timing-function:var(--ease-smooth)] hover:-translate-y-0.5 hover:border-black/20 hover:shadow-xl hover:shadow-black/5 focus:outline-none focus:ring-4 focus:ring-teal-400/20 sm:px-8"
      >
        Calculate your aggregate
        <Calculator className="h-4 w-4 text-neutral-700 transition-transform duration-300 group-hover:scale-110" />
      </Link>
      </div>
      <p className="mt-3 text-xs font-medium text-neutral-500 sm:text-sm">Free to start · See your next best study move before you commit to a plan.</p>
    </div>
  );
}

