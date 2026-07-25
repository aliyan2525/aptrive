"use client";

import { useState } from "react";
import AggregateCalculator from "@/components/AggregateCalculator";
import MeritEstimator from "@/components/MeritEstimator";
import TickDivider from "@/components/TickDivider";

/**
 * Glues the aggregate calculator to the merit estimator below it: holds
 * the last computed aggregate in state and hands it down as a prefill,
 * without the two components needing to know about each other directly.
 */
export default function CalculatorWithMeritEstimator() {
  const [aggregate, setAggregate] = useState<number | null>(null);

  return (
    <>
      <AggregateCalculator onResult={setAggregate} />

      <div className="my-16 md:my-24">
        <TickDivider />
      </div>

      <div>
        <div className="eyebrow">Free tool</div>
        <h2 className="font-display mt-3 text-2xl font-semibold tracking-tight text-fg md:text-3xl">
          Merit estimator
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Enter any aggregate — your calculated one above, or one you already
          know — pick a NUST program, and see how it stacks up against last
          cycle&apos;s closing merit.
        </p>

        <div className="mt-10">
          <MeritEstimator calculatorAggregate={aggregate} />
        </div>
      </div>
    </>
  );
}
