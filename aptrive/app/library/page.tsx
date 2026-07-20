import type { Metadata } from "next";
import { categories, contentTypeLabels } from "@/lib/library-data";
import CategoryCard from "@/components/library/CategoryCard";

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
        <div className="max-w-xl">
          <div className="eyebrow">Library</div>
          <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
            Everything you need to prepare, in one place.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Practice MCQs, past papers, mock tests, formula sheets, and
            AI-generated sets — organized by subject and filterable by
            university, entry test, difficulty, and more.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 border-y border-line py-6 md:grid-cols-4">
          <div>
            <div className="font-mono-data text-2xl font-medium text-teal">
              {totalQuestions.toLocaleString()}+
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
              Questions
            </div>
          </div>
          <div>
            <div className="font-mono-data text-2xl font-medium text-teal">
              {totalSets}
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
              Practice sets
            </div>
          </div>
          <div>
            <div className="font-mono-data text-2xl font-medium text-teal">
              {categories.length}
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
              Subjects
            </div>
          </div>
          <div>
            <div className="font-mono-data text-2xl font-medium text-teal">
              {Object.keys(contentTypeLabels).length}
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
              Content types
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>
    </>
  );
}
