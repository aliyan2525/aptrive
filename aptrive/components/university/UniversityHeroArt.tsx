"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Atom, Binary, Building2, Cpu, Database, GraduationCap, Landmark, Layers3, Orbit, Radio, Route, Sparkles, Target, Trophy, Waypoints } from "lucide-react";
import type { ReactNode } from "react";

export type UniversityHeroMode = "orbit" | "terminal" | "network" | "signal" | "machine" | "atom" | "campus" | "radar" | "wave" | "constellation" | "ledger" | "path";

const modeByUniversity: Record<string, UniversityHeroMode> = {
  nust: "orbit",
  fast: "terminal",
  comsats: "network",
  "uet-lahore": "signal",
  giki: "machine",
  pieas: "atom",
  ned: "campus",
  air: "radar",
  bahria: "wave",
  ist: "constellation",
  umt: "ledger",
  ucp: "path",
};

const accentByMode: Record<UniversityHeroMode, string> = {
  orbit: "#23d5c4",
  terminal: "#58a6ff",
  network: "#8b7cff",
  signal: "#35c6ff",
  machine: "#ffab68",
  atom: "#d18bff",
  campus: "#ff779b",
  radar: "#5a8cff",
  wave: "#3dd8cf",
  constellation: "#9f8cff",
  ledger: "#ffbf69",
  path: "#7de1c5",
};

function MotionFloat({ children, delay = 0, distance = 8, duration = 4 }: { children: ReactNode; delay?: number; distance?: number; duration?: number }) {
  const reduced = useReducedMotion();
  return <motion.div animate={reduced ? undefined : { y: [0, -distance, 0], rotate: [0, 0.6, 0] }} transition={reduced ? undefined : { duration, delay, repeat: Infinity, ease: "easeInOut" }}>{children}</motion.div>;
}

function Glow({ color, className = "" }: { color: string; className?: string }) {
  return <div className={`pointer-events-none absolute rounded-full blur-3xl ${className}`} style={{ background: color, opacity: 0.22 }} />;
}

function MotionSpin({ children, duration = 16, reverse = false }: { children: ReactNode; duration?: number; reverse?: boolean }) {
  const reduced = useReducedMotion();
  return <motion.div animate={reduced ? undefined : { rotate: reverse ? -360 : 360 }} transition={reduced ? undefined : { duration, repeat: Infinity, ease: "linear" }}>{children}</motion.div>;
}

function ModeFrame({ children, mode, signal }: { children: ReactNode; mode: UniversityHeroMode; signal: string }) {
  const accent = accentByMode[mode];
  return (
    <div className="relative isolate h-[22rem] overflow-hidden rounded-[2rem] border border-white/80 bg-white/10 p-4 shadow-[0_30px_100px_rgba(10,20,70,0.24)] backdrop-blur-2xl md:h-[27rem] md:p-6">
      <Glow color={accent} className="-right-8 -top-10 h-64 w-64" />
      <Glow color="#ffffff" className="-bottom-12 -left-10 h-56 w-56" />
      <div className="relative z-10 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-white/70"><span>{signal}</span><span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} /> Live route</span></div>
      {children}
    </div>
  );
}

function OrbitMode({ signal }: { signal: string }) {
  return <ModeFrame mode="orbit" signal={signal}><div className="absolute inset-0 grid place-items-center"><MotionFloat duration={7}><div className="relative grid h-52 w-52 place-items-center rounded-full border border-teal-100/35 bg-[radial-gradient(circle_at_35%_24%,rgba(255,255,255,0.82),rgba(80,221,219,0.42)_36%,rgba(108,76,255,0.4)_72%,transparent_74%)] shadow-[0_0_80px_rgba(35,213,196,0.3)] md:h-64 md:w-64"><div className="absolute h-[120%] w-[46%] rounded-full border border-white/35 rotate-[56deg]" /><div className="absolute h-[120%] w-[46%] rounded-full border border-violet-200/30 -rotate-[56deg]" /><Target className="h-12 w-12 text-white/75" /></div></MotionFloat><div className="absolute h-72 w-72 rounded-full border border-white/20" /><MotionSpin><Orbit className="absolute h-80 w-80 text-white/35" /></MotionSpin></div><MotionFloat delay={0.4}><span className="absolute bottom-8 left-8 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-semibold text-white/80">NET / 75% test weight</span></MotionFloat><MotionFloat delay={0.8}><span className="absolute right-8 top-24 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-semibold text-white/80">H-12 · Islamabad</span></MotionFloat></ModeFrame>;
}

