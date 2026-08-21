"use client";

import { motion } from "framer-motion";
import { Compass, Search, Sparkles, Target, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { universities } from "@/lib/universities";
import UniversityPathwayCard from "@/components/courses/UniversityPathwayCard";

export default function CoursesExperience() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return universities;
    return universities.filter((item) => `${item.name} ${item.fullName} ${item.location} ${item.formulaText}`.toLowerCase().includes(term));
  }, [query]);

  return (
    <main className="relative overflow-hidden bg-[radial-gradient(circle_at_78%_0%,rgba(191,246,239,0.54),transparent_30rem),linear-gradient(180deg,#ffffff_0%,#f7faff_54%,#eef3ff_100%)]">
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(111,69,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(35,213,196,0.035)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      <section className="container-aptrive relative z-10 pb-14 pt-24 md:pb-20 md:pt-32">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-teal-700"><span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> Aptrive Courses / target your next move</div>
            <h1 className="mt-7 max-w-4xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-neutral-950 sm:text-6xl lg:text-[5.8rem]">Prepare with a destination<span className="block text-violet-700">already in sight.</span></h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-neutral-600 md:text-lg">Choose a target university, understand the merit path, and turn preparation into a focused sequence of next actions.</p>
            <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold text-neutral-600"><span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-2 shadow-sm"><Target className="h-3.5 w-3.5 text-violet-600" /> University-specific preparation</span><span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-2 shadow-sm"><Sparkles className="h-3.5 w-3.5 text-amber-500" /> Built around real merit paths</span></div>
          </div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="premium-shell relative overflow-hidden rounded-[2rem] border bg-neutral-950 p-7 text-white shadow-[0_28px_90px_rgba(56,42,122,0.18)] md:p-9"><div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-teal-400/20 blur-3xl" /><div className="relative z-10"><div className="flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">The path is clearer when it is named</span><Compass className="h-5 w-5 text-teal-300" /></div><p className="mt-10 font-display text-4xl font-semibold tracking-tight">One target.<br /><span className="text-teal-300">A better plan.</span></p><div className="mt-9 grid grid-cols-3 gap-2 text-center"><div className="rounded-2xl border border-white/10 bg-white/5 p-3"><p className="font-display text-2xl font-semibold">{universities.length}</p><p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-white/45">universities</p></div><div className="rounded-2xl border border-white/10 bg-white/5 p-3"><p className="font-display text-2xl font-semibold">4</p><p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-white/45">path signals</p></div><div className="rounded-2xl border border-white/10 bg-white/5 p-3"><p className="font-display text-2xl font-semibold">1</p><p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-white/45">next move</p></div></div></div></motion.div>
        </div>
      </section>
      <section className="container-aptrive relative z-10 pb-24 md:pb-32"><div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500">University pathways</span><h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-neutral-950">Choose your target environment.</h2></div><div className="relative w-full md:max-w-sm"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search university or city" className="h-12 w-full rounded-2xl border border-neutral-200 bg-white/80 pl-11 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10" /></div></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((university, index) => <UniversityPathwayCard key={university.id} university={university} index={index} />)}</div>{filtered.length === 0 && <div className="rounded-[1.5rem] border border-dashed border-neutral-300 bg-white/60 px-6 py-16 text-center"><Search className="mx-auto h-8 w-8 text-neutral-300" /><p className="mt-4 font-display text-xl font-semibold text-neutral-900">No target matches that search.</p></div>}</section>
    </main>
  );
}
