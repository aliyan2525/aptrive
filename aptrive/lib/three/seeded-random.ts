/**
 * Deterministic pseudo-random number generator for scene geometry that's
 * built inside `useMemo`.
 *
 * `Math.random()` is an impure global — calling it during render (even
 * inside `useMemo`) means the computed value depends on external,
 * unobservable state, which violates React's render-purity rule
 * (`react-hooks/purity`) and can produce different geometry across
 * re-renders/StrictMode double-invokes/future React Compiler memoization.
 *
 * A seeded PRNG keyed on the same deps already gating the `useMemo` (e.g.
 * `count`, `radius`, an index) is fully deterministic for the lifetime of
 * that memo, so it satisfies the purity rule while still producing a
 * scattered, "random-looking" distribution.
 *
 * mulberry32 — small, fast, decent statistical quality for cosmetic
 * particle placement (not cryptographic use).
 */
export function createSeededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return function mulberry32() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
