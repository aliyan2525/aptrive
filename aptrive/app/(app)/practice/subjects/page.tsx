import type { Metadata } from "next";
import Link from "next/link";
import { listSubjectsWithStats } from "@/lib/repositories/catalog.repository";

export const metadata: Metadata = {
  title: "Practice by Subject — Aptrive",
  description: "Browse the real question bank by subject and start a practice session.",
};

export default async function PracticeSubjectsPage() {
  const subjects = await listSubjectsWithStats();

  return (
    <section className="container-aptrive py-16 md:py-24">
      <div className="max-w-xl">
        <div className="eyebrow">Practice</div>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
          Choose a subject to practice.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Every set here is backed by real questions in the bank — progress,
          streaks, and topic mastery update automatically as you go.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) =>
          subject.isComingSoon ? (
            <div
              key={subject.id}
              className="rounded-2xl border border-line bg-panel p-5 opacity-50"
            >
              <h3 className="font-display text-base font-semibold text-fg">
                {subject.name}
              </h3>
              <p className="mt-2 text-xs text-muted">Coming soon</p>
            </div>
          ) : (
            <Link
              key={subject.id}
              href={`/practice/subjects/${subject.slug}`}
              className="rounded-2xl border border-line bg-panel p-5 transition-colors hover:border-line-strong"
            >
              <h3 className="font-display text-base font-semibold text-fg">
                {subject.name}
              </h3>
              {subject.description ? (
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {subject.description}
                </p>
              ) : null}
              <div className="mt-4 flex gap-4 font-mono-data text-xs text-muted">
                <span>{subject.practiceSetCount} sets</span>
                <span>{subject.questionCount} questions</span>
              </div>
            </Link>
          )
        )}

        {subjects.length === 0 ? (
          <p className="text-sm text-muted">
            No subjects have been published to the question bank yet.
          </p>
        ) : null}
      </div>
    </section>
  );
}
