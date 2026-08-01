"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, GitCommit, Target, Trophy } from "lucide-react";

const steps = [
  {
    title: "Diagnostic Baseline",
    body: "Start with a quick calibration to map current strengths and weak areas.",
    icon: Target,
    color: "text-blue-600 dark:text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Structured Daily Practice",
    body: "Follow smart practice sets with gradual difficulty progression and revision loops.",
    icon: GitCommit,
    color: "text-teal-600 dark:text-teal",
    bg: "bg-teal-500/10 dark:bg-teal/10",
  },
  {
    title: "Mock + Feedback",
    body: "Simulate the exam, then close gaps with targeted follow-up sessions.",
    icon: CheckCircle2,
    color: "text-purple-600 dark:text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Admission Readiness",
    body: "Track progress against your target university and keep refining until ready.",
    icon: Trophy,
    color: "text-orange-600 dark:text-orange-500",
    bg: "bg-orange-500/10",
  },
];

export default function AnimatedJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className="relative mt-20 max-w-5xl mx-auto pb-20">
      {/* Background Line */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-black/10 dark:bg-white/10 md:left-1/2 md:-translate-x-1/2" />
      
      {/* Animated Path Fill */}
      <motion.div 
        style={{ scaleY: pathLength, transformOrigin: "top" }}
        className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-teal-500 via-blue-500 to-purple-500 dark:from-teal dark:via-blue-500 dark:to-purple-500 md:left-1/2 md:-translate-x-1/2 shadow-[0_0_15px_rgba(20,184,166,0.3)] dark:shadow-[0_0_15px_rgba(20,184,166,0.8)]" 
      />

      <div className="space-y-16">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isEven = index % 2 === 0;

          return (
            <div key={step.title} className={`relative flex items-center gap-8 md:justify-between ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}>
              {/* Desktop Empty Column */}
              <div className="hidden md:block md:w-[45%]" />

              {/* Node Icon */}
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="absolute left-8 -translate-x-1/2 md:left-1/2 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white dark:border-black bg-white dark:bg-panel-2 z-10 shadow-sm dark:shadow-none"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step.bg}`}>
                  <Icon className={`h-4 w-4 ${step.color}`} />
                </div>
              </motion.div>

              {/* Content Card */}
              <motion.div 
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.3, type: "spring", bounce: 0.3 }}
                className="ml-16 w-full md:ml-0 md:w-[45%]"
              >
                <div className={`group relative rounded-3xl border border-black/5 dark:border-white/5 bg-white dark:bg-white/[0.02] p-8 transition-all hover:bg-black/[0.02] dark:hover:bg-white/[0.04] shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-2xl`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] dark:from-white/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100 rounded-3xl" />
                  
                  <span className="font-mono-data text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal mb-4 block">
                    Phase {String(index + 1).padStart(2, "0")}
                  </span>
                  
                  <h3 className="font-display text-2xl font-bold text-black dark:text-white tracking-tight mb-3 transition-colors">
                    {step.title}
                  </h3>
                  
                  <p className="text-black/60 dark:text-white/60 leading-relaxed font-light transition-colors">
                    {step.body}
                  </p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
