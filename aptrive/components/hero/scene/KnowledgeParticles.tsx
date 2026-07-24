"use client";

import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { createParticleMaterial } from "./shaders/particles.glsl";

interface KnowledgeParticlesProps {
  count: number;
  color?: THREE.ColorRepresentation;
  radius?: number;
  /** Normalized [-1, 1] pointer position, updated imperatively by the parent so this component never re-renders on pointer move. */
  pointerRef: RefObject<{ x: number; y: number }>;
}

export default function KnowledgeParticles({
  count,
  color = "#9dd8ff",
  radius = 3.4,
  pointerRef,
}: KnowledgeParticlesProps) {
  // Positions + per-particle seed built once per `count` change, not
  // per frame. `count` only changes when the GPU tier changes (rare —
  // effectively once, on mount).
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      // Even distribution across a spherical shell around the core,
      // with some radial spread so it reads as volumetric rather than
      // a flat sphere shell.
      const r = radius + Math.random() * radius * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      seeds[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return geo;
  }, [count, radius]);

  const material = useMemo(() => createParticleMaterial(color), [color]);
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    material.uniforms.uTime.value += delta;

    const pointer = pointerRef.current;
    if (pointer) {
      // Lerp toward the live pointer position rather than snapping —
      // matches the "very subtle" motion brief and avoids jitter.
      // (Manual scalar lerp, not Vector2.lerp, since the source is a
      // plain {x,y} ref and not a THREE.Vector2 instance.)
      const uPointer = material.uniforms.uPointer.value as THREE.Vector2;
      uPointer.x += (pointer.x - uPointer.x) * 0.05;
      uPointer.y += (pointer.y - uPointer.y) * 0.05;
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.02;
      pointsRef.current.rotation.x += delta * 0.01;
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
