"use client";

import dynamic from "next/dynamic";
import type { RefObject } from "react";
import GPUTierGate from "@/components/three/GPUTierGate";

const RoadmapPath = dynamic(() => import("./RoadmapPath"), {
  ssr: false,
  loading: () => <RoadmapFallback count={4} />,
});

const DOT_COLORS = ["#23d5c4", "#2f81ff", "#c9a24b", "#23d5c4", "#2f81ff", "#c9a24b"];

/** Static dotted line standing in for the 3D path — used while loading, on low-tier GPUs, and under prefers-reduced-motion. */
function RoadmapFallback({ count }: { count: number }) {
  return (
    <div className="flex h-full items-center justify-center px-8">
      <div className="flex w-full max-w-md items-center">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="flex flex-1 items-center last:flex-none">
            <div
              className="h-4 w-4 shrink-0 rounded-full"
              style={{ backgroundColor: DOT_COLORS[i % DOT_COLORS.length] }}
            />
            {i < count - 1 && <div className="h-px flex-1 bg-line-strong" />}
          </div>
        ))}
      </div>
    </div>
  );
}

interface RoadmapPathClientProps {
  milestoneCount: number;
  progressRef: RefObject<number>;
}

export default function RoadmapPathClient({ milestoneCount, progressRef }: RoadmapPathClientProps) {
  return (
    <div className="relative h-[180px] w-full overflow-hidden rounded-3xl border border-line bg-panel/40 md:h-[220px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(47,129,255,0.12),transparent_55%)]" />
      <GPUTierGate fallback={<RoadmapFallback count={milestoneCount} />}>
        <RoadmapPath milestoneCount={milestoneCount} progressRef={progressRef} />
      </GPUTierGate>
    </div>
  );
}
