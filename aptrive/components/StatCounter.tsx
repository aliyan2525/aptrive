"use client";

import { useEffect, useRef, useState } from "react";

interface StatCounterProps {
  target: number;
  suffix?: string;
  label: string;
  duration?: number;
}

export default function StatCounter({
  target,
  suffix = "",
  label,
  duration = 1400,
}: StatCounterProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRun.current) {
            hasRun.current = true;
            const start = performance.now();

            const tick = (now: number) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setValue(Math.round(eased * target));
              if (progress < 1) requestAnimationFrame(tick);
            };

            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <div ref={ref}>
      <div className="font-mono-data text-4xl font-medium text-teal md:text-5xl">
        {value}
        {suffix}
      </div>
      <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
        {label}
      </div>
    </div>
  );
}
