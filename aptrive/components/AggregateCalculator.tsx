"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { universities } from "@/lib/universities";
import { nustPrograms, NUST_MERIT_SOURCE_NOTE } from "@/lib/nust-programs";
import { estimateNustAdmissionChance, CHANCE_COLORS } from "@/lib/merit-chance";
import { event as gaEvent } from "@/lib/gtag";
import AssemblingFormulaClient from "@/components/calculator/scene/AssemblingFormulaClient";
import UniversityLogo from "@/components/UniversityLogo";

type MarksState = Record<string, { obtained: string; total: string }>;

const segmentPalette = [
  "var(--teal)",
  "var(--gold)",
  "rgba(243, 245, 242, 0.4)",
  "rgba(35, 213, 196, 0.55)",
];

/**
 * Animates a number toward `target` instead of snapping to it, so the
 * result panel feels like it's "computing" rather than just appearing.
 * Respects prefers-reduced-motion by jumping straight to the value.
 */
function useAnimatedNumber(target: number, durationMs = 500) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      // This effect *is* the animation driver (the rAF loop below calls
      // setState every frame, which is unavoidable for a JS-driven
      // number tween); this branch is just its "skip the animation"
      // path when the user has reduced motion enabled.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(target);
      return;
    }

    const from = fromRef.current;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out-cubic
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
  /** Called with the freshly computed aggregate whenever Calculate
   * succeeds, and with null whenever the result is cleared (Reset,
   * switching university, or editing a field after a calculation) —
   * lets a parent use this as a prefill source elsewhere on the page. */
  onResult?: (aggregate: number | null) => void;
};

