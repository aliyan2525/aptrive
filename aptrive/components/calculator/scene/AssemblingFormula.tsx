"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useScene3D } from "@/components/three/Scene3DProvider";
import { createSeededRandom } from "@/lib/three/seeded-random";

// Mirrors AggregateCalculator's segmentPalette so this scene's colors
// match the real breakdown bar directly beneath it — the one place
// this scene is tied to actual result data rather than being purely
// decorative.
const FRAGMENT_COLORS = ["#23d5c4", "#c9a24b", "#f3f5f2", "#5fe8da"];

interface FragmentProps {
  index: number;
  total: number;
  active: boolean;
}

function Fragment({ index, total, active }: FragmentProps) {
  const ref = useRef<THREE.Mesh>(null);
  const color = FRAGMENT_COLORS[index % FRAGMENT_COLORS.length];

  // Stable per-fragment scatter position and phase — rolled once, not
  // re-rolled on every `active` toggle (that would make fragments jump
  // to a new scatter point instead of returning to where they were).
  // Seeded on `index` (deterministic per fragment) rather than the
  // impure global `Math.random`, satisfying react-hooks/purity while
  // still giving each fragment a distinct scatter point.
  const scatter = useMemo(() => {
    const random = createSeededRandom(index * 7919 + 17);
    return new THREE.Vector3(
      (random() - 0.5) * 3.2,
      (random() - 0.5) * 1.8,
      (random() - 0.5) * 1.6
    );
  }, [index]);
  const phase = useMemo(() => createSeededRandom(index * 104729 + 3)() * Math.PI * 2, [index]);

  const assembled = useMemo(() => {
    const spacing = 0.62;
    return new THREE.Vector3((index - (total - 1) / 2) * spacing, 0, 0);
  }, [index, total]);

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;

    const target = active ? assembled : scatter;
    mesh.position.lerp(target, 0.09);

    // Continuous rotation regardless of state — nothing in this
    // scene should ever look fully at rest, per the brief.
    mesh.rotation.x += 0.006;
    mesh.rotation.y += 0.009;

    if (active) {
      // Small idle bob once assembled, so "done" doesn't mean "frozen."
      mesh.position.y += Math.sin(clock.elapsedTime * 1.5 + phase) * 0.02;
    }
  });

  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.22, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.3} roughness={0.3} />
    </mesh>
  );
}

interface AssemblingFormulaProps {
  fragmentCount: number;
  active: boolean;
}

export default function AssemblingFormula({ fragmentCount, active }: AssemblingFormulaProps) {
  const { preset } = useScene3D();
  const count = Math.max(1, Math.min(fragmentCount, 5));

  return (
    <Canvas
      dpr={preset.dpr}
      gl={{ antialias: preset.antialias, alpha: true }}
      camera={{ position: [0, 0, 3.4], fov: 40 }}
      aria-hidden
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[2, 2, 3]} intensity={1} color="#23d5c4" />
      <pointLight position={[-2, -1, 2]} intensity={0.4} color="#c9a24b" />
      {Array.from({ length: count }, (_, i) => (
        <Fragment key={i} index={i} total={count} active={active} />
      ))}
    </Canvas>
  );
}
