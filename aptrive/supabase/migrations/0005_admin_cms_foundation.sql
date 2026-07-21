-- ============================================================
-- Aptrive: Admin CMS foundation
-- Extends the existing catalog (subjects -> practice_sets ->
-- questions -> question_options) with the fields and tables
-- needed to run a real content pipeline: draft/review/publish
-- status, provenance metadata, tagging, version history, and
-- CSV bulk import with validate -> preview -> commit -> rollback.
--
-- Nothing here touches existing columns' meaning or removes
-- anything; it is purely additive on top of 0001-0004.
-- ============================================================

-- 1. Extend `questions` with CMS/provenance fields -----------------
alter table public.questions
  add column if not exists status text not null default 'published'
    check (status in ('draft', 'in_review', 'published', 'archived')),
  add column if not exists source text,
  add column if not exists source_year int,
  add column if not exists tags text[] not null default '{}',
  add column if not exists ai_generated boolean not null default false,
  add column if not exists human_reviewed boolean not null default false,
  add column if not exists current_version int not null default 1,
  add column if not exists created_by uuid references public.profiles (id) on delete set null,
  add column if not exists reviewed_by uuid references public.profiles (id) on delete set null,
  add column if not exists duplicated_from_id uuid references public.questions (id) on delete set null;

comment on column public.questions.status is
  'draft = author is still working on it (not visible to students). in_review = submitted for staff review. published = live and visible to students. archived = retired, kept for history/analytics integrity.';

-- Existing rows predate the status column and are already live in
-- production practice sets, so they default to 'published' above
-- (not 'draft') to avoid silently hiding content that students can
-- already see. New rows created via the CMS explicitly pass 'draft'.

create index if not exists questions_status_idx on public.questions (status);
create index if not exists questions_tags_idx on public.questions using gin (tags);
create index if not exists questions_prompt_search_idx
  on public.questions using gin (to_tsvector('english', prompt));

-- 2. Extend `practice_sets` with the same status lifecycle ---------
alter table public.practice_sets
  add column if not exists status text not null default 'published'
    check (status in ('draft', 'published', 'archived'));

create index if not exists practice_sets_status_idx on public.practice_sets (status);

-- 3. Question version history (append-only audit trail) -----------
create table if not exists public.question_versions (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  version_number int not null,
  snapshot jsonb not null,
  changed_by uuid references public.profiles (id) on delete set null,
  change_summary text,
  created_at timestamptz not null default now()
);

create index if not exists question_versions_question_id_idx
  on public.question_versions (question_id, version_number desc);

-- Snapshot the pre-update row (question + its options) before every
-- update, and bump current_version. This is what powers "Version
-- History" and manual rollback in the CMS. It intentionally does not
-- fire on INSERT (version 1 is implicit) or on the version-only
-- touch from `enforce_single_correct_option` re-saving options.
create or replace function public.snapshot_question_version()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_options jsonb;
begin
  select coalesce(jsonb_agg(to_jsonb(o) order by o.position), '[]'::jsonb)
    into v_options
    from public.question_options o
    where o.question_id = old.id;

  insert into public.question_versions (question_id, version_number, snapshot, changed_by, change_summary)
  values (
    old.id,
    old.current_version,
    to_jsonb(old) || jsonb_build_object('options', v_options),
    coalesce(new.reviewed_by, new.created_by),
    'Auto-snapshot before update'
  );

  new.current_version = old.current_version + 1;
  return new;
end;
$$;

drop trigger if exists snapshot_question_version on public.questions;
create trigger snapshot_question_version
  before update on public.questions
  for each row
  when (old.prompt is distinct from new.prompt
     or old.explanation is distinct from new.explanation
     or old.status is distinct from new.status
     or old.difficulty is distinct from new.difficulty)
  execute function public.snapshot_question_version();

-- 4. Import pipeline -------------------------------------------------
create table if not exists public.import_batches (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references public.profiles (id) on delete set null,
  file_name text not null,
  source_type text not null default 'csv' check (source_type in ('csv')),
  target_practice_set_id uuid not null references public.practice_sets (id) on delete cascade,
  status text not null default 'validating'
    check (status in ('validating', 'ready', 'importing', 'completed', 'failed', 'rolled_back')),
  total_rows int not null default 0,
  valid_rows int not null default 0,
  warning_rows int not null default 0,
  error_rows int not null default 0,
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists import_batches_created_by_idx on public.import_batches (created_by, created_at desc);
create index if not exists import_batches_practice_set_idx on public.import_batches (target_practice_set_id);

create table if not exists public.import_batch_rows (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.import_batches (id) on delete cascade,
  row_number int not null,
  raw_data jsonb not null,
  row_status text not null default 'pending' check (row_status in ('pending', 'valid', 'warning', 'error')),
  errors text[] not null default '{}',
  warnings text[] not null default '{}',
  question_id uuid references public.questions (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists import_batch_rows_batch_id_idx on public.import_batch_rows (batch_id, row_number);
create unique index if not exists import_batch_rows_unique_row on public.import_batch_rows (batch_id, row_number);

-- 5. Row Level Security ----------------------------------------------
-- Replace the "select_all" catalog policies with status-aware ones:
-- the public/students only ever see published content; staff (the
-- existing is_staff() helper from 0002) see everything regardless of
-- status so they can review drafts.
drop policy if exists "practice_sets_select_all" on public.practice_sets;
create policy "practice_sets_select_published_or_staff"
  on public.practice_sets for select
  using (status = 'published' or public.is_staff());

drop policy if exists "questions_select_all" on public.questions;
create policy "questions_select_published_or_staff"
  on public.questions for select
  using (status = 'published' or public.is_staff());

-- question_options has no status of its own; it inherits visibility
-- from its parent question via this policy (replacing select_all).
drop policy if exists "question_options_select_all" on public.question_options;
create policy "question_options_select_published_or_staff"
  on public.question_options for select
  using (
    exists (
      select 1 from public.questions q
      where q.id = question_options.question_id
        and (q.status = 'published' or public.is_staff())
    )
  );

alter table public.question_versions enable row level security;
drop policy if exists "question_versions_select_staff" on public.question_versions;
create policy "question_versions_select_staff"
  on public.question_versions for select
  using (public.is_staff());
drop policy if exists "question_versions_insert_staff" on public.question_versions;
create policy "question_versions_insert_staff"
  on public.question_versions for insert
  with check (public.is_staff());
-- No update/delete policy: version rows are immutable history.

alter table public.import_batches enable row level security;
drop policy if exists "import_batches_all_staff" on public.import_batches;
create policy "import_batches_all_staff"
  on public.import_batches for all
  using (public.is_staff())
  with check (public.is_staff());

alter table public.import_batch_rows enable row level security;
drop policy if exists "import_batch_rows_all_staff" on public.import_batch_rows;
create policy "import_batch_rows_all_staff"
  on public.import_batch_rows for all
  using (public.is_staff())
  with check (public.is_staff());
