"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  Clock3,
  Flame,
  Gauge,
  LineChart,
  ListChecks,
  Medal,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { getDashboardData } from "@/lib/dashboard-data";
import UniversityLogo from "@/components/UniversityLogo";

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

type CalendarDay = {
  day: number;
  active: boolean;
  isToday: boolean;
};

const weekdayLabels = ["S", "M", "T", "W", "T", "F", "S"];

const fallbackStrong = [
  { topic: "Algebra", mastery_percent: 74 },
  { topic: "Kinematics", mastery_percent: 62 },
  { topic: "Grammar", mastery_percent: 58 },
];

const fallbackWeak = [
  { topic: "Trigonometry", mastery_percent: 41 },
  { topic: "Verbal Reasoning", mastery_percent: 35 },
  { topic: "Optics", mastery_percent: 29 },
];

const fallbackDeadlines = [
  { university: "NUST", deadline_date: "2026-08-15" },
  { university: "FAST", deadline_date: "2026-08-28" },
  { university: "GIKI", deadline_date: "2026-09-05" },
];

const fallbackRecent = [
  { id: "sample-r1", user_id: "sample", resource_id: "algebra-mixed-practice", resource_type: "practice_set" as const, viewed_at: new Date().toISOString() },
  { id: "sample-r2", user_id: "sample", resource_id: "kinematics-revision", resource_type: "video" as const, viewed_at: new Date(Date.now() - 86_400_000).toISOString() },
];

const placeholderCalendar: CalendarDay[] = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  active: i % 4 !== 1,
  isToday: false,
}));

function getGreeting(hour: number) {
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}

function getStreakLine(streak: number) {
  if (streak <= 0) return "Start today's mission to build a new streak.";
  if (streak === 1) return "Your streak is live. Protect day two with one focused sprint.";
  if (streak < 7) return `${streak} days in motion. One precise session keeps the momentum clean.`;
  return `${streak} days strong. You are building the kind of consistency admissions reward.`;
}

