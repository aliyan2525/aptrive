import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BrainCircuit, Timer, LineChart, Compass, Play, Star } from "lucide-react";


import Reveal from "@/components/Reveal";
import PopularUniversities from "@/components/PopularUniversities";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import { createClient } from "@/lib/supabase/server";
import PremiumFeatureCard from "@/components/features/PremiumFeatureCard";
import AnimatedJourney from "@/components/journey/AnimatedJourney";

import HeroBlobsSceneWrapper from "@/components/hero/HeroBlobsSceneWrapper";
import HeroOrbitDecor from "@/components/hero/HeroOrbitDecor";
import HeroOrbitIcons from "@/components/hero/HeroOrbitIcons";
import HeroUniversityBadges from "@/components/hero/HeroUniversityBadges";
import HeroAIPathwayCard from "@/components/hero/HeroAIPathwayCard";
import HeroAvatarStack from "@/components/hero/HeroAvatarStack";
import HeroStatsBar from "@/components/hero/HeroStatsBar";
import HeroTrustedBy from "@/components/hero/HeroTrustedBy";
import { siteStats } from "@/lib/site-stats";

export const metadata: Metadata = {
  title: "Aptrive — The Global Standard for Entrance Prep",
  description: "A beautifully engineered platform to master your university entrance exams.",
};

type PillarColor = "blue" | "teal" | "purple" | "orange";

const pillars = [
  {
    title: "Dynamic Intelligence",
    body: "An engine that maps your weakest links in real time and rewrites your path accordingly.",
    icon: <BrainCircuit strokeWidth={1.5} className="h-7 w-7" />,
    color: "blue" as PillarColor,
  },
  {
    title: "Precision Simulation",
    body: "Experience the true velocity of exam day in a high-fidelity mock environment.",
    icon: <Timer strokeWidth={1.5} className="h-7 w-7" />,
    color: "orange" as PillarColor,
  },
  {
    title: "Deep Analytics",
    body: "Granular insights into your topic mastery and cognitive load during testing.",
    icon: <LineChart strokeWidth={1.5} className="h-7 w-7" />,
    color: "purple" as PillarColor,
  },
  {
    title: "Official Pathways",
    body: "Navigate the complex landscape of Pakistan's elite universities with absolute clarity.",
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
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#f5f8fc] to-[#eef1fb] pt-20">
        {/* Ambient color glows behind the composition */}
        <div className="pointer-events-none absolute -top-32 right-[-10%] h-[560px] w-[560px] rounded-full bg-teal-300/25 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-[-10%] right-[8%] h-[460px] w-[460px] rounded-full bg-amber-300/20 blur-[120px]" />
        <div className="pointer-events-none absolute left-[-15%] top-1/3 h-[420px] w-[420px] rounded-full bg-violet-200/25 blur-[120px]" />

        <div className="container-aptrive relative z-10 pb-20 pt-14 md:pb-28 md:pt-20">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
            {/* Left column — copy */}
            <div className="flex flex-col items-start text-left">
              <Reveal>
                <div className="inline-flex items-center gap-2.5 rounded-full border border-black/[0.06] bg-white/80 px-5 py-2 shadow-sm backdrop-blur-sm">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.7)] animate-pulse" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                    The New Standard in EdTech
                  </span>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <h1 className="mt-8 font-display text-[2.75rem] font-bold leading-[0.98] tracking-tight text-neutral-900 sm:text-[3.5rem] lg:text-[4.15rem]">
                  Master your future.
                  <br />
                  With{" "}
                  <span className="bg-gradient-to-r from-teal-500 via-sky-500 to-violet-500 bg-clip-text text-transparent">
                    beautiful
                  </span>{" "}
                  precision.
                </h1>
              </Reveal>

              <Reveal delay={200}>
                <p className="mt-7 max-w-xl text-lg leading-relaxed text-neutral-500">
                  Aptrive combines responsive 3D intelligence, elite analytics, and officially aligned pathways to transform your raw potential into an admission letter.
                </p>
              </Reveal>

              <Reveal delay={300} className="w-full">
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link
                    href="/signup"
                    className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-neutral-900 px-8 text-[15px] font-semibold text-white transition duration-300 [transition-timing-function:var(--ease-smooth)] hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-xl hover:shadow-neutral-900/20"
                  >
                    Start Your Journey
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/practice"
                    className="group inline-flex h-14 items-center justify-center gap-3 rounded-full border border-black/10 bg-white px-8 text-[15px] font-semibold text-neutral-900 transition duration-300 [transition-timing-function:var(--ease-smooth)] hover:-translate-y-0.5 hover:border-black/20 hover:shadow-xl hover:shadow-black/5"
                  >
                    Experience Practice
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 transition-transform duration-300 group-hover:scale-110">
                      <Play className="h-2.5 w-2.5 fill-white text-white" />
                    </span>
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={400}>
                <div className="mt-12 flex items-center gap-4">
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

            {/* Right column — liquid-glass 3D composition */}
            <div className="relative h-[380px] sm:h-[460px] lg:h-[600px]">
              <HeroOrbitDecor />
              <HeroBlobsSceneWrapper />
              <HeroOrbitIcons />
              <HeroUniversityBadges />
              <HeroAIPathwayCard />
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
              <Eyebrow className="text-violet-600">Engineering Excellence</Eyebrow>
              <h2 className="text-display-2 text-fg mt-8">
                Built like serious software for students who need clarity.
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
              <Eyebrow className="text-teal">Cognitive Path</Eyebrow>
              <h2 className="text-display-2 text-fg mt-8">
                A seamless progression to the finish line.
              </h2>
            </div>
          </Reveal>
          
          <AnimatedJourney />
        </div>
      </section>

      <section className="container-aptrive py-28 md:py-40 z-10 relative">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-line pb-12">
            <div className="max-w-2xl">
              <Eyebrow>Official Integration</Eyebrow>
              <h2 className="text-display-1 mt-6 text-fg">
                Aligned with elite merit pathways.
              </h2>
            </div>
            <Link
              href="/tools/calculator"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal transition hover:gap-3 hover:text-fg"
            >
              Access Calculator <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
        <Reveal delay={100} className="mt-16">
          <PopularUniversities />
        </Reveal>
      </section>

      <section className="bg-gradient-to-b from-white to-[#f3f7ff] py-28 md:py-40 z-10 relative border-t border-line">
        <div className="container-aptrive text-center">
          <Reveal>
            <Eyebrow className="text-teal">The Final Step</Eyebrow>
            <h2 className="text-hero text-fg mt-8 max-w-5xl mx-auto mix-blend-plus-lighter">
              Your next acceptance letter starts with today&apos;s session.
            </h2>
            <div className="mt-16">
              <Button href="/signup" variant="primary" size="lg" className="h-16 px-12 text-lg">
                Begin the journey
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
