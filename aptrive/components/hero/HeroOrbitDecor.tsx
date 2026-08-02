export default function HeroOrbitDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
      <svg
        viewBox="0 0 600 600"
        className="absolute inset-0 h-full w-full animate-orbit-slow"
        style={{ transformOrigin: "50% 50%" }}
      >
        <circle
          cx="300"
          cy="300"
          r="240"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-neutral-900/10"
          transform="rotate(-8 300 300)"
        />
      </svg>

      <svg
        viewBox="0 0 600 600"
        className="absolute inset-0 h-full w-full animate-orbit-slower"
        style={{ transformOrigin: "50% 50%" }}
      >
        <ellipse
          cx="300"
          cy="300"
          rx="205"
          ry="235"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-neutral-900/[0.07]"
          transform="rotate(14 300 300)"
        />
      </svg>

      {/* A couple of stray glints — sparkle, not full orbit chips (those live in HeroOrbitIcons/HeroUniversityBadges now). */}
      <span className="absolute right-[6%] top-[16%] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] animate-float-slow" />
      <span className="absolute right-[8%] bottom-[10%] h-1 w-1 rounded-full bg-amber-300/90 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-float-slower" />
    </div>
  );
}
