"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { TEAL, BLUE, GOLD } from "@/lib/three/universe-theme";

interface NebulaCloudConfig {
  color: string;
  position: [number, number, number];
  scale: number;
  driftSpeed: number;
}

const CLOUDS: NebulaCloudConfig[] = [
  { color: BLUE, position: [-4.5, 1.5, -9], scale: 9, driftSpeed: 0.015 },
  { color: TEAL, position: [5, -2, -11], scale: 10, driftSpeed: -0.012 },
  { color: GOLD, position: [1.5, 3.5, -13], scale: 7, driftSpeed: 0.02 },
];

/**
 * Builds a soft radial-gradient sprite texture once, shared by every
 * cloud (tinted per-instance via `material.color`) — one small
 * offscreen canvas instead of a shipped image asset, and one texture
 * instead of one per cloud.
 */
function useNebulaTexture() {
  return useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2
      );
      gradient.addColorStop(0, "rgba(255,255,255,0.9)");
      gradient.addColorStop(0.4, "rgba(255,255,255,0.35)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

/**
 * Distant, slow-drifting colored haze behind the knowledge nucleus —
 * cheap (three billboarded sprites, one shared texture) but gives the
 * scene the "nebula" depth layer the flat fog color alone doesn't.
 */
export default function Nebula() {
  const texture = useNebulaTexture();
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z += delta * 0.006;
  });

  return (
    <group ref={groupRef}>
      {CLOUDS.map((cloud, i) => (
        <sprite key={i} position={cloud.position} scale={cloud.scale}>
          <spriteMaterial
            map={texture}
            color={cloud.color}
            transparent
            opacity={0.16}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
}
