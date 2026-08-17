import Link from "next/link";
import { BarChart3, CalendarDays, Check, Clock3, Flame, MoreVertical, Plus, ShieldCheck, Target, Trophy } from "lucide-react";

const goals = [
  { title: "FAST-NUCES Aggregate Target", meta: "Achieve 85%+ aggregate for top CS programs", value: 75, due: "Due 30 Jun, 2026", color: "#6f45ff", icon: Target },
  { title: "Complete Physics Syllabus", meta: "Finish all physics topics and practice", value: 60, due: "Due 15 Jun, 2026", color: "#10b981", icon: BarChart3 },
  { title: "Score 150+ in Full Mock Test", meta: "Achieve 150+ in FAST-NUCES full mock", value: 40, due: "Due 20 May, 2026", color: "#f97316", icon: Trophy },
  { title: "Daily Study Consistency", meta: "Study at least 2 hours daily", value: 100, due: "Completed", color: "#2563eb", icon: Clock3 },
];

export default function GoalsPage() {
  return (
    <main className="goals-aurora mx-auto max-w-[96rem] space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-neutral-950">Goals</h1>
          <p className="mt-2 text-sm leading-6 text-neutral-600">Set goals, stay consistent, and achieve your best.</p>
        </div>
        <Link href="/onboarding" className="pressable inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-700 px-6 text-sm font-bold text-white shadow-[0_14px_32px_rgba(111,69,255,.2)] transition hover:-translate-y-0.5 hover:bg-violet-800">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create New Goal
        </Link>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Goals Created" value="4" meta="Active goals" icon={Target} tone="emerald" />
        <StatCard label="Overall Progress" value="68%" meta="Across all goals" ring={68} />
        <StatCard label="Daily Streak" value="7" meta="Days in a row" icon={Flame} tone="orange" />
        <StatCard label="Goals Achieved" value="2" meta="This month" icon={ShieldCheck} tone="emerald" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(22rem,0.9fr)]">
        <div className="premium-shell rounded-[1.5rem] border border-white/80 bg-white/80 p-6 shadow-[0_20px_60px_rgba(46,39,97,.07)] backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-[#07102e]">Your Goals</h2>
          </div>
          <div className="mt-6 flex gap-8 border-b border-[#e7ecf8] text-sm font-bold text-[#657199]">
            {["All Goals", "Active", "In Progress", "Completed", "Archived"].map((tab, index) => (
              <span key={tab} className={`pb-3 ${index === 0 ? "border-b-2 border-blue-600 text-blue-600" : ""}`}>{tab}</span>
            ))}
          </div>
          <div className="mt-5 space-y-3">
            {goals.map((goal) => {
              const Icon = goal.icon;
              return (
                <article key={goal.title} className="grid gap-4 rounded-2xl border border-transparent p-3 transition hover:border-violet-200 hover:bg-violet-50/45 sm:grid-cols-[3rem_minmax(0,1fr)_5rem_2rem] sm:items-center">
                  <span className="grid h-12 w-12 place-items-center rounded-[1rem]" style={{ backgroundColor: `${goal.color}18`, color: goal.color }}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-[#101936]">{goal.title}</p>
                    <p className="mt-1 text-sm text-[#53618d]">{goal.meta}</p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e9eef9]">
                      <div className="h-full rounded-full" style={{ width: `${goal.value}%`, backgroundColor: goal.color }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl font-bold text-[#07102e]">{goal.value}%</p>
                    <p className={`mt-1 text-xs font-bold ${goal.value === 100 ? "text-emerald-600" : "text-[#53618d]"}`}>{goal.due}</p>
                  </div>
                  <button className="grid h-9 w-9 place-items-center rounded-full text-[#4d5d91] hover:bg-[#eef3ff]" aria-label={`More options for ${goal.title}`}>
                    <MoreVertical className="h-4 w-4" aria-hidden="true" />
                  </button>
                </article>
              );
            })}
          </div>
          <Link href="/practice" className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white text-sm font-bold text-violet-700 transition hover:border-violet-300 hover:bg-violet-50/50">
            View All Goals
          </Link>
        </div>

        <div className="space-y-5">
          <CalendarCard />
          <div className="premium-shell rounded-[1.5rem] border border-white/80 bg-white/80 p-6 shadow-[0_20px_60px_rgba(46,39,97,.07)] backdrop-blur-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-[#07102e]">Recommended Goals</h2>
                <p className="mt-1 text-xs font-semibold text-[#657199]">AI-suggested goals based on your performance</p>
              </div>
              <Link href="/practice" className="text-xs font-bold text-blue-600">View All</Link>
            </div>
            <div className="mt-4 flex items-center gap-4 rounded-2xl border border-violet-100 bg-violet-50/55 p-4">
              <span className="grid h-12 w-12 place-items-center rounded-[1rem] bg-violet-100 text-violet-600">
                <BarChart3 className="h-6 w-6" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="font-bold text-[#101936]">Improve Weak Areas</p>
                <p className="text-sm text-[#53618d]">Focus on Mathematics & Chemistry</p>
              </div>
              <Link href="/practice" className="pressable ml-auto rounded-xl bg-violet-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-violet-800">Add Goal</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value, meta, icon: Icon, tone, ring }: { label: string; value: string; meta: string; icon?: typeof Target; tone?: "emerald" | "orange"; ring?: number }) {
  const bg = tone === "orange" ? "bg-orange-100 text-orange-600" : "bg-emerald-100 text-emerald-600";
  return (
    <article className="premium-shell flex items-center justify-between rounded-[1.35rem] border border-white/80 bg-white/80 p-6 shadow-[0_18px_50px_rgba(46,39,97,.06)] backdrop-blur-xl">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#657199]">{label}</p>
        <p className="font-display mt-3 text-3xl font-bold text-[#07102e]">{value}</p>
        <p className="mt-1 text-sm text-[#53618d]">{meta}</p>
      </div>
      {ring ? <div className="grid h-16 w-16 place-items-center rounded-full bg-[conic-gradient(#5b36ff_245deg,#e9eef9_0deg)]"><div className="grid h-12 w-12 place-items-center rounded-full bg-white text-sm font-bold">{ring}%</div></div> : Icon && <span className={`grid h-16 w-16 place-items-center rounded-[1.2rem] ${bg}`}><Icon className="h-8 w-8" aria-hidden="true" /></span>}
    </article>
  );
}

function CalendarCard() {
  const days = Array.from({ length: 35 }, (_, i) => i + 1);
  return (
    <div className="premium-shell rounded-[1.5rem] border border-white/80 bg-white/80 p-6 shadow-[0_20px_60px_rgba(46,39,97,.07)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-[#07102e]"><CalendarDays className="h-5 w-5" /> Goal Calendar</h2>
        <span className="text-sm font-bold text-[#53618d]">Aug 2026</span>
      </div>
      <div className="mt-6 grid grid-cols-7 gap-3 text-center text-xs font-bold text-[#657199]">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <span key={d}>{d}</span>)}
        {days.map((day) => (
          <span key={day} className={`grid h-9 place-items-center rounded-full ${day === 14 ? "bg-gradient-to-br from-blue-600 to-violet-600 text-white" : "text-[#101936]"}`}>
            {day > 31 ? day - 31 : day}
          </span>
        ))}
      </div>
      <div className="mt-6 rounded-[1rem] bg-[#f6f8ff] p-4">
        <p className="flex items-center gap-2 font-bold text-[#101936]"><Flame className="h-5 w-5 text-orange-500" /> 7 Day Streak</p>
        <div className="mt-4 grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }, (_, i) => <span key={i} className={`grid h-8 w-8 place-items-center rounded-full ${i < 6 ? "bg-emerald-500 text-white" : "border border-[#94a0bf]"}`}>{i < 6 && <Check className="h-4 w-4" />}</span>)}
        </div>
      </div>
    </div>
  );
}
