"use client";

import { useRef } from "react";
import { useScrollProgress } from "@/lib/scroll/useScrollProgress";
import RoadmapPathClient from "./scene/RoadmapPathClient";

interface RoadmapItem {
  title: string;
  body: string;
}

interface RoadmapSectionProps {
  items: RoadmapItem[];
}

/**
 * Drop-in replacement for the "WHAT'S INCLUDED" section every course
 * page (uet, nust-net, comsats, giki, fast, pieas) previously hand-
 * rolled identically. The actual content — title/body pairs — is
 * unchanged, still real HTML, still what a screen reader sees. The
 * roadmap scene above it is decorative and scroll-linked to this
 * section's own scroll position, so it "arrives" in sync with the
 * content underneath rather than as an unrelated animation.
 */
export default function RoadmapSection({ items }: RoadmapSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useScrollProgress(sectionRef, { start: "top 70%", end: "bottom 45%" });

  return (
    <section ref={sectionRef} className="container-aptrive py-16 md:py-24">
      <div className="eyebrow">What&apos;s included</div>
      <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
        Everything runs on the same engine.
      </h2>

      <div className="mt-10">
        <RoadmapPathClient milestoneCount={items.length} progressRef={progressRef} />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.title} className="rounded-md border border-line bg-panel p-6">
            <div className="font-display text-lg font-semibold text-fg">{item.title}</div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
