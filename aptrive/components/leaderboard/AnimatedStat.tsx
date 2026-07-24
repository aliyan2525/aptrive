"use client";

import { useEffect, useState } from "react";
import CountUp from "react-countup";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
}

/**
 * Wraps react-countup with a prefers-reduced-motion escape hatch —
 * the library itself has no opinion on that media query, so the
 * static-render fallback is handled here rather than relying on every
 * call site to remember it.
 */
export default function AnimatedStat({ value, duration = 1.4, suffix = "", decimals = 0 }: AnimatedNumberProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

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
