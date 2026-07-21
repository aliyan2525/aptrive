import Link from "next/link";
import type { Metadata } from "next";
import TickDivider from "@/components/TickDivider";
import { CourseSchema } from "@/components/StructuredData";
import { universities } from "@/lib/universities";

const uni = universities.find((u) => u.id === "pieas")!;

export const metadata: Metadata = {
  title: "PIEAS Entry Test Preparation — Aptrive",
  description:
    "Full PIEAS entry test preparation: mathematics, physics, and English practice with diagnostics, analytics, and timed mock exams.",
};

const syllabus = [
  "Algebra & Calculus",
  "Trigonometry",
  "Physics (Mechanics, Waves, Electricity)",
  "Vectors & Matrices",
  "English Comprehension",
  "Analytical Reasoning",
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
    a: "Students preparing for PIEAS's undergraduate entry test who want a structured, analytics-driven approach rather than generic practice books.",
  },
  {
    q: "Is this only mathematics?",
    a: "The track covers mathematics and physics, which together carry the heaviest weight in PIEAS's entry test. Additional sections are being added as Aptrive expands.",
  },
  {
    q: "How is this different from a traditional academy?",
    a: "Aptrive tracks your performance at the topic level and resequences your practice automatically. A traditional academy gives every student the same material regardless of where they're actually weak.",
  },
];

export default function PieasPage() {
  return (
    <>
      <CourseSchema
        name="PIEAS Entry Test Preparation"
        description="Mathematics and physics preparation for the PIEAS entry test, with diagnostics, adaptive practice, analytics, and timed mock exams."
      />
      <section className="container-aptrive py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          <div>
            <div className="eyebrow">PIEAS · Engineering & Applied Sciences</div>
            <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
              PIEAS Entry Test Preparation
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
              A complete preparation track for PIEAS's entry test, built on
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

      {/* MERIT FORMULA */}
      <section className="container-aptrive py-16 md:py-24">
        <div className="eyebrow">Admission merit</div>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
          {uni.formulaText}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Plug in your own Matric, FSc Part-I, and entry test marks to see
          your estimated PIEAS aggregate.
        </p>
        <Link
          href={`/calculator?uni=${uni.id}`}
          className="mt-6 inline-block rounded-sm border border-teal/40 bg-teal-dim px-6 py-3 text-sm font-medium text-teal hover:bg-teal hover:text-graphite"
        >
          Calculate your PIEAS aggregate →
        </Link>
      </section>

      <TickDivider />

      {/* WHAT'S INCLUDED */}
      <section className="container-aptrive py-16 md:py-24">
        <div className="eyebrow">What&apos;s included</div>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
          Everything runs on the same engine.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {included.map((item) => (
            <div
              key={item.title}
              className="rounded-md border border-line bg-panel p-6"
            >
              <div className="font-display text-lg font-semibold text-fg">
                {item.title}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

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

      {/* CROSS-LINK TO LIBRARY */}
      <section className="container-aptrive pb-16 md:pb-24">
        <div className="rounded-md border border-line bg-panel p-6 md:p-8">
          <div className="eyebrow">Keep practicing</div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            Browse the Question Library for mathematics and physics
            practice sets, past papers, and formula sheets.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/library/mathematics"
              className="text-sm font-medium text-teal hover:underline"
            >
              Go to the Mathematics library →
            </Link>
            <Link
              href="/library/physics"
              className="text-sm font-medium text-teal hover:underline"
            >
              Go to the Physics library →
            </Link>
          </div>
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
