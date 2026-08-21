"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";

type HeroSceneComponent = ComponentType;

function StaticHeroFallback() {
  return (
    <div className="hero-static-fallback absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,.95),rgba(174,224,255,.76)_28%,rgba(117,92,240,.52)_58%,rgba(49,35,130,.18)_76%,transparent_78%)] shadow-[0_0_90px_rgba(112,120,255,.32)]" />
      <div className="absolute left-1/2 top-1/2 h-[84%] w-[84%] -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] rounded-full border border-violet-300/35" />
      <div className="absolute left-1/2 top-1/2 h-[92%] w-[58%] -translate-x-1/2 -translate-y-1/2 rotate-[22deg] rounded-[50%] border border-teal-300/35" />
      <div className="absolute left-[22%] top-[26%] h-3 w-3 rounded-full bg-white shadow-[0_0_24px_8px_rgba(255,255,255,.8)]" />
      <div className="absolute right-[12%] top-[40%] h-2.5 w-2.5 rounded-full bg-teal-300 shadow-[0_0_22px_8px_rgba(45,212,191,.62)]" />
      <div className="absolute bottom-[22%] left-[18%] h-2.5 w-2.5 rounded-full bg-violet-300 shadow-[0_0_22px_8px_rgba(139,92,246,.6)]" />
    </div>
  );
}

export default function HeroBlobsSceneWrapper() {
  const [canRenderScene, setCanRenderScene] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [HeroBlobsScene, setHeroBlobsScene] = useState<HeroSceneComponent | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1024px)");
    const update = () => setCanRenderScene(desktop.matches && !reducedMotion.matches);
    update();
    desktop.addEventListener("change", update);
    reducedMotion.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!canRenderScene || !isVisible || HeroBlobsScene) return;
    let cancelled = false;
    import("@/components/hero/HeroBlobsScene").then((module) => {
      if (!cancelled) setHeroBlobsScene(() => module.default);
    });
    return () => {
      cancelled = true;
    };
  }, [HeroBlobsScene, canRenderScene, isVisible]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { rootMargin: "200px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0" aria-hidden="true">
      <div className={`absolute inset-0 transition-opacity duration-500 ease-out motion-reduce:transition-none ${HeroBlobsScene ? "opacity-0" : "opacity-100"}`}>
        <StaticHeroFallback />
      </div>
      <div className={`absolute inset-0 transition-opacity duration-500 ease-out motion-reduce:transition-none ${HeroBlobsScene ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        {HeroBlobsScene && <HeroBlobsScene />}
      </div>
    </div>
  );
}
