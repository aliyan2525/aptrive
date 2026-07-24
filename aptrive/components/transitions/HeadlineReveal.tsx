"use client";

import { useRef, type ElementType } from "react";
import gsap from "gsap";
import { useScrollTimeline } from "@/lib/scroll/useScrollTimeline";
import { cn } from "@/lib/cn";

interface HeadlineRevealProps {
  /** Each entry renders as its own masked line, revealed in a staggered sequence. */
  lines: string[];
  /** Heading tag to render — defaults to h1 since the first use is the Hero headline. */
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
}

/**
 * Line-by-line "rise from behind a mask" reveal, the same visual
 * grammar GSAP/ScrollTrigger sites commonly use for hero headlines:
 * each line sits in its own `overflow-hidden` wrapper, starts
 * translated fully below it, and animates up into place, staggered
 * per line so they arrive in sequence rather than all at once.
 *
 * Built on `useScrollTimeline` like every other scroll-driven reveal
 * in this codebase (SectionReveal, etc.) rather than a one-off GSAP
 * call, so it inherits the same reduced-motion handling (no timeline
 * built at all — lines render in their final position, never stuck
 * mid-mask) and the same mount/cleanup discipline via
 * `gsap.context().revert()`.
 *
 * Note for callers: this triggers via ScrollTrigger's normal
 * start/end semantics, which fire immediately on mount if the
 * element is already past the `start` point at load — correct for
 * above-the-fold headlines (the Hero case) without any special-casing
 * here.
 */
export default function HeadlineReveal({
  lines,
  as: Tag = "h1",
  className,
  lineClassName,
  delay = 0,
}: HeadlineRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useScrollTimeline(
    ref,
    (timeline, { scope }) => {
      const targets = scope.querySelectorAll("[data-headline-line]");
      gsap.set(targets, { yPercent: 110 });
      timeline.to(targets, {
        yPercent: 0,
        duration: 0.9,
        delay,
        ease: "power4.out",
        stagger: 0.12,
      });
    },
    { start: "top 90%" }
  );

  return (
    <Tag ref={ref as React.Ref<HTMLHeadingElement>} className={className}>
      {lines.map((line, i) => (
        // Outer span is the mask (overflow-hidden, no transform of
        // its own); inner span is what actually animates. Masking on
        // the outer element rather than the heading itself keeps each
        // line's clip region independent.
        <span key={i} className="block overflow-hidden">
          <span data-headline-line className={cn("block", lineClassName)}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
