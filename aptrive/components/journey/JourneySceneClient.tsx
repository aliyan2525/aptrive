"use client";

import dynamic from "next/dynamic";
import GPUTierGate from "@/components/three/GPUTierGate";
import JourneyBackground from "./JourneyBackground";

const JourneyScene = dynamic(() => import("./JourneyScene"), {
  ssr: false,
  loading: () => null,
});

export default function JourneySceneClient() {
  return (
    <GPUTierGate fallback={<JourneyBackground />}>
      <JourneyScene />
    </GPUTierGate>
  );
}
