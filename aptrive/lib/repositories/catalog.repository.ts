import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

type SubjectRow = Database["public"]["Tables"]["subjects"]["Row"];
type PracticeSetRow = Database["public"]["Tables"]["practice_sets"]["Row"];
type ChapterRow = Database["public"]["Tables"]["chapters"]["Row"];
type TopicRow = Database["public"]["Tables"]["topics"]["Row"];
type QuestionRow = Database["public"]["Tables"]["questions"]["Row"];
type TopicMasteryRow = Database["public"]["Tables"]["user_topic_progress"]["Row"];

export type SubjectWithStats = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  isComingSoon: boolean;
  practiceSetCount: number;
  questionCount: number;
};

export type PracticeSetSummary = {
  id: string;
  slug: string;
  title: string;
  topic: string;
  chapter: string | null;
  difficulty: "Easy" | "Medium" | "Hard";
  questionCount: number;
  estimatedMinutes: number;
  isPremium: boolean;
};

export type TopicPracticeSummary = {
  id: string;
  name: string;
  slug: string;
  questionCount: number;
  masteryPercent: number | null;
  questionsAttempted: number;
};

export type ChapterPracticeSummary = {
  id: string;
  name: string;
  slug: string;
  totalQuestions: number;
  topics: TopicPracticeSummary[];
};

/**
 * Catalog browsing: subjects with live counts pulled from the real
 * question bank (practice_sets / questions), replacing the static
 * lib/library-data.ts numbers for anything under /practice.
 *
 * Query results are cast to the hand-declared Row types immediately
 * after the Supabase call, matching the convention already used in
 * lib/dashboard-data.ts — the installed postgrest-js version doesn't
 * infer Row types from `.select()` strings against this hand-authored
 * Database type, so relying on inference resolves everything to
 * `never`.
 */
export async function listSubjectsWithStats(): Promise<SubjectWithStats[]> {
  const supabase = await createClient();

  const { data: subjectsData, error } = await supabase
    .from("subjects")
    .select("id, slug, name, description, is_coming_soon")
    .order("name", { ascending: true });

  if (error) throw error;
  const subjects = (subjectsData ?? []) as unknown as Pick<
    SubjectRow,
    "id" | "slug" | "name" | "description" | "is_coming_soon"
  >[];
  if (subjects.length === 0) return [];

  const { data: setsData, error: setsError } = await supabase
    .from("practice_sets")
    .select("subject_id, question_count");

  if (setsError) throw setsError;
  const sets = (setsData ?? []) as unknown as Pick<
    PracticeSetRow,
    "subject_id" | "question_count"
  >[];

  const statsBySubject = new Map<string, { sets: number; questions: number }>();
  for (const set of sets) {
    const entry = statsBySubject.get(set.subject_id) ?? { sets: 0, questions: 0 };
    entry.sets += 1;
    entry.questions += set.question_count ?? 0;
    statsBySubject.set(set.subject_id, entry);
  }

  return subjects.map((s) => {
    const stats = statsBySubject.get(s.id) ?? { sets: 0, questions: 0 };
    return {
      id: s.id,
      slug: s.slug,
      name: s.name,
      description: s.description,
      isComingSoon: s.is_coming_soon,
      practiceSetCount: stats.sets,
      questionCount: stats.questions,
    };
  });
}

export async function getSubjectBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subjects")
    .select("id, slug, name, description, is_coming_soon")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as Pick<
    SubjectRow,
    "id" | "slug" | "name" | "description" | "is_coming_soon"
  > | null;
}

export async function listPracticeSetsForSubject(
  subjectId: string
): Promise<PracticeSetSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("practice_sets")
    .select(
      "id, slug, title, topic, chapter, difficulty, question_count, estimated_minutes, is_premium"
    )
    .eq("subject_id", subjectId)
    .order("topic", { ascending: true });

  if (error) throw error;

  const sets = (data ?? []) as unknown as Pick<
    PracticeSetRow,
    | "id"
    | "slug"
    | "title"
    | "topic"
    | "chapter"
    | "difficulty"
    | "question_count"
    | "estimated_minutes"
    | "is_premium"
  >[];

  return sets.map((set) => ({
    id: set.id,
    slug: set.slug,
    title: set.title,
    topic: set.topic,
    chapter: set.chapter,
    difficulty: set.difficulty,
    questionCount: set.question_count,
    estimatedMinutes: set.estimated_minutes,
    isPremium: set.is_premium,
  }));
}

