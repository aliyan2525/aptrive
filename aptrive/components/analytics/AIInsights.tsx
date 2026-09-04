"use client";

import * as React from "react";

import { Sparkles, ArrowRight, Brain } from "lucide-react";
import { motion } from "framer-motion";

interface AIInsightsProps {
  insights: string[];
}

export const AIInsights = ({ insights }: AIInsightsProps) => {
  return (
    <section className="premium-shell flex h-full flex-col rounded-[1.5rem] bg-white/70 p-8 backdrop-blur-2xl">
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
            className="group flex items-start gap-3 rounded-xl border border-white/60 bg-white/50 p-4 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:bg-white/70 hover:shadow-[0_8px_32px_rgba(35,213,196,0.1)]"
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
    </section>
  );
};
