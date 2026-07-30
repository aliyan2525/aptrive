"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface HeroStarfieldProps {
  count: number;
  /** Draws well outside the nucleus/orbit-node radius (~3.4) so it reads as distant background, not foreground clutter. */
  radius?: number;
}

// Deterministic PRNG (mulberry32) seeded from this component's own
// props. `useMemo` bodies are expected to be pure functions of their
// dependency array — calling `Math.random()` directly inside one
// violates that (flagged by the react-hooks/purity rule) since the
// output can't be derived from the deps alone. Seeding from
// count/radius keeps the field's distribution a pure function of
// exactly what's in the deps array below.
function mulberry32(seed: number) {
  let state = seed | 0;
  return function random() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Distant background dust — deliberately plain (PointsMaterial, no
 * custom shader) and slow-moving. This sits *behind* the nucleus and
 * its orbit nodes (EducationalUniverse) and the closer knowledge-
 * particle shell (KnowledgeParticles), so it doesn't compete for
 * attention or GPU budget with either. `count` comes from
 * `getStarfieldDensity(tier)` in `lib/three/universe-theme.ts` — this
 * component doesn't decide its own density.
 */
export default function HeroStarfield({ count, radius = 9 }: HeroStarfieldProps) {
  const geometry = useMemo(() => {
    const random = mulberry32(count * 1_000_003 + Math.round(radius * 1000));
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      // Uniform distribution through a spherical volume (not just a
      // shell) so the field reads as depth in every direction the
      // scroll-driven camera travel moves through.
      const r = radius * Math.cbrt(random());
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count, radius]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#e8f0ff",
        size: 0.02,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      }),
    []
  );

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    // Barely-perceptible drift — this is meant to read as ambient
    // depth, not as its own animated element competing with the
    // nucleus/orbit nodes in front of it.
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.004;
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
