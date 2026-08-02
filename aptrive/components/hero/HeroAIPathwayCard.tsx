"use client";

import { motion } from "framer-motion";
import { Activity, Sparkles, TrendingUp } from "lucide-react";

const recommended = ["FAST", "NUST", "LUMS", "GIKI"];

export default function HeroAIPathwayCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: [0, -9, 0], scale: 1 }}
      whileHover={{ y: -14, scale: 1.025 }}
      transition={{
        opacity: { duration: 0.7, delay: 0.8 },
        scale: { duration: 0.7, delay: 0.8 },
        y: { duration: 6.5, delay: 1, repeat: Infinity, ease: "easeInOut" },
      }}
      className="pointer-events-auto absolute bottom-[7%] left-[8%] z-30 hidden w-[292px] rounded-[1.4rem] border border-white/75 bg-white/68 p-5 text-neutral-900 shadow-[0_26px_80px_-26px_rgba(30,41,59,0.46),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-2xl lg:block"
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[1.4rem] bg-[radial-gradient(circle_at_82%_12%,rgba(45,212,191,0.22),transparent_8rem)]" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-500">AI Pathway</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/10 px-2 py-1 text-[10px] font-bold text-teal-700">
            <Sparkles className="h-3 w-3" />
            Live
          </span>
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto] items-end gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
              Admission Probability
            </p>
            <div className="mt-1 font-display text-4xl font-bold leading-none text-neutral-950">97%</div>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/64 px-3 py-2 text-right shadow-inner">
            <p className="text-[10px] text-neutral-500">AI Confidence</p>
            <p className="text-xs font-bold text-teal-700">Very High</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-black/[0.04] bg-white/52 px-3 py-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600">
            <Activity className="h-3.5 w-3.5 text-teal-600" />
            Recent Progress
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-700">
            <TrendingUp className="h-3.5 w-3.5" />
            +18%
          </span>
        </div>

        <svg viewBox="0 0 160 42" className="mt-4 h-11 w-full text-teal-500" fill="none">
          <motion.path
            d="M2 35 C18 29 26 31 40 23 C54 15 62 24 78 17 C94 9 102 15 118 8 C134 2 144 7 158 2"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.4, delay: 1.1, ease: "easeInOut" }}
          />
          <path
            d="M2 35 C18 29 26 31 40 23 C54 15 62 24 78 17 C94 9 102 15 118 8 C134 2 144 7 158 2"
            stroke="currentColor"
            strokeOpacity="0.12"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>

        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
            Recommended Universities
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {recommended.map((name) => (
              <span
                key={name}
                className="rounded-full border border-white/70 bg-white/62 px-2.5 py-1 text-[11px] font-bold text-neutral-700 shadow-sm"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
