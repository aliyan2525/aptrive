import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import StatCounter from "@/components/StatCounter";
import AttributeTicker from "@/components/AttributeTicker";
import TickDivider from "@/components/TickDivider";
import Reveal from "@/components/Reveal";
import HeroBackground from "@/components/HeroBackground";
import SocialProofBar from "@/components/SocialProofBar";
import PopularUniversities from "@/components/PopularUniversities";
import FeaturedLibrary from "@/components/FeaturedLibrary";
import Testimonials from "@/components/Testimonials";
import FAQAccordion from "@/components/FAQAccordion";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Aptrive — AI-Powered Prep for Pakistan's University Entrance Exams",
  description:
    "Prepare for NUST NET, FAST, GIKI, PIEAS, COMSATS, and UET with adaptive practice, mock exams, aggregate calculators, and AI-powered analytics.",
};

const steps = [
  {
    n: "01",
    title: "Diagnostic",
    body: "A calibration test maps exactly where you stand against the NUST NET syllabus — topic by topic, not just a single score.",
  },
  {
    n: "02",
    title: "Personalized practice",
    body: "Aptrive builds a practice sequence around your weak topics, adjusting difficulty as your accuracy improves.",
  },
  {
    n: "03",
    title: "Analytics",
    body: "Every attempt is logged: speed, accuracy, and topic trends — so you always know what to fix next, not just what you got wrong.",
  },
  {
    n: "04",
    title: "Mastery",
    body: "Timed full-length mocks under real exam conditions confirm you're ready before test day.",
  },
];

