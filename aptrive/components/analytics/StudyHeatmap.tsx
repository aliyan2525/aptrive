"use client";

import * as React from "react";
import { LiquidGlassCard } from "../ui/LiquidGlassCard";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/cn";

export const StudyHeatmap = () => {
  // Generate mock data for the last 90 days
  const data = React.useMemo(() => {
    return Array.from({ length: 90 }, (_, i) => ({
      date: new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000),
      intensity: Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0,
    }));
  }, []);

  const intensityClasses = {
    0: "bg-[var(--line)]/20",
    1: "bg-[var(--teal)]/20",
    2: "bg-[var(--teal)]/50",
    3: "bg-[var(--teal)]/80",
    4: "bg-[var(--teal)]",
  };

  return (
    <LiquidGlassCard intensity="low" className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-[var(--panel)] border border-[var(--line)]">
          <Calendar className="w-5 h-5 text-[var(--muted)]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--fg)]">Study Consistency</h3>
          <p className="text-xs text-[var(--muted-2)]">Your daily learning activity</p>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar pb-2">
        <div className="min-w-[600px]">
          <div className="grid grid-rows-7 grid-flow-col gap-1.5">
            {data.map((day, i) => (
              <div
                key={i}
                className={cn(
                  "w-3.5 h-3.5 rounded-sm transition-colors duration-300",
                  intensityClasses[day.intensity as keyof typeof intensityClasses]
                )}
                title={`${day.date.toDateString()}: Level ${day.intensity}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] uppercase font-mono tracking-wider text-[var(--muted-2)]">
            <span>90 Days Ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>
    </LiquidGlassCard>
  );
};
