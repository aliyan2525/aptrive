import type { QualityTier } from "./gpu-tier";

export interface ScenePreset {
  /** [min, max] devicePixelRatio clamp passed to <Canvas dpr={...}>. */
  dpr: [number, number];
  /** Baseline particle/instance count — individual scenes scale their own counts off this, they don't hardcode numbers. */
  particleCount: number;
  postprocessing: boolean;
  shadows: boolean;
  antialias: boolean;
}

/**
 * The three tiers every scene renders against. Adding a new visual
 * effect to a scene means adding its cost here, not sprinkling
 * `if (tier === "high")` checks through component bodies.
 */
export const QUALITY_PRESETS: Record<QualityTier, ScenePreset> = {
  low: {
    dpr: [1, 1],
    particleCount: 200,
    postprocessing: false,
    shadows: false,
    antialias: false,
  },
  medium: {
    dpr: [1, 1.5],
    particleCount: 800,
    postprocessing: true,
    shadows: false,
    antialias: true,
  },
  high: {
    dpr: [1, 2],
    particleCount: 2000,
    postprocessing: true,
    shadows: true,
    antialias: true,
  },
};
