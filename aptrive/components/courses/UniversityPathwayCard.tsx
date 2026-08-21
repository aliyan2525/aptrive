"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, GraduationCap } from "lucide-react";
import UniversityLogo from "@/components/UniversityLogo";
import { getUniversityExperienceSlug } from "@/lib/university-experiences";
import type { University } from "@/lib/universities";

type CardTheme = {
  gradient: string;
  badgeBg: string;
  badgeText: string;
  shadow: string;
};

const themes: Record<string, CardTheme> = {
  nust: {
    gradient: "from-blue-500/20 via-blue-500/10 to-transparent",
    badgeBg: "bg-blue-500/15 border-blue-500/20",
    badgeText: "text-blue-700",
    shadow: "hover:shadow-blue-500/20 hover:border-blue-500/35",
  },
  fast: {
    gradient: "from-teal-500/20 via-teal-500/10 to-transparent",
    badgeBg: "bg-teal-500/15 border-teal-500/20",
    badgeText: "text-teal-700",
    shadow: "hover:shadow-teal-500/20 hover:border-teal-500/35",
  },
  giki: {
    gradient: "from-violet-500/20 via-violet-500/10 to-transparent",
    badgeBg: "bg-violet-500/15 border-violet-500/20",
    badgeText: "text-violet-700",
    shadow: "hover:shadow-violet-500/20 hover:border-violet-500/35",
  },
  pieas: {
    gradient: "from-indigo-500/20 via-indigo-500/10 to-transparent",
    badgeBg: "bg-indigo-500/15 border-indigo-500/20",
    badgeText: "text-indigo-700",
    shadow: "hover:shadow-indigo-500/20 hover:border-indigo-500/35",
  },
  comsats: {
    gradient: "from-sky-500/20 via-sky-500/10 to-transparent",
    badgeBg: "bg-sky-500/15 border-sky-500/20",
    badgeText: "text-sky-700",
    shadow: "hover:shadow-sky-500/20 hover:border-sky-500/35",
  },
  ned: {
    gradient: "from-fuchsia-500/20 via-fuchsia-500/10 to-transparent",
    badgeBg: "bg-fuchsia-500/15 border-fuchsia-500/20",
    badgeText: "text-fuchsia-700",
    shadow: "hover:shadow-fuchsia-500/20 hover:border-fuchsia-500/35",
  },
  "uet-lahore": {
    gradient: "from-cyan-500/20 via-cyan-500/10 to-transparent",
    badgeBg: "bg-cyan-500/15 border-cyan-500/20",
    badgeText: "text-cyan-700",
    shadow: "hover:shadow-cyan-500/20 hover:border-cyan-500/35",
  },
  air: {
    gradient: "from-sky-500/20 via-sky-500/10 to-transparent",
    badgeBg: "bg-sky-500/15 border-sky-500/20",
    badgeText: "text-sky-700",
    shadow: "hover:shadow-sky-500/20 hover:border-sky-500/35",
  },
  bahria: {
    gradient: "from-blue-500/20 via-blue-500/10 to-transparent",
    badgeBg: "bg-blue-500/15 border-blue-500/20",
    badgeText: "text-blue-700",
    shadow: "hover:shadow-blue-500/20 hover:border-blue-500/35",
  },
  ist: {
    gradient: "from-teal-500/20 via-teal-500/10 to-transparent",
    badgeBg: "bg-teal-500/15 border-teal-500/20",
    badgeText: "text-teal-700",
    shadow: "hover:shadow-teal-500/20 hover:border-teal-500/35",
  },
  umt: {
    gradient: "from-violet-500/20 via-violet-500/10 to-transparent",
    badgeBg: "bg-violet-500/15 border-violet-500/20",
    badgeText: "text-violet-700",
    shadow: "hover:shadow-violet-500/20 hover:border-violet-500/35",
  },
  ucp: {
    gradient: "from-indigo-500/20 via-indigo-500/10 to-transparent",
    badgeBg: "bg-indigo-500/15 border-indigo-500/20",
    badgeText: "text-indigo-700",
    shadow: "hover:shadow-indigo-500/20 hover:border-indigo-500/35",
  },
};

const fallbackTheme: CardTheme = {
  gradient: "from-slate-500/15 via-blue-500/10 to-transparent",
  badgeBg: "bg-slate-500/10 border-slate-500/20",
  badgeText: "text-slate-700",
  shadow: "hover:shadow-slate-500/20 hover:border-slate-500/35",
};

export default function UniversityPathwayCard({ university, index }: { university: University; index: number }) {
  const reducedMotion = useReducedMotion();
  const theme = themes[university.id] ?? fallbackTheme;
  const slug = getUniversityExperienceSlug(university.id);

  return (
    <motion.div
      initial={reducedMotion === false ? { opacity: 0, y: 18 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay: Math.min(index, 8) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link
        href={`/universities/${slug}`}
        className={`group relative flex h-full min-h-[226px] flex-col overflow-hidden rounded-[1.55rem] border border-white/75 bg-white/72 p-5 shadow-[0_12px_34px_rgba(62,72,130,0.08)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_22px_55px_rgba(62,72,130,0.16)] ${theme.shadow}`}
      >
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-70 transition-opacity duration-500 group-hover:opacity-100`} />
        <div className="pointer-events-none absolute -bottom-20 -right-16 h-48 w-48 rounded-full bg-white/45 blur-3xl transition-transform duration-700 group-hover:scale-125" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="shrink-0 rounded-2xl border border-white/90 bg-white/85 p-2 shadow-[0_5px_16px_rgba(62,72,130,0.1)]">
              <UniversityLogo university={university.id} displayName={university.name} size={48} />
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-display text-xl font-bold tracking-[-0.03em] text-fg transition-colors group-hover:text-violet-700 sm:text-2xl">
                {university.name}
              </h3>
              <p className="mt-0.5 truncate text-xs font-medium text-muted">{university.location}</p>
            </div>
          </div>

          {university.verified && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-teal-500/20 bg-teal-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-teal-700">
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
              Verified
            </span>
          )}
        </div>

        <div className="relative z-10 mt-auto pt-6">
          <div className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 ${theme.badgeBg} backdrop-blur-md`}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/90 text-violet-600 shadow-sm">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="text-xs font-medium leading-5 text-fg">{formatFormula(university.formulaText, theme.badgeText)}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function formatFormula(formula: string, textClass: string) {
  return formula.split(/(?<=\s|\b)(\d+%)(?=\s|\b|$)/).map((part, index) => {
    if (/^\d+%$/.test(part)) {
      return (
        <span key={index} className={`font-bold ${textClass}`}>
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}
