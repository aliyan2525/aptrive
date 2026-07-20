import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDashboardData } from "@/lib/dashboard-data";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Profile - Aptrive",
  description: "Student academic profile, achievements, badges, and learning statistics.",
};

const badges = ["7-day streak", "Algebra Sprint", "Mock Ready", "Precision 80"];

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/profile");

  const dashboard = await getDashboardData(user.id);
  const name =
    dashboard.studentProfile?.display_name ||
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Aptrive Student";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const activityTotal = dashboard.activity.reduce((sum, day) => sum + day.questions_attempted, 0);
  const correctTotal = dashboard.activity.reduce((sum, day) => sum + day.correct_count, 0);
  const accuracy = activityTotal ? Math.round((correctTotal / activityTotal) * 100) : 68;
  const xp = activityTotal * 12 + correctTotal * 18 + (dashboard.streak?.current_streak ?? 0) * 40;
  const level = Math.max(1, Math.floor(xp / 1000) + 1);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-graphite px-4 py-8 pb-24 md:px-6 md:py-10">
      <div className="container-aptrive">
        <section className="motion-card overflow-hidden rounded-md border border-line bg-panel">
          <div className="relative h-44 bg-[linear-gradient(135deg,rgba(35,213,196,0.35),rgba(201,162,75,0.2),rgba(11,14,19,0.9))]">
            <div className="absolute inset-x-8 bottom-6 hidden h-px bg-[repeating-linear-gradient(to_right,rgba(243,245,242,0.28)_0,rgba(243,245,242,0.28)_1px,transparent_1px,transparent_18px)] md:block" />
          </div>
          <div className="p-6 md:p-8">
            <div className="-mt-20 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-4 md:flex-row md:items-end">
                <div className="relative grid h-28 w-28 place-items-center overflow-hidden rounded-md border border-teal/40 bg-graphite font-display text-3xl font-semibold text-teal shadow-2xl">
                  <span className="absolute -left-6 top-2 h-20 w-20 rounded-full bg-teal-dim" />
                  <span className="absolute -right-5 bottom-0 h-16 w-16 rounded-full bg-gold-dim" />
                  <span className="relative">{initials}</span>
                </div>
                <div>
                  <div className="eyebrow">Student profile</div>
                  <h1 className="font-display mt-2 text-3xl font-semibold text-fg">{name}</h1>
                  <p className="mt-1 text-sm text-muted">{user.email}</p>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                    Focused entrance-test learner building speed, accuracy, and consistency across STEM practice.
                  </p>
                </div>
              </div>
              <Link href="/onboarding" className="pressable rounded-sm border border-line-strong px-4 py-2 text-sm font-semibold text-fg hover:border-teal/50">
                Edit study profile
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label="Target university" value={dashboard.studentProfile?.target_university ?? "NUST"} />
              <Metric label="Target program" value={dashboard.studentProfile?.target_program ?? "Computer Science"} />
              <Metric label="Level" value={`Level ${level}`} />
              <Metric label="XP" value={xp.toLocaleString()} />
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="motion-card rounded-md border border-line bg-panel p-6">
            <h2 className="font-display text-xl font-semibold text-fg">Academic summary</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Strongest recent progress is visible in completed practice volume and reviewed mistakes. Recommended next step: timed mixed practice with review after every incorrect attempt.
            </p>
            <div className="mt-6 space-y-4">
              <Progress label="Profile completion" value={dashboard.studentProfile ? 92 : 58} />
              <Progress label="Weekly goal" value={Math.min(100, Math.round((dashboard.weeklySummary.questionsAttempted / 120) * 100))} />
              <Progress label="Mock readiness" value={Math.min(100, Math.round(accuracy * 0.75))} />
            </div>
          </div>

          <div className="motion-card rounded-md border border-line bg-panel p-6">
            <h2 className="font-display text-xl font-semibold text-fg">Badges & achievements</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {badges.map((badge) => (
                <div key={badge} className="rounded-md border border-line bg-panel-2 p-4 transition-transform hover:-translate-y-1">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gold-dim text-gold">*</div>
                  <p className="mt-3 font-medium text-fg">{badge}</p>
                  <p className="mt-1 text-xs text-muted">Unlocked through consistent practice.</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <Metric label="Questions solved" value={activityTotal.toLocaleString()} />
          <Metric label="Overall accuracy" value={`${accuracy}%`} />
          <Metric label="Study streak" value={`${dashboard.streak?.current_streak ?? 0} days`} />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="motion-card rounded-md border border-line bg-panel p-6">
            <h2 className="font-display text-xl font-semibold text-fg">Weekly progress</h2>
            <div className="mt-5 grid grid-cols-7 gap-2">
              {dashboard.activity.slice(-14).map((day) => (
                <div key={day.activity_date} className="rounded-sm border border-line bg-panel-2 p-2">
                  <div className="h-20 rounded-sm bg-teal-dim" style={{ opacity: 0.18 + Math.min(0.7, day.questions_attempted / 45) }} />
                  <p className="mt-2 text-center font-mono-data text-[10px] text-muted">{day.questions_attempted}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="motion-card rounded-md border border-line bg-panel p-6">
            <h2 className="font-display text-xl font-semibold text-fg">Learning statistics</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <Info label="Weekly questions" value={dashboard.weeklySummary.questionsAttempted.toString()} />
              <Info label="Weekly accuracy" value={`${dashboard.weeklySummary.accuracyPercent}%`} />
              <Info label="Study hours" value={`${dashboard.weeklySummary.studyHours}h`} />
              <Info label="Joined" value={new Intl.DateTimeFormat("en-PK", { month: "short", year: "numeric" }).format(new Date(user.created_at))} />
            </dl>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="motion-card rounded-md border border-line bg-panel-2 p-5">
      <p className="text-xs uppercase tracking-wide text-muted-2">{label}</p>
      <p className="font-display mt-2 text-xl font-semibold text-fg">{value}</p>
    </div>
  );
}

function Progress({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-mono-data text-fg">{value}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-panel-2">
        <div className="h-full rounded-full bg-teal transition-all duration-700" style={{ width: `${value}%` }} />
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
