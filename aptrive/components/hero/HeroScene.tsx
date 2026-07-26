"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useScene3D } from "@/components/three/Scene3DProvider";
import { useScrollProgress } from "@/lib/scroll/useScrollProgress";
import { getStarfieldDensity, NEBULA_FOG_COLOR } from "@/lib/three/universe-theme";
import EducationalUniverse from "./scene/EducationalUniverse";
import KnowledgeParticles from "./scene/KnowledgeParticles";
import HeroStarfield from "./scene/HeroStarfield";
import Nebula from "./scene/Nebula";
import CameraRig from "./useHeroCameraRig";
import PostFX from "./PostFX";

/**
 * The homepage's persistent cosmic background — mounted once, fixed
 * behind the entire page (not confined to the Hero section's old
 * bordered box). The camera drifts as the *whole page* scrolls, not
 * just while the Hero section itself is passing by, so the sense of
 * "travelling through space" continues for as long as the visitor
 * scrolls the homepage.
 */
export default function HeroScene() {
  const { preset, tier } = useScene3D();
  const pointerRef = useRef({ x: 0, y: 0 });

  // `document.documentElement` is available immediately here — this
  // component is only ever mounted client-side (dynamic import with
  // ssr:false in HeroSceneClient.tsx), so there's no SSR/hydration
  // window where `document` wouldn't exist yet.
  const pageRef = useRef<HTMLElement | null>(
    typeof document !== "undefined" ? document.documentElement : null
  );

  // Tracks scroll progress across the *entire page* (top of the
  // document to the bottom), not just the Hero section's own scroll
  // range, so the camera keeps travelling for the whole homepage
  // scroll instead of settling once Hero scrolls out of view.
  const scrollProgressRef = useScrollProgress(pageRef, {
    start: "top top",
    end: "bottom bottom",
  });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -((event.clientY / window.innerHeight) * 2 - 1),
      };
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <div
      // `fixed` (not `absolute`) so the scene stays pinned to the
      // viewport as the page scrolls underneath it — the camera rig
      // does the "movement", the layer itself never scrolls away.
      className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen overflow-hidden"
      aria-hidden
    >
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
          <Nebula />
          <EducationalUniverse />
          <KnowledgeParticles count={preset.particleCount} pointerRef={pointerRef} />
          <CameraRig pointerRef={pointerRef} scrollProgressRef={scrollProgressRef} />
          {preset.postprocessing && <PostFX />}
        </Suspense>
      </Canvas>
    </div>
  );
}
