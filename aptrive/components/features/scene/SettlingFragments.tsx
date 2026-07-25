"use client";

import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { TEAL, BLUE, GOLD } from "@/lib/three/universe-theme";
import { createSeededRandom } from "@/lib/three/seeded-random";

interface FragmentConfig {
  scatterPosition: THREE.Vector3;
  restPosition: THREE.Vector3;
  color: string;
  scale: number;
  spinSpeed: number;
}

interface SettlingFragmentsProps {
  /**
   * 0→1, eased "arrival" progress for this section (see
   * FeaturesScene.tsx — raw useScrollProgress output run through
   * arriveEase, per the shared convention in
   * lib/three/universe-theme.ts). At 0 the fragments sit in a wide
   * scatter (visually picking up where the Hero's released particles
   * left off); at 1 they've settled into a calmer resting cluster.
   */
  arriveProgressRef: RefObject<number>;
  count?: number;
}

/**
 * One faceted node per pillar on the Features section (default 4,
 * matching the pillars grid in app/page.tsx) — same octahedron/brand-
 * color visual language as the Hero's orbit nodes
 * (EducationalUniverse.tsx), so this reads as a continuation of that
 * motif rather than a new one, without trying to precisely align a
 * 3D node under each 2D card (fragile, and not worth the coupling for
 * an ambient background layer).
 */
export default function SettlingFragments({ arriveProgressRef, count = 4 }: SettlingFragmentsProps) {
  const fragments = useMemo<FragmentConfig[]>(() => {
    const random = createSeededRandom(count * 7_919 + 17);
    const palette = [TEAL, BLUE, GOLD];
    return Array.from({ length: count }, (_, i) => {
      // Wide, off-axis scatter for the "just arrived" state — spread
      // across and slightly behind where the content sits, so it
      // reads as background depth, not foreground clutter competing
      // with the pillar cards.
      const scatterPosition = new THREE.Vector3(
        (random() - 0.5) * 14,
        (random() - 0.5) * 6 + 3,
        -4 - random() * 3
      );
      // Rest state: a gentle, wide arc rather than a tight cluster —
      // still reads as ambient once settled, doesn't draw the eye to
      // one spot.
      const angle = (i / count) * Math.PI * 1.4 - Math.PI * 0.7;
      const restPosition = new THREE.Vector3(Math.sin(angle) * 6.5, Math.cos(angle) * 1.2 + 1.5, -5);
      return {
        scatterPosition,
        restPosition,
        color: palette[i % palette.length],
        scale: 0.28 + random() * 0.18,
        spinSpeed: 0.15 + random() * 0.2,
      };
    });
  }, [count]);

  return (
    <>
      {fragments.map((fragment, i) => (
        <Fragment key={i} config={fragment} arriveProgressRef={arriveProgressRef} />
      ))}
    </>
  );
}

function Fragment({ config, arriveProgressRef }: { config: FragmentConfig; arriveProgressRef: RefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const arrive = arriveProgressRef.current ?? 0;

    ref.current.position.lerpVectors(config.scatterPosition, config.restPosition, arrive);
    ref.current.rotation.x += delta * config.spinSpeed;
    ref.current.rotation.y += delta * config.spinSpeed * 0.7;

    if (materialRef.current) {
      // Fades in over the first half of the arrival so it doesn't pop
      // in already-visible before it starts moving.
      materialRef.current.opacity = Math.min(1, arrive * 2);
    }
  });

  return (
    <mesh ref={ref} scale={config.scale} position={config.scatterPosition}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        ref={materialRef}
        color={config.color}
        emissive={config.color}
        emissiveIntensity={0.5}
        metalness={0.4}
        roughness={0.3}
        transparent
        opacity={0}
      />
    </mesh>
  );
}
