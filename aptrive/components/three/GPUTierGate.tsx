"use client";

import type { ReactNode } from "react";
import { useScene3D } from "./Scene3DProvider";

interface GPUTierGateProps {
  /** The real WebGL scene. */
  children: ReactNode;
  /**
   * Rendered instead of `children` while detection is pending, when
   * prefers-reduced-motion is set, or on low-tier GPUs (unless
   * `allowLowTier`). Must be a lightweight, static, CSS/SVG-only
   * visual — never a second WebGL canvas, or the fallback has the
   * same cost as the thing it's supposed to avoid.
   */
  fallback: ReactNode;
  /**
   * If true, low-tier GPUs still get `children` — the scene itself is
   * expected to read `useScene3D().preset` and scale down (fewer
   * particles, no postprocessing, no shadows). Default false: low
   * tier gets `fallback`, same as reduced-motion.
   */
  allowLowTier?: boolean;
}

export default function GPUTierGate({ children, fallback, allowLowTier = false }: GPUTierGateProps) {
  const { ready, tier, prefersReducedMotion } = useScene3D();

  if (!ready || prefersReducedMotion) {
    return <>{fallback}</>;
  }

  if (tier === "low" && !allowLowTier) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
