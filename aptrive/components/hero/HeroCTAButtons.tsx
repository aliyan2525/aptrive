"use client";

import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import Button from "@/components/ui/Button";
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
        <Button
          href="/signup?source=homepage-diagnostic"
          variant="primary"
          size="lg"
          className="h-14 sm:px-8 shadow-xl"
          magnetic
          onMouseEnter={activate}
          onMouseLeave={deactivate}
          onFocus={activate}
          onBlur={deactivate}
          rightIcon={<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
        >
          See your score for free
        </Button>
        <Button
          href="/tools/calculator"
          variant="ghost"
          size="lg"
          className="h-14 sm:px-8 text-neutral-600 hover:text-neutral-900"
          onMouseEnter={activate}
          onMouseLeave={deactivate}
          onFocus={activate}
          onBlur={deactivate}
          leftIcon={<Calculator className="h-4 w-4" />}
        >
          Calculate your aggregate
        </Button>
      </div>
      <p className="mt-4 text-xs font-medium text-neutral-500 sm:text-sm">Free to start · See your next best study move before you commit to a plan.</p>
    </div>
  );
}

