import { Suspense } from "react";
import type { Metadata } from "next";
import MeritEstimator from "@/components/MeritEstimator";
import TickDivider from "@/components/TickDivider";
import { nustPrograms } from "@/lib/nust-programs";

export const metadata: Metadata = {
  title: "Merit Estimator — Aptrive",
  description:
    "Estimate your chances of admission to NUST and other top Pakistani universities based on historical merit cutoffs.",
};

export default function EstimatorPage() {
  return (
    <>
      <section className="container-aptrive py-16 md:py-24">
        <div className="max-w-2xl">
          <div className="eyebrow">Free tool</div>
          <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
            Merit Estimator
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-muted">
            Cutoffs shift every admission cycle, but historical trends provide the best baseline for setting your target score. See how your aggregate stacks up against last year&apos;s closing merits.
          </p>
        </div>

        <div className="mt-14">
          <Suspense fallback={null}>
            <MeritEstimator />
          </Suspense>
        </div>
      </section>

      <TickDivider />

      <section className="container-aptrive py-16 md:py-24">
        <div className="eyebrow">Data transparency</div>
        <h2 className="font-display mt-3 text-2xl font-semibold tracking-tight text-fg md:text-3xl">
          Based on real closing merits
        </h2>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
          Our estimator uses closing merit data published directly by the universities at the end of their last admission cycle. Currently supporting {nustPrograms.length} NUST programs.
        </p>
        
        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-muted-2">
          Disclaimer: Aptrive provides chance estimations based on historical data. This is not a guarantee of admission. Final cutoffs will vary depending on the applicant pool for the current year.
        </p>
      </section>
    </>
  );
}
