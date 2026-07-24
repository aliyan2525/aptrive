import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionReveal from "@/components/transitions/SectionReveal";
import PopularUniversities from "@/components/PopularUniversities";
import FeaturedLibrary from "@/components/FeaturedLibrary";
import FAQAccordion from "@/components/FAQAccordion";
import HeroSceneClient from "@/components/hero/HeroSceneClient";
import HeadlineReveal from "@/components/transitions/HeadlineReveal";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";

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
    description: "A week-by-week structure for turning a fixed syllabus into a compounding daily practice habit.",
    readTime: "8 min read",
    href: "/blog",
  },
  {
    title: "Topic Mastery vs Random Practice: What Works Better?",
    category: "Learning Science",
    description: "Why chapter-order practice under-serves your weakest topics, and what to do instead.",
    readTime: "6 min read",
    href: "/blog",
  },
  {
    title: "Avoid These 7 Mistakes in Last-Month Preparation",
    category: "Exam Prep",
    description: "The most common last-month errors that quietly cost students marks on test day.",
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
        <div className="container-aptrive relative py-24 md:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
            {/* Glass panel: translucent + blurred so the gradient behind it
                still reads through, per the "glassmorphism where appropriate"
                brief — used once, on the hero, not scattered everywhere. */}
            <div className="rounded-3xl border border-line/60 bg-panel/40 p-8 backdrop-blur-xl md:p-10">
              <span className="eyebrow">AI-Powered Entrance Preparation</span>
              <HeadlineReveal
                lines={["Learn like a top scorer.", "Prepare with precision."]}
                className="text-display-1 mt-5 text-fg"
              />
              <p className="text-body-lg mt-6 max-w-xl">
                Aptrive combines adaptive practice, premium analytics, and exam-focused pathways
                so every study hour compounds toward your target university.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Button href="/signup" variant="primary" size="lg" magnetic>
                  Create account
                </Button>
                <Button href="/practice" variant="glass" size="lg" magnetic>
                  Explore practice
                </Button>
              </div>
            </div>
            <Reveal delay={120}>
              <HeroSceneClient />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-aptrive py-20 md:py-28">
        <Reveal>
          <div className="max-w-2xl">
            <span className="eyebrow">Why Aptrive</span>
            <h2 className="text-display-2 mt-4 text-fg">
              Built for high-stakes admissions, not generic test prep.
            </h2>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <SectionReveal stagger className="contents">
            {pillars.map((pillar) => (
              <Card key={pillar.title} variant="interactive" padding="lg" className="h-full">
                <h3 className="text-heading-2 text-fg">{pillar.title}</h3>
                <p className="text-body-sm mt-3">{pillar.body}</p>
              </Card>
            ))}
          </SectionReveal>
        </div>
      </section>

      <section className="border-y border-line bg-panel/40">
        <div className="container-aptrive py-20 md:py-28">
          <Reveal>
            <div className="max-w-2xl">
              <span className="eyebrow">Student Success Journey</span>
              <h2 className="text-display-2 mt-4 text-fg">
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
                <h3 className="text-heading-3 mt-3 text-fg">{step.title}</h3>
                <p className="text-body-sm mt-2">{step.body}</p>
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
              <h2 className="text-display-2 mt-4 text-fg">
                Stay aligned with official institutions and merit pathways.
              </h2>
            </div>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal transition hover:gap-2.5"
            >
              Open calculator <ArrowRight className="h-3.5 w-3.5" />
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
                <h2 className="text-display-2 mt-4 text-fg">
                  Notes, sheets, practice sets, and concept material in one place.
                </h2>
              </div>
              <Link
                href="/library"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal transition hover:gap-2.5"
              >
                Browse all resources <ArrowRight className="h-3.5 w-3.5" />
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
              <h2 className="text-display-2 mt-4 text-fg">
                Practical, data-backed preparation guidance from the Aptrive team.
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal transition hover:gap-2.5"
            >
              View blog hub <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {blogPreview.map((post, index) => (
            <Reveal key={post.title} delay={index * 80}>
              <Card variant="interactive" padding="lg" className="flex h-full flex-col">
                <p className="font-mono-data text-xs uppercase tracking-[0.14em] text-teal">{post.category}</p>
                <h3 className="text-heading-2 mt-4 text-fg">{post.title}</h3>
                <p className="text-body-sm mt-2 flex-1">{post.description}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-caption">{post.readTime}</span>
                  <Link href={post.href} className="text-sm font-semibold text-teal hover:underline">
                    Read more
                  </Link>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-aptrive pb-20 md:pb-28">
        <Reveal>
          <div className="max-w-2xl">
            <span className="eyebrow">FAQ</span>
            <h2 className="text-display-2 mt-4 text-fg">
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
            <h2 className="text-heading-1 text-fg">
              Ready to build your university admission edge?
            </h2>
            <p className="text-body mt-3">
              Start with your first adaptive session and unlock your personalized roadmap.
            </p>
          </div>
          <Button href="/signup" variant="primary" size="lg">
            Get started now
          </Button>
        </div>
      </section>
    </>
  );
}
