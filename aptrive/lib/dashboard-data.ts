import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

type Tables = Database["public"]["Tables"];
type Views = Database["public"]["Views"];
// FLAGGED 2026-07-28: the comment this replaces claimed
// v_user_dashboard_summary is "shaped identically to the legacy
// daily_activity row it replaces" — confirmed FALSE against the live
// schema via `supabase gen types typescript`. The real view returns
// ONE row per user with lifetime/7-day aggregates
// (attempts_last_7_days, correct_last_7_days, current_streak,
// longest_streak, total_xp) — there is no activity_date, no per-day
// breakdown, and no study_seconds/sessions_completed at all. The old
// query's `.gte("activity_date", ...).order("activity_date", ...)`
// was a guaranteed PostgREST 400 on every dashboard load (a THIRD
// live bug in this function, on top of the two user_topic_progress
// ones — flagging this prominently rather than quietly patching it,
// since fixing it for real means deciding how daily/heatmap activity
// should be sourced now (e.g. a new view grouping user_attempts by
// day), which is a product/data-design call, not a type fix).
//
// Interim fix below: query the view for what it actually contains
// (a single per-user summary row), use its real fields for
// weeklySummary, and keep the day-by-day calendar/heatmap on
// sampleActivity() placeholder data until a real daily-granularity
// source exists — instead of throwing on every load.
type DashboardSummary = Views["v_user_dashboard_summary"]["Row"];
// Local shape for the calendar/heatmap, matching what sampleActivity()
// produces below (placeholder data until a real per-day source exists).
type DailyActivity = {
  user_id: string;
  activity_date: string;
  questions_attempted: number;
  correct_count: number;
  study_seconds: number;
  sessions_completed: number;
};
type TopicProgress = Tables["user_topic_progress"]["Row"] & {
  // From the `topics(name)` embed added below — nullable because a
  // left-join-style embed returns null if the topic_id FK is ever null
  // or the referenced topic was deleted.
  topics: { name: string } | null;
};
// Clean shape actually returned to callers — deliberately doesn't leak
// the raw joined TopicProgress row (with its embed-only `topics` shape)
// into component props.
export type TopicMasterySummary = {
  topicId: string;
  name: string;
  masteryScore: number;
  questionsAttempted: number;
};
// FIXED 2026-07-28: `goal_progress` is a Postgres view on the live
// schema, not a table — indexing it via `Tables[...]` doesn't exist
// on the real generated types (it happened to compile before only
// because the hand-authored database.types.ts incorrectly listed it
// under Tables too). No query behavior changes here, just the type
// source, since `.from("goal_progress")` works identically for a
// view at the PostgREST layer.
type GoalProgress = Views["goal_progress"]["Row"];
type UserStreak = Tables["user_streaks"]["Row"];
type AdmissionDeadline = Tables["admission_deadlines"]["Row"];
type RecentlyViewed = Tables["recently_viewed"]["Row"];
type StudentProfile = Tables["student_profiles"]["Row"];
type UserAchievement = Tables["user_achievements"]["Row"] & {
  achievements?: {
    name: string;
    icon: string | null;
    description: string | null;
  } | null;
};

/**
 * All dashboard reads, colocated so the page component stays a thin
 * layout shell. Every query is scoped to auth.uid() implicitly via RLS —
 * no user_id filters are trustable client-side, but adding them here too
 * keeps intent obvious and avoids relying solely on RLS during review.
 *
 * Migrated off topic_mastery/study_streaks/daily_activity (populated by
 * the retired `on_question_response_insert` trigger) onto their
 * user_attempts-derived equivalents: user_topic_progress, user_streaks,
 * and v_user_dashboard_summary. `achievements`/`user_achievements` was
 * deliberately left reading the original tables — nothing in either the
 * legacy or new attempt-recording path writes to user_achievements (no
 * trigger or RPC logic touches it in this codebase), so there's no
 * "goes stale" risk to migrate away from; see
 * PRACTICE_MIGRATION_WRITEUP.md for this scope decision.
 */
