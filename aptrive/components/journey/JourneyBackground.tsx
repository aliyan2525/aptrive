/**
 * Static CSS-only fallback for JourneySceneClient — same role as
 * FeaturesBackground.tsx (GPUTierGate's low-tier/reduced-motion/
 * pending-detection fallback). Left-to-right gradient wash hints at
 * the traveling-signal motif without any animation.
 */
export default function JourneyBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(35,213,196,0.13),transparent_45%),radial-gradient(circle_at_90%_75%,rgba(201,162,75,0.12),transparent_45%)]"
    />
  );
}
