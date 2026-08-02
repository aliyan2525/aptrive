import type { Metadata } from "next";
import AggregateCalculator from "@/components/AggregateCalculator";
import TickDivider from "@/components/TickDivider";
import UniversityLogo from "@/components/UniversityLogo";
import { universities } from "@/lib/universities";

export const metadata: Metadata = {
  title: "University Aggregate Calculator - Aptrive",
  description:
    "Calculate your admission aggregate for NUST, FAST, COMSATS, UET Lahore, GIKI, PIEAS, NED and more Pakistani universities using each university's merit formula.",
};

export default function CalculatorPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_84%_10%,rgba(45,212,191,0.18),transparent_28rem),radial-gradient(circle_at_16%_12%,rgba(124,58,237,0.10),transparent_24rem)] py-16 md:py-24">
        <div className="container-aptrive">
          <div className="max-w-2xl">
            <div className="eyebrow">Free tool</div>
            <h1 className="font-display mt-3 text-4xl font-bold tracking-normal text-fg md:text-5xl">
              University <span className="aurora-text">Aggregate Calculator</span>
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              Calculate admission aggregate for Matric/FSc and O/A Level streams.
              For NUST, Aptrive follows the official NET basis weightage and the
              final-year A Level O Level equivalence rule.
            </p>
          </div>

          <div className="mt-14">
            <AggregateCalculator />
          </div>
        </div>
      </section>

      <TickDivider />

      <section className="container-aptrive py-16 md:py-24">
        <div className="eyebrow">Formulas covered</div>
        <h2 className="font-display mt-3 text-2xl font-semibold tracking-tight text-fg md:text-3xl">
          {universities.length} universities, one calculator
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {universities.map((u) => (
            <div key={u.id} className="premium-shell motion-card rounded-[1.35rem] p-5">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl border border-black/[0.06] bg-white p-2 shadow-sm">
                  <UniversityLogo university={u.id} displayName={u.name} size={44} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-display text-base font-semibold text-fg">
                      {u.name}
                    </span>
                    {!u.verified && (
                      <span className="font-mono-data shrink-0 text-[10px] uppercase tracking-[0.1em] text-gold">
                        Unconfirmed
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted">{u.fullName}</p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-black/[0.04] bg-white/55 p-4">
                <p className="text-xs font-semibold text-fg">{u.location}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted">{u.formulaText}</p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 text-[11px] text-muted-2">
                <span>{u.website}</span>
                {!u.verified && <span>Verify before relying</span>}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-muted-2">
          Formulas are compiled from each university&apos;s published admission
          policy and kept in <code>lib/universities.ts</code> so they can be
          corrected in one place as policies change. Universities marked
          Unconfirmed have conflicting or unavailable public information.
        </p>
      </section>
    </>
  );
}
