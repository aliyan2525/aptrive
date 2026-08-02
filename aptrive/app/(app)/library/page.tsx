import type { Metadata } from "next";
import { BookOpen, ClipboardList, Layers3, Search, Sparkles, Star } from "lucide-react";
import { categories, contentTypeLabels } from "@/lib/library-data";
import CategoryCard from "@/components/library/CategoryCard";
import FloatingBookshelfClient from "@/components/library/scene/FloatingBookshelfClient";

export const metadata: Metadata = {
  title: "Library — Aptrive",
  description:
    "Every resource for university entrance test preparation: practice MCQs, past papers, mock tests, formula sheets, and more — organized by subject.",
};

export default function LibraryPage() {
  const totalQuestions = categories.reduce(
    (sum, c) => sum + c.totalQuestions,
    0
  );
  const totalSets = categories.reduce((sum, c) => sum + c.practiceSets, 0);

  return (
    <>
      <section className="container-aptrive py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1fr]">
        <div className="max-w-2xl">
          <div className="eyebrow">Library</div>
          <h1 className="font-display mt-3 text-4xl font-bold tracking-normal text-fg md:text-6xl">
            Everything you need to prepare, in <span className="aurora-text">one place</span>.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Practice MCQs, past papers, mock tests, formula sheets, and
            AI-generated sets — organized by subject and filterable by
            university, entry test, difficulty, and more.
          </p>
        </div>
        <div className="min-h-[300px]">
          <FloatingBookshelfClient count={Math.min(categories.length, 7)} />
        </div>
        </div>

        <div className="premium-shell mt-10 grid grid-cols-2 gap-0 divide-x divide-y divide-line overflow-hidden rounded-[1.5rem] md:grid-cols-4 md:divide-y-0">
          <div className="flex items-center gap-4 p-6">
            <StatIcon icon={Star} tone="teal" />
            <div><div className="font-mono-data text-2xl font-bold text-teal">
              {totalQuestions.toLocaleString()}+
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
              Questions
            </div>
            </div></div>
          <div className="flex items-center gap-4 p-6">
            <StatIcon icon={Sparkles} tone="violet" />
            <div><div className="font-mono-data text-2xl font-bold text-violet-600">
              {totalSets}
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
              Practice sets
            </div>
            </div></div>
          <div className="flex items-center gap-4 p-6">
            <StatIcon icon={ClipboardList} tone="blue" />
            <div><div className="font-mono-data text-2xl font-bold text-blue-600">
              {categories.length}
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
              Subjects
            </div>
            </div></div>
          <div className="flex items-center gap-4 p-6">
            <StatIcon icon={BookOpen} tone="orange" />
            <div><div className="font-mono-data text-2xl font-bold text-orange-600">
              {Object.keys(contentTypeLabels).length}
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
              Content types
            </div>
            </div></div>
        </div>

        <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-fg">Explore Subjects</h2>
            <p className="mt-2 text-sm text-muted">Choose a subject to start learning and track your progress.</p>
          </div>
          <div className="flex gap-3">
            <button className="rounded-2xl border border-line bg-white px-5 py-3 text-sm font-semibold text-fg shadow-sm">All Entry Tests</button>
            <label className="flex min-w-0 items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 shadow-sm">
              <Search className="h-4 w-4 text-muted" />
              <span className="sr-only">Search subjects</span>
              <input className="w-44 bg-transparent text-sm outline-none placeholder:text-muted-2" placeholder="Search subjects..." />
            </label>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category, index) => (
            <CategoryCard key={category.slug} category={category} index={index} />
          ))}
        </div>
      </section>
    </>
  );
}

function StatIcon({ icon: Icon, tone }: { icon: typeof Layers3; tone: "teal" | "violet" | "blue" | "orange" }) {
  const classes = {
    teal: "bg-emerald-500/10 text-emerald-600",
    violet: "bg-violet-500/10 text-violet-600",
    blue: "bg-blue-500/10 text-blue-600",
    orange: "bg-orange-500/10 text-orange-600",
  };
  return (
    <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${classes[tone]}`}>
      <Icon className="h-6 w-6" strokeWidth={1.7} />
    </div>
  );
}
