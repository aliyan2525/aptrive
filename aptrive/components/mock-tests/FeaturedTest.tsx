import * as React from "react";
import { LiquidGlassCard } from "../ui/LiquidGlassCard";
import { Sparkles, ArrowRight, TrendingUp } from "lucide-react";

interface FeaturedTestProps {
  university: string;
  examType: string;
  predictedPercentile: number;
  description: string;
  onStart: () => void;
}

export const FeaturedTest = ({
  university,
  examType,
  predictedPercentile,
  description,
  onStart,
}: FeaturedTestProps) => {
  return (
    <LiquidGlassCard
      intensity="high"
      className="relative w-full overflow-hidden mb-12 border-[var(--teal)]/30"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[var(--teal)]/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[var(--violet)]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-8 md:p-12 gap-8">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--teal)]/10 border border-[var(--teal)]/20 text-[var(--teal)] text-sm font-semibold tracking-wide uppercase">
            <Sparkles className="w-4 h-4" />
            AI Recommended
          </div>
          
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-[var(--fg)] mb-2">
              {university} <span className="aurora-text">{examType}</span>
            </h2>
            <p className="text-lg text-[var(--muted)] max-w-xl leading-relaxed">
              {description}
            </p>
          </div>

          <button
            onClick={onStart}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[var(--fg)] text-[var(--panel)] rounded-xl font-semibold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(20,32,70,0.2)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--teal)] to-[var(--violet)] opacity-0 group-hover:opacity-20 transition-opacity" />
            <span>Start Featured Test</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Prediction Visualizer */}
        <div className="w-full lg:w-72 bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-white/20 dark:border-white/10 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-semibold uppercase text-[var(--muted)]">Est. Percentile</span>
            <TrendingUp className="w-5 h-5 text-[var(--teal)]" />
          </div>
          
          <div className="relative flex justify-center items-center py-6">
            {/* Simple SVG Circular Progress */}
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-[var(--line)]"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-[var(--teal)] drop-shadow-[0_0_8px_rgba(102,255,255,0.4)]"
                strokeWidth="10"
                fill="none"
                strokeDasharray="440"
                strokeDashoffset={440 - (440 * predictedPercentile) / 100}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.25, 1, 0.5, 1)" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-bold aurora-text">{predictedPercentile}</span>
              <span className="text-xs font-medium text-[var(--muted)]">%ile</span>
            </div>
          </div>
          <p className="text-center text-sm text-[var(--muted-2)]">Based on your recent physics & math mock tests.</p>
        </div>
      </div>
    </LiquidGlassCard>
  );
};
