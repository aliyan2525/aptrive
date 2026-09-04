import Link from "next/link";
import { ArrowRight, FileText, PlayCircle } from "lucide-react";
import { contentTypeLabels, type LibraryResource } from "@/lib/library-data";
import LibraryExplorer from "./LibraryExplorer";

type LibraryCategory = {
  slug: string;
  name: string;
  description: string;
  totalQuestions: number;
  practiceSets: number;
  estimatedStudyTime: string;
  lastUpdated: string;
};

export function AuthenticatedLibraryCategory({ category, categoryResources }: { category: LibraryCategory; categoryResources: LibraryResource[] }) {
  return (
    <main className="app-content min-w-0 bg-[linear-gradient(180deg,#fbfdff,#f4f7ff)] px-3 py-5 text-fg sm:px-6 sm:py-8 lg:px-9">
      <div className="mx-auto max-w-[96rem]">
        <Link href="/library" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted hover:text-violet-700">← All resources</Link>
        <header className="mt-5 border-b border-line pb-6">
          <p className="eyebrow">Subject library</p>
          <h1 className="font-display mt-3 text-3xl font-semibold tracking-[-0.04em] text-fg sm:text-4xl">{category.name}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{category.description}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Questions" value={category.totalQuestions.toLocaleString()} />
            <Stat label="Practice sets" value={String(category.practiceSets)} />
            <Stat label="Study time" value={category.estimatedStudyTime} />
            <Stat label="Updated" value={category.lastUpdated} />
          </div>
        </header>
        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-700">Available now</p><h2 className="font-display mt-1 text-2xl font-semibold text-fg">Start a resource</h2></div><span className="text-xs font-semibold text-muted">{categoryResources.length} resources</span></div>
          <LibraryExplorer resources={categoryResources} />
        </section>
      </div>
    </main>
  );
}

export function AuthenticatedLibraryResource({ resource, categoryName }: { resource: LibraryResource; categoryName: string }) {
  const Icon = resource.contentType === "video" ? PlayCircle : FileText;
  return (
    <main className="app-content min-w-0 bg-[linear-gradient(180deg,#fbfdff,#f4f7ff)] px-3 py-5 text-fg sm:px-6 sm:py-8 lg:px-9">
      <div className="mx-auto max-w-4xl">
        <Link href={`/library/${resource.categorySlug}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted hover:text-violet-700">← Back to {categoryName}</Link>
        <article className="premium-shell mt-5 rounded-[1.5rem] bg-white/70 backdrop-blur-2xl p-5 shadow-[0_16px_46px_rgba(33,45,92,0.08)] sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted"><span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1.5 text-violet-700"><Icon className="h-3.5 w-3.5" /> {contentTypeLabels[resource.contentType]}</span><span>{resource.difficulty}</span><span>·</span><span>{resource.language}</span>{resource.examTag && <><span>·</span><span>{resource.examTag}</span></>}{resource.university && <><span>·</span><span>{resource.university}</span></>}</div>
          <h1 className="font-display mt-5 text-3xl font-semibold tracking-[-0.04em] text-fg sm:text-4xl">{resource.title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted">Topic: {resource.topic}{resource.chapter ? ` — ${resource.chapter}` : ""}.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3"><Stat label="Questions" value={resource.questionCount > 0 ? String(resource.questionCount) : "Reference"} /><Stat label="Time" value={`~${resource.estimatedMinutes} min`} /><Stat label="Updated" value={resource.updatedAt} /></div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/practice" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 text-sm font-semibold text-white hover:bg-violet-800">Open in Practice <ArrowRight className="h-4 w-4" /></Link><Link href={`/library/${resource.categorySlug}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/60 bg-white/70 backdrop-blur-lg px-5 text-sm font-semibold text-fg shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:border-violet-300">Browse more resources</Link></div>
        </article>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="premium-shell min-w-0 rounded-xl bg-white/70 backdrop-blur-xl p-3"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-2">{label}</p><p className="mt-1 truncate text-sm font-semibold text-fg">{value}</p></div>;
}

