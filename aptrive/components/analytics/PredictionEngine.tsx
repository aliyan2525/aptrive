"use client";

import * as React from "react";
import { LiquidGlassCard } from "../ui/LiquidGlassCard";
import { Target, Zap, Award } from "lucide-react";

interface PredictionEngineProps {
  admissionProbability: number;
  estimatedAggregate: number;
  readinessScore: number;
  hasEvidence?: boolean;
}

export const PredictionEngine = ({
  admissionProbability,
  estimatedAggregate,
  readinessScore,
  hasEvidence = true,
}: PredictionEngineProps) => {
  return (
    <LiquidGlassCard intensity="high" className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-[var(--violet)]/10 text-[var(--violet)] rounded-xl border border-[var(--violet)]/20 shadow-[0_0_15px_rgba(177,102,255,0.2)]">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-[var(--fg)]">AI Prediction Engine</h2>
          <p className="text-sm text-[var(--muted)]">{hasEvidence ? "Forecasting based on your recent performance." : "Complete a practice session to unlock your first forecast."}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Admission Probability */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[var(--teal)]/5 to-[var(--teal)]/10 border border-[var(--teal)]/20 overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-[var(--teal)]/20 rounded-full blur-[40px] group-hover:bg-[var(--teal)]/30 transition-colors" />
          <div className="flex justify-between items-start mb-6">
            <span className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Admission Prob.</span>
            <Zap className="w-5 h-5 text-[var(--teal)]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold aurora-text">{hasEvidence ? `${admissionProbability}%` : "—"}</span>
            {hasEvidence ? <span className="text-sm text-[var(--success)] font-medium">Live signal</span> : <span className="text-sm text-[var(--muted)] font-medium">Needs data</span>}
          </div>
        </div>

        {/* Estimated Aggregate */}
        <div className="relative p-6 rounded-2xl bg-[var(--panel-2)]/50 border border-[var(--line)] overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <span className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Est. Aggregate</span>
            <Award className="w-5 h-5 text-[var(--gold)]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-[var(--fg)]">{hasEvidence ? estimatedAggregate.toFixed(1) : "—"}</span>
            <span className="text-sm text-[var(--muted)]">{hasEvidence ? "/ 100" : "Not enough attempts"}</span>
          </div>
        </div>

        {/* Readiness Score */}
        <div className="relative flex flex-col justify-center items-center p-6 rounded-2xl bg-[var(--panel-2)]/50 border border-[var(--line)]">
           <span className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-4 w-full text-left">Readiness</span>
           <div className="relative flex justify-center items-center">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="40" className="stroke-[var(--line-strong)]" strokeWidth="8" fill="none" />
              <circle 
                cx="48" cy="48" r="40" 
                className="stroke-[var(--violet)] drop-shadow-[0_0_8px_rgba(177,102,255,0.4)]" 
                strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * readinessScore) / 100} strokeLinecap="round" 
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-bold text-[var(--fg)]">{hasEvidence ? readinessScore : "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </LiquidGlassCard>
  );
};
