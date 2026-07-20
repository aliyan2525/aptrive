-- ============================================================
-- Aptrive: seed data for subjects + practice_sets
-- Mirrors the mock data in lib/library-data.ts so the DB isn't
-- empty while the Library UI migration is still pending.
-- Safe to re-run (upserts on the unique slug).
-- Individual questions/options are NOT seeded here — that's the
-- "Upgrade the Library" stage (real MCQ content).
-- ============================================================

insert into public.subjects (slug, name, description, is_coming_soon)
values
  ('mathematics', 'Mathematics', 'Algebra, trigonometry, calculus, and coordinate geometry.', false),
  ('physics', 'Physics', 'Mechanics, waves, electromagnetism, and modern physics.', false),
  ('chemistry', 'Chemistry', 'Organic, inorganic, and physical chemistry fundamentals.', false),
  ('english', 'English', 'Grammar, vocabulary, comprehension, and analogies.', false),
  ('intelligence', 'Intelligence / IQ', 'Logical reasoning, pattern recognition, and analytical skills.', false),
  ('computer-science', 'Computer Science', 'Programming fundamentals, data structures, and computing logic.', false),
  ('biology', 'Biology', 'Human biology, botany, and zoology — for MDCAT preparation.', true),
  ('general-knowledge', 'General Knowledge', 'Current affairs, Pakistan studies, and general awareness.', false)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  is_coming_soon = excluded.is_coming_soon;

-- practice_sets: subject_id resolved from subjects.slug via subquery
insert into public.practice_sets (
  slug, subject_id, title, content_type, university, exam_tag, topic, chapter,
  difficulty, year, language, is_solved, is_premium, question_count, estimated_minutes, updated_at
)
values
  ('math-topic-algebra-1', (select id from public.subjects where slug = 'mathematics'),
   'Algebra — Topic-wise Practice Set 1', 'topic-wise', 'NUST', 'NET', 'Algebra', 'Quadratic Equations',
   'Medium', null, 'English', true, false, 30, 40, '2026-07-12'),

  ('math-past-nust-2025', (select id from public.subjects where slug = 'mathematics'),
   'NUST NET Past Paper — 2025', 'past-papers', 'NUST', 'NET', 'Mixed', null,
   'Hard', 2025, 'English', true, true, 100, 120, '2026-06-30'),

  ('math-formula-calc', (select id from public.subjects where slug = 'mathematics'),
   'Calculus — Formula Sheet', 'formula-sheets', null, null, 'Calculus', null,
   'Easy', null, 'English', false, false, 0, 15, '2026-07-01'),

  ('math-mock-1', (select id from public.subjects where slug = 'mathematics'),
   'Full-length Mock Test — Mathematics', 'mock-tests', 'NUST', 'NET', 'Mixed', null,
   'Hard', null, 'English', false, true, 60, 90, '2026-07-15'),

  ('math-daily-1', (select id from public.subjects where slug = 'mathematics'),
   'Daily Challenge — Coordinate Geometry', 'daily-challenge', null, null, 'Coordinate Geometry', null,
   'Medium', null, 'English', false, false, 5, 8, '2026-07-19'),

  ('phy-chapter-mechanics', (select id from public.subjects where slug = 'physics'),
   'Mechanics — Chapter-wise Questions', 'chapter-wise', 'FAST-NUCES', 'ECAT', 'Mechanics', 'Newton''s Laws',
   'Medium', null, 'English', true, false, 25, 35, '2026-07-09'),

  ('phy-video-em', (select id from public.subjects where slug = 'physics'),
   'Electromagnetism — Video Lesson Series', 'video', null, null, 'Electromagnetism', null,
   'Medium', null, 'English', false, true, 0, 55, '2026-06-25'),

  ('phy-flash-waves', (select id from public.subjects where slug = 'physics'),
   'Waves & Oscillations — Flashcards', 'flashcards', null, null, 'Waves', null,
   'Easy', null, 'English', false, false, 40, 20, '2026-07-02'),

  ('chem-solved-comsats', (select id from public.subjects where slug = 'chemistry'),
   'COMSATS Entry Test — Solved Paper 2024', 'solved-papers', 'COMSATS', 'NAT', 'Mixed', null,
   'Hard', 2024, 'English', true, true, 50, 60, '2026-06-18'),

  ('chem-notes-organic', (select id from public.subjects where slug = 'chemistry'),
   'Organic Chemistry — Quick Revision Notes', 'revision-notes', null, null, 'Organic Chemistry', null,
   'Medium', null, 'English', false, false, 0, 25, '2026-07-06'),

  ('eng-ai-vocab', (select id from public.subjects where slug = 'english'),
   'Vocabulary — AI-generated Practice Set', 'ai-generated', null, null, 'Vocabulary', null,
   'Medium', null, 'English', false, true, 20, 20, '2026-07-17'),

  ('eng-mcq-comprehension', (select id from public.subjects where slug = 'english'),
   'Reading Comprehension — Practice MCQs', 'mcq', null, null, 'Comprehension', null,
   'Easy', null, 'English', true, false, 20, 25, '2026-07-04'),

  ('iq-mcq-patterns', (select id from public.subjects where slug = 'intelligence'),
   'Pattern Recognition — Practice MCQs', 'mcq', null, null, 'Pattern Recognition', null,
   'Hard', null, 'English', true, false, 25, 30, '2026-06-29'),

  ('cs-topic-ds', (select id from public.subjects where slug = 'computer-science'),
   'Data Structures — Topic-wise Questions', 'topic-wise', 'FAST-NUCES', null, 'Data Structures', null,
   'Medium', null, 'English', true, false, 22, 30, '2026-06-27'),

  ('gk-mcq-current-affairs', (select id from public.subjects where slug = 'general-knowledge'),
   'Current Affairs 2026 — Practice MCQs', 'mcq', null, null, 'Current Affairs', null,
   'Easy', null, 'English', false, false, 30, 25, '2026-07-14')
on conflict (slug) do update set
  title = excluded.title,
  content_type = excluded.content_type,
  university = excluded.university,
  exam_tag = excluded.exam_tag,
  topic = excluded.topic,
  chapter = excluded.chapter,
  difficulty = excluded.difficulty,
  year = excluded.year,
  language = excluded.language,
  is_solved = excluded.is_solved,
  is_premium = excluded.is_premium,
  question_count = excluded.question_count,
  estimated_minutes = excluded.estimated_minutes,
  updated_at = excluded.updated_at;

-- A starter achievement catalog so user_achievements has something
-- to point at once the practice-session stage awards them.
insert into public.achievements (slug, name, description, icon)
values
  ('first-practice-set', 'First Steps', 'Completed your first practice session.', 'footprints'),
  ('streak-7', 'Week Warrior', 'Kept a 7-day study streak.', 'flame'),
  ('streak-30', 'Consistency Champion', 'Kept a 30-day study streak.', 'trophy'),
  ('hundred-questions', 'Century Club', 'Answered 100 practice questions.', 'target'),
  ('first-mock-test', 'Mock Test Debut', 'Completed your first full-length mock test.', 'clipboard-check')
on conflict (slug) do nothing;
