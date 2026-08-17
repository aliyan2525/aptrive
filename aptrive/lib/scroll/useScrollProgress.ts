"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

interface UseScrollProgressOptions {
  start?: string;
  end?: string;
  /**
   * Optional shaping function applied to the raw 0â†’1 scroll fraction
   * before it's written into the returned ref.
   */
  ease?: (t: number) => number;
}

/**
 * Tracks how far `scopeRef` has scrolled through its start/end window
 * as a 0â†’1 value, written into a ref rather than React state â€” a
 * WebGL scene's useFrame reads the latest value every frame without
 * forcing a React re-render on every scroll tick.
 */
export function useScrollProgress(
  scopeRef: RefObject<HTMLElement | null>,
  { start = "start 75%", end = "end 40%", ease }: UseScrollProgressOptions = {}
) {
  const progressRef = useRef(0);

  // Map legacy GSAP strings (e.g. "top 75%") to Framer Motion offset strings (e.g. "start 75%")
  const fmStart = start.replace("top", "start").replace("bottom", "end");
  const fmEnd = end.replace("top", "start").replace("bottom", "end");

  type ScrollOptions = NonNullable<Parameters<typeof useScroll>[0]>;
  const offset = [fmStart, fmEnd] as ScrollOptions["offset"];

  const { scrollYProgress } = useScroll({
    target: scopeRef,
    offset,
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // If reduced motion is preferred, we bypass tracking and pin at 1 immediately.
    // We check it inside the event or on mount. Since useMotionValueEvent handles
    // the updates, we'll just check window matchMedia on mount and override.
    progressRef.current = ease ? ease(latest) : latest;
  });

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      progressRef.current = 1;
    }
  }, []);

  return progressRef;
}


