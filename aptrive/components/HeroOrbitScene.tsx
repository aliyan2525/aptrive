"use client";

import { useEffect, useRef } from "react";

export default function HeroOrbitScene() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const THREE = await import("three");
      if (cancelled || !root) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, root.clientWidth / root.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 8);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(root.clientWidth, root.clientHeight);
      root.appendChild(renderer.domElement);

      const ambient = new THREE.AmbientLight(0xffffff, 0.5);
      const key = new THREE.PointLight(0x23d5c4, 1.4, 30);
      key.position.set(2, 4, 5);
      scene.add(ambient, key);

      const cluster = new THREE.Group();
      scene.add(cluster);

      const primary = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.5, 1),
        new THREE.MeshStandardMaterial({
          color: 0x2f81ff,
          metalness: 0.25,
          roughness: 0.15,
          transparent: true,
          opacity: 0.9,
        })
      );
      cluster.add(primary);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.1, 0.04, 32, 140),
        new THREE.MeshStandardMaterial({ color: 0x23d5c4, emissive: 0x0a3f39, metalness: 0.8, roughness: 0.2 })
      );
      ring.rotation.x = Math.PI / 2.8;
      cluster.add(ring);

      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 24, 24),
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x254e9a, metalness: 0.6, roughness: 0.18 })
      );
      cluster.add(core);

      const particleCount = 260;
      const points = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i += 1) {
        const r = 3.2 + Math.random() * 2.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        points[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        points[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        points[i * 3 + 2] = r * Math.cos(phi);
      }
      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute("position", new THREE.BufferAttribute(points, 3));
      const particleMaterial = new THREE.PointsMaterial({ size: 0.035, color: 0x9dd8ff });
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      const mouse = new THREE.Vector2(0, 0);
      const target = new THREE.Vector2(0, 0);
      const onPointer = (event: PointerEvent) => {
        const bounds = root.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
        const y = -(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
        target.set(x, y);
      };
      root.addEventListener("pointermove", onPointer, { passive: true });

      const onResize = () => {
        if (!root) return;
        camera.aspect = root.clientWidth / root.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(root.clientWidth, root.clientHeight);
      };
      window.addEventListener("resize", onResize);

      let frame = 0;
      const tick = () => {
        frame = requestAnimationFrame(tick);
        mouse.lerp(target, 0.04);
        cluster.rotation.y += 0.0035;
        cluster.rotation.x = mouse.y * 0.16;
        cluster.rotation.z = mouse.x * 0.1;
        particles.rotation.y -= 0.0009;
        particles.rotation.x += 0.0006;
        renderer.render(scene, camera);
      };
      tick();

      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", onResize);
        root.removeEventListener("pointermove", onPointer);
        particleGeometry.dispose();
        particleMaterial.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === root) {
          root.removeChild(renderer.domElement);
        }
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div ref={rootRef} className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-line bg-panel/40 md:h-[520px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(35,213,196,0.16),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(47,129,255,0.2),transparent_48%)]" />
    </div>
  );
}
