"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Mount once, at the app root (see app/layout.tsx). Every
 * ScrollTrigger-based timeline in the app (via useScrollTimeline)
 * depends on this being mounted above it — without it, ScrollTrigger
 * still works, it just tracks native scroll instead of Lenis's
 * smoothed scroll, so section timelines would feel slightly out of
 * sync with the smoothing everything else has.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Native scroll, no virtual-scroll layer at all. This isn't just
      // "skip the animation" — smoothed scrolling itself is a motion
      // effect some users specifically want turned off.
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      // Touch devices already scroll well natively; smoothing touch
      // input tends to feel laggy rather than premium.
      syncTouch: false,
    });

    // Keep ScrollTrigger's cached scroll position in sync with Lenis's
    // virtual scroll rather than the (unused, while Lenis is active)
    // native scrollTop.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis's internal RAF from GSAP's ticker — one animation
    // loop for the whole page instead of Lenis and GSAP each running
    // their own requestAnimationFrame.
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
