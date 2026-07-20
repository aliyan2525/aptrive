import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

type Tables = Database["public"]["Tables"];
type DailyActivity = Tables["daily_activity"]["Row"];
type TopicMastery = Tables["topic_mastery"]["Row"];
type GoalProgress = Tables["goal_progress"]["Row"];
type StudyStreak = Tables["study_streaks"]["Row"];
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
    goalRes,
    achievementsRes,
    deadlinesRes,
    recentRes,
    studentProfileRes,
  ] = await Promise.all([
    supabase.from("study_streaks").select("*").eq("user_id", userId).maybeSingle(),
    supabase
      .from("daily_activity")
      .select("*")
      .eq("user_id", userId)
      .gte("activity_date", twelveWeeksAgo.toISOString().slice(0, 10))
      .order("activity_date", { ascending: true }),
    supabase
      .from("topic_mastery")
      .select("*")
      .eq("user_id", userId)
      .order("mastery_percent", { ascending: false })
      .limit(6),
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

  return {
    streak: streakRes.data as StudyStreak | null,
    activity,
    topicMastery: (masteryRes.data ?? []) as TopicMastery[],
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
      id: `sample-${index}`,
      user_id: "sample",
      activity_date: date.toISOString().slice(0, 10),
      questions_attempted: questions,
      correct_count: Math.round(questions * 0.68),
      study_seconds: questions * 95,
      sessions_completed: questions > 0 ? 1 : 0,
    };
  });
}