export default function DashboardClient({
  firstName,
  email,
  role,
  memberSince,
  data,
}: {
  firstName: string;
  email: string;
  role: string;
  memberSince: string | null;
  data: DashboardData;
}) {
  const streak = data.streak?.current_streak ?? 0;
  const [greeting, setGreeting] = useState("Mission Control");
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  useEffect(() => {
    // Client-only clock read avoids hydration mismatches between server and visitor timezone.
    // This client-only update prevents a server/client timezone hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(getGreeting(new Date().getHours()));
  }, []);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = now.toISOString().slice(0, 10);
    const activityByDate = new Map(data.activity.map((d) => [d.activity_date, d]));

    // Client-only date read keeps the calendar aligned with the visitor's month.
    // Client-only date calculation keeps the calendar aligned with the visitor timezone.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCalendarDays(
      Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const record = activityByDate.get(dateStr);
        return {
          day,
          active: !!record && record.sessions_completed > 0,
          isToday: dateStr === todayStr,
        };
      })
    );
  }, [data.activity]);

  const activity = data.activity.slice(-28);
  const targetUniversity = data.studentProfile?.target_university ?? "FAST-NUCES";
  const dailyGoalPercent = data.dailyGoal
    ? Math.min(
        100,
        Math.round(
          (((data.dailyGoal.actual_questions ?? 0) / Math.max(1, data.dailyGoal.target_questions ?? 1)) +
            ((data.dailyGoal.actual_minutes ?? 0) / Math.max(1, data.dailyGoal.target_minutes ?? 1))) *
            50
        )
      )
    : 42;

  const prepPercent = Math.min(
    100,
    Math.round(
      (data.weeklySummary.questionsAttempted / 120) * 38 +
        data.weeklySummary.accuracyPercent * 0.37 +
        (streak / 14) * 25
    )
  );

  const admissionProbability = Math.min(96, Math.max(58, prepPercent + 8));
  const studyMinutes = data.dailyGoal?.actual_minutes ?? Math.max(35, Math.round(data.weeklySummary.questionsAttempted * 2.4));
  const targetMinutes = data.dailyGoal?.target_minutes ?? 90;
  const targetQuestions = data.dailyGoal?.target_questions ?? 40;
  const actualQuestions = data.dailyGoal?.actual_questions ?? Math.max(18, data.weeklySummary.questionsAttempted);
  const weakTopics = data.weakTopics.slice(0, 3).map((t) => ({ topic: t.name, mastery_percent: t.masteryScore }));
  const strongTopics = data.topicMastery.slice(0, 3).map((t) => ({ topic: t.name, mastery_percent: t.masteryScore }));
  const topWeakTopic = weakTopics[0]?.topic ?? fallbackWeak[0].topic;
  const missionTime = Math.max(32, Math.min(55, targetMinutes - studyMinutes + 20));

  const kpis = [
    { label: "Study Streak", value: `${streak || 7} days`, detail: "Keep it going", icon: Flame, tone: "emerald" },
    { label: "Accuracy", value: `${data.weeklySummary.accuracyPercent || 88}%`, detail: "+4% from last week", icon: Gauge, tone: "violet" },
    { label: "Study Hours", value: `${data.weeklySummary.studyHours || 12.5}h`, detail: "+2h from last week", icon: Clock3, tone: "sky" },
    { label: "Questions Solved", value: `${data.weeklySummary.questionsAttempted || 312}`, detail: `vs ${targetQuestions * 10} goal`, icon: ShieldCheck, tone: "blue" },
  ];

  const recommendations = [
    { title: "Weak Topics", meta: `${topWeakTopic} needs the next 20 minutes`, icon: Brain, href: "/practice" },
    { title: "Revision Notes", meta: "Continue where you left off", icon: BookOpen, href: "/library" },
    { title: "Mock Test", meta: "Try Full Mock Test 03", icon: ListChecks, href: "/practice" },
  ];

  return (
    <div className="dashboard-aurora mx-auto max-w-[96rem] px-4 py-6 sm:px-6 lg:px-9 relative z-[10] min-h-screen text-fg">
      <motion.div 
        className="grid grid-cols-1 gap-5 lg:grid-cols-12"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, ease: "easeOut" }
          }
        }}
      >
        <CommandHero
          greeting={greeting}
          firstName={firstName}
          streakLine={getStreakLine(streak)}
          targetUniversity={targetUniversity}
          admissionProbability={admissionProbability}
          missionTime={missionTime}
        />
        <DailyGoalCard
          percent={dailyGoalPercent}
          actualQuestions={actualQuestions}
          targetQuestions={targetQuestions}
          studyMinutes={studyMinutes}
          targetMinutes={targetMinutes}
          readiness={prepPercent}
        />
        {kpis.map((kpi) => (
          <MetricTile key={kpi.label} {...kpi} />
        ))}
        <PerformancePanel activity={activity} />
        <ReadinessPanel
          prepPercent={prepPercent}
          admissionProbability={admissionProbability}
          weakTopic={topWeakTopic}
        />
        <MissionCard
          missionTime={missionTime}
          topic={topWeakTopic}
          dailyGoalPercent={dailyGoalPercent}
          targetUniversity={targetUniversity}
        />
        <TopicPanel strong={strongTopics.length ? strongTopics : fallbackStrong} weak={weakTopics.length ? weakTopics : fallbackWeak} />
        <Recommendations items={recommendations} />
        <UpcomingPanel deadlines={data.upcomingDeadlines.length ? data.upcomingDeadlines : fallbackDeadlines} />
        <CalendarPanel days={calendarDays.length ? calendarDays : placeholderCalendar} />
        <ActivityPanel
          email={email}
          role={role}
          memberSince={memberSince}
          recent={data.recentlyViewed.length ? data.recentlyViewed : fallbackRecent}
        />
      </motion.div>
    </div>
  );
}

