"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createGlassPlanetCoreMaterial, createGlassPlanetRimMaterial } from "./shaders/glassPlanet.glsl";
import type { GlassPlanetCoreMaterial, GlassPlanetRimMaterial } from "./shaders/glassPlanet.glsl";

/**
 * The Hero's central "Knowledge Planet" — a single glass-nebula sphere
 * (dark swirling core + fresnel rim shell, see shaders/glassPlanet.glsl.ts)
 * instead of the previous three separate metaball blobs. One focal
 * object reads as intentional; three overlapping blobs read as a
 * generic distort-material demo.
 */
export default function GlassPlanet() {
  const [core] = useState<GlassPlanetCoreMaterial>(() => createGlassPlanetCoreMaterial());
  const [rim] = useState<GlassPlanetRimMaterial>(() => createGlassPlanetRimMaterial());
  const groupRef = useRef<THREE.Group>(null);

  // R3F shader uniforms are intentionally mutated in the render loop.
  // eslint-disable-next-line react-hooks/immutability
  useFrame((_, delta) => {
    // eslint-disable-next-line react-hooks/immutability
    core.uniforms.uTime.value += delta;
    // Slow idle spin — enough that the swirl pattern visibly drifts
    // over the course of a visit without ever looking like it's
    // "spinning" in an obvious, distracting way.
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.035;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1.95, 128, 128]} />
        <primitive object={core} attach="material" />
      </mesh>
      <mesh scale={1.015}>
        <sphereGeometry args={[1.95, 96, 96]} />
        <primitive object={rim} attach="material" />
      </mesh>
    </group>
  );
}
