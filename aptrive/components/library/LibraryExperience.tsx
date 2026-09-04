"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import HeroBlobsSceneWrapper from "@/components/hero/HeroBlobsSceneWrapper";
import HeroOrbitIcons from "@/components/hero/HeroOrbitIcons";
import {
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  Check,
  Clock3,
  FileText,
  Filter,
  Layers3,
  LockKeyhole,
  PlayCircle,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { categories, contentTypeLabels, resources, type ContentType } from "@/lib/library-data";

const filters: Array<{ label: string; value: "all" | ContentType }> = [
  { label: "Everything", value: "all" },
  { label: "Practice MCQs", value: "mcq" },
  { label: "Past papers", value: "past-papers" },
  { label: "Mock tests", value: "mock-tests" },
  { label: "Revision", value: "revision-notes" },
];

const subjectAccents = [
  { icon: Target, tint: "text-violet-600", surface: "bg-violet-500/10", line: "border-violet-500/20" },
  { icon: TrendingUp, tint: "text-teal-600", surface: "bg-teal-500/10", line: "border-teal-500/20" },
  { icon: BrainCircuit, tint: "text-amber-600", surface: "bg-amber-500/10", line: "border-amber-500/20" },
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function LibraryExperience() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [filter, setFilter] = useState<"all" | ContentType>("all");
  const [showFilters, setShowFilters] = useState(false);
  const reducedMotion = useReducedMotion();
  const motionEnabled = reducedMotion === false;

  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesCategory = category === "all" || resource.categorySlug === category;
      const matchesFilter = filter === "all" || resource.contentType === filter;
      const haystack = `${resource.title} ${resource.topic} ${resource.university ?? ""} ${resource.examTag ?? ""}`.toLowerCase();
      return matchesCategory && matchesFilter && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [category, filter, query]);

  const featured = resources.find((resource) => resource.premium) ?? resources[0];
  const featuredCategory = categories.find((item) => item.slug === featured.categorySlug);

  return (
    <main className="relative overflow-hidden bg-[radial-gradient(circle_at_72%_0%,rgba(191,246,239,0.46),transparent_30rem),radial-gradient(circle_at_12%_22%,rgba(221,228,255,0.62),transparent_28rem),linear-gradient(180deg,#ffffff_0%,#f7faff_54%,#eef3ff_100%)]">
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(111,69,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(35,213,196,0.035)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />

      <section className="container-aptrive relative z-10 pb-10 pt-24 md:pb-16 md:pt-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:items-center">
          <motion.div
            initial={motionEnabled ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-teal-700">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 shadow-[0_0_0_5px_rgba(35,213,196,0.12)]" />
              Aptrive Library / 01
            </div>
            <h1 className="mt-7 max-w-4xl font-display text-[3.2rem] font-semibold leading-[0.96] tracking-[-0.06em] text-fg sm:text-6xl lg:text-[5.8rem]">
              Find the signal.
              <span className="block bg-gradient-to-r from-violet-600 via-blue-600 to-fuchsia-500 bg-clip-text text-transparent">Build the edge.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-muted md:text-lg">
              Search a focused collection of practice sets, past papers, revision notes, and timed challenges—then open the resource that moves your score forward.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-semibold text-muted">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-2 shadow-sm backdrop-blur-xl"><BookOpen className="h-3.5 w-3.5 text-violet-600" /> {formatNumber(resources.length)} resources</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-2 shadow-sm backdrop-blur-xl"><Layers3 className="h-3.5 w-3.5 text-teal-600" /> {categories.length} subjects</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-2 shadow-sm backdrop-blur-xl"><Sparkles className="h-3.5 w-3.5 text-amber-500" /> Updated weekly</span>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button type="button" className="pressable inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 text-sm font-bold text-white shadow-[0_14px_30px_rgba(79,70,229,0.22)] transition hover:-translate-y-0.5">
                Explore Library <ArrowUpRight className="h-4 w-4" />
              </button>
              <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white/75 px-8 text-sm font-semibold text-muted transition-colors hover:text-fg">
                View study plan <Clock3 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={motionEnabled ? { opacity: 0, y: 18, scale: 0.98 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[420px] sm:h-[520px] lg:-ml-10 lg:h-[650px] xl:-ml-16 flex items-center justify-center"
          >
            <HeroBlobsSceneWrapper />
            <HeroOrbitIcons />
            
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="library-featured premium-shell relative z-20 overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/76 p-6 shadow-[0_24px_70px_rgba(56,42,122,0.10)] backdrop-blur-xl md:p-7 max-w-sm">
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-700"><Star className="h-3.5 w-3.5 fill-violet-500 text-violet-500" /> Curated for your next session</span>
                  <h2 className="mt-4 max-w-sm font-display text-2xl font-semibold tracking-tight text-neutral-950">{featured.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">A high-signal resource to move from passive reading into deliberate practice.</p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white"><ArrowUpRight className="h-5 w-5" /></span>
              </div>
              <div className="relative z-10 mt-7 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                <span className="rounded-full bg-neutral-100 px-2.5 py-1.5">{featuredCategory?.name ?? "Library"}</span>
                <span className="rounded-full bg-neutral-100 px-2.5 py-1.5">{contentTypeLabels[featured.contentType]}</span>
                <span className="rounded-full bg-amber-100 px-2.5 py-1.5 text-amber-700">{featured.difficulty}</span>
              </div>
              <Link href={`/library/${featured.categorySlug}/${featured.id}`} className="pressable relative z-10 mt-7 inline-flex items-center gap-2 text-sm font-semibold text-neutral-950">Open featured resource <ArrowUpRight className="h-4 w-4 text-violet-600" /></Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="container-aptrive relative z-10 pb-10">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-700">Browse the system</span><h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg">Choose a subject to enter.</h2></div>
          <button type="button" onClick={() => setShowFilters((value) => !value)} className="pressable inline-flex items-center justify-center gap-2 self-start rounded-full border border-line bg-white/75 px-4 py-2.5 text-xs font-semibold text-muted shadow-sm backdrop-blur-xl md:self-auto"><Filter className="h-3.5 w-3.5 text-violet-600" /> {showFilters ? "Hide filters" : "Tune the view"}</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button type="button" onClick={() => setCategory("all")} className={`group relative overflow-hidden rounded-[1.75rem] border p-6 text-left transition-all duration-500 ${category === "all" ? "border-neutral-950 bg-neutral-950 text-white shadow-[0_20px_55px_rgba(0,0,0,0.15)]" : "border-white/85 bg-white/72 text-fg hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(62,72,130,0.1)]"}`}><div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-65">All subjects</span><Layers3 className="h-5 w-5 opacity-70" /></div><p className="mt-10 font-display text-4xl font-semibold tracking-tight">{formatNumber(resources.length)}</p><p className="mt-1 text-xs font-medium opacity-65">resources to explore</p></button>
          {categories.slice(0, 7).map((item, index) => {
            const accent = subjectAccents[index % subjectAccents.length];
            const Icon = accent.icon;
            const isActive = category === item.slug;
            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => setCategory(item.slug)}
                className={`group relative overflow-hidden rounded-[1.75rem] border p-6 text-left transition-all duration-500 ${isActive ? "border-violet-500 bg-violet-50/80 shadow-[0_20px_55px_rgba(111,69,255,0.12)]" : "border-white/85 bg-white/72 text-fg hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(62,72,130,0.1)]"}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`grid h-10 w-10 place-items-center rounded-2xl ${accent.surface} ${accent.tint} shadow-sm`}><Icon className="h-5 w-5" /></span>
                  <ArrowUpRight className={`h-4 w-4 transition-all duration-300 ${isActive ? "text-violet-600" : "text-muted-2 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-600"}`} />
                </div>
                <p className="mt-7 font-display text-xl font-bold tracking-tight text-fg">{item.name}</p>
                <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-muted">{item.description}</p>
                <div className="mt-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                  <span className="inline-flex items-center gap-1.5"><Check className="h-3 w-3 text-teal-600" /> {formatNumber(item.totalQuestions)} Qs</span>
                  <span>{item.estimatedStudyTime}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="container-aptrive relative z-10 py-12 md:py-20">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/85 bg-white/72 p-5 shadow-[0_26px_80px_-38px_rgba(62,72,130,0.12)] backdrop-blur-2xl md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div><span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-700">Resource index</span><h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg">What are you working on today?</h2></div>
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search topics, exams, or universities" className="h-12 w-full rounded-2xl border border-line bg-white/80 pl-11 pr-10 text-sm text-fg outline-none transition placeholder:text-muted-2 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10" />
              {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-2 hover:text-fg"><X className="h-4 w-4" /></button>}
            </div>
          </div>
          <AnimatePresence initial={false}>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-6 overflow-hidden">
                <div className="flex flex-wrap gap-2 border-t border-line pt-6">
                  {filters.map((item) => (
                    <button key={item.value} type="button" onClick={() => setFilter(item.value)} className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${filter === item.value ? "bg-neutral-950 text-white shadow-lg shadow-black/10" : "bg-white/80 text-muted border border-line hover:border-violet-300 hover:text-violet-700"}`}>
                      {filter === item.value && <Check className="mr-1.5 inline h-3 w-3" />}
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredResources.map((resource, index) => {
              const isVideo = resource.contentType === "video";
              const Icon = isVideo ? PlayCircle : FileText;
              return (
                <motion.div key={resource.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.035 }}>
                  <Link href={`/library/${resource.categorySlug}/${resource.id}`} className="group relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-white/85 bg-white/72 p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-violet-300 hover:shadow-[0_22px_55px_rgba(62,72,130,0.12)]">
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-500/10 text-violet-700 shadow-sm"><Icon className="h-5 w-5" /></span>
                      {resource.premium ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-amber-700 shadow-sm"><LockKeyhole className="h-3 w-3" /> Premium</span>
                      ) : (
                        <span className="rounded-full border border-teal-500/20 bg-teal-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-teal-700 shadow-sm">Open</span>
                      )}
                    </div>
                    <h3 className="mt-6 line-clamp-2 font-display text-lg font-bold leading-snug text-fg transition-colors group-hover:text-violet-700">{resource.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-muted">{resource.topic}{resource.examTag ? ` · ${resource.examTag}` : ""}</p>
                    <div className="mt-auto pt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                      <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" /> {resource.estimatedMinutes} min</span>
                      <span>{resource.questionCount} items</span>
                      <span className="text-violet-700">{resource.difficulty}</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
          {filteredResources.length === 0 && (
            <div className="rounded-[1.75rem] border border-dashed border-line bg-white/60 px-6 py-16 text-center">
              <Search className="mx-auto h-9 w-9 text-muted-2" />
              <p className="mt-5 font-display text-xl font-bold text-fg">No resources match that signal.</p>
              <p className="mt-2 text-sm font-medium text-muted">Try another topic, exam, or subject.</p>
            </div>
          )}
          <div className="mt-10 flex items-center justify-between border-t border-line pt-6 text-[11px] font-bold uppercase tracking-wider text-muted">
            <span>Showing {filteredResources.length} of {resources.length} resources</span>
            <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> Curated for focused practice</span>
          </div>
        </div>
      </section>
    </main>
  );
}
