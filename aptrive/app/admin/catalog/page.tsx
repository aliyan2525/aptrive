import { revalidatePath } from "next/cache";
import {
  createChapter,
  createSubtopic,
  createTest,
  createTopic,
  createUniversity,
  deleteChapter,
  deleteSubtopic,
  deleteTest,
  deleteTopic,
  deleteUniversity,
} from "@/app/admin/catalog/actions";
import {
  listChaptersForAdmin,
  listSubjectsForAdmin,
  listSubtopicsForAdmin,
  listTestsForAdmin,
  listTopicsForAdmin,
  listUniversitiesForAdmin,
} from "@/lib/admin/catalog";

export default async function AdminCatalogPage() {
  const [universities, tests, subjects, chapters, topics, subtopics] = await Promise.all([
    listUniversitiesForAdmin(),
    listTestsForAdmin(),
    listSubjectsForAdmin(),
    listChaptersForAdmin(),
    listTopicsForAdmin(),
    listSubtopicsForAdmin(),
  ]);

  async function createUniversityAction(formData: FormData) {
    "use server";
    const name = String(formData.get("name") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    if (!name || !slug) throw new Error("University name and slug are required.");
    await createUniversity(name, slug, undefined, description || undefined);
    revalidatePath("/admin/catalog");
  }

  async function removeUniversityAction(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    if (!id) throw new Error("University id is required.");
    await deleteUniversity(id);
    revalidatePath("/admin/catalog");
  }

  async function createTestAction(formData: FormData) {
    "use server";
    const universityId = String(formData.get("universityId") ?? "");
    const name = String(formData.get("name") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    if (!name || !slug) throw new Error("Test name and slug are required.");
    await createTest(universityId || null, name, slug, description || undefined);
    revalidatePath("/admin/catalog");
  }

  async function removeTestAction(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    if (!id) throw new Error("Test id is required.");
    await deleteTest(id);
    revalidatePath("/admin/catalog");
  }

  async function createChapterAction(formData: FormData) {
    "use server";
    const subjectId = String(formData.get("subjectId") ?? "");
    const name = String(formData.get("name") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const orderIndex = Number(formData.get("orderIndex") ?? 0);
    if (!subjectId || !name || !slug) throw new Error("Subject, chapter name, and slug are required.");
    await createChapter(subjectId, name, slug, Number.isFinite(orderIndex) ? orderIndex : 0);
    revalidatePath("/admin/catalog");
  }

  async function removeChapterAction(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    if (!id) throw new Error("Chapter id is required.");
    await deleteChapter(id);
    revalidatePath("/admin/catalog");
  }

  async function createTopicAction(formData: FormData) {
    "use server";
    const chapterId = String(formData.get("chapterId") ?? "");
    const name = String(formData.get("name") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const orderIndex = Number(formData.get("orderIndex") ?? 0);
    if (!chapterId || !name || !slug) throw new Error("Chapter, topic name, and slug are required.");
    await createTopic(chapterId, name, slug, Number.isFinite(orderIndex) ? orderIndex : 0);
    revalidatePath("/admin/catalog");
  }

  async function removeTopicAction(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    if (!id) throw new Error("Topic id is required.");
    await deleteTopic(id);
    revalidatePath("/admin/catalog");
  }

  async function createSubtopicAction(formData: FormData) {
    "use server";
    const topicId = String(formData.get("topicId") ?? "");
    const name = String(formData.get("name") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const orderIndex = Number(formData.get("orderIndex") ?? 0);
    if (!topicId || !name || !slug) throw new Error("Topic, subtopic name, and slug are required.");
    await createSubtopic(topicId, name, slug, Number.isFinite(orderIndex) ? orderIndex : 0);
    revalidatePath("/admin/catalog");
  }

  async function removeSubtopicAction(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    if (!id) throw new Error("Subtopic id is required.");
    await deleteSubtopic(id);
    revalidatePath("/admin/catalog");
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="eyebrow">Catalog</div>
        <h1 className="font-display mt-2 text-3xl font-semibold text-fg">Manage taxonomy</h1>
        <p className="mt-2 text-sm text-muted">
          Universities, chapters, topics, and subtopics used across question authoring and learner practice.
        </p>
      </div>

      <section className="rounded-md border border-line bg-panel p-5">
        <h2 className="font-display text-lg text-fg">Universities</h2>
        <form action={createUniversityAction} className="mt-4 grid gap-3 md:grid-cols-3">
          <input name="name" placeholder="Name" className="rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg" required />
          <input name="slug" placeholder="slug" className="rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg" required />
          <input name="description" placeholder="Description (optional)" className="rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg" />
          <button type="submit" className="rounded-sm bg-teal px-4 py-2 text-sm font-semibold text-graphite md:col-span-3 md:w-fit">Add university</button>
        </form>
        <div className="mt-4 space-y-2">
          {universities.map((u) => (
            <div key={u.id} className="flex items-center justify-between rounded-sm border border-line px-3 py-2">
              <div className="text-sm text-fg">{u.name} <span className="text-xs text-muted">({u.slug})</span></div>
              <form action={removeUniversityAction}>
                <input type="hidden" name="id" value={u.id} />
                <button type="submit" className="text-xs text-muted hover:text-red-400">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-md border border-line bg-panel p-5">
        <h2 className="font-display text-lg text-fg">Tests</h2>
        <form action={createTestAction} className="mt-4 grid gap-3 md:grid-cols-4">
          <select name="universityId" className="rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg">
            <option value="">No specific university</option>
            {universities.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <input name="name" placeholder="Test name" className="rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg" required />
          <input name="slug" placeholder="slug" className="rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg" required />
          <input name="description" placeholder="Description (optional)" className="rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg" />
          <button type="submit" className="rounded-sm bg-teal px-4 py-2 text-sm font-semibold text-graphite md:col-span-4 md:w-fit">Add test</button>
        </form>
        <div className="mt-4 space-y-2">
          {tests.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-sm border border-line px-3 py-2">
              <div className="text-sm text-fg">{t.name} <span className="text-xs text-muted">({t.slug})</span></div>
              <form action={removeTestAction}>
                <input type="hidden" name="id" value={t.id} />
                <button type="submit" className="text-xs text-muted hover:text-red-400">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-md border border-line bg-panel p-5">
        <h2 className="font-display text-lg text-fg">Chapters</h2>
        <form action={createChapterAction} className="mt-4 grid gap-3 md:grid-cols-4">
          <select name="subjectId" className="rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg" required>
            <option value="">Select subject</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input name="name" placeholder="Chapter name" className="rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg" required />
          <input name="slug" placeholder="slug" className="rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg" required />
          <input name="orderIndex" type="number" defaultValue={0} className="rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg" />
          <button type="submit" className="rounded-sm bg-teal px-4 py-2 text-sm font-semibold text-graphite md:col-span-4 md:w-fit">Add chapter</button>
        </form>
        <div className="mt-4 space-y-2">
          {chapters.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-sm border border-line px-3 py-2">
              <div className="text-sm text-fg">{c.name} <span className="text-xs text-muted">({c.slug})</span></div>
              <form action={removeChapterAction}>
                <input type="hidden" name="id" value={c.id} />
                <button type="submit" className="text-xs text-muted hover:text-red-400">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-md border border-line bg-panel p-5">
        <h2 className="font-display text-lg text-fg">Topics</h2>
        <form action={createTopicAction} className="mt-4 grid gap-3 md:grid-cols-4">
          <select name="chapterId" className="rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg" required>
            <option value="">Select chapter</option>
            {chapters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input name="name" placeholder="Topic name" className="rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg" required />
          <input name="slug" placeholder="slug" className="rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg" required />
          <input name="orderIndex" type="number" defaultValue={0} className="rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg" />
          <button type="submit" className="rounded-sm bg-teal px-4 py-2 text-sm font-semibold text-graphite md:col-span-4 md:w-fit">Add topic</button>
        </form>
        <div className="mt-4 space-y-2">
          {topics.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-sm border border-line px-3 py-2">
              <div className="text-sm text-fg">{t.name} <span className="text-xs text-muted">({t.slug})</span></div>
              <form action={removeTopicAction}>
                <input type="hidden" name="id" value={t.id} />
                <button type="submit" className="text-xs text-muted hover:text-red-400">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-md border border-line bg-panel p-5">
        <h2 className="font-display text-lg text-fg">Subtopics</h2>
        <form action={createSubtopicAction} className="mt-4 grid gap-3 md:grid-cols-4">
          <select name="topicId" className="rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg" required>
            <option value="">Select topic</option>
            {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <input name="name" placeholder="Subtopic name" className="rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg" required />
          <input name="slug" placeholder="slug" className="rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg" required />
          <input name="orderIndex" type="number" defaultValue={0} className="rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg" />
          <button type="submit" className="rounded-sm bg-teal px-4 py-2 text-sm font-semibold text-graphite md:col-span-4 md:w-fit">Add subtopic</button>
        </form>
        <div className="mt-4 space-y-2">
          {subtopics.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-sm border border-line px-3 py-2">
              <div className="text-sm text-fg">{s.name} <span className="text-xs text-muted">({s.slug})</span></div>
              <form action={removeSubtopicAction}>
                <input type="hidden" name="id" value={s.id} />
                <button type="submit" className="text-xs text-muted hover:text-red-400">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
