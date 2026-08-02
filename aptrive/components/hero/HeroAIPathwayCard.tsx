"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

/**
 * Floating proof-point card anchored to the lower-left of the planet
 * — a concrete, legible metric grounding the otherwise abstract 3D
 * composition, matching the reference's "AI Pathway / 97%" card.
 * Gated to `lg` and up, same reasoning as the orbit icons/badges.
 */
export default function HeroAIPathwayCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.6, delay: 0.9 },
        y: { duration: 6, delay: 1, repeat: Infinity, ease: "easeInOut" },
      }}
      className="pointer-events-none absolute bottom-[6%] left-[6%] z-10 hidden w-[230px] rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_20px_60px_-15px_rgba(30,41,59,0.35)] backdrop-blur-xl lg:block"
      aria-hidden="true"
    >
      <p className="text-xs font-medium text-neutral-500">AI Pathway</p>
      <div className="mt-1 flex items-end justify-between">
        <span className="font-display text-3xl font-bold text-neutral-900">97%</span>
        <span className="flex items-center gap-1 text-xs font-semibold text-teal-600">
          <TrendingUp className="h-3.5 w-3.5" />
        </span>
      </div>
      <p className="mt-1 text-xs text-neutral-500">Personalized Success</p>
      <svg viewBox="0 0 100 28" className="mt-3 h-7 w-full text-teal-500" fill="none">
        <path
          d="M0 22 L14 18 L28 20 L42 12 L56 14 L70 6 L84 8 L100 2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}
