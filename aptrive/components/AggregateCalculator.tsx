"use client";

import { useMemo, useState } from "react";
import { universities } from "@/lib/universities";

type MarksState = Record<string, { obtained: string; total: string }>;

export default function AggregateCalculator() {
  const [uniId, setUniId] = useState(universities[0].id);
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

  function handleUniChange(id: string) {
    setUniId(id);
    setMarks({});
    setErrors({});
    setResult(null);
  }

  function updateField(key: string, field: "obtained" | "total", value: string) {
    setMarks((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
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
  }

  const isUnavailable = !uni.verified || uni.components.length === 0;

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-10">
      {/* INPUT PANEL */}
      <div className="rounded-md border border-line bg-panel p-6 md:p-8">
        <label htmlFor="university" className="eyebrow">
          University
        </label>
        <select
          id="university"
          value={uniId}
          onChange={(e) => handleUniChange(e.target.value)}
          className="mt-2 w-full rounded-sm border border-line bg-panel-2 px-4 py-3 text-sm text-fg outline-none focus:border-teal/50"
        >
          {universities.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} — {u.location}
            </option>
          ))}
        </select>

        <p className="mt-3 text-xs leading-relaxed text-muted">
          Formula used: <span className="font-mono-data text-teal">{uni.formulaText}</span>
        </p>

        {isUnavailable ? (
          <div className="mt-8 rounded-md border border-gold/30 bg-gold-dim p-5">
            <div className="font-display text-sm font-semibold text-fg">
              Formula not yet confirmed
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {uni.sourceNote}
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {uni.components.map((comp) => (
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
                    className="w-full rounded-sm border border-line bg-panel-2 px-3 py-2 text-sm text-fg outline-none placeholder:text-muted-2 focus:border-teal/50"
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
                    className="w-32 rounded-sm border border-line bg-panel-2 px-3 py-2 text-sm text-fg outline-none placeholder:text-muted-2 focus:border-teal/50"
                  />
                </div>
                {errors[comp.key] && (
                  <p className="mt-1 text-xs text-red-400">{errors[comp.key]}</p>
                )}
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleCalculate}
                className="rounded-sm bg-teal px-6 py-3 text-sm font-medium text-graphite transition-opacity hover:opacity-90"
              >
                Calculate
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-sm border border-line-strong px-6 py-3 text-sm font-medium text-fg hover:border-teal/50"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        <p className="mt-8 text-xs leading-relaxed text-muted-2">
          Source: {uni.sourceNote}
        </p>
      </div>

      {/* RESULT PANEL */}
      <div className="rounded-md border border-line bg-panel p-6 md:p-8">
        <div className="eyebrow">Result</div>

        {!result ? (
          <div className="mt-10 flex h-full flex-col items-center justify-center text-center">
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Enter your marks and press Calculate to see your {uni.name} aggregate.
            </p>
          </div>
        ) : (
          <div className="mt-6">
            <div className="font-mono-data text-5xl font-medium text-teal">
              {result.aggregate.toFixed(2)}%
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
              Estimated {uni.name} aggregate
            </div>

            <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-1.5 rounded-full bg-teal transition-all"
                style={{ width: `${Math.min(result.aggregate, 100)}%` }}
              />
            </div>

            <div className="mt-8 tick-rule" />

            <div className="mt-6 space-y-4">
              {result.breakdown.map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between text-xs text-muted">
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
          </div>
        )}
      </div>
    </div>
  );
}
