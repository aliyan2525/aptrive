import { universities, type University } from "@/lib/universities";

export type UniversityExperience = {
  university: University;
  slug: string;
  identity: {
    signal: string;
    headline: string;
    subhead: string;
    visual: "planet" | "code" | "gold" | "atom" | "machine" | "network" | "signal";
    gradient: string;
    accent: string;
    textAccent: string;
    dark: string;
  };
  heroStats: { label: string; value: string }[];
  about: string;
  why: { title: string; body: string }[];
  programs: { title: string; detail: string; tag: string }[];
  roadmap: { title: string; body: string }[];
  merit: { year: string; value: number }[];
  fees: { title: string; value: string; detail: string }[];
  campus: { title: string; body: string }[];
  careers: { label: string; value: string }[];
  prep: { title: string; body: string }[];
  stories: { name: string; body: string }[];
  faq: { q: string; a: string }[];
};

const slugs: Record<string, string> = {
  nust: "nust",
  fast: "fast",
  comsats: "comsats",
  "uet-lahore": "uet",
  giki: "giki",
  pieas: "pieas",
  ned: "nedu",
  air: "air",
  bahria: "bahria",
  ist: "ist",
  umt: "umt",
  ucp: "ucp",
};

const profiles: Record<string, Omit<UniversityExperience, "university" | "slug">> = {
  nust: {
    identity: {
      signal: "Space, precision, research",
      headline: "Engineer your path into Pakistan's most competitive innovation ecosystem.",
      subhead: "A cinematic NUST prep experience for students aiming at NET, ACT, or SAT based admission with a precise merit plan.",
      visual: "planet",
      gradient: "from-slate-950 via-blue-950 to-slate-900",
      accent: "bg-cyan-300",
      textAccent: "text-cyan-300",
      dark: "text-white",
    },
    heroStats: [
      { label: "Test weight", value: "75%" },
      { label: "Academic weight", value: "25%" },
      { label: "Campuses", value: "Multi" },
    ],
    about: "NUST is a national science and technology university known for engineering, computing, business, architecture, biosciences, and applied research across its Islamabad and constituent campuses.",
    why: [
      { title: "Research-first culture", body: "Programs are shaped around laboratories, faculty-led projects, and applied problem solving." },
      { title: "National reach", body: "A multi-campus structure gives students access to specialized schools and diverse academic pathways." },
      { title: "Competitive peer group", body: "High entry standards create an ambitious environment for technical growth." },
    ],
    programs: [
      { title: "Engineering", detail: "Electrical, mechanical, civil, chemical, aerospace, and related schools.", tag: "NET" },
      { title: "Computing", detail: "Computer science, software engineering, AI, data science, and cyber tracks.", tag: "SE" },
      { title: "Business & social sciences", detail: "Management, economics, psychology, and public policy pathways.", tag: "S3H" },
    ],
    roadmap: [
      { title: "Diagnose NET standing", body: "Benchmark mathematics, physics, chemistry/computer, English, and intelligence sections." },
      { title: "Build topic mastery", body: "Prioritize weak chapters with high-frequency NET patterns and timed drills." },
      { title: "Simulate exam pressure", body: "Use full-length mocks to stabilize speed, accuracy, and attempt strategy." },
      { title: "Lock merit plan", body: "Use aggregate calculation and program targets to choose retake strategy." },
    ],
    merit: [
      { year: "2022", value: 78 },
      { year: "2023", value: 80 },
      { year: "2024", value: 82 },
      { year: "2025", value: 84 },
    ],
    fees: [
      { title: "Admission planning", value: "Merit-led", detail: "Costs vary by school and campus; confirm latest fee challan from NUST." },
      { title: "Scholarship lens", value: "Need/merit", detail: "Students should review university aid windows alongside admission deadlines." },
    ],
    campus: [
      { title: "H-12 ecosystem", body: "A modern Islamabad campus with labs, libraries, societies, hostels, and sports infrastructure." },
      { title: "Specialized schools", body: "Constituent colleges and schools create focused identities inside one university network." },
    ],
    careers: [
      { label: "Strong paths", value: "Tech, engineering, research" },
      { label: "Recruiter appeal", value: "High" },
      { label: "Graduate edge", value: "Portfolio + merit" },
    ],
    prep: [
      { title: "NET sprint", body: "Daily adaptive drills mapped to the NUST test blueprint." },
      { title: "Aggregate watcher", body: "Track academic and test contributions separately before each NET attempt." },
    ],
    stories: [
      { name: "Aptrive student", body: "Raised mock accuracy by treating each NET section as a separate performance system." },
      { name: "Gap-year applicant", body: "Used the final month to convert weak chapters into predictable marks." },
    ],
    faq: [
      { q: "Which formula does Aptrive use?", a: "NET/ACT/SAT 75%, SSC/O Level 10%, and HSSC/A Level 15%, with the final-year A Level equivalence rule handled in the calculator." },
      { q: "Should I prepare for multiple NET attempts?", a: "Most serious applicants plan multiple attempts and use each result to adjust weak-topic coverage." },
    ],
  },
  fast: {
    identity: {
      signal: "Code, algorithms, speed",
      headline: "Turn problem solving into admission-grade execution.",
      subhead: "A FAST-focused environment for computing applicants who need accuracy, speed, and a ruthless practice loop.",
      visual: "code",
      gradient: "from-sky-950 via-blue-900 to-cyan-800",
      accent: "bg-blue-300",
      textAccent: "text-blue-200",
      dark: "text-white",
    },
    heroStats: [
      { label: "Test profile", value: "50%" },
      { label: "FSc weight", value: "40%" },
      { label: "Campuses", value: "4+" },
    ],
    about: "FAST-NUCES is strongly associated with computer science, software engineering, electrical engineering, and industry-oriented technical education across major Pakistani cities.",
    why: [
      { title: "Coding culture", body: "Students encounter rigorous programming, projects, and algorithmic thinking early." },
      { title: "Industry gravity", body: "The FAST name carries particular weight in software teams and technology hiring." },
      { title: "High-velocity academics", body: "Semester pace rewards consistency, fundamentals, and disciplined practice." },
    ],
    programs: [
      { title: "Computer Science", detail: "Programming, systems, algorithms, AI, databases, and theory foundations.", tag: "CS" },
      { title: "Software Engineering", detail: "Product engineering, requirements, architecture, testing, and delivery.", tag: "SE" },
      { title: "Electrical Engineering", detail: "Circuits, signals, embedded systems, and computing-adjacent engineering.", tag: "EE" },
    ],
    roadmap: [
      { title: "Calibrate math speed", body: "Start with algebra, functions, trigonometry, and analytical reasoning under time pressure." },
      { title: "Build repetition loops", body: "Practice short timed sets until common pattern recognition becomes automatic." },
      { title: "Review like code", body: "Debug every wrong answer with cause, fix, and next drill." },
      { title: "Simulate the test", body: "Finish with mixed mocks and pacing targets." },
    ],
    merit: [
      { year: "2022", value: 62 },
      { year: "2023", value: 66 },
      { year: "2024", value: 69 },
      { year: "2025", value: 72 },
    ],
    fees: [
      { title: "Planning mode", value: "Campus-wise", detail: "Fee schedules can vary by program and admission cycle." },
      { title: "Aid signal", value: "Available", detail: "Review FAST financial aid and installment windows while applying." },
    ],
    campus: [
      { title: "Urban campuses", body: "Presence in major cities lets applicants choose proximity and campus culture." },
      { title: "Developer societies", body: "Programming competitions and tech clubs complement classroom intensity." },
    ],
    careers: [
      { label: "Hiring signal", value: "Software teams" },
      { label: "Portfolio need", value: "Very high" },
      { label: "Prep focus", value: "Math + logic" },
    ],
    prep: [
      { title: "Algorithmic math sets", body: "Timed drills for FAST-style quantitative reasoning." },
      { title: "Mistake compiler", body: "Aptrive turns repeated mistakes into a short daily repair queue." },
    ],
    stories: [
      { name: "CS applicant", body: "Moved from slow solving to reliable timed accuracy through repeated mixed sets." },
      { name: "Pre-engineering student", body: "Built an entrance-test routine around small daily problem batches." },
    ],
    faq: [
      { q: "Is FAST only for CS?", a: "FAST is especially known for computing, but it also offers engineering and management pathways." },
      { q: "What should I practice first?", a: "Start with math speed and reasoning, then move into full mixed tests." },
    ],
  },
};