const features = [
  {
    title: "Adaptive practice engine",
    body: "Question sequencing adjusts to your accuracy in real time, so every session targets your weakest topics first.",
  },
  {
    title: "Full question library",
    body: "Practice MCQs, past papers, mock tests, formula sheets, and AI-generated sets — organized and filterable by subject.",
  },
  {
    title: "Exam-grade mock tests",
    body: "Full-length, timed mocks that mirror real entrance exam conditions, section timing included.",
  },
  {
    title: "Transparent analytics",
    body: "A topic-level breakdown of accuracy, speed, and trend — not just a final percentage.",
  },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <>
      {/* HERO */}
      <section className="relative container-aptrive overflow-hidden pt-16 pb-14 md:pt-24 md:pb-20">
        <HeroBackground />
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <div className="eyebrow">NUST NET · Engineering Admissions</div>
            <h1 className="font-display mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-fg md:text-6xl">
              Master the Test.
              <br />
              Unlock Your Future.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              Aptrive combines structured education, performance analytics, and
              modern technology — built for students who aim to rank, not
              merely qualify.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="rounded-sm bg-teal px-6 py-3 text-sm font-medium text-graphite transition-transform hover:-translate-y-0.5 hover:opacity-90"
              >
                Start free diagnostic
              </Link>
              <Link
                href="/library"
                className="rounded-sm border border-line-strong px-6 py-3 text-sm font-medium text-fg transition-colors hover:border-teal/50"
              >
                Browse library
              </Link>
            </div>
          </div>

          {/* Signature element: calibration / analytics panel */}
          <div className="rounded-md border border-line bg-panel p-6 md:p-8">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Live diagnostic — sample</span>
              <span className="font-mono-data text-xs text-muted-2">
                sess_04831
              </span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-6">
              <StatCounter target={94} suffix="%" label="Accuracy — Algebra" />
              <StatCounter target={78} suffix="%" label="Accuracy — Calculus" />
              <StatCounter target={91} label="Percentile" />
            </div>

            <div className="mt-8 tick-rule" />

            <p className="mt-6 text-sm leading-relaxed text-muted">
              Every practice attempt updates your topic-level profile in
              real time — this is what a student&apos;s dashboard looks like
              after two weeks on Aptrive.
            </p>
          </div>
        </div>
      </section>

      <SocialProofBar />
      <AttributeTicker />

      {/* FEATURES */}
      <section className="container-aptrive py-20 md:py-28">
        <Reveal>
          <div className="max-w-xl">
            <div className="eyebrow">Why choose Aptrive</div>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
              Engineered for precision, not repetition.
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 80}>
              <div className="h-full rounded-md border border-line bg-panel p-6 transition-colors hover:border-teal/40">
                <div className="font-display text-base font-semibold text-fg">
                  {feature.title}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {feature.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <TickDivider />

      {/* HOW IT WORKS */}
      <section className="container-aptrive py-20 md:py-28">
        <Reveal>
          <div className="max-w-xl">
            <div className="eyebrow">How Aptrive works</div>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
              A precise process, not a guessing game.
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 80} className="bg-panel">
              <div className="h-full p-6 md:p-7">
                <div className="font-mono-data text-sm text-teal">{step.n}</div>
                <div className="font-display mt-4 text-lg font-semibold text-fg">
                  {step.title}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <TickDivider />

      {/* ANALYTICS SHOWCASE */}
      <section className="container-aptrive py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <Reveal>
            <div>
              <div className="eyebrow">The analytics engine</div>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
                You don&apos;t need more practice questions. You need to know
                which ones matter.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
                Traditional academies hand every student the same book.
                Aptrive tracks accuracy, speed, and topic trends per student,
                and resequences practice automatically — so your time goes
                toward what will actually move your score.
              </p>
              <ul className="mt-8 space-y-4 text-sm text-muted">
                <li className="flex gap-3">
                  <span className="text-teal">—</span>
                  Topic-level mastery tracking across the full NUST NET syllabus
                </li>
                <li className="flex gap-3">
                  <span className="text-teal">—</span>
                  Percentile benchmarking against other Aptrive students
                </li>
                <li className="flex gap-3">
                  <span className="text-teal">—</span>
                  Full-length timed mocks that mirror real exam conditions
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-md border border-line bg-panel p-6 md:p-8">
              <div className="eyebrow">Topic mastery</div>
              <div className="mt-6 space-y-5">
                {[
                  { topic: "Algebra", pct: 92 },
                  { topic: "Trigonometry", pct: 84 },
                  { topic: "Calculus", pct: 71 },
                  { topic: "Coordinate Geometry", pct: 64 },
                ].map((row) => (
                  <div key={row.topic}>
                    <div className="flex justify-between text-xs text-muted">
                      <span>{row.topic}</span>
                      <span className="font-mono-data text-fg">{row.pct}%</span>
                    </div>
                    <div className="mt-2 h-1 w-full bg-line">
                      <div
                        className="h-1 bg-teal transition-all duration-1000"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <TickDivider />

      {/* FEATURED LIBRARY */}
      <section className="container-aptrive py-20 md:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <div className="eyebrow">The library</div>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
                Every resource, organized by subject.
              </h2>
            </div>
            <Link
              href="/library"
              className="text-sm font-medium text-teal hover:opacity-80"
            >
              View full library →
            </Link>
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-12">
          <FeaturedLibrary />
        </Reveal>
      </section>

      <TickDivider />

      {/* POPULAR UNIVERSITIES */}
      <section className="container-aptrive py-20 md:py-28">
        <Reveal>
          <div className="max-w-xl">
            <div className="eyebrow">Popular universities</div>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
              Know exactly where you stand for merit.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Aggregate formulas for the universities Aptrive students target
              most, kept current each admission cycle.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-12">
          <PopularUniversities />
        </Reveal>
      </section>

      <TickDivider />

      {/* EXAM COVERAGE */}
      <section className="container-aptrive py-20 md:py-28">
        <Reveal>
          <div className="max-w-xl">
            <div className="eyebrow">Exam coverage</div>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
              Built for NUST NET. Built to expand.
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Reveal>
            <Link
              href="/courses/nust-net"
              className="block h-full rounded-md border border-teal/30 bg-teal-dim p-6 transition-colors hover:border-teal/60"
            >
              <div className="eyebrow">Available now</div>
              <div className="font-display mt-3 text-xl font-semibold text-fg">
                NUST NET
              </div>
              <p className="mt-2 text-sm text-muted">
                Full mathematics-focused preparation with diagnostics,
                analytics, and mock exams.
              </p>
            </Link>
          </Reveal>

          {[
            { name: "ECAT", note: "Engineering" },
            { name: "MDCAT", note: "Medical" },
          ].map((exam, i) => (
            <Reveal key={exam.name} delay={(i + 1) * 80}>
              <div className="h-full rounded-md border border-line bg-panel p-6 opacity-70">
                <div className="font-mono-data text-xs uppercase tracking-[0.14em] text-muted-2">
                  Coming soon
                </div>
                <div className="font-display mt-3 text-xl font-semibold text-fg">
                  {exam.name}
                </div>
                <p className="mt-2 text-sm text-muted">{exam.note} admissions</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <TickDivider />

      {/* TESTIMONIALS */}
      <section className="container-aptrive py-20 md:py-28">
        <Reveal>
          <div className="max-w-xl">
            <div className="eyebrow">Student results</div>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
              Results that reflect real readiness.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-12">
          <Testimonials />
        </Reveal>
      </section>

      <TickDivider />

      {/* FAQ */}
      <section className="container-aptrive py-20 md:py-28">
        <Reveal>
          <div className="max-w-xl">
            <div className="eyebrow">FAQ</div>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
              Questions, answered.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-10">
          <FAQAccordion />
        </Reveal>
      </section>

      {/* CTA BAND */}
      <section className="border-t border-line bg-panel">
        <div className="container-aptrive flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-fg md:text-3xl">
              Better preparation leads to better outcomes.
            </h2>
            <p className="mt-2 text-sm text-muted">
              Start your free diagnostic and see exactly where you stand.
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