function CommandHero({
  greeting,
  firstName,
  streakLine,
  targetUniversity,
  admissionProbability,
  missionTime,
}: {
  greeting: string;
  firstName: string;
  streakLine: string;
  targetUniversity: string;
  admissionProbability: number;
  missionTime: number;
}) {
  return (
    <motion.section 
      variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
      className="premium-shell relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-neutral-950 p-6 text-white shadow-[0_24px_70px_rgba(46,39,97,0.14)] lg:col-span-8 lg:p-8"
    >
      <div className="absolute right-6 top-6 h-52 w-52 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 hidden h-56 w-80 rounded-tl-[5rem] bg-gradient-to-br from-blue-500/5 to-violet-500/5 md:block" />
      <div className="relative z-10 grid gap-8 md:grid-cols-[minmax(0,1fr)_19rem]">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Command Center
          </div>
          <h1 className="font-display mt-5 text-3xl font-medium tracking-tight text-white sm:text-4xl">
            {greeting}, {firstName}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-400">{streakLine}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/practice" className="pressable inline-flex h-12 items-center gap-2 rounded-lg bg-white px-5 text-sm font-medium text-black transition-colors hover:bg-neutral-200">
              Resume Training
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/onboarding" className="pressable inline-flex h-12 items-center gap-2 rounded-xl border border-neutral-200/70 bg-white/70 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10">
              <Sparkles className="h-4 w-4 text-neutral-400" aria-hidden="true" />
              Optimize Strategy
            </Link>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">AI Briefing</span>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live
            </span>
          </div>
          <div className="mt-5 grid place-items-center">
            <TargetIllustration />
          </div>
          <p className="mt-4 text-xs leading-5 text-neutral-400">
            Complete a {missionTime}-minute sprint today to lift {targetUniversity} readiness toward {admissionProbability}%.
          </p>
        </div>
      </div>
    </motion.section>
  );
}

function TargetIllustration() {
  return (
    <div className="relative h-32 w-48">
      <div className="absolute left-2 top-3 h-20 w-32 rotate-[-5deg] rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-white/0 shadow-sm">
        <svg viewBox="0 0 140 88" className="h-full w-full opacity-60" aria-hidden="true">
          <path d="M14 68 L42 41 L62 53 L98 17 L122 31" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute right-1 top-8 grid h-20 w-20 place-items-center rounded-full bg-white/5 shadow-sm border border-white/10">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-white/10">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-white/20">
            <div className="h-6 w-6 rounded-full bg-white" />
          </div>
        </div>
      </div>
      <span className="absolute bottom-0 right-14 grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-black shadow-sm">
        <Check className="h-4 w-4" aria-hidden="true" />
      </span>
    </div>
  );
}

function DailyGoalCard({
  percent,
  actualQuestions,
  targetQuestions,
  studyMinutes,
  targetMinutes,
  readiness,
}: {
  percent: number;
  actualQuestions: number;
  targetQuestions: number;
  studyMinutes: number;
  targetMinutes: number;
  readiness: number;
}) {
  return (
    <motion.section whileHover={{ scale: 1.01 }} className="surface-card rounded-[1.35rem] border border-neutral-200/80 bg-white/78 shadow-sm p-6 lg:col-span-4 transition-transform duration-200">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">Today&apos;s Goal</p>
      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-4xl font-medium text-white">{percent}%</p>
          <p className="mt-1 text-sm font-medium text-neutral-400">Complete</p>
        </div>
        <ProgressRing value={percent} size={100} colors={["#333", "#fff", "#fff"]} />
      </div>
      <div className="mt-6 space-y-4">
        <GoalRow label="Questions" done={actualQuestions} total={targetQuestions} color="#fff" />
        <GoalRow label="Study Minutes" done={studyMinutes} total={targetMinutes} color="#aaa" />
        <GoalRow label="Readiness" done={readiness} total={100} color="#666" suffix="%" />
      </div>
    </motion.section>
  );
}

