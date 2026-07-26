import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getSubjectBySlug,
  listSubjectChaptersWithTopics,
} from "@/lib/repositories/catalog.repository";
import { startTopicPractice } from "@/app/practice/actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subjectSlug: string }>;
}): Promise<Metadata> {
  const { subjectSlug } = await params;
  const subject = await getSubjectBySlug(subjectSlug);
  if (!subject) return {};
  return {
    title: `${subject.name} Practice — Aptrive`,
    description: subject.description ?? undefined,
  };
}

function masteryTone(value: number | null) {
  if (value === null) return "text-muted";
  if (value >= 80) return "text-teal";
  if (value >= 50) return "text-gold";
  return "text-red-400";
}

export default async function SubjectPracticePage({
  params,
}: {
  params: Promise<{ subjectSlug: string }>;
}) {
  const { subjectSlug } = await params;
  const subject = await getSubjectBySlug(subjectSlug);
  if (!subject || subject.is_coming_soon) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const chapters = await listSubjectChaptersWithTopics(subject.id, user?.id);

  async function startTopic(formData: FormData) {
    "use server";
    const topicId = String(formData.get("topicId") ?? "");
    const topicName = String(formData.get("topicName") ?? "");
    if (!topicId || !topicName) {
      throw new Error("Topic id and name are required.");
    }
    await startTopicPractice(topicId, topicName, subjectSlug);
  }

  return (
    <section className="container-aptrive py-16 md:py-24">
      <Link
        href="/practice/subjects"
        className="text-xs font-medium text-muted hover:text-teal"
      >
        ← All subjects
      </Link>

      <div className="mt-4 max-w-2xl">
        <div className="eyebrow">{subject.name}</div>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
          Practice by chapter and topic
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Start from any topic. Your accuracy updates the topic mastery profile after each question.
        </p>
      </div>

      <div className="mt-10 space-y-6">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="rounded-2xl border border-line bg-panel p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold text-fg">{chapter.name}</h2>
              <span className="font-mono-data text-xs text-muted">
                {chapter.totalQuestions} published questions
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {chapter.topics.map((topic) => (
                <div key={topic.id} className="rounded-xl border border-line bg-panel-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-fg">{topic.name}</p>
                      <p className="mt-1 text-xs text-muted">
                        {topic.questionCount} questions
                        {topic.questionsAttempted > 0
                          ? ` · ${topic.questionsAttempted} attempts`
                          : ""}
                      </p>
                    </div>
                    <div className={`font-mono-data text-xs ${masteryTone(topic.masteryPercent)}`}>
                      {topic.masteryPercent === null ? "No data" : `${topic.masteryPercent}% mastery`}
                    </div>
                  </div>

                  <form action={startTopic} className="mt-4">
                    <input type="hidden" name="topicId" value={topic.id} />
                    <input type="hidden" name="topicName" value={topic.name} />
                    <button
                      type="submit"
                      disabled={topic.questionCount === 0}
                      className="rounded-full bg-teal px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-graphite disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Practice topic
                    </button>
                  </form>
                </div>
              ))}

              {chapter.topics.length === 0 ? (
                <p className="text-sm text-muted">No topics in this chapter yet.</p>
              ) : null}
            </div>
          </div>
        ))}

        {chapters.length === 0 ? (
          <p className="text-sm text-muted">No chapters are configured for this subject yet.</p>
        ) : null}
      </div>
    </section>
  );
}
