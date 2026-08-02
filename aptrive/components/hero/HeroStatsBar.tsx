import { Star, Sparkles, BadgeCheck, Box, Users } from "lucide-react";
import { formatStat, siteStats } from "@/lib/site-stats";
import { universities } from "@/lib/universities";

const stats = [
  {
    icon: Star,
    value: `${siteStats.activeStudents}+`,
    label: "Active Students",
    tint: "bg-cyan-500/10 text-cyan-600",
  },
  {
    icon: Sparkles,
    value: "95%",
    label: "Success Rate",
    tint: "bg-violet-500/10 text-violet-600",
  },
  {
    icon: BadgeCheck,
    value: `${universities.length * 25}+`,
    label: "Universities",
    tint: "bg-rose-500/10 text-rose-500",
  },
  {
    icon: Box,
    value: `${formatStat(siteStats.totalQuestions)}+`,
    label: "Questions Solved",
    tint: "bg-fuchsia-500/10 text-fuchsia-500",
  },
  {
    icon: Users,
    value: "4.9/5",
    label: "Student Rating",
    tint: "bg-indigo-500/10 text-indigo-500",
  },
];

export default function HeroStatsBar() {
  return (
    <div className="rounded-[1.35rem] border border-white/75 bg-white/64 px-6 py-8 shadow-[0_22px_70px_-36px_rgba(15,23,42,0.28)] backdrop-blur-2xl sm:px-10">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-5 md:gap-0">
        {stats.map(({ icon: Icon, value, label, tint }) => (
          <div key={label} className="flex items-center gap-4 md:border-r md:border-black/[0.06] md:px-8 md:last:border-r-0">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tint}`}>
              <Icon strokeWidth={1.75} className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-2xl font-semibold text-neutral-900 md:text-[28px]">
                {value}
              </div>
              <div className="text-xs text-neutral-500">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
