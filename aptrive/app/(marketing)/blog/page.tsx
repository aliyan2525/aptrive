import type { Metadata } from "next";
import BlogListClient from "@/components/blog/BlogListClient";
import { getAllCategories, getAllPosts, getAllTags, getFeaturedPosts, getTrendingPosts } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog — Aptrive",
  description: "Practical, data-backed preparation guidance from the Aptrive team.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const featured = getFeaturedPosts();
  const trending = getTrendingPosts();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-graphite">
      <section className="border-b border-line">
        <div className="container-aptrive py-16 md:py-20">
          <span className="eyebrow">Aptrive Blog</span>
          <h1 className="text-display-2 mt-4 max-w-2xl text-fg">
            Practical, data-backed preparation guidance from the Aptrive team.
          </h1>
        </div>
      </section>

      <div className="container-aptrive py-12 md:py-16">
        <BlogListClient
          posts={posts}
          featured={featured}
          trending={trending}
          categories={categories}
          tags={tags}
        />
      </div>
    </main>
  );
}
