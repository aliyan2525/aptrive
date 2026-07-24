export type BlogCategory =
  | "Study Strategy"
  | "Learning Science"
  | "Exam Prep"
  | "University Guides"
  | "Mindset";

export type BlogContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; cite?: string };

export interface BlogPost {
  slug: string;
  title: string;
  category: BlogCategory;
  tags: string[];
  author: { name: string; role: string };
  /** ISO date string (YYYY-MM-DD). */
  publishDate: string;
  readingTimeMinutes: number;
  excerpt: string;
  featured?: boolean;
  trending?: boolean;
  /** Drives the gradient placeholder thumbnail — no image assets needed. */
  accent: "teal" | "gold";
  body: BlogContentBlock[];
}

/**
 * Editorial content for the blog, colocated as a typed array rather
 * than a CMS/database table — there's no blog backend in this repo
 * yet, and this keeps posts easy to add/edit without a migration.
 * To add a post: append an object here with a unique `slug`.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "12-week-net-prep-strategy",
    title: "How to Build a 12-Week NET Prep Strategy",
    category: "Study Strategy",
    tags: ["planning", "NUST NET", "study schedule"],
    author: { name: "Aptrive Team", role: "Curriculum" },
    publishDate: "2026-05-04",
    readingTimeMinutes: 8,
    excerpt:
      "A week-by-week structure for turning a fixed syllabus into a compounding daily practice habit.",
    featured: true,
    trending: true,
    accent: "teal",
    body: [
      {
        type: "paragraph",
        text: "Most students start NET prep with a syllabus and a deadline, and not much else. Twelve weeks feels like a long time until you're six weeks in and realize half the syllabus is untouched. A strategy beats a syllabus — here's a structure that holds up under real-life interruptions.",
      },
      { type: "heading", text: "Weeks 1-2: Diagnostic baseline" },
      {
        type: "paragraph",
        text: "Don't start with your strongest subject. Start with a full diagnostic across Math, Physics, English, and Chemistry so you know exactly where the gaps are before you commit study hours anywhere.",
      },
      { type: "heading", text: "Weeks 3-8: Topic-first practice" },
      {
        type: "list",
        items: [
          "Rank topics by (weight in exam) x (your weakness) — study the highest-scoring gaps first.",
          "Cap each session at 45-60 focused minutes; long unfocused sessions don't retain.",
          "Re-test a topic 5-7 days after first studying it, not the next day — spaced recall is what sticks.",
        ],
      },
      { type: "heading", text: "Weeks 9-11: Full mock cycles" },
      {
        type: "paragraph",
        text: "Switch from topic drills to full-length, timed mocks. The goal shifts from \"do I know this\" to \"can I retrieve this under time pressure and exam-day nerves.\"",
      },
      {
        type: "quote",
        text: "Practicing weak topics first instead of starting from chapter one saved me weeks of prep time.",
        cite: "Bilal Sheikh, NUST NET — Admitted, SCEE",
      },
      { type: "heading", text: "Week 12: Taper, don't cram" },
      {
        type: "paragraph",
        text: "Reduce volume, not intensity. Light review of your weakest topics and a full night's sleep will do more for your score than one more late-night mock.",
      },
    ],
  },
  {
    slug: "topic-mastery-vs-random-practice",
    title: "Topic Mastery vs Random Practice: What Works Better?",
    category: "Learning Science",
    tags: ["mastery", "spaced practice", "research"],
    author: { name: "Aptrive Team", role: "Learning Science" },
    publishDate: "2026-04-18",
    readingTimeMinutes: 6,
    excerpt:
      "Why chapter-order practice under-serves your weakest topics, and what to do instead.",
    featured: true,
    accent: "gold",
    body: [
      {
        type: "paragraph",
        text: "Working straight through a textbook feels productive because it's ordered and complete. It's also usually the slowest way to raise a score, because it spends equal time on topics you've already mastered and topics that are actually costing you marks.",
      },
      { type: "heading", text: "The problem with fixed order" },
      {
        type: "paragraph",
        text: "A syllabus is ordered for teaching, not for exam-score efficiency. Chapter 1 might be a topic you already know cold, while chapter 9 — the one you'll rush through at 11pm before test day — might carry more weight in the actual paper.",
      },
      { type: "heading", text: "What mastery-first practice does differently" },
      {
        type: "list",
        items: [
          "Every attempt updates a live mastery score per topic instead of a static \"completed / not completed\" checkbox.",
          "The next question is pulled from your weakest live topics, not the next chapter in line.",
          "Topics you've already mastered resurface occasionally (spaced review) instead of never again.",
        ],
      },
      {
        type: "paragraph",
        text: "The result isn't a shortcut — it's the same number of practice hours, redirected toward the marks that are actually still available to you.",
      },
    ],
  },
  {
    slug: "avoid-these-7-mistakes-last-month-prep",
    title: "Avoid These 7 Mistakes in Last-Month Preparation",
    category: "Exam Prep",
    tags: ["last-month", "mock tests", "time management"],
    author: { name: "Aptrive Team", role: "Curriculum" },
    publishDate: "2026-03-22",
    readingTimeMinutes: 5,
    excerpt:
      "The most common last-month errors that quietly cost students marks on test day.",
    featured: true,
    trending: true,
    accent: "teal",
    body: [
      {
        type: "list",
        items: [
          "Starting a new topic from scratch in the final two weeks instead of reinforcing what you already know.",
          "Doing untimed practice right up to the exam, so time pressure feels unfamiliar on test day.",
          "Skipping review of wrong answers — the review is where the actual learning happens, not the attempt itself.",
          "Pulling all-nighters in the final week, which hurts recall far more than the extra hour of study helps.",
          "Switching study materials late, which resets your sense of question style and pacing.",
          "Ignoring weaker subjects because they feel discouraging, even though marginal gains there are usually cheaper than more gains in a strong subject.",
          "Not simulating real exam conditions at least a few times — same seating, same timing, same break pattern.",
        ],
      },
      {
        type: "paragraph",
        text: "None of these are dramatic on their own. Together, in the final month, they're usually the difference between a good score and the score a student was actually capable of.",
      },
    ],
  },
  {
    slug: "choosing-between-nust-fast-giki",
    title: "NUST vs FAST vs GIKI: How to Actually Choose",
    category: "University Guides",
    tags: ["NUST", "FAST", "GIKI", "university choice"],
    author: { name: "Aptrive Team", role: "Admissions Guidance" },
    publishDate: "2026-02-10",
    readingTimeMinutes: 7,
    excerpt:
      "A practical comparison framework for one of the most common decisions Pakistani engineering applicants face.",
    accent: "gold",
    body: [
      {
        type: "paragraph",
        text: "\"Which one should I aim for\" is usually the wrong first question. The better first question is what you're optimizing for — because NUST, FAST, and GIKI actually reward slightly different profiles.",
      },
      { type: "heading", text: "If you're optimizing for program breadth" },
      {
        type: "paragraph",
        text: "NUST's constituent colleges offer the widest range of engineering and computing disciplines under one umbrella, which matters if you're still deciding between adjacent fields.",
      },
      { type: "heading", text: "If you're optimizing for a tight CS-focused cohort" },
      {
        type: "paragraph",
        text: "FAST is built around computing and business programs specifically, with a campus network across multiple cities — worth weighing if location flexibility matters to you.",
      },
      { type: "heading", text: "If you're optimizing for a residential, research-heavy environment" },
      {
        type: "paragraph",
        text: "GIKI's single-campus, residential model suits students who want a more immersive, engineering-research-first four years.",
      },
      {
        type: "paragraph",
        text: "In practice, most strong applicants prepare for all three entrance tests in parallel and let their actual merit position decide — which is exactly why cross-university-weighted mock scoring is worth using during prep.",
      },
    ],
  },
  {
    slug: "handling-exam-anxiety-before-test-day",
    title: "Handling Exam Anxiety Without Losing Your Prep Momentum",
    category: "Mindset",
    tags: ["anxiety", "test day", "mindset"],
    author: { name: "Aptrive Team", role: "Student Success" },
    publishDate: "2026-01-28",
    readingTimeMinutes: 5,
    excerpt:
      "Nerves before a high-stakes entrance test are normal — here's how to keep them from costing you marks.",
    accent: "teal",
    body: [
      {
        type: "paragraph",
        text: "Some pre-exam anxiety is a normal, even useful, signal that the test matters to you. The problem isn't the nervousness itself — it's when it starts eating into sleep, focus, or your ability to sit through a timed mock without panicking.",
      },
      { type: "heading", text: "In the final two weeks" },
      {
        type: "list",
        items: [
          "Keep at least one full-length timed mock per week so the format stays familiar, not novel.",
          "Protect sleep over squeezing in one more late study session.",
          "Rehearse your actual test-day logistics once — route, timing, what you'll bring — so nothing on the day itself is a surprise.",
        ],
      },
      { type: "heading", text: "On the day itself" },
      {
        type: "paragraph",
        text: "If a question stalls you, mark it and move on rather than letting it eat the clock for the rest of the section — you can always return to it. A blank moment on one question is recoverable; losing ten minutes to it usually isn't.",
      },
    ],
  },
  {
    slug: "reading-your-topic-mastery-analytics",
    title: "What Your Topic Mastery Analytics Are Actually Telling You",
    category: "Learning Science",
    tags: ["analytics", "mastery", "how-to"],
    author: { name: "Aptrive Team", role: "Curriculum" },
    publishDate: "2025-12-15",
    readingTimeMinutes: 6,
    excerpt:
      "A short guide to reading mastery percentages, streaks, and accuracy trends without over- or under-reacting to them.",
    trending: true,
    accent: "gold",
    body: [
      {
        type: "paragraph",
        text: "A mastery percentage is a moving estimate, not a grade. It's meant to guide where to study next, not to be a verdict on how smart you are at a subject.",
      },
      { type: "heading", text: "A dip usually means one of two things" },
      {
        type: "list",
        items: [
          "You attempted harder questions in that topic than before — mastery can dip even while you're genuinely improving.",
          "It's been a while since you last practiced it, and recall has faded a little — completely normal, and it's exactly what spaced review is for.",
        ],
      },
      {
        type: "paragraph",
        text: "The number worth watching over time isn't any single day's mastery score — it's the weekly trend across your weakest topics. A slow, steady climb there is a far better signal than any single session's result.",
      },
    ],
  },
];

const wordsPerMinute = 200;

export function estimateReadingTime(body: BlogContentBlock[]): number {
  const words = body.reduce((total, block) => {
    if (block.type === "list") return total + block.items.join(" ").split(/\s+/).length;
    return total + block.text.split(/\s+/).length;
  }, 0);
  return Math.max(1, Math.round(words / wordsPerMinute));
}

export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => b.publishDate.localeCompare(a.publishDate));
}

export function getLatestPosts(limit = 3): BlogPost[] {
  return getAllPosts().slice(0, limit);
}

export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts().filter((post) => post.featured);
}

export function getTrendingPosts(limit = 4): BlogPost[] {
  return getAllPosts()
    .filter((post) => post.trending)
    .slice(0, limit);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllCategories(): BlogCategory[] {
  return Array.from(new Set(blogPosts.map((post) => post.category)));
}

export function getAllTags(): string[] {
  return Array.from(new Set(blogPosts.flatMap((post) => post.tags))).sort();
}

export function searchPosts(query: string): BlogPost[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAllPosts();
  return getAllPosts().filter((post) =>
    [post.title, post.excerpt, post.category, ...post.tags].some((field) =>
      field.toLowerCase().includes(q)
    )
  );
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return getAllPosts()
    .filter((candidate) => candidate.slug !== post.slug)
    .filter(
      (candidate) =>
        candidate.category === post.category || candidate.tags.some((tag) => post.tags.includes(tag))
    )
    .slice(0, limit);
}
