/**
 * Static CSS-only fallback for FeaturesSceneClient — shown while GPU
 * detection is pending, under prefers-reduced-motion, or on low-tier
 * devices (GPUTierGate's default: low tier gets fallback, not a
 * scaled-down scene). Same visual grammar as the radial-gradient wash
 * already used inline in the Hero section in app/page.tsx (teal/blue
 * glow, dark base) so a low-tier visitor still gets a coherent,
 * on-brand section instead of a plain white gap where the scene would
 * have been.
 *
 * No canvas, no animation loop — this must stay cheap, it's the thing
 * GPUTierGate picks specifically to avoid WebGL cost.
 */
export default function FeaturesBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(35,213,196,0.14),transparent_45%),radial-gradient(circle_at_15%_85%,rgba(201,162,75,0.12),transparent_45%)]"
    />
  );
}
