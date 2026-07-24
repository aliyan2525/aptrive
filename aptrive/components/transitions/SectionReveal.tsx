"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useScrollTimeline } from "@/lib/scroll/useScrollTimeline";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  /** Animate this element's direct children individually, staggered, instead of the wrapper as one block. Use for card grids/lists. */
  stagger?: boolean;
  /** Starting offset in px that the content rises from. */
  y?: number;
  delay?: number;
}

/**
 * GSAP/ScrollTrigger version of the same "fade + rise into view"
 * intent as components/Reveal.tsx, built on useScrollTimeline so it
 * can take part in richer, cross-section timelines later (the
 * "objects carry momentum into the next section" part of the scroll-
 * storytelling brief) without a rewrite. Reveal.tsx is left in place
 * unchanged — it's a fine, cheap CSS-only choice for a page that
 * doesn't need staggering or GSAP.
 */
export default function SectionReveal({
  children,
  className = "",
  stagger = false,
  y = 32,
  delay = 0,
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useScrollTimeline(
    ref,
    (timeline, { scope }) => {
      const targets = stagger ? Array.from(scope.children) : scope;
      gsap.set(targets, { opacity: 0, y });
      timeline.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay,
        ease: "power3.out",
        stagger: stagger ? 0.08 : 0,
      });
    },
    { start: "top 85%" }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