function normalizeTopicKey(value: string | null) {
  return (value ?? "").trim().toLowerCase();
}

export async function listSubjectChaptersWithTopics(
  subjectId: string,
  userId?: string
): Promise<ChapterPracticeSummary[]> {
  const supabase = await createClient();

  const { data: chaptersData, error: chaptersError } = await supabase
    .from("chapters")
    .select("id, name, slug, order_index")
    .eq("subject_id", subjectId)
    .order("order_index", { ascending: true })
    .order("name", { ascending: true });
  if (chaptersError) throw chaptersError;

  const chapters = (chaptersData ?? []) as unknown as Pick<
    ChapterRow,
    "id" | "name" | "slug" | "order_index"
  >[];
  if (chapters.length === 0) return [];

  const chapterIds = chapters.map((chapter) => chapter.id);
  const { data: topicsData, error: topicsError } = await supabase
    .from("topics")
    .select("id, chapter_id, name, slug, order_index")
    .in("chapter_id", chapterIds)
    .order("order_index", { ascending: true })
    .order("name", { ascending: true });
  if (topicsError) throw topicsError;
  const topics = (topicsData ?? []) as unknown as Pick<
    TopicRow,
    "id" | "chapter_id" | "name" | "slug" | "order_index"
  >[];

  const topicIds = topics.map((topic) => topic.id);
  const questionCounts = new Map<string, number>();
  if (topicIds.length > 0) {
    const { data: questionData, error: questionError } = await supabase
      .from("questions")
      .select("topic_id")
      .eq("subject_id", subjectId)
      .eq("status", "published")
      .in("topic_id", topicIds);
    if (questionError) throw questionError;

    const questionRows = (questionData ?? []) as unknown as Pick<QuestionRow, "topic_id">[];
    for (const row of questionRows) {
      if (!row.topic_id) continue;
      questionCounts.set(row.topic_id, (questionCounts.get(row.topic_id) ?? 0) + 1);
    }
  }

  const masteryByTopicName = new Map<string, Pick<TopicMasteryRow, "mastery_percent" | "questions_attempted">>();
  if (userId) {
    const { data: masteryData, error: masteryError } = await supabase
      .from("user_topic_progress")
      .select("topic, mastery_percent, questions_attempted")
      .eq("user_id", userId)
      .eq("subject_id", subjectId);
    if (masteryError) throw masteryError;

    const masteryRows = (masteryData ?? []) as unknown as Pick<
      TopicMasteryRow,
      "topic" | "mastery_percent" | "questions_attempted"
    >[];

    for (const row of masteryRows) {
      masteryByTopicName.set(normalizeTopicKey(row.topic), {
        mastery_percent: row.mastery_percent,
        questions_attempted: row.questions_attempted,
      });
    }
  }

  const topicsByChapter = new Map<string, TopicPracticeSummary[]>();
  for (const topic of topics) {
    const mastery = masteryByTopicName.get(normalizeTopicKey(topic.name));
    const topicSummary: TopicPracticeSummary = {
      id: topic.id,
      name: topic.name,
      slug: topic.slug,
      questionCount: questionCounts.get(topic.id) ?? 0,
      masteryPercent: mastery?.mastery_percent ?? null,
      questionsAttempted: mastery?.questions_attempted ?? 0,
    };

    const chapterTopics = topicsByChapter.get(topic.chapter_id) ?? [];
    chapterTopics.push(topicSummary);
    topicsByChapter.set(topic.chapter_id, chapterTopics);
  }

  return chapters.map((chapter) => {
    const chapterTopics = topicsByChapter.get(chapter.id) ?? [];
    return {
      id: chapter.id,
      name: chapter.name,
      slug: chapter.slug,
      totalQuestions: chapterTopics.reduce((sum, topic) => sum + topic.questionCount, 0),
      topics: chapterTopics,
    };
  });
}
