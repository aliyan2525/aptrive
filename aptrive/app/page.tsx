import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import Reveal from "@/components/Reveal";
import PopularUniversities from "@/components/PopularUniversities";
import FeaturedLibrary from "@/components/FeaturedLibrary";
import FAQAccordion from "@/components/FAQAccordion";
import { createClient } from "@/lib/supabase/server";

const HeroOrbitScene = dynamic(() => import("@/components/HeroOrbitScene"), {
  ssr: false,
  loading: () => <div className="h-[420px] animate-pulse rounded-3xl border border-line bg-panel md:h-[520px]" />,
});

export const metadata: Metadata = {
  title: "Aptrive — Premium AI Prep for University Entrance Exams",
  description:
    "Aptrive helps students prepare for NUST, FAST, PIEAS, GIKI, COMSATS, UET, AIR, IST, and Bahria through adaptive AI practice and real progress analytics.",
};

const pillars = [
  {
    title: "Adaptive AI Learning",
    body: "Your next question is selected from your weakest concepts, not a fixed chapter order.",
  },
  {
    title: "Mock Testing Engine",
    body: "Timed sessions with exam-like pressure, clean review workflows, and focused post-test feedback.",
  },
  {
    title: "Personalized Analytics",
    body: "Topic mastery, speed trends, and consistency signals designed for decision-making.",
  },
  {
    title: "University Roadmaps",
    body: "Preparation tracks aligned with Pakistan's leading entrance exams and merit expectations.",
  },
];

const journey = [
  {
    title: "Diagnostic Baseline",
    body: "Start with a quick calibration to map current strengths and weak areas.",
  },
  {
    title: "Structured Daily Practice",
    body: "Follow smart practice sets with gradual difficulty progression and revision loops.",
  },
  {
    title: "Mock + Feedback",
    body: "Simulate the exam, then close gaps with targeted follow-up sessions.",
  },
  {
    title: "Admission Readiness",
    body: "Track progress against your target university and keep refining until ready.",
  },
];

const blogPreview = [
  {
    title: "How to Build a 12-Week NET Prep Strategy",
    category: "Study Strategy",
    readTime: "8 min read",
    href: "/blog",
  },
  {
    title: "Topic Mastery vs Random Practice: What Works Better?",
    category: "Learning Science",
    readTime: "6 min read",
    href: "/blog",
  },
  {
    title: "Avoid These 7 Mistakes in Last-Month Preparation",
    category: "Exam Prep",
    readTime: "5 min read",
    href: "/blog",
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
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(35,213,196,0.22),transparent_35%),radial-gradient(circle_at_82%_10%,rgba(47,129,255,0.22),transparent_42%),linear-gradient(to_bottom,rgba(18,22,29,0.38),transparent)]" />
        <div className="container-aptrive relative py-20 md:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <span className="eyebrow">AI-Powered Entrance Preparation</span>
              <h1 className="font-display mt-5 text-5xl font-semibold leading-[1.02] tracking-tight text-fg md:text-7xl">
                Learn like a top scorer.
                <br />
                Prepare with precision.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
                Aptrive combines adaptive practice, premium analytics, and exam-focused pathways
                so every study hour compounds toward your target university.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/signup" className="rounded-full bg-teal px-7 py-3 text-sm font-semibold text-graphite transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(35,213,196,0.28)]">
                  Create account
                </Link>
                <Link href="/practice" className="rounded-full border border-line-strong bg-panel/70 px-7 py-3 text-sm font-semibold text-fg transition hover:border-teal/50">
                  Explore practice
                </Link>
              </div>
            </div>
            <Reveal delay={120}>
              <HeroOrbitScene />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-aptrive py-20 md:py-28">
        <Reveal>
          <div className="max-w-2xl">
            <span className="eyebrow">Why Aptrive</span>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-fg md:text-5xl">
              Built for high-stakes admissions, not generic test prep.
            </h2>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 90}>
              <article className="motion-card h-full rounded-2xl border border-line bg-panel p-6">
                <h3 className="font-display text-xl font-semibold text-fg">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{pillar.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-panel/40">
        <div className="container-aptrive py-20 md:py-28">
          <Reveal>
            <div className="max-w-2xl">
              <span className="eyebrow">Student Success Journey</span>
              <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-fg md:text-5xl">
                A clear progression from first diagnostic to final admission push.
              </h2>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
            {journey.map((step, index) => (
              <Reveal key={step.title} delay={index * 90} className="bg-panel p-6">
                <p className="font-mono-data text-xs uppercase tracking-[0.14em] text-teal">
                  Step {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display mt-3 text-lg font-semibold text-fg">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-aptrive py-20 md:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-2xl">
              <span className="eyebrow">University Roadmaps</span>
              <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-fg md:text-5xl">
                Stay aligned with official institutions and merit pathways.
              </h2>
            </div>
            <Link href="/calculator" className="text-sm font-semibold text-teal hover:underline">
              Open calculator
            </Link>
          </div>
        </Reveal>
        <Reveal delay={120} className="mt-10">
          <PopularUniversities />
        </Reveal>
      </section>

      <section className="border-y border-line">
        <div className="container-aptrive py-20 md:py-28">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="max-w-2xl">
                <span className="eyebrow">Resource Library</span>
                <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-fg md:text-5xl">
                  Notes, sheets, practice sets, and concept material in one place.
                </h2>
              </div>
              <Link href="/library" className="text-sm font-semibold text-teal hover:underline">
                Browse all resources
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <FeaturedLibrary />
          </Reveal>
        </div>
      </section>

      <section className="container-aptrive py-20 md:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-2xl">
              <span className="eyebrow">Latest Blogs</span>
              <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-fg md:text-5xl">
                Practical, data-backed preparation guidance from the Aptrive team.
              </h2>
            </div>
            <Link href="/blog" className="text-sm font-semibold text-teal hover:underline">
              View blog hub
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {blogPreview.map((post, index) => (
            <Reveal key={post.title} delay={index * 80}>
              <article className="motion-card rounded-2xl border border-line bg-panel p-6">
                <p className="font-mono-data text-xs uppercase tracking-[0.14em] text-teal">{post.category}</p>
                <h3 className="font-display mt-4 text-xl font-semibold text-fg">{post.title}</h3>
                <p className="mt-2 text-sm text-muted">{post.readTime}</p>
                <Link href={post.href} className="mt-5 inline-block text-sm font-semibold text-teal hover:underline">
                  Read more
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-aptrive pb-20 md:pb-28">
        <Reveal>
          <div className="max-w-2xl">
            <span className="eyebrow">FAQ</span>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-fg md:text-5xl">
              Questions students ask before they begin.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={100} className="mt-10">
          <FAQAccordion />
        </Reveal>
      </section>

      <section className="border-t border-line bg-panel">
        <div className="container-aptrive flex flex-col items-start justify-between gap-7 py-16 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-fg md:text-4xl">
              Ready to build your university admission edge?
            </h2>
            <p className="mt-3 text-sm text-muted">
              Start with your first adaptive session and unlock your personalized roadmap.
            </p>
          </div>
          <Link href="/signup" className="rounded-full bg-teal px-7 py-3 text-sm font-semibold text-graphite transition hover:-translate-y-0.5">
            Get started now
          </Link>
        </div>
      </section>
    </>
  );
}
