"use client";

export const HERO_SIGNAL_EVENT = "aptrive:hero-signal";

export type HeroSignalDetail = {
  active: boolean;
  source: "cta" | "dashboard" | "university";
};

export function emitHeroSignal(detail: HeroSignalDetail) {
  window.dispatchEvent(new CustomEvent<HeroSignalDetail>(HERO_SIGNAL_EVENT, { detail }));
}
