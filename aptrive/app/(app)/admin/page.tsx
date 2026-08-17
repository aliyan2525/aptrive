import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type RecentBatchRow = {
  id: string;
  file_name: string;
  status: string;
  total_rows: number;
  valid_rows: number;
  error_rows: number;
  created_at: string;
};

async function getContentHealth() {
  const supabase = await createClient();

  const [draft, inReview, published, archived, batches] = await Promise.all([
    supabase.from("questions").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("questions").select("id", { count: "exact", head: true }).eq("status", "in_review"),
    supabase.from("questions").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("questions").select("id", { count: "exact", head: true }).eq("status", "archived"),
    supabase
      .from("import_batches")
      .select("id, file_name, status, total_rows, valid_rows, error_rows, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    draft: draft.count ?? 0,
    inReview: inReview.count ?? 0,
    published: published.count ?? 0,
    archived: archived.count ?? 0,
    // Cast required: this project's hand-authored Database type has no
    // Relationships metadata, which the client's type builder needs
    // even for plain selects — see lib/admin/import.ts for the fuller
    // explanation and the convention this follows.
    recentBatches: (batches.data ?? []) as unknown as RecentBatchRow[],
  };
}

export default async function AdminDashboardPage() {
  const health = await getContentHealth();
  const total = health.draft + health.inReview + health.published + health.archived;

  const stats = [
    { label: "Published", value: health.published, accent: "text-teal" },
    { label: "In review", value: health.inReview, accent: "text-gold" },
    { label: "Draft", value: health.draft, accent: "text-fg" },
    { label: "Archived", value: health.archived, accent: "text-muted" },
  ];

  return (
    <div className="admin-aurora">
      <div className="eyebrow">Content operations</div>
      <h1 className="font-display mt-2 text-3xl font-semibold text-fg">Admin overview</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        {total.toLocaleString()} question{total === 1 ? "" : "s"} in the bank across all statuses.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="premium-shell rounded-[1.35rem] border border-white/80 bg-white/80 p-5 shadow-[0_18px_50px_rgba(46,39,97,.06)] backdrop-blur-xl">
            <p className="text-xs uppercase tracking-wide text-muted-2">{stat.label}</p>
            <p className={`font-mono-data mt-2 text-3xl font-semibold ${stat.accent}`}>
              {stat.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/catalog"
          className="group premium-shell rounded-[1.35rem] border border-white/80 bg-white/80 p-6 shadow-[0_18px_50px_rgba(46,39,97,.06)] transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_22px_60px_rgba(46,39,97,.10)]"
        >
          <p className="font-display text-lg font-semibold text-fg">Catalog</p>
          <p className="mt-1 text-sm text-muted">Manage chapters, topics, and question taxonomy.</p>
        </Link>
        <Link
          href="/admin/questions/new"
          className="group premium-shell rounded-[1.35rem] border border-white/80 bg-white/80 p-6 shadow-[0_18px_50px_rgba(46,39,97,.06)] transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_22px_60px_rgba(46,39,97,.10)]"
        >
          <p className="font-display text-lg font-semibold text-fg">Write a question</p>
          <p className="mt-1 text-sm text-muted">Create a single question by hand, with live preview.</p>
        </Link>
        <Link
          href="/admin/import"
          className="group premium-shell rounded-[1.35rem] border border-white/80 bg-white/80 p-6 shadow-[0_18px_50px_rgba(46,39,97,.06)] transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_22px_60px_rgba(46,39,97,.10)]"
        >
          <p className="font-display text-lg font-semibold text-fg">Bulk import</p>
          <p className="mt-1 text-sm text-muted">Upload a CSV of questions, validate, then commit.</p>
        </Link>
      </div>

      <div className="mt-10 premium-shell overflow-hidden rounded-[1.35rem] border border-white/80 bg-white/80 p-5 shadow-[0_18px_50px_rgba(46,39,97,.06)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div><span className="eyebrow">Latest activity</span><h2 className="mt-2 font-display text-xl font-semibold text-fg">Recent import batches</h2></div>
          <Link href="/admin/import" className="text-sm text-teal hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-neutral-200/80">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-muted-2">
              <tr>
                <th className="px-4 py-3">File</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Rows</th>
                <th className="px-4 py-3">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {health.recentBatches.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-muted">
                    No imports yet.
                  </td>
                </tr>
              )}
              {health.recentBatches.map((batch) => (
                <tr key={batch.id} className="border-t border-neutral-200/80">
                  <td className="px-4 py-3">
                    <Link href={`/admin/import/${batch.id}`} className="text-fg hover:text-teal">
                      {batch.file_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{batch.status}</td>
                  <td className="px-4 py-3 font-mono-data text-muted">
                    {batch.valid_rows}/{batch.total_rows} valid, {batch.error_rows} errors
                  </td>
                  <td className="px-4 py-3 text-muted-2">
                    {new Date(batch.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
