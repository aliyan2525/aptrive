"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
}

/**
 * Aptrive's signature hero visual.
 *
 * A quiet, animated network of "topic nodes" that drift and connect —
 * a nod to the adaptive topic-mastery graph that actually powers the
 * product, rather than a generic particle field. Deliberately calm:
 * it should read as intelligence working in the background, not a
 * light show competing with the headline.
 *
 * - Single canvas, no per-node DOM — cheap to animate at 60fps
 * - Pauses via IntersectionObserver when the hero scrolls out of view
 * - Respects prefers-reduced-motion (renders one static frame)
 * - Subtle parallax tilt on desktop pointer devices only
 */
export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];
    let raf = 0;
    let looping = false;
    let running = !reduceMotion;
    let t = 0;

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.max(1, Math.round(width * dpr));
      canvas!.height = Math.max(1, Math.round(height * dpr));
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = width < 640 ? 12 : width < 1024 ? 18 : 26;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.6 + 1,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      const linkDist = width < 640 ? 110 : 160;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            const alpha = (1 - dist / linkDist) * 0.16;
            ctx!.strokeStyle = `rgba(35, 213, 196, ${alpha})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      for (const n of nodes) {
        const pulse = 0.55 + Math.sin(t * 0.001 + n.phase) * 0.45;
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(35, 213, 196, ${0.25 + pulse * 0.35})`;
        ctx!.arc(n.x, n.y, n.r + pulse * 0.6, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function step() {
      if (!running) {
        looping = false;
        return;
      }
      looping = true;
      t += 16;
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }
      draw();
      raf = requestAnimationFrame(step);
    }

    resize();
    draw();
    if (running) step();

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw();
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting && !reduceMotion;
        if (running && !looping) step();
      },
      { threshold: 0 }
    );
    io.observe(wrap);

    function onPointerMove(e: PointerEvent) {
      const rect = wrap!.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      wrap!.style.transform = `translate3d(${px * -8}px, ${py * -6}px, 0)`;
    }
    function onPointerLeave() {
      wrap!.style.transform = "translate3d(0,0,0)";
    }

    if (finePointer && !reduceMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      wrap.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      wrap?.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(35,213,196,0.08),transparent)]" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(243,245,242,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(243,245,242,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <div
        ref={wrapRef}
        className="absolute -inset-x-6 -inset-y-6 [transition:transform_.3s_var(--ease-smooth)]"
      >
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-graphite to-transparent" />
    </div>
  );
}
