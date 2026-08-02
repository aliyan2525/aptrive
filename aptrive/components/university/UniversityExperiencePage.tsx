import Link from "next/link";
import {
  ArrowRight,
  Atom,
  Binary,
  BookOpenCheck,
  CalendarCheck,
  CircuitBoard,
  Cpu,
  GraduationCap,
  Landmark,
  LineChart,
  Orbit,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";
import UniversityLogo from "@/components/UniversityLogo";
import type { UniversityExperience } from "@/lib/university-experiences";

function SignatureVisual({ visual, accent }: { visual: UniversityExperience["identity"]["visual"]; accent: string }) {
  const common = "absolute rounded-full border border-white/20 bg-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.25)] backdrop-blur-xl";

  if (visual === "code") {
    return (
      <div className="relative h-[360px] overflow-hidden rounded-[1.5rem] border border-white/15 bg-black/20 p-5 shadow-2xl">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:34px_34px]" />
        {["const solve = merit();", "while (accuracy < target)", "practice.sort(byWeakness)", "return admission.ready"].map((line, index) => (
          <div
            key={line}
            className="relative mt-5 rounded-2xl border border-cyan-200/15 bg-slate-950/45 px-4 py-3 font-mono text-sm text-cyan-100 shadow-lg"
            style={{ transform: `translateX(${index % 2 ? 28 : 0}px)` }}
          >
            <span className="mr-3 text-cyan-300">{String(index + 1).padStart(2, "0")}</span>
            {line}
          </div>
        ))}
        <Binary className="absolute bottom-8 right-8 h-20 w-20 text-cyan-200/40" />
      </div>
    );
  }

  if (visual === "gold") {
    return (
      <div className="relative h-[360px]">
        <div className={`${common} left-10 top-10 h-44 w-56 rotate-[-8deg] rounded-[2rem] bg-amber-100/20`} />
        <div className={`${common} right-8 top-24 h-48 w-64 rotate-[7deg] rounded-[2rem] bg-white/18`} />
        <Landmark className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 text-amber-100/80" />
      </div>
    );
  }

  if (visual === "atom") {
    return (
      <div className="relative flex h-[360px] items-center justify-center">
        <Atom className="h-56 w-56 animate-orbit-slow text-cyan-100/75" />
        <div className={`absolute h-10 w-10 rounded-full ${accent} shadow-[0_0_60px_rgba(125,249,255,0.7)]`} />
        <div className="absolute h-72 w-72 rounded-full border border-white/12" />
      </div>
    );
  }

  if (visual === "machine") {
    return (
      <div className="relative h-[360px] overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/8">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:28px_28px]" />
        <Cpu className="absolute left-16 top-16 h-32 w-32 animate-orbit-slow text-orange-100/70" />
        <CircuitBoard className="absolute bottom-14 right-14 h-36 w-36 text-white/45" />
      </div>
    );
  }

  return (
    <div className="relative flex h-[360px] items-center justify-center">
      <div className="absolute h-72 w-72 rounded-full border border-white/15" />
      <div className="absolute h-56 w-56 rounded-full border border-cyan-100/20 animate-orbit-slower" />
      <div className={`h-36 w-36 rounded-full ${accent} opacity-80 blur-xl`} />
      <Orbit className="absolute h-64 w-64 animate-orbit-slow text-white/55" />
      <Sparkles className="absolute right-20 top-20 h-9 w-9 text-white/70" />
    </div>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg md:text-4xl">{title}</h2>
    </div>
  );
}

