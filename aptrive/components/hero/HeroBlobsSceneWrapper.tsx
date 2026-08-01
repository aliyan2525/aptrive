"use client";

import dynamic from "next/dynamic";

const HeroBlobsScene = dynamic(() => import("@/components/hero/HeroBlobsScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0" aria-hidden="true" />,
});

export default function HeroBlobsSceneWrapper() {
  return <HeroBlobsScene />;
}
