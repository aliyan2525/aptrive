"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Trophy } from "lucide-react";
import type { getDashboardData } from "@/lib/dashboard-data";
import BentoCard from "./BentoCard";
import ComingSoonCard from "./ComingSoonCard";
import PerformanceTrend from "./PerformanceTrend";

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

const quotes = [
  "Small, consistent sessions compound into admission-day confidence.",
  "Your strongest score is built one reviewed mistake at a time.",
  "Precision beats panic. Practice with intent today.",
];

const aiRecommendations = [
  "Review algebra weak spots before attempting another timed mock.",
  "Spend 20 minutes on Physics formulas, then solve a short mixed set.",
  "Take one English comprehension passage under strict timing.",
];

const quickActions = [
  { href: "/practice", title: "Resume Last Practice", meta: "Mixed STEM set - 18 min" },
  { href: "/library/mathematics", title: "Continue Learning", meta: "Algebra mastery path" },
  { href: "/leaderboard", title: "Check Ranking", meta: "Weekly leaderboard" },
  { href: "/calculator", title: "Estimate Merit", meta: "University aggregate" },
];

const weekdayLabels = ["S", "M", "T", "W", "T", "F", "S"];

/**
 * Time-of-day greeting. Kept out of the initial render (see the
 * "Welcome back" default + useEffect below) so the server-rendered
 * HTML and the first client render always match — computing this
 * directly from `new Date()` during render would read the server's
 * clock/timezone on the first paint and the visitor's on hydration,
 * which can disagree and trigger a hydration mismatch.
 */
function getGreeting(hour: number) {
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}

function getStreakLine(streak: number) {
  if (streak <= 0) return "Start today's session to begin a new streak.";
  if (streak === 1) return "1-day streak — keep it going tomorrow.";
  if (streak < 7) return `${streak}-day streak — you're building real momentum.`;
  if (streak < 30) return `${streak}-day streak. That's real consistency.`;
  return `${streak}-day streak. That's elite-level discipline.`;
}

interface CalendarDay {
  day: number;
  active: boolean;
  isToday: boolean;
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
  const quote = quotes[new Date().getDay() % quotes.length];

