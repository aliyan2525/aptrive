"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { universities, type FormulaComponent } from "@/lib/universities";
import { event as gaEvent } from "@/lib/gtag";
import AssemblingFormulaClient from "@/components/calculator/scene/AssemblingFormulaClient";
import UniversityLogo from "@/components/UniversityLogo";

type MarksState = Record<string, { obtained: string; total: string }>;
type EducationSystem = "local" | "alevel" | "alevel-final";
type CalculatorComponent = FormulaComponent & {
  derived?: "nust-o-level-academic";
};

const segmentPalette = [
  "var(--teal)",
  "var(--gold)",
  "rgba(99, 102, 241, 0.5)",
  "rgba(236, 72, 153, 0.45)",
];

function useAnimatedNumber(target: number, durationMs = 500) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(target);
      return;
    }

    const from = fromRef.current;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (target - from) * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    }

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}

type AggregateCalculatorProps = {
  onResult?: (aggregate: number | null) => void;
};

export default function AggregateCalculator({ onResult }: AggregateCalculatorProps = {}) {
  const [uniId, setUniId] = useState(universities[0].id);
  const [educationSystem, setEducationSystem] = useState<EducationSystem>("local");
  const [marks, setMarks] = useState<MarksState>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<null | {
    aggregate: number;
    breakdown: { label: string; weight: number; pct: number; contribution: number }[];
  }>(null);

  const uni = useMemo(
    () => universities.find((u) => u.id === uniId) ?? universities[0],
    [uniId]
  );

  const activeComponents = useMemo<CalculatorComponent[]>(() => {
    if (uni.id === "nust" && educationSystem === "alevel-final") {
      return [
        {
          key: "olevelAcademic",
          label: "O Level / SSC equivalence",
          weight: 0.25,
          maxMarks: 1100,
          hint: "NUST assigns final-year A Level candidates the full 25% academic weight from O Level equivalence.",
          derived: "nust-o-level-academic",
        },
        { key: "test", label: "NET / ACT / SAT score", weight: 0.75, maxMarks: 200 },
      ];
    }

    if (educationSystem !== "local") {
      return uni.components.map((component) => {
        if (component.key === "matric") {
          return { ...component, label: "O Level / SSC equivalence" };
        }
        if (component.key === "fsc") {
          return { ...component, label: "A Level / HSSC equivalence" };
        }
        if (component.key === "test" && uni.id === "nust") {
          return { ...component, label: "NET / ACT / SAT score" };
        }
        return component;
      });
    }

    return uni.components;
  }, [educationSystem, uni]);

  const activeFormulaText = useMemo(() => {
    if (uni.id === "nust" && educationSystem === "alevel-final") {
      return "O Level equivalence 25% + NET/ACT/SAT 75%";
    }
    if (uni.id === "nust" && educationSystem === "alevel") {
      return "O Level equivalence 10% + A Level equivalence 15% + NET/ACT/SAT 75%";
    }
    if (educationSystem !== "local") {
      return uni.formulaText
        .replace(/Matric|SSC/g, "O Level")
        .replace(/FSc|HSSC|Intermediate/g, "A Level");
    }
    return uni.formulaText;
  }, [educationSystem, uni]);

  const animatedAggregate = useAnimatedNumber(result?.aggregate ?? 0);
  const isUnavailable = !uni.verified || activeComponents.length === 0;

  useEffect(() => {
    onResult?.(result?.aggregate ?? null);
  }, [result, onResult]);

  useEffect(() => {
    const requestedUni = new URLSearchParams(window.location.search).get("uni");
    if (requestedUni && universities.some((university) => university.id === requestedUni)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUniId(requestedUni);
    }
  }, []);

  function resetCalculation() {
    setMarks({});
    setErrors({});
    setResult(null);
  }

  function handleUniChange(id: string) {
    setUniId(id);
    resetCalculation();
  }

  function handleEducationSystemChange(value: EducationSystem) {
    setEducationSystem(value);
    resetCalculation();
  }

  function updateField(key: string, field: "obtained" | "total", value: string) {
    setMarks((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
    setResult(null);
  }

  function handleCalculate() {
    if (isUnavailable) return;

    const newErrors: Record<string, string> = {};
    const breakdown: { label: string; weight: number; pct: number; contribution: number }[] = [];
    let aggregate = 0;

    for (const comp of activeComponents) {
      const entry = marks[comp.key];
      const obtained = Number(entry?.obtained);
      const total = entry?.total ? Number(entry.total) : comp.maxMarks;

      if (!entry?.obtained || Number.isNaN(obtained)) {
        newErrors[comp.key] = "Enter your marks";
        continue;
      }
      if (Number.isNaN(total) || total <= 0) {
        newErrors[comp.key] = "Enter a valid total";
        continue;
      }
      if (obtained > total) {
        newErrors[comp.key] = "Obtained marks cannot exceed total";
        continue;
      }
      if (obtained < 0) {
        newErrors[comp.key] = "Marks cannot be negative";
        continue;
      }

      const pct = (obtained / total) * 100;
      const contribution = pct * comp.weight;
      aggregate += contribution;
      breakdown.push({ label: comp.label, weight: comp.weight, pct, contribution });
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setResult(null);
      return;
    }

    setResult({ aggregate, breakdown });
    gaEvent("calculator_used", {
      university_id: uni.id,
      university_name: uni.name,
      education_system: educationSystem,
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
      <div className="relative overflow-hidden rounded-[1.35rem] border border-white/80 bg-white/76 p-6 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.38)] backdrop-blur-2xl before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_12%_0%,rgba(20,184,166,0.16),transparent_18rem)] md:p-8 lg:p-10">
        <div className="relative">
          <label htmlFor="university" className="eyebrow">
            University
          </label>
          <div className="mt-2 flex items-center gap-3">
            <div className="rounded-2xl border border-black/[0.06] bg-white p-2 shadow-sm">
              <UniversityLogo university={uni.id} displayName={uni.name} size={36} />
            </div>
            <select
              id="university"
              value={uniId}
              onChange={(e) => handleUniChange(e.target.value)}
              className="pressable h-12 w-full rounded-2xl border border-black/[0.08] bg-white/80 px-4 text-sm font-semibold text-fg outline-none transition focus:border-teal/60 focus:ring-4 focus:ring-teal/10"
            >
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} - {u.location}
                </option>
              ))}
            </select>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-muted">
            Formula used: <span className="font-mono-data text-teal">{activeFormulaText}</span>
          </p>

          <div className="mt-6 flex flex-wrap gap-1 rounded-2xl border border-black/[0.06] bg-white/62 p-1 shadow-inner">
            {[
              { id: "local", label: "Matric / FSc" },
              { id: "alevel", label: "O / A Level" },
              { id: "alevel-final", label: "A Level final year" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleEducationSystemChange(option.id as EducationSystem)}
                className={`h-10 rounded-xl px-3 text-xs font-semibold transition sm:px-4 ${
                  educationSystem === option.id
                    ? "bg-neutral-900 text-white shadow-lg shadow-neutral-900/10"
                    : "text-muted hover:bg-white hover:text-fg"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {educationSystem !== "local" && (
            <p className="mt-3 rounded-2xl border border-cyan-500/15 bg-cyan-50/70 px-4 py-3 text-xs leading-relaxed text-slate-600">
              Enter IBCC equivalence marks, not self-calculated grades. NUST tells O/A Level candidates to use IBCC equivalence marks.
            </p>
          )}

          {isUnavailable ? (
            <div className="motion-card mt-8 rounded-2xl border border-gold/30 bg-gold-dim p-5">
              <div className="font-display text-sm font-semibold text-fg">
                Formula not yet confirmed
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{uni.sourceNote}</p>
            </div>
          ) : (
            <form
              className="mt-8 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleCalculate();
              }}
            >
              {activeComponents.map((comp) => {
                const hasError = Boolean(errors[comp.key]);
                return (
                  <div key={comp.key} className="rounded-2xl border border-black/[0.05] bg-white/58 p-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <label htmlFor={`${comp.key}-obtained`} className="text-sm font-semibold text-fg">
                        {comp.label}
                      </label>
                      <span className="font-mono-data text-xs text-muted">
                        {Math.round(comp.weight * 100)}% weight
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        id={`${comp.key}-obtained`}
                        type="number"
                        inputMode="decimal"
                        min={0}
                        placeholder="Obtained"
                        value={marks[comp.key]?.obtained ?? ""}
                        onChange={(e) => updateField(comp.key, "obtained", e.target.value)}
                        aria-invalid={hasError}
                        className={`h-11 w-full rounded-xl border bg-white/80 px-3 text-sm text-fg outline-none transition-colors duration-200 placeholder:text-muted-2 ${
                          hasError
                            ? "border-red-400/60 focus:border-red-400"
                            : "border-line focus:border-teal/50"
                        }`}
                      />
                      <span className="text-muted">/</span>
                      <input
                        id={`${comp.key}-total`}
                        type="number"
                        inputMode="decimal"
                        min={1}
                        placeholder={String(comp.maxMarks)}
                        value={marks[comp.key]?.total ?? ""}
                        onChange={(e) => updateField(comp.key, "total", e.target.value)}
                        aria-label={`Total marks for ${comp.label}`}
                        aria-invalid={hasError}
                        className={`h-11 w-32 rounded-xl border bg-white/80 px-3 text-sm text-fg outline-none transition-colors duration-200 placeholder:text-muted-2 ${
                          hasError
                            ? "border-red-400/60 focus:border-red-400"
                            : "border-line focus:border-teal/50"
                        }`}
                      />
                    </div>
                    {hasError && <p className="mt-2 text-xs text-red-500">{errors[comp.key]}</p>}
                    {comp.hint && !hasError && (
                      <p className="mt-2 text-xs leading-relaxed text-muted-2">{comp.hint}</p>
                    )}
                  </div>
                );
              })}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="pressable rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-neutral-900/10 transition-opacity hover:opacity-90"
                >
                  Calculate
                </button>
                <button
                  type="button"
                  onClick={resetCalculation}
                  className="pressable rounded-full border border-black/[0.08] bg-white/70 px-6 py-3 text-sm font-semibold text-fg hover:border-teal/50"
                >
                  Reset
                </button>
              </div>
            </form>
          )}

          <p className="mt-8 text-xs leading-relaxed text-muted-2">Source: {uni.sourceNote}</p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[1.35rem] border border-white/80 bg-white/70 p-6 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.38)] backdrop-blur-2xl before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_90%_0%,rgba(124,58,237,0.12),transparent_20rem)] md:p-8 lg:p-10">
        <div className="relative">
          <div className="eyebrow">Result</div>

          {!isUnavailable && (
            <AssemblingFormulaClient fragmentCount={activeComponents.length || 3} active={Boolean(result)} />
          )}

          {!result ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
              <div className="mb-5 rounded-3xl border border-black/[0.06] bg-white/70 p-4 shadow-sm">
                <UniversityLogo university={uni.id} displayName={uni.name} size={56} />
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-muted">
                Enter your marks and press Calculate to see your {uni.name} aggregate.
              </p>
            </div>
          ) : (
            <div className="mt-6">
              <div className="font-mono-data text-6xl font-semibold tracking-tight text-teal">
                {animatedAggregate.toFixed(2)}%
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
                Estimated {uni.name} aggregate
              </div>

              <div
                className="mt-6 flex h-3 w-full overflow-hidden rounded-full bg-line"
                role="img"
                aria-label={`Aggregate breakdown: ${result.breakdown
                  .map((row) => `${row.label} contributes ${row.contribution.toFixed(1)} points`)
                  .join(", ")}`}
              >
                {result.breakdown.map((row, i) => (
                  <div
                    key={row.label}
                    className="h-full transition-[width] duration-700 [transition-timing-function:var(--ease-smooth)] first:rounded-l-full last:rounded-r-full"
                    style={{
                      width: `${Math.min(100, row.contribution)}%`,
                      backgroundColor: segmentPalette[i % segmentPalette.length],
                    }}
                  />
                ))}
              </div>

              <div className="mt-6 space-y-4">
                {result.breakdown.map((row, i) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: segmentPalette[i % segmentPalette.length] }}
                      aria-hidden="true"
                    />
                    <div className="flex flex-1 justify-between gap-4 text-xs text-muted">
                      <span>
                        {row.label} ({Math.round(row.weight * 100)}%)
                      </span>
                      <span className="font-mono-data text-fg">
                        {row.pct.toFixed(1)}% to +{row.contribution.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-xs leading-relaxed text-muted-2">
                This is an estimate based on {uni.name}&apos;s reported merit formula. Always confirm your final aggregate against the university&apos;s official admission portal.
              </p>

              <div className="mt-8 rounded-2xl border border-black/[0.06] bg-white/58 p-5">
                <p className="text-sm text-fg">Want to see if this is enough for admission?</p>
                <a
                  href="/tools/estimator"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-teal px-4 py-2 text-sm font-semibold text-graphite transition-transform hover:scale-105 active:scale-95"
                >
                  Check chances in Merit Estimator
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
