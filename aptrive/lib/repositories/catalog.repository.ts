import "server-only";
import { unstable_cache } from "next/cache";
import { createClient, createStaticClient } from "@/lib/supabase/server";
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

export const listSubjectsWithStats = unstable_cache(async (): Promise<SubjectWithStats[]> => {
  const supabase = createStaticClient();

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
}, ["catalog-subjects"], { revalidate: 3600, tags: ["catalog-subjects"] });

export const getSubjectBySlug = unstable_cache(async (slug: string) => {
  const supabase = createStaticClient();
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
}, ["catalog-subject"], { revalidate: 3600, tags: ["catalog-subject"] });

export const listPracticeSetsForSubject = unstable_cache(async (
  subjectId: string
): Promise<PracticeSetSummary[]> => {
  const supabase = createStaticClient();
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
    // FIXED 2026-07-28: `practice_sets.difficulty` is a plain text
    // column on the live schema (no DB enum backs it), so the real
    // generated type is `string`, not the app's narrower `Difficulty`
    // union — this cast makes that business-invariant assumption
    // explicit at the query boundary instead of relying on a
    // (previously inaccurate) hand-authored type to paper over it.
    difficulty: set.difficulty as PracticeSetSummary["difficulty"],
    questionCount: set.question_count,
    estimatedMinutes: set.estimated_minutes,
    isPremium: set.is_premium,
  }));
}, ["catalog-practice-sets"], { revalidate: 3600, tags: ["catalog-practice-sets"] });

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

  // FIXED 2026-07-28: `user_topic_progress` on the live database is
  // keyed by (user_id, topic_id uuid) with a `mastery_score` column —
  // not the (user_id, subject_id, topic text) + `mastery_percent`
  // shape this query used to assume. Confirmed directly against the
  // live schema via `supabase gen types typescript` (2026-07-28); the
  // old query was a guaranteed PostgREST 400 ("column does not
  // exist") on every /practice/subjects/[subjectSlug] page load, for
  // every visitor — this function is called directly (no try/catch)
  // from that page, so it surfaced the app/practice/error.tsx
  // boundary ("Something interrupted your session") in place of the
  // real page, not a silent degrade.
  //
  // Keying this map by topic_id (a real FK we already have on
  // `topics`) is also strictly more correct than the old
  // normalizeTopicKey(name) string-matching it replaces — no more
  // risk of two differently-named topics colliding or a rename
  // silently breaking the join.
  //
  // This also drops the `.eq("subject_id", subjectId)` filter that
  // was here before: `user_topic_progress` has no `subject_id` column
  // on the live table. Filtering by `.in("topic_id", topicIds)`
  // instead is equivalent in effect (topicIds is already scoped to
  // this subject's chapters) and doesn't depend on a column that
  // doesn't exist.
  const masteryByTopicId = new Map<
    string,
    Pick<TopicMasteryRow, "mastery_score" | "questions_attempted">
  >();
  if (userId && topicIds.length > 0) {
    const { data: masteryData, error: masteryError } = await supabase
      .from("user_topic_progress")
      .select("topic_id, mastery_score, questions_attempted")
      .eq("user_id", userId)
      .in("topic_id", topicIds);
    if (masteryError) throw masteryError;

    const masteryRows = (masteryData ?? []) as unknown as Pick<
      TopicMasteryRow,
      "topic_id" | "mastery_score" | "questions_attempted"
    >[];

    for (const row of masteryRows) {
      if (!row.topic_id) continue;
      masteryByTopicId.set(row.topic_id, {
        mastery_score: row.mastery_score,
        questions_attempted: row.questions_attempted,
      });
    }
  }

  const topicsByChapter = new Map<string, TopicPracticeSummary[]>();
  for (const topic of topics) {
    const mastery = masteryByTopicId.get(topic.id);
    const topicSummary: TopicPracticeSummary = {
      id: topic.id,
      name: topic.name,
      slug: topic.slug,
      questionCount: questionCounts.get(topic.id) ?? 0,
      // Renamed from the old `mastery_percent` (0-100 accuracy) to
      // `mastery_score` (the live table's ELO-style +5/-2 clamped
      // 0-100 metric — see record_attempt_and_update_progress). Same
      // output field name/shape for the UI (masteryPercent), but the
      // underlying number now means something different than it used
      // to on paper — worth a quick check with whoever owns the UI
      // copy on whether "mastery" framing still reads right here.
      masteryPercent: mastery?.mastery_score ?? null,
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
