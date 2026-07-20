-- ============================================================
-- Aptrive: Library content reference tables
-- subjects -> practice_sets -> questions -> question_options
-- These back the Question Library and give practice/progress
-- tracking something stable to point foreign keys at.
-- Actual question content ("Upgrade the Library" stage) is
-- seeded separately in supabase/seed.sql.
-- ============================================================

-- 1. Subjects (mirrors lib/library-data.ts `categories`) --------
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  is_coming_soon boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_subjects_updated_at on public.subjects;
create trigger set_subjects_updated_at
  before update on public.subjects
  for each row execute function public.set_updated_at();

-- 2. Practice sets (mirrors lib/library-data.ts `resources`) ----
-- One row per library resource: an MCQ set, past paper, mock
-- test, formula sheet, video lesson, etc.
create table if not exists public.practice_sets (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  subject_id uuid not null references public.subjects (id) on delete cascade,
  title text not null,
  content_type text not null check (content_type in (
    'mcq', 'topic-wise', 'chapter-wise', 'past-papers', 'solved-papers',
    'mock-tests', 'formula-sheets', 'revision-notes', 'pdf', 'video',
    'flashcards', 'ai-generated', 'daily-challenge'
  )),
  university text,
  exam_tag text,
  topic text not null,
  chapter text,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  year int,
  language text not null default 'English' check (language in ('English', 'Urdu')),
  is_solved boolean not null default false,
  is_premium boolean not null default false,
  question_count int not null default 0,
  estimated_minutes int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists practice_sets_subject_id_idx on public.practice_sets (subject_id);
create index if not exists practice_sets_content_type_idx on public.practice_sets (content_type);
create index if not exists practice_sets_university_idx on public.practice_sets (university);
create index if not exists practice_sets_exam_tag_idx on public.practice_sets (exam_tag);

drop trigger if exists set_practice_sets_updated_at on public.practice_sets;
create trigger set_practice_sets_updated_at
  before update on public.practice_sets
  for each row execute function public.set_updated_at();

-- 3. Questions -----------------------------------------------------
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  practice_set_id uuid not null references public.practice_sets (id) on delete cascade,
  subject_id uuid not null references public.subjects (id) on delete cascade,
  prompt text not null,
  explanation text,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  topic text not null,
  chapter text,
  time_estimate_seconds int not null default 60,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists questions_practice_set_id_idx on public.questions (practice_set_id);
create index if not exists questions_subject_id_topic_idx on public.questions (subject_id, topic);

drop trigger if exists set_questions_updated_at on public.questions;
create trigger set_questions_updated_at
  before update on public.questions
  for each row execute function public.set_updated_at();

-- 4. Question options ----------------------------------------------
create table if not exists public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  label text, -- e.g. "A", "B", "C", "D"
  content text not null,
  is_correct boolean not null default false,
  position int not null default 0
);

create index if not exists question_options_question_id_idx on public.question_options (question_id);

-- Exactly one correct option per question, enforced at write time
-- via this trigger (a plain CHECK constraint can't see sibling rows).
create or replace function public.enforce_single_correct_option()
returns trigger
language plpgsql
as $$
begin
  if new.is_correct then
    update public.question_options
    set is_correct = false
    where question_id = new.question_id
      and id <> new.id
      and is_correct = true;
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_single_correct_option on public.question_options;
create trigger enforce_single_correct_option
  before insert or update on public.question_options
  for each row execute function public.enforce_single_correct_option();

-- 5. Row Level Security: content is publicly readable, writes are
--    restricted to instructors/content managers/administrators.
create or replace function public.is_staff()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('instructor', 'content_manager', 'administrator')
  );
$$;

alter table public.subjects enable row level security;
alter table public.practice_sets enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;

drop policy if exists "subjects_select_all" on public.subjects;
create policy "subjects_select_all" on public.subjects for select using (true);
drop policy if exists "subjects_write_staff" on public.subjects;
create policy "subjects_write_staff" on public.subjects for all
  using (public.is_staff()) with check (public.is_staff());

drop policy if exists "practice_sets_select_all" on public.practice_sets;
create policy "practice_sets_select_all" on public.practice_sets for select using (true);
drop policy if exists "practice_sets_write_staff" on public.practice_sets;
create policy "practice_sets_write_staff" on public.practice_sets for all
  using (public.is_staff()) with check (public.is_staff());

drop policy if exists "questions_select_all" on public.questions;
create policy "questions_select_all" on public.questions for select using (true);
drop policy if exists "questions_write_staff" on public.questions;
create policy "questions_write_staff" on public.questions for all
  using (public.is_staff()) with check (public.is_staff());

drop policy if exists "question_options_select_all" on public.question_options;
create policy "question_options_select_all" on public.question_options for select using (true);
drop policy if exists "question_options_write_staff" on public.question_options;
create policy "question_options_write_staff" on public.question_options for all
  using (public.is_staff()) with check (public.is_staff());
