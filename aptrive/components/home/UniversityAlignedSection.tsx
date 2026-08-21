"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Calculator,
  Check,
  CirclePlay,
  Percent,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

export default function UniversityAlignedSection() {
  const reducedMotion = useReducedMotion();
  const motionEnabled = reducedMotion === false;

  return (
    <section className="relative isolate overflow-hidden border-t border-line bg-[radial-gradient(circle_at_72%_42%,rgba(191,246,239,0.46),transparent_24rem),radial-gradient(circle_at_88%_10%,rgba(221,228,255,0.7),transparent_30rem),linear-gradient(135deg,#ffffff_0%,#f8fbff_58%,#f2f0ff_100%)] py-24 md:py-32 lg:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_78%,transparent)]" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-80 w-80 rounded-full bg-violet-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-teal-200/30 blur-3xl" />

      <div className="container-aptrive relative grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 xl:gap-20">
        <motion.div
          initial={motionEnabled ? { opacity: 0, y: 24 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-white/70 px-3.5 py-1.5 shadow-sm backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-teal-500 to-violet-500" />
            <span className="font-mono-data text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
              University-aligned prep
            </span>
          </div>

          <h2 className="mt-7 max-w-[720px] font-display text-[2.65rem] font-semibold leading-[0.99] tracking-[-0.05em] text-fg sm:text-[3.55rem] lg:text-[4.15rem]">
            Prepare around the subjects, formats, and{" "}
            <span className="bg-gradient-to-r from-teal-500 via-blue-600 to-violet-600 bg-clip-text text-transparent">
              merit calculations
            </span>{" "}
            that matter for your target universities.
          </h2>

          <p className="mt-7 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Access accurate merit calculators, university requirements, and admission insights — all in one focused path.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/tools/calculator"
              data-cta="homepage-university-calculator"
              className="pressable inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 via-blue-600 to-violet-600 px-5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(79,70,229,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(79,70,229,0.3)]"
            >
              <Calculator className="h-4 w-4" aria-hidden="true" />
              Access calculator
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/tools/calculator"
              className="inline-flex h-12 items-center gap-2 rounded-xl px-2 text-sm font-semibold text-muted transition-colors hover:text-fg"
            >
              <CirclePlay className="h-4 w-4 text-violet-600" aria-hidden="true" />
              See how it works
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={motionEnabled ? { opacity: 0, scale: 0.96, y: 20 } : false}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-[470px] sm:min-h-[520px]"
          aria-hidden="true"
        >
          <div className="absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(174,224,255,0.48),rgba(139,92,246,0.13)_48%,transparent_72%)] blur-2xl sm:h-[500px] sm:w-[500px]" />
          <div className="absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/15 sm:h-[500px] sm:w-[500px]" />
          <div className="absolute left-1/2 top-1/2 h-[320px] w-[460px] -translate-x-1/2 -translate-y-1/2 rotate-[-17deg] rounded-[50%] border border-teal-400/20" />

          <motion.div
            animate={motionEnabled ? { y: [0, -8, 0] } : undefined}
            transition={motionEnabled ? { duration: 6, repeat: Infinity, ease: "easeInOut" } : undefined}
            className="absolute left-1/2 top-1/2 w-[min(100%,360px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-4 shadow-[0_30px_80px_rgba(62,72,130,0.18),inset_0_1px_0_rgba(255,255,255,0.96)] backdrop-blur-2xl sm:w-[390px]"
          >
            <div className="rounded-[1.5rem] border border-violet-100/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(239,244,255,0.78))] p-5 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400/20 via-blue-500/15 to-violet-500/20 text-violet-600">
                    <Calculator className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-fg">Merit calculator</p>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">Target pathway</p>
                  </div>
                </div>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-500/10 text-teal-600">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="mt-5 rounded-2xl border border-white/80 bg-white/78 p-4 shadow-[0_10px_24px_rgba(99,102,241,0.08)]">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="font-mono-data text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Estimated merit</p>
                    <p className="mt-1 font-display text-4xl font-semibold tracking-[-0.05em] text-fg">84.6<span className="text-2xl text-teal-500">%</span></p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-teal-500/10 px-2.5 py-1 text-[10px] font-bold text-teal-700">
                    <TrendingArrow />
                    +12.4%
                  </div>
                </div>
                <svg viewBox="0 0 320 66" className="mt-3 h-16 w-full" fill="none">
                  <defs>
                    <linearGradient id="merit-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#23d5c4" stopOpacity="0.24" />
                      <stop offset="1" stopColor="#6f45ff" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="merit-line" x1="0" y1="0" x2="1" y2="0">
                      <stop stopColor="#23d5c4" />
                      <stop offset="0.55" stopColor="#3b82f6" />
                      <stop offset="1" stopColor="#6f45ff" />
                    </linearGradient>
                  </defs>
                  <path d="M4 57 C35 52 42 55 70 47 S111 50 136 39 S173 45 201 32 S238 37 260 23 S294 17 316 5 V66 H4 Z" fill="url(#merit-fill)" />
                  <path d="M4 57 C35 52 42 55 70 47 S111 50 136 39 S173 45 201 32 S238 37 260 23 S294 17 316 5" stroke="url(#merit-line)" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="316" cy="5" r="4.5" fill="#6f45ff" stroke="white" strokeWidth="3" />
                </svg>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2">
                {["AC", "%", "÷", "×", "7", "8", "9", "−", "4", "5", "6", "+", "0", ".", "00", "="].map((key, index) => (
                  <span
                    key={`${key}-${index}`}
                    className={`flex h-10 items-center justify-center rounded-xl border text-xs font-semibold shadow-[0_3px_8px_rgba(62,72,130,0.06)] ${
                      key === "="
                        ? "border-violet-500/20 bg-gradient-to-br from-teal-500 via-blue-600 to-violet-600 text-white"
                        : index < 4
                          ? "border-violet-100 bg-violet-50/70 text-violet-700"
                          : "border-white bg-white/80 text-muted"
                    }`}
                  >
                    {key}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <FloatingMetric className="left-[0%] top-[19%] sm:left-[2%]" icon={<Building2 className="h-4 w-4" />} label="Universities" value="100+" tone="violet" />
          <FloatingMetric className="right-[0%] top-[28%] sm:right-[1%]" icon={<BookOpen className="h-4 w-4" />} label="Subjects" value="6+" tone="blue" />
          <FloatingMetric className="right-[1%] bottom-[14%] sm:right-[4%]" icon={<Trophy className="h-4 w-4" />} label="Target score" value="On track" tone="teal" />
          <FloatingMetric className="left-[4%] bottom-[17%] sm:left-[7%]" icon={<Target className="h-4 w-4" />} label="Plan clarity" value="High" tone="violet" />
        </motion.div>
      </div>
    </section>
  );
}

function FloatingMetric({
  className,
  icon,
  label,
  value,
  tone,
}: {
  className: string;
  icon: ReactNode;
  label: string;
  value: string;
  tone: "teal" | "blue" | "violet";
}) {
  const toneClasses = {
    teal: "bg-teal-500/10 text-teal-700",
    blue: "bg-blue-500/10 text-blue-700",
    violet: "bg-violet-500/10 text-violet-700",
  } as const;

  return (
    <div className={`absolute z-20 hidden min-w-[132px] rounded-2xl border border-white/80 bg-white/78 px-3.5 py-3 shadow-[0_18px_45px_rgba(62,72,130,0.13)] backdrop-blur-xl sm:block ${className}`}>
      <div className="flex items-center gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${toneClasses[tone]}`}>{icon}</span>
        <div>
          <p className="text-[10px] font-semibold text-muted">{label}</p>
          <p className="mt-0.5 text-sm font-bold text-fg">{value}</p>
        </div>
      </div>
    </div>
  );
}

function TrendingArrow() {
  return (
    <span className="inline-flex items-center" aria-hidden="true">
      <Percent className="h-3 w-3" />
      <Check className="-ml-1 h-2.5 w-2.5" />
    </span>
  );
}
