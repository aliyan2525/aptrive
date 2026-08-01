import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TickDivider from "@/components/TickDivider";
import { CourseSchema } from "@/components/StructuredData";
import RoadmapSection from "@/components/courses/RoadmapSection";
import UniversityLogo from "@/components/UniversityLogo";
import { getAllCourseSlugs, resolveUniversityByCourseSlug } from "@/lib/universities";

type Props = {
  params: Promise<{ university: string }>;
};

export async function generateStaticParams() {
  return getAllCourseSlugs().map((slug) => ({
    university: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const uni = resolveUniversityByCourseSlug(p.university);
  if (!uni) return {};
  
  return {
    title: `${uni.name} Preparation — Aptrive`,
    description: `Full ${uni.name} preparation: diagnostics, personalized practice, analytics, and timed mock exams.`,
  };
}

const included = [
  {
    title: "Diagnostic assessment",
    body: "A calibration test that maps your current standing across every topic before you begin.",
  },
  {
    title: "Adaptive question bank",
    body: "Thousands of MCQs sequenced by your weak topics, not a fixed book order.",
  },
  {
    title: "Topic-level analytics",
    body: "Accuracy, speed, and trend data per topic — updated after every attempt.",
  },
  {
    title: "Full-length timed mocks",
    body: "Exam-condition tests with percentile benchmarking against other Aptrive students.",
  },
];

export default async function UniversityCoursePage({ params }: Props) {
  const p = await params;
  const uni = resolveUniversityByCourseSlug(p.university);
  if (!uni) notFound();

  return (
    <>
      <CourseSchema
        name={`${uni.name} Preparation`}
        description={`Mathematics-focused ${uni.name} preparation with diagnostics, adaptive practice, analytics, and timed mock exams.`}
      />
      <section className="container-aptrive py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          <div>
            <UniversityLogo university={uni.id} displayName={uni.name} size={48} className="mb-4" />
            <div className="eyebrow">{uni.name} · Entrance Exam</div>
            <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
              {uni.name} Preparation
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
              A complete, focused preparation track built on Aptrive&apos;s diagnostic-and-analytics engine — for students aiming to rank, not just qualify at {uni.fullName}.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="rounded-sm bg-teal px-6 py-3 text-sm font-medium text-graphite hover:opacity-90"
              >
                Start free diagnostic
              </Link>
              <Link
                href="/courses"
                className="rounded-sm border border-line-strong px-6 py-3 text-sm font-medium text-fg hover:border-teal/50"
              >
                Compare tracks
              </Link>
            </div>
          </div>

          <div className="rounded-md border border-line bg-panel p-6 md:p-8">
            <div className="eyebrow">Merit Formula</div>
            <p className="mt-3 text-sm text-muted mb-6">
              {uni.formulaText}
            </p>
            
            <div className="eyebrow">Try out the aggregate calculator</div>
            <Link
              href={`/tools/calculator?uni=${uni.id}`}
              className="mt-4 inline-block rounded-sm border border-teal/40 bg-teal-dim px-6 py-3 text-sm font-medium text-teal hover:bg-teal/10"
            >
              Calculate your {uni.name} aggregate →
            </Link>
          </div>
        </div>
      </section>

      <TickDivider />

      {/* WHAT'S INCLUDED */}
      <RoadmapSection items={included} />

      <TickDivider />

      <section className="border-t border-line bg-panel">
        <div className="container-aptrive flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-fg md:text-3xl">
              Start with a free diagnostic.
            </h2>
            <p className="mt-2 text-sm text-muted">
              See exactly where you stand before you commit.
            </p>
          </div>
          <Link
            href="/signup"
            className="whitespace-nowrap rounded-sm bg-teal px-7 py-3 text-sm font-medium text-graphite hover:opacity-90"
          >
            Start free diagnostic
          </Link>
        </div>
      </section>
    </>
  );
}
