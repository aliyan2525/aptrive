"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Clock3, FileText, Filter, PlayCircle, Search, X } from "lucide-react";
import { categories, contentTypeLabels, resources, type ContentType } from "@/lib/library-data";
import DifficultyBadge from "./DifficultyBadge";

const typeFilters: Array<{ label: string; value: "all" | ContentType }> = [
  { label: "All content", value: "all" },
  { label: "Practice MCQs", value: "mcq" },
  { label: "Past papers", value: "past-papers" },
  { label: "Mock tests", value: "mock-tests" },
  { label: "Revision notes", value: "revision-notes" },
];

export default function AuthenticatedLibraryWorkspace() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [contentType, setContentType] = useState<"all" | ContentType>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesCategory = category === "all" || resource.categorySlug === category;
      const matchesType = contentType === "all" || resource.contentType === contentType;
      const haystack = `${resource.title} ${resource.topic} ${resource.university ?? ""} ${resource.examTag ?? ""}`.toLowerCase();
      return matchesCategory && matchesType && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [category, contentType, query]);

  return (
    <main className="app-content min-w-0 bg-[linear-gradient(180deg,#fbfdff,#f4f7ff)] px-3 py-5 text-fg sm:px-6 sm:py-7 lg:px-9">
      <div className="mx-auto max-w-[96rem]">
        <header className="border-b border-line pb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Your library</p>
              <h1 className="font-display mt-3 text-3xl font-semibold tracking-[-0.04em] text-fg sm:text-4xl">Choose what to work on.</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Open a practice set, past paper, mock test, or revision note and get straight into the work.</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-muted">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/75 px-3 py-2"><BookOpen className="h-3.5 w-3.5 text-violet-600" /> {resources.length} resources</span>
              <span className="hidden rounded-full border border-line bg-white/75 px-3 py-2 sm:inline-flex">{categories.length} subjects</span>
            </div>
          </div>
        </header>

        <section className="mt-6 rounded-[1.35rem] border border-white/90 bg-white/80 p-4 shadow-[0_14px_40px_rgba(33,45,92,0.06)] backdrop-blur-xl sm:p-5" aria-label="Library filters">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search topics, tests, or universities" aria-label="Search library" className="h-12 w-full rounded-xl border border-line bg-white/90 pl-11 pr-11 text-sm text-fg outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10" />
              {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear library search" className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted-2 hover:bg-slate-900/[0.04] hover:text-fg"><X className="h-4 w-4" /></button>}
            </div>
            <button type="button" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white/80 px-4 text-sm font-semibold text-muted transition hover:border-violet-300 hover:text-fg lg:hidden"><Filter className="h-4 w-4 text-violet-600" /> {filtersOpen ? "Hide filters" : "Filters"}</button>
            <label className="hidden lg:block">
              <span className="sr-only">Filter by subject</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-12 min-w-48 rounded-xl border border-line bg-white/90 px-4 text-sm font-semibold text-fg outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10">
                <option value="all">All subjects</option>
                {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
            </label>
            <label className="hidden lg:block">
              <span className="sr-only">Filter by content type</span>
              <select value={contentType} onChange={(event) => setContentType(event.target.value as "all" | ContentType)} className="h-12 min-w-48 rounded-xl border border-line bg-white/90 px-4 text-sm font-semibold text-fg outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10">
                {typeFilters.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </label>
          </div>

          {filtersOpen && (
            <div className="mt-4 grid gap-3 border-t border-line pt-4 lg:hidden">
              <label>
                <span className="mb-1.5 block text-xs font-semibold text-muted">Subject</span>
                <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-12 w-full rounded-xl border border-line bg-white/90 px-4 text-sm font-semibold text-fg outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10">
                  <option value="all">All subjects</option>
                  {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-semibold text-muted">Content type</span>
                <select value={contentType} onChange={(event) => setContentType(event.target.value as "all" | ContentType)} className="h-12 w-full rounded-xl border border-line bg-white/90 px-4 text-sm font-semibold text-fg outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10">
                  {typeFilters.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
            </div>
          )}
        </section>

        <section className="mt-8" aria-live="polite">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-700">Resource index</p>
              <h2 className="font-display mt-1 text-2xl font-semibold tracking-tight text-fg">Available now</h2>
            </div>
            <span className="text-xs font-semibold text-muted">Showing {filteredResources.length} of {resources.length}</span>
          </div>

          {filteredResources.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredResources.map((resource) => <AuthenticatedResourceCard key={resource.id} resource={resource} />)}
            </div>
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-line bg-white/70 px-6 py-16 text-center">
              <Search className="mx-auto h-8 w-8 text-muted-2" aria-hidden="true" />
              <h2 className="font-display mt-4 text-xl font-semibold text-fg">No resources match these filters.</h2>
              <button type="button" onClick={() => { setQuery(""); setCategory("all"); setContentType("all"); }} className="mt-5 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-fg hover:border-violet-300">Clear filters</button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function AuthenticatedResourceCard({ resource }: { resource: (typeof resources)[number] }) {
  const Icon = resource.contentType === "video" ? PlayCircle : FileText;
  return (
    <Link href={`/library/${resource.categorySlug}/${resource.id}`} className="group flex min-w-0 h-full flex-col rounded-[1.25rem] border border-white/90 bg-white/80 p-5 shadow-[0_12px_34px_rgba(33,45,92,0.06)] transition duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_18px_44px_rgba(33,45,92,0.1)] focus-visible:outline-none">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-500/10 text-violet-700"><Icon className="h-5 w-5" aria-hidden="true" /></span>
        <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${resource.premium ? "border-amber-500/20 bg-amber-500/10 text-amber-700" : "border-teal-500/20 bg-teal-500/10 text-teal-700"}`}>{resource.premium ? "Premium" : "Open"}</span>
      </div>
      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-2">{contentTypeLabels[resource.contentType]}</p>
      <h3 className="font-display mt-2 line-clamp-2 text-lg font-semibold leading-snug text-fg group-hover:text-violet-700">{resource.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{resource.topic}{resource.examTag ? ` · ${resource.examTag}` : ""}</p>
      <div className="mt-auto flex flex-wrap items-center gap-3 pt-6 text-xs text-muted">
        <DifficultyBadge difficulty={resource.difficulty} />
        {resource.solved && <span className="inline-flex items-center gap-1 text-teal-700"><CheckCircle2 className="h-3.5 w-3.5" /> Solved</span>}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-xs text-muted-2">
        <span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> {resource.questionCount > 0 ? `${resource.questionCount} questions` : "Reference material"}</span>
        <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" /> ~{resource.estimatedMinutes} min</span>
      </div>
    </Link>
  );
}
