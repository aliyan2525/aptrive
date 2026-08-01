import { Users, BookOpenCheck, TrendingUp, GraduationCap } from "lucide-react";
import { formatStat, siteStats } from "@/lib/site-stats";
import { universities } from "@/lib/universities";

const stats = [
  {
    icon: Users,
    value: `${siteStats.activeStudents}+`,
    label: "Active Students",
    tint: "bg-indigo-500/10 text-indigo-600",
  },
  {
    icon: BookOpenCheck,
    value: `${formatStat(siteStats.totalQuestions)}+`,
    label: "Practice Questions",
    tint: "bg-teal-500/10 text-teal-600",
  },
  {
    icon: TrendingUp,
    value: `${siteStats.satisfactionRate}%`,
    label: "Report Improved Accuracy",
    tint: "bg-violet-500/10 text-violet-600",
  },
  {
    icon: GraduationCap,
    value: `${universities.length}+`,
    label: "Top University Pathways",
    tint: "bg-amber-500/10 text-amber-600",
  },
];

export default function HeroStatsBar() {
  return (
    <div className="rounded-3xl border border-black/[0.06] bg-white/70 px-6 py-8 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] backdrop-blur-sm sm:px-10">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
        {stats.map(({ icon: Icon, value, label, tint }) => (
          <div key={label} className="flex items-center gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tint}`}>
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