function TerminalMode({ signal }: { signal: string }) {
  const reduced = useReducedMotion();
  const lines = ["const target = FAST;", "score = solve(patterns);", "while (speed < target)", "  practice.compile();", "return admission.ready;"];
  return <ModeFrame mode="terminal" signal={signal}><div className="absolute inset-x-5 bottom-5 top-16 rounded-2xl border border-white/15 bg-slate-950/55 p-4 shadow-2xl md:inset-x-8 md:bottom-8 md:top-20"><div className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-rose-300/75" /><i className="h-2.5 w-2.5 rounded-full bg-amber-300/75" /><i className="h-2.5 w-2.5 rounded-full bg-teal-300/75" /></div><div className="mt-5 space-y-2 font-mono text-xs leading-6 text-blue-100/80 md:text-sm">{lines.map((line, index) => <motion.div key={line} initial={reduced ? false : { opacity: 0, x: -10 }} animate={reduced ? undefined : { opacity: 1, x: 0 }} transition={reduced ? undefined : { delay: 0.16 * index, duration: 0.5 }}><span className="mr-3 text-blue-300/45">{String(index + 1).padStart(2, "0")}</span><span className={index === 0 || index === 4 ? "text-teal-200" : ""}>{line}</span></motion.div>)}</div><MotionFloat delay={0.6}><Binary className="absolute bottom-7 right-7 h-16 w-16 text-blue-200/25" /></MotionFloat></div></ModeFrame>;
}

function NetworkMode({ signal }: { signal: string }) {
  const nodes = [[20, 38], [42, 22], [68, 32], [80, 62], [51, 74], [24, 72]];
  return <ModeFrame mode="network" signal={signal}><div className="absolute inset-0"><svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true"><path d="M20 38 L42 22 L68 32 L80 62 L51 74 L24 72 Z M42 22 L51 74 M20 38 L80 62" fill="none" stroke="rgba(139,124,255,.5)" strokeWidth=".55" strokeDasharray="2 2" /></svg>{nodes.map(([left, top], index) => <MotionFloat key={`${left}-${top}`} delay={index * 0.16} distance={index % 2 ? 6 : 10}><span className="absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/35 bg-white/15 shadow-[0_0_30px_rgba(139,124,255,.28)]" style={{ left: `${left}%`, top: `${top}%` }}>{index === 0 ? <Waypoints className="h-4 w-4 text-violet-100" /> : <span className="h-2.5 w-2.5 rounded-full bg-violet-200" />}</span></MotionFloat>)}</div></ModeFrame>;
}

function SignalMode({ signal }: { signal: string }) {
  return <ModeFrame mode="signal" signal={signal}><div className="absolute inset-x-6 top-1/2 -translate-y-1/2 md:inset-x-10"><svg viewBox="0 0 600 180" className="w-full overflow-visible" aria-hidden="true"><defs><linearGradient id="signal-gradient" x1="0" x2="1"><stop stopColor="#35c6ff" /><stop offset=".52" stopColor="#8b7cff" /><stop offset="1" stopColor="#23d5c4" /></linearGradient></defs><path d="M10 120 C100 120 90 34 182 70 S280 156 370 78 S500 36 590 28" fill="none" stroke="url(#signal-gradient)" strokeWidth="5" strokeLinecap="round" /><path d="M10 120 C100 120 90 34 182 70 S280 156 370 78 S500 36 590 28" fill="none" stroke="white" strokeOpacity=".28" strokeWidth="14" strokeLinecap="round" /></svg><div className="absolute left-0 top-[62%] h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_24px_8px_rgba(53,198,255,.45)]" /><div className="absolute right-0 top-[8%] h-3 w-3 rounded-full bg-teal-200 shadow-[0_0_24px_8px_rgba(35,213,196,.45)]" /></div><MotionFloat delay={0.4}><div className="absolute bottom-8 left-8 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/12 px-4 py-3 text-xs font-semibold text-white/80"><Route className="h-4 w-4 text-cyan-200" /> ECAT → next target</div></MotionFloat></ModeFrame>;
}

