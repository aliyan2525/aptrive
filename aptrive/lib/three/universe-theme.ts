import type { QualityTier } from "./gpu-tier";
import { QUALITY_PRESETS } from "./quality-presets";

/**
 * Single source of truth for the "one continuous universe" illusion
 * across per-section canvases. Every section's scene imports from
 * here instead of hardcoding its own palette, star density, or
 * arrival curve — that's what makes independent <Canvas> instances
 * read as one world instead of seven unrelated demos stitched
 * together.
 *
 * Previously these three brand colors were defined locally inside
 * components/hero/scene/EducationalUniverse.tsx. They're relocated
 * here unchanged (same hex values) so the Hero scene and every later
 * section (Roadmap, Library, Leaderboard, Calculator, University
 * cards) draw from the same constants rather than each redefining
 * "brand teal" with a slightly different hex by accident.
 */
export const TEAL = "#23d5c4";
export const BLUE = "#2f81ff";
export const GOLD = "#c9a24b";

export const UNIVERSE_PALETTE = {
  teal: TEAL,
  blue: BLUE,
  gold: GOLD,
} as const;

/**
 * Nebula-like background fog/dust color — a mix of the existing BLUE
 * and TEAL brand colors (weighted toward BLUE, which is already the
 * nucleus core's color) rather than a new arbitrary hue introduced
 * just for the effect. Any section adding depth fog should pull from
 * this instead of picking its own color.
 */
export const NEBULA_FOG_COLOR = "#1c3a63"; // BLUE/TEAL mix, darkened for use as a background/fog tone rather than a foreground accent

/**
 * Starfield/particle density per quality tier, expressed as a
 * fraction of that tier's existing `particleCount` budget in
 * quality-presets.ts rather than a new arbitrary number — so raising
 * or lowering the global particle budget for perf reasons still
 * scales every section's starfield consistently without a second
 * place to remember to update.
 *
 * `starCount` is deliberately smaller than the tier's full
 * `particleCount` — starfield dust sits *behind* each section's own
 * foreground particle work (Hero's knowledge fragments, Library's
 * subject motifs, etc.), which draws from the same tier budget on
 * top of this.
 */
const STARFIELD_SHARE = 0.6;

export function getStarfieldDensity(tier: QualityTier): number {
  return Math.round(QUALITY_PRESETS[tier].particleCount * STARFIELD_SHARE);
}

/**
 * Shared "arrival" easing — the motion signature every section uses
 * when its scene fades/settles into view. Using one curve everywhere
 * is what makes a scroll transition between two independently-
 * mounted canvases feel like a continuation instead of a hard cut,
 * even though there's no single shared <Canvas> spanning the scroll.
 *
 * Exponential ease-out: fast initial settle, long gentle tail. Swap
 * the implementation here (once) if the motion signature ever needs
 * to change site-wide — individual sections should never define
 * their own arrival easing.
 */
export function arriveEase(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return clamped === 1 ? 1 : 1 - Math.pow(2, -10 * clamped);
}

/**
 * Convention for section scene wrappers: apply `arriveEase` to the
 * raw 0→1 value from `useScrollProgress` before passing it down as
 * `arriveProgress`, e.g.:
 *
 *   const progressRef = useScrollProgress(sectionRef, opts);
 *   const arriveProgress = arriveEase(progressRef.current);
 *
 * `useScrollProgress` itself stays a plain raw-progress hook (other
 * callers may want the unshaped value) — `arriveEase` is the shared
 * shaping step every *new* section's Client wrapper should apply on
 * top of it, by convention, so "arriveProgress" means the same thing
 * (same curve) everywhere it appears.
 */
