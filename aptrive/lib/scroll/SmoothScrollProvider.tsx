"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

// Explicit easing curve (Lenis's own documented default) rather than
// leaving it implicit — every later phase's "does this feel right"
// tuning starts from a curve we can name and change in one place,
// instead of whatever Lenis ships as its internal default today.
const LENIS_EASING = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/**
 * Mount once, at the app root (see app/layout.tsx). Every
 * ScrollTrigger-based timeline in the app (via useScrollTimeline)
 * depends on this being mounted above it — without it, ScrollTrigger
 * still works, it just tracks native scroll instead of Lenis's
 * smoothed scroll, so section timelines would feel slightly out of
 * sync with the smoothing everything else has.
 *
 * Selective snapping (per the master prompt's scroll-storytelling
 * brief) is deliberately NOT wired up as a global Lenis behavior
 * here — snapping every scroll gesture site-wide fights a
 * content-heavy page (forms, long reading sections, the dashboard)
 * more than it helps. Sections that want a snap point should opt in
 * locally via ScrollTrigger's own `snap` option inside their
 * `useScrollTimeline` call, which already has access to the same
 * Lenis-synced ScrollTrigger instance this provider sets up below.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  // Mount-once: create the single Lenis instance and its RAF loop for
  // the lifetime of the app shell. Recreating this per navigation
  // would tear down and rebuild the animation loop and event
  // listeners on every route change for no benefit — the route-change
  // scroll reset below only needs to move the existing instance, not
  // replace it.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      // Prevent the browser from trying to restore a previous scroll
      // offset on navigation — with Lenis's virtual scroll active, the
      // native restoration and Lenis's own position can disagree,
      // producing a visible snap/jump right after a route change.
      window.history.scrollRestoration = "manual";
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Native scroll, no virtual-scroll layer at all. This isn't just
      // "skip the animation" — smoothed scrolling itself is a motion
      // effect some users specifically want turned off.
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: LENIS_EASING,
      smoothWheel: true,
      // Touch devices already scroll well natively; smoothing touch
      // input tends to feel laggy rather than premium.
      syncTouch: false,
    });
    lenisRef.current = lenis;

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
      lenisRef.current = null;
    };
  }, []);

  // Route-change: land at the top instantly rather than carrying the
  // previous page's scroll offset into it (App Router keeps this
  // provider mounted across client-side navigations, so without this
  // the new page can render already scrolled). Only resets position —
  // does not touch the Lenis instance itself.
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      // Reduced-motion path: no Lenis instance exists, reset native scroll.
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
}