export default function UniversityExperiencePage({ experience }: { experience: UniversityExperience }) {
  const { university, identity } = experience;

  return (
    <>
      <section className={`relative overflow-hidden bg-gradient-to-br ${identity.gradient} ${identity.dark}`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_18%,rgba(255,255,255,0.22),transparent_25rem),radial-gradient(circle_at_18%_76%,rgba(45,212,191,0.16),transparent_26rem)]" />
        <div className="container-aptrive relative grid gap-12 py-20 md:grid-cols-[0.95fr_1.05fr] md:items-center md:py-28">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-xl">
              <UniversityLogo university={university.id} displayName={university.name} size={30} />
              <span>{identity.signal}</span>
            </div>
            <h1 className="font-display mt-8 text-4xl font-bold leading-[1.02] tracking-normal md:text-6xl">
              {university.name} Preparation
            </h1>
            <p className={`mt-4 max-w-xl text-xl font-semibold ${identity.textAccent}`}>{identity.headline}</p>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/72">{identity.subhead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5">
                Start preparation <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={`/tools/calculator?uni=${university.id}`} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-xl transition hover:-translate-y-0.5">
                Calculate merit
              </Link>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
              {experience.heroStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                  <div className="font-display text-2xl font-bold">{stat.value}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-white/58">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <SignatureVisual visual={identity.visual} accent={identity.accent} />
        </div>
      </section>

      <section className="container-aptrive py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader eyebrow="University brief" title={`Why ${university.name} deserves a different plan.`} />
          <div className="rounded-[1.35rem] border border-line bg-white/70 p-6 text-sm leading-relaxed text-muted shadow-sm backdrop-blur-xl md:p-8">
            {experience.about}
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {experience.why.map((item) => (
            <div key={item.title} className="motion-card rounded-[1.35rem] border border-line bg-panel p-6">
              <Trophy className="h-6 w-6 text-teal" />
              <h3 className="font-display mt-5 text-xl font-semibold text-fg">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-b from-white to-[#f6f9ff] py-16 md:py-24">
        <div className="container-aptrive">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeader eyebrow="Faculties and programs" title="Explore high-intent pathways." />
            <div className="flex h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm text-muted shadow-sm">
              <Search className="h-4 w-4" />
              Search and filters ready
            </div>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {experience.programs.map((program) => (
              <div key={program.title} className="group rounded-[1.35rem] border border-line bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <span className="rounded-full bg-teal-dim px-3 py-1 text-[11px] font-bold text-teal">{program.tag}</span>
                <h3 className="font-display mt-5 text-xl font-semibold text-fg">{program.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{program.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-aptrive grid gap-12 py-16 md:grid-cols-[0.9fr_1.1fr] md:py-24">
        <SectionHeader eyebrow="Admission roadmap" title="A cinematic path from interest to application." />
        <div className="space-y-4">
          {experience.roadmap.map((step, index) => (
            <div key={step.title} className="relative rounded-[1.35rem] border border-line bg-panel p-5">
              <div className="absolute -left-3 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-teal text-sm font-bold text-white shadow-lg">{index + 1}</div>
              <h3 className="font-display text-lg font-semibold text-fg">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-panel py-16 md:py-24">
        <div className="container-aptrive grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeader eyebrow="Merit trends" title="Read the curve before choosing your next move." />
            <div className="mt-8 rounded-[1.35rem] border border-line bg-white p-6">
              <div className="flex h-56 items-end gap-4" role="img" aria-label={`${university.name} sample merit trend chart`}>
                {experience.merit.map((point) => (
                  <div key={point.year} className="flex flex-1 flex-col items-center gap-3">
                    <div className="w-full rounded-t-2xl bg-gradient-to-t from-teal to-sky-400" style={{ height: `${point.value * 2}px` }} />
                    <span className="text-xs text-muted">{point.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-[1.35rem] border border-line bg-white p-6">
            <LineChart className="h-7 w-7 text-teal" />
            <h3 className="font-display mt-5 text-xl font-semibold text-fg">AI prediction</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Aptrive uses your practice trend, aggregate, and target program to recommend whether to revise, retake, or apply.
            </p>
          </div>
        </div>
      </section>

      <section className="container-aptrive py-16 md:py-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {experience.fees.map((fee) => (
            <div key={fee.title} className="rounded-[1.35rem] border border-line bg-panel p-6">
              <CalendarCheck className="h-6 w-6 text-teal" />
              <div className="font-display mt-5 text-2xl font-bold text-fg">{fee.value}</div>
              <h3 className="mt-2 font-semibold text-fg">{fee.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{fee.detail}</p>
            </div>
          ))}
          {experience.careers.map((career) => (
            <div key={career.label} className="rounded-[1.35rem] border border-line bg-panel p-6">
              <GraduationCap className="h-6 w-6 text-teal" />
              <div className="font-display mt-5 text-2xl font-bold text-fg">{career.value}</div>
              <p className="mt-2 text-sm text-muted">{career.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#f6f9ff] to-white py-16 md:py-24">
        <div className="container-aptrive grid gap-8 lg:grid-cols-3">
          <div>
            <SectionHeader eyebrow="AI preparation hub" title="Convert ambition into a weekly system." />
          </div>
          {[...experience.prep, ...experience.campus].map((item) => (
            <div key={item.title} className="rounded-[1.35rem] border border-line bg-white/78 p-6 shadow-sm backdrop-blur-xl">
              <BookOpenCheck className="h-6 w-6 text-teal" />
              <h3 className="font-display mt-5 text-xl font-semibold text-fg">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-aptrive py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader eyebrow="Student stories and FAQ" title="Make the decision with clarity." />
          <div className="space-y-4">
            {experience.stories.map((story) => (
              <div key={story.name} className="rounded-[1.35rem] border border-line bg-panel p-5">
                <p className="text-sm leading-relaxed text-muted">{story.body}</p>
                <p className="mt-3 text-sm font-semibold text-fg">{story.name}</p>
              </div>
            ))}
            {experience.faq.map((item) => (
              <details key={item.q} className="group rounded-[1.35rem] border border-line bg-white p-5">
                <summary className="cursor-pointer font-display text-lg font-semibold text-fg">{item.q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={`bg-gradient-to-br ${identity.gradient} py-16 text-white md:py-24`}>
        <div className="container-aptrive flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="eyebrow text-white/70">Final step</div>
            <h2 className="font-display mt-3 text-3xl font-bold md:text-5xl">
              Start your {university.name} plan today.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup" className="rounded-full bg-white px-7 py-3 text-sm font-bold text-slate-950">Start preparation</Link>
            <Link href={`/tools/calculator?uni=${university.id}`} className="rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur-xl">Calculate merit</Link>
          </div>
        </div>
      </section>
    </>
  );
}