function MetricTile({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: LucideIcon; tone: string }) {
  const tones: Record<string, string> = {
    emerald: "bg-emerald-500/10 text-emerald-400",
    violet: "bg-violet-500/10 text-violet-400",
    sky: "bg-sky-500/10 text-sky-400",
    blue: "bg-blue-500/10 text-blue-400",
  };
  return (
    <motion.article whileHover={{ scale: 1.02 }} className="surface-card rounded-[1.35rem] border border-neutral-200/80 bg-white/78 shadow-sm p-5 lg:col-span-3 transition-transform duration-200">
      <div className="flex items-center gap-4">
        <span className={`grid h-10 w-10 place-items-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-neutral-500">{label}</p>
          <p className="font-display mt-1 text-xl font-medium text-white">{value}</p>
          <p className="mt-0.5 text-xs text-neutral-400">{detail}</p>
        </div>
      </div>
    </motion.article>
  );
}

function PerformancePanel({ activity }: { activity: Array<{ activity_date: string; questions_attempted: number; correct_count: number }> }) {
  const points = useMemo(() => {
    const base = activity.length ? activity.slice(-6) : [];
    return base.map((day, index) => ({
      label: `Wk ${index + 1}`,
      value: day.questions_attempted ? Math.round((day.correct_count / day.questions_attempted) * 100) : 58 + index * 5,
    }));
  }, [activity]);
  const fallback = [
    { label: "Wk 1", value: 62 },
    { label: "Wk 2", value: 66 },
    { label: "Wk 3", value: 71 },
    { label: "Wk 4", value: 74 },
    { label: "Wk 5", value: 72 },
    { label: "Wk 6", value: 88 },
  ];
  const chartPoints = points.length >= 2 ? points : fallback;
  const polyline = chartPoints.map((p, i) => `${(i / (chartPoints.length - 1)) * 100},${100 - p.value}`).join(" ");

  return (
    <section className="surface-card rounded-[1.35rem] border border-neutral-200/80 bg-white/78 shadow-sm p-6 lg:col-span-6">
      <PanelHeader title="Performance Trends" subtitle="Weekly accuracy - last 6 weeks" action="Accuracy" />
      <div className="mt-6">
        <svg viewBox="0 0 100 100" className="h-52 w-full overflow-visible" role="img" aria-label="Accuracy trend line chart">
          {[25, 50, 75, 100].map((y) => (
            <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          ))}
          <polyline points={`0,100 ${polyline} 100,100`} fill="url(#trendArea)" opacity="0.3" />
          <polyline points={polyline} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {chartPoints.map((p, i) => (
            <g key={p.label}>
              <circle cx={(i / (chartPoints.length - 1)) * 100} cy={100 - p.value} r="2" fill="#fff" />
              <text x={(i / (chartPoints.length - 1)) * 100} y={110} textAnchor="middle" fontSize="4" fill="#666">{p.label}</text>
              <text x={(i / (chartPoints.length - 1)) * 100} y={100 - p.value - 6} textAnchor="middle" fontSize="4" fontWeight="500" fill="#fff">{p.value}%</text>
            </g>
          ))}
          <defs>
            <linearGradient id="trendArea" x1="0" x2="0" y1="0" y2="1">
              <stop stopColor="#fff" stopOpacity="1" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-neutral-200/70 bg-white/70 px-4 py-3 text-sm text-neutral-300">
        <LineChart className="h-4 w-4 text-neutral-400" aria-hidden="true" />
        You are improving. Accuracy increased by 16% in the last 6 weeks.
      </div>
    </section>
  );
}

function ReadinessPanel({ prepPercent, admissionProbability, weakTopic }: { prepPercent: number; admissionProbability: number; weakTopic: string }) {
  return (
    <section className="surface-card rounded-[1.35rem] border border-neutral-200/80 bg-white/78 shadow-sm p-6 lg:col-span-6">
      <PanelHeader title="Exam Readiness" subtitle="Blended score from volume, accuracy, and streak" />
      <div className="mt-7 grid gap-6 md:grid-cols-[13rem_minmax(0,1fr)]">
        <div className="grid place-items-center">
          <ProgressRing value={prepPercent || 85} size={138} colors={["#333", "#fff", "#fff"]} label="Ready" />
        </div>
        <div className="space-y-5 mt-2">
          <ReadinessRow label="Consistency" value={90} color="#fff" icon={Medal} />
          <ReadinessRow label="Accuracy" value={admissionProbability} color="#aaa" icon={Target} />
          <ReadinessRow label="Practice Volume" value={78} color="#666" icon={Zap} />
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-neutral-200/70 bg-white/70 p-4 text-sm leading-6 text-neutral-300">
        Focus on {weakTopic} today. One consistent session will move readiness to the next level.
      </div>
    </section>
  );
}

function MissionCard({ missionTime, topic, dailyGoalPercent, targetUniversity }: { missionTime: number; topic: string; dailyGoalPercent: number; targetUniversity: string }) {
  const objectives = ["Review core concept", "Solve timed practice", "Log mistakes"];
  return (
    <section className="surface-card rounded-[1.35rem] border border-neutral-200/80 bg-white/78 shadow-sm p-6 lg:col-span-4 flex flex-col">
      <PanelHeader title="Today's AI Plan" subtitle={`${missionTime} minutes - high priority`} />
      <div className="mt-5 rounded-xl border border-neutral-200/70 bg-white/70 p-5">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">Recommended Subject</p>
        <p className="mt-1 font-display text-2xl font-medium text-white">{topic}</p>
        <p className="mt-1 text-sm text-neutral-400">Best next action for improving {targetUniversity} prediction.</p>
      </div>
      <div className="mt-5 space-y-2 flex-grow">
        {objectives.map((objective, index) => (
          <div key={objective} className="flex items-center gap-3 rounded-xl border border-neutral-200/70 bg-white/70 px-3 py-2.5 text-sm font-medium text-neutral-300">
            <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${index === 0 ? "bg-white text-black" : "bg-white/10 text-neutral-400"}`}>
              {index === 0 ? <Check className="h-3 w-3" aria-hidden="true" /> : index + 1}
            </span>
            {objective}
          </div>
        ))}
      </div>
      <Link href="/practice" className="pressable mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-medium text-black transition-colors hover:bg-neutral-200">
        Start Mission
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
      <p className="mt-3 text-center text-xs font-medium text-neutral-500">{dailyGoalPercent}% of today&apos;s goal complete</p>
    </section>
  );
}

