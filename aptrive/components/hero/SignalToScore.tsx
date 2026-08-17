"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { HERO_SIGNAL_EVENT } from "./heroSignal";

const route = "M 78 156 C 142 110 190 106 238 126 S 322 230 382 232 S 470 174 548 150";
const stages = [
  { label: "Diagnostic", x: 78, y: 156, delay: 0.12, detail: "Start with a short assessment to see your current level." },
  { label: "Weak topics", x: 238, y: 126, delay: 0.32, detail: "Identify the subjects and topics costing you marks." },
  { label: "Next study", x: 382, y: 232, delay: 0.52, detail: "Turn your results into a focused plan for the next session." },
  { label: "Target score", x: 548, y: 150, delay: 0.72, detail: "Track the progress that moves you toward your university goal." },
] as const;
type StageLabel = (typeof stages)[number]["label"];

export default function SignalToScore() {
  const reducedMotion = useReducedMotion();
  const motionAllowed = reducedMotion === false;
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState<StageLabel | null>(null);
  const [selected, setSelected] = useState<StageLabel | null>(null);
  const visible = hovered ?? selected;
  const stage = stages.find((item) => item.label === visible);

  useEffect(() => {
    const handleSignal = (event: Event) => {
      setActive(Boolean((event as CustomEvent<{ active?: boolean }>).detail?.active));
    };
    window.addEventListener(HERO_SIGNAL_EVENT, handleSignal);
    return () => window.removeEventListener(HERO_SIGNAL_EVENT, handleSignal);
  }, []);

  return (
    <div role="group" aria-label="Aptrive study path" className="pointer-events-none absolute inset-0 z-[12] hidden overflow-visible sm:block">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: motionAllowed ? 1 : 0.72, scale: motionAllowed && active ? 1.018 : 1 }}
        transition={{ duration: motionAllowed ? 0.9 : 0, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-[10%] h-[62%] w-full">
          <svg viewBox="0 0 640 360" className="absolute inset-0 h-full w-full overflow-visible" fill="none" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="signal-route" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#23d5c4" stopOpacity="0.18" />
                <stop offset="0.52" stopColor="#6f45ff" stopOpacity="0.72" />
                <stop offset="1" stopColor="#f0b429" stopOpacity="0.8" />
              </linearGradient>
              <filter id="signal-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <path d={route} stroke="url(#signal-route)" strokeWidth="18" strokeLinecap="round" opacity={active ? 0.16 : 0.08} filter="url(#signal-glow)" />
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
            {stages.map((item) => (
              <circle key={item.label} cx={item.x} cy={item.y} r={visible === item.label ? 10 : active ? 8 : 6} fill="#ffffff" stroke={item.label === "Target score" ? "#f0b429" : "#6f45ff"} strokeWidth={visible === item.label ? 3 : 2} />
            ))}
          </svg>

          <div className="pointer-events-auto absolute inset-0">
            {stages.map((item) => {
              const isVisible = visible === item.label;
              return (
                <motion.button
                  key={item.label}
                  type="button"
                  aria-label={`Preview ${item.label}`}
                  aria-expanded={selected === item.label}
                  aria-controls="signal-stage-preview"
                  onMouseEnter={() => setHovered(item.label)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(item.label)}
                  onBlur={() => setHovered(null)}
                  onClick={() => setSelected((current) => (current === item.label ? null : item.label))}
                  whileHover={motionAllowed ? { scale: 1.12 } : undefined}
                  whileTap={motionAllowed ? { scale: 0.96 } : undefined}
                  className="absolute h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
                  style={{ left: `${(item.x / 640) * 100}%`, top: `${(item.y / 360) * 100}%` }}
                >
                  <span className={`mx-auto block h-4 w-4 rounded-full border-2 border-white transition-shadow ${isVisible ? "bg-violet-500 shadow-[0_0_0_7px_rgba(111,69,255,0.16)]" : "bg-transparent"}`} />
                  <span className="sr-only">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {stage && (
          <motion.div
            id="signal-stage-preview"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: motionAllowed ? 0.24 : 0, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute right-[5%] top-[4%] w-[min(18rem,calc(100%-2rem))] rounded-2xl border border-white/75 bg-white/84 px-4 py-3 shadow-[0_18px_55px_rgba(56,42,122,0.16)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Stage preview</span>
              <span className="h-1.5 w-1.5 rounded-full bg-teal shadow-[0_0_0_4px_rgba(35,213,196,0.14)]" />
            </div>
            <p className="mt-2 text-sm font-semibold text-neutral-900">{stage.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600">{stage.detail}</p>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-700">{selected === stage.label ? "Preview pinned" : "Click to pin preview"}</p>
          </motion.div>
        )}

        <div className="pointer-events-none absolute left-[6%] top-[72%] rounded-2xl border border-white/70 bg-white/72 px-4 py-3 shadow-[0_18px_55px_rgba(56,42,122,0.14)] backdrop-blur-xl">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-teal shadow-[0_0_0_4px_rgba(35,213,196,0.14)]" : "bg-violet-500"}`} />
            {active ? "Path active" : "Signal mapped"}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-neutral-800"><span>Next:</span><span className="text-violet-700">weak topics</span><span className="text-neutral-400">→</span><span className="text-teal-700">target score</span></div>
        </div>
      </motion.div>
    </div>
  );
}
