"use client";

import { useSyncExternalStore } from "react";
import CountUp from "react-countup";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  // No media queries on the server; assume motion is fine and let the
  // client re-render once hydrated if the user's OS actually prefers
  // reduced motion (useSyncExternalStore handles that reconciliation).
  return false;
}

/**
 * Wraps react-countup with a prefers-reduced-motion escape hatch —
 * the library itself has no opinion on that media query, so the
 * static-render fallback is handled here rather than relying on every
 * call site to remember it.
 *
 * Reads the media query via `useSyncExternalStore` rather than
 * `useState` + `useEffect`: the effect version always renders once
 * with the wrong (default) value and then immediately re-renders after
 * calling `setState` synchronously on mount, causing a cascading
 * render. `useSyncExternalStore` gets the correct value in the same
 * render and also stays in sync if the user changes the OS setting
 * while this component is mounted.
 */
export default function AnimatedStat({ value, duration = 1.4, suffix = "", decimals = 0 }: AnimatedNumberProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  if (reducedMotion) {
    return (
      <>
        {value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        {suffix}
      </>
    );
  }

  return (
    <CountUp
      end={value}
      duration={duration}
      decimals={decimals}
      suffix={suffix}
      enableScrollSpy
      scrollSpyOnce
      separator=","
    />
  );
}