function MachineMode({ signal }: { signal: string }) {
  const reduced = useReducedMotion();
  return <ModeFrame mode="machine" signal={signal}><div className="absolute inset-0"><div className="absolute inset-8 rounded-[1.75rem] border border-orange-200/15 bg-[linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:28px_28px]" /><MotionFloat duration={5}><Cpu className="absolute left-[24%] top-[28%] h-28 w-28 text-orange-100/75 drop-shadow-[0_0_25px_rgba(255,171,104,.35)]" /></MotionFloat><MotionFloat delay={0.7} duration={6}><Database className="absolute bottom-[23%] right-[22%] h-20 w-20 text-white/45" /></MotionFloat><div className="absolute bottom-7 left-8 right-8 grid grid-cols-5 gap-2">{[38, 58, 46, 74, 66].map((height, index) => <motion.span key={height} className="rounded-t-lg bg-gradient-to-t from-orange-300/60 to-amber-100/80" initial={reduced ? false : { height: 8 }} animate={reduced ? undefined : { height }} transition={reduced ? undefined : { delay: index * .1, duration: .8 }} />)}</div></div></ModeFrame>;
}

function AtomMode({ signal }: { signal: string }) {
  const reduced = useReducedMotion();
  return <ModeFrame mode="atom" signal={signal}><div className="absolute inset-0 grid place-items-center"><div className="relative h-64 w-64"><motion.div animate={reduced ? undefined : { rotate: 360 }} transition={reduced ? undefined : { duration: 16, repeat: Infinity, ease: "linear" }} className="absolute inset-3 rounded-full border border-fuchsia-200/30 rotate-45" /><motion.div animate={reduced ? undefined : { rotate: -360 }} transition={reduced ? undefined : { duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-7 rounded-full border border-violet-200/30 -rotate-45" /><div className="absolute inset-0 grid place-items-center"><span className="h-14 w-14 rounded-full bg-fuchsia-200/70 shadow-[0_0_60px_rgba(209,139,255,.65)]" /></div><Atom className="absolute inset-0 m-auto h-48 w-48 text-fuchsia-100/65" /></div></div><MotionFloat delay={0.5}><span className="absolute bottom-8 left-8 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-semibold text-white/80">Research signal · Nilore</span></MotionFloat></ModeFrame>;
}

function CampusMode({ signal }: { signal: string }) {
  return <ModeFrame mode="campus" signal={signal}><div className="absolute inset-x-6 bottom-7 top-16 md:inset-x-12"><div className="absolute inset-x-0 bottom-0 h-40 rounded-[50%] bg-gradient-to-t from-rose-300/20 to-transparent blur-xl" /><div className="absolute bottom-0 left-1/2 h-48 w-48 -translate-x-1/2 rounded-t-[7rem] border border-white/25 bg-gradient-to-t from-rose-200/20 to-white/10" /><div className="absolute bottom-0 left-1/2 h-28 w-64 -translate-x-1/2 rounded-[50%] border-t border-white/45" /><Building2 className="absolute bottom-10 left-1/2 h-28 w-28 -translate-x-1/2 text-rose-100/75" /><MotionFloat delay={0.3}><Trophy className="absolute right-8 top-8 h-12 w-12 text-orange-100/75" /></MotionFloat><MotionFloat delay={0.8}><GraduationCap className="absolute left-8 top-24 h-12 w-12 text-white/50" /></MotionFloat></div></ModeFrame>;
}

function RadarMode({ signal }: { signal: string }) {
  const reduced = useReducedMotion();
  return <ModeFrame mode="radar" signal={signal}><div className="absolute inset-0 grid place-items-center"><div className="relative h-64 w-64 rounded-full border border-blue-100/30"><div className="absolute inset-8 rounded-full border border-blue-100/25" /><div className="absolute inset-16 rounded-full border border-blue-100/20" /><motion.div animate={reduced ? undefined : { rotate: 360 }} transition={reduced ? undefined : { duration: 6, repeat: Infinity, ease: "linear" }} className="absolute left-1/2 top-1/2 h-1/2 w-px origin-bottom bg-gradient-to-t from-transparent to-blue-100" /><div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100 shadow-[0_0_30px_8px_rgba(90,140,255,.55)]" /></div><Radio className="absolute h-10 w-10 text-blue-100/60" /></div><MotionFloat delay={0.6}><span className="absolute bottom-8 right-8 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-semibold text-white/80">Islamabad · flight path</span></MotionFloat></ModeFrame>;
}

function WaveMode({ signal }: { signal: string }) {
  return <ModeFrame mode="wave" signal={signal}><div className="absolute inset-x-6 top-1/2 -translate-y-1/2 md:inset-x-10"><svg viewBox="0 0 600 180" className="w-full" aria-hidden="true"><path d="M0 92 C50 20 90 160 145 84 S245 20 290 82 S390 160 448 82 S540 30 600 88" fill="none" stroke="#3dd8cf" strokeOpacity=".8" strokeWidth="5" /><path d="M0 112 C54 45 100 182 148 106 S250 46 300 104 S398 180 452 104 S550 60 600 116" fill="none" stroke="#8b7cff" strokeOpacity=".52" strokeWidth="3" /></svg></div><MotionFloat delay={0.4}><div className="absolute bottom-8 left-8 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/12 px-4 py-3 text-xs font-semibold text-white/80"><Sparkles className="h-4 w-4 text-teal-200" /> Connected campus network</div></MotionFloat></ModeFrame>;
}

function ConstellationMode({ signal }: { signal: string }) {
  return <ModeFrame mode="constellation" signal={signal}><div className="absolute inset-0"><svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true"><path d="M16 66 L32 28 L56 44 L78 20 L84 72 L56 82 Z" fill="none" stroke="rgba(159,140,255,.5)" strokeWidth=".6" /></svg>{[[16,66],[32,28],[56,44],[78,20],[84,72],[56,82]].map(([left, top], index) => <MotionFloat key={`${left}-${top}`} delay={index * .12}><span className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-100 shadow-[0_0_24px_8px_rgba(159,140,255,.36)]" style={{ left: `${left}%`, top: `${top}%` }} /></MotionFloat>)}<div className="absolute bottom-9 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-semibold text-white/80">Orbiting research paths</div></div></ModeFrame>;
}

