import UniversityLogo from "@/components/UniversityLogo";

const FEATURED = [
  { id: "nust", name: "NUST" },
  { id: "fast", name: "FAST-NUCES" },
  { id: "giki", name: "GIKI" },
  { id: "pieas", name: "PIEAS" },
  { id: "comsats", name: "COMSATS" },
  { id: "ned", name: "NED" },
  { id: "uet-lahore", name: "UET" },
];

export default function HeroTrustedBy() {
  return (
    <div className="homepage-university-strip mt-14 md:mt-16">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
        Aligned with admissions at Pakistan&apos;s top universities
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 grayscale opacity-75 transition-opacity hover:opacity-100 hover:grayscale-0 sm:gap-4 md:gap-6">
        {FEATURED.map((uni) => (
          <div key={uni.id} className="flex items-center gap-2.5 rounded-full border border-white/80 bg-white/70 px-4 py-2 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md">
            <UniversityLogo university={uni.id} displayName={uni.name} size={28} />
            <span className="font-display text-sm font-semibold text-neutral-700">{uni.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
