import Link from "next/link";
import { ArrowUpRight, BarChart3, Brain, Clock3, Flame, Gauge, LineChart, Target, Zap } from "lucide-react";

const metrics = [
  { label: "Learning Velocity", value: "+18%", meta: "Progress vs last week", icon: ArrowUpRight, color: "text-emerald-600 bg-emerald-100" },
  { label: "Study Time", value: "12.5h", meta: "This week", icon: Clock3, color: "text-violet-600 bg-violet-100" },
  { label: "Accuracy", value: "85%", meta: "Tasks completed", icon: Gauge, color: "text-blue-600 bg-blue-100" },
  { label: "Focus Streak", value: "7", meta: "Days in a row", icon: Flame, color: "text-orange-600 bg-orange-100" },
];

const subjects = [
  { label: "Mathematics", value: 88, color: "#5b36ff" },
  { label: "Physics", value: 72, color: "#10b981" },
  { label: "Chemistry", value: 64, color: "#f97316" },
  { label: "English", value: 81, color: "#2563eb" },
];

export default function AnalyticsPage() {
  return (
    <main className="mx-auto max-w-[96rem] space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#07102e]">Analytics</h1>
          <p className="mt-2 text-sm font-medium text-[#53618d]">Performance intelligence across practice, accuracy, pace, and readiness.</p>
        </div>
        <Link href="/practice" className="pressable inline-flex h-12 items-center justify-center gap-2 rounded-[0.9rem] bg-gradient-to-r from-blue-600 to-violet-600 px-6 text-sm font-bold text-white shadow-[0_18px_38px_rgba(88,75,230,0.24)]">
          Start Practice
          <Zap className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.label} className="rounded-[1.2rem] border border-[#e4e9f6] bg-white p-6 shadow-[0_18px_45px_rgba(36,52,104,0.06)]">
              <div className="flex items-center gap-4">
                <span className={`grid h-12 w-12 place-items-center rounded-[1rem] ${metric.color}`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#657199]">{metric.label}</p>
                  <p className="font-display mt-1 text-3xl font-bold text-[#07102e]">{metric.value}</p>
                  <p className="text-sm text-[#53618d]">{metric.meta}</p>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(22rem,0.9fr)]">
        <div className="rounded-[1.35rem] border border-[#e4e9f6] bg-white p-6 shadow-[0_24px_70px_rgba(36,52,104,0.07)]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-[#07102e]">Performance Trends</h2>
              <p className="mt-1 text-sm text-[#53618d]">Weekly accuracy and practice volume</p>
            </div>
            <span className="rounded-[0.75rem] border border-[#dfe5f4] px-3 py-2 text-xs font-bold text-blue-700">Last 6 weeks</span>
          </div>
          <svg viewBox="0 0 100 46" className="mt-8 h-80 w-full overflow-visible" role="img" aria-label="Analytics trend chart">
            {[10, 20, 30, 40].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="#edf1fa" strokeWidth="0.35" />)}
            <path d="M0 32 C12 30 16 25 26 26 C38 27 42 18 52 17 C64 16 67 22 76 19 C86 15 92 9 100 7" fill="none" stroke="#5b36ff" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M0 32 C12 30 16 25 26 26 C38 27 42 18 52 17 C64 16 67 22 76 19 C86 15 92 9 100 7 L100 46 L0 46 Z" fill="url(#analyticsArea)" />
            {[0, 26, 52, 76, 100].map((x, index) => <circle key={x} cx={x} cy={[32, 26, 17, 19, 7][index]} r="1.8" fill="#5b36ff" />)}
            <defs>
              <linearGradient id="analyticsArea" x1="0" x2="0" y1="0" y2="1">
                <stop stopColor="#5b36ff" stopOpacity="0.24" />
                <stop offset="1" stopColor="#5b36ff" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.35rem] border border-[#e4e9f6] bg-white p-6 shadow-[0_24px_70px_rgba(36,52,104,0.07)]">
            <h2 className="font-display text-xl font-bold text-[#07102e]">Subject Mastery</h2>
            <p className="mt-1 text-sm text-[#53618d]">Current readiness by subject</p>
            <div className="mt-6 space-y-5">
              {subjects.map((subject) => (
                <div key={subject.label}>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-[#101936]">{subject.label}</span>
                    <span className="text-[#53618d]">{subject.value}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e9eef9]">
                    <div className="h-full rounded-full" style={{ width: `${subject.value}%`, backgroundColor: subject.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-[#e4e9f6] bg-white p-6 shadow-[0_24px_70px_rgba(36,52,104,0.07)]">
            <h2 className="font-display text-xl font-bold text-[#07102e]">AI Insights</h2>
            <div className="mt-5 space-y-3">
              <Insight icon={Brain} title="Mathematics is accelerating" body="Your algebra accuracy improved by 12% over the last six sessions." />
              <Insight icon={Target} title="Physics needs precision" body="Revise formulas before attempting the next timed mock." />
              <Insight icon={LineChart} title="Readiness is trending up" body="Two more consistent sessions should lift your blended score meaningfully." />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[1.35rem] border border-[#e4e9f6] bg-white p-6 shadow-[0_24px_70px_rgba(36,52,104,0.07)]">
        <h2 className="font-display text-xl font-bold text-[#07102e]">Practice Volume</h2>
        <div className="mt-6 grid h-40 grid-cols-14 items-end gap-2">
          {[28, 42, 35, 64, 52, 76, 69, 88, 73, 91, 67, 80, 94, 86].map((height, index) => (
            <span key={index} className="rounded-t-[0.6rem] bg-gradient-to-t from-blue-600 to-violet-500" style={{ height: `${height}%` }} />
          ))}
        </div>
      </section>
    </main>
  );
}

function Insight({ icon: Icon, title, body }: { icon: typeof BarChart3; title: string; body: string }) {
  return (
    <div className="flex gap-3 rounded-[1rem] bg-[#fafbff] p-4">
      <span className="grid h-10 w-10 place-items-center rounded-[0.85rem] bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <p className="font-bold text-[#101936]">{title}</p>
        <p className="mt-1 text-sm leading-6 text-[#53618d]">{body}</p>
      </div>
    </div>
  );
}
