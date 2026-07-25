"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useScene3D } from "@/components/three/Scene3DProvider";
import { useScrollProgress } from "@/lib/scroll/useScrollProgress";
import { arriveEase, getStarfieldDensity, NEBULA_FOG_COLOR } from "@/lib/three/universe-theme";
import HeroStarfield from "../hero/scene/HeroStarfield";
import SettlingFragments from "./scene/SettlingFragments";

/**
 * Features section's own scene — same shape as HeroScene.tsx
 * (GPU-tier-aware Canvas, Suspense, shared theme constants) but full-
 * bleed and non-interactive, sitting behind the pillar cards rather
 * than in its own bordered panel. This is the template for the
 * Journey / Universities / Library sections' scenes in later phases:
 * copy this file's shape, swap in that section's own scene content
 * component in place of SettlingFragments.
 */
export default function FeaturesScene() {
  const { preset, tier } = useScene3D();
  const containerRef = useRef<HTMLDivElement>(null);

  // Per the convention documented in lib/three/universe-theme.ts:
  // new section wrappers apply arriveEase over the raw scroll
  // fraction before handing it down, so "arriveProgress" means the
  // same curve everywhere it's used across independently-mounted
  // section canvases.
  const arriveProgressRef = useScrollProgress(containerRef, {
    start: "top 75%",
    end: "bottom 40%",
    ease: arriveEase,
  });

  return (
    <div ref={containerRef} className="absolute inset-0" aria-hidden>
      <Canvas
        dpr={preset.dpr}
        gl={{ antialias: preset.antialias, alpha: true }}
        camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 100 }}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={[NEBULA_FOG_COLOR, 8, 20]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[3, 4, 5]} intensity={1.1} color="#23d5c4" />
          <pointLight position={[-4, -2, -3]} intensity={0.4} color="#c9a24b" />

          <HeroStarfield count={getStarfieldDensity(tier)} radius={11} />
          <SettlingFragments arriveProgressRef={arriveProgressRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
