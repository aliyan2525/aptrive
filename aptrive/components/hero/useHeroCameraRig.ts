"use client";

import { useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

interface CameraRigProps {
  pointerRef: RefObject<{ x: number; y: number }>;
  /**
   * 0 at rest. Not driven by anything yet in this phase — HeroScene
   * passes a ref that stays at 0 until the phase-3 scroll-storytelling
   * system (GSAP ScrollTrigger) writes into it. Wiring the prop now
   * means that integration won't require touching this file again.
   */
  scrollProgressRef: RefObject<number>;
}

const basePosition = new THREE.Vector3(0, 0, 8);

/**
 * Runs inside the <Canvas> tree (needs useThree/useFrame). Named after
 * the hook it wraps rather than exported as a bare hook, since a
 * camera rig's whole job is a per-frame side effect — there's no
 * value to return to a consumer.
 */
export default function CameraRig({ pointerRef, scrollProgressRef }: CameraRigProps) {
  const { camera } = useThree();
  const smoothed = useRef({ x: 0, y: 0 });

  useFrame(({ clock }) => {
    const pointer = pointerRef.current ?? { x: 0, y: 0 };

    // Smooth toward the raw pointer signal — same reasoning as the
    // particle field: lerp, don't snap.
    smoothed.current.x += (pointer.x - smoothed.current.x) * 0.04;
    smoothed.current.y += (pointer.y - smoothed.current.y) * 0.04;

    const breathing = Math.sin(clock.elapsedTime * 0.4) * 0.08;
    const scrollProgress = scrollProgressRef.current ?? 0;

    camera.position.x = basePosition.x + smoothed.current.x * 0.6;
    camera.position.y = basePosition.y + smoothed.current.y * 0.4 + breathing * 0.3;
    camera.position.z = basePosition.z - scrollProgress * 1.5 + breathing;

    camera.lookAt(0, 0, 0);
  });

  return null;
}
