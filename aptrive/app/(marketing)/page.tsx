import type { Metadata } from "next";

import { redirect } from "next/navigation";
import { BrainCircuit, Timer, LineChart, Compass, Star } from "lucide-react";


import Reveal from "@/components/Reveal";
import UniversityAlignedSection from "@/components/home/UniversityAlignedSection";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import { createClient } from "@/lib/supabase/server";
import PremiumFeatureCard from "@/components/features/PremiumFeatureCard";
import AnimatedJourney from "@/components/journey/AnimatedJourney";

import HeroBlobsSceneWrapper from "@/components/hero/HeroBlobsSceneWrapper";
import HeroCTAButtons from "@/components/hero/HeroCTAButtons";
import SignalToScore from "@/components/hero/SignalToScore";
import HeroAtmosphere from "@/components/hero/HeroAtmosphere";
import HeroOrbitDecor from "@/components/hero/HeroOrbitDecor";
import HeroOrbitIcons from "@/components/hero/HeroOrbitIcons";
import HeroUniversityBadges from "@/components/hero/HeroUniversityBadges";
import RotatingHeroPhrase from "@/components/hero/RotatingHeroPhrase";
import HeroAvatarStack from "@/components/hero/HeroAvatarStack";
import HeroStatsBar from "@/components/hero/HeroStatsBar";
import HeroTrustedBy from "@/components/hero/HeroTrustedBy";
import { siteStats } from "@/lib/site-stats";

export const metadata: Metadata = {
  title: "Aptrive — Entrance Exam Prep for Pakistan's Top Universities",
  description: "Aptrive combines realistic mock exams, targeted practice, and smart analytics to help you prepare with a clear plan for your dream university.",
};

type PillarColor = "blue" | "teal" | "purple" | "orange";

const pillars = [
  {
    title: "Targeted Practice",
    body: "Find the topics costing you marks and focus your next study session where it matters most.",
    icon: <BrainCircuit strokeWidth={1.5} className="h-7 w-7" />,
    color: "blue" as PillarColor,
  },
  {
    title: "Realistic Mock Exams",
    body: "Practise with timed questions in a high-fidelity exam environment before test day.",
    icon: <Timer strokeWidth={1.5} className="h-7 w-7" />,
    color: "orange" as PillarColor,
  },
  {
    title: "Progress You Can Use",
    body: "See topic mastery, accuracy, and improvement trends without guesswork.",
    icon: <LineChart strokeWidth={1.5} className="h-7 w-7" />,
    color: "purple" as PillarColor,
  },
  {
    title: "A Clear Study System",
    body: "Turn your score, weak topics, and next study move into one clear plan you can act on.",
    icon: <Compass strokeWidth={1.5} className="h-7 w-7" />,
    color: "teal" as PillarColor,
  },
];

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <>
      <section className="homepage-hero relative overflow-hidden bg-[radial-gradient(circle_at_82%_34%,rgba(191,246,239,0.72),transparent_31rem),radial-gradient(circle_at_66%_18%,rgba(231,237,255,0.84),transparent_30rem),linear-gradient(180deg,#ffffff_0%,#f7faff_62%,#eef3ff_100%)] pt-20">
        {/* Ambient color glows behind the composition */}
        <div className="pointer-events-none absolute -top-32 right-[-8%] h-[640px] w-[640px] rounded-full bg-cyan-200/35 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-[-14%] right-[8%] h-[520px] w-[520px] rounded-full bg-violet-200/24 blur-[130px]" />
        <div className="pointer-events-none absolute left-[-15%] top-1/3 h-[440px] w-[440px] rounded-full bg-sky-100/50 blur-[120px]" />

        <div className="container-aptrive relative z-10 pb-16 pt-14 md:pb-24 md:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-6 xl:gap-2">
            {/* Left column â€” copy */}
            <div className="flex flex-col items-start text-left">
              <Reveal>
                <div className="inline-flex items-center gap-2.5 rounded-full border border-black/[0.06] bg-white/80 px-5 py-2 shadow-sm backdrop-blur-sm">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.7)] animate-pulse" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                    Pakistan&apos;s most trusted entrance prep platform
                  </span>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <h1 className="mt-8 max-w-[680px] font-display text-[2.9rem] font-semibold leading-[0.98] tracking-[-0.045em] text-neutral-950 sm:text-[3.8rem] lg:text-[4.35rem]">
                  Know your score. Raise it.
                  <br />
With{" "}
                  <span className="relative inline-block">
                    <span className="sr-only">beautiful</span>
                    <RotatingHeroPhrase />
                  </span>{" "}
                  precision.
                </h1>
              </Reveal>

              <Reveal delay={200}>
<p className="mt-7 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">
                  Take a free diagnostic, see exactly where you are losing marks, and leave with a focused study path for your target university.
                </p>
              </Reveal>

              <Reveal delay={300} className="w-full">
                <HeroCTAButtons />
              </Reveal>

              <Reveal delay={400}>
                <div className="mt-8 flex items-center gap-4 sm:mt-10">
                  <HeroAvatarStack />
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">
                      Join {siteStats.activeStudents}+ students nationwide
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5 text-amber-400" aria-hidden="true">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs text-neutral-500">
                        {siteStats.satisfactionRate}% report improved accuracy
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right column â€” liquid-glass 3D composition */}
            <div className="homepage-visual relative h-[420px] sm:h-[520px] lg:-ml-10 lg:h-[650px] xl:-ml-16">
              <HeroOrbitDecor />
              <HeroBlobsSceneWrapper />
              <HeroOrbitIcons />
        <SignalToScore />
              <HeroUniversityBadges />
              <HeroAtmosphere />
            </div>
          </div>

          <Reveal delay={500} className="mt-16 md:mt-24">
            <HeroStatsBar />
          </Reveal>

          <Reveal delay={600}>
            <HeroTrustedBy />
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-28 md:py-40 z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[1px] bg-gradient-to-r from-transparent via-line-strong to-transparent" />
        
        <div className="container-aptrive relative">
          <Reveal>
            <div className="mx-auto max-w-4xl text-center">
              <Eyebrow className="text-violet-600">Precision Mock Exams</Eyebrow>
              <h2 className="text-display-2 text-fg mt-8">
                Practice with realistic questions, timing, and difficulty so exam day feels familiar.
              </h2>
            </div>
          </Reveal>
          
          <div className="mt-24 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
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

      <section className="relative overflow-hidden bg-gradient-to-b from-[#f8fbff] to-white py-28 md:py-40 z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-teal-dim blur-3xl rounded-[100%] pointer-events-none opacity-50" />
        
        <div className="container-aptrive relative">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <Eyebrow className="text-teal">Adaptive Study Paths</Eyebrow>
              <h2 className="text-display-2 text-fg mt-8">
                Find your weak topics and get a focused plan for what to practise next.
              </h2>
            </div>
          </Reveal>
          
          <AnimatedJourney />
        </div>
      </section>

      <UniversityAlignedSection />

      <section className="bg-gradient-to-b from-white to-[#f3f7ff] py-28 md:py-40 z-10 relative border-t border-line">
        <div className="container-aptrive text-center">
          <Reveal>
            <Eyebrow className="text-teal">See what to study next</Eyebrow>
            <h2 className="text-hero text-fg mt-8 max-w-5xl mx-auto mix-blend-plus-lighter">
              Take a free diagnostic to see where you stand and what to study next.
            </h2>
            <div className="mt-16">
<Button href="/signup?source=homepage-final-cta" variant="primary" size="lg" className="h-16 px-12 text-lg" data-cta="homepage-final-diagnostic">
                See your score for free
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}




