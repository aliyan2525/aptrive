"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  groupedNustPrograms,
  NUST_MERIT_SOURCE_NOTE,
  type NustProgram,
} from "@/lib/nust-programs";
import { estimateNustAdmissionChance, CHANCE_COLORS } from "@/lib/merit-chance";
import { useAnimatedNumber } from "@/lib/hooks/useAnimatedNumber";
import { event as gaEvent } from "@/lib/gtag";

type MeritEstimatorProps = {
  /** Latest aggregate handed down from AggregateCalculator, or null if
   * nothing's been computed there yet. Purely a convenience prefill —
   * the field underneath is always freely editable. */
  calculatorAggregate?: number | null;
};

const DEFAULT_AGGREGATE = 70;

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

/** Position (0–100) of `value` along a [min, max] track, clamped. */
function trackPct(value: number, min: number, max: number) {
  if (max <= min) return 50;
  return clamp(((value - min) / (max - min)) * 100, 0, 100);
}

export default function MeritEstimator({ calculatorAggregate }: MeritEstimatorProps) {
  const [aggregateInput, setAggregateInput] = useState(String(DEFAULT_AGGREGATE));
  const [programCode, setProgramCode] = useState("");
  const [lastAppliedFromCalculator, setLastAppliedFromCalculator] = useState<number | null>(null);

  // Auto-fill from the calculator the first time (or whenever) it
  // produces a new number — but never fight the user if they've since
  // typed their own value in here.
  useEffect(() => {
    if (calculatorAggregate == null) return;
    if (calculatorAggregate === lastAppliedFromCalculator) return;
    setAggregateInput(calculatorAggregate.toFixed(2));
    setLastAppliedFromCalculator(calculatorAggregate);
  }, [calculatorAggregate, lastAppliedFromCalculator]);

  const aggregate = useMemo(() => {
    const n = Number(aggregateInput);
    return Number.isFinite(n) ? clamp(n, 0, 100) : 0;
  }, [aggregateInput]);

  const selectedProgram: NustProgram | null = useMemo(
    () => groupedNustPrograms.flatMap((g) => g.programs).find((p) => p.code === programCode) ?? null,
    [programCode]
  );

  const chanceResult = useMemo(() => {
    if (!selectedProgram) return null;
    return estimateNustAdmissionChance(aggregate, selectedProgram);
  }, [aggregate, selectedProgram]);

  useEffect(() => {
    if (selectedProgram) {
      gaEvent("merit_estimator_used", {
        program_code: selectedProgram.code,
        program_name: selectedProgram.name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programCode]);

  const animatedAggregate = useAnimatedNumber(aggregate);
  const animatedMargin = useAnimatedNumber(chanceResult?.margin ?? 0);

  const chanceColor = chanceResult ? CHANCE_COLORS[chanceResult.chance] : "var(--muted)";

  // Track bounds for the position gauge: a little padding past the
  // program's top merit and past whichever is lower — the closing
  // merit or the user's own aggregate — so the marker never pins to
  // the very edge of the track.
  const track = useMemo(() => {
    if (!selectedProgram) return null;
    const low = Math.min(selectedProgram.lastMerit.cummAggregate, aggregate) - 4;
    const high = Math.max(selectedProgram.topMerit.cummAggregate, aggregate) + 3;
    return { min: low, max: high };
  }, [selectedProgram, aggregate]);

  function useCalculatorValue() {
    if (calculatorAggregate == null) return;
    setAggregateInput(calculatorAggregate.toFixed(2));
    setLastAppliedFromCalculator(calculatorAggregate);
  }

  const showCalculatorHint =
    calculatorAggregate != null && Math.abs(calculatorAggregate - aggregate) > 0.005;

  return (
    <div id="merit-estimator" className="scroll-mt-24">
      <div className="grid gap-8 md:grid-cols-2 md:gap-10">
        {/* INPUT PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-md border border-line bg-panel p-6 md:p-8"
        >
          <label htmlFor="merit-aggregate" className="eyebrow">
            Your aggregate
          </label>

          <div className="mt-3 flex items-baseline gap-2">
            <input
              id="merit-aggregate"
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              step={0.01}
              value={aggregateInput}
              onChange={(e) => setAggregateInput(e.target.value)}
              className="w-32 rounded-sm border border-line bg-panel-2 px-3 py-2 font-mono-data text-2xl text-fg outline-none transition-colors duration-200 focus:border-teal/50"
            />
            <span className="font-mono-data text-2xl text-muted">%</span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={aggregate}
            onChange={(e) => setAggregateInput(e.target.value)}
            className="mt-4 w-full accent-teal"
            aria-label="Aggregate slider"
          />

          <AnimatePresence>
            {showCalculatorHint && (
              <motion.button
                type="button"
                onClick={useCalculatorValue}
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.25 }}
                className="pressable flex w-full items-center justify-between overflow-hidden rounded-sm border border-teal/25 bg-teal-dim px-4 py-2.5 text-xs text-fg"
              >
                <span>
                  Use your calculated aggregate —{" "}
                  <span className="font-mono-data text-teal">
                    {calculatorAggregate!.toFixed(2)}%
                  </span>
                </span>
                <span className="text-teal">Apply →</span>
              </motion.button>
            )}
          </AnimatePresence>

          <div className="mt-8 tick-rule" />

          <label htmlFor="merit-program" className="mt-8 block eyebrow">
            Preferred program
          </label>
          <select
            id="merit-program"
            value={programCode}
            onChange={(e) => setProgramCode(e.target.value)}
            className="pressable mt-3 w-full rounded-sm border border-line bg-panel-2 px-4 py-3 text-sm text-fg outline-none focus:border-teal/50"
          >
            <option value="">Select a NUST program…</option>
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

          <p className="mt-6 text-xs leading-relaxed text-muted-2">
            Program-level chance estimation is available for NUST for now —
            it&apos;s the only university with real per-program closing-merit
            data on hand. {NUST_MERIT_SOURCE_NOTE}
          </p>
        </motion.div>

        {/* RESULT PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-md border border-line bg-panel p-6 md:p-8"
        >
          {/* Ambient glow that tints toward the current chance color —
              the panel's own subtle "mood lighting". */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl"
            animate={{
              backgroundColor: chanceColor,
              opacity: selectedProgram ? 0.16 : 0.05,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          <div className="relative eyebrow">Merit estimator</div>

          {!selectedProgram ? (
            <div className="relative flex h-full min-h-[280px] flex-col items-center justify-center text-center">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="font-mono-data text-4xl text-muted-2"
              >
                ⟡
              </motion.div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
                Pick a program to see your estimated admission chance against
                last cycle&apos;s closing merit.
              </p>
            </div>
          ) : (
            <div className="relative mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={chanceResult?.chance}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3"
                >
                  <motion.span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: chanceColor }}
                    animate={{
                      boxShadow: [
                        `0 0 0px ${chanceColor}`,
                        `0 0 14px ${chanceColor}`,
                        `0 0 0px ${chanceColor}`,
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    aria-hidden="true"
                  />
                  <span
                    className="font-display text-2xl font-semibold"
                    style={{ color: chanceColor }}
                  >
                    {chanceResult?.label} chance
                  </span>
                </motion.div>
              </AnimatePresence>

              <p className="mt-2 text-xs leading-relaxed text-muted">
                {chanceResult?.description}
              </p>

              <div className="mt-3 font-mono-data text-sm text-muted">
                Margin vs. closing merit:{" "}
                <span style={{ color: chanceColor }}>
                  {animatedMargin >= 0 ? "+" : ""}
                  {animatedMargin.toFixed(2)} pts
                </span>
              </div>

              {/* Position gauge — a horizontal track showing where the
                  user's aggregate lands relative to last cycle's top
                  and closing merit for the selected program. */}
              {track && (
                <div className="mt-8">
                  <div className="relative h-2 w-full rounded-full bg-line">
                    <div
                      className="h-full rounded-full"
                      style={{
                        background:
                          "linear-gradient(to right, var(--danger), var(--warning), var(--gold), var(--success), var(--teal))",
                        opacity: 0.35,
                      }}
                    />
                    {/* Closing merit tick */}
                    <div
                      className="absolute top-1/2 h-3.5 w-0.5 -translate-y-1/2 bg-fg/70"
                      style={{
                        left: `${trackPct(selectedProgram.lastMerit.cummAggregate, track.min, track.max)}%`,
                      }}
                      title="Closing merit (last cycle)"
                    />
                    {/* Top merit tick */}
                    <div
                      className="absolute top-1/2 h-3.5 w-0.5 -translate-y-1/2 bg-fg/40"
                      style={{
                        left: `${trackPct(selectedProgram.topMerit.cummAggregate, track.min, track.max)}%`,
                      }}
                      title="Top merit (last cycle)"
                    />
                    {/* User's aggregate marker */}
                    <motion.div
                      className="absolute top-1/2 flex -translate-y-1/2 -translate-x-1/2 flex-col items-center"
                      initial={false}
                      animate={{ left: `${trackPct(aggregate, track.min, track.max)}%` }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <motion.div
                        className="h-4 w-4 rounded-full border-2 border-graphite"
                        style={{ backgroundColor: chanceColor }}
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </motion.div>
                  </div>

                  <div className="mt-2 flex justify-between font-mono-data text-[10px] uppercase tracking-[0.08em] text-muted-2">
                    <span>{track.min.toFixed(0)}%</span>
                    <span>{track.max.toFixed(0)}%</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-2.5 w-0.5 bg-fg/70" /> Closing merit
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-2.5 w-0.5 bg-fg/40" /> Top merit
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: chanceColor }}
                      />{" "}
                      Your aggregate
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-8 tick-rule" />

              <div className="mt-6 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-muted-2">Your aggregate</div>
                  <div className="mt-1 font-mono-data text-base text-fg">
                    {animatedAggregate.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div className="text-muted-2">Top merit</div>
                  <div className="mt-1 font-mono-data text-base text-fg">
                    {selectedProgram.topMerit.cummAggregate.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div className="text-muted-2">Closing merit</div>
                  <div className="mt-1 font-mono-data text-base text-fg">
                    {selectedProgram.lastMerit.cummAggregate.toFixed(2)}%
                  </div>
                </div>
              </div>

              <p className="mt-8 text-xs leading-relaxed text-muted-2">
                Chance is a heuristic based on last cycle&apos;s closing merit
                for {selectedProgram.name}, not a guarantee — cutoffs shift
                every admission cycle. Always confirm against
                ugadmissions.nust.edu.pk before making a decision.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
