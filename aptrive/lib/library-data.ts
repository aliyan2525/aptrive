// Mock content for the Question Library. Shaped so it can be swapped
// for a real API/DB (e.g. Supabase) later without changing consumers —
// components should only depend on these types and the exported arrays.

export type ContentType =
  | "mcq"
  | "topic-wise"
  | "chapter-wise"
  | "past-papers"
  | "solved-papers"
  | "mock-tests"
  | "formula-sheets"
  | "revision-notes"
  | "pdf"
  | "video"
  | "flashcards"
  | "ai-generated"
  | "daily-challenge";

export const contentTypeLabels: Record<ContentType, string> = {
  mcq: "Practice MCQs",
  "topic-wise": "Topic-wise Questions",
  "chapter-wise": "Chapter-wise Questions",
  "past-papers": "Past Papers",
  "solved-papers": "Solved Papers",
  "mock-tests": "Mock Tests",
  "formula-sheets": "Formula Sheets",
  "revision-notes": "Quick Revision Notes",
  pdf: "PDF Resources",
  video: "Video Lessons",
  flashcards: "Flashcards",
  "ai-generated": "AI-generated Practice",
  "daily-challenge": "Daily Challenge",
};

export type Difficulty = "Easy" | "Medium" | "Hard";

export type LibraryCategory = {
  slug: string;
  name: string;
  description: string;
  totalQuestions: number;
  difficultyDistribution: { easy: number; medium: number; hard: number };
  estimatedStudyTime: string;
  lastUpdated: string;
  practiceSets: number;
  comingSoon?: boolean;
};

export const categories: LibraryCategory[] = [
  {
    slug: "mathematics",
    name: "Mathematics",
    description: "Algebra, trigonometry, calculus, and coordinate geometry.",
    totalQuestions: 3200,
    difficultyDistribution: { easy: 35, medium: 45, hard: 20 },
    estimatedStudyTime: "48 hrs",
    lastUpdated: "2026-07-12",
    practiceSets: 64,
  },
  {
    slug: "physics",
    name: "Physics",
    description: "Mechanics, waves, electromagnetism, and modern physics.",
    totalQuestions: 2450,
    difficultyDistribution: { easy: 30, medium: 48, hard: 22 },
    estimatedStudyTime: "36 hrs",
    lastUpdated: "2026-07-10",
    practiceSets: 51,
  },
  {
    slug: "chemistry",
    name: "Chemistry",
    description: "Organic, inorganic, and physical chemistry fundamentals.",
    totalQuestions: 2180,
    difficultyDistribution: { easy: 38, medium: 42, hard: 20 },
    estimatedStudyTime: "32 hrs",
    lastUpdated: "2026-07-08",
    practiceSets: 47,
  },
  {
    slug: "english",
    name: "English",
    description: "Grammar, vocabulary, comprehension, and analogies.",
    totalQuestions: 1400,
    difficultyDistribution: { easy: 45, medium: 40, hard: 15 },
    estimatedStudyTime: "18 hrs",
    lastUpdated: "2026-07-05",
    practiceSets: 29,
  },
  {
    slug: "intelligence",
    name: "Intelligence / IQ",
    description: "Logical reasoning, pattern recognition, and analytical skills.",
    totalQuestions: 980,
    difficultyDistribution: { easy: 25, medium: 50, hard: 25 },
    estimatedStudyTime: "14 hrs",
    lastUpdated: "2026-07-01",
    practiceSets: 21,
  },
  {
    slug: "computer-science",
    name: "Computer Science",
    description: "Programming fundamentals, data structures, and computing logic.",
    totalQuestions: 760,
    difficultyDistribution: { easy: 40, medium: 40, hard: 20 },
    estimatedStudyTime: "12 hrs",
    lastUpdated: "2026-06-28",
    practiceSets: 16,
  },
  {
    slug: "biology",
    name: "Biology",
    description: "Human biology, botany, and zoology — for MDCAT preparation.",
    totalQuestions: 0,
    difficultyDistribution: { easy: 0, medium: 0, hard: 0 },
    estimatedStudyTime: "—",
    lastUpdated: "—",
    practiceSets: 0,
    comingSoon: true,
  },
  {
    slug: "general-knowledge",
    name: "General Knowledge",
    description: "Current affairs, Pakistan studies, and general awareness.",
    totalQuestions: 540,
    difficultyDistribution: { easy: 50, medium: 35, hard: 15 },
    estimatedStudyTime: "8 hrs",
    lastUpdated: "2026-06-20",
    practiceSets: 11,
  },
];

export type LibraryResource = {
  id: string;
  title: string;
  categorySlug: string;
  contentType: ContentType;
  university?: string; // e.g. NUST, FAST, COMSATS
  examTag?: string; // e.g. NET, ECAT, MDCAT
  topic: string;
  chapter?: string;
  difficulty: Difficulty;
  year?: number;
  language: "English" | "Urdu";
  solved: boolean;
  premium: boolean;
  questionCount: number;
  estimatedMinutes: number;
  updatedAt: string;
};

