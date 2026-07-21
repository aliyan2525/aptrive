import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses — Aptrive",
  description:
    "Explore Aptrive's exam preparation tracks: NUST NET, FAST-NUCES, GIKI, PIEAS, COMSATS, and UET Lahore.",
};

const courses = [
  {
    slug: "nust-net",
    status: "Available now",
    name: "NUST NET",
    tagline: "Engineering entrance — mathematics-focused",
    body: "Structured practice across the full NUST NET mathematics syllabus, with diagnostics, topic-level analytics, and full-length timed mocks.",
    active: true,
  },
  {
    slug: "fast",
    status: "Available now",
    name: "FAST-NUCES",
    tagline: "Computer Science & Engineering entrance",
    body: "Quantitative, analytical, and verbal reasoning preparation for FAST-NUCES's entry test, on the same diagnostic-and-analytics engine.",
    active: true,
  },
  {
    slug: "comsats",
    status: "Available now",
    name: "COMSATS",
    tagline: "University-wide entrance test",
    body: "Quantitative, analytical, and verbal reasoning preparation for the COMSATS entry test, across all campuses.",
    active: true,
  },
  {
    slug: "uet",
    status: "Available now",
    name: "UET Lahore",
    tagline: "ECAT engineering entrance",
    body: "Physics, chemistry, and mathematics preparation for UET Lahore's ECAT, with diagnostics and full-length timed mocks.",
    active: true,
  },
  {
    slug: "pieas",
    status: "Available now",
    name: "PIEAS",
    tagline: "Engineering & Applied Sciences entrance",
    body: "Mathematics and physics preparation for PIEAS's entry test, on the same diagnostic-and-analytics engine.",
    active: true,
  },
  {
    slug: "giki",
    status: "Available now",
    name: "GIKI",
    tagline: "Engineering Sciences entrance",
    body: "Mathematics, physics, and analytical-reasoning preparation for GIKI's entry test, with diagnostics and full-length timed mocks.",
    active: true,
  },
  {
    slug: "ecat",
    status: "Coming soon",
    name: "ECAT",
    tagline: "Engineering entrance",
    body: "Preparation track for ECAT, built on the same diagnostic-and-analytics engine as NUST NET.",
    active: false,
  },
  {
    slug: "mdcat",
    status: "Coming soon",
    name: "MDCAT",
    tagline: "Medical entrance",
    body: "Preparation track for MDCAT, expanding Aptrive beyond engineering admissions.",
    active: false,
  },
];

export default function CoursesPage() {
  return (
    <section className="container-aptrive py-16 md:py-24">
      <div className="max-w-xl">
        <div className="eyebrow">Courses</div>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
          Choose your exam.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Every Aptrive track runs on the same core engine: diagnostic,
          personalized practice, analytics, mastery. Only the syllabus
          changes.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {courses.map((course) =>
          course.active ? (
            <Link
              key={course.slug}
              href={`/courses/${course.slug}`}
              className="flex flex-col rounded-md border border-teal/30 bg-teal-dim p-7 transition-colors hover:border-teal/60"
            >
              <span className="font-mono-data text-xs uppercase tracking-[0.14em] text-teal">
                {course.status}
              </span>
              <span className="font-display mt-4 text-2xl font-semibold text-fg">
                {course.name}
              </span>
              <span className="mt-1 text-sm text-muted">{course.tagline}</span>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                {course.body}
              </p>
              <span className="mt-6 text-sm font-medium text-teal">
                View syllabus &amp; pricing →
              </span>
            </Link>
          ) : (
            <div
              key={course.slug}
              className="flex flex-col rounded-md border border-line bg-panel p-7 opacity-70"
            >
              <span className="font-mono-data text-xs uppercase tracking-[0.14em] text-muted-2">
                {course.status}
              </span>
              <span className="font-display mt-4 text-2xl font-semibold text-fg">
                {course.name}
              </span>
              <span className="mt-1 text-sm text-muted">{course.tagline}</span>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                {course.body}
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
