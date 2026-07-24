"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useScene3D } from "@/components/three/Scene3DProvider";

const PALETTE = ["#23d5c4", "#2f81ff", "#c9a24b"];

/**
 * Deliberately unlabeled: drei's <Text> would need to fetch a font
 * over the network at runtime (breaks the "no external asset fetches"
 * rule the hero scene follows) and small in-canvas 3D text reads
 * poorly at this scale anyway. The real subject names are one scroll
 * away in the actual CategoryCard grid — this banner's only job is to
 * set a "this is a library" mood, not repeat information.
 */
function Book({ index, total }: { index: number; total: number }) {
  const ref = useRef<THREE.Group>(null);
  const color = PALETTE[index % PALETTE.length];
  const baseX = (index - (total - 1) / 2) * 1.2;
  // Stable per-book phase offset so books don't bob in lockstep —
  // computed once via useMemo, not re-rolled every render.
  const seed = useMemo(() => index * 1.618, [index]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 0.5 + seed) * 0.16;
    ref.current.rotation.y = 0.15 + Math.sin(t * 0.25 + seed) * 0.2;
  });

  return (
    <group ref={ref} position={[baseX, 0, Math.cos(seed) * 0.4]}>
      <mesh>
        <boxGeometry args={[0.85, 1.25, 0.16]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.35} />
      </mesh>
      {/* Spine accent line — a thin lighter strip, the one detail that
          reads "book" rather than "colored block" at this size. */}
      <mesh position={[0, 0, 0.081]}>
        <planeGeometry args={[0.08, 1.25]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

interface FloatingBookshelfProps {
  /** How many books to render. Capped by the caller — this is a mood-setting banner, not a navigable catalog, so it shouldn't try to represent every subject. */
  count: number;
}

export default function FloatingBookshelf({ count }: FloatingBookshelfProps) {
  const { preset } = useScene3D();
  const books = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  return (
    <Canvas
      dpr={preset.dpr}
      gl={{ antialias: preset.antialias, alpha: true }}
      camera={{ position: [0, 0, 6], fov: 38 }}
      aria-hidden
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 4, 5]} intensity={1.1} color="#23d5c4" />
      <pointLight position={[-4, -2, 3]} intensity={0.4} color="#c9a24b" />
      {books.map((i) => (
        <Book key={i} index={i} total={books.length} />
      ))}
    </Canvas>
  );
}
