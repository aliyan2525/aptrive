"use client";

import { useEffect, useState } from "react";
import BentoCard from "./BentoCard";

interface DayActivity {
  activity_date: string;
  questions_attempted: number;
  correct_count: number;
}

interface WeekPoint {
  label: string;
  accuracy: number;
  questions: number;
}

const CHART_HEIGHT = 42;

function bucketIntoWeeks(activity: DayActivity[]): WeekPoint[] {
  if (!activity.length) return [];

  const sorted = [...activity].sort((a, b) => a.activity_date.localeCompare(b.activity_date));
  const weeks: WeekPoint[] = [];

  for (let i = 0; i < sorted.length; i += 7) {
    const chunk = sorted.slice(i, i + 7);
    const questions = chunk.reduce((sum, d) => sum + d.questions_attempted, 0);
    const correct = chunk.reduce((sum, d) => sum + d.correct_count, 0);
    weeks.push({
      label: `W${weeks.length + 1}`,
      accuracy: questions ? Math.round((correct / questions) * 100) : 0,
      questions,
    });
  }

  // Cap to the most recent 12 weeks so the chart stays readable.
  return weeks.slice(-12);
}

export default function PerformanceTrend({ activity }: { activity: DayActivity[] }) {
  const weeks = bucketIntoWeeks(activity);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // Defer one frame so the unrevealed state actually paints before
    // the CSS transition kicks in.
    const id = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (weeks.length < 2) {
    return (
      <BentoCard
        title="Performance trends"
        subtitle="Weekly accuracy over time"
        className="lg:col-span-7"
      >
        <p className="rounded-sm border border-line bg-panel-2 p-4 text-sm text-muted">
          Complete a few more practice sessions across separate weeks and your accuracy trend
          will start showing up here.
        </p>
      </BentoCard>
    );
  }

  const maxQuestions = Math.max(1, ...weeks.map((w) => w.questions));
  const stepX = 100 / (weeks.length - 1);

  const linePoints = weeks
    .map((w, i) => {
      const x = i * stepX;
      const y = CHART_HEIGHT - (w.accuracy / 100) * CHART_HEIGHT;
      return `${x},${y}`;
    })
    .join(" ");

  const latest = weeks[weeks.length - 1];
  const earliest = weeks[0];
  const trendDelta = latest.accuracy - earliest.accuracy;

  return (
    <BentoCard
      title="Performance trends"
      subtitle={`Weekly accuracy — last ${weeks.length} weeks`}
      className="lg:col-span-7"
      action={
        <span
          className={`font-mono-data text-xs font-semibold ${trendDelta >= 0 ? "text-teal" : "text-danger"}`}
        >
          {trendDelta >= 0 ? "+" : ""}
          {trendDelta}% since {earliest.label}
        </span>
      }
    >
      <div className="relative" style={{ height: `${CHART_HEIGHT * 2.4}px` }}>
        {/* Weekly study-volume bars */}
        <div className="absolute inset-0 flex items-end gap-1.5">
          {weeks.map((w) => (
            <div key={w.label} className="flex flex-1 flex-col items-center justify-end">
              <div
                className="w-full rounded-t-sm bg-panel-2 transition-[height] duration-700 [transition-timing-function:var(--ease-smooth)]"
                style={{ height: revealed ? `${(w.questions / maxQuestions) * 100}%` : "0%" }}
                title={`${w.label}: ${w.questions} questions, ${w.accuracy}% accuracy`}
              />
            </div>
          ))}
        </div>

        {/* Accuracy trend line, overlaid on the same coordinate space */}
        <svg
          viewBox={`0 0 100 ${CHART_HEIGHT}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <polyline
            points={linePoints}
            fill="none"
            stroke="var(--gold)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={revealed ? 0 : 100}
            style={{ transition: "stroke-dashoffset 1.1s var(--ease-smooth)" }}
          />
        </svg>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-4 text-[11px] text-muted-2">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-panel-2" /> Questions
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-gold" /> Accuracy
          </span>
        </div>
        <div className="flex gap-3 text-[10px] uppercase tracking-wide text-muted-2">
          <span>{earliest.label}</span>
          <span>{latest.label}</span>
        </div>
      </div>
    </BentoCard>
  );
}
