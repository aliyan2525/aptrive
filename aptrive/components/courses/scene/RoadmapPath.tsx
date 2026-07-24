"use client";

import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useScene3D } from "@/components/three/Scene3DProvider";

const PALETTE = ["#23d5c4", "#2f81ff", "#c9a24b", "#23d5c4", "#2f81ff", "#c9a24b"];

interface SceneProps {
  milestoneCount: number;
  progressRef: RefObject<number>;
}

function pointAt(t: number) {
  // A gentle S-curve rather than a straight line — reads as a "path"
  // instead of a ruler, without needing control points authored by
  // hand per course page.
  return new THREE.Vector3(
    (t - 0.5) * 5.4,
    Math.sin(t * Math.PI * 1.4) * 0.85,
    Math.cos(t * Math.PI * 1.1) * 0.55
  );
}

function RoadmapScene({ milestoneCount, progressRef }: SceneProps) {
  const curve = useMemo(() => {
    const total = Math.max(milestoneCount, 2) * 8;
    const points = Array.from({ length: total }, (_, i) => pointAt(i / (total - 1)));
    return new THREE.CatmullRomCurve3(points);
  }, [milestoneCount]);

  const tubeGeometry = useMemo(() => new THREE.TubeGeometry(curve, 120, 0.022, 8, false), [curve]);

  const nodeTs = useMemo(
    () => Array.from({ length: milestoneCount }, (_, i) => (milestoneCount === 1 ? 0 : i / (milestoneCount - 1))),
    [milestoneCount]
  );

  const beaconRef = useRef<THREE.Mesh>(null);
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(() => {
    const progress = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1);

    if (beaconRef.current) {
      beaconRef.current.position.copy(curve.getPointAt(progress));
    }

    nodeTs.forEach((t, i) => {
      const mesh = nodeRefs.current[i];
      if (!mesh) return;
      const lit = progress >= t - 0.02;
      const material = mesh.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, lit ? 0.9 : 0.15, 0.12);
      const targetScale = lit ? 1 : 0.72;
      mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.12));
    });
  });

  return (
    <>
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial color="#1c2530" emissive="#23d5c4" emissiveIntensity={0.06} metalness={0.4} roughness={0.55} />
      </mesh>

      {nodeTs.map((t, i) => (
        <mesh key={i} position={pointAt(t)} ref={(el) => { nodeRefs.current[i] = el; }}>
          <sphereGeometry args={[0.12, 24, 24]} />
          <meshStandardMaterial
            color={PALETTE[i % PALETTE.length]}
            emissive={PALETTE[i % PALETTE.length]}
            emissiveIntensity={0.15}
            metalness={0.3}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Traveling marker — the one thing that's continuously animated
          rather than state-driven, so the scene doesn't look inert
          between node-lighting steps. */}
      <mesh ref={beaconRef}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.3} />
      </mesh>
    </>
  );
}

interface RoadmapPathProps extends SceneProps {}

export default function RoadmapPath({ milestoneCount, progressRef }: RoadmapPathProps) {
  const { preset } = useScene3D();

  return (
    <Canvas
      dpr={preset.dpr}
      gl={{ antialias: preset.antialias, alpha: true }}
      camera={{ position: [0, 0.35, 4.1], fov: 42 }}
      aria-hidden
    >
      <ambientLight intensity={0.55} />
      <pointLight position={[3, 3, 4]} intensity={1} color="#23d5c4" />
      <pointLight position={[-3, -2, 2]} intensity={0.4} color="#c9a24b" />
      <RoadmapScene milestoneCount={milestoneCount} progressRef={progressRef} />
    </Canvas>
  );
}
