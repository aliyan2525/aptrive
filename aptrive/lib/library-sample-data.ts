// Placeholder library content — original descriptions, no copyrighted
// material. Shaped to match `practice_sets` so it can be inserted via
// the same seed pattern as supabase/seed.sql.

export type SampleResource = {
  title: string;
  subject: "Mathematics" | "Physics" | "English" | "Intelligence" | "Computer Science";
  chapter: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimated_minutes: number;
  tags: string[];
  description: string;
};

export const SAMPLE_RESOURCES: SampleResource[] = [
  {
    title: "Quadratic Equations — Foundations",
    subject: "Mathematics",
    chapter: "Algebra",
    topic: "Quadratic Equations",
    difficulty: "Easy",
    estimated_minutes: 20,
    tags: ["algebra", "roots", "discriminant"],
    description: "Core identities and root-finding methods, building from factoring to the quadratic formula.",
  },
  {
    title: "Sequences & Series — Mixed Practice",
    subject: "Mathematics",
    chapter: "Algebra",
    topic: "Sequences and Series",
    difficulty: "Medium",
    estimated_minutes: 30,
    tags: ["arithmetic", "geometric", "sums"],
    description: "Arithmetic and geometric progression problems, including sum-to-n-terms and infinite series.",
  },
  {
    title: "3D Vectors — Entry Test Style",
    subject: "Mathematics",
    chapter: "Vectors",
    topic: "Vector Algebra",
    difficulty: "Hard",
    estimated_minutes: 35,
    tags: ["vectors", "dot product", "cross product"],
    description: "Vector operations and geometric applications framed in the style of engineering entry tests.",
  },
  {
    title: "Kinematics — Motion in a Straight Line",
    subject: "Physics",
    chapter: "Mechanics",
    topic: "Kinematics",
    difficulty: "Easy",
    estimated_minutes: 25,
    tags: ["motion", "velocity", "acceleration"],
    description: "Equations of motion and graph interpretation for constant and variable acceleration.",
  },
  {
    title: "Electrostatics — Charges & Fields",
    subject: "Physics",
    chapter: "Electricity & Magnetism",
    topic: "Electrostatics",
    difficulty: "Medium",
    estimated_minutes: 30,
    tags: ["coulomb's law", "electric field", "potential"],
    description: "Point-charge interactions, field superposition, and potential-energy problems.",
  },
  {
    title: "Modern Physics — Atomic Models",
    subject: "Physics",
    chapter: "Modern Physics",
    topic: "Atomic Structure",
    difficulty: "Hard",
    estimated_minutes: 30,
    tags: ["bohr model", "photoelectric effect"],
    description: "Conceptual and numerical questions on atomic models and early quantum phenomena.",
  },
  {
    title: "Sentence Correction — Grammar Essentials",
    subject: "English",
    chapter: "Grammar",
    topic: "Sentence Correction",
    difficulty: "Easy",
    estimated_minutes: 15,
    tags: ["grammar", "syntax"],
    description: "Common subject-verb agreement, tense, and preposition errors seen in admission tests.",
  },
  {
    title: "Reading Comprehension — Timed Set",
    subject: "English",
    chapter: "Comprehension",
    topic: "Reading Comprehension",
    difficulty: "Medium",
    estimated_minutes: 25,
    tags: ["comprehension", "inference"],
    description: "Original short passages with inference and vocabulary-in-context questions, timed for exam pacing.",
  },
  {
    title: "Analogies & Verbal Reasoning",
    subject: "Intelligence",
    chapter: "Verbal Reasoning",
    topic: "Analogies",
    difficulty: "Medium",
    estimated_minutes: 15,
    tags: ["analogies", "verbal"],
    description: "Word-relationship analogies mirroring the intelligence sections of common entry tests.",
  },
  {
    title: "Number Series & Pattern Recognition",
    subject: "Intelligence",
    chapter: "Numerical Reasoning",
    topic: "Number Series",
    difficulty: "Medium",
    estimated_minutes: 15,
    tags: ["patterns", "sequences"],
    description: "Spot-the-pattern number series, difficulty ramping from arithmetic to composite rules.",
  },
  {
    title: "Non-Verbal Reasoning — Shape Sequences",
    subject: "Intelligence",
    chapter: "Non-Verbal Reasoning",
    topic: "Shape Sequences",
    difficulty: "Hard",
    estimated_minutes: 20,
    tags: ["spatial reasoning", "figures"],
    description: "Figure-sequence and mirror/rotation problems for the non-verbal section of the intelligence test.",
  },
  {
    title: "Data Structures — Arrays & Linked Lists",
    subject: "Computer Science",
    chapter: "Data Structures",
    topic: "Arrays and Linked Lists",
    difficulty: "Medium",
    estimated_minutes: 25,
    tags: ["arrays", "linked list", "complexity"],
    description: "Core operations, time complexity, and common pitfalls for arrays and singly linked lists.",
  },
];
