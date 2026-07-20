import type { Metadata } from "next";
import AggregateCalculator from "@/components/AggregateCalculator";
import TickDivider from "@/components/TickDivider";
import { universities } from "@/lib/universities";

export const metadata: Metadata = {
  title: "University Aggregate Calculator — Aptrive",
  description:
    "Calculate your admission aggregate for NUST, FAST, COMSATS, UET Lahore, GIKI, PIEAS, NED and more Pakistani universities using each university's official merit formula.",
};

export default function CalculatorPage() {
  return (
    <>
      <section className="container-aptrive py-16 md:py-24">
        <div className="max-w-2xl">
          <div className="eyebrow">Free tool</div>
          <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
            University Aggregate Calculator
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-muted">
            Every Pakistani university weights Matric, Intermediate, and the
            entry test differently. Select your target university below —
            Aptrive uses each one&apos;s own published merit formula, not a
            generic estimate.
          </p>
        </div>

        <div className="mt-14">
          <AggregateCalculator />
        </div>
      </section>

      <TickDivider />

      <section className="container-aptrive py-16 md:py-24">
        <div className="eyebrow">Formulas covered</div>
        <h2 className="font-display mt-3 text-2xl font-semibold tracking-tight text-fg md:text-3xl">
          {universities.length} universities, one calculator
        </h2>

        <div className="mt-10 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 md:grid-cols-3">
          {universities.map((u) => (
            <div key={u.id} className="bg-panel p-5">
              <div className="flex items-center justify-between">
                <span className="font-display text-base font-semibold text-fg">
                  {u.name}
                </span>
                {!u.verified && (
                  <span className="font-mono-data text-[10px] uppercase tracking-[0.1em] text-gold">
                    Unconfirmed
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-muted">{u.formulaText}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-muted-2">
          Formulas are compiled from each university&apos;s published admission
          policy and are kept in one place (<code>lib/universities.ts</code>)
          so they can be corrected or updated in a single spot as policies
          change. Universities marked &quot;Unconfirmed&quot; have conflicting
          or unavailable public information — verify directly with the
          university before relying on the result.
        </p>
      </section>
    </>
  );
}
