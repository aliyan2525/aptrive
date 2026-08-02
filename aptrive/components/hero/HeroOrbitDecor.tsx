export default function HeroOrbitDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
      <div className="absolute inset-[5%] rounded-full bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,0.45),transparent_17rem),radial-gradient(circle_at_62%_58%,rgba(45,212,191,0.14),transparent_19rem)] blur-sm" />

      <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full opacity-45">
        <path
          d="M92 190 C154 132 226 152 272 218 S402 294 510 210"
          fill="none"
          stroke="url(#hero-constellation-a)"
          strokeWidth="1"
          strokeDasharray="4 10"
        />
        <path
          d="M118 438 C198 370 278 416 338 342 S444 260 526 332"
          fill="none"
          stroke="url(#hero-constellation-b)"
          strokeWidth="1"
          strokeDasharray="3 12"
        />
        <defs>
          <linearGradient id="hero-constellation-a" x1="92" x2="510" y1="190" y2="210">
            <stop stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="0.5" stopColor="#38bdf8" stopOpacity="0.35" />
            <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hero-constellation-b" x1="118" x2="526" y1="438" y2="332">
            <stop stopColor="#14b8a6" stopOpacity="0" />
            <stop offset="0.5" stopColor="#14b8a6" stopOpacity="0.28" />
            <stop offset="1" stopColor="#fbbf24" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <svg
        viewBox="0 0 600 600"
        className="absolute inset-0 h-full w-full animate-orbit-slow"
        style={{ transformOrigin: "50% 50%" }}
      >
        <circle
          cx="300"
          cy="300"
          r="230"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-blue-500/14"
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
          rx="198"
          ry="226"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-violet-500/10"
          transform="rotate(14 300 300)"
        />
      </svg>

      <svg
        viewBox="0 0 600 600"
        className="absolute inset-0 h-full w-full animate-orbit-slower"
        style={{ transformOrigin: "50% 50%", animationDuration: "120s" }}
      >
        <ellipse
          cx="300"
          cy="300"
          rx="260"
          ry="178"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-cyan-500/12"
          transform="rotate(-22 300 300)"
        />
      </svg>

      <span className="absolute right-[6%] top-[16%] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] animate-float-slow" />
      <span className="absolute right-[8%] bottom-[10%] h-1 w-1 rounded-full bg-amber-300/90 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-float-slower" />
      <span className="absolute left-[16%] top-[24%] h-1 w-1 rounded-full bg-cyan-300/80 shadow-[0_0_9px_rgba(103,232,249,0.7)] animate-float-slower" />
      <span className="absolute left-[28%] bottom-[14%] h-1.5 w-1.5 rounded-full bg-violet-300/70 shadow-[0_0_10px_rgba(196,181,253,0.72)] animate-float-slow" />
    </div>
  );
}
