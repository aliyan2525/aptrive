"use client";

import dynamic from "next/dynamic";
import GPUTierGate from "@/components/three/GPUTierGate";
import HeroBackground from "@/components/HeroBackground";

// `three` + `@react-three/fiber` + `@react-three/postprocessing` are a
// meaningful chunk of JS that a visitor who gets the fallback (low
// tier / reduced motion) should never have to download at all —
// dynamic + ssr:false keeps it out of both the server render and the
// initial client bundle.
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen animate-pulse bg-graphite" />
  ),
});

export default function HeroSceneClient() {
  return (
    <GPUTierGate fallback={<HeroBackground />}>
      <HeroScene />
    </GPUTierGate>
  );
}
