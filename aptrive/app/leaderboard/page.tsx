import type { Metadata } from "next";
import Podium3DClient from "@/components/leaderboard/scene/Podium3DClient";
import AnimatedStat from "@/components/leaderboard/AnimatedStat";

export const metadata: Metadata = {
  title: "Rankings - Aptrive",
  description: "Global, university, subject, weekly, monthly, and all-time student rankings.",
};

const students = [
  { rank: 1, name: "Ayesha Khan", university: "NUST", accuracy: 94, xp: 18420, streak: 28 },
  { rank: 2, name: "Hamza Malik", university: "FAST", accuracy: 91, xp: 17110, streak: 21 },
  { rank: 3, name: "Zara Ahmed", university: "GIKI", accuracy: 89, xp: 16270, streak: 18 },
  { rank: 4, name: "Bilal Raza", university: "PIEAS", accuracy: 87, xp: 15190, streak: 14 },
  { rank: 5, name: "Maham Iqbal", university: "COMSATS", accuracy: 85, xp: 14480, streak: 12 },
];

const tabs = ["Global", "Friends", "University", "Subject", "Weekly", "Monthly", "All-time"];

export default function LeaderboardPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-graphite px-6 py-12">
      <div className="container-aptrive">
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.2fr] lg:items-end">
          <div>
            <div className="eyebrow">Rankings</div>
            <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
              Performance rankings built for serious preparation.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
              Rankings combine accuracy, XP, consistency, questions solved, and mock performance. The model is designed to shard by time window, subject, university, and cohort as Aptrive scales.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Tracked signals" value={7} />
            <Stat label="Ranking views" value={7} />
            <Stat label="Scale target" value={1} suffix="M+" />
          </div>
        </section>

        <div className="mt-10">
          <Podium3DClient />
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`whitespace-nowrap rounded-sm border px-3 py-2 text-xs font-semibold ${index === 0 ? "border-teal bg-teal text-graphite" : "border-line-strong text-muted hover:text-fg"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <section className="mt-6 overflow-hidden rounded-md border border-line bg-panel">
          <div className="grid grid-cols-[64px_1fr_120px_100px_100px] gap-4 border-b border-line px-5 py-3 text-xs uppercase tracking-wide text-muted-2 max-md:hidden">
            <span>Rank</span>
            <span>Student</span>
            <span>Target</span>
            <span>Accuracy</span>
            <span>XP</span>
          </div>
          {students.map((student) => (
            <div key={student.rank} className="grid gap-4 border-b border-line px-5 py-4 last:border-0 md:grid-cols-[64px_1fr_120px_100px_100px] md:items-center">
              <div className="font-mono-data text-xl font-semibold text-teal">#{student.rank}</div>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full border border-teal/30 bg-teal-dim font-display text-sm font-semibold text-teal">
                  {student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="font-medium text-fg">{student.name}</p>
                  <p className="text-xs text-muted">{student.streak} day streak</p>
                </div>
              </div>
              <p className="text-sm text-muted">{student.university}</p>
              <p className="font-mono-data text-sm text-fg">
                <AnimatedStat value={student.accuracy} suffix="%" />
              </p>
              <p className="font-mono-data text-sm text-gold">
                <AnimatedStat value={student.xp} />
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-md border border-line bg-panel p-4">
      <p className="text-xs uppercase tracking-wide text-muted-2">{label}</p>
      <p className="font-display mt-2 text-2xl font-semibold text-fg">
        <AnimatedStat value={value} suffix={suffix} />
      </p>
    </div>
  );
}
