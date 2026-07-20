import { formatStat, siteStats } from "@/lib/site-stats";

const items = [
  {
    value: `${formatStat(siteStats.totalQuestions)}+`,
    label: "Practice questions",
  },
  {
    value: `${siteStats.activeStudents}+`,
    label: "Active students",
  },
  {
    value: `${siteStats.satisfactionRate}%`,
    label: "Report improved accuracy",
  },
  {
    value: `${siteStats.subjects}`,
    label: "Subjects covered",
  },
];

export default function SocialProofBar() {
  return (
    <section
      aria-label="Platform statistics"
      className="border-y border-line bg-panel"
    >
      <div className="container-aptrive grid grid-cols-2 gap-6 py-8 md:grid-cols-4 md:gap-8">
        {items.map((item) => (
          <div key={item.label} className="text-center md:text-left">
            <div className="font-mono-data text-2xl font-medium text-teal md:text-3xl">
              {item.value}
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.12em] text-muted">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
