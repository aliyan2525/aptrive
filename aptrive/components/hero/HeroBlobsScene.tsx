"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import GlassPlanet from "./GlassPlanet";

function SceneContent() {
  const { viewport, pointer } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const targetX = (pointer.x * viewport.width) / 26;
    const targetY = (pointer.y * viewport.height) / 26;
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.03;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <GlassPlanet />
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
        camera={{ position: [0, 0, 6.4], fov: 40 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        {/* GlassPlanet is fully self-lit by its own shader (see
            shaders/glassPlanet.glsl.ts) — no scene lights or HDRI
            Environment map needed, which also drops an environment
            texture download the previous MeshDistortMaterial blobs
            required. */}
        <SceneContent />
        <SafeEffectComposer multisampling={4}>
          <Bloom luminanceThreshold={0.7} mipmapBlur intensity={0.5} />
        </SafeEffectComposer>
      </Canvas>
    </div>
  );
}
