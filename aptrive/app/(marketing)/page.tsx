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
import FloatingStats from "@/components/hero/FloatingStats";
import PremiumFeatureCard from "@/components/features/PremiumFeatureCard";
import AnimatedJourney from "@/components/journey/AnimatedJourney";
import { BrainCircuit, Timer, LineChart, MapIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Aptrive — Premium AI Prep for University Entrance Exams",
  description:
    "Aptrive helps students prepare for NUST, FAST, PIEAS, GIKI, COMSATS, UET, AIR, IST, and Bahria through adaptive AI practice and real progress analytics.",
};

type PillarColor = "blue" | "teal" | "purple" | "orange";

const pillars = [
  {
    title: "Adaptive AI Learning",
    body: "Your next question is selected from your weakest concepts, not a fixed chapter order.",
    icon: <BrainCircuit strokeWidth={1.5} className="h-7 w-7" />,
    color: "blue" as PillarColor,
  },
  {
    title: "Mock Testing Engine",
    body: "Timed sessions with exam-like pressure, clean review workflows, and focused post-test feedback.",
    icon: <Timer strokeWidth={1.5} className="h-7 w-7" />,
    color: "orange" as PillarColor,
  },
  {
    title: "Personalized Analytics",
    body: "Topic mastery, speed trends, and consistency signals designed for decision-making.",
    icon: <LineChart strokeWidth={1.5} className="h-7 w-7" />,
    color: "purple" as PillarColor,
  },
  {
    title: "University Roadmaps",
    body: "Preparation tracks aligned with Pakistan's leading entrance exams and merit expectations.",
    icon: <MapIcon strokeWidth={1.5} className="h-7 w-7" />,
    color: "teal" as PillarColor,
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
      <HeroSceneClient />

      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-line/40 pt-20">
        <FloatingStats />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal/10 via-transparent to-transparent opacity-50 pointer-events-none" />
        
        <div className="container-aptrive relative z-10 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/5 px-4 py-1.5 backdrop-blur-md mb-8">
              <span className="flex h-2 w-2 rounded-full bg-teal shadow-[0_0_8px_rgba(20,184,166,1)] animate-pulse" />
              <span className="font-mono-data text-xs font-semibold uppercase tracking-widest text-teal">
                AI-Powered Entrance Preparation
              </span>
            </div>
            
            <HeadlineReveal
              lines={["Learn like a top scorer.", "Prepare with precision."]}
              className="text-[3.5rem] leading-[1.1] md:text-[5rem] lg:text-[6rem] font-display font-bold tracking-tight text-white drop-shadow-2xl"
            />
            
            <p className="mx-auto mt-8 max-w-2xl text-lg md:text-xl text-white/70 leading-relaxed font-light">
              Aptrive combines adaptive practice, premium analytics, and exam-focused pathways
              so every study hour compounds toward your target university.
            </p>
            
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 relative">
              {/* Massive ambient glow behind buttons */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-teal/30 blur-[100px] pointer-events-none" />
              
              <Button href="/signup" variant="primary" size="lg" magnetic className="relative z-10 bg-white text-black hover:bg-white/90 hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                Create account
              </Button>
              <Button href="/practice" variant="glass" size="lg" magnetic className="relative z-10 border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-xl">
                Explore practice
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-black py-24 md:py-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="container-aptrive relative z-10">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <span className="font-mono-data text-xs font-semibold uppercase tracking-widest text-teal">
                Why Aptrive
              </span>
              <h2 className="text-[2.5rem] leading-[1.1] md:text-[4rem] font-display font-bold tracking-tight text-white mt-6">
                Built for high-stakes admissions.
              </h2>
              <p className="mt-6 text-lg text-white/60 font-light leading-relaxed max-w-2xl mx-auto">
                Move beyond generic test prep with precision-engineered tools designed exclusively for Pakistan's top engineering and medical entry tests.
              </p>
            </div>
          </Reveal>
          
          <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar, index) => (
              <PremiumFeatureCard 
                key={pillar.title}
                title={pillar.title}
                body={pillar.body}
                icon={pillar.icon}
                color={pillar.color}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-black py-24 md:py-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-teal/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-aptrive relative z-10">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <span className="font-mono-data text-xs font-semibold uppercase tracking-widest text-teal">
                Student Success Journey
              </span>
              <h2 className="text-[2.5rem] leading-[1.1] md:text-[4rem] font-display font-bold tracking-tight text-white mt-6">
                A clear progression to the finish line.
              </h2>
            </div>
          </Reveal>
          
          <AnimatedJourney />
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

        <Reveal delay={200} className="mt-12 border-t border-line pt-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-fg">Official & Verified</h4>
                <p className="text-xs text-muted-2 mt-0.5">Data from official sources</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-fg">Regularly Updated</h4>
                <p className="text-xs text-muted-2 mt-0.5">Stay informed always</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-4"/></svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-fg">Merit Made Easy</h4>
                <p className="text-xs text-muted-2 mt-0.5">Compare and plan better</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-fg">Trust & Transparency</h4>
                <p className="text-xs text-muted-2 mt-0.5">Accurate, reliable, and clear</p>
              </div>
            </div>
          </div>
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

      <section className="relative overflow-hidden bg-black py-24 md:py-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="container-aptrive relative z-10">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="font-mono-data text-xs font-semibold uppercase tracking-widest text-teal">
                FAQ
              </span>
              <h2 className="text-[2.5rem] leading-[1.1] md:text-[3.5rem] font-display font-bold tracking-tight text-white mt-6">
                Questions students ask before they begin.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={100} className="mt-16">
            <FAQAccordion />
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-black py-32 md:py-48">
        {/* Massive ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-teal/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container-aptrive relative z-10 text-center">
          <Reveal>
            <h2 className="text-[3rem] leading-[1.1] md:text-[5rem] font-display font-bold tracking-tight text-white drop-shadow-2xl max-w-4xl mx-auto">
              Ready to build your university admission edge?
            </h2>
            <p className="mt-8 text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto">
              Start with your first adaptive session and unlock your personalized roadmap to Pakistan's top universities.
            </p>
          </Reveal>
          <Reveal delay={100} className="mt-12 relative">
            <Button href="/signup" variant="primary" size="lg" magnetic className="bg-white text-black hover:bg-white/90 hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]">
              Get started now
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
