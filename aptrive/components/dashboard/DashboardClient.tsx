"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  Check,
  Clock3,
  Flame,
  Gauge,
  LayoutDashboard,
  LineChart,
  ListChecks,
  Medal,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { getDashboardData } from "@/lib/dashboard-data";
import AppNotificationCenter from "@/components/app/AppNotificationCenter";
import AuthAccountMenu from "@/components/app/AuthAccountMenu";
import CommandPalette from "@/components/app/CommandPalette";
import type { NotificationItem } from "@/components/NotificationBell";
import type { HeaderUser } from "@/components/UserMenu";
import UniversityLogo from "@/components/UniversityLogo";

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

type CalendarDay = {
  day: number;
  active: boolean;
  isToday: boolean;
};

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: true },
  { label: "Practice", href: "/practice", icon: Brain },
  { label: "Library", href: "/library", icon: BookOpen },
  { label: "Mock Tests", href: "/practice", icon: ListChecks },
  { label: "Rankings", href: "/leaderboard", icon: Trophy },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Goals", href: "/goals", icon: Target },
  { label: "Settings", href: "/settings", icon: Settings },
];

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
  notifications,
  unreadCount,
}: {
  firstName: string;
  email: string;
  role: string;
  memberSince: string | null;
  data: DashboardData;
  notifications: NotificationItem[];
  unreadCount: number;
}) {
  const streak = data.streak?.current_streak ?? 0;
  const [greeting, setGreeting] = useState("Mission Control");
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    // Client-only clock read avoids hydration mismatches between server and visitor timezone.
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
  const accountUser: HeaderUser = {
    fullName: firstName,
    email,
    avatarUrl: null,
    isStaff: role !== "student",
  };

  return (
    <main className="relative z-[60] min-h-screen bg-[#f7f9ff] text-fg">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-[#e8ecf8] bg-white/78 px-5 py-7 backdrop-blur-xl xl:block">
          <Link href="/dashboard" className="flex items-center gap-3 px-2" aria-label="Aptrive dashboard">
            <span className="grid h-14 w-14 place-items-center rounded-[1rem] bg-white shadow-[0_16px_32px_rgba(66,82,220,0.14)]">
              <Image src="/logo-mark.png" alt="" width={42} height={47} className="h-11 w-auto" priority />
            </span>
            <span className="font-display text-2xl font-bold text-[#08112f]">Aptrive</span>
          </Link>
          <nav className="mt-10 space-y-2" aria-label="Dashboard">
            {navItems.map((item) => (
              <SideNavItem key={item.label} {...item} />
            ))}
          </nav>
          <div className="mt-16 rounded-[1.25rem] border border-[#e3e8f7] bg-gradient-to-br from-white to-[#f1f4ff] p-5 shadow-[0_20px_50px_rgba(51,70,130,0.08)]">
            <Rocket className="h-9 w-9 text-violet-500" aria-hidden="true" />
            <p className="mt-4 text-sm font-bold text-blue-700">Pro Plan</p>
            <p className="mt-2 text-sm leading-relaxed text-[#667196]">You are unlocking your full potential.</p>
            <Link href="/onboarding" className="pressable mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[0.7rem] bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white">
              <Zap className="h-4 w-4" aria-hidden="true" />
              Upgrade Plan
            </Link>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-[#e8ecf8]/90 bg-white/76 backdrop-blur-xl">
            <div className="mx-auto flex h-20 max-w-[96rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-9">
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="hidden h-11 w-full max-w-[38rem] items-center gap-3 rounded-[0.85rem] border border-[#e6ebf7] bg-[#f8faff] px-4 text-left text-sm text-[#7883a9] shadow-inner md:flex"
                aria-label="Open command center"
              >
                <Search className="h-5 w-5 text-[#4d5d91]" aria-hidden="true" />
                <span>Search topics, tests, or something...</span>
                <kbd className="ml-auto rounded-md bg-white px-2 py-1 text-xs text-[#6c759b] shadow-sm">K</kbd>
              </button>
              <div className="ml-auto flex items-center gap-4">
                <AppNotificationCenter initialNotifications={notifications} initialUnreadCount={unreadCount} />
                <AuthAccountMenu user={accountUser} />
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[96rem] px-4 py-6 sm:px-6 lg:px-9">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
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
            </div>
          </div>
        </section>
      </div>
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </main>
  );
}

function SideNavItem({ label, href, icon: Icon, active }: { label: string; href: string; icon: LucideIcon; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex h-14 items-center gap-3 rounded-[0.7rem] px-4 text-sm font-semibold transition ${
        active ? "bg-[#f0f1ff] text-blue-700 shadow-sm" : "text-[#172247] hover:bg-[#f7f9ff]"
      }`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      {label}
    </Link>
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
    <section className="relative overflow-hidden rounded-[1.4rem] border border-[#e4e9f6] bg-white p-6 shadow-[0_24px_70px_rgba(36,52,104,0.08)] lg:col-span-8 lg:p-8">
      <div className="absolute right-6 top-6 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 hidden h-56 w-80 rounded-tl-[5rem] bg-gradient-to-br from-[#eef7ff] to-[#f5efff] md:block" />
      <div className="relative z-10 grid gap-8 md:grid-cols-[minmax(0,1fr)_19rem]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#5b6795]">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Command Center
          </div>
          <h1 className="font-display mt-5 text-3xl font-bold tracking-normal text-[#07102e] sm:text-4xl">
            {greeting}, {firstName}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#4d5a83]">{streakLine}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/practice" className="pressable inline-flex h-14 items-center gap-3 rounded-[1rem] bg-gradient-to-r from-blue-600 to-violet-600 px-6 text-sm font-bold text-white shadow-[0_16px_30px_rgba(70,85,230,0.25)]">
              Continue Studying
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link href="/onboarding" className="pressable inline-flex h-14 items-center gap-3 rounded-[1rem] border border-[#dfe5f4] bg-white px-6 text-sm font-bold text-[#344065]">
              <Sparkles className="h-4 w-4 text-violet-500" aria-hidden="true" />
              Personalize Plan
            </Link>
          </div>
        </div>
        <div className="rounded-[1.2rem] border border-[#e5eaf6] bg-white/80 p-5 shadow-[0_20px_50px_rgba(62,80,130,0.09)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#69759f]">AI Briefing</span>
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live
            </span>
          </div>
          <div className="mt-5 grid place-items-center">
            <TargetIllustration />
          </div>
          <p className="mt-4 text-sm leading-6 text-[#4d5a83]">
            Complete a {missionTime}-minute sprint today to lift {targetUniversity} readiness toward {admissionProbability}%.
          </p>
        </div>
      </div>
    </section>
  );
}

function TargetIllustration() {
  return (
    <div className="relative h-36 w-52">
      <div className="absolute left-2 top-3 h-24 w-36 rotate-[-5deg] rounded-[1rem] border border-[#dfe7f8] bg-gradient-to-br from-white to-[#eef7ff] shadow-lg">
        <svg viewBox="0 0 140 88" className="h-full w-full" aria-hidden="true">
          <path d="M14 68 L42 41 L62 53 L98 17 L122 31" fill="none" stroke="#7657ff" strokeWidth="6" strokeLinecap="round" />
          <path d="M14 68 L42 41 L62 53 L98 17 L122 31 L122 88 L14 88 Z" fill="url(#heroFill)" opacity="0.45" />
          <defs>
            <linearGradient id="heroFill" x1="0" x2="1">
              <stop stopColor="#58d5ff" />
              <stop offset="1" stopColor="#9d6cff" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute right-1 top-10 grid h-24 w-24 place-items-center rounded-full bg-white shadow-[0_22px_45px_rgba(42,69,150,0.2)]">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-blue-100">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-blue-500">
            <div className="h-7 w-7 rounded-full bg-white" />
          </div>
        </div>
      </div>
      <span className="absolute bottom-0 right-16 grid h-10 w-10 place-items-center rounded-full bg-emerald-500 text-white shadow-lg">
        <Check className="h-5 w-5" aria-hidden="true" />
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
    <section className="rounded-[1.4rem] border border-[#e4e9f6] bg-white p-6 shadow-[0_24px_70px_rgba(36,52,104,0.08)] lg:col-span-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5b6795]">Today&apos;s Goal</p>
      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-4xl font-bold text-[#07102e]">{percent}%</p>
          <p className="mt-1 text-sm font-semibold text-[#344065]">Complete</p>
        </div>
        <ProgressRing value={percent} size={116} colors={["#1ebf91", "#3478ff", "#8057ff"]} />
      </div>
      <div className="mt-6 space-y-4">
        <GoalRow label="Questions" done={actualQuestions} total={targetQuestions} color="#8057ff" />
        <GoalRow label="Study Minutes" done={studyMinutes} total={targetMinutes} color="#3478ff" />
        <GoalRow label="Readiness" done={readiness} total={100} color="#1ebf91" suffix="%" />
      </div>
    </section>
  );
}

function MetricTile({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: LucideIcon; tone: string }) {
  const tones: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    sky: "bg-sky-50 text-sky-600",
    blue: "bg-blue-50 text-blue-600",
  };
  return (
    <article className="rounded-[1.1rem] border border-[#e4e9f6] bg-white p-5 shadow-[0_18px_45px_rgba(36,52,104,0.06)] lg:col-span-3">
      <div className="flex items-center gap-4">
        <span className={`grid h-12 w-12 place-items-center rounded-full ${tones[tone]}`}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#69759f]">{label}</p>
          <p className="font-display mt-1 text-2xl font-bold text-[#07102e]">{value}</p>
          <p className="mt-1 text-xs font-semibold text-[#53618d]">{detail}</p>
        </div>
      </div>
    </article>
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
    <section className="rounded-[1.3rem] border border-[#e4e9f6] bg-white p-6 shadow-[0_24px_70px_rgba(36,52,104,0.07)] lg:col-span-6">
      <PanelHeader title="Performance Trends" subtitle="Weekly accuracy - last 6 weeks" action="Accuracy" />
      <div className="mt-6">
        <svg viewBox="0 0 100 100" className="h-52 w-full overflow-visible" role="img" aria-label="Accuracy trend line chart">
          {[25, 50, 75, 100].map((y) => (
            <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="#edf1fa" strokeWidth="0.7" />
          ))}
          <polyline points={`0,100 ${polyline} 100,100`} fill="url(#trendArea)" opacity="0.55" />
          <polyline points={polyline} fill="none" stroke="#724cff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          {chartPoints.map((p, i) => (
            <g key={p.label}>
              <circle cx={(i / (chartPoints.length - 1)) * 100} cy={100 - p.value} r="2.1" fill="#724cff" />
              <text x={(i / (chartPoints.length - 1)) * 100} y={94} textAnchor="middle" fontSize="3.5" fill="#69759f">{p.label}</text>
              <text x={(i / (chartPoints.length - 1)) * 100} y={100 - p.value - 6} textAnchor="middle" fontSize="4" fontWeight="700" fill="#172247">{p.value}%</text>
            </g>
          ))}
          <defs>
            <linearGradient id="trendArea" x1="0" x2="0" y1="0" y2="1">
              <stop stopColor="#7a55ff" stopOpacity="0.28" />
              <stop offset="1" stopColor="#7a55ff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="mt-3 flex items-center gap-3 rounded-[0.9rem] bg-[#f7f8ff] px-4 py-3 text-sm text-[#4d5a83]">
        <LineChart className="h-5 w-5 text-blue-600" aria-hidden="true" />
        You are improving. Accuracy increased by 16% in the last 6 weeks.
      </div>
    </section>
  );
}

function ReadinessPanel({ prepPercent, admissionProbability, weakTopic }: { prepPercent: number; admissionProbability: number; weakTopic: string }) {
  return (
    <section className="rounded-[1.3rem] border border-[#e4e9f6] bg-white p-6 shadow-[0_24px_70px_rgba(36,52,104,0.07)] lg:col-span-6">
      <PanelHeader title="Exam Readiness" subtitle="Blended score from volume, accuracy, and streak" />
      <div className="mt-7 grid gap-6 md:grid-cols-[13rem_minmax(0,1fr)]">
        <div className="grid place-items-center">
          <ProgressRing value={prepPercent || 85} size={138} colors={["#4389ff", "#7957ff"]} label="Ready" />
        </div>
        <div className="space-y-5">
          <ReadinessRow label="Consistency" value={90} color="#1ebf91" icon={Medal} />
          <ReadinessRow label="Accuracy" value={admissionProbability} color="#3478ff" icon={Target} />
          <ReadinessRow label="Practice Volume" value={78} color="#8057ff" icon={Zap} />
        </div>
      </div>
      <div className="mt-6 rounded-[0.9rem] bg-[#f7f8ff] p-4 text-sm leading-6 text-[#4d5a83]">
        Focus on {weakTopic} today. One consistent session will move readiness to the next level.
      </div>
    </section>
  );
}

function MissionCard({ missionTime, topic, dailyGoalPercent, targetUniversity }: { missionTime: number; topic: string; dailyGoalPercent: number; targetUniversity: string }) {
  const objectives = ["Review core concept", "Solve timed practice", "Log mistakes"];
  return (
    <section className="rounded-[1.3rem] border border-[#e4e9f6] bg-white p-6 shadow-[0_24px_70px_rgba(36,52,104,0.07)] lg:col-span-4">
      <PanelHeader title="Today's AI Plan" subtitle={`${missionTime} minutes - high priority`} />
      <div className="mt-5 rounded-[1rem] bg-gradient-to-br from-[#f2f7ff] to-[#f7f1ff] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#68749c]">Recommended Subject</p>
        <p className="mt-2 font-display text-2xl font-bold text-[#07102e]">{topic}</p>
        <p className="mt-2 text-sm leading-6 text-[#53618d]">Best next action for improving {targetUniversity} prediction.</p>
      </div>
      <div className="mt-5 space-y-3">
        {objectives.map((objective, index) => (
          <div key={objective} className="flex items-center gap-3 rounded-[0.85rem] border border-[#edf1fa] px-3 py-3 text-sm font-semibold text-[#344065]">
            <span className={`grid h-6 w-6 place-items-center rounded-full ${index === 0 ? "bg-emerald-500 text-white" : "bg-[#eef2fb] text-[#69759f]"}`}>
              {index === 0 ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
            </span>
            {objective}
          </div>
        ))}
      </div>
      <Link href="/practice" className="pressable mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[0.85rem] bg-[#111a3a] text-sm font-bold text-white">
        Start Mission
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
      <p className="mt-3 text-center text-xs font-semibold text-[#69759f]">{dailyGoalPercent}% of today&apos;s goal complete</p>
    </section>
  );
}

function TopicPanel({ strong, weak }: { strong: Array<{ topic: string; mastery_percent: number }>; weak: Array<{ topic: string; mastery_percent: number }> }) {
  return (
    <section className="rounded-[1.3rem] border border-[#e4e9f6] bg-white p-6 shadow-[0_24px_70px_rgba(36,52,104,0.07)] lg:col-span-4">
      <PanelHeader title="Knowledge Map" subtitle="Strengths and blockers" />
      <div className="mt-5 grid gap-4">
        <TopicGroup title="Strengths" topics={strong} color="#1ebf91" />
        <TopicGroup title="Needs Focus" topics={weak} color="#ff805d" />
      </div>
    </section>
  );
}

function Recommendations({ items }: { items: Array<{ title: string; meta: string; icon: LucideIcon; href: string }> }) {
  return (
    <section className="rounded-[1.3rem] border border-[#e4e9f6] bg-white p-6 shadow-[0_24px_70px_rgba(36,52,104,0.07)] lg:col-span-4">
      <PanelHeader title="Recommended for you" subtitle="Personalized next actions" action="View all" />
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <Link key={item.title} href={item.href} className="group flex items-center gap-4 rounded-[1rem] bg-[#fafbff] p-4 transition hover:bg-[#f3f6ff]">
            <span className="grid h-11 w-11 place-items-center rounded-[0.85rem] bg-white text-blue-600 shadow-sm">
              <item.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-[#172247]">{item.title}</span>
              <span className="mt-1 block truncate text-xs text-[#69759f]">{item.meta}</span>
            </span>
            <ArrowRight className="ml-auto h-4 w-4 text-[#69759f] transition group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function UpcomingPanel({ deadlines }: { deadlines: Array<{ university: string; deadline_date: string }> }) {
  return (
    <section className="rounded-[1.3rem] border border-[#e4e9f6] bg-white p-6 shadow-[0_24px_70px_rgba(36,52,104,0.07)] lg:col-span-4">
      <PanelHeader title="Upcoming Mock Test" subtitle="Keep deadlines visible" action="View all" />
      <div className="mt-5 space-y-3">
        {deadlines.slice(0, 3).map((item) => (
          <div key={`${item.university}-${item.deadline_date}`} className="flex items-center gap-3 rounded-[1rem] bg-[#fafbff] p-4">
            <UniversityLogo university={item.university} size={34} />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#172247]">{item.university}</p>
              <p className="mt-1 text-xs text-[#69759f]">{formatDate(item.deadline_date)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CalendarPanel({ days }: { days: CalendarDay[] }) {
  return (
    <section className="rounded-[1.3rem] border border-[#e4e9f6] bg-white p-6 shadow-[0_24px_70px_rgba(36,52,104,0.07)] lg:col-span-4">
      <PanelHeader title="Study Calendar" subtitle="Days with completed sessions" />
      <div className="mt-5 grid grid-cols-7 gap-2 text-center text-[10px] font-bold uppercase text-[#7a86aa]">
        {weekdayLabels.map((label, i) => <span key={`${label}-${i}`}>{label}</span>)}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map((d) => (
          <div key={d.day} className={`grid aspect-square place-items-center rounded-[0.45rem] text-[11px] font-bold ${d.active ? "bg-emerald-100 text-emerald-700" : "bg-[#f1f4fb] text-[#97a1bf]"} ${d.isToday ? "ring-2 ring-blue-500" : ""}`}>
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
    <section className="rounded-[1.3rem] border border-[#e4e9f6] bg-white p-6 shadow-[0_24px_70px_rgba(36,52,104,0.07)] lg:col-span-8">
      <PanelHeader title="Recent Activity" subtitle="Latest learning events and account context" />
      <div className="mt-5 grid gap-4 md:grid-cols-[18rem_minmax(0,1fr)]">
        <dl className="rounded-[1rem] bg-[#fafbff] p-4 text-sm">
          <Info label="Email" value={email} />
          <Info label="Role" value={role} />
          <Info label="Member since" value={memberSince ? formatDate(memberSince) : "-"} />
        </dl>
        <div className="grid gap-3 sm:grid-cols-2">
          {recent.slice(0, 4).map((item) => (
            <div key={`${item.resource_id}-${item.viewed_at}`} className="rounded-[1rem] border border-[#edf1fa] p-4">
              <p className="truncate text-sm font-bold text-[#172247]">{friendlyResource(item.resource_type, item.resource_id)}</p>
              <p className="mt-1 text-xs text-[#69759f]">{item.resource_type.replace("_", " ")} - {formatDate(item.viewed_at)}</p>
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
        <h2 className="font-display text-lg font-bold text-[#07102e]">{title}</h2>
        <p className="mt-1 text-xs font-medium text-[#5f6b94]">{subtitle}</p>
      </div>
      {action && <span className="rounded-[0.65rem] border border-[#e2e8f6] px-3 py-2 text-xs font-bold text-blue-700">{action}</span>}
    </div>
  );
}

function ProgressRing({ value, size = 92, colors, label }: { value: number; size?: number; colors: string[]; label?: string }) {
  const normalized = Math.max(0, Math.min(100, value));
  const style = {
    background: `conic-gradient(${colors.join(", ")} ${normalized * 3.6}deg, #e9edf9 0deg)`,
    width: size,
    height: size,
  };
  return (
    <div className="grid place-items-center rounded-full p-3" style={style}>
      <div className="grid h-full w-full place-items-center rounded-full bg-white text-center shadow-inner">
        <span>
          <span className="block font-display text-2xl font-bold text-[#07102e]">{normalized}%</span>
          {label && <span className="block text-xs font-bold text-emerald-600">{label}</span>}
        </span>
      </div>
    </div>
  );
}

function GoalRow({ label, done, total, color, suffix = "" }: { label: string; done: number; total: number; color: string; suffix?: string }) {
  const percent = Math.min(100, Math.round((done / Math.max(1, total)) * 100));
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-[#344065]">{label}</span>
        <span className="font-mono text-[#4d5a83]">{done}{suffix} / {total}{suffix}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eef2fb]">
        <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${percent}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function ReadinessRow({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: LucideIcon }) {
  return (
    <div className="grid grid-cols-[2rem_minmax(0,1fr)_3rem] items-center gap-3">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f3f6ff]" style={{ color }}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div>
        <div className="flex justify-between text-sm font-semibold text-[#344065]">
          <span>{label}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eef2fb]">
          <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
        </div>
      </div>
      <span className="text-right text-sm font-bold text-[#07102e]">{value}%</span>
    </div>
  );
}

function TopicGroup({ title, topics, color }: { title: string; topics: Array<{ topic: string; mastery_percent: number }>; color: string }) {
  return (
    <div className="rounded-[1rem] bg-[#fafbff] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#69759f]">{title}</p>
      <div className="mt-3 space-y-3">
        {topics.map((topic) => (
          <div key={topic.topic}>
            <div className="flex justify-between text-sm font-semibold text-[#344065]">
              <span>{topic.topic}</span>
              <span>{topic.mastery_percent}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eef2fb]">
              <div className="h-full rounded-full" style={{ width: `${topic.mastery_percent}%`, backgroundColor: color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#e7ecf8] py-3 first:pt-0 last:border-0 last:pb-0">
      <dt className="text-[#69759f]">{label}</dt>
      <dd className="min-w-0 truncate text-right font-semibold text-[#172247]">{value}</dd>
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
