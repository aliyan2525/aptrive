"use client";

import { useEffect, useState } from "react";
import { getGPUTier } from "detect-gpu";

// Typed off detect-gpu's own return value rather than importing a named
// `TierResult` type — the export name has moved between major versions,
// and this way we only depend on the shape we actually read.
type TierResult = Awaited<ReturnType<typeof getGPUTier>>;

export type QualityTier = "low" | "medium" | "high";

export interface GpuCapability {
  tier: QualityTier;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  /**
   * False until both the GPU benchmark and the reduced-motion media
   * query have resolved. Consumers should treat "not ready" as "don't
   * know yet" and render a static fallback — never assume high-tier
   * while waiting.
   */
  ready: boolean;
}

const SAFE_FALLBACK: TierResult = {
  tier: 1,
  isMobile: false,
  type: "FALLBACK",
} as TierResult;

let cachedResult: TierResult | null = null;
let pendingDetection: Promise<TierResult> | null = null;

/**
 * Runs the GPU benchmark exactly once per page load, no matter how many
 * components call this hook — detect-gpu's probe does real WebGL work,
 * so every scene re-running it independently would be wasted GPU time
 * for no additional information.
 */
function detectOnce(): Promise<TierResult> {
  if (cachedResult) return Promise.resolve(cachedResult);
  if (!pendingDetection) {
    pendingDetection = getGPUTier({ mobileTiers: [0, 50, 30, 20] })
      .then((result) => {
        cachedResult = result;
        return result;
      })
      .catch(() => {
        // detect-gpu can throw in locked-down browsers (no WebGL context,
        // some privacy modes, headless test runners). Land on the middle
        // tier rather than let a benchmark failure break the page.
        cachedResult = SAFE_FALLBACK;
        return SAFE_FALLBACK;
      });
  }
  return pendingDetection;
}

function toQualityTier(result: TierResult): QualityTier {
  // detect-gpu scale: 0 = unsupported/blocklisted, 1 = low, 2 = mid, 3 = high.
  if (result.tier <= 1) return "low";
  if (result.tier === 2) return "medium";
  return "high";
}

/**
 * Combines GPU benchmark tier + prefers-reduced-motion into the single
 * signal every 3D component in the app should key off. This is the only
 * place that decision gets made — scenes read the result, they don't
 * re-derive it.
 */
export function useGpuCapability(): GpuCapability {
  const [state, setState] = useState<GpuCapability>({
    tier: "low",
    isMobile: false,
    prefersReducedMotion: false,
    ready: false,
  });

  useEffect(() => {
    let cancelled = false;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    detectOnce().then((result) => {
      if (cancelled) return;
      setState({
        tier: toQualityTier(result),
        isMobile: Boolean(result.isMobile),
        prefersReducedMotion: reducedMotionQuery.matches,
        ready: true,
      });
    });

    const handleChange = (event: MediaQueryListEvent) => {
      setState((prev) => ({ ...prev, prefersReducedMotion: event.matches }));
    };

    reducedMotionQuery.addEventListener("change", handleChange);
    return () => {
      cancelled = true;
      reducedMotionQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return state;
}
