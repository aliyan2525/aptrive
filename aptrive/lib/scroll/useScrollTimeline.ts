"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type TimelineBuilder = (
  timeline: gsap.core.Timeline,
  ctx: { scope: HTMLElement }
) => void;

interface UseScrollTimelineOptions {
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
}

/**
 * Builds a GSAP timeline scoped to `scopeRef`, driven by a
 * ScrollTrigger on that same element, and tears both down cleanly on
 * unmount via gsap.context().revert() — the two things that are easy
 * to get wrong hand-rolling ScrollTrigger in a React effect (stale
 * triggers surviving route changes, timelines rebuilding on every
 * render). Every scroll-driven section should go through this rather
 * than calling gsap.timeline()/ScrollTrigger.create() itself.
 *
 * Respects prefers-reduced-motion by not building a timeline at all —
 * elements are left exactly as authored in the JSX/CSS, so make sure
 * their default (pre-animation) state is itself acceptable to show
 * permanently.
 */
export function useScrollTimeline(
  scopeRef: RefObject<HTMLElement | null>,
  build: TimelineBuilder,
  {
    start = "top 80%",
    end = "bottom 20%",
    scrub = false,
    pin = false,
    markers = false,
  }: UseScrollTimelineOptions = {}
) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: scope, start, end, scrub, pin, markers },
      });
      build(timeline, { scope });
    }, scope);

    return () => ctx.revert();

    // `build` is expected to be a stable inline closure defined at the
    // call site (its own deps live in that closure) — a section is
    // meant to set up its timeline once per mount, not rebuild it
    // every render, so it's intentionally excluded here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeRef, start, end, scrub, pin, markers]);
}
