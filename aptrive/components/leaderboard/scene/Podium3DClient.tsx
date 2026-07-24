"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import GPUTierGate from "@/components/three/GPUTierGate";
import { useScrollProgress } from "@/lib/scroll/useScrollProgress";

const Podium3D = dynamic(() => import("./Podium3D"), {
  ssr: false,
  loading: () => <PodiumFallback />,
});

/** Static three bars in medal colors — loading state, low-tier GPUs, and prefers-reduced-motion. */
function PodiumFallback() {
  const bars = [
    { color: "#c7ccd1", height: "55%" },
    { color: "#c9a24b", height: "80%" },
    { color: "#b8763f", height: "40%" },
  ];
  return (
    <div className="flex h-full items-end justify-center gap-4 pb-6">
      {bars.map((bar, i) => (
        <div
          key={i}
          className="w-16 rounded-t-md opacity-80"
          style={{ backgroundColor: bar.color, height: bar.height }}
        />
      ))}
    </div>
  );
}

export default function Podium3DClient() {
  // Self-contained: this component tracks its own scroll position
  // rather than requiring the page that mounts it to become a client
  // component — same reasoning as FloatingBookshelfClient in phase 4.
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useScrollProgress(containerRef, { start: "top 80%", end: "bottom 50%" });

  return (
    <div
      ref={containerRef}
      className="relative h-[260px] w-full overflow-hidden rounded-3xl border border-line bg-panel/40 md:h-[320px]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(201,162,75,0.14),transparent_55%)]" />
      <GPUTierGate fallback={<PodiumFallback />}>
        <Podium3D progressRef={progressRef} />
      </GPUTierGate>
    </div>
  );
}
