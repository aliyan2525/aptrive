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
          <div className="col-span-full mt-8 rounded-2xl border border-dashed border-line p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-panel-2 text-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <h3 className="font-display mt-4 text-lg font-semibold text-fg">Question bank is compiling</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
              We are currently finalizing and verifying the latest real past papers. Practice sets will appear here once published.
            </p>
            <div className="mt-6">
              <Link href="/dashboard" className="inline-flex items-center gap-1.5 rounded-lg bg-panel-2 px-4 py-2 text-sm font-semibold text-fg transition-colors hover:bg-line">
                Return to Dashboard
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
