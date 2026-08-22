import Link from "next/link";
import { ArrowRight, BookOpenCheck, CalendarCheck, GraduationCap, LineChart, Search, Trophy } from "lucide-react";
import UniversityLogo from "@/components/UniversityLogo";
import UniversityHeroArt from "@/components/university/UniversityHeroArt";
import type { UniversityExperience } from "@/lib/university-experiences";

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
    <main data-university={university.id} className="relative overflow-hidden bg-[radial-gradient(circle_at_78%_0%,rgba(191,246,239,0.34),transparent_30rem),linear-gradient(180deg,#ffffff_0%,#f7faff_55%,#eef3ff_100%)]">
      <section className={`relative overflow-hidden bg-gradient-to-br ${identity.gradient} ${identity.dark}`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_18%,rgba(255,255,255,0.2),transparent_25rem),radial-gradient(circle_at_18%_76%,rgba(45,212,191,0.14),transparent_26rem)]" />
        <div className="container-aptrive relative grid gap-12 py-20 md:grid-cols-[0.9fr_1.1fr] md:items-center md:py-28">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold shadow-[0_12px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl">
              <UniversityLogo university={university.id} displayName={university.name} size={30} />
              <span>{identity.signal}</span>
            </div>
            <h1 className="font-display mt-8 max-w-2xl text-4xl font-bold leading-[1.02] tracking-[-0.05em] md:text-6xl">{university.name} <span className={identity.textAccent}>Preparation</span></h1>
            <p className={`mt-5 max-w-xl text-xl font-semibold leading-tight ${identity.textAccent}`}>{identity.headline}</p>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/72">{identity.subhead}</p>
            <div className="mobile-stack-actions mt-9 flex flex-wrap gap-3 sm:flex-row">
              <Link href="/signup" className="pressable inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5">Start preparation <ArrowRight className="h-4 w-4" /></Link>
              <Link href={`/tools/calculator?uni=${university.id}`} className="pressable inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/15">Calculate merit</Link>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
              {experience.heroStats.map((stat) => <div key={stat.label} className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl"><div className="font-display text-2xl font-bold">{stat.value}</div><div className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/58">{stat.label}</div></div>)}
            </div>
          </div>
          <UniversityHeroArt universityId={university.id} signal={identity.signal} />
        </div>
      </section>

      <section className="container-aptrive py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]"><SectionHeader eyebrow="University brief" title={`Why ${university.name} deserves a different plan.`} /><div className="rounded-[1.5rem] border border-white/80 bg-white/72 p-6 text-sm leading-7 text-muted shadow-[0_18px_50px_rgba(62,72,130,0.08)] backdrop-blur-xl md:p-8">{experience.about}</div></div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">{experience.why.map((item, index) => <div key={item.title} className="motion-card rounded-[1.5rem] border border-white/80 bg-white/72 p-6 shadow-[0_14px_38px_rgba(62,72,130,0.06)] backdrop-blur-xl"><Trophy className={`h-6 w-6 ${index === 1 ? "text-violet-600" : "text-teal-600"}`} /><h3 className="font-display mt-5 text-xl font-semibold text-fg">{item.title}</h3><p className="mt-2 text-sm leading-7 text-muted">{item.body}</p></div>)}</div>
      </section>

      <section className="bg-gradient-to-b from-white to-[#f6f9ff] py-16 md:py-24"><div className="container-aptrive"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><SectionHeader eyebrow="Faculties and programs" title="Explore high-intent pathways." /><div className="flex h-11 items-center gap-2 rounded-full border border-line bg-white/75 px-4 text-sm font-semibold text-muted shadow-sm"><Search className="h-4 w-4 text-violet-600" /> Search and filters ready</div></div><div className="mt-10 grid gap-5 md:grid-cols-3">{experience.programs.map((program, index) => <div key={program.title} className="motion-card group rounded-[1.5rem] border border-white/85 bg-white/75 p-6 shadow-[0_16px_42px_rgba(62,72,130,0.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(62,72,130,0.12)]"><span className={`rounded-full px-3 py-1 text-[11px] font-bold ${index === 1 ? "bg-violet-500/10 text-violet-700" : "bg-teal-500/10 text-teal-700"}`}>{program.tag}</span><h3 className="font-display mt-5 text-xl font-semibold text-fg">{program.title}</h3><p className="mt-2 text-sm leading-7 text-muted">{program.detail}</p><ArrowRight className="mt-6 h-4 w-4 text-violet-600 transition-transform group-hover:translate-x-1" /></div>)}</div></div></section>

      <section className="container-aptrive grid gap-12 py-16 md:grid-cols-[0.9fr_1.1fr] md:py-24"><SectionHeader eyebrow="Admission roadmap" title="A focused path from interest to application." /><div className="space-y-4">{experience.roadmap.map((step, index) => <div key={step.title} className="relative rounded-[1.5rem] border border-white/80 bg-white/72 p-5 pl-12 shadow-sm backdrop-blur-xl"><div className="absolute -left-3 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-teal-500 text-sm font-bold text-white shadow-lg">{index + 1}</div><h3 className="font-display text-lg font-semibold text-fg">{step.title}</h3><p className="mt-2 text-sm leading-7 text-muted">{step.body}</p></div>)}</div></section>

      <section className="bg-[#f6f9ff] py-16 md:py-24"><div className="container-aptrive grid gap-8 lg:grid-cols-3"><div className="lg:col-span-2"><SectionHeader eyebrow="Merit trends" title="Read the curve before choosing your next move." /><div className="mt-8 rounded-[1.5rem] border border-white/80 bg-white/75 p-6 shadow-[0_18px_50px_rgba(62,72,130,0.07)]"><div className="flex h-56 items-end gap-4" role="img" aria-label={`${university.name} sample merit trend chart`}>{experience.merit.map((point) => <div key={point.year} className="flex flex-1 flex-col items-center gap-3"><div className="w-full rounded-t-2xl bg-gradient-to-t from-violet-600 via-blue-500 to-teal-300" style={{ height: `${point.value * 2}px` }} /><span className="text-xs font-semibold text-muted">{point.year}</span></div>)}</div></div></div><div className="rounded-[1.5rem] border border-white/80 bg-white/75 p-6 shadow-[0_18px_50px_rgba(62,72,130,0.07)]"><LineChart className="h-7 w-7 text-violet-600" /><h3 className="font-display mt-5 text-xl font-semibold text-fg">AI prediction</h3><p className="mt-2 text-sm leading-7 text-muted">Aptrive uses your practice trend, aggregate, and target program to recommend whether to revise, retake, or apply.</p></div></div></section>

      <section className="container-aptrive py-16 md:py-24"><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">{experience.fees.map((fee) => <div key={fee.title} className="rounded-[1.5rem] border border-white/80 bg-white/72 p-6 shadow-sm"><CalendarCheck className="h-6 w-6 text-teal-600" /><div className="font-display mt-5 text-2xl font-bold text-fg">{fee.value}</div><h3 className="mt-2 font-semibold text-fg">{fee.title}</h3><p className="mt-2 text-sm leading-7 text-muted">{fee.detail}</p></div>)}{experience.careers.map((career) => <div key={career.label} className="rounded-[1.5rem] border border-white/80 bg-white/72 p-6 shadow-sm"><GraduationCap className="h-6 w-6 text-violet-600" /><div className="font-display mt-5 text-2xl font-bold text-fg">{career.value}</div><p className="mt-2 text-sm text-muted">{career.label}</p></div>)}</div></section>

      <section className="bg-gradient-to-b from-[#f6f9ff] to-white py-16 md:py-24"><div className="container-aptrive grid gap-8 lg:grid-cols-3"><div><SectionHeader eyebrow="AI preparation hub" title="Convert ambition into a weekly system." /></div>{[...experience.prep, ...experience.campus].map((item, index) => <div key={item.title} className="rounded-[1.5rem] border border-white/80 bg-white/75 p-6 shadow-sm backdrop-blur-xl"><BookOpenCheck className={`h-6 w-6 ${index % 2 ? "text-violet-600" : "text-teal-600"}`} /><h3 className="font-display mt-5 text-xl font-semibold text-fg">{item.title}</h3><p className="mt-2 text-sm leading-7 text-muted">{item.body}</p></div>)}</div></section>

      <section className="container-aptrive py-16 md:py-24"><div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"><SectionHeader eyebrow="Student stories and FAQ" title="Make the decision with clarity." /><div className="space-y-4">{experience.stories.map((story) => <div key={story.name} className="rounded-[1.5rem] border border-white/80 bg-white/72 p-5 shadow-sm"><p className="text-sm leading-7 text-muted">{story.body}</p><p className="mt-3 text-sm font-semibold text-fg">{story.name}</p></div>)}{experience.faq.map((item) => <details key={item.q} className="group rounded-[1.5rem] border border-white/80 bg-white/75 p-5 shadow-sm"><summary className="cursor-pointer font-display text-lg font-semibold text-fg">{item.q}</summary><p className="mt-3 text-sm leading-7 text-muted">{item.a}</p></details>)}</div></div></section>

      <section className={`bg-gradient-to-br ${identity.gradient} py-16 text-white md:py-24`}><div className="container-aptrive flex flex-col justify-between gap-8 md:flex-row md:items-center"><div><div className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/65">Final step</div><h2 className="font-display mt-3 text-3xl font-bold md:text-5xl">Start your {university.name} plan today.</h2></div><div className="mobile-stack-actions flex flex-wrap gap-3 sm:flex-row"><Link href="/signup" className="pressable rounded-xl bg-white px-7 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5">Start preparation</Link><Link href={`/tools/calculator?uni=${university.id}`} className="pressable rounded-xl border border-white/20 bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/15">Calculate merit</Link></div></div></section>
    </main>
  );
}
