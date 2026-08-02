"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

type BlobConfig = {
  position: [number, number, number];
  color: string;
  speed: number;
  distort: number;
  radius: number;
  metalness: number;
  roughness: number;
  floatIntensity: number;
};

const BLOBS: BlobConfig[] = [
  // Large teal metaball — upper right, the dominant shape
  {
    position: [1.15, 1.05, 0],
    color: "#22d3c8",
    speed: 0.55,
    distort: 0.38,
    radius: 1.55,
    metalness: 0.75,
    roughness: 0.12,
    floatIntensity: 0.7,
  },
  // Large amber/gold metaball — lower right, overlapping the teal one
  {
    position: [1.55, -0.95, -0.4],
    color: "#c9922f",
    speed: 0.4,
    distort: 0.42,
    radius: 1.85,
    metalness: 0.8,
    roughness: 0.15,
    floatIntensity: 0.55,
  },
  // Small pearl/chrome sphere — floating to the left, ties the composition together
  {
    position: [-1.35, -0.15, 0.6],
    color: "#e7e2f0",
    speed: 0.8,
    distort: 0.22,
    radius: 0.5,
    metalness: 0.9,
    roughness: 0.05,
    floatIntensity: 1.1,
  },
];

function Blob({ config }: { config: BlobConfig }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.cos((t / 5) * config.speed) / 3;
    meshRef.current.rotation.y = Math.sin((t / 5) * config.speed) / 3;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={config.floatIntensity}>
      <mesh ref={meshRef} position={config.position}>
        <sphereGeometry args={[config.radius, 96, 96]} />
        <MeshDistortMaterial
          color={config.color}
          envMapIntensity={1.15}
          clearcoat={1}
          clearcoatRoughness={0.08}
          metalness={config.metalness}
          roughness={config.roughness}
          distort={config.distort}
          speed={config.speed}
        />
      </mesh>
    </Float>
  );
}

function SceneContent() {
  const { viewport, pointer } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const targetX = (pointer.x * viewport.width) / 22;
    const targetY = (pointer.y * viewport.height) / 22;
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.03;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.03;
  });

  return (
    <group ref={groupRef}>
      {BLOBS.map((blob, i) => (
        <Blob key={i} config={blob} />
      ))}

      <ambientLight intensity={0.9} />
      <directionalLight position={[6, 8, 6]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-6, -4, -4]} intensity={0.6} color="#8fb8ff" />
      <spotLight position={[-8, 6, 4]} intensity={1.2} color="#22d3c8" />
      <Environment preset="studio" />
    </group>
  );
}

function SafeEffectComposer({ children, ...props }: any) {
  // EffectComposer depends on a working WebGL context. In some
  // environments (context loss, initialization race), the renderer's
  // GL context may be null — guard and skip postprocessing instead of
  // throwing, which causes the whole client render to fail.
  const { gl } = useThree();
  if (!gl) return null;
  try {
    const ctx = gl.getContext();
    if (!ctx) return null;
  } catch (e) {
    return null;
  }
  return <EffectComposer {...props}>{children}</EffectComposer>;
}

export default function HeroBlobsScene() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <SceneContent />
        <SafeEffectComposer multisampling={4}>
          <Bloom luminanceThreshold={0.65} mipmapBlur intensity={0.55} />
        </SafeEffectComposer>
      </Canvas>
    </div>
  );
}
