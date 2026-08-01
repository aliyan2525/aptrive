"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, GraduationCap } from "lucide-react";
import { universities } from "@/lib/universities";
import UniversityLogo from "@/components/UniversityLogo";

const featured = ["nust", "fast", "giki", "pieas", "comsats", "ned"];

type ThemeConfig = {
  gradient: string;
  badgeBg: string;
  badgeText: string;
  shadow: string;
};

const themes: Record<string, ThemeConfig> = {
  nust: {
    gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
    badgeBg: "bg-blue-500/10",
    badgeText: "text-blue-600 dark:text-blue-400",
    shadow: "hover:shadow-blue-500/20",
  },
  fast: {
    gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    shadow: "hover:shadow-emerald-500/20",
  },
  giki: {
    gradient: "from-orange-500/10 via-orange-500/5 to-transparent",
    badgeBg: "bg-orange-500/10",
    badgeText: "text-orange-600 dark:text-orange-400",
    shadow: "hover:shadow-orange-500/20",
  },
  pieas: {
    gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
    badgeBg: "bg-purple-500/10",
    badgeText: "text-purple-600 dark:text-purple-400",
    shadow: "hover:shadow-purple-500/20",
  },
  comsats: {
    gradient: "from-cyan-500/10 via-cyan-500/5 to-transparent",
    badgeBg: "bg-cyan-500/10",
    badgeText: "text-cyan-600 dark:text-cyan-400",
    shadow: "hover:shadow-cyan-500/20",
  },
  ned: {
    gradient: "from-rose-500/10 via-rose-500/5 to-transparent",
    badgeBg: "bg-rose-500/10",
    badgeText: "text-rose-600 dark:text-rose-400",
    shadow: "hover:shadow-rose-500/20",
  },
};

const defaultTheme: ThemeConfig = {
  gradient: "from-teal/10 via-teal/5 to-transparent",
  badgeBg: "bg-teal/10",
  badgeText: "text-teal",
  shadow: "hover:shadow-teal/20",
};

function formatFormula(formula: string, textClass: string) {
  // Highlights percentages like "10%" in the formula text
  return formula.split(/(?<=\s|\b)(\d+%)(?=\s|\b|$)/).map((part, i) => {
    if (/^\d+%$/.test(part)) {
      return (
        <span key={i} className={`font-bold ${textClass}`}>
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function PopularUniversities() {
  const items = featured
    .map((id) => universities.find((u) => u.id === id))
    .filter((u): u is (typeof universities)[number] => Boolean(u));

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((uni, index) => {
        const theme = themes[uni.id] || defaultTheme;

        return (
          <motion.div
            key={uni.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative"
          >
            <Link
              href="/calculator"
              className={`relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:border-line-strong ${theme.shadow}`}
            >
              {/* Animated Background Gradient */}
              <div className={`absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t ${theme.gradient} opacity-60 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none`} />

              {/* Decorative graphic layer (simulating the beautiful backgrounds) */}
              <div className="absolute -bottom-8 -right-8 h-48 w-48 rounded-full bg-white/5 blur-3xl mix-blend-overlay pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full p-6 pb-20">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <UniversityLogo university={uni.id} displayName={uni.name} size={64} />
                    <div>
                      <h3 className="font-display text-2xl font-bold text-fg tracking-tight group-hover:text-fg">
                        {uni.name}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-muted-2">
                        {uni.location}
                      </p>
                    </div>
                  </div>

                  {uni.verified && (
                    <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" />
                      <span className="font-mono-data text-[9px] uppercase tracking-wider font-bold">
                        Verified
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Floating Formula Badge */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className={`flex items-center gap-3 rounded-xl border border-white/20 shadow-sm backdrop-blur-md px-4 py-3 transition-colors duration-300 ${theme.badgeBg}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm`}>
                    <GraduationCap className={`h-4 w-4 ${theme.badgeText}`} />
                  </div>
                  <p className="font-mono-data text-xs leading-relaxed text-fg">
                    {formatFormula(uni.formulaText, theme.badgeText)}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
