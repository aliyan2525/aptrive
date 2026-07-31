"use client";

import { useMemo, useState } from "react";
import { nustPrograms, NUST_MERIT_SOURCE_NOTE } from "@/lib/nust-programs";
import { estimateNustAdmissionChance, CHANCE_COLORS } from "@/lib/merit-chance";

export default function MeritEstimator() {
  const [aggregate, setAggregate] = useState<string>("");
  const [programCode, setProgramCode] = useState<string>("");

  const groupedNustPrograms = useMemo(() => {
    const groups: Record<string, typeof nustPrograms> = {};
    for (const program of nustPrograms) {
      if (!groups[program.category]) groups[program.category] = [];
      groups[program.category].push(program);
    }
    return Object.keys(groups)
      .sort()
      .map((category) => ({
        category,
        programs: groups[category].sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
      }));
  }, []);

  const selectedProgram = useMemo(
    () => nustPrograms.find((p) => p.code === programCode) ?? null,
    [programCode]
  );

  const parsedAggregate = parseFloat(aggregate);
  const isValidAggregate = !isNaN(parsedAggregate) && parsedAggregate > 0 && parsedAggregate <= 100;

  const chanceResult = useMemo(() => {
    if (!selectedProgram || !isValidAggregate) return null;
    return estimateNustAdmissionChance(parsedAggregate, selectedProgram);
  }, [selectedProgram, isValidAggregate, parsedAggregate]);

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="rounded-xl border border-line bg-panel p-6 md:p-8">
        <h2 className="font-display text-2xl font-semibold text-fg">
          NUST Merit Estimator
        </h2>
        <p className="mt-2 text-sm text-muted">
          Enter your estimated aggregate to see your chances of admission for a specific program.
        </p>

        <div className="mt-8">
          <label htmlFor="aggregate" className="block text-sm text-fg">
            Your Aggregate (%)
          </label>
          <input
            id="aggregate"
            type="number"
            step="0.01"
            placeholder="75.5"
            value={aggregate}
            onChange={(e) => setAggregate(e.target.value)}
            className="mt-2 w-full rounded-sm border border-line bg-panel-2 px-4 py-3 text-sm text-fg outline-none transition-colors duration-200 placeholder:text-muted-2 focus:border-teal/50"
          />
        </div>

        <div className="mt-6">
          <label htmlFor="program" className="block text-sm text-fg">
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
        </div>

        {selectedProgram && isValidAggregate && chanceResult ? (
          <div className="motion-card mt-8 rounded-md border border-line bg-panel-2 p-5">
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
          <p className="mt-6 text-xs leading-relaxed text-muted-2">
            Enter your aggregate and pick a program above to see your estimated chance of
            admission against last cycle&apos;s closing merit.
          </p>
        )}
      </div>
    </div>
  );
}
