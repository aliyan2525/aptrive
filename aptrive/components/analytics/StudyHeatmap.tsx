"use client";

import { Calendar } from "lucide-react";
import { cn } from "@/lib/cn";
import { LiquidGlassCard } from "../ui/LiquidGlassCard";

type ActivityPoint = {
  activity_date: string;
  questions_attempted: number;
};

export const StudyHeatmap = ({ activity }: { activity: ActivityPoint[] }) => {
  const activityByDate = new Map(
    activity
      .filter((item) => typeof item.activity_date === "string" && item.activity_date.length >= 10)
      .map((item) => [item.activity_date.slice(0, 10), Math.max(0, Number(item.questions_attempted) || 0)])
  );
  const data = Array.from({ length: 90 }, (_, index) => {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - (89 - index));
    const dateKey = date.toISOString().slice(0, 10);
    const questions = activityByDate.get(dateKey) ?? 0;
    return { date, intensity: questions === 0 ? 0 : Math.min(4, Math.max(1, Math.ceil(questions / 10))) };
  });
  const hasActivity = data.some((day) => day.intensity > 0);

  const intensityClasses = {
    0: "bg-[var(--line)]/20",
    1: "bg-[var(--teal)]/20",
    2: "bg-[var(--teal)]/50",
    3: "bg-[var(--teal)]/80",
    4: "bg-[var(--teal)]",
  };

  return (
    <LiquidGlassCard intensity="low" className="p-5 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-2">
          <Calendar className="h-5 w-5 text-[var(--muted)]" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--fg)]">Study Consistency</h3>
          <p className="text-xs text-[var(--muted-2)]">Your daily learning activity</p>
        </div>
      </div>

      <div className="overflow-x-auto pb-2 no-scrollbar">
        <div className="min-w-[600px]">
          <div className="grid grid-flow-col grid-rows-7 gap-1.5" aria-label="Study activity for the last 90 days">
            {data.map((day) => (
              <div
                key={day.date.toISOString()}
                className={cn("h-3.5 w-3.5 rounded-sm transition-colors duration-300", intensityClasses[day.intensity as keyof typeof intensityClasses])}
                title={`${day.date.toDateString()}: ${day.intensity === 0 ? "No recorded activity" : `${day.intensity} activity level`}`}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-[10px] font-mono uppercase tracking-wider text-[var(--muted-2)]">
            <span>90 Days Ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>
      {!hasActivity && <p className="mt-4 rounded-xl border border-dashed border-line bg-white/50 p-3 text-xs leading-5 text-muted">Complete a practice session to start building your consistency signal.</p>}
    </LiquidGlassCard>
  );
};
