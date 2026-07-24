"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseScrollProgressOptions {
  start?: string;
  end?: string;
  /**
   * Optional shaping function applied to the raw 0→1 scroll fraction
   * before it's written into the returned ref. Omit for the raw
   * linear value (existing callers keep their current behavior
   * unchanged). New section scene wrappers building the shared
   * "arrive into view" convention should pass `arriveEase` from
   * `@/lib/three/universe-theme` here so their `arriveProgress` means
   * the same curve everywhere it's used across sections.
   *
   * This function is a `useEffect` dependency — pass the stable
   * `arriveEase` export directly, not a new inline arrow
   * (`ease={(t) => arriveEase(t)}`), or the ScrollTrigger this hook
   * creates will be torn down and recreated on every render.
   */
  ease?: (t: number) => number;
}

/**
 * Tracks how far `scopeRef` has scrolled through its start/end window
 * as a 0→1 value, written into a ref rather than React state — a
 * WebGL scene's useFrame reads the latest value every frame without
 * forcing a React re-render on every scroll tick, the same reasoning
 * the hero's camera rig and particle field use for pointer position.
 *
 * Under prefers-reduced-motion the ref is pinned at 1 (fully
 * "arrived") rather than kept at 0, so a scene reading it renders its
 * completed state instead of looking permanently unfinished.
 */
export function useScrollProgress(
  scopeRef: RefObject<HTMLElement | null>,
  { start = "top 75%", end = "bottom 40%", ease }: UseScrollProgressOptions = {}
) {
  const progressRef = useRef(0);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      progressRef.current = 1;
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: scope,
      start,
      end,
      onUpdate: (self) => {
        progressRef.current = ease ? ease(self.progress) : self.progress;
      },
    });

    return () => trigger.kill();
  }, [scopeRef, start, end, ease]);

  return progressRef;
}
