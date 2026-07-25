"use client";

import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { TEAL, BLUE, GOLD } from "@/lib/three/universe-theme";

interface TravelingSignalProps {
  /**
   * 0→1 eased arrival progress for the Journey section (see
   * JourneyScene.tsx). Drives the signal's position along its path —
   * same ref-per-frame convention as every other scroll-driven value
   * in the hero/features scenes.
   */
  arriveProgressRef: RefObject<number>;
}

/**
 * A single glowing node traveling left-to-right along a shallow arc
 * as the section scrolls into view — the "signal moving through the
 * journey" motif. Distinct shape from the Hero's orbit nodes and
 * Features' settling fragments (this one moves along a fixed path
 * rather than orbiting or drifting to a rest point), but same
 * material/palette language so it still reads as the same world.
 */
export default function TravelingSignal({ arriveProgressRef }: TravelingSignalProps) {
  const headRef = useRef<THREE.Mesh>(null);
  const start = useMemo(() => new THREE.Vector3(-7.5, 1.6, -3), []);
  const end = useMemo(() => new THREE.Vector3(7.5, -1.2, -3), []);

  useFrame(({ clock }) => {
    if (!headRef.current) return;
    const t = arriveProgressRef.current ?? 0;
    const eased = t * t * (3 - 2 * t); // smoothstep — eases in/out of the travel rather than constant velocity
    const x = THREE.MathUtils.lerp(start.x, end.x, eased);
    // Gentle arc (rises then settles) plus a small idle bob so it
    // doesn't read as a mechanically linear slide.
    const arc = Math.sin(eased * Math.PI) * 0.6;
    const y = THREE.MathUtils.lerp(start.y, end.y, eased) + arc + Math.sin(clock.elapsedTime * 1.6) * 0.06;
    headRef.current.position.set(x, y, -3);
  });

  return (
    <group>
      <mesh ref={headRef}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={1.2} metalness={0.2} roughness={0.2} />
      </mesh>
      {/* Two small static waypoint markers hint at the path's endpoints
          without needing a rendered trail line (a fading line-trail
          behind a moving point is a much heavier per-frame geometry
          update for a background element this small on screen). */}
      <mesh position={start.toArray()} scale={0.06}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={0.5} transparent opacity={0.5} />
      </mesh>
      <mesh position={end.toArray()} scale={0.06}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.5} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
