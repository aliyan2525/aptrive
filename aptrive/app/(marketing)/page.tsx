import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BrainCircuit, Timer, LineChart, MapIcon, Compass } from "lucide-react";
import dynamic from 'next/dynamic';

import Reveal from "@/components/Reveal";
import PopularUniversities from "@/components/PopularUniversities";
import FeaturedLibrary from "@/components/FeaturedLibrary";
import FAQAccordion from "@/components/FAQAccordion";
import HeadlineReveal from "@/components/transitions/HeadlineReveal";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Eyebrow from "@/components/ui/Eyebrow";
import { createClient } from "@/lib/supabase/server";
import PremiumFeatureCard from "@/components/features/PremiumFeatureCard";
import AnimatedJourney from "@/components/journey/AnimatedJourney";

// Dynamically import the 3D scene to prevent SSR mismatches and reduce initial bundle size
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-transparent" />
});

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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden border-b border-line/10 bg-graphite pt-20 perspective-1000">
        <HeroScene />
        
        <div className="container-aptrive relative z-10 py-32 md:py-48">
          <div className="mx-auto max-w-5xl text-center flex flex-col items-center">
            
            <Reveal>
              <div className="glass-panel inline-flex items-center gap-3 rounded-full px-5 py-2 mb-12 transform-gpu">
                <span className="flex h-2.5 w-2.5 rounded-full bg-teal shadow-[0_0_12px_rgba(35,213,196,0.8)] animate-pulse" />
                <Eyebrow className="text-teal tracking-widest text-[10px]">
                  The New Standard in EdTech
                </Eyebrow>
              </div>
            </Reveal>
            
            <HeadlineReveal
              lines={["Master your future.", "With beautiful precision."]}
              className="text-hero text-fg mix-blend-plus-lighter"
            />
            
            <Reveal delay={200}>
              <p className="mx-auto mt-10 max-w-2xl text-body-lg md:text-xl text-muted leading-relaxed">
                Aptrive combines responsive 3D intelligence, elite analytics, and officially aligned pathways to transform your raw potential into an admission letter.
              </p>
            </Reveal>
            
            <Reveal delay={400} className="w-full">
              <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 relative">
                <Button href="/signup" variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-teal/20 text-[15px] px-8 h-14">
                  Start Your Journey
                </Button>
                <Button href="/practice" variant="glass" size="lg" className="w-full sm:w-auto text-[15px] px-8 h-14">
                  Experience Practice
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-panel py-32 md:py-48 z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[1px] bg-gradient-to-r from-transparent via-line-strong to-transparent" />
        
        <div className="container-aptrive relative">
          <Reveal>
            <div className="mx-auto max-w-4xl text-center">
              <Eyebrow className="text-gold">Engineering Excellence</Eyebrow>
              <h2 className="text-display-2 text-fg mt-8">
                Built to be the most sophisticated educational tool in existence.
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

      <section className="relative overflow-hidden bg-panel-2 py-32 md:py-48 z-10">
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

      <section className="container-aptrive py-32 md:py-48 z-10 relative">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-line pb-12">
            <div className="max-w-2xl">
              <Eyebrow>Official Integration</Eyebrow>
              <h2 className="text-display-1 mt-6 text-fg">
                Aligned with elite merit pathways.
              </h2>
            </div>
            <Link
              href="/calculator"
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

      <section className="bg-panel py-32 md:py-48 z-10 relative border-t border-line">
        <div className="container-aptrive text-center">
          <Reveal>
            <Eyebrow className="text-teal">The Final Step</Eyebrow>
            <h2 className="text-hero text-fg mt-8 max-w-5xl mx-auto mix-blend-plus-lighter">
              It's time to realize your true potential.
            </h2>
            <div className="mt-16">
              <Button href="/signup" variant="primary" size="lg" className="h-16 px-12 text-lg shadow-[0_0_40px_rgba(35,213,196,0.3)] hover:shadow-[0_0_60px_rgba(35,213,196,0.5)]">
                Begin The Journey
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
