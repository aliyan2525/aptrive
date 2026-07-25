"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useScene3D } from "@/components/three/Scene3DProvider";
import { useScrollProgress } from "@/lib/scroll/useScrollProgress";
import { arriveEase, getStarfieldDensity, NEBULA_FOG_COLOR } from "@/lib/three/universe-theme";
import HeroStarfield from "../hero/scene/HeroStarfield";
import TravelingSignal from "./scene/TravelingSignal";

/**
 * Journey section's ambient scene — same shape as
 * components/features/FeaturesScene.tsx (itself modeled on
 * HeroScene.tsx): GPU-tier-aware Canvas, shared theme constants,
 * arriveEase-shaped scroll progress. Swaps in TravelingSignal in
 * place of Features' SettlingFragments. Copy this file's shape again
 * for Universities/Library in later phases.
 */
export default function JourneyScene() {
  const { preset, tier } = useScene3D();
  const containerRef = useRef<HTMLDivElement>(null);

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
          <TravelingSignal arriveProgressRef={arriveProgressRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
