import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";
import { z } from "zod";

type Tables = Database["public"]["Tables"];
type Views = Database["public"]["Views"];
// Updated 2026-07-31: v_user_dashboard_summary in migration 0009 actually
// returns per-day aggregation for a user. We fetch the last 7 days
// and aggregate them in memory.
const DashboardSummarySchema = z.object({
  user_id: z.string().nullable(),
  activity_date: z.string().nullable(),
  questions_attempted: z.number().nullable(),
  correct_count: z.number().nullable(),
  study_seconds: z.number().nullable(),
  sessions_completed: z.number().nullable(),
});

// Local shape for the calendar/heatmap, matching the per-day activity rows
// returned by the dashboard RPC. Empty is a valid state for new learners.
type DailyActivity = {
  user_id: string;
  activity_date: string;
  questions_attempted: number;
  correct_count: number;
  study_seconds: number;
  sessions_completed: number;
};
const TopicMasteryRowSchema = z.object({
  user_id: z.string(),
  topic_id: z.string(),
  mastery_score: z.number().nullable(),
  questions_attempted: z.number().nullable(),
  topics: z.object({
    name: z.string()
  }).nullable()
});

// Clean shape actually returned to callers â€” deliberately doesn't leak
// the raw joined TopicProgress row (with its embed-only `topics` shape)
// into component props.
export type TopicMasterySummary = {
  topicId: string;
  name: string;
  masteryScore: number;
  questionsAttempted: number;
};
// FIXED 2026-07-28: `goal_progress` is a Postgres view on the live
// schema, not a table â€” indexing it via `Tables[...]` doesn't exist
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
 * layout shell. Every query is scoped to auth.uid() implicitly via RLS â€”
 * no user_id filters are trustable client-side, but adding them here too
 * keeps intent obvious and avoids relying solely on RLS during review.
 *
 * Migrated off topic_mastery/study_streaks/daily_activity (populated by
 * the retired `on_question_response_insert` trigger) onto their
 * user_attempts-derived equivalents: user_topic_progress, user_streaks,
 * and v_user_dashboard_summary. `achievements`/`user_achievements` was
 * deliberately left reading the original tables â€” nothing in either the
 * legacy or new attempt-recording path writes to user_achievements (no
 * trigger or RPC logic touches it in this codebase), so there's no
 * "goes stale" risk to migrate away from; see
 * PRACTICE_MIGRATION_WRITEUP.md for this scope decision.
 */
export async function getDashboardData(userId: string) {
  const supabase = await createClient();


  const { data: rpcData, error } = await supabase.rpc("get_dashboard_data", { p_user_id: userId });
  
  if (error) {
    console.error("Dashboard RPC Error:", error);
  }

  // Cast the RPC return as any so we can safely destructure it
  // without depending on the generated typings (which need a db pull).
  const payload = (rpcData && typeof rpcData === "object" ? rpcData : {}) as {
    streak?: UserStreak | null;
    activity?: DailyActivity[];
    topic_mastery_strong?: TopicMasterySummary[];
    topic_mastery_weak?: TopicMasterySummary[];
    daily_goal?: GoalProgress | null;
    achievements?: UserAchievement[];
    deadlines?: AdmissionDeadline[];
    recently_viewed?: RecentlyViewed[];
    profile?: StudentProfile | null;
  };

  const streakRes = { data: payload.streak || null };
  const activityRes = { data: payload.activity || [] };
  const masteryRes = { data: payload.topic_mastery_strong || [] };
  const weakTopicsRes = { data: payload.topic_mastery_weak || [] };
  const goalRes = { data: payload.daily_goal || null };
  const achievementsRes = { data: payload.achievements || [] };
  const deadlinesRes = { data: payload.deadlines || [] };
  const recentRes = { data: payload.recently_viewed || [] };
  const studentProfileRes = { data: payload.profile || null };

  // Use the RPC activity rows as the single source of truth. When a new
  // student has no activity yet, return an empty list so the UI can explain
  // the state instead of manufacturing a study history.
  const activity = activityRes.data;
  const activityResData = DashboardSummarySchema.array().safeParse(activityRes.data);
  const summary = activityResData.success ? activityResData.data : [];
  const attemptsLast7Days = summary.reduce((acc, row) => acc + (row.questions_attempted || 0), 0);
  const correctLast7Days = summary.reduce((acc, row) => acc + (row.correct_count || 0), 0);

  // FIXED 2026-07-28: this was a second, separate reference to the
  // dead `topic` (text) column used for dedup â€” same underlying live
  // column is `topic_id` (uuid), so the dedup logic below is keyed by
  // that instead. Also maps to the clean TopicMasterySummary shape
  // here (name pulled from the topics(name) embed added above) rather
  // than passing the raw table row on to the component â€” a mastery
  // row whose topic_id is null or whose topic was deleted has nothing
  // meaningful to show, so it's skipped entirely.
  const parseTopics = (data: unknown) => {
    const parsed = TopicMasteryRowSchema.array().safeParse(data);
    if (!parsed.success) return [];
    return parsed.data.map((row) => ({
      topicId: row.topic_id,
      name: row.topics?.name ?? "Unknown Topic",
      masteryScore: row.mastery_score ?? 0,
      questionsAttempted: row.questions_attempted ?? 0,
    })).filter((t) => t.topicId);
  };

  const strongTopics = parseTopics(masteryRes.data);
  const strongTopicIds = new Set(strongTopics.map((t) => t.topicId));
  const weakTopics = parseTopics(weakTopicsRes.data).filter((t) => !strongTopicIds.has(t.topicId));

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
      // (v_user_dashboard_summary has no study_seconds equivalent) â€”
      // flagged as a gap rather than fabricated from placeholder data.
      studyHours: 0,
    },
  };
}