export default function AggregateCalculator({ onResult }: AggregateCalculatorProps) {
  const searchParams = useSearchParams();
  const requestedUni = searchParams.get("uni");
  const initialUniId =
    requestedUni && universities.some((u) => u.id === requestedUni)
      ? requestedUni
      : universities[0].id;

  const [uniId, setUniId] = useState(initialUniId);
  const [marks, setMarks] = useState<MarksState>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<null | {
    aggregate: number;
    breakdown: { label: string; weight: number; pct: number; contribution: number }[];
  }>(null);
  const [programCode, setProgramCode] = useState<string>("");

  const uni = useMemo(
    () => universities.find((u) => u.id === uniId) ?? universities[0],
    [uniId]
  );

  // Program-level chance estimator is currently NUST-only — that's the
  // only university with real per-program merit-list data on hand.
  const hasProgramData = uni.id === "nust";

  const selectedProgram = useMemo(
    () => nustPrograms.find((p) => p.code === programCode) ?? null,
    [programCode]
  );

  const chanceResult = useMemo(() => {
    if (!result || !selectedProgram) return null;
    return estimateNustAdmissionChance(result.aggregate, selectedProgram);
  }, [result, selectedProgram]);

  const groupedNustPrograms = useMemo(() => {
    const groups: { category: string; programs: typeof nustPrograms }[] = [];
    for (const program of nustPrograms) {
      let group = groups.find((g) => g.category === program.category);
      if (!group) {
        group = { category: program.category, programs: [] };
        groups.push(group);
      }
      group.programs.push(program);
    }
    return groups;
  }, []);

  const animatedAggregate = useAnimatedNumber(result?.aggregate ?? 0);

  useEffect(() => {
    onResult?.(result?.aggregate ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  function handleUniChange(id: string) {
    setUniId(id);
    setMarks({});
    setErrors({});
    setResult(null);
    setProgramCode("");
  }

  function updateField(key: string, field: "obtained" | "total", value: string) {
    setMarks((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
    setResult(null);
  }

  function handleReset() {
    setMarks({});
    setErrors({});
    setResult(null);
  }

  function handleCalculate() {
    if (!uni.verified || uni.components.length === 0) return;

    const newErrors: Record<string, string> = {};
    const breakdown: { label: string; weight: number; pct: number; contribution: number }[] = [];
    let aggregate = 0;

    for (const comp of uni.components) {
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
        newErrors[comp.key] = "Obtained marks can't exceed total";
        continue;
      }
      if (obtained < 0) {
        newErrors[comp.key] = "Marks can't be negative";
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
    });
  }

  const isUnavailable = !uni.verified || uni.components.length === 0;

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-10">
      {/* INPUT PANEL */}
      <div className="motion-card rounded-md border border-line bg-panel p-6 md:p-8">
        <label htmlFor="university" className="eyebrow">
          University
        </label>
        <div className="mt-2 flex items-center gap-3">
          <UniversityLogo university={uni.id} displayName={uni.name} size={40} />
          <select
            id="university"
            value={uniId}
            onChange={(e) => handleUniChange(e.target.value)}
            className="pressable w-full rounded-sm border border-line bg-panel-2 px-4 py-3 text-sm text-fg outline-none focus:border-teal/50"
          >
            {universities.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.location}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-muted">
          Formula used: <span className="font-mono-data text-teal">{uni.formulaText}</span>
        </p>

        {isUnavailable ? (
          <div className="motion-card mt-8 rounded-md border border-gold/30 bg-gold-dim p-5">
            <div className="font-display text-sm font-semibold text-fg">
              Formula not yet confirmed
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {uni.sourceNote}
            </p>
          </div>
        ) : (
          <form
            className="mt-8 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleCalculate();
            }}
          >
            {uni.components.map((comp) => {
              const hasError = Boolean(errors[comp.key]);
              return (
                <div key={comp.key}>
                  <div className="flex items-baseline justify-between">
                    <label htmlFor={`${comp.key}-obtained`} className="text-sm text-fg">
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
                      className={`w-full rounded-sm border bg-panel-2 px-3 py-2 text-sm text-fg outline-none transition-colors duration-200 placeholder:text-muted-2 ${
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
                      aria-invalid={hasError}
                      className={`w-32 rounded-sm border bg-panel-2 px-3 py-2 text-sm text-fg outline-none transition-colors duration-200 placeholder:text-muted-2 ${
                        hasError
                          ? "border-red-400/60 focus:border-red-400"
                          : "border-line focus:border-teal/50"
                      }`}
                    />
                  </div>
                  {hasError && (
                    <p className="mt-1 animate-[enter-up_0.25s_ease_both] text-xs text-red-400">
                      {errors[comp.key]}
                    </p>
                  )}
                </div>
              );
            })}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="pressable rounded-sm bg-teal px-6 py-3 text-sm font-medium text-graphite transition-opacity hover:opacity-90"
              >
                Calculate
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="pressable rounded-sm border border-line-strong px-6 py-3 text-sm font-medium text-fg hover:border-teal/50"
              >
                Reset
              </button>
            </div>
          </form>
        )}

        <p className="mt-8 text-xs leading-relaxed text-muted-2">
          Source: {uni.sourceNote}
        </p>
      </div>

      {/* RESULT PANEL */}
      <div className="motion-card rounded-md border border-line bg-panel p-6 md:p-8">
        <div className="eyebrow">Result</div>

        {!isUnavailable && (
          <AssemblingFormulaClient
            fragmentCount={uni.components.length || 3}
            active={Boolean(result)}
          />
        )}

        {!result ? (
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center">
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Enter your marks and press Calculate to see your {uni.name} aggregate.
            </p>
          </div>
        ) : (
          <div className="mt-6">
            <div className="font-mono-data text-5xl font-medium text-teal">
              {animatedAggregate.toFixed(2)}%
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
              Estimated {uni.name} aggregate
            </div>

            {/* Segmented contribution bar — each component's share of
                the 100-point aggregate, drawn to scale and colour-coded
                to match the rows below it. */}
            <div
              className="mt-6 flex h-2.5 w-full overflow-hidden rounded-full bg-line"
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

            <div className="mt-8 tick-rule" />

            <div className="mt-6 space-y-4">
              {result.breakdown.map((row, i) => (
                <div key={row.label} className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: segmentPalette[i % segmentPalette.length] }}
                    aria-hidden="true"
                  />
                  <div className="flex flex-1 justify-between text-xs text-muted">
                    <span>
                      {row.label} ({Math.round(row.weight * 100)}%)
                    </span>
                    <span className="font-mono-data text-fg">
                      {row.pct.toFixed(1)}% → +{row.contribution.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-xs leading-relaxed text-muted-2">
              This is an estimate based on {uni.name}&apos;s reported merit formula.
              Always confirm your final aggregate against the university&apos;s
              official admission portal before making decisions.
            </p>

            {hasProgramData ? (
              <div className="mt-10 border-t border-line pt-8">
                <div className="eyebrow">Merit estimator</div>
                <label htmlFor="program" className="mt-4 block text-sm text-fg">
                  Target program
                </label>
                <select
                  id="program"
                  value={programCode}
                  onChange={(e) => setProgramCode(e.target.value)}
                  className="pressable mt-2 w-full rounded-sm border border-line bg-panel-2 px-4 py-3 text-sm text-fg outline-none focus:border-teal/50"
                >
                  <option value="">Select a program…</option>
                  {groupedNustPrograms.map((group) => (
                    <optgroup key={group.category} label={group.category}>
                      {group.programs.map((program) => (
                        <option key={program.code} value={program.code}>
                          {program.name} — {program.code}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>

                {selectedProgram && chanceResult ? (
                  <div className="motion-card mt-5 rounded-md border border-line bg-panel-2 p-5">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: CHANCE_COLORS[chanceResult.chance] }}
                        aria-hidden="true"
                      />
                      <span
                        className="font-display text-lg font-semibold"
                        style={{ color: CHANCE_COLORS[chanceResult.chance] }}
                      >
                        {chanceResult.label} chance
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      {chanceResult.description}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="text-muted-2">Top merit (last cycle)</div>
                        <div className="mt-1 font-mono-data text-fg">
                          {selectedProgram.topMerit.cummAggregate.toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-2">Closing merit (last cycle)</div>
                        <div className="mt-1 font-mono-data text-fg">
                          {selectedProgram.lastMerit.cummAggregate.toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-xs leading-relaxed text-muted-2">
                      Chance is an estimate based on last cycle&apos;s closing merit
                      for this program, not a guarantee — cutoffs shift every
                      admission cycle. {NUST_MERIT_SOURCE_NOTE}
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-xs leading-relaxed text-muted-2">
                    Pick a program above to see your estimated chance of
                    admission against last cycle&apos;s closing merit.
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-6 text-xs leading-relaxed text-muted-2">
                Program-level chance estimation is available for NUST for now.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
