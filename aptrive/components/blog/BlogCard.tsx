import Link from "next/link";
import { BookOpen, FlaskConical, GraduationCap, Sparkles, Target } from "lucide-react";
import Card from "@/components/ui/Card";
import type { BlogCategory, BlogPost } from "@/lib/blog-data";

const categoryIcon: Record<BlogCategory, typeof BookOpen> = {
  "Study Strategy": Target,
  "Learning Science": Sparkles,
  "Exam Prep": FlaskConical,
  "University Guides": GraduationCap,
  Mindset: BookOpen,
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PK", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(value)
  );
}

export default function BlogCard({ post, delay = 0 }: { post: BlogPost; delay?: number }) {
  const Icon = categoryIcon[post.category] ?? BookOpen;
  const gradient =
    post.accent === "teal"
      ? "from-teal-dim via-panel to-panel"
      : "from-gold-dim via-panel to-panel";

  return (
    <Card
      variant="interactive"
      padding="none"
      className="flex h-full flex-col overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient placeholder thumbnail — no image assets/CMS yet, so
          this stays a generated visual instead of a stock photo. */}
      <div className={`flex aspect-[16/9] items-center justify-center bg-gradient-to-br ${gradient}`}>
        <Icon className="h-10 w-10 text-teal" aria-hidden="true" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono-data text-xs uppercase tracking-[0.14em] text-teal">{post.category}</p>
        <h3 className="text-heading-2 mt-3 text-fg">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        <p className="text-body-sm mt-2 flex-1">{post.excerpt}</p>

        <div className="mt-5 flex items-center justify-between text-xs text-muted-2">
          <span>
            {post.author.name} &middot; {formatDate(post.publishDate)}
          </span>
          <span>{post.readingTimeMinutes} min read</span>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="mt-4 text-sm font-semibold text-teal hover:underline"
        >
          Read more &gt;
        </Link>
      </div>
    </Card>
  );
}
