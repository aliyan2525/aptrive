import Link from "next/link";
import type { Metadata } from "next";
import TickDivider from "@/components/TickDivider";
import { CourseSchema } from "@/components/StructuredData";
import RoadmapSection from "@/components/courses/RoadmapSection";

export const metadata: Metadata = {
  title: "NUST NET Preparation — Aptrive",
  description:
    "Full NUST NET mathematics preparation: diagnostics, personalized practice, analytics, and timed mock exams.",
};

const syllabus = [
  "Algebra",
  "Trigonometry",
  "Calculus & Analytical Geometry",
  "Coordinate Geometry",
  "Sequences & Series",
  "Vectors",
  "Probability & Statistics",
  "Matrices & Determinants",
];

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

const faqs = [
  {
    q: "Who is this track for?",
    a: "Students preparing for NUST's NET engineering entrance exam who want a structured, analytics-driven approach rather than generic practice books.",
  },
  {
    q: "Is this only mathematics?",
    a: "The current track is mathematics-focused, which carries the heaviest weight in NET's engineering criteria. Additional sections are being added as Aptrive expands.",
  },
  {
    q: "How is this different from a traditional academy?",
    a: "Aptrive tracks your performance at the topic level and resequences your practice automatically. A traditional academy gives every student the same material regardless of where they're actually weak.",
  },
];

export default function NustNetPage() {
  return (
    <>
      <CourseSchema
        name="NUST NET Preparation"
        description="Mathematics-focused NUST NET preparation with diagnostics, adaptive practice, analytics, and timed mock exams."
      />
      <section className="container-aptrive py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          <div>
            <div className="eyebrow">NUST NET · Engineering</div>
            <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
              NUST NET Preparation
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
              A complete, mathematics-focused preparation track built on
              Aptrive&apos;s diagnostic-and-analytics engine — for students
              aiming to rank, not just qualify.
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
            <div className="eyebrow">Syllabus coverage</div>
            <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {syllabus.map((topic) => (
                <li
                  key={topic}
                  className="flex items-center gap-2 text-sm text-muted"
                >
                  <span className="h-1 w-1 rounded-full bg-teal" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <TickDivider />

      {/* WHAT'S INCLUDED */}
      <RoadmapSection items={included} />

      <TickDivider />

      {/* FAQ */}
      <section className="container-aptrive py-16 md:py-24">
        <div className="eyebrow">FAQ</div>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
          Common questions
        </h2>

        <div className="mt-10 divide-y divide-line border-y border-line">
          {faqs.map((item) => (
            <div key={item.q} className="py-6">
              <div className="font-display text-base font-semibold text-fg">
                {item.q}
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

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
