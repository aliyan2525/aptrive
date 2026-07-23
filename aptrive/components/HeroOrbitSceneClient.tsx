"use client";

import dynamic from "next/dynamic";

/**
 * `next/dynamic(..., { ssr: false })` is only legal inside a Client
 * Component — app/page.tsx is an async Server Component (it awaits
 * the Supabase session), so the dynamic import has to live here
 * instead and get imported as a plain (non-dynamic) component there.
 */
const HeroOrbitScene = dynamic(() => import("@/components/HeroOrbitScene"), {
  ssr: false,
  loading: () => <div className="h-[420px] animate-pulse rounded-3xl border border-line bg-panel md:h-[520px]" />,
});

export default HeroOrbitScene;