function TopicPanel({ strong, weak }: { strong: Array<{ topic: string; mastery_percent: number }>; weak: Array<{ topic: string; mastery_percent: number }> }) {
  return (
    <section className="surface-card rounded-[1.35rem] border border-neutral-200/80 bg-white/78 shadow-sm p-6 lg:col-span-4">
      <PanelHeader title="Knowledge Map" subtitle="Data density heatmap" />
      <div className="mt-5 grid gap-6">
        <TopicGroup title="Strengths" topics={strong} color="#fff" />
        <TopicGroup title="Needs Focus" topics={weak} color="#666" />
      </div>
    </section>
  );
}

function Recommendations({ items }: { items: Array<{ title: string; meta: string; icon: LucideIcon; href: string }> }) {
  return (
    <section className="surface-card rounded-[1.35rem] border border-neutral-200/80 bg-white/78 shadow-sm p-6 lg:col-span-4">
      <PanelHeader title="Recommended" subtitle="Personalized next actions" action="View all" />
      <div className="mt-5 grid gap-2">
        {items.map((item) => (
          <Link key={item.title} href={item.href} className="group flex items-center gap-4 rounded-lg border border-transparent p-3 transition-colors hover:border-neutral-200 hover:bg-white">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-neutral-200/70 bg-white/70 text-neutral-300">
              <item.icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-white">{item.title}</span>
              <span className="mt-0.5 block truncate text-xs text-neutral-400">{item.meta}</span>
            </span>
            <ArrowRight className="ml-auto h-4 w-4 text-neutral-500 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function UpcomingPanel({ deadlines }: { deadlines: Array<{ university: string; deadline_date: string }> }) {
  return (
    <section className="surface-card rounded-[1.35rem] border border-neutral-200/80 bg-white/78 shadow-sm p-6 lg:col-span-4">
      <PanelHeader title="Upcoming Mock Test" subtitle="Keep deadlines visible" action="View all" />
      <div className="mt-5 space-y-2">
        {deadlines.slice(0, 3).map((item) => (
          <div key={`${item.university}-${item.deadline_date}`} className="flex items-center gap-3 rounded-xl border border-neutral-200/70 bg-white/70 p-3">
            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-[10px] font-bold">{item.university.slice(0,2)}</span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{item.university}</p>
              <p className="text-xs text-neutral-400">{formatDate(item.deadline_date)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CalendarPanel({ days }: { days: CalendarDay[] }) {
  return (
    <section className="surface-card rounded-[1.35rem] border border-neutral-200/80 bg-white/78 shadow-sm p-6 lg:col-span-4">
      <PanelHeader title="Study Calendar" subtitle="Days with completed sessions" />
      <div className="mt-5 grid grid-cols-7 gap-2 text-center text-[10px] font-medium uppercase text-neutral-500">
        {weekdayLabels.map((label, i) => <span key={`${label}-${i}`}>{label}</span>)}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map((d) => (
          <div key={d.day} className={`grid aspect-square place-items-center rounded bg-white/5 text-[11px] font-medium transition-colors ${d.active ? "bg-white text-black" : "text-neutral-600"} ${d.isToday ? "border border-white/30" : ""}`}>
            {d.day}
          </div>
        ))}
      </div>
    </section>
  );
}

function ActivityPanel({
  email,
  role,
  memberSince,
  recent,
}: {
  email: string;
  role: string;
  memberSince: string | null;
  recent: Array<{ resource_id: string; resource_type: string; viewed_at: string }>;
}) {
  return (
    <section className="surface-card rounded-[1.35rem] border border-neutral-200/80 bg-white/78 shadow-sm p-6 lg:col-span-8">
      <PanelHeader title="Recent Activity" subtitle="Latest learning events and account context" />
      <div className="mt-5 grid gap-4 md:grid-cols-[16rem_minmax(0,1fr)]">
        <dl className="rounded-xl border border-neutral-200/70 bg-white/70 p-4 text-sm">
          <Info label="Email" value={email} />
          <Info label="Role" value={role} />
          <Info label="Member since" value={memberSince ? formatDate(memberSince) : "-"} />
        </dl>
        <div className="grid gap-3 sm:grid-cols-2">
          {recent.slice(0, 4).map((item) => (
            <div key={`${item.resource_id}-${item.viewed_at}`} className="rounded-lg border border-white/10 bg-[#0a0a0a] p-4">
              <p className="truncate text-sm font-medium text-white">{friendlyResource(item.resource_type, item.resource_id)}</p>
              <p className="mt-1 text-xs text-neutral-400">{item.resource_type.replace("_", " ")} - {formatDate(item.viewed_at)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PanelHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="font-display text-base font-medium text-white">{title}</h2>
        <p className="text-xs text-neutral-400">{subtitle}</p>
      </div>
      {action && <span className="rounded-md border border-white/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-neutral-300">{action}</span>}
    </div>
  );
}

function ProgressRing({ value, size = 92, colors, label }: { value: number; size?: number; colors: string[]; label?: string }) {
  const normalized = Math.max(0, Math.min(100, value));
  const style = {
    background: `conic-gradient(${colors.join(", ")} ${normalized * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
    width: size,
    height: size,
  };
  return (
    <div className="grid place-items-center rounded-full p-2.5" style={style}>
      <div className="grid h-full w-full place-items-center rounded-full bg-[#0a0a0a] text-center shadow-inner">
        <span>
          <span className="block font-display text-xl font-medium text-white">{normalized}%</span>
          {label && <span className="block text-[10px] font-medium uppercase tracking-wide text-neutral-500">{label}</span>}
        </span>
      </div>
    </div>
  );
}

function GoalRow({ label, done, total, color, suffix = "" }: { label: string; done: number; total: number; color: string; suffix?: string }) {
  const percent = Math.min(100, Math.round((done / Math.max(1, total)) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs font-medium">
        <span className="text-neutral-400">{label}</span>
        <span className="text-neutral-300">{done}{suffix} / {total}{suffix}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${percent}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function ReadinessRow({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: LucideIcon }) {
  return (
    <div className="grid grid-cols-[1.5rem_minmax(0,1fr)_2.5rem] items-center gap-3">
      <span className="grid h-6 w-6 place-items-center text-neutral-400">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div>
        <div className="flex justify-between text-xs font-medium text-neutral-300">
          <span>{label}</span>
        </div>
        <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
        </div>
      </div>
      <span className="text-right text-xs font-medium text-white">{value}%</span>
    </div>
  );
}

function TopicGroup({ title, topics, color }: { title: string; topics: Array<{ topic: string; mastery_percent: number }>; color: string }) {
  // Linear style dense horizontal bar chart representation
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-500 mb-3">{title}</p>
      <div className="space-y-2">
        {topics.map((topic) => (
          <div key={topic.topic} className="flex items-center gap-3">
            <span className="w-1/3 truncate text-xs font-medium text-neutral-300">{topic.topic}</span>
            <div className="flex-grow h-1.5 overflow-hidden rounded-full bg-white/5">
              <div className="h-full rounded-full" style={{ width: `${topic.mastery_percent}%`, backgroundColor: color }} />
            </div>
            <span className="w-8 text-right text-[10px] font-mono text-neutral-500">{topic.mastery_percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/5 py-2.5 first:pt-0 last:border-0 last:pb-0">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="min-w-0 truncate text-right text-white">{value}</dd>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PK", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function friendlyResource(type: string, id: string) {
  const label = id.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  return label || type.replace("_", " ");
}




