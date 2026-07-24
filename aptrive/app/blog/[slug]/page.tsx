import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import BlogCard from "@/components/blog/BlogCard";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import PostBody from "@/components/blog/PostBody";
import { blogPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Article not found — Aptrive" };
  return { title: `${post.title} — Aptrive Blog`, description: post.excerpt };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PK", { month: "long", day: "numeric", year: "numeric" }).format(
    new Date(value)
  );
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-graphite">
      <article className="container-aptrive max-w-3xl py-14 md:py-20">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Back to blog
        </Link>

        <p className="font-mono-data mt-6 text-xs uppercase tracking-[0.14em] text-teal">{post.category}</p>
        <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-2">
          <span>
            {post.author.name} &middot; {post.author.role}
          </span>
          <span>{formatDate(post.publishDate)}</span>
          <span>{post.readingTimeMinutes} min read</span>
        </div>

        <div className="mt-10">
          <PostBody blocks={post.body} />
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-line bg-panel-2 px-3 py-1 text-xs text-muted">
              #{tag}
            </span>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-line">
          <div className="container-aptrive py-14 md:py-20">
            <h2 className="font-display text-xl font-semibold text-fg">Related articles</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {related.map((item) => (
                <BlogCard key={item.slug} post={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-line">
        <div className="container-aptrive py-14 md:py-20">
          <NewsletterSignup />
        </div>
      </section>
    </main>
  );
}
