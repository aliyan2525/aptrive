"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { createAtmosphereMaterial } from "./shaders/atmosphere.glsl";

// Brand palette (matches tailwind.config: teal accent, blue secondary,
// gold as the third "premium" accent introduced for orbit nodes).
const TEAL = "#23d5c4";
const BLUE = "#2f81ff";
const GOLD = "#c9a24b";

interface OrbitNodeConfig {
  radius: number;
  speed: number;
  tilt: number;
  phase: number;
  color: string;
  scale: number;
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

function OrbitNode({ config }: { config: OrbitNodeConfig }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * config.speed + config.phase;
    ref.current.position.set(
      Math.cos(t) * config.radius,
      Math.sin(t) * config.radius * Math.sin(config.tilt),
      Math.sin(t) * config.radius * Math.cos(config.tilt)
    );
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.014;
  });

  return (
    <mesh ref={ref} scale={config.scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={config.color}
        emissive={config.color}
        emissiveIntensity={0.6}
        metalness={0.4}
        roughness={0.25}
      />
    </mesh>
  );
}

export default function EducationalUniverse() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const atmosphere = useMemo(() => createAtmosphereMaterial(BLUE, TEAL), []);

  useFrame((_, delta) => {
    atmosphere.uniforms.uTime.value += delta;
    if (groupRef.current) {
      // Slow idle rotation — the "camera/scene should never stay
      // completely still" requirement, kept to a rate that reads as
      // ambient rather than distracting.
      groupRef.current.rotation.y += delta * 0.05;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Core sphere — the "knowledge nucleus". */}
      <mesh>
        <sphereGeometry args={[0.85, 48, 48]} />
        <meshStandardMaterial color={BLUE} metalness={0.3} roughness={0.15} emissive={BLUE} emissiveIntensity={0.15} />
      </mesh>

      {/* Fresnel atmosphere shell, slightly larger than the core so the
          glow reads as a rim rather than a second solid layer. */}
      <mesh scale={1.18}>
        <sphereGeometry args={[0.85, 48, 48]} />
        <primitive object={atmosphere} attach="material" />
      </mesh>

      {/* Mastery ring. */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.6, 0, 0]}>
        <torusGeometry args={[1.7, 0.03, 24, 128]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.35} metalness={0.7} roughness={0.25} />
      </mesh>

      {ORBIT_NODES.map((config, i) => (
        <OrbitNode key={i} config={config} />
      ))}
    </group>
  );
}
