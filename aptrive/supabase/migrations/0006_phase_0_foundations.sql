-- ============================================================
-- Aptrive: Phase 0 Foundations (Schema & Security)
-- Extends the schema with complete catalog taxonomy, difficulty ranks,
-- bloom levels, question types, explanations, hints, formulas, reviews,
-- and admin governance.
-- ============================================================

-- 1. Custom Types & Schema Helper -------------------------------------
create type public.bloom_level as enum ('remember', 'understand', 'apply', 'analyze', 'evaluate', 'create');
create type public.question_type as enum ('single_choice', 'multiple_choice', 'numeric');

-- Create private schema if it doesn't exist for security helper functions
create schema if not exists private;

-- 2. New Catalog Tables ------------------------------------------------
create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  logo_url text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tests (
  id uuid primary key default gen_random_uuid(),
  university_id uuid references public.universities (id) on delete set null,
  name text not null,
  slug text unique not null,
  description text,
  exam_pattern jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Difficulty Levels
create table if not exists public.difficulty_levels (
  id uuid primary key default gen_random_uuid(),
  label text unique not null,
  rank int unique not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Seed difficulty levels
insert into public.difficulty_levels (label, rank)
values 
  ('Easy', 1),
  ('Medium', 2),
  ('Hard', 3),
  ('Expert', 4)
on conflict (label) do update set rank = excluded.rank;

-- Extend subjects with parent test_id (nullable, for general or specific tests)
alter table public.subjects add column if not exists test_id uuid references public.tests (id) on delete set null;

create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects (id) on delete cascade,
  name text not null,
  slug text not null,
  order_index int not null default 0,
  icon text,
  estimated_minutes int,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (subject_id, slug)
);

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  name text not null,
  slug text not null,
  order_index int not null default 0,
  icon text,
  estimated_minutes int,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (chapter_id, slug)
);

create table if not exists public.subtopics (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics (id) on delete cascade,
  name text not null,
  slug text not null,
  order_index int not null default 0,
  icon text,
  estimated_minutes int,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (topic_id, slug)
);

-- 3. Extend Questions Table --------------------------------------------
alter table public.questions
  add column if not exists university_id uuid references public.universities (id) on delete set null,
  add column if not exists test_id uuid references public.tests (id) on delete set null,
  add column if not exists chapter_id uuid references public.chapters (id) on delete restrict,
  add column if not exists topic_id uuid references public.topics (id) on delete restrict,
  add column if not exists subtopic_id uuid references public.subtopics (id) on delete restrict,
  add column if not exists difficulty_level_id uuid references public.difficulty_levels (id) on delete restrict,
  add column if not exists bloom_level public.bloom_level default 'remember',
  add column if not exists question_type public.question_type not null default 'single_choice',
  add column if not exists numeric_answer_value numeric,
  add column if not exists numeric_answer_tolerance numeric;

-- Trigger updating legacy columns on questions
create or replace function public.sync_legacy_question_fields()
returns trigger as $$
begin
  if new.difficulty_level_id is not null then
    select label into new.difficulty from public.difficulty_levels where id = new.difficulty_level_id;
  end if;
  if new.chapter_id is not null then
    select name into new.chapter from public.chapters where id = new.chapter_id;
  end if;
  if new.topic_id is not null then
    select name into new.topic from public.topics where id = new.topic_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists sync_legacy_question_fields on public.questions;
create trigger sync_legacy_question_fields
  before insert or update on public.questions
  for each row execute function public.sync_legacy_question_fields();

-- Populate chapters & topics for existing data compatibility
do $$
declare
  sub_row record;
  new_chap_id uuid;
  new_top_id uuid;
  diff_id uuid;
begin
  -- For each subject, ensure a "General" chapter and "General" topic exists
  for sub_row in select id, slug from public.subjects loop
    -- Create General Chapter
    insert into public.chapters (subject_id, name, slug, order_index)
    values (sub_row.id, 'General ' || sub_row.slug, 'general', 1)
    on conflict (subject_id, slug) do update set name = excluded.name
    returning id into new_chap_id;

    -- Create General Topic
    insert into public.topics (chapter_id, name, slug, order_index)
    values (new_chap_id, 'General ' || sub_row.slug || ' topic', 'general', 1)
    on conflict (chapter_id, slug) do update set name = excluded.name
    returning id into new_top_id;

    -- Update any questions in this subject with missing chapter_id or topic_id
    update public.questions
    set chapter_id = new_chap_id, topic_id = new_top_id
    where subject_id = sub_row.id and (chapter_id is null or topic_id is null);
  end loop;

  -- Map existing check-constrained difficulty to difficulty_level_id
  for sub_row in select id, label from public.difficulty_levels loop
    update public.questions
    set difficulty_level_id = sub_row.id
    where difficulty = sub_row.label and difficulty_level_id is null;
  end loop;
end;
$$;

-- Add not-null constraints after populating existing data
alter table public.questions 
  alter column chapter_id set not null,
  alter column topic_id set not null;

-- 4. Governance & Role Checks -----------------------------------------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('super_admin', 'content_manager', 'moderator', 'content_creator', 'reviewer')),
  permissions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Populate admin_users from profiles who are staff
insert into public.admin_users (user_id, role)
select id, case when role = 'administrator' then 'super_admin' else 'content_creator' end::text
from public.profiles
where role in ('instructor', 'content_manager', 'administrator')
on conflict (user_id) do nothing;

create or replace function private.is_admin()
returns boolean
security definer set search_path = public, private
language sql stable
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

