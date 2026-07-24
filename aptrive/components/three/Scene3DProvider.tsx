"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useGpuCapability, type GpuCapability } from "@/lib/three/gpu-tier";
import { QUALITY_PRESETS, type ScenePreset } from "@/lib/three/quality-presets";

interface Scene3DContextValue extends GpuCapability {
  preset: ScenePreset;
  /**
   * True once it's safe to mount any WebGL canvas at all — detection
   * has resolved and the user hasn't asked for reduced motion. This
   * does NOT account for GPU tier; low-tier devices still get
   * `shouldRender3D: true` because the caller is expected to render a
   * lighter scene using `preset`, not skip 3D entirely. `GPUTierGate`
   * is what decides whether low-tier gets a fallback instead.
   */
  shouldRender3D: boolean;
}

const Scene3DContext = createContext<Scene3DContextValue | null>(null);

/**
 * Mount once near the root of the app (see app/layout.tsx). Every scene
 * component calls `useScene3D()` instead of `useGpuCapability()`
 * directly, so the (real, WebGL-probing) benchmark only ever runs once
 * per page load no matter how many scenes exist on the page.
 */
export function Scene3DProvider({ children }: { children: ReactNode }) {
  const capability = useGpuCapability();

  const value = useMemo<Scene3DContextValue>(() => {
    return {
      ...capability,
      preset: QUALITY_PRESETS[capability.tier],
      shouldRender3D: capability.ready && !capability.prefersReducedMotion,
    };
  }, [capability]);

  return <Scene3DContext.Provider value={value}>{children}</Scene3DContext.Provider>;
}

export function useScene3D(): Scene3DContextValue {
  const ctx = useContext(Scene3DContext);
  if (!ctx) {
    throw new Error("useScene3D() called outside <Scene3DProvider>. Is it mounted in app/layout.tsx?");
  }
  return ctx;
}
