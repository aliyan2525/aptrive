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
  const targetUniversity = data.studentProfile?.target_university ?? "your target university";
  const hasEvidence = data.weeklySummary.questionsAttempted > 0 || data.topicMastery.length > 0 || data.weakTopics.length > 0;
  const dailyGoalPercent = data.dailyGoal
    ? Math.min(
        100,
        Math.round(
          (((data.dailyGoal.actual_questions ?? 0) / Math.max(1, data.dailyGoal.target_questions ?? 1)) +
            ((data.dailyGoal.actual_minutes ?? 0) / Math.max(1, data.dailyGoal.target_minutes ?? 1))) *
            50
        )
      )
    : 0;

  const prepPercent = Math.min(
    100,
    Math.round(
      (data.weeklySummary.questionsAttempted / 120) * 38 +
        data.weeklySummary.accuracyPercent * 0.37 +
        (streak / 14) * 25
    )
  );

  const admissionProbability = hasEvidence ? Math.min(96, Math.max(0, prepPercent + 8)) : 0;
  const studyMinutes = data.dailyGoal?.actual_minutes ?? 0;
  const targetMinutes = data.dailyGoal?.target_minutes ?? data.studentProfile?.daily_study_target_minutes ?? 90;
  const targetQuestions = data.dailyGoal?.target_questions ?? 20;
  const actualQuestions = data.dailyGoal?.actual_questions ?? data.weeklySummary.questionsAttempted;
  const weakTopics = data.weakTopics.slice(0, 3).map((t) => ({ topic: t.name, mastery_percent: t.masteryScore }));
  const strongTopics = data.topicMastery.slice(0, 3).map((t) => ({ topic: t.name, mastery_percent: t.masteryScore }));
  const topWeakTopic = weakTopics[0]?.topic ?? "a priority topic";
  const missionTime = Math.max(32, Math.min(55, targetMinutes - studyMinutes + 20));

  const kpis = [
    { label: "Study Streak", value: `${streak} days`, detail: streak ? "Keep it going" : "Start your first streak", icon: Flame, tone: "emerald" },
    { label: "Accuracy", value: `${data.weeklySummary.accuracyPercent}%`, detail: data.weeklySummary.questionsAttempted ? "Last 7 days" : "No attempts yet", icon: Gauge, tone: "violet" },
    { label: "Study Hours", value: `${data.weeklySummary.studyHours}h`, detail: data.weeklySummary.studyHours ? "Last 7 days" : "Time tracking unavailable", icon: Clock3, tone: "sky" },
    { label: "Questions Solved", value: `${data.weeklySummary.questionsAttempted}`, detail: `of ${targetQuestions} daily goal`, icon: ShieldCheck, tone: "blue" },
  ];

  const recommendations = [
    { title: "Weak Topics", meta: `${topWeakTopic} needs the next 20 minutes`, icon: Brain, href: "/practice" },
    { title: "Revision Notes", meta: "Continue where you left off", icon: BookOpen, href: "/library" },
    { title: "Mock Test", meta: "Try Full Mock Test 03", icon: ListChecks, href: "/practice" },
  ];

  return (
    <div className="dashboard-aurora relative z-[10] mx-auto min-h-screen max-w-[96rem] px-3 py-4 text-fg sm:px-6 sm:py-6 lg:px-9">
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
          hasEvidence={hasEvidence}
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
        <TopicPanel strong={strongTopics} weak={weakTopics} />
        <Recommendations items={recommendations} />
        <UpcomingPanel deadlines={data.upcomingDeadlines} />
        <CalendarPanel days={calendarDays} />
        <ActivityPanel
          email={email}
          role={role}
          memberSince={memberSince}
          recent={data.recentlyViewed}
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
  hasEvidence,
}: {
  greeting: string;
  firstName: string;
  streakLine: string;
  targetUniversity: string;
  admissionProbability: number;
  missionTime: number;
  hasEvidence: boolean;
}) {
  return (
    <motion.section 
      variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
      className="relative overflow-hidden rounded-[2rem] border border-white/85 bg-white/72 p-5 shadow-[0_28px_90px_rgba(62,72,130,0.12)] backdrop-blur-2xl sm:p-6 lg:col-span-8 lg:p-9"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-teal-200/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-violet-200/20 blur-3xl" />
      <div className="relative z-10 grid gap-7 md:grid-cols-[minmax(0,1fr)_21rem] lg:gap-10">
        <div>
          <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.22em] text-teal-700">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 shadow-[0_0_0_4px_rgba(35,213,196,0.12)]" />
            Command Center
          </div>
          <h1 className="font-display mt-6 text-3xl font-bold tracking-[-0.04em] text-fg sm:text-4xl lg:text-5xl">
            {greeting},<br />
            <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-teal-500 bg-clip-text text-transparent">{firstName} 👋</span>
          </h1>
          <p className="mt-5 max-w-md text-sm font-medium leading-7 text-muted">{streakLine}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/practice" className="pressable inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 text-sm font-bold text-white shadow-[0_14px_30px_rgba(79,70,229,0.22)] transition hover:-translate-y-0.5">
              {hasEvidence ? "Resume Training" : "Start your first session"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/onboarding" className="pressable inline-flex h-12 items-center gap-2 rounded-xl border border-line bg-white/75 px-5 text-sm font-bold text-fg transition hover:border-violet-300 hover:bg-white">
              <Sparkles className="h-4 w-4 text-violet-600" aria-hidden="true" />
              Customize my setup
            </Link>
          </div>
        </div>
        <div className="rounded-[1.6rem] border border-white/85 bg-white/62 p-6 shadow-[0_16px_45px_rgba(62,72,130,0.08)] backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">AI Briefing</span>
            <span className="flex items-center gap-1.5 rounded-full bg-teal-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-teal-700">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
              Live
            </span>
          </div>
          <div className="mt-6 grid place-items-center">
            <TargetIllustration />
          </div>
          <div className="mt-6 rounded-2xl border border-white/80 bg-white/75 p-4 shadow-sm">
            <p className="text-xs font-medium leading-relaxed text-fg">
              {hasEvidence ? `Complete your first 55-minute sprint to turn your setup into a real readiness signal.` : `Complete your first ${missionTime}-minute sprint to turn your setup into a real readiness signal.`}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function TargetIllustration() {
  return (
    <div className="relative h-32 w-48">
      <div className="absolute left-2 top-3 h-20 w-32 rotate-[-5deg] rounded-lg border border-white/80 bg-gradient-to-br from-white/5 to-white/0 shadow-sm">
        <svg viewBox="0 0 140 88" className="h-full w-full opacity-60" aria-hidden="true">
          <path d="M14 68 L42 41 L62 53 L98 17 L122 31" fill="none" stroke="#6f45ff" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute right-1 top-8 grid h-20 w-20 place-items-center rounded-full bg-white/62 shadow-sm border border-white/80">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-white/70">
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
    <motion.section whileHover={{ scale: 1.01 }} className="glass-panel rounded-[1.35rem] p-6 lg:col-span-4 transition-transform duration-200">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">Today&apos;s Goal</p>
      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
<p className="font-display text-4xl font-medium text-fg">{percent}%</p>
          <p className="mt-1 text-sm font-medium text-muted">Complete</p>
        </div>
        <ProgressRing value={percent} size={100} colors={["#23d5c4", "#6f45ff", "#dbe4ff"]} />
      </div>
      <div className="mt-6 space-y-4">
<GoalRow label="Questions" done={actualQuestions} total={targetQuestions} color="#23d5c4" />
        <GoalRow label="Study Minutes" done={studyMinutes} total={targetMinutes} color="#6f45ff" />
        <GoalRow label="Readiness" done={readiness} total={100} color="#9b8cff" suffix="%" />
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
    <motion.article whileHover={{ scale: 1.02 }} className="glass-panel rounded-[1.35rem] p-5 lg:col-span-3 transition-transform duration-200">
      <div className="flex items-center gap-4">
        <span className={`grid h-10 w-10 place-items-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted">{label}</p>
<p className="font-display mt-1 text-xl font-medium text-fg">{value}</p>
          <p className="mt-0.5 text-xs text-muted">{detail}</p>
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
      value: day.questions_attempted ? Math.round((day.correct_count / day.questions_attempted) * 100) : 0,
    }));
  }, [activity]);
  const chartPoints = points.length >= 2 ? points : [];
  const polyline = chartPoints.map((p, i) => `${(i / (chartPoints.length - 1)) * 100},${100 - p.value}`).join(" ");

  return (
    <section className="glass-panel rounded-[1.35rem] p-6 lg:col-span-6">
      <PanelHeader title="Performance Trends" subtitle="Weekly accuracy - last 6 weeks" action="Accuracy" />
      <div className="mt-6">
        {!chartPoints.length ? <div className="grid h-52 place-items-center rounded-xl border border-dashed border-line bg-white/50 px-6 text-center text-sm text-muted">Complete at least two activity days to reveal your accuracy trend.</div> : <svg viewBox="0 0 100 100" className="h-52 w-full overflow-visible" role="img" aria-label="Accuracy trend line chart">
          {[25, 50, 75, 100].map((y) => (
            <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="rgba(62,72,130,0.08)" strokeWidth="1" />
          ))}
          <polyline points={`0,100 ${polyline} 100,100`} fill="url(#trendArea)" opacity="0.3" />
          <polyline points={polyline} fill="none" stroke="#6f45ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {chartPoints.map((p, i) => (
            <g key={p.label}>
              <circle cx={(i / (chartPoints.length - 1)) * 100} cy={100 - p.value} r="2" fill="#6f45ff" />
              <text x={(i / (chartPoints.length - 1)) * 100} y={110} textAnchor="middle" fontSize="4" fill="#666">{p.label}</text>
              <text x={(i / (chartPoints.length - 1)) * 100} y={100 - p.value - 6} textAnchor="middle" fontSize="4" fontWeight="500" fill="#6f45ff">{p.value}%</text>
            </g>
          ))}
          <defs>
            <linearGradient id="trendArea" x1="0" x2="0" y1="0" y2="1">
              <stop stopColor="#6f45ff" stopOpacity="0.32" />
              <stop offset="1" stopColor="#23d5c4" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>}
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-neutral-200/70 bg-white/70 px-4 py-3 text-sm text-muted">
        <LineChart className="h-4 w-4 text-teal" aria-hidden="true" />
        {chartPoints.length >= 2 ? "Your recent accuracy trend is calculated from recorded attempts." : "Your first recorded attempts will appear here as a trend."}
      </div>
    </section>
  );
}

function ReadinessPanel({ prepPercent, admissionProbability, weakTopic }: { prepPercent: number; admissionProbability: number; weakTopic: string }) {
  return (
    <section className="glass-panel rounded-[1.35rem] p-6 lg:col-span-6">
      <PanelHeader title="Exam Readiness" subtitle="Blended score from volume, accuracy, and streak" />
      <div className="mt-7 grid gap-6 md:grid-cols-[13rem_minmax(0,1fr)]">
        <div className="grid place-items-center">
          <ProgressRing value={prepPercent} size={138} colors={["#23d5c4", "#6f45ff", "#dbe4ff"]} label="Ready" />
        </div>
        <div className="space-y-5 mt-2">
          <ReadinessRow label="Consistency" value={Math.min(100, prepPercent)} color="#23d5c4" icon={Medal} />
          <ReadinessRow label="Accuracy" value={Math.min(100, admissionProbability)} color="#6f45ff" icon={Target} />
          <ReadinessRow label="Practice Volume" value={Math.min(100, prepPercent)} color="#9b8cff" icon={Zap} />
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-line bg-white/70 p-4 text-sm leading-6 text-muted">
        {weakTopic === "a priority topic" ? "Complete a focused session to reveal the next readiness opportunity." : `Focus on ${weakTopic} today. One consistent session will move readiness to the next level.`}
      </div>
    </section>
  );
}

function MissionCard({ missionTime, topic, dailyGoalPercent, targetUniversity }: { missionTime: number; topic: string; dailyGoalPercent: number; targetUniversity: string }) {
  const objectives = ["Review core concept", "Solve timed practice", "Log mistakes"];
  return (
    <section className="glass-panel rounded-[1.35rem] p-6 lg:col-span-4 flex flex-col">
      <PanelHeader title="Today's AI Plan" subtitle={`${missionTime} minutes - high priority`} />
      <div className="mt-5 rounded-xl border border-white/80 bg-white/62 p-5">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">Recommended Subject</p>
        <p className="mt-1 font-display text-2xl font-medium text-fg">{topic}</p>
        <p className="mt-1 text-sm text-muted">Best next action for improving {targetUniversity} prediction.</p>
      </div>
      <div className="mt-5 space-y-2 flex-grow">
        {objectives.map((objective, index) => (
          <div key={objective} className="flex items-center gap-3 rounded-xl border border-white/80 bg-white/62 px-3 py-2.5 text-sm font-medium text-muted">
            <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${index === 0 ? "bg-white text-black" : "bg-white/70 text-muted"}`}>
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
      <p className="mt-3 text-center text-xs font-medium text-muted">{dailyGoalPercent}% of today&apos;s goal complete</p>
    </section>
  );
}

function TopicPanel({ strong, weak }: { strong: Array<{ topic: string; mastery_percent: number }>; weak: Array<{ topic: string; mastery_percent: number }> }) {
  return (
    <section className="glass-panel rounded-[1.35rem] p-6 lg:col-span-4">
      <PanelHeader title="Knowledge Map" subtitle="Data density heatmap" />
      <div className="mt-5 grid gap-6">
        <TopicGroup title="Strengths" topics={strong} color="#23d5c4" />
        <TopicGroup title="Needs Focus" topics={weak} color="#6f45ff" />
      </div>
    </section>
  );
}

function Recommendations({ items }: { items: Array<{ title: string; meta: string; icon: LucideIcon; href: string }> }) {
  return (
    <section className="glass-panel rounded-[1.35rem] p-6 lg:col-span-4">
      <PanelHeader title="Recommended" subtitle="Personalized next actions" action="View all" />
      <div className="mt-5 grid gap-2">
        {items.map((item) => (
          <Link key={item.title} href={item.href} className="group flex items-center gap-4 rounded-lg border border-transparent p-3 transition-colors hover:border-neutral-200 hover:bg-white">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/80 bg-white/62 text-muted">
              <item.icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-fg">{item.title}</span>
              <span className="mt-0.5 block truncate text-xs text-muted">{item.meta}</span>
            </span>
            <ArrowRight className="ml-auto h-4 w-4 text-muted transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function UpcomingPanel({ deadlines }: { deadlines: Array<{ university: string; deadline_date: string }> }) {
  return (
    <section className="glass-panel rounded-[1.35rem] p-6 lg:col-span-4">
      <PanelHeader title="Upcoming Mock Test" subtitle="Keep deadlines visible" action="View all" />
      <div className="mt-5 space-y-2">
        {!deadlines.length ? <p className="rounded-xl border border-dashed border-line bg-white/50 p-4 text-sm leading-6 text-muted">No admission deadlines are saved yet. Add a target university to keep important dates visible.</p> : null}
        {deadlines.slice(0, 3).map((item) => (
          <div key={`${item.university}-${item.deadline_date}`} className="flex items-center gap-3 rounded-xl border border-line bg-white/70 p-3">
            <div className="h-8 w-8 rounded-full bg-white/70 flex items-center justify-center">
              <span className="text-[10px] font-bold">{item.university.slice(0,2)}</span>
            </div>
            <div className="min-w-0">
<p className="truncate text-sm font-medium text-fg">{item.university}</p>
              <p className="text-xs text-muted">{formatDate(item.deadline_date)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CalendarPanel({ days }: { days: CalendarDay[] }) {
  return (
    <section className="glass-panel rounded-[1.35rem] p-6 lg:col-span-4">
      <PanelHeader title="Study Calendar" subtitle="Days with completed sessions" />
      <div className="mt-5 grid grid-cols-7 gap-2 text-center text-[10px] font-medium uppercase text-muted">
        {weekdayLabels.map((label, i) => <span key={`${label}-${i}`}>{label}</span>)}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {!days.length ? <p className="col-span-7 rounded-xl border border-dashed border-line bg-white/50 p-4 text-sm leading-6 text-muted">Your activity calendar will fill in after your first completed session.</p> : null}
        {days.map((d) => (
          <div key={d.day} className={`grid aspect-square place-items-center rounded bg-white/70 text-[11px] font-medium transition-colors ${d.active ? "bg-teal-100 text-teal-800" : "text-muted-2"} ${d.isToday ? "border border-violet-400" : ""}`}>
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
    <section className="glass-panel rounded-[1.35rem] p-6 lg:col-span-8">
      <PanelHeader title="Recent Activity" subtitle="Latest learning events and account context" />
      <div className="mt-5 grid gap-4 md:grid-cols-[16rem_minmax(0,1fr)]">
        <dl className="rounded-xl border border-white/80 bg-white/62 p-4 text-sm">
          <Info label="Email" value={email} />
          <Info label="Role" value={role} />
          <Info label="Member since" value={memberSince ? formatDate(memberSince) : "-"} />
        </dl>
        <div className="grid gap-3 sm:grid-cols-2">
          {!recent.length ? <p className="rounded-xl border border-dashed border-line bg-white/50 p-4 text-sm leading-6 text-muted sm:col-span-2">No recent learning activity yet. Start a practice set and your latest work will appear here.</p> : null}
          {recent.slice(0, 4).map((item) => (
<div key={`${item.resource_id}-${item.viewed_at}`} className="rounded-lg border border-line bg-white/70 p-4">
              <p className="truncate text-sm font-medium text-fg">{friendlyResource(item.resource_type, item.resource_id)}</p>
              <p className="mt-1 text-xs text-muted">{item.resource_type.replace("_", " ")} - {formatDate(item.viewed_at)}</p>
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
<h2 className="font-display text-base font-medium text-fg">{title}</h2>
        <p className="text-xs text-muted">{subtitle}</p>
      </div>
      {action && <span className="rounded-md border border-white/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-muted">{action}</span>}
    </div>
  );
}

function ProgressRing({ value, size = 92, colors, label }: { value: number; size?: number; colors: string[]; label?: string }) {
  const normalized = Math.max(0, Math.min(100, value));
  const style = {
    background: `conic-gradient(${colors.join(", ")} ${normalized * 3.6}deg, rgba(62,72,130,0.08) 0deg)`,
    width: size,
    height: size,
  };
  return (
    <div className="grid place-items-center rounded-full p-2.5" style={style}>
      <div className="grid h-full w-full place-items-center rounded-full bg-white text-center shadow-inner">
        <span>
          <span className="block font-display text-xl font-medium text-fg">{normalized}%</span>
          {label && <span className="block text-[10px] font-medium uppercase tracking-wide text-muted">{label}</span>}
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
<span className="text-muted">{label}</span>
        <span className="text-muted">{done}{suffix} / {total}{suffix}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/70">
        <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${percent}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function ReadinessRow({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: LucideIcon }) {
  return (
    <div className="grid grid-cols-[1.5rem_minmax(0,1fr)_2.5rem] items-center gap-3">
      <span className="grid h-6 w-6 place-items-center text-muted">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div>
        <div className="flex justify-between text-xs font-medium text-muted">
          <span>{label}</span>
        </div>
        <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/70">
          <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
        </div>
      </div>
      <span className="text-right text-xs font-medium text-fg">{value}%</span>
    </div>
  );
}

function TopicGroup({ title, topics, color }: { title: string; topics: Array<{ topic: string; mastery_percent: number }>; color: string }) {
  // Linear style dense horizontal bar chart representation
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted mb-3">{title}</p>
      <div className="space-y-2">
        {!topics.length ? <p className="rounded-xl border border-dashed border-line bg-white/50 p-4 text-sm leading-6 text-muted">Complete a few questions to build this map.</p> : null}
        {topics.map((topic) => (
          <div key={topic.topic} className="flex items-center gap-3">
            <span className="w-1/3 truncate text-xs font-medium text-fg">{topic.topic}</span>
            <div className="flex-grow h-1.5 overflow-hidden rounded-full bg-white/62">
              <div className="h-full rounded-full" style={{ width: `${topic.mastery_percent}%`, backgroundColor: color }} />
            </div>
            <span className="w-8 text-right text-[10px] font-mono text-muted-2">{topic.mastery_percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/5 py-2.5 first:pt-0 last:border-0 last:pb-0">
<dt className="text-muted">{label}</dt>
      <dd className="min-w-0 truncate text-right text-fg">{value}</dd>
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




