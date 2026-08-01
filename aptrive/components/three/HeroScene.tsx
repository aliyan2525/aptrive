"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import * as THREE from "three";

function AbstractShape({ position, color, speed, distort, radius }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.cos(t / 4 * speed) / 2;
    meshRef.current.rotation.y = Math.sin(t / 4 * speed) / 2;
    meshRef.current.position.y = position[1] + Math.sin(t * speed) * 0.5;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} castShadow receiveShadow>
        <sphereGeometry args={[radius, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          distort={distort}
          speed={speed}
        />
      </mesh>
    </Float>
  );
}

function SceneContent() {
  const { viewport, mouse } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  
  // Subtle mouse parallax
  useFrame(() => {
    if (!groupRef.current) return;
    const targetX = (mouse.x * viewport.width) / 15;
    const targetY = (mouse.y * viewport.height) / 15;
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.02;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.02;
  });

  return (
    <group ref={groupRef}>
      <AbstractShape position={[-4, 1, -2]} color="#0ea5a4" speed={1.5} distort={0.4} radius={1.2} />
      <AbstractShape position={[4, -1, -5]} color="#b8862b" speed={1} distort={0.6} radius={1.8} />
      <AbstractShape position={[0, -2, -3]} color="#ffffff" speed={2} distort={0.3} radius={0.8} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
      <spotLight position={[-10, -10, -5]} intensity={1.5} color="#0ea5a4" />
      <Environment preset="city" />
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <SceneContent />
        <EffectComposer multisampling={4}>
          <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.2} />
          <Noise opacity={0.03} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
