import type { Metadata } from "next";
import { BarChart3, ShieldCheck, Sparkles } from "lucide-react";
import MeritEstimator from "@/components/MeritEstimator";
import TickDivider from "@/components/TickDivider";
import { nustPrograms } from "@/lib/nust-programs";

export const metadata: Metadata = {
  title: "Merit Estimator — Aptrive",
  description: "Estimate your chances of admission to NUST and other top Pakistani universities based on historical merit cutoffs.",
};

export default function EstimatorPage() {
  return (
    <main className="relative overflow-hidden bg-[radial-gradient(circle_at_12%_10%,rgba(124,58,237,0.12),transparent_28rem),radial-gradient(circle_at_88%_22%,rgba(45,212,191,0.42),transparent_26rem),linear-gradient(180deg,#ffffff_0%,#f7faff_54%,#eef3ff_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.032)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.032)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_76%,transparent)]" />
      <section className="container-aptrive relative z-10 pb-16 pt-24 md:pb-24 md:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="eyebrow">Free tool / decision support</div>
          <h1 className="mt-5 font-display text-[3.15rem] font-semibold leading-[0.98] tracking-[-0.06em] text-fg sm:text-6xl lg:text-[5.6rem]">
            Merit <span className="aurora-text">Estimator</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">
            Cutoffs shift every admission cycle, but historical trends provide the best baseline for setting your target score. See how your aggregate stacks up against last year&apos;s closing merits.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/85 bg-white/72 px-3.5 py-2 text-xs font-semibold text-muted shadow-sm backdrop-blur-xl"><BarChart3 className="h-3.5 w-3.5 text-violet-600" /> Based on real closing merit data <Sparkles className="h-3.5 w-3.5 text-teal-600" /></div>
        </div>
        <div className="mt-12 md:mt-16"><MeritEstimator /></div>
      </section>

      <TickDivider />

      <section className="container-aptrive relative z-10 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="eyebrow">Data transparency</div>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-fg md:text-4xl">Based on real closing merits.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted">Our estimator uses closing merit data published directly by the universities at the end of their last admission cycle. Currently supporting {nustPrograms.length} NUST programs.</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/72 px-5 py-4 shadow-sm backdrop-blur-xl"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-700"><ShieldCheck className="h-5 w-5" /></span><div className="text-left"><p className="text-xs font-bold text-fg">Verified data</p><p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Official sources</p></div></div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/72 px-5 py-4 shadow-sm backdrop-blur-xl"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-700"><BarChart3 className="h-5 w-5" /></span><div className="text-left"><p className="text-xs font-bold text-fg">{nustPrograms.length} Programs</p><p className="text-[10px] font-semibold text-muted uppercase tracking-wider">NUST coverage</p></div></div>
          </div>
          <p className="mx-auto mt-12 max-w-2xl text-xs leading-relaxed text-muted-2 italic">Disclaimer: Aptrive provides chance estimations based on historical data. This is not a guarantee of admission. Final cutoffs will vary depending on the applicant pool for the current year.</p>
        </div>
      </section>
    </main>
  );
}
