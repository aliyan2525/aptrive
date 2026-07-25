"use client";

import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { createAtmosphereMaterial } from "./shaders/atmosphere.glsl";
import { TEAL, BLUE, GOLD } from "@/lib/three/universe-theme";

interface OrbitNodeConfig {
  radius: number;
  speed: number;
  tilt: number;
  phase: number;
  color: string;
  scale: number;
}

interface EducationalUniverseProps {
  /**
   * 0→1, read every frame (same ref-not-state convention as
   * pointerRef elsewhere in the hero scene) — how far the user has
   * scrolled through leaving the Hero. Drives the "nucleus cracks
   * open and releases its knowledge fragments" exit: the core and
   * ring shrink/fade while the orbit nodes fly outward, so the
   * transition reads as dispersal rather than the whole group just
   * fading out in place. Optional so this component still renders
   * its resting state (crack = 0) if a caller doesn't wire scroll in.
   */
  crackProgressRef?: RefObject<number>;
}

// Six orbiting "concept nodes" — abstracted, not literal clip-art icons
// (books/graduation caps as flat 3D models tend to read as a stock
// asset pack rather than a premium custom scene). Faceted polyhedra in
// varied brand colors read as "knowledge fragments" without the cost
// or licensing surface of modeled assets.
const ORBIT_NODES: OrbitNodeConfig[] = [
  { radius: 2.6, speed: 0.25, tilt: 0.3, phase: 0, color: TEAL, scale: 0.16 },
  { radius: 2.9, speed: -0.18, tilt: -0.4, phase: 1.1, color: BLUE, scale: 0.12 },
  { radius: 3.3, speed: 0.15, tilt: 0.6, phase: 2.4, color: GOLD, scale: 0.14 },
  { radius: 2.4, speed: -0.3, tilt: -0.2, phase: 3.6, color: BLUE, scale: 0.1 },
  { radius: 3.1, speed: 0.2, tilt: 0.1, phase: 4.8, color: TEAL, scale: 0.13 },
  { radius: 2.8, speed: -0.22, tilt: 0.5, phase: 5.7, color: GOLD, scale: 0.11 },
];

// How far past their orbit radius the nodes fly outward at full crack
// (radius * (1 + FLY_OUT_MULTIPLIER)) — large enough to read as
// "released past the frame edge", not just a bigger orbit.
const FLY_OUT_MULTIPLIER = 2.2;

function OrbitNode({ config, crackProgressRef }: { config: OrbitNodeConfig; crackProgressRef?: RefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const crack = crackProgressRef?.current ?? 0;
    const t = clock.elapsedTime * config.speed + config.phase;
    // Same orbital path as the resting state, just scaled outward by
    // crack progress — the node keeps orbiting on its way out instead
    // of the motion suddenly changing character.
    const flightRadius = config.radius * (1 + crack * FLY_OUT_MULTIPLIER);
    ref.current.position.set(
      Math.cos(t) * flightRadius,
      Math.sin(t) * flightRadius * Math.sin(config.tilt),
      Math.sin(t) * flightRadius * Math.cos(config.tilt)
    );
    ref.current.rotation.x += 0.01 + crack * 0.04;
    ref.current.rotation.y += 0.014 + crack * 0.05;

    if (materialRef.current) {
      // Fades out over the back half of the crack range so nodes are
      // still visible (mid-flight) through most of the transition and
      // only vanish near the very end, once they're well outside frame.
      materialRef.current.opacity = 1 - Math.min(1, crack * 1.6);
    }
  });

  return (
    <mesh ref={ref} scale={config.scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        ref={materialRef}
        color={config.color}
        emissive={config.color}
        emissiveIntensity={0.6}
        metalness={0.4}
        roughness={0.25}
        transparent
      />
    </mesh>
  );
}

export default function EducationalUniverse({ crackProgressRef }: EducationalUniverseProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const nucleusRef = useRef<THREE.Mesh>(null);
  const nucleusMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const atmosphereMeshRef = useRef<THREE.Mesh>(null);

  const atmosphere = useMemo(() => createAtmosphereMaterial(BLUE, TEAL), []);

  useFrame((_, delta) => {
    atmosphere.uniforms.uTime.value += delta;
    const crack = crackProgressRef?.current ?? 0;

    if (groupRef.current) {
      // Slow idle rotation — the "camera/scene should never stay
      // completely still" requirement, kept to a rate that reads as
      // ambient rather than distracting. Spins up slightly as it
      // cracks so the release reads as energetic, not just a fade.
      groupRef.current.rotation.y += delta * (0.05 + crack * 0.12);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.03;
      // Ring expands outward like a shockwave and fades — reuses the
      // torus's own radius via uniform scale rather than rebuilding
      // geometry per frame.
      const ringScale = 1 + crack * 1.4;
      ringRef.current.scale.setScalar(ringScale);
      const ringMaterial = ringRef.current.material as THREE.MeshStandardMaterial;
      ringMaterial.opacity = 1 - crack;
    }
    if (nucleusRef.current) {
      // Nucleus itself contracts (the "crack open" beat reads as the
      // core collapsing inward right before its contents scatter)
      // while fading, rather than growing — growing would fight the
      // orbit nodes' outward flight for visual attention.
      nucleusRef.current.scale.setScalar(1 - crack * 0.6);
    }
    if (nucleusMaterialRef.current) {
      nucleusMaterialRef.current.opacity = 1 - crack;
    }
    if (atmosphereMeshRef.current) {
      // Atmosphere shell does the opposite of the nucleus — expands
      // and fades, like the glow briefly flaring outward as the core
      // empties.
      atmosphereMeshRef.current.scale.setScalar(1.18 + crack * 0.9);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Core sphere — the "knowledge nucleus". */}
      <mesh ref={nucleusRef}>
        <sphereGeometry args={[0.85, 48, 48]} />
        <meshStandardMaterial
          ref={nucleusMaterialRef}
          color={BLUE}
          metalness={0.3}
          roughness={0.15}
          emissive={BLUE}
          emissiveIntensity={0.15}
          transparent
        />
      </mesh>

      {/* Fresnel atmosphere shell, slightly larger than the core so the
          glow reads as a rim rather than a second solid layer. */}
      <mesh ref={atmosphereMeshRef} scale={1.18}>
        <sphereGeometry args={[0.85, 48, 48]} />
        <primitive object={atmosphere} attach="material" />
      </mesh>

      {/* Mastery ring. */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.6, 0, 0]}>
        <torusGeometry args={[1.7, 0.03, 24, 128]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.35} metalness={0.7} roughness={0.25} transparent />
      </mesh>

      {ORBIT_NODES.map((config, i) => (
        <OrbitNode key={i} config={config} crackProgressRef={crackProgressRef} />
      ))}
    </group>
  );
}
