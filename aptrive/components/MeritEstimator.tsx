"use client";

import { useMemo, useState } from "react";
import { BarChart3, CheckCircle2, CircleHelp, GraduationCap, ShieldCheck, Sparkles, Target, TrendingUp } from "lucide-react";
import { nustPrograms, NUST_MERIT_SOURCE_NOTE } from "@/lib/nust-programs";
import { estimateNustAdmissionChance, CHANCE_COLORS } from "@/lib/merit-chance";

export default function MeritEstimator() {
  const [aggregate, setAggregate] = useState<string>("");
  const [programCode, setProgramCode] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

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
        programs: groups[category].sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, []);

  const selectedProgram = useMemo(
    () => nustPrograms.find((program) => program.code === programCode) ?? null,
    [programCode]
  );

  const parsedAggregate = parseFloat(aggregate);
  const isValidAggregate = !Number.isNaN(parsedAggregate) && parsedAggregate > 0 && parsedAggregate <= 100;
  const chanceResult = useMemo(() => {
    if (!selectedProgram || !isValidAggregate) return null;
    return estimateNustAdmissionChance(parsedAggregate, selectedProgram);
  }, [selectedProgram, isValidAggregate, parsedAggregate]);
  const canEstimate = isValidAggregate && Boolean(selectedProgram);
  const benchmarkGap = selectedProgram && isValidAggregate
    ? parsedAggregate - selectedProgram.lastMerit.cummAggregate
    : null;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="grid overflow-hidden rounded-[2rem] border border-white/85 bg-white/78 shadow-[0_28px_90px_rgba(62,72,130,0.16)] backdrop-blur-2xl lg:grid-cols-[0.78fr_1.22fr]">
        <div className="relative p-5 sm:p-7 md:p-9">
          <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-teal-200/25 blur-3xl" />
          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="eyebrow">Decision support</span>
                <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.04em] text-fg sm:text-3xl">
                  NUST <span className="aurora-text">Merit Estimator</span>
                </h2>
              </div>
              <span className="hidden rounded-full bg-violet-500/10 px-3 py-1.5 font-mono-data text-[10px] font-bold uppercase tracking-[0.16em] text-violet-700 sm:inline-flex">
                NUST / live estimate
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted">
              Enter your estimated aggregate to see how your score compares with a specific program’s historical closing merit.
            </p>

            <form
              className="mt-8"
              onSubmit={(event) => {
                event.preventDefault();
                setHasSubmitted(true);
              }}
            >
              <label htmlFor="aggregate" className="block text-sm font-semibold text-fg">
                Your aggregate (%)
              </label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 rounded-lg bg-violet-500/10 px-2 py-1 text-sm font-bold text-violet-700">%</span>
                <input
                  id="aggregate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="75.5"
                  value={aggregate}
                  onChange={(event) => {
                    setAggregate(event.target.value);
                    setHasSubmitted(false);
                  }}
                  className="h-12 w-full rounded-2xl border border-line bg-white/82 pl-14 pr-4 text-sm font-semibold text-fg outline-none transition placeholder:text-muted-2 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <label htmlFor="program" className="mt-6 block text-sm font-semibold text-fg">
                Target program
              </label>
              <div className="relative mt-2">
                <GraduationCap className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-600" aria-hidden="true" />
                <select
                  id="program"
                  value={programCode}
                  onChange={(event) => {
                    setProgramCode(event.target.value);
                    setHasSubmitted(false);
                  }}
                  className="pressable h-12 w-full appearance-none rounded-2xl border border-line bg-white/82 pl-11 pr-4 text-sm text-fg outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
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

              <button
                type="submit"
                className="pressable mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-blue-600 to-teal-500 px-5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(79,70,229,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(79,70,229,0.3)] sm:w-auto"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Estimate chance
              </button>
            </form>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-violet-200/60 bg-violet-50/55 p-4 text-xs leading-5 text-muted">
              <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" aria-hidden="true" />
              <span>{hasSubmitted && !canEstimate ? "Enter a valid aggregate (0–100) and select a target program before estimating." : "Use your latest calculated aggregate for a more useful estimate."}</span>
            </div>
          </div>
        </div>

        <div className="relative min-h-[520px] overflow-hidden bg-[radial-gradient(circle_at_86%_14%,rgba(191,246,239,0.42),transparent_18rem),radial-gradient(circle_at_16%_82%,rgba(221,228,255,0.68),transparent_24rem),linear-gradient(145deg,rgba(248,250,255,0.9),rgba(239,244,255,0.74))] p-5 sm:p-7 md:p-9">
          <div className="pointer-events-none absolute right-10 top-12 h-56 w-56 rounded-full border border-white/70 bg-white/20 shadow-[0_0_70px_rgba(99,102,241,0.1)]" />
          <div className="relative">
            <div className="flex items-center justify-between gap-4">
              <span className="eyebrow">Result</span>
              <span className="rounded-full bg-violet-500/10 px-3 py-1.5 font-mono-data text-[10px] font-bold uppercase tracking-[0.16em] text-violet-700">NUST / live estimate</span>
            </div>

            <div className="mt-8 rounded-[1.6rem] border border-white/85 bg-white/55 p-5 shadow-[0_16px_45px_rgba(62,72,130,0.09)] backdrop-blur-xl sm:p-7">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="text-sm font-semibold text-fg">Your estimated aggregate</p>
                  <p className="mt-2 font-display text-6xl font-semibold tracking-[-0.07em] text-fg sm:text-7xl">
                    {canEstimate ? `${parsedAggregate.toFixed(1)}%` : "--"}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-3 py-1.5 text-xs font-semibold text-teal-700">
                    <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                    {benchmarkGap !== null ? (benchmarkGap >= 0 ? "Above benchmark" : "Below benchmark") : "Competitive score"}
                  </div>
                </div>
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-white/80 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,.94),rgba(174,224,255,.54)_35%,rgba(117,92,240,.22)_66%,transparent_72%)] shadow-[0_0_40px_rgba(112,120,255,.2)] sm:h-40 sm:w-40">
                  <TrendingUp className="h-10 w-10 text-violet-600/80 sm:h-12 sm:w-12" aria-hidden="true" />
                </div>
              </div>

              {chanceResult && selectedProgram ? (
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <BreakdownMetric icon={<GraduationCap className="h-4 w-4" />} label="Top merit" value={`${selectedProgram.topMerit.cummAggregate.toFixed(2)}%`} tone="violet" />
                  <BreakdownMetric icon={<BarChart3 className="h-4 w-4" />} label="Closing merit" value={`${selectedProgram.lastMerit.cummAggregate.toFixed(2)}%`} tone="teal" />
                  <BreakdownMetric icon={<Target className="h-4 w-4" />} label="Your position" value={chanceResult.label} tone="blue" />
                </div>
              ) : (
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <BreakdownMetric icon={<GraduationCap className="h-4 w-4" />} label="Top merit" value="—" tone="violet" />
                  <BreakdownMetric icon={<BarChart3 className="h-4 w-4" />} label="Closing merit" value="—" tone="teal" />
                  <BreakdownMetric icon={<Target className="h-4 w-4" />} label="Your position" value="Awaiting input" tone="blue" />
                </div>
              )}
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/85 bg-white/58 p-4 shadow-[0_12px_30px_rgba(62,72,130,0.07)]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-700"><ShieldCheck className="h-4 w-4" aria-hidden="true" /></span>
              <div>
                <p className="text-sm font-semibold text-fg">{chanceResult ? `${chanceResult.label} admission signal` : "Enter your score to see a benchmark"}</p>
                <p className="mt-1 text-xs leading-5 text-muted">{chanceResult?.description ?? "Historical closing merits help you set a focused target, but they are not a guarantee of admission."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-5 text-xs leading-relaxed text-muted-2">{NUST_MERIT_SOURCE_NOTE}</p>
    </div>
  );
}

function BreakdownMetric({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "teal" | "blue" | "violet" }) {
  const toneClasses = { teal: "bg-teal-500/10 text-teal-700", blue: "bg-blue-500/10 text-blue-700", violet: "bg-violet-500/10 text-violet-700" } as const;
  return (
    <div className="rounded-2xl border border-white/80 bg-white/62 p-3.5 text-center shadow-sm">
      <span className={`mx-auto flex h-9 w-9 items-center justify-center rounded-xl ${toneClasses[tone]}`}>{icon}</span>
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold text-fg">{value}</p>
    </div>
  );
}
