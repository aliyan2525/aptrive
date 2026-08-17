"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { HERO_SIGNAL_EVENT } from "./heroSignal";

const route = "M 78 156 C 142 110 190 106 238 126 S 322 230 382 232 S 470 174 548 150";
const routePoints = [
  { label: "Diagnostic", x: 78, y: 156, delay: 0.12 },
  { label: "Weak topics", x: 238, y: 126, delay: 0.32 },
  { label: "Next study", x: 382, y: 232, delay: 0.52 },
  { label: "Target score", x: 548, y: 150, delay: 0.72 },
];

export default function SignalToScore() {
  const reducedMotion = useReducedMotion();
  const motionAllowed = reducedMotion === false;
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleSignal = (event: Event) => {
      const detail = (event as CustomEvent<{ active?: boolean }>).detail;
      setActive(Boolean(detail?.active));
    };

    window.addEventListener(HERO_SIGNAL_EVENT, handleSignal);
    return () => window.removeEventListener(HERO_SIGNAL_EVENT, handleSignal);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[12] hidden overflow-visible sm:block"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: motionAllowed ? 1 : 0.72, scale: motionAllowed && active ? 1.018 : 1 }}
        transition={{ duration: motionAllowed ? 0.9 : 0, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg
          viewBox="0 0 640 360"
          className="absolute inset-x-0 top-[10%] h-[62%] w-full overflow-visible"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="signal-route" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#23d5c4" stopOpacity="0.18" />
              <stop offset="0.52" stopColor="#6f45ff" stopOpacity="0.72" />
              <stop offset="1" stopColor="#f0b429" stopOpacity="0.8" />
            </linearGradient>
            <filter id="signal-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d={route}
            stroke="url(#signal-route)"
            strokeWidth="18"
            strokeLinecap="round"
            opacity={active ? 0.16 : 0.08}
            filter="url(#signal-glow)"
          />
          <motion.path
            d={route}
            pathLength={1}
            stroke="url(#signal-route)"
            strokeWidth={active ? 2.8 : 1.8}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: active ? 1 : 0.72 }}
            transition={{ duration: motionAllowed ? 1.5 : 0, delay: motionAllowed ? 0.28 : 0, ease: [0.16, 1, 0.3, 1] }}
          />

          {routePoints.map((point) => (
            <g key={point.label}>
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={active ? 8 : 6}
                fill="#ffffff"
                stroke={point.label === "Target score" ? "#f0b429" : "#6f45ff"}
                strokeWidth="2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: active ? 1 : 0.8 }}
                transition={{ duration: motionAllowed ? 0.45 : 0, delay: motionAllowed ? point.delay : 0, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: `${point.x}px ${point.y}px` }}
              />
              <circle cx={point.x} cy={point.y} r="2.5" fill={point.label === "Target score" ? "#f0b429" : "#23d5c4"} />
            </g>
          ))}

          {motionAllowed && (
            <motion.circle
              r="4"
              fill="#ffffff"
              stroke="#23d5c4"
              strokeWidth="2"
              filter="url(#signal-glow)"
              initial={{ opacity: 0 }}
              animate={{
                opacity: active ? [0.35, 1, 0.35] : [0.2, 0.7, 0.2],
                offsetDistance: ["0%", "100%"],
              }}
              transition={{ duration: active ? 2.6 : 4.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ offsetPath: `path("${route}")` }}
            />
          )}
        </svg>

        <div className="absolute left-[6%] top-[62%] rounded-2xl border border-white/70 bg-white/72 px-4 py-3 shadow-[0_18px_55px_rgba(56,42,122,0.14)] backdrop-blur-xl">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-teal shadow-[0_0_0_4px_rgba(35,213,196,0.14)]" : "bg-violet-500"}`} />
            {active ? "Path active" : "Signal mapped"}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-neutral-800">
            <span>Next:</span>
            <span className="text-violet-700">weak topics</span>
            <span className="text-neutral-400">â†’</span>
            <span className="text-teal-700">target score</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


