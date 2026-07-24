"use client";

import { useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

interface CameraRigProps {
  pointerRef: RefObject<{ x: number; y: number }>;
  /**
   * 0→1 across the Hero section's own scroll range, fed by
   * `useScrollProgress` in HeroScene.tsx. Read every frame via
   * useFrame rather than triggering a re-render, same reasoning as
   * `pointerRef`.
   */
  scrollProgressRef: RefObject<number>;
}

const basePosition = new THREE.Vector3(0, 0, 8);
// How far the camera orbits around the nucleus over the Hero's full
// scroll range — kept modest (25°) so it reads as "drifting past"
// rather than a disorienting swing, per the master prompt's "subtle
// parallax" brief.
const SCROLL_ORBIT_RADIANS = Math.PI / 7.2;
// Subtracted from z as scroll increases — moves the camera closer to
// (and past) the nucleus, not away from it. Named for what it does,
// not "pullback", to avoid the ambiguity the original unnamed literal
// here had.
const SCROLL_APPROACH = 2.2;

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
    // Directly scrubbed by scroll position, not eased on a delay —
    // this is a continuous camera pan the user is steering with the
    // scrollbar, not a one-time "arrive into view" reveal, so it
    // shouldn't use the shared `arriveEase` settle curve from
    // universe-theme.ts. Deliberately different case from an
    // arriveProgress-driven section reveal.
    const scrollProgress = scrollProgressRef.current ?? 0;
    const orbitAngle = scrollProgress * SCROLL_ORBIT_RADIANS;

    // Orbit around the nucleus on top of the existing pull-back, so
    // the camera drifts around/past it as the user scrolls rather
    // than just retreating straight back.
    const orbitedX = basePosition.x * Math.cos(orbitAngle) + basePosition.z * Math.sin(orbitAngle);
    const orbitedZ = basePosition.z * Math.cos(orbitAngle) - basePosition.x * Math.sin(orbitAngle);

    camera.position.x = orbitedX + smoothed.current.x * 0.6;
    camera.position.y = basePosition.y + smoothed.current.y * 0.4 + breathing * 0.3;
    camera.position.z = orbitedZ - scrollProgress * SCROLL_APPROACH + breathing;

    camera.lookAt(0, 0, 0);
  });

  return null;
}
