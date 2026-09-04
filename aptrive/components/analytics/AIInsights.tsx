"use client";

import * as React from "react";
import { LiquidGlassCard } from "../ui/LiquidGlassCard";
import { Sparkles, ArrowRight, Brain } from "lucide-react";
import { motion } from "framer-motion";

interface AIInsightsProps {
  insights: string[];
}

export const AIInsights = ({ insights }: AIInsightsProps) => {
  return (
    <LiquidGlassCard intensity="low" className="p-8 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-lg bg-[var(--teal)]/10 text-[var(--teal)]">
          <Brain className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--fg)]">AI Insights</h3>
      </div>
      
      <div className="flex-1 flex flex-col justify-center gap-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + (index * 0.15) }}
            className="flex items-start gap-3 p-4 rounded-xl bg-[var(--panel-2)]/50 border border-[var(--line)]/50 hover:border-[var(--teal)]/30 transition-colors group"
          >
            <Sparkles className="w-4 h-4 text-[var(--teal)] mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              {insight}
            </p>
          </motion.div>
        ))}
      </div>
      
      <button className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--line)] text-sm font-medium text-[var(--fg)] hover:bg-[var(--line)]/30 transition-colors">
        View Detailed Report
        <ArrowRight className="w-4 h-4" />
      </button>
    </LiquidGlassCard>
  );
};
