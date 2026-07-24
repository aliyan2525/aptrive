"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import BlogCard from "@/components/blog/BlogCard";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import Reveal from "@/components/Reveal";
import type { BlogCategory, BlogPost } from "@/lib/blog-data";

export default function BlogListClient({
  posts,
  featured,
  trending,
  categories,
  tags,
}: {
  posts: BlogPost[];
  featured: BlogPost[];
  trending: BlogPost[];
  categories: BlogCategory[];
  tags: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<BlogCategory | "All">("All");
  const [tag, setTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesQuery =
        !q ||
        [post.title, post.excerpt, post.category, ...post.tags].some((field) =>
          field.toLowerCase().includes(q)
        );
      const matchesCategory = category === "All" || post.category === category;
      const matchesTag = !tag || post.tags.includes(tag);
      return matchesQuery && matchesCategory && matchesTag;
    });
  }, [posts, query, category, tag]);

  const showCurationRails = !query && category === "All" && !tag;

  return (
    <div className="space-y-14">
      {/* Search + filters */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full rounded-full border border-line bg-panel py-2.5 pl-10 pr-4 text-sm text-fg outline-none placeholder:text-muted-2 focus:border-teal/50"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterPill active={category === "All"} onClick={() => setCategory("All")}>
            All categories
          </FilterPill>
          {categories.map((c) => (
            <FilterPill key={c} active={category === c} onClick={() => setCategory(c)}>
              {c}
            </FilterPill>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(tag === t ? null : t)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                tag === t
                  ? "border-gold/40 bg-gold-dim text-fg"
                  : "border-line bg-panel-2 text-muted hover:text-fg"
              }`}
            >
              #{t}
            </button>
          ))}
        </div>
      </div>

      {showCurationRails && featured.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-semibold text-fg">Featured</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {featured.map((post, index) => (
              <Reveal key={post.slug} delay={index * 80}>
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {showCurationRails && trending.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-semibold text-fg">Trending</h2>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
            {trending.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="motion-card w-72 shrink-0 rounded-md border border-line bg-panel p-5"
              >
                <p className="font-mono-data text-xs uppercase tracking-wide text-teal">{post.category}</p>
                <p className="mt-2 text-sm font-semibold text-fg">{post.title}</p>
                <p className="mt-2 text-xs text-muted-2">{post.readingTimeMinutes} min read</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display text-xl font-semibold text-fg">
          {showCurationRails ? "All articles" : `${filtered.length} result${filtered.length === 1 ? "" : "s"}`}
        </h2>
        {filtered.length ? (
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {filtered.map((post, index) => (
              <Reveal key={post.slug} delay={index * 60}>
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-sm border border-line bg-panel-2 p-6 text-sm text-muted">
            No articles match that search yet — try a different keyword or clear the filters.
          </p>
        )}
      </section>

      <NewsletterSignup />
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
        active ? "border-teal/40 bg-teal-dim text-fg" : "border-line bg-panel text-muted hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}
