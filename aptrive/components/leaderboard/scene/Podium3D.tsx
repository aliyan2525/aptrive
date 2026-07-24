"use client";

import { useRef, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useScene3D } from "@/components/three/Scene3DProvider";

interface PodiumEntry {
  rank: number;
  x: number;
  color: string;
  height: number;
}

// Medal colors are a near-universal rank convention — the one place in
// this project where reaching outside the teal/blue/gold brand
// palette is the right call rather than a lapse into "generic."
const PODIUM: PodiumEntry[] = [
  { rank: 2, x: -1.5, color: "#c7ccd1", height: 1.1 },
  { rank: 1, x: 0, color: "#c9a24b", height: 1.55 },
  { rank: 3, x: 1.5, color: "#b8763f", height: 0.8 },
];

const GROUND_Y = -0.85;

function Pedestal({ entry, progressRef }: { entry: PodiumEntry; progressRef: RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const capRef = useRef<THREE.Mesh>(null);
  const grownRef = useRef(0);

  useFrame(({ clock }) => {
    const progress = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1);
    // Grow at slightly different rates per pedestal so all three don't
    // finish in perfect lockstep — reads as "counting up" rather than
    // a single slab rising.
    const target = THREE.MathUtils.clamp(progress * 1.15 - (entry.rank - 1) * 0.05, 0, 1);
    grownRef.current = THREE.MathUtils.lerp(grownRef.current, target, 0.08);

    const scaleY = Math.max(grownRef.current, 0.02);
    if (groupRef.current) {
      groupRef.current.scale.y = scaleY;
      // Keep the base fixed at GROUND_Y while the top grows upward —
      // scaling a centered box by Y alone would grow it from the
      // middle in both directions, which reads as floating, not built.
      groupRef.current.position.y = GROUND_Y + (entry.height * scaleY) / 2;
    }
    if (capRef.current) {
      capRef.current.position.y = GROUND_Y + entry.height * scaleY + 0.12;
      capRef.current.rotation.y = clock.elapsedTime * 0.6;
    }
  });

  return (
    <group>
      <group ref={groupRef} position={[entry.x, GROUND_Y, 0]}>
        <mesh>
          <boxGeometry args={[0.9, entry.height, 0.9]} />
          <meshStandardMaterial color={entry.color} metalness={0.35} roughness={0.4} emissive={entry.color} emissiveIntensity={0.12} />
        </mesh>
      </group>
      {/* Medal disc floating just above the pedestal top. */}
      <mesh ref={capRef} position={[entry.x, GROUND_Y, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.06, 32]} />
        <meshStandardMaterial color={entry.color} emissive={entry.color} emissiveIntensity={0.6} metalness={0.5} roughness={0.25} />
      </mesh>
    </group>
  );
}

interface Podium3DProps {
  progressRef: RefObject<number>;
}

export default function Podium3D({ progressRef }: Podium3DProps) {
  const { preset } = useScene3D();

  return (
    <Canvas
      dpr={preset.dpr}
      gl={{ antialias: preset.antialias, alpha: true }}
      camera={{ position: [0, 0.3, 5.2], fov: 42 }}
      aria-hidden
    >
      <ambientLight intensity={0.55} />
      <pointLight position={[3, 4, 4]} intensity={1.1} color="#23d5c4" />
      <pointLight position={[-3, 2, 3]} intensity={0.5} color="#c9a24b" />
      {PODIUM.map((entry) => (
        <Pedestal key={entry.rank} entry={entry} progressRef={progressRef} />
      ))}
    </Canvas>
  );
}