const defaultProfile = (university: University): Omit<UniversityExperience, "university" | "slug"> => ({
  identity: {
    signal: "Admission intelligence",
    headline: `Build a focused preparation system for ${university.name}.`,
    subhead: `A premium university-specific roadmap for ${university.fullName}, combining merit planning, practice, and analytics.`,
    visual: "network",
    gradient: "from-slate-900 via-teal-900 to-slate-800",
    accent: "bg-teal-300",
    textAccent: "text-teal-200",
    dark: "text-white",
  },
  heroStats: [
    { label: "Formula", value: university.verified ? "Verified" : "Review" },
    { label: "Location", value: university.location.split(",")[0] },
    { label: "Plan", value: "Adaptive" },
  ],
  about: `${university.fullName} is presented here as a focused Aptrive preparation experience, helping students connect admission requirements, merit formula, and daily practice into one clear plan.`,
  why: [
    { title: "Focused roadmap", body: "Turn a broad admission goal into weekly milestones and measurable practice work." },
    { title: "Merit visibility", body: "See how academics and test performance combine before choosing your next move." },
    { title: "Practice alignment", body: "Prepare against the subjects and timing that matter for this university." },
  ],
  programs: [
    { title: "Engineering and computing", detail: "Technical pathways for applicants building strong quantitative foundations.", tag: "STEM" },
    { title: "Business and applied fields", detail: "Program availability varies by campus and admission cycle.", tag: "UG" },
    { title: "Test preparation", detail: "Aptrive adapts practice around the university's entrance pathway.", tag: "Prep" },
  ],
  roadmap: [
    { title: "Select target program", body: "Choose the campus and program before planning test strategy." },
    { title: "Calculate aggregate", body: "Use the official formula where confirmed, and verify uncertain details." },
    { title: "Practice weak topics", body: "Build a queue of high-impact concepts and timed MCQs." },
    { title: "Review and retake", body: "Use mock results to decide whether to revise, retake, or apply." },
  ],
  merit: [
    { year: "2022", value: 58 },
    { year: "2023", value: 61 },
    { year: "2024", value: 64 },
    { year: "2025", value: 67 },
  ],
  fees: [
    { title: "Fee planning", value: "Cycle-wise", detail: "Always confirm current tuition and admission charges from the official university portal." },
    { title: "Scholarships", value: "Check", detail: "Look for merit, need-based, and campus-specific aid windows." },
  ],
  campus: [
    { title: "Academic life", body: "Plan around classes, labs, societies, hostels, and commute realities." },
    { title: "Student support", body: "Use office hours, peer groups, and practice systems to stay consistent." },
  ],
  careers: [
    { label: "Outcome path", value: "Program-led" },
    { label: "Preparation", value: "Portfolio + tests" },
    { label: "Aptrive role", value: "Roadmap" },
  ],
  prep: [
    { title: "Diagnostic first", body: "Start by measuring strengths and weak topics." },
    { title: "Mock cadence", body: "Use timed mocks to turn preparation into decision-ready evidence." },
  ],
  stories: [
    { name: "Focused applicant", body: "Used a university-specific roadmap to keep preparation from becoming scattered." },
    { name: "Merit planner", body: "Balanced academic marks, test score targets, and program options before applying." },
  ],
  faq: [
    { q: "Are formulas final?", a: "Aptrive shows confirmed formulas where available, but applicants should always verify the latest admission cycle on the official website." },
    { q: "Can I use this for O/A Level?", a: "Use IBCC equivalence marks in the aggregate calculator where equivalence-based inputs are required." },
  ],
});

export const universityExperiences: UniversityExperience[] = universities.map((university) => ({
  university,
  slug: slugs[university.id] ?? university.id,
  ...(profiles[university.id] ?? defaultProfile(university)),
}));

export function getUniversityExperienceBySlug(slug: string) {
  const normalized = slug === "nust-net" ? "nust" : slug === "uet-lahore" ? "uet" : slug;
  return universityExperiences.find((experience) => experience.slug === normalized || experience.university.id === normalized);
}

export function getUniversityExperienceSlug(universityId: string) {
  return slugs[universityId] ?? universityId;
}
