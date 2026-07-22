import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { listBookmarkedQuestionsWithDetails } from "@/lib/repositories/bookmarks.repository";
import { startAdHocSession } from "@/app/practice/actions";

export const metadata: Metadata = {
  title: "Bookmarks — Aptrive",
  description: "Questions you've saved for later.",
};

export default async function BookmarksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/practice/bookmarks");

  const bookmarks = await listBookmarkedQuestionsWithDetails(user.id);
  const questionIds = bookmarks.map((b) => b.questionId);

  async function practiceAll() {
    "use server";
    await startAdHocSession("bookmarks", questionIds);
  }

  return (
    <section className="container-aptrive py-16 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <div className="eyebrow">Bookmarks</div>
          <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
            Saved questions
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Questions you saved mid-session, all in one list.
          </p>
        </div>

        {questionIds.length > 0 ? (
          <form action={practiceAll}>
            <button
              type="submit"
              className="rounded-full bg-teal px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-graphite"
            >
              Practice all {questionIds.length}
            </button>
          </form>
        ) : null}
      </div>

      <div className="mt-10 divide-y divide-line border-y border-line">
        {bookmarks.map((q) => (
          <div key={q.questionId} className="flex items-center justify-between py-4">
            <div>
              <div className="text-xs uppercase tracking-[0.1em] text-muted">
                {q.subjectName ? `${q.subjectName} · ` : ""}
                {q.topic}
              </div>
              <p className="mt-1 max-w-xl text-sm text-fg">{q.prompt}</p>
            </div>
            <span className="shrink-0 font-mono-data text-xs text-muted">
              {q.difficulty}
            </span>
          </div>
        ))}

        {bookmarks.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">
            Nothing saved yet — tap the star on any question during practice
            to bookmark it.
          </p>
        ) : null}
      </div>
    </section>
  );
}
