import type { Metadata } from "next";
import { ArrowRight, Calculator, Sparkles } from "lucide-react";
import AggregateCalculator from "@/components/AggregateCalculator";
import TickDivider from "@/components/TickDivider";
import UniversityLogo from "@/components/UniversityLogo";
import { universities } from "@/lib/universities";

export const metadata: Metadata = {
  title: "University Aggregate Calculator - Aptrive",
  description: "Calculate your admission aggregate for NUST, FAST, COMSATS, UET Lahore, GIKI, PIEAS, NED and more Pakistani universities using each university's merit formula.",
};

export default function CalculatorPage() {
  return (
    <main className="relative overflow-hidden bg-[radial-gradient(circle_at_84%_10%,rgba(191,246,239,0.42),transparent_28rem),radial-gradient(circle_at_16%_12%,rgba(221,228,255,0.68),transparent_26rem),linear-gradient(180deg,#ffffff_0%,#f7faff_54%,#eef3ff_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.032)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.032)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_76%,transparent)]" />
      <section className="container-aptrive relative z-10 pb-16 pt-24 md:pb-24 md:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="eyebrow">Free tool / decision support</div>
          <h1 className="mt-5 font-display text-[3.15rem] font-semibold leading-[0.98] tracking-[-0.06em] text-fg sm:text-6xl lg:text-[5.6rem]">
            University <span className="aurora-text">Aggregate Calculator</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">
            Calculate your admission aggregate for Matric/FSc and O/A Level streams. For NUST, Aptrive follows the official NET basis weightage and final-year A Level equivalence rule.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/85 bg-white/72 px-3.5 py-2 text-xs font-semibold text-muted shadow-sm backdrop-blur-xl"><Calculator className="h-3.5 w-3.5 text-violet-600" /> Built around published merit formulas <Sparkles className="h-3.5 w-3.5 text-teal-600" /></div>
        </div>
        <div className="mt-12 md:mt-16"><AggregateCalculator /></div>
      </section>

      <TickDivider />

      <section className="container-aptrive relative z-10 py-16 md:py-24">
        <div className="flex flex-col gap-4 border-b border-line pb-8 md:flex-row md:items-end md:justify-between"><div><div className="eyebrow">Formulas covered</div><h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-fg md:text-4xl">{universities.length} universities, one calculator.</h2></div><a href="#formula-directory" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:gap-3">Browse formula directory <ArrowRight className="h-4 w-4" /></a></div>
        <div id="formula-directory" className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {universities.map((university) => (
            <div key={university.id} className="premium-shell motion-card rounded-[1.35rem] border border-white/80 bg-white/72 p-5 shadow-[0_14px_38px_rgba(62,72,130,0.07)] backdrop-blur-xl"><div className="flex items-start gap-4"><div className="rounded-2xl border border-white bg-white p-2 shadow-sm"><UniversityLogo university={university.id} displayName={university.name} size={44} /></div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><span className="font-display text-base font-semibold text-fg">{university.name}</span>{!university.verified && <span className="font-mono-data shrink-0 text-[10px] uppercase tracking-[0.1em] text-gold">Unconfirmed</span>}</div><p className="mt-1 text-xs text-muted">{university.fullName}</p></div></div><div className="mt-5 rounded-2xl border border-white/80 bg-white/58 p-4"><p className="text-xs font-semibold text-fg">{university.location}</p><p className="mt-2 text-xs leading-relaxed text-muted">{university.formulaText}</p></div><p className="mt-4 truncate text-[11px] text-muted-2">{university.website}</p></div>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-muted-2">Formulas are compiled from each university&apos;s published admission policy and kept in <code>lib/universities.ts</code> so they can be corrected in one place as policies change.</p>
      </section>
    </main>
  );
}