export async function getDashboardData(userId: string) {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [
    streakRes,
    activityRes,
    masteryRes,
    weakTopicsRes,
    goalRes,
    achievementsRes,
    deadlinesRes,
    recentRes,
    studentProfileRes,
  ] = await Promise.all([
    supabase.from("user_streaks").select("*").eq("user_id", userId).maybeSingle(),
    supabase
      .from("v_user_dashboard_summary")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle(),
    // FIXED 2026-07-28: `user_topic_progress` on the live database is
    // keyed by (user_id, topic_id uuid) with a `mastery_score` column —
    // not the `topic` (text)/`mastery_percent` shape this query used to
    // assume. Confirmed directly against the live schema via
    // `supabase gen types typescript` (2026-07-28). Ordering by
    // `mastery_percent` (a column that doesn't exist on this table) was
    // a guaranteed PostgREST 400 on every single dashboard load, for
    // every signed-in user — this function is called directly (no
    // try/catch) from app/dashboard/page.tsx, so it wasn't silently
    // degrading, it was surfacing the app/dashboard/error.tsx boundary
    // ("We couldn't load your dashboard") in place of the real page.
    //
    // Also added a `topics(name)` embed here: `topic_id` is just a
    // uuid, so without this join TopicList (below) has nothing to
    // render as the topic's label.
    supabase
      .from("user_topic_progress")
      .select("*, topics(name)")
      .eq("user_id", userId)
      .order("mastery_score", { ascending: false })
      .limit(6),
    supabase
      .from("user_topic_progress")
      .select("*, topics(name)")
      .eq("user_id", userId)
      .order("mastery_score", { ascending: true })
      .limit(5),
    supabase
      .from("goal_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("period", "daily")
      .eq("period_start", today)
      .maybeSingle(),
    supabase
      .from("user_achievements")
      .select("achievement_id, earned_at, achievements(name, icon, description)")
      .eq("user_id", userId)
      .order("earned_at", { ascending: false })
      .limit(5),
    supabase
      .from("admission_deadlines")
      .select("*")
      .gte("deadline_date", today)
      .order("deadline_date", { ascending: true })
      .limit(4),
    supabase
      .from("recently_viewed")
      .select("*")
      .eq("user_id", userId)
      .order("viewed_at", { ascending: false })
      .limit(5),
    supabase.from("student_profiles").select("*").eq("user_id", userId).maybeSingle(),
  ]);

  // The calendar/heatmap needs per-day data, which no live source
  // currently provides (see the FLAGGED comment above) — placeholder
  // data until that's designed, same as before when no rows came back.
  const activity = sampleActivity();
  const summary = activityRes.data as DashboardSummary | null;
  const attemptsLast7Days = summary?.attempts_last_7_days ?? 0;
  const correctLast7Days = summary?.correct_last_7_days ?? 0;

  // FIXED 2026-07-28: this was a second, separate reference to the
  // dead `topic` (text) column used for dedup — same underlying live
  // column is `topic_id` (uuid), so the dedup logic below is keyed by
  // that instead. Also maps to the clean TopicMasterySummary shape
  // here (name pulled from the topics(name) embed added above) rather
  // than passing the raw table row on to the component — a mastery
  // row whose topic_id is null or whose topic was deleted has nothing
  // meaningful to show, so it's skipped entirely.
  const toSummary = (t: TopicProgress): TopicMasterySummary | null => {
    if (!t.topic_id || !t.topics?.name) return null;
    return {
      topicId: t.topic_id,
      name: t.topics.name,
      masteryScore: t.mastery_score,
      questionsAttempted: t.questions_attempted,
    };
  };

  const strongTopics = ((masteryRes.data ?? []) as TopicProgress[])
    .map(toSummary)
    .filter((t): t is TopicMasterySummary => t !== null);
  const strongTopicIds = new Set(strongTopics.map((t) => t.topicId));
  const weakTopics = ((weakTopicsRes.data ?? []) as TopicProgress[])
    .map(toSummary)
    .filter((t): t is TopicMasterySummary => t !== null)
    .filter((t) => !strongTopicIds.has(t.topicId));

  return {
    streak: streakRes.data as UserStreak | null,
    activity,
    topicMastery: strongTopics,
    weakTopics,
    dailyGoal: goalRes.data as GoalProgress | null,
    achievements: (achievementsRes.data ?? []) as UserAchievement[],
    upcomingDeadlines: (deadlinesRes.data ?? []) as AdmissionDeadline[],
    recentlyViewed: (recentRes.data ?? []) as RecentlyViewed[],
    studentProfile: studentProfileRes.data as StudentProfile | null,
    weeklySummary: {
      questionsAttempted: attemptsLast7Days,
      accuracyPercent: attemptsLast7Days
        ? Math.round((correctLast7Days / attemptsLast7Days) * 100)
        : 0,
      // No live column currently tracks time spent
      // (v_user_dashboard_summary has no study_seconds equivalent) —
      // flagged as a gap rather than fabricated from placeholder data.
      studyHours: 0,
    },
  };
}

function sampleActivity(): DailyActivity[] {
  return Array.from({ length: 28 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (27 - index));
    const questions = [8, 14, 0, 22, 18, 34, 26][index % 7];
    return {
      user_id: "sample",
      activity_date: date.toISOString().slice(0, 10),
      questions_attempted: questions,
      correct_count: Math.round(questions * 0.68),
      study_seconds: questions * 95,
      sessions_completed: questions > 0 ? 1 : 0,
    };
  });
}
