"use client";

import { motion } from "framer-motion";
import { Check, X, ArrowUpRight, TrendingDown, Clock, BookOpen, BrainCircuit, Crown } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";

const traditionalFeatures = [
  { text: "Rigid class schedules", icon: Clock },
  { text: "No performance analytics", icon: TrendingDown },
  { text: "Outdated, limited test banks", icon: BookOpen },
  { text: "Long commute times", icon: X },
];

const aptriveFeatures = [
  { text: "Learn anywhere, anytime", icon: Check },
  { text: "Immediate AI-driven analytics", icon: BrainCircuit },
  { text: "Unlimited adaptative mock exams", icon: Check },
  { text: "Zero commute, 100% focus", icon: Check },
];

export default function HomePricingComparison() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#f8fbff] py-28 md:py-40 z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-violet-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container-aptrive relative z-10">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow className="text-violet-600">The Modern Alternative</Eyebrow>
            <h2 className="text-display-2 text-fg mt-8">
              Skip the 50,000 RS academy fees.
            </h2>
            <p className="mt-6 text-lg text-muted max-w-2xl mx-auto">
              Physical academies charge premium prices for crowded rooms and one-size-fits-all teaching. We deliver personalized, data-driven preparation for a fraction of the cost.
            </p>
          </div>
        </Reveal>

        <div className="mt-20 grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
          {/* Traditional Academy Card */}
          <Reveal delay={0.1}>
            <div className="h-full rounded-[2rem] border border-neutral-200 bg-white/50 p-8 md:p-10 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-neutral-500">Physical Academies</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight text-neutral-400 line-through">30k-50k</span>
                    <span className="text-sm font-semibold text-neutral-400">RS / course</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 h-px w-full bg-neutral-200" />
              
              <ul className="mt-10 space-y-6">
                {traditionalFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-neutral-500">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                      <feature.icon className="h-4 w-4 text-neutral-400" />
                    </span>
                    <span className="text-sm font-medium">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Aptrive Premium Card */}
          <Reveal delay={0.2}>
            <div className="premium-shell relative h-full overflow-hidden rounded-[2rem] border border-violet-200 bg-white/80 p-8 md:p-10 shadow-[0_24px_70px_-12px_rgba(111,69,255,0.15)] backdrop-blur-xl">
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-violet-300/30 blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-700">
                    <Crown className="h-3.5 w-3.5 text-violet-600" />
                    Aptrive Pro
                  </div>
                  <h3 className="mt-6 font-display text-3xl font-semibold text-neutral-900">The Smart Choice</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-5xl font-bold tracking-tight text-neutral-900">1,000</span>
                    <span className="text-sm font-semibold text-neutral-500">RS / month</span>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 mt-10 h-px w-full bg-gradient-to-r from-violet-200 via-fuchsia-200 to-transparent" />
              
              <ul className="relative z-10 mt-10 space-y-6">
                {aptriveFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-neutral-800">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md">
                      <feature.icon className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                    <span className="text-sm font-semibold">{feature.text}</span>
                  </li>
                ))}
              </ul>
              
              <div className="relative z-10 mt-12">
                <Link href="/signup" className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800">
                  Start your prep <ArrowUpRight className="h-4 w-4 text-neutral-400 transition group-hover:text-white" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
