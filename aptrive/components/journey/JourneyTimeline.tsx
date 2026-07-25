"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useScrollTimeline } from "@/lib/scroll/useScrollTimeline";
import { cn } from "@/lib/cn";

export interface JourneyStep {
  title: string;
  body: string;
}

interface JourneyTimelineProps {
  steps: JourneyStep[];
  className?: string;
}

/**
 * Replaces the old static 4-card grid with a single connecting line
 * that grows left-to-right as the section scrolls into view, with
 * each step's dot lighting up in sequence as the line reaches it —
 * the "timeline grows, nodes activate" beat from the redesign brief,
 * scrubbed to scroll position rather than a one-shot reveal.
 *
 * Desktop-only for the growing line itself (`hidden md:block`) — on
 * mobile the steps stay a plain stacked list with the existing
 * Reveal-style fade, per the same "simpler tweens on mobile, no
 * scroll-linked mechanics" guardrail Phase 1 used for the Hero. The
 * dots' activation animation still runs on mobile (cheap: opacity +
 * scale + box-shadow, no layout math), it just isn't paired with a
 * visible growing line there.
 */
export default function JourneyTimeline({ steps, className }: JourneyTimelineProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);

  useScrollTimeline(
    scopeRef,
    (timeline, { scope }) => {
      const dots = scope.querySelectorAll<HTMLElement>("[data-journey-dot]");
      const labels = scope.querySelectorAll<HTMLElement>("[data-journey-label]");

      gsap.set(lineFillRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(dots, { scale: 0.72, opacity: 0.55, boxShadow: "0 0 0 0px rgba(35,213,196,0)" });
      gsap.set(labels, { opacity: 0.55, y: 10 });

      // One scrubbed timeline drives the line fill and every dot's
      // activation — the line's fill progress and "how many dots have
      // lit up" are the same signal, not two things that could drift
      // out of sync.
      timeline.to(lineFillRef.current, { scaleX: 1, ease: "none", duration: 1 }, 0);

      dots.forEach((dot, i) => {
        // First dot is already "reached" at scroll start (the journey
        // begins at Diagnostic, it doesn't need the line to travel to
        // reach step one) — spread the rest evenly across the scrub range.
        const at = steps.length <= 1 ? 0 : (i / (steps.length - 1)) * 0.82;
        timeline.to(
          dot,
          {
            scale: 1,
            opacity: 1,
            boxShadow: "0 0 0 8px rgba(35,213,196,0.16)",
            duration: 0.12,
            ease: "power2.out",
          },
          at
        );
        if (labels[i]) {
          timeline.to(labels[i], { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, at);
        }
      });
    },
    { start: "top 65%", end: "bottom 60%", scrub: 0.6 }
  );

  return (
    <div ref={scopeRef} className={cn("relative", className)}>
      {/* Connecting line — sits behind the dots, vertically centered
          on them. Desktop only; see component doc comment above. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-7 right-7 top-7 hidden h-[2px] -translate-y-1/2 bg-line md:block"
      >
        <div ref={lineFillRef} className="h-full bg-gradient-to-r from-teal via-blue to-gold" />
      </div>

      <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
        {steps.map((step, index) => (
          <li key={step.title} className="relative flex gap-4 md:flex-col md:gap-0">
            <span
              data-journey-dot
              className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line bg-panel font-mono-data text-sm text-fg md:mb-5"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div data-journey-label>
              <p className="font-mono-data text-xs uppercase tracking-[0.14em] text-teal">
                Step {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="text-heading-3 mt-2 text-fg">{step.title}</h3>
              <p className="text-body-sm mt-2">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
