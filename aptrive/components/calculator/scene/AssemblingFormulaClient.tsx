"use client";

import dynamic from "next/dynamic";
import GPUTierGate from "@/components/three/GPUTierGate";

const AssemblingFormula = dynamic(() => import("./AssemblingFormula"), {
  ssr: false,
  // next/dynamic's `loading` render only gets Next's own loading-state
  // props, not the props passed to the lazy component — it can't know
  // `active` yet, so this is always the idle/scattered look. It's
  // shown once, briefly, while the chunk downloads.
  loading: () => <FormulaFallback active={false} />,
});

const FRAGMENT_COLORS = ["#23d5c4", "#c9a24b", "#f3f5f2", "#5fe8da"];

/**
 * Static row of dots (active) or a loose scatter (idle) — used while
 * loading, on low-tier GPUs, and under prefers-reduced-motion. Mirrors
 * the two states the real scene animates between, just without motion.
 */
function FormulaFallback({ active, count = 3 }: { active: boolean; count?: number }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className={`flex items-center ${active ? "gap-2" : "gap-6"}`}>
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className="h-3 w-3 rounded-full opacity-80 transition-all duration-500"
            style={{
              backgroundColor: FRAGMENT_COLORS[i % FRAGMENT_COLORS.length],
              transform: active ? "translateY(0)" : `translateY(${i % 2 === 0 ? -6 : 6}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface AssemblingFormulaClientProps {
  fragmentCount: number;
  active: boolean;
}

export default function AssemblingFormulaClient({ fragmentCount, active }: AssemblingFormulaClientProps) {
  return (
    <div className="relative h-16 w-full overflow-hidden">
      <GPUTierGate fallback={<FormulaFallback active={active} count={fragmentCount} />}>
        <AssemblingFormula fragmentCount={fragmentCount} active={active} />
      </GPUTierGate>
    </div>
  );
}
