"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock3, Filter, Search, Sparkles } from "lucide-react";
import type { PracticeSetSummary } from "@/lib/repositories/catalog.repository";

export default function PracticeDiscovery({ sets }: { sets: PracticeSetSummary[] }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<"All" | PracticeSetSummary["difficulty"]>("All");

  const filteredSets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return sets.filter((set) => {
      const matchesQuery = !normalizedQuery || [set.title, set.topic, set.chapter ?? ""].some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesDifficulty = difficulty === "All" || set.difficulty === difficulty;
      return matchesQuery && matchesDifficulty;
    });
  }, [difficulty, query, sets]);

  const featured = sets[0];

  return (
    <main className="practice-aurora min-h-screen px-4 pb-16 pt-24 md:px-8">
      <div className="container-aptrive">
        <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="eyebrow">Practice lab</div>
            <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-fg md:text-6xl">
              Practice with a real plan, not a random question pile.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
              Choose a verified Aptrive practice set, build a persisted session, and leave every attempt with clearer evidence about what to study next.
            </p>
          </div>
          <Link href="/practice/revision" className="pressable inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white/80 px-5 text-sm font-semibold text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300">
            Review mistakes
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </header>

        {featured ? (
          <section className="mb-10 overflow-hidden rounded-[1.75rem] border border-white/80 bg-[linear-gradient(120deg,rgba(255,255,255,.94),rgba(238,242,255,.82))] p-6 shadow-[0_24px_70px_rgba(46,39,97,.10)] backdrop-blur-xl md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Start with a focused set
                </div>
                <h2 className="font-display mt-4 text-2xl font-semibold text-fg md:text-3xl">{featured.title}</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted">{featured.topic}{featured.chapter ? ` · ${featured.chapter}` : ""} · {featured.questionCount} questions · {featured.estimatedMinutes} minutes.</p>
              </div>
              <Link href={`/practice/set/${featured.slug}`} className="pressable inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(111,69,255,.22)] transition hover:-translate-y-0.5 hover:bg-violet-800">
                Start this set
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </section>
        ) : null}

        <section aria-labelledby="practice-set-heading">
          <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="practice-set-heading" className="font-display text-2xl font-semibold text-fg">Available practice sets</h2>
              <p className="mt-1 text-sm text-muted" aria-live="polite">{filteredSets.length} of {sets.length} sets shown</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-2"><Filter className="h-4 w-4" aria-hidden="true" /> Filter the catalog</div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem]">
            <label className="relative block">
              <span className="sr-only">Search practice sets</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by set, topic, or chapter" className="h-12 w-full rounded-xl border border-white/60 bg-white/70 backdrop-blur-lg shadow-[0_4px_24px_rgba(0,0,0,0.02)] pl-11 pr-4 text-sm text-fg outline-none transition placeholder:text-muted-2 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10" />
            </label>
            <label>
              <span className="sr-only">Filter by difficulty</span>
              <select value={difficulty} onChange={(event) => setDifficulty(event.target.value as typeof difficulty)} className="h-12 w-full rounded-xl border border-white/60 bg-white/70 backdrop-blur-lg shadow-[0_4px_24px_rgba(0,0,0,0.02)] px-4 text-sm font-semibold text-fg outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10">
                <option value="All">All difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </label>
          </div>

          {filteredSets.length ? (
            <motion.div layout className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredSets.map((set, index) => (
                <motion.article key={set.id} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index, 8) * 0.035 }} className="premium-shell group rounded-[1.35rem] bg-white/70 backdrop-blur-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_22px_60px_rgba(46,39,97,.10)]">
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-xl bg-violet-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-violet-700">{set.difficulty}</span>
                    {set.isPremium ? <span className="rounded-full bg-gold-dim px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-gold">Premium</span> : null}
                  </div>
                  <h3 className="font-display mt-6 text-xl font-semibold text-fg">{set.title}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-muted">{set.topic}{set.chapter ? ` · ${set.chapter}` : ""}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4 font-mono-data text-xs text-muted">
                    <span>{set.questionCount} questions</span>
                    <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{set.estimatedMinutes} min</span>
                  </div>
                  <Link href={`/practice/set/${set.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition group-hover:gap-3">
                    Open practice set <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <div className="premium-shell mt-6 grid min-h-56 place-items-center rounded-[1.35rem] border border-dashed border-white/80 bg-white/60 p-8 text-center backdrop-blur-xl">
              <div>
                <p className="font-display text-xl font-semibold text-fg">No practice sets match that search.</p>
                <p className="mt-2 text-sm text-muted">Try a broader topic or reset the difficulty filter.</p>
                <button type="button" onClick={() => { setQuery(""); setDifficulty("All"); }} className="mt-5 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white">Reset filters</button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
