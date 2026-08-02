"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Calculator, 
  Atom, 
  FlaskConical, 
  BookOpen, 
  Brain, 
  Binary, 
  Dna, 
  Globe, 
  Clock, 
  BookMarked,
  ArrowRight,
  type LucideIcon
} from "lucide-react";
import type { LibraryCategory } from "@/lib/library-data";

type ThemeConfig = {
  icon: LucideIcon;
  primary: string;
  secondary: string;
  surface: string;
  border: string;
  gradient: string;
};

const themes: Record<string, ThemeConfig> = {
  "Mathematics": {
    icon: Calculator,
    primary: "text-blue-500",
    secondary: "text-blue-400",
    surface: "bg-blue-500/10",
    border: "border-blue-500/20",
    gradient: "from-blue-500/20 to-transparent",
  },
  "Physics": {
    icon: Atom,
    primary: "text-purple-500",
    secondary: "text-purple-400",
    surface: "bg-purple-500/10",
    border: "border-purple-500/20",
    gradient: "from-purple-500/20 to-transparent",
  },
  "Chemistry": {
    icon: FlaskConical,
    primary: "text-emerald-500",
    secondary: "text-emerald-400",
    surface: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    gradient: "from-emerald-500/20 to-transparent",
  },
  "English": {
    icon: BookOpen,
    primary: "text-orange-500",
    secondary: "text-orange-400",
    surface: "bg-orange-500/10",
    border: "border-orange-500/20",
    gradient: "from-orange-500/20 to-transparent",
  },
  "Intelligence / IQ": {
    icon: Brain,
    primary: "text-indigo-500",
    secondary: "text-indigo-400",
    surface: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    gradient: "from-indigo-500/20 to-transparent",
  },
  "Computer Science": {
    icon: Binary,
    primary: "text-cyan-500",
    secondary: "text-cyan-400",
    surface: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    gradient: "from-cyan-500/20 to-transparent",
  },
  "Biology": {
    icon: Dna,
    primary: "text-lime-500",
    secondary: "text-lime-400",
    surface: "bg-lime-500/10",
    border: "border-lime-500/20",
    gradient: "from-lime-500/20 to-transparent",
  },
  "General Knowledge": {
    icon: Globe,
    primary: "text-amber-500",
    secondary: "text-amber-400",
    surface: "bg-amber-500/10",
    border: "border-amber-500/20",
    gradient: "from-amber-500/20 to-transparent",
  },
};

const defaultTheme: ThemeConfig = {
  icon: BookMarked,
  primary: "text-teal",
  secondary: "text-teal-dim",
  surface: "bg-teal/10",
  border: "border-teal/20",
  gradient: "from-teal/20 to-transparent",
};

export default function CategoryCard({
  category,
  index = 0,
}: {
  category: LibraryCategory;
  index?: number;
}) {
  const theme = themes[category.name] || defaultTheme;
  const Icon = theme.icon;

  if (category.comingSoon) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="group premium-shell relative flex flex-col overflow-hidden rounded-[1.35rem] p-6 opacity-70 transition-colors"
      >
        <div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-overlay pointer-events-none" />
        
        <div className="flex items-start justify-between relative z-10">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${theme.surface} ${theme.border} border`}>
            <Icon className={`h-6 w-6 ${theme.primary}`} strokeWidth={1.5} />
          </div>
          <span className="rounded-full border border-line bg-panel-2 px-2.5 py-1 font-mono-data text-[10px] uppercase tracking-widest text-muted-2 shadow-sm">
            Coming soon
          </span>
        </div>

        <div className="mt-5 relative z-10">
          <h3 className="font-display text-xl font-semibold text-fg">
            {category.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
            {category.description}
          </p>
        </div>
      </motion.div>
    );
  }

  const { easy, medium, hard } = category.difficultyDistribution;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/library/${category.slug}`}
        className={`group premium-shell relative flex h-full flex-col overflow-hidden rounded-[1.35rem] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-blue-300/60 hover:shadow-xl hover:shadow-blue-950/10`}
      >
        {/* Soft Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none`} />

        {/* Header */}
        <div className="flex items-start justify-between relative z-10">
          <motion.div 
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${theme.surface} ${theme.border} border shadow-sm backdrop-blur-sm transition-transform duration-500 group-hover:scale-110`}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
          >
            <Icon className={`h-7 w-7 ${theme.primary} drop-shadow-sm`} strokeWidth={1.5} />
          </motion.div>
          
          <div className="flex flex-col items-end gap-1">
            <span className="rounded-full bg-white/70 px-3 py-1 font-mono-data text-[10px] font-bold uppercase tracking-[0.12em] text-muted shadow-sm">
              {category.practiceSets} SETS
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 flex-1 relative z-10">
          <h3 className="font-display text-xl font-semibold text-fg transition-colors group-hover:text-fg">
            {category.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
            {category.description}
          </p>
        </div>

        {/* Stats row */}
        <div className="mt-6 flex items-center gap-3 relative z-10">
          <div className="flex items-center gap-1.5 rounded-xl border border-line/50 bg-white/70 px-2.5 py-1.5 shadow-sm">
            <BookMarked className="h-3.5 w-3.5 text-muted-2" />
            <span className="font-mono-data text-xs font-medium text-fg">
              {category.totalQuestions.toLocaleString()} <span className="text-muted-2 font-sans text-[10px] uppercase tracking-wider">Qs</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl border border-line/50 bg-white/70 px-2.5 py-1.5 shadow-sm">
            <Clock className="h-3.5 w-3.5 text-muted-2" />
            <span className="font-mono-data text-xs font-medium text-fg">
              {category.estimatedStudyTime}
            </span>
          </div>
        </div>

        {/* Difficulty Bar */}
        <div className="mt-5 relative z-10">
          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-200/70 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${easy}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="bg-teal" 
            />
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${medium}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="bg-gold" 
            />
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${hard}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              className="bg-red-400" 
            />
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-6 flex items-center justify-between border-t border-line/40 pt-4 relative z-10">
          <span className={`text-sm font-semibold ${theme.primary} transition-colors`}>
            Start Learning
          </span>
          <ArrowRight className={`h-4 w-4 ${theme.primary} transition-transform duration-300 group-hover:translate-x-1`} />
        </div>
      </Link>
    </motion.div>
  );
}
