export default function HeroOrbitDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
      <svg
        viewBox="0 0 600 600"
        className="absolute inset-0 h-full w-full animate-orbit-slow"
        style={{ transformOrigin: "62% 42%" }}
      >
        <ellipse
          cx="360"
          cy="250"
          rx="230"
          ry="150"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-neutral-900/10"
          transform="rotate(-18 360 250)"
        />
      </svg>

      <svg
        viewBox="0 0 600 600"
        className="absolute inset-0 h-full w-full animate-orbit-slower"
        style={{ transformOrigin: "40% 68%" }}
      >
        <ellipse
          cx="230"
          cy="380"
          rx="160"
          ry="105"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-neutral-900/10"
          transform="rotate(12 230 380)"
        />
      </svg>

      {/* Floating accent dots */}
      <span className="absolute left-[6%] top-[46%] h-2 w-2 rounded-full bg-fuchsia-400/70 shadow-[0_0_10px_rgba(217,70,239,0.5)] animate-float-slow" />
      <span className="absolute right-[10%] top-[12%] h-1.5 w-1.5 rounded-full bg-teal-500/80 shadow-[0_0_10px_rgba(20,184,166,0.5)] animate-float-slower" />
      <span className="absolute right-[26%] top-[63%] h-2.5 w-2.5 rounded-full bg-amber-400/80 shadow-[0_0_12px_rgba(251,191,36,0.55)] animate-float-slow" />
      <span className="absolute left-[16%] bottom-[10%] h-1.5 w-1.5 rounded-full bg-indigo-400/70 shadow-[0_0_10px_rgba(129,140,248,0.5)] animate-float-slower" />
    </div>
  );
}