export const resources: LibraryResource[] = [
  {
    id: "math-topic-algebra-1",
    title: "Algebra — Topic-wise Practice Set 1",
    categorySlug: "mathematics",
    contentType: "topic-wise",
    university: "NUST",
    examTag: "NET",
    topic: "Algebra",
    chapter: "Quadratic Equations",
    difficulty: "Medium",
    language: "English",
    solved: true,
    premium: false,
    questionCount: 30,
    estimatedMinutes: 40,
    updatedAt: "2026-07-12",
  },
  {
    id: "math-past-nust-2025",
    title: "NUST NET Past Paper — 2025",
    categorySlug: "mathematics",
    contentType: "past-papers",
    university: "NUST",
    examTag: "NET",
    topic: "Mixed",
    difficulty: "Hard",
    year: 2025,
    language: "English",
    solved: true,
    premium: true,
    questionCount: 100,
    estimatedMinutes: 120,
    updatedAt: "2026-06-30",
  },
  {
    id: "math-formula-calc",
    title: "Calculus — Formula Sheet",
    categorySlug: "mathematics",
    contentType: "formula-sheets",
    topic: "Calculus",
    difficulty: "Easy",
    language: "English",
    solved: false,
    premium: false,
    questionCount: 0,
    estimatedMinutes: 15,
    updatedAt: "2026-07-01",
  },
  {
    id: "math-mock-1",
    title: "Full-length Mock Test — Mathematics",
    categorySlug: "mathematics",
    contentType: "mock-tests",
    university: "NUST",
    examTag: "NET",
    topic: "Mixed",
    difficulty: "Hard",
    language: "English",
    solved: false,
    premium: true,
    questionCount: 60,
    estimatedMinutes: 90,
    updatedAt: "2026-07-15",
  },
  {
    id: "math-daily-1",
    title: "Daily Challenge — Coordinate Geometry",
    categorySlug: "mathematics",
    contentType: "daily-challenge",
    topic: "Coordinate Geometry",
    difficulty: "Medium",
    language: "English",
    solved: false,
    premium: false,
    questionCount: 5,
    estimatedMinutes: 8,
    updatedAt: "2026-07-19",
  },
  {
    id: "phy-chapter-mechanics",
    title: "Mechanics — Chapter-wise Questions",
    categorySlug: "physics",
    contentType: "chapter-wise",
    university: "FAST-NUCES",
    examTag: "ECAT",
    topic: "Mechanics",
    chapter: "Newton's Laws",
    difficulty: "Medium",
    language: "English",
    solved: true,
    premium: false,
    questionCount: 25,
    estimatedMinutes: 35,
    updatedAt: "2026-07-09",
  },
  {
    id: "phy-video-em",
    title: "Electromagnetism — Video Lesson Series",
    categorySlug: "physics",
    contentType: "video",
    topic: "Electromagnetism",
    difficulty: "Medium",
    language: "English",
    solved: false,
    premium: true,
    questionCount: 0,
    estimatedMinutes: 55,
    updatedAt: "2026-06-25",
  },
  {
    id: "phy-flash-waves",
    title: "Waves & Oscillations — Flashcards",
    categorySlug: "physics",
    contentType: "flashcards",
    topic: "Waves",
    difficulty: "Easy",
    language: "English",
    solved: false,
    premium: false,
    questionCount: 40,
    estimatedMinutes: 20,
    updatedAt: "2026-07-02",
  },
  {
    id: "chem-solved-comsats",
    title: "COMSATS Entry Test — Solved Paper 2024",
    categorySlug: "chemistry",
    contentType: "solved-papers",
    university: "COMSATS",
    examTag: "NAT",
    topic: "Mixed",
    difficulty: "Hard",
    year: 2024,
    language: "English",
    solved: true,
    premium: true,
    questionCount: 50,
    estimatedMinutes: 60,
    updatedAt: "2026-06-18",
  },
  {
    id: "chem-notes-organic",
    title: "Organic Chemistry — Quick Revision Notes",
    categorySlug: "chemistry",
    contentType: "revision-notes",
    topic: "Organic Chemistry",
    difficulty: "Medium",
    language: "English",
    solved: false,
    premium: false,
    questionCount: 0,
    estimatedMinutes: 25,
    updatedAt: "2026-07-06",
  },
  {
    id: "eng-ai-vocab",
    title: "Vocabulary — AI-generated Practice Set",
    categorySlug: "english",
    contentType: "ai-generated",
    topic: "Vocabulary",
    difficulty: "Medium",
    language: "English",
    solved: false,
    premium: true,
    questionCount: 20,
    estimatedMinutes: 20,
    updatedAt: "2026-07-17",
  },
  {
    id: "eng-mcq-comprehension",
    title: "Reading Comprehension — Practice MCQs",
    categorySlug: "english",
    contentType: "mcq",
    topic: "Comprehension",
    difficulty: "Easy",
    language: "English",
    solved: true,
    premium: false,
    questionCount: 20,
    estimatedMinutes: 25,
    updatedAt: "2026-07-04",
  },
  {
    id: "iq-mcq-patterns",
    title: "Pattern Recognition — Practice MCQs",
    categorySlug: "intelligence",
    contentType: "mcq",
    topic: "Pattern Recognition",
    difficulty: "Hard",
    language: "English",
    solved: true,
    premium: false,
    questionCount: 25,
    estimatedMinutes: 30,
    updatedAt: "2026-06-29",
  },
  {
    id: "cs-topic-ds",
    title: "Data Structures — Topic-wise Questions",
    categorySlug: "computer-science",
    contentType: "topic-wise",
    university: "FAST-NUCES",
    topic: "Data Structures",
    difficulty: "Medium",
    language: "English",
    solved: true,
    premium: false,
    questionCount: 22,
    estimatedMinutes: 30,
    updatedAt: "2026-06-27",
  },
  {
    id: "gk-mcq-current-affairs",
    title: "Current Affairs 2026 — Practice MCQs",
    categorySlug: "general-knowledge",
    contentType: "mcq",
    topic: "Current Affairs",
    difficulty: "Easy",
    language: "English",
    solved: false,
    premium: false,
    questionCount: 30,
    estimatedMinutes: 25,
    updatedAt: "2026-07-14",
  },
];

export const universityTags = [
  "NUST",
  "FAST-NUCES",
  "COMSATS",
  "GIKI",
  "PIEAS",
];

export const examTags = ["NET", "ECAT", "MDCAT", "NAT"];

export const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];
