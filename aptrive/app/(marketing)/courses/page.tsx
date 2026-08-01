import type { Metadata } from "next";
import Link from "next/link";
import UniversityLogo from "@/components/UniversityLogo";
import { universities, getCourseSlugForUniversity } from "@/lib/universities";

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
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
          University-specific preparation tracks.
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-muted">
          Pick your target university to get a focused roadmap, merit formula,
          and next-step preparation strategy.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {universities.map((university) => {
          const courseSlug = getCourseSlugForUniversity(university.id);
          return (
            <Link
              key={university.id}
              href={`/courses/${courseSlug}`}
              className="group rounded-md border border-line bg-panel p-5 transition-colors hover:border-line-strong hover:bg-panel-2"
            >
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

              <p className="mt-4 text-xs text-muted">{university.formulaText}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