function LedgerMode({ signal }: { signal: string }) {
  return <ModeFrame mode="ledger" signal={signal}><div className="absolute inset-x-7 bottom-7 top-16 grid gap-3 md:inset-x-12 md:grid-cols-2"><div className="rounded-2xl border border-amber-100/20 bg-white/10 p-4"><Landmark className="h-8 w-8 text-amber-100/80" /><p className="mt-8 text-sm font-semibold text-white">Business pathway</p><div className="mt-4 space-y-2">{["Merit map", "Portfolio", "Next move"].map((item, index) => <div key={item} className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-xs text-white/65"><span>{item}</span><span className="text-amber-100">{index + 1}/3</span></div>)}</div></div><MotionFloat delay={0.35}><div className="rounded-2xl border border-white/20 bg-gradient-to-br from-amber-200/20 to-white/10 p-4"><Layers3 className="h-8 w-8 text-amber-100/80" /><p className="mt-8 font-display text-4xl font-semibold text-white">Ready</p><p className="mt-2 text-xs text-white/60">A clearer plan beats more noise.</p></div></MotionFloat></div></ModeFrame>;
}

function PathMode({ signal }: { signal: string }) {
  return <ModeFrame mode="path" signal={signal}><div className="absolute inset-0"><svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true"><path d="M12 74 C30 72 24 36 43 48 S57 78 75 55 S82 30 92 24" fill="none" stroke="#7de1c5" strokeWidth="1.2" strokeDasharray="3 2" /><path d="M12 74 C30 72 24 36 43 48 S57 78 75 55 S82 30 92 24" fill="none" stroke="#7de1c5" strokeOpacity=".16" strokeWidth="8" /></svg><MotionFloat delay={0.2}><span className="absolute left-[9%] top-[69%] grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-white/15 text-white"><Target className="h-4 w-4" /></span></MotionFloat><MotionFloat delay={0.7}><span className="absolute right-[7%] top-[18%] grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-white/15 text-white"><Route className="h-5 w-5" /></span></MotionFloat><div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-semibold text-white/80">Plan → practice → outcome</div></div></ModeFrame>;
}

export default function UniversityHeroArt({ universityId, signal }: { universityId: string; signal: string }) {
  const mode = modeByUniversity[universityId] ?? "path";
  if (mode === "orbit") return <OrbitMode signal={signal} />;
  if (mode === "terminal") return <TerminalMode signal={signal} />;
  if (mode === "network") return <NetworkMode signal={signal} />;
  if (mode === "signal") return <SignalMode signal={signal} />;
  if (mode === "machine") return <MachineMode signal={signal} />;
  if (mode === "atom") return <AtomMode signal={signal} />;
  if (mode === "campus") return <CampusMode signal={signal} />;
  if (mode === "radar") return <RadarMode signal={signal} />;
  if (mode === "wave") return <WaveMode signal={signal} />;
  if (mode === "constellation") return <ConstellationMode signal={signal} />;
  if (mode === "ledger") return <LedgerMode signal={signal} />;
  return <PathMode signal={signal} />;
}
