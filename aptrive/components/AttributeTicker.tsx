import { formatStat, siteStats } from "@/lib/site-stats";

const metrics = [
  "NUST NET",
  `${formatStat(siteStats.totalQuestions)}+ practice questions`,
  "Topic-level analytics",
  "Timed mock exams",
  "Updated for 2026",
  "Adaptive practice engine",
  "Merit calculator",
  "Free diagnostic",
];

export default function AttributeTicker() {
  const items = [...metrics, ...metrics];

  return (
    <div className="overflow-hidden border-y border-line bg-panel py-4">
      <div className="marquee-track flex w-max gap-10">
        {items.map((item, i) => (
          <span
            key={i}
            className="font-mono-data flex items-center gap-3 text-sm uppercase tracking-[0.12em] text-muted"
          >
            {item}
            <span className="text-teal">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
