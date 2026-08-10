"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/cn";

export interface JourneyStep {
  title: string;
  body: string;
}

interface JourneyTimelineProps {
  steps: JourneyStep[];
  className?: string;
}

export default function JourneyTimeline({ steps, className }: JourneyTimelineProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: scopeRef,
    offset: ["start 65%", "end 60%"],
  });

  return (
    <div ref={scopeRef} className={cn("relative", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-7 right-7 top-7 hidden h-[2px] -translate-y-1/2 bg-line md:block"
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-teal via-blue to-gold origin-left" 
          style={{ scaleX: scrollYProgress }} 
        />
      </div>

      <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
        {steps.map((step, index) => {
          // Calculate when this specific step should start lighting up based on scrollYProgress.
          // In GSAP we used: at = index === 0 ? 0 : (index / (steps.length - 1)) * 0.82;
          const targetProgress = steps.length <= 1 ? 0 : (index / (steps.length - 1)) * 0.82;
          
          return (
            <JourneyTimelineItem 
              key={step.title} 
              step={step} 
              index={index} 
              scrollYProgress={scrollYProgress} 
              targetProgress={targetProgress} 
            />
          );
        })}
      </ol>
    </div>
  );
}

// Extract item to a separate component so we can use hooks per item
function JourneyTimelineItem({ 
  step, 
  index, 
  scrollYProgress, 
  targetProgress 
}: { 
  step: JourneyStep; 
  index: number; 
  scrollYProgress: any; 
  targetProgress: number; 
}) {
  // If scrollYProgress reaches targetProgress, animate to active state.
  // We use useTransform to create the specific styles based on scroll progress.
  
  const scale = useTransform(scrollYProgress, [targetProgress - 0.1, targetProgress], [0.72, 1]);
  const opacity = useTransform(scrollYProgress, [targetProgress - 0.1, targetProgress], [0.55, 1]);
  // Box shadow is a bit tricky with useTransform for colors, but we can do it with an opacity fade
  const shadowOpacity = useTransform(scrollYProgress, [targetProgress - 0.1, targetProgress], [0, 0.16]);
  const boxShadow = useTransform(shadowOpacity, (val) => `0 0 0 8px rgba(35,213,196,${val})`);
  
  const labelOpacity = useTransform(scrollYProgress, [targetProgress - 0.1, targetProgress], [0.55, 1]);
  const labelY = useTransform(scrollYProgress, [targetProgress - 0.1, targetProgress], [10, 0]);

  return (
    <li className="relative flex gap-4 md:flex-col md:gap-0">
      <motion.span
        style={{ scale, opacity, boxShadow }}
        className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line bg-panel font-mono-data text-sm text-fg md:mb-5"
      >
        {String(index + 1).padStart(2, "0")}
      </motion.span>
      <motion.div style={{ opacity: labelOpacity, y: labelY }}>
        <p className="font-mono-data text-xs uppercase tracking-[0.14em] text-teal">
          Step {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="text-heading-3 mt-2 text-fg">{step.title}</h3>
        <p className="text-body-sm mt-2">{step.body}</p>
      </motion.div>
    </li>
  );
}
