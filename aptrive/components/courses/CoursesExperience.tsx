"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BarChart3, Compass, Search, Sparkles, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { universities } from "@/lib/universities";
import UniversityPathwayCard from "@/components/courses/UniversityPathwayCard";

export default function CoursesExperience() {
  const [query, setQuery] = useState("");
  const reducedMotion = useReducedMotion();
  const motionEnabled = reducedMotion === false;
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return universities;
    return universities.filter((item) => `${item.name} ${item.fullName} ${item.location} ${item.formulaText}`.toLowerCase().includes(term));
  }, [query]);

  return (
    <main className="relative overflow-hidden bg-[radial-gradient(circle_at_78%_0%,rgba(191,246,239,0.46),transparent_30rem),radial-gradient(circle_at_12%_22%,rgba(221,228,255,0.62),transparent_28rem),linear-gradient(180deg,#ffffff_0%,#f7faff_54%,#eef3ff_100%)]">
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(111,69,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(35,213,196,0.035)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      <section className="container-aptrive relative z-10 pb-14 pt-24 md:pb-20 md:pt-32">
        <div className="grid gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
          <motion.div
            initial={motionEnabled ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-teal-700"><span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> Aptrive Courses / target your next move</div>
            <h1 className="mt-7 max-w-4xl font-display text-[3.2rem] font-semibold leading-[0.96] tracking-[-0.06em] text-fg sm:text-6xl lg:text-[5.8rem]">Prepare with a destination<span className="block bg-gradient-to-r from-violet-600 via-blue-600 to-fuchsia-500 bg-clip-text text-transparent">already in sight.</span></h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-muted md:text-lg">Choose a target university, understand the merit path, and turn preparation into a focused sequence of next actions.</p>
            <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold text-muted"><span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-2 shadow-sm"><Target className="h-3.5 w-3.5 text-violet-600" /> University-specific preparation</span><span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-2 shadow-sm"><Sparkles className="h-3.5 w-3.5 text-teal-600" /> Built around real merit paths</span></div>
            <div className="mobile-stack-actions mt-9 flex flex-wrap items-center gap-4 sm:flex-row"><a href="/tools/calculator" className="pressable inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 via-blue-600 to-violet-600 px-5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(79,70,229,0.22)] transition hover:-translate-y-0.5">Access Calculator <ArrowRight className="h-4 w-4" /></a><span className="inline-flex items-center gap-2 text-sm font-semibold text-muted"><Compass className="h-4 w-4 text-violet-600" /> See how it works</span></div>
          </motion.div>

          <motion.div
            initial={motionEnabled ? { opacity: 0, y: 18, scale: 0.98 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-[2rem] border border-white/85 bg-white/78 p-6 shadow-[0_28px_90px_rgba(62,72,130,0.15)] backdrop-blur-2xl md:p-8"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-teal-200/30 blur-3xl" />
            <div className="relative"><div className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-violet-700"><BarChart3 className="h-4 w-4" /> Merit calculator</span><Sparkles className="h-5 w-5 text-teal-500" /></div><p className="mt-9 font-display text-4xl font-semibold tracking-[-0.05em] text-fg">One target.<br /><span className="bg-gradient-to-r from-teal-500 to-violet-600 bg-clip-text text-transparent">A better plan.</span></p><div className="mt-8 rounded-2xl border border-white/85 bg-white/62 p-4 shadow-sm"><div className="flex items-end justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Path clarity</p><p className="mt-1 font-display text-4xl font-semibold text-fg">High</p></div><span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-[10px] font-bold text-teal-700">On track</span></div><svg viewBox="0 0 320 70" className="mt-4 h-16 w-full" fill="none" aria-hidden="true"><path d="M4 58 C42 52 54 56 84 45 S125 51 153 37 S190 44 218 30 S258 32 316 5" stroke="url(#prep-chart)" strokeWidth="3" strokeLinecap="round" /><defs><linearGradient id="prep-chart" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#23d5c4" /><stop offset="0.56" stopColor="#3b82f6" /><stop offset="1" stopColor="#6f45ff" /></linearGradient></defs></svg></div><div className="mt-5 grid grid-cols-3 gap-2 text-center">{[[universities.length,"Universities"],[4,"Path signals"],[1,"Next move"]].map(([value,label]) => <div key={String(label)} className="rounded-2xl border border-white/80 bg-white/58 p-3"><p className="font-display text-2xl font-semibold text-fg">{value}</p><p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">{label}</p></div>)}</div></div>
          </motion.div>
        </div>
      </section>

      <section className="container-aptrive relative z-10 pb-24 md:pb-32"><div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-700">University pathways</span><h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg">Choose your target environment.</h2></div><div className="relative w-full md:max-w-sm"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search university or city" className="h-12 w-full rounded-2xl border border-line bg-white/80 pl-11 pr-4 text-sm text-fg outline-none transition placeholder:text-muted-2 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10" /></div></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((university, index) => <UniversityPathwayCard key={university.id} university={university} index={index} />)}</div>{filtered.length === 0 && <div className="rounded-[1.5rem] border border-dashed border-line bg-white/60 px-6 py-16 text-center"><Search className="mx-auto h-8 w-8 text-muted-2" /><p className="mt-4 font-display text-xl font-semibold text-fg">No target matches that search.</p></div>}</section>
    </main>
  );
}
