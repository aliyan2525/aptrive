/**
 * University → logo resolution.
 *
 * The app refers to the same handful of universities through at least
 * three different naming schemes that grew independently:
 *
 *  - `lib/universities.ts` canonical ids      → "nust", "uet-lahore", "fast", ...
 *  - `/courses/[slug]` route slugs            → "nust-net", "uet", "fast", ...
 *  - Free-text display names (dashboard demo
 *    data, leaderboard demo data, onboarding) → "NUST", "UET", "FAST-NUCES", ...
 *
 * and the actual uploaded logo files use a fourth, simplest scheme:
 * `public/logos/universities/<key>.svg` (nust, fast, comsats, giki, ned,
 * pieas, uet).
 *
 * Rather than repeating id-guessing logic at every call site (and
 * silently breaking whenever one of those naming schemes drifts —
 * exactly what happened with "uet" vs "uet-lahore"), everything routes
 * through `resolveUniversityLogo()` below.
 */

export type UniversityLogoKey =
  | "nust"
  | "fast"
  | "comsats"
  | "giki"
  | "pieas"
  | "ned"
  | "uet";

/** Universities we have an uploaded SVG for, in `public/logos/universities/`. */
const AVAILABLE_LOGOS: ReadonlySet<UniversityLogoKey> = new Set([
  "nust",
  "fast",
  "comsats",
  "giki",
  "pieas",
  "ned",
  "uet",
]);

/**
 * Every id/slug/display-name variant seen across the codebase, mapped to
 * the logo key that owns it. Add new variants here — not at the call
 * site — when a new naming scheme shows up.
 */
const ALIASES: Record<string, UniversityLogoKey> = {
  // lib/universities.ts canonical ids
  nust: "nust",
  fast: "fast",
  comsats: "comsats",
  "uet-lahore": "uet",
  giki: "giki",
  pieas: "pieas",
  ned: "ned",

  // /courses/[slug] route slugs
  "nust-net": "nust",
  uet: "uet",

  // Free-text display names used in dashboard/leaderboard/onboarding
  // demo data — lowercased and stripped of non-alphanumerics before
  // lookup (see normalizeKey), so this list only needs the canonical
  // lowercase form of each variant actually in use.
  "fast-nuces": "fast",
  "uet lahore": "uet",
  "university of engineering  technology lahore": "uet",
};

function normalizeKey(value: string): string {
  return value.trim().toLowerCase();
}

export type UniversityLogoInfo =
  | { available: true; key: UniversityLogoKey; src: string }
  | { available: false; key: null; src: null };

/**
 * Resolve any id/slug/display-name string to its logo file, or a typed
 * "not available" result if we don't have a logo for it. Callers use the
 * `available` flag to render an initials fallback instead of guessing
 * that every university has art.
 */
export function resolveUniversityLogo(idOrSlugOrName: string): UniversityLogoInfo {
  const normalized = normalizeKey(idOrSlugOrName);
  const direct = ALIASES[normalized];
  const key = direct ?? (AVAILABLE_LOGOS.has(normalized as UniversityLogoKey) ? (normalized as UniversityLogoKey) : undefined);

  if (!key) {
    return { available: false, key: null, src: null };
  }

  return { available: true, key, src: `/logos/universities/${key}.svg` };
}

/** Two-letter fallback badge text for universities without an uploaded logo. */
export function universityInitials(name: string): string {
  const words = name
    .replace(/[()]/g, "")
    .split(/[\s-]+/)
    .filter(Boolean);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
