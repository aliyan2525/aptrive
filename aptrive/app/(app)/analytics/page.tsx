import * as React from "react";
import { redirect } from "next/navigation";
import { AIInsights } from "@/components/analytics/AIInsights";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/dashboard-data";

const PredictionEngine = dynamic(() => import("@/components/analytics/PredictionEngine").then((mod) => mod.PredictionEngine), {
  loading: () => <div className="grid h-64 place-items-center"><Loader2 className="h-6 w-6 animate-spin text-blue-500" aria-label="Loading prediction" /></div>,
});
const SubjectRadar = dynamic(() => import("@/components/analytics/SubjectRadar").then((mod) => mod.SubjectRadar), {
  loading: () => <div className="grid h-64 place-items-center"><Loader2 className="h-6 w-6 animate-spin text-blue-500" aria-label="Loading subject radar" /></div>,
});
const TrendChart = dynamic(() => import("@/components/analytics/TrendChart").then((mod) => mod.TrendChart), {
  loading: () => <div className="grid h-64 place-items-center"><Loader2 className="h-6 w-6 animate-spin text-blue-500" aria-label="Loading trend chart" /></div>,
});
const StudyHeatmap = dynamic(() => import("@/components/analytics/StudyHeatmap").then((mod) => mod.StudyHeatmap), {
  loading: () => <div className="grid h-64 place-items-center"><Loader2 className="h-6 w-6 animate-spin text-blue-500" aria-label="Loading study heatmap" /></div>,
});

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/analytics");

  const data = await getDashboardData(user.id);
  const questionsAttempted = data.weeklySummary.questionsAttempted;
  const accuracy = data.weeklySummary.accuracyPercent;
  const streak = data.streak?.current_streak ?? 0;
  const hasEvidence = questionsAttempted > 0 || data.topicMastery.length > 0 || data.weakTopics.length > 0;
  const readinessScore = hasEvidence
    ? Math.min(100, Math.round((questionsAttempted / 120) * 38 + accuracy * 0.37 + (streak / 14) * 25))
    : 0;
  const admissionProbability = hasEvidence ? Math.min(96, Math.max(0, readinessScore + 8)) : 0;
  const radarData = [...data.topicMastery, ...data.weakTopics]
    .slice(0, 5)
    .map((topic) => ({ subject: topic.name, score: Math.round(topic.masteryScore) }));
  const trendData = data.activity.slice(-6).map((day, index) => ({
    label: day.activity_date ? new Intl.DateTimeFormat("en-PK", { weekday: "short" }).format(new Date(day.activity_date)) : `W${index + 1}`,
    value: day.questions_attempted ? Math.round((day.correct_count / day.questions_attempted) * 100) : 0,
  }));
  const insights = hasEvidence
    ? [
        data.weakTopics[0] ? `${data.weakTopics[0].name} is your highest-priority review topic.` : "Keep building topic-level evidence with another focused session.",
        accuracy ? `Your recent accuracy is ${accuracy}%. Review incorrect answers before increasing session difficulty.` : "Complete more attempts to establish an accuracy baseline.",
        streak > 0 ? `${streak} day streak recorded. A short session today protects your momentum.` : "Start a focused session today to create your first momentum signal.",
      ]
    : [
        "Your first practice session will unlock topic-level analytics.",
        "Complete a few questions so Aptrive can estimate accuracy and readiness.",
        "Your dashboard will become more specific as you build a study history.",
      ];

  return (
    <main className="analytics-aurora min-h-screen px-4 pb-16 pt-24 md:px-8">
      <div className="container-aptrive">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="space-y-8"
        >
          <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-display-2 mb-2">Performance <span className="aurora-text">Analytics</span></h1>
              <p className="text-body-lg max-w-2xl">See how your real practice history is shaping accuracy, pace, and university readiness.</p>
            </div>
            <Link href="/practice" className="pressable inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-700 px-6 text-sm font-bold text-white shadow-[0_14px_32px_rgba(111,69,255,.2)] transition hover:-translate-y-0.5 hover:bg-violet-800">
              Start Practice
              <Zap className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <PredictionEngine
            admissionProbability={admissionProbability}
            estimatedAggregate={hasEvidence ? Math.min(100, Math.round((readinessScore * 0.72 + accuracy * 0.28) * 10) / 10) : 0}
            readinessScore={readinessScore}
            hasEvidence={hasEvidence}
          />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {radarData.length ? <SubjectRadar data={radarData} /> : <AnalyticsEmpty title="Topic map is waiting" body="Complete practice questions to see strengths and weak topics here." href="/practice" />}
            <AIInsights insights={insights} />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {trendData.length >= 2 ? <TrendChart data={trendData} /> : <AnalyticsEmpty title="Accuracy trend is waiting" body="Two or more activity days will create your first trend line." href="/practice" />}
            </div>
            <div className="lg:col-span-1"><StudyHeatmap activity={data.activity} /></div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function AnalyticsEmpty({ title, body, href }: { title: string; body: string; href: string }) {
  return (
    <section className="grid min-h-64 place-items-center rounded-[1.5rem] border border-dashed border-neutral-300 bg-white/60 p-8 text-center">
      <div>
        <p className="font-display text-xl font-semibold text-fg">{title}</p>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{body}</p>
        <Link href={href} className="mt-5 inline-flex rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white">Start a session</Link>
      </div>
    </section>
  );
}
