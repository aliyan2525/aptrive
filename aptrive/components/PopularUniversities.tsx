import Link from "next/link";
import Image from "next/image";
import { universities } from "@/lib/universities";

const featured = ["nust", "fast", "giki", "pieas", "comsats", "ned"];

export default function PopularUniversities() {
  const items = featured
    .map((id) => universities.find((u) => u.id === id))
    .filter((u): u is (typeof universities)[number] => Boolean(u));

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((uni) => (
        <div
          key={uni.id}
          className="group rounded-2xl border border-line bg-panel p-6 transition-all hover:-translate-y-0.5 hover:border-teal/40"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line-strong bg-white/95 p-1.5">
              <Image
                src={`https://logo.clearbit.com/${uni.website}`}
                alt={`${uni.name} logo`}
                width={36}
                height={36}
                loading="lazy"
                className="h-8 w-8 object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <span className="font-display text-lg font-semibold text-fg">
                  {uni.name}
                </span>
                {uni.verified && (
                  <span className="font-mono-data shrink-0 text-[10px] uppercase tracking-[0.14em] text-teal">
                    Verified
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-2">{uni.location}</p>
            </div>
          </div>
          <p className="mt-4 font-mono-data text-xs text-muted">
            {uni.formulaText}
          </p>
          <Link
            href="/calculator"
            className="mt-5 inline-block text-sm font-medium text-teal opacity-0 transition-opacity group-hover:opacity-100"
          >
            Calculate aggregate →
          </Link>
        </div>
      ))}
    </div>
  );
}
