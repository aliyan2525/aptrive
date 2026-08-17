"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { emitHeroSignal } from "./heroSignal";

export default function HeroCTAButtons() {
  function activate() {
    emitHeroSignal({ active: true, source: "cta" });
  }

  function deactivate() {
    emitHeroSignal({ active: false, source: "cta" });
  }

  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
      <Link
        href="/signup"
        onMouseEnter={activate}
        onMouseLeave={deactivate}
        onFocus={activate}
        onBlur={deactivate}
        className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-neutral-900 px-8 text-[15px] font-semibold text-white transition duration-300 [transition-timing-function:var(--ease-smooth)] hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-xl hover:shadow-neutral-900/20 focus:outline-none focus:ring-4 focus:ring-teal-400/25"
      >
        Take the free diagnostic
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
      <Link
        href="/tools/calculator"
        onMouseEnter={activate}
        onMouseLeave={deactivate}
        onFocus={activate}
        onBlur={deactivate}
        className="group inline-flex h-14 items-center justify-center gap-3 rounded-full border border-black/10 bg-white px-8 text-[15px] font-semibold text-neutral-900 transition duration-300 [transition-timing-function:var(--ease-smooth)] hover:-translate-y-0.5 hover:border-black/20 hover:shadow-xl hover:shadow-black/5 focus:outline-none focus:ring-4 focus:ring-teal-400/20"
      >
        Calculate your aggregate
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 transition-transform duration-300 group-hover:scale-110">
          <Play className="h-2.5 w-2.5 fill-white text-white" />
        </span>
      </Link>
    </div>
  );
}