create or replace function private.admin_role()
returns text
security definer set search_path = public, private
language sql stable
as $$
  select role from public.admin_users where user_id = auth.uid();
$$;

-- 5. Child Question Tables ---------------------------------------------
create table if not exists public.question_images (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  storage_path text not null,
  alt_text text,
  attached_to text not null check (attached_to in ('question', 'option', 'explanation')),
  related_option_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.question_tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.question_tag_map (
  question_id uuid not null references public.questions (id) on delete cascade,
  tag_id uuid not null references public.question_tags (id) on delete cascade,
  primary key (question_id, tag_id)
);

create table if not exists public.question_explanations (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  content text not null,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.question_hints (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  content text not null,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.question_formulas (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  content text not null,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.question_references (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  content text not null,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.question_reviews (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  reviewer_id uuid not null references auth.users (id) on delete cascade,
  decision text not null check (decision in ('approved', 'rejected', 'changes_requested')),
  comment text,
  created_at timestamptz not null default now()
);

-- 6. Indexes & Triggers ------------------------------------------------
create index if not exists questions_composite_catalog_idx on public.questions (status, subject_id, chapter_id, topic_id);
create index if not exists questions_difficulty_idx on public.questions (status, difficulty_level_id);

-- Attach update triggers for catalog
create trigger set_universities_updated_at before update on public.universities for each row execute function public.set_updated_at();
create trigger set_tests_updated_at before update on public.tests for each row execute function public.set_updated_at();
create trigger set_chapters_updated_at before update on public.chapters for each row execute function public.set_updated_at();
create trigger set_topics_updated_at before update on public.topics for each row execute function public.set_updated_at();
create trigger set_subtopics_updated_at before update on public.subtopics for each row execute function public.set_updated_at();
create trigger set_admin_users_updated_at before update on public.admin_users for each row execute function public.set_updated_at();

-- 7. Views ------------------------------------------------------------
create or replace view public.v_published_questions as
select 
  q.id,
  q.practice_set_id,
  q.subject_id,
  q.prompt,
  q.explanation,
  q.difficulty,
  q.topic,
  q.chapter,
  q.time_estimate_seconds,
  q.position,
  q.status,
  q.question_type,
  dl.rank as difficulty_rank
from public.questions q
left join public.difficulty_levels dl on dl.id = q.difficulty_level_id
where q.status = 'published';

-- 8. Row Level Security Policies ---------------------------------------
alter table public.universities enable row level security;
alter table public.tests enable row level security;
alter table public.chapters enable row level security;
alter table public.topics enable row level security;
alter table public.subtopics enable row level security;
alter table public.difficulty_levels enable row level security;
alter table public.admin_users enable row level security;
alter table public.question_images enable row level security;
alter table public.question_tags enable row level security;
alter table public.question_tag_map enable row level security;
alter table public.question_explanations enable row level security;
alter table public.question_hints enable row level security;
alter table public.question_formulas enable row level security;
alter table public.question_references enable row level security;
alter table public.question_reviews enable row level security;

-- Read policies for public access
create policy "universities_read_all" on public.universities for select using (true);
create policy "tests_read_all" on public.tests for select using (true);
create policy "chapters_read_all" on public.chapters for select using (true);
create policy "topics_read_all" on public.topics for select using (true);
create policy "subtopics_read_all" on public.subtopics for select using (true);
create policy "difficulty_levels_read_all" on public.difficulty_levels for select using (true);
create policy "question_tags_read_all" on public.question_tags for select using (true);
create policy "question_tag_map_read_all" on public.question_tag_map for select using (true);
create policy "question_explanations_read_all" on public.question_explanations for select using (true);
create policy "question_hints_read_all" on public.question_hints for select using (true);
create policy "question_formulas_read_all" on public.question_formulas for select using (true);
create policy "question_references_read_all" on public.question_references for select using (true);

-- Admin write policies
create policy "universities_write_admin" on public.universities for all using (private.is_admin()) with check (private.is_admin());
create policy "tests_write_admin" on public.tests for all using (private.is_admin()) with check (private.is_admin());
create policy "chapters_write_admin" on public.chapters for all using (private.is_admin()) with check (private.is_admin());
create policy "topics_write_admin" on public.topics for all using (private.is_admin()) with check (private.is_admin());
create policy "subtopics_write_admin" on public.subtopics for all using (private.is_admin()) with check (private.is_admin());
create policy "difficulty_levels_write_admin" on public.difficulty_levels for all using (private.is_admin()) with check (private.is_admin());
create policy "admin_users_write_super" on public.admin_users for all using (private.admin_role() = 'super_admin') with check (private.admin_role() = 'super_admin');
create policy "admin_users_read_all" on public.admin_users for select using (true);

create policy "question_images_write_admin" on public.question_images for all using (private.is_admin()) with check (private.is_admin());
create policy "question_tags_write_admin" on public.question_tags for all using (private.is_admin()) with check (private.is_admin());
create policy "question_tag_map_write_admin" on public.question_tag_map for all using (private.is_admin()) with check (private.is_admin());
create policy "question_explanations_write_admin" on public.question_explanations for all using (private.is_admin()) with check (private.is_admin());
create policy "question_hints_write_admin" on public.question_hints for all using (private.is_admin()) with check (private.is_admin());
create policy "question_formulas_write_admin" on public.question_formulas for all using (private.is_admin()) with check (private.is_admin());
create policy "question_references_write_admin" on public.question_references for all using (private.is_admin()) with check (private.is_admin());
create policy "question_reviews_write_admin" on public.question_reviews for all using (private.is_admin()) with check (private.is_admin());
