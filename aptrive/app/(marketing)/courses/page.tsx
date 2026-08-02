import type { Metadata } from "next";
import Link from "next/link";
import UniversityLogo from "@/components/UniversityLogo";
import { universityExperiences } from "@/lib/university-experiences";

export const metadata: Metadata = {
  title: "Courses — Aptrive",
  description:
    "Explore university-specific preparation tracks for NUST, FAST, GIKI, PIEAS, COMSATS, UET, and more.",
};

export default function CoursesPage() {
  return (
    <section className="container-aptrive py-16 md:py-24">
      <div className="max-w-2xl">
        <div className="eyebrow">Courses</div>
        <h1 className="font-display mt-3 text-4xl font-bold tracking-normal text-fg md:text-5xl">
          University-specific <span className="aurora-text">preparation tracks</span>.
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-muted">
          Pick your target university to get a focused roadmap, merit formula,
          and next-step preparation strategy.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {universityExperiences.map((experience) => {
          const university = experience.university;
          return (
            <Link
              key={university.id}
              href={`/universities/${experience.slug}`}
              className="group premium-shell motion-card relative overflow-hidden rounded-[1.35rem] p-5"
            >
              <div className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-br ${experience.identity.gradient} opacity-[0.08] transition-opacity group-hover:opacity-[0.14]`} />
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <UniversityLogo
                    university={university.id}
                    displayName={university.name}
                    size={36}
                  />
                  <div>
                    <h2 className="font-display text-xl font-semibold text-fg">
                      {university.name}
                    </h2>
                    <p className="text-xs text-muted">{university.location}</p>
                  </div>
                </div>
                <span className="text-sm text-teal transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>

              <p className="mt-4 text-sm font-semibold text-fg">{experience.identity.signal}</p>
              <p className="mt-4 text-xs text-muted">{university.formulaText}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