  // See getGreeting's comment: default matches what the server renders,
  // then swaps to the visitor's local time after mount.
  const [greeting, setGreeting] = useState("Welcome back");
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  useEffect(() => {
    // Deliberately deferred: this reads the visitor's local clock, which
    // must not run during SSR/first-paint or it will disagree with the
    // server's render and trigger a hydration mismatch. This is the
    // standard fix for that, not the "derived state" anti-pattern the
    // react-hooks/set-state-in-effect rule normally targets.
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

    // Same rationale as the greeting effect above: "today" and "this
    // month" must be read from the visitor's clock, not the server's.
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

  const prepPercent = Math.min(
    100,
    Math.round(
      (data.weeklySummary.questionsAttempted / 120) * 45 +
        data.weeklySummary.accuracyPercent * 0.35 +
        (streak / 14) * 20
    )
  );
  const activity = data.activity.slice(-28);
  const maxQuestions = Math.max(1, ...activity.map((day) => day.questions_attempted));
  const strongTopics = data.topicMastery.slice(0, 3);
  const weakTopics = data.weakTopics.slice(0, 3);
  const dailyGoalPercent = data.dailyGoal
    ? Math.min(
        100,
        Math.round(
          ((data.dailyGoal.completed_questions / Math.max(1, data.dailyGoal.target_questions)) +
            (data.dailyGoal.completed_minutes / Math.max(1, data.dailyGoal.target_minutes))) *
            50
        )
      )
    : 42;

  const kpis = [
    { label: "Study streak", value: `${streak} days`, tone: "teal" },
    { label: "Accuracy", value: `${data.weeklySummary.accuracyPercent}%`, tone: "gold" },
    { label: "Study hours", value: `${data.weeklySummary.studyHours}h`, tone: "teal" },
    { label: "Questions solved", value: data.weeklySummary.questionsAttempted.toString(), tone: "gold" },
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-graphite px-4 py-8 pb-24 md:px-6 md:py-10">
      <div className="container-aptrive grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Row 1 — Welcome card + Daily goal */}
        <div className="motion-card rounded-md border border-line bg-[linear-gradient(135deg,rgba(35,213,196,0.16),rgba(201,162,75,0.08),rgba(18,22,29,0.9))] p-6 md:p-8 lg:col-span-8">
          <div className="eyebrow">Learning command center</div>
          <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg md:text-5xl">
            {greeting}, {firstName}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            {getStreakLine(streak)} {quote}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/practice" className="pressable glow-on-hover rounded-sm bg-teal px-4 py-2 text-sm font-semibold text-graphite">
              Continue studying
            </Link>
            <Link href="/onboarding" className="pressable rounded-sm border border-line-strong px-4 py-2 text-sm font-semibold text-fg hover:border-teal/50">
              Personalize plan
            </Link>
          </div>
        </div>

        <BentoCard className="lg:col-span-4" bodyClassName="mt-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-2">Today&apos;s goal</p>
              <p className="font-display mt-2 text-2xl font-semibold text-fg">{dailyGoalPercent}% complete</p>
            </div>
            <ProgressRing value={dailyGoalPercent} color="var(--teal)" />
          </div>
          <div className="mt-5 space-y-3 text-sm text-muted">
            <GoalRow label="Questions" done={data.dailyGoal?.completed_questions ?? 18} total={data.dailyGoal?.target_questions ?? 40} />
            <GoalRow label="Study minutes" done={data.dailyGoal?.completed_minutes ?? 35} total={data.dailyGoal?.target_minutes ?? 90} />
          </div>
        </BentoCard>

        {/* Row 2 — Core stat cells */}
        {kpis.map((kpi, index) => (
          <BentoCard
            key={kpi.label}
            className="col-span-1 sm:col-span-6 lg:col-span-3"
            style={{ animationDelay: `${index * 35}ms` }}
          >
            <p className="text-xs uppercase tracking-wide text-muted-2">{kpi.label}</p>
            <p className={`font-display mt-2 text-2xl font-semibold ${kpi.tone === "teal" ? "text-teal" : "text-gold"}`}>
              {kpi.value}
            </p>
          </BentoCard>
        ))}

        {/* Row 3 — Performance trends + exam readiness */}
        <PerformanceTrend activity={activity} />

        <BentoCard title="Exam readiness" subtitle="Blended score from volume, accuracy, and streak" className="lg:col-span-5">
          <div className="flex items-center gap-6">
            <ProgressRing value={prepPercent} color="var(--gold)" size={88} />
            <p className="text-sm leading-relaxed text-muted">
              {prepPercent >= 75
                ? "You're tracking well ahead of a typical prep pace. Keep protecting your streak."
                : prepPercent >= 45
                  ? "Solid progress. A little more volume this week will move this meaningfully."
                  : "Early days — a few consistent sessions will move this fast."}
            </p>
          </div>
        </BentoCard>

        {/* Row 4 — Strong / weak topics + university goal */}
        <BentoCard title="Strong topics" subtitle="Where you're performing best right now" className="lg:col-span-4">
          <TopicList topics={strongTopics.length ? strongTopics : fallbackStrong} tone="teal" />
        </BentoCard>

        <BentoCard title="Weak topics" subtitle="Where the next study block pays off most" className="lg:col-span-4">
          <TopicList topics={weakTopics.length ? weakTopics : fallbackWeak} tone="gold" />
        </BentoCard>

        <BentoCard title="University goal" subtitle="Your target, set in onboarding" className="lg:col-span-4">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="font-display text-xl font-semibold text-fg">
                {data.studentProfile?.target_university ?? "Not set yet"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {data.studentProfile?.target_university
                  ? "Your practice mix and mock recommendations are weighted toward this university's pattern."
                  : "Set a target university in onboarding to personalize your practice mix."}
              </p>
            </div>
            <Link href="/onboarding" className="mt-4 text-sm font-semibold text-teal hover:underline">
              {data.studentProfile?.target_university ? "Change target" : "Set target"} &gt;
            </Link>
          </div>
        </BentoCard>

        {/* Row 5 — Recommended practice + rankings */}
        <BentoCard title="Recommended for you" subtitle="Where to spend your next session" className="lg:col-span-6">
          <Link
            href="/practice"
            className="group flex items-center justify-between rounded-sm border border-teal/30 bg-teal-dim p-4"
          >
            <div>
              <p className="font-medium text-fg">Resume last practice</p>
              <p className="mt-1 text-sm text-muted">Mixed STEM set - 18 min remaining</p>
            </div>
            <span className="text-teal transition-transform group-hover:translate-x-1" aria-hidden="true">
              -&gt;
            </span>
          </Link>
          <div className="mt-3 space-y-3">
            {aiRecommendations.map((item) => (
              <div key={item} className="rounded-sm border border-line bg-panel-2 p-4 text-sm leading-relaxed text-muted">
                {item}
              </div>
            ))}
          </div>
        </BentoCard>

        <ComingSoonCard
          title="Rankings"
          subtitle="Leaderboard preview & rank prediction"
          icon={Trophy}
          message="Live rankings and a projected rank unlock once graded mock tests are available for every student — this won't show placeholder numbers in the meantime."
          cta={{ href: "/rankings", label: "See how rankings will work" }}
          className="lg:col-span-6"
        />

        {/* Row 6 — Study calendar + upcoming exams */}
        <BentoCard title="Study calendar" subtitle="Days with a completed session this month" className="lg:col-span-5">
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] uppercase tracking-wide text-muted-2">
            {weekdayLabels.map((label, i) => (
              <span key={`${label}-${i}`}>{label}</span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {(calendarDays.length ? calendarDays : placeholderCalendar).map((d) => (
              <div
                key={d.day}
                title={d.active ? `${d.day} — session completed` : `${d.day} — no session`}
                className={`relative grid aspect-square place-items-center rounded-sm border text-[11px] transition-colors duration-200 ${
                  d.active
                    ? "border-teal/40 bg-teal-dim text-fg"
                    : "border-line bg-panel-2 text-muted-2"
                } ${d.isToday ? "ring-1 ring-teal ring-offset-1 ring-offset-panel" : ""}`}
              >
                {d.day}
              </div>
            ))}
          </div>
        </BentoCard>

        <BentoCard title="Upcoming exams" subtitle="Keep application dates visible" className="lg:col-span-7">
          <div className="space-y-3">
            {(data.upcomingDeadlines.length ? data.upcomingDeadlines : fallbackDeadlines).map((item) => (
              <div key={`${item.university}-${item.deadline_date}`} className="flex justify-between gap-4 border-b border-line pb-3 text-sm last:border-0">
                <span className="text-fg">{item.university}</span>
                <span className="font-mono-data text-muted">{formatDate(item.deadline_date)}</span>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Row 7 — Weekly heatmap */}
        <BentoCard title="Weekly activity heatmap" subtitle="Questions attempted over the last 28 active days" className="lg:col-span-12">
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] uppercase tracking-wide text-muted-2 sm:grid-cols-14 lg:grid-cols-28">
            {activity.map((day) => (
              <div
                key={day.activity_date}
                title={`${day.activity_date}: ${day.questions_attempted} questions`}
                className="aspect-square rounded-sm border border-line transition-transform duration-200 [transition-timing-function:var(--ease-smooth)] hover:scale-110"
                style={{
                  backgroundColor: `rgba(35, 213, 196, ${0.12 + (day.questions_attempted / maxQuestions) * 0.65})`,
                }}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-end gap-2 text-[11px] text-muted-2">
            <span>Less</span>
            {[0.12, 0.3, 0.5, 0.77].map((alpha) => (
              <span
                key={alpha}
                className="h-3 w-3 rounded-sm border border-line"
                style={{ backgroundColor: `rgba(35, 213, 196, ${alpha})` }}
              />
            ))}
            <span>More</span>
          </div>
        </BentoCard>

        {/* Row 8 — Recent mock tests + recent activity */}
        <ComingSoonCard
          title="Recent mock tests"
          subtitle="Full-length, timed mock exam history"
          icon={ClipboardList}
          message="Mock exams aren't live yet, so there's no history to show honestly. This card will fill in with your last few attempts once mock tests launch."
          cta={{ href: "/mock-tests", label: "See what's planned" }}
          className="lg:col-span-6"
        />

        <BentoCard title="Recent activity" subtitle="Latest learning events and account context" className="lg:col-span-6">
          <div className="grid gap-4 md:grid-cols-2">
            <dl className="space-y-3 text-sm">
              <Info label="Email" value={email} />
              <Info label="Role" value={role} />
              <Info label="Member since" value={memberSince ? formatDate(memberSince) : "-"} />
            </dl>
            <div className="space-y-3">
              {(data.recentlyViewed.length ? data.recentlyViewed : fallbackRecent).map((item) => (
                <div key={`${item.resource_id}-${item.viewed_at}`} className="rounded-sm border border-line bg-panel-2 p-3">
                  <p className="text-sm font-medium text-fg">{friendlyResource(item.resource_type, item.resource_id)}</p>
                  <p className="mt-1 text-xs text-muted">{item.resource_type.replace("_", " ")} - {formatDate(item.viewed_at)}</p>
                </div>
              ))}
            </div>
          </div>
        </BentoCard>

        {/* Row 9 — Quick actions */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 lg:col-span-12">
          {quickActions.map((action, index) => (
            <Link
              key={action.title}
              href={action.href}
              className="motion-card group rounded-md border border-line bg-panel p-5"
              style={{ animationDelay: `${index * 45}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-lg font-semibold text-fg">{action.title}</p>
                  <p className="mt-2 text-sm text-muted">{action.meta}</p>
                </div>
                <span className="text-teal transition-transform group-hover:translate-x-1" aria-hidden="true">-&gt;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

// Rendered only for the first frame before the client-computed real
// calendar takes over in useEffect — see the comment on getGreeting.
const placeholderCalendar: CalendarDay[] = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  active: false,
  isToday: false,
}));

const fallbackStrong = [
  { topic: "Algebra", mastery_percent: 74 },
  { topic: "Kinematics", mastery_percent: 62 },
];

const fallbackWeak = [
  { topic: "Grammar", mastery_percent: 41 },
  { topic: "Verbal reasoning", mastery_percent: 35 },
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

function TopicList({
  topics,
  tone,
}: {
  topics: Array<{ topic: string; mastery_percent: number }>;
  tone: "teal" | "gold";
}) {
  return (
    <div className="space-y-4">
      {topics.map((item) => (
        <div key={item.topic}>
          <div className="flex justify-between text-sm">
            <span className="text-fg">{item.topic}</span>
            <span className="font-mono-data text-muted">{item.mastery_percent}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-panel-2">
            <div
              className={`h-full rounded-full transition-[width] duration-700 [transition-timing-function:var(--ease-smooth)] ${
                tone === "teal" ? "bg-teal" : "bg-gold"
              }`}
              style={{ width: `${item.mastery_percent}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProgressRing({ value, color, size = 80 }: { value: number; color: string; size?: number }) {
  const style = useMemo(
    () => ({ background: `conic-gradient(${color} ${value * 3.6}deg, var(--panel-2) 0deg)` }),
    [value, color]
  );
  const innerSize = size - 24;
  return (
    <div
      className="grid place-items-center rounded-full transition-[background] duration-700 [transition-timing-function:var(--ease-smooth)]"
      style={{ ...style, width: size, height: size }}
    >
      <div
        className="grid place-items-center rounded-full bg-panel text-sm font-semibold text-fg"
        style={{ width: innerSize, height: innerSize }}
      >
        {value}%
      </div>
    </div>
  );
}

function GoalRow({ label, done, total }: { label: string; done: number; total: number }) {
  const percent = Math.min(100, Math.round((done / Math.max(1, total)) * 100));
  return (
    <div>
      <div className="flex justify-between">
        <span>{label}</span>
        <span className="font-mono-data">{done}/{total}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-panel-2">
        <div
          className="h-full rounded-full bg-gold transition-[width] duration-700 [transition-timing-function:var(--ease-smooth)]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line pb-3 last:border-0">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right text-fg">{value}</dd>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PK", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function friendlyResource(type: string, id: string) {
  const label = id
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  return label || type.replace("_", " ");
}
