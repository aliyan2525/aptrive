import * as React from "react";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { Clock, BookOpen, Target, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export interface TestCardProps {
  id: string;
  university: string;
  examType: string;
  duration: number; // minutes
  questions: number;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedScore: number;
  aiRecommendation: string;
  isNew?: boolean;
}

export const TestCard = ({
  id,
  university,
  examType,
  duration,
  questions,
  difficulty,
  estimatedScore,
  aiRecommendation,
  isNew = false,
}: TestCardProps) => {
  return (
    <LiquidGlassCard intensity="low" interactive className="flex flex-col h-full group p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          {isNew && (
            <span className="inline-block px-2 py-1 bg-[var(--teal-dim)] text-[var(--teal)] text-[10px] font-bold uppercase tracking-wider rounded-full mb-2">
              New
            </span>
          )}
          <h3 className="text-xl font-display font-semibold text-[var(--fg)]">
            {university}
          </h3>
          <p className="text-sm text-[var(--muted)]">{examType}</p>
        </div>
        
        {/* Difficulty Badge */}
        <div className={cn(
          "px-2.5 py-1 text-xs font-medium rounded-full border",
          difficulty === "Easy" && "border-[var(--success)]/20 text-[var(--success)] bg-[var(--success)]/10",
          difficulty === "Medium" && "border-[var(--warning)]/20 text-[var(--warning)] bg-[var(--warning)]/10",
          difficulty === "Hard" && "border-[var(--danger)]/20 text-[var(--danger)] bg-[var(--danger)]/10"
        )}>
          {difficulty}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-1.5 text-sm text-[var(--muted-2)]">
          <Clock className="w-4 h-4" />
          <span>{duration}m</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-[var(--muted-2)]">
          <BookOpen className="w-4 h-4" />
          <span>{questions} Qs</span>
        </div>
      </div>

      {/* AI Recommendation Panel */}
      <div className="mt-auto bg-[var(--panel-2)]/50 rounded-xl p-4 border border-[var(--line)]/50 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[var(--violet)]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--violet)]">AI Prediction</span>
        </div>
        <div className="flex justify-between items-end">
          <p className="text-sm text-[var(--muted)] flex-1 pr-4">{aiRecommendation}</p>
          <div className="text-right">
            <span className="block text-2xl font-bold aurora-text">{estimatedScore}</span>
            <span className="text-[10px] text-[var(--muted-2)] uppercase">Est. Score</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button className="w-full relative overflow-hidden group/btn px-4 py-3 bg-[var(--panel)] border border-[var(--line)] rounded-xl flex items-center justify-between text-[var(--fg)] font-medium transition-all hover:border-[var(--teal)] hover:shadow-[0_0_15px_rgba(102,255,255,0.1)]">
        <span>Start Test</span>
        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </LiquidGlassCard>
  );
};
