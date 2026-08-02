"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createGlassPlanetCoreMaterial, createGlassPlanetRimMaterial } from "./shaders/glassPlanet.glsl";
import type { GlassPlanetCoreMaterial, GlassPlanetRimMaterial } from "./shaders/glassPlanet.glsl";
import { HERO_SIGNAL_EVENT, type HeroSignalDetail } from "./heroSignal";

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

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
  const particlesRef = useRef<THREE.Points>(null);
  const pulseTargetRef = useRef(0);
  const particlePositions = useMemo(() => {
    const count = 900;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const radius = 0.25 + Math.pow(seededRandom(i + 1), 0.55) * 1.28;
      const theta = seededRandom(i + 101) * Math.PI * 2;
      const phi = Math.acos(2 * seededRandom(i + 301) - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    return positions;
  }, []);

  const neuralSegments = useMemo(() => {
    const count = 56;
    const positions = new Float32Array(count * 2 * 3);

    for (let i = 0; i < count; i += 1) {
      const base = i * 6;
      const thetaA = seededRandom(i + 501) * Math.PI * 2;
      const thetaB = thetaA + 0.18 + seededRandom(i + 701) * 0.52;
      const yA = (seededRandom(i + 901) - 0.5) * 2.1;
      const yB = yA + (seededRandom(i + 1101) - 0.5) * 0.42;
      const radius = 1.02 + seededRandom(i + 1301) * 0.34;
      positions[base] = Math.cos(thetaA) * radius;
      positions[base + 1] = yA;
      positions[base + 2] = Math.sin(thetaA) * radius;
      positions[base + 3] = Math.cos(thetaB) * radius;
      positions[base + 4] = yB;
      positions[base + 5] = Math.sin(thetaB) * radius;
    }

    return positions;
  }, []);

  useEffect(() => {
    function handleSignal(event: Event) {
      const detail = (event as CustomEvent<HeroSignalDetail>).detail;
      pulseTargetRef.current = detail.active ? 1 : 0;
    }

    window.addEventListener(HERO_SIGNAL_EVENT, handleSignal);
    return () => window.removeEventListener(HERO_SIGNAL_EVENT, handleSignal);
  }, []);

  // R3F shader uniforms are intentionally mutated inside the frame loop.
  // eslint-disable-next-line react-hooks/immutability
  useFrame((_, delta) => {
    // eslint-disable-next-line react-hooks/immutability
    core.uniforms.uTime.value += delta;
    core.uniforms.uPulse.value += (pulseTargetRef.current - core.uniforms.uPulse.value) * 0.08;
    // Slow idle spin — enough that the swirl pattern visibly drifts
    // over the course of a visit without ever looking like it's
    // "spinning" in an obvious, distracting way.
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.032;
      groupRef.current.rotation.x = Math.sin(core.uniforms.uTime.value * 0.22) * 0.025;
      const breath = 1 + Math.sin(core.uniforms.uTime.value * 0.72) * 0.012 + core.uniforms.uPulse.value * 0.035;
      groupRef.current.scale.setScalar(breath);
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y -= delta * (0.075 + core.uniforms.uPulse.value * 0.16);
      particlesRef.current.rotation.z += delta * (0.028 + core.uniforms.uPulse.value * 0.06);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1.62, 128, 128]} />
        <primitive object={core} attach="material" />
      </mesh>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={0.018}
          transparent
          opacity={0.42}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[neuralSegments, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      <mesh scale={1.015}>
        <sphereGeometry args={[1.62, 96, 96]} />
        <primitive object={rim} attach="material" />
      </mesh>
    </group>
  );
}
