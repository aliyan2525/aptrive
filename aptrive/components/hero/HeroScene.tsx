"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useScene3D } from "@/components/three/Scene3DProvider";
import { useScrollProgress } from "@/lib/scroll/useScrollProgress";
import { getStarfieldDensity, NEBULA_FOG_COLOR } from "@/lib/three/universe-theme";
import EducationalUniverse from "./scene/EducationalUniverse";
import KnowledgeParticles from "./scene/KnowledgeParticles";
import HeroStarfield from "./scene/HeroStarfield";
import CameraRig from "./useHeroCameraRig";
import PostFX from "./PostFX";

export default function HeroScene() {
  const { preset, tier } = useScene3D();
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  // Tracks scroll progress through the Hero section itself — 0 as its
  // top reaches the viewport top, 1 as its bottom leaves the viewport
  // top — so the camera travel plays out over exactly the scroll
  // distance the user spends leaving Hero, not an arbitrary window.
  const scrollProgressRef = useScrollProgress(containerRef, {
    start: "top top",
    end: "bottom top",
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect();
      pointerRef.current = {
        x: ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        y: -(((event.clientY - bounds.top) / bounds.height) * 2 - 1),
      };
    };

    container.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => container.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-line bg-panel/40 md:h-[520px]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(35,213,196,0.16),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(47,129,255,0.2),transparent_48%)]" />

      <Canvas
        dpr={preset.dpr}
        gl={{ antialias: preset.antialias, alpha: true }}
        camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 100 }}
        // The scene is decorative, not interactive content — screen
        // readers and keyboard users get nothing of value from it, so
        // it's hidden from the accessibility tree rather than left as
        // an unlabeled canvas.
        aria-hidden
      >
        <Suspense fallback={null}>
          {/* Subtle depth fog reading from the shared theme, not an
              arbitrary color — reads as nebula haze at the edges of
              the scene without obscuring the nucleus at its center. */}
          <fog attach="fog" args={[NEBULA_FOG_COLOR, 6, 16]} />

          <ambientLight intensity={0.5} />
          <pointLight position={[2, 4, 5]} intensity={1.4} color="#23d5c4" />
          <pointLight position={[-3, -2, -4]} intensity={0.5} color="#c9a24b" />

          <HeroStarfield count={getStarfieldDensity(tier)} />
          <EducationalUniverse />
          <KnowledgeParticles count={preset.particleCount} pointerRef={pointerRef} />
          <CameraRig pointerRef={pointerRef} scrollProgressRef={scrollProgressRef} />
          {preset.postprocessing && <PostFX />}
        </Suspense>
      </Canvas>
    </div>
  );
}
