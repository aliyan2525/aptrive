import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSubjectBySlug,
  listPracticeSetsForSubject,
} from "@/lib/repositories/catalog.repository";
import PracticeSetCard from "@/components/practice/PracticeSetCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subjectSlug: string }>;
}): Promise<Metadata> {
  const { subjectSlug } = await params;
  const subject = await getSubjectBySlug(subjectSlug);
  if (!subject) return {};
  return {
    title: `${subject.name} Practice — Aptrive`,
    description: subject.description ?? undefined,
  };
}

export default async function SubjectPracticePage({
  params,
}: {
  params: Promise<{ subjectSlug: string }>;
}) {
  const { subjectSlug } = await params;
  const subject = await getSubjectBySlug(subjectSlug);
  if (!subject || subject.is_coming_soon) notFound();

  const sets = await listPracticeSetsForSubject(subject.id);

  return (
    <section className="container-aptrive py-16 md:py-24">
      <Link
        href="/practice/subjects"
        className="text-xs font-medium text-muted hover:text-teal"
      >
        ← All subjects
      </Link>

      <div className="mt-4 max-w-xl">
        <div className="eyebrow">{subject.name}</div>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
          {subject.name} practice sets
        </h1>
        {subject.description ? (
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {subject.description}
          </p>
        ) : null}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sets.map((set) => (
          <PracticeSetCard key={set.id} set={set} />
        ))}
        {sets.length === 0 ? (
          <p className="text-sm text-muted">No practice sets published yet.</p>
        ) : null}
      </div>
    </section>
  );
}
