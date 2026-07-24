import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

type Tables = Database["public"]["Tables"];
type Views = Database["public"]["Views"];
// DailyActivity kept as the shape name for the heatmap/weekly-summary
// data even though the source table changed — v_user_dashboard_summary
// (derived from user_attempts) is shaped identically to the legacy
// daily_activity row it replaces, so sampleActivity() and the
// downstream weeklySummary reducer below needed no changes.
type DailyActivity = Views["v_user_dashboard_summary"]["Row"];
type TopicProgress = Tables["user_topic_progress"]["Row"];
type GoalProgress = Tables["goal_progress"]["Row"];
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
  const twelveWeeksAgo = new Date();
  twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);

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
      .gte("activity_date", twelveWeeksAgo.toISOString().slice(0, 10))
      .order("activity_date", { ascending: true }),
    supabase
      .from("user_topic_progress")
      .select("*")
      .eq("user_id", userId)
      .order("mastery_percent", { ascending: false })
      .limit(6),
    supabase
      .from("user_topic_progress")
      .select("*")
      .eq("user_id", userId)
      .order("mastery_percent", { ascending: true })
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

  const activity = ((activityRes.data ?? []) as DailyActivity[]).length
    ? ((activityRes.data ?? []) as DailyActivity[])
    : sampleActivity();
  const totalsThisWeek = activity
    .filter((d) => {
      const diffDays = (Date.now() - new Date(d.activity_date).getTime()) / 86_400_000;
      return diffDays <= 7;
    })
    .reduce(
      (acc, d) => ({
        questions: acc.questions + d.questions_attempted,
        correct: acc.correct + d.correct_count,
        seconds: acc.seconds + d.study_seconds,
      }),
      { questions: 0, correct: 0, seconds: 0 }
    );

  const strongTopics = (masteryRes.data ?? []) as TopicProgress[];
  const strongTopicNames = new Set(strongTopics.map((t) => t.topic));
  const weakTopics = ((weakTopicsRes.data ?? []) as TopicProgress[]).filter(
    (t) => !strongTopicNames.has(t.topic)
  );

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
      questionsAttempted: totalsThisWeek.questions,
      accuracyPercent: totalsThisWeek.questions
        ? Math.round((totalsThisWeek.correct / totalsThisWeek.questions) * 100)
        : 0,
      studyHours: Math.round((totalsThisWeek.seconds / 3600) * 10) / 10,
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
