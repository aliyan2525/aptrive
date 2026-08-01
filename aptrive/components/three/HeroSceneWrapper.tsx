"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import the 3D scene in a client component to prevent SSR mismatches
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { 
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-transparent flex items-center justify-center">
      <Loader2 className="animate-spin h-8 w-8 text-teal" />
    </div>
  )
});

export default function HeroSceneWrapper() {
  return <HeroScene />;
}
