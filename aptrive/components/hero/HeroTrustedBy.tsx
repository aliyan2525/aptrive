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
    <div className="mt-14">
      <p className="text-center text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
        Aligned with admissions at Pakistan&apos;s top universities
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 grayscale opacity-70 transition-opacity hover:opacity-100 hover:grayscale-0">
        {FEATURED.map((uni) => (
          <div key={uni.id} className="flex items-center gap-2.5">
            <UniversityLogo university={uni.id} displayName={uni.name} size={28} />
            <span className="font-display text-sm font-semibold text-neutral-700">{uni.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
