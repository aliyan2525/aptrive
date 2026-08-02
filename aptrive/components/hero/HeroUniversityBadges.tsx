"use client";

import { motion } from "framer-motion";
import { emitHeroSignal } from "./heroSignal";

interface BadgeConfig {
  label: string;
  full: string;
  radiusX: number;
  radiusY: number;
  phase: number;
  duration: number;
  delay: number;
  accent: string;
}

const BADGES: BadgeConfig[] = [
  { label: "NUST", full: "Islamabad", radiusX: 292, radiusY: 150, phase: 18, duration: 34, delay: 0.1, accent: "from-cyan-300/35" },
  { label: "FAST", full: "CS Path", radiusX: 318, radiusY: 108, phase: 78, duration: 30, delay: 0.55, accent: "from-blue-300/35" },
  { label: "LUMS", full: "Merit", radiusX: 254, radiusY: 196, phase: 316, duration: 36, delay: 0.35, accent: "from-violet-300/35" },
  { label: "GIKI", full: "Topi", radiusX: 220, radiusY: 224, phase: 252, duration: 40, delay: 0.75, accent: "from-emerald-300/35" },
];

function badgePath(config: BadgeConfig) {
  return Array.from({ length: 9 }, (_, index) => {
    const angle = ((config.phase + index * 45) * Math.PI) / 180;
    return {
      x: Math.cos(angle) * config.radiusX,
      y: Math.sin(angle) * config.radiusY,
      scale: 0.88 + (Math.sin(angle) + 1) * 0.1,
      opacity: 0.62 + (Math.sin(angle) + 1) * 0.16,
    };
  });
}

export default function HeroUniversityBadges() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block" aria-hidden="true">
      <div className="absolute left-1/2 top-1/2">
        {BADGES.map((badge) => {
          const path = badgePath(badge);
          return (
            <motion.div
              key={badge.label}
              className={`pointer-events-auto absolute flex min-w-[116px] items-center gap-2 rounded-full border border-white/70 bg-gradient-to-br ${badge.accent} to-white/60 px-4 py-3 text-neutral-800 shadow-[0_22px_64px_-24px_rgba(30,41,59,0.42),inset_0_1px_0_rgba(255,255,255,0.94)] backdrop-blur-2xl`}
              style={{ marginLeft: -58, marginTop: -24 }}
              initial={{ opacity: 0, scale: 0.74, y: 8 }}
              whileHover={{ scale: 1.08, filter: "saturate(1.2) brightness(1.04)" }}
              onMouseEnter={() => emitHeroSignal({ active: true, source: "university" })}
              onMouseLeave={() => emitHeroSignal({ active: false, source: "university" })}
              animate={{
                x: path.map((point) => point.x),
                y: path.map((point) => point.y),
                scale: path.map((point) => point.scale),
                opacity: path.map((point) => point.opacity),
              }}
              transition={{
                duration: badge.duration,
                delay: badge.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-teal-400 shadow-[0_0_14px_rgba(45,212,191,0.8)]" />
              <span className="font-display text-sm font-bold leading-none">{badge.label}</span>
              <span className="text-[10px] font-semibold leading-none text-neutral-500">{badge.full}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
