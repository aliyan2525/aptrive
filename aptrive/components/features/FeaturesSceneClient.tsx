"use client";

import dynamic from "next/dynamic";
import GPUTierGate from "@/components/three/GPUTierGate";
import FeaturesBackground from "./FeaturesBackground";

// Same reasoning as HeroSceneClient.tsx: keep three/R3F/postprocessing
// out of the initial bundle and server render entirely for visitors
// who'll get the fallback anyway (low GPU tier / reduced motion).
const FeaturesScene = dynamic(() => import("./FeaturesScene"), {
  ssr: false,
  loading: () => null,
});

export default function FeaturesSceneClient() {
  return (
    <GPUTierGate fallback={<FeaturesBackground />}>
      <FeaturesScene />
    </GPUTierGate>
  );
}
