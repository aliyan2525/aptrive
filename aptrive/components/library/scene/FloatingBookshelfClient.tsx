"use client";

import dynamic from "next/dynamic";
import GPUTierGate from "@/components/three/GPUTierGate";

const FloatingBookshelf = dynamic(() => import("./FloatingBookshelf"), {
  ssr: false,
  loading: () => <ShelfFallback />,
});

/**
 * Static row of colored bars standing in for the floating books —
 * shown while the WebGL scene is loading, on low-tier GPUs, and under
 * prefers-reduced-motion. No animation, no WebGL, just CSS.
 */
function ShelfFallback() {
  const bars = ["#23d5c4", "#2f81ff", "#c9a24b", "#23d5c4", "#2f81ff", "#c9a24b"];
  return (
    <div className="flex h-full items-center justify-center gap-3">
      {bars.map((color, i) => (
        <div
          key={i}
          className="h-24 w-14 rounded-md opacity-70"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

export default function FloatingBookshelfClient({ count = 7 }: { count?: number }) {
  return (
    <div className="relative h-[200px] w-full overflow-hidden rounded-3xl border border-line bg-panel/40 md:h-[240px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(35,213,196,0.14),transparent_55%)]" />
      <GPUTierGate fallback={<ShelfFallback />}>
        <FloatingBookshelf count={count} />
      </GPUTierGate>
    </div>
  );
}
