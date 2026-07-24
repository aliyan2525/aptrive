"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseScrollProgressOptions {
  start?: string;
  end?: string;
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
  { start = "top 75%", end = "bottom 40%" }: UseScrollProgressOptions = {}
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
        progressRef.current = self.progress;
      },
    });

    return () => trigger.kill();
  }, [scopeRef, start, end]);

  return progressRef;
}
