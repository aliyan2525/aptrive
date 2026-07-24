-- ============================================================
-- Aptrive: remote sync — objects that are LIVE on production
-- but were never captured as local migration files.
--
-- This file is generated directly from the live "Aptrive" Supabase
-- project (introspected via pg_catalog / information_schema), not
-- guessed. It is written defensively (IF NOT EXISTS / OR REPLACE /
-- DROP..CREATE for policies & triggers) so it is safe to apply even
-- though the objects already exist in production.
--
-- After adding this file, DO NOT run it against production — mark it
-- as already applied instead:
--   supabase migration repair --status applied 20260724000000
-- (rename the file to start with 20260724000000_ first, or match
-- whatever timestamp you save it as, then use that same value above)
-- ============================================================

-- ---------- 1. New enum types ----------
do $$ begin
  create type public.ai_asset_type as enum (
    'ai_explanation','ai_hint','ai_similar_question',
    'ai_harder_version','ai_easier_version','ai_video_recommendation'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.ai_study_plan_status as enum ('active','completed','abandoned');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.mock_exam_status as enum ('draft','published','archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.exam_session_status as enum ('in_progress','submitted','abandoned','auto_submitted');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.attempt_mode as enum ('practice','mock_exam','revision','weak_topic');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.question_report_status as enum ('open','resolved','dismissed');
exception when duplicate_object then null; end $$;

-- ---------- 2. New tables ----------

create table if not exists public.question_reports (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  reported_by uuid not null references auth.users (id) on delete cascade,
  reason text not null,
  status public.question_report_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_question_assets (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  asset_type public.ai_asset_type not null,
  content jsonb not null default '{}'::jsonb,
  model_used text,
  generated_at timestamptz not null default now(),
  approved_by_human boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan jsonb not null default '{}'::jsonb,
  generated_at timestamptz not null default now(),
  status public.ai_study_plan_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mock_exams (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  test_id uuid references public.tests (id) on delete set null,
  duration_minutes int not null check (duration_minutes > 0),
  total_marks int not null check (total_marks > 0),
  negative_marking_ratio numeric check (negative_marking_ratio is null or (negative_marking_ratio >= 0 and negative_marking_ratio <= 1)),
  status public.mock_exam_status not null default 'draft',
  created_by uuid references public.admin_users (user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.exam_questions (
  id uuid primary key default gen_random_uuid(),
  mock_exam_id uuid not null references public.mock_exams (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  order_index int not null default 0,
  marks numeric not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_coins_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  source_type text not null,
  source_id uuid,
  coins_amount int not null,
  created_at timestamptz not null default now()
);

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  icon text,
  criteria jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  badge_id uuid not null references public.badges (id) on delete cascade,
  unlocked_at timestamptz not null default now()
);

create table if not exists public.leaderboard_snapshots (
  id uuid primary key default gen_random_uuid(),
  scope text not null,
  scope_id uuid,
  user_id uuid not null references auth.users (id) on delete cascade,
  rank int not null,
  score numeric not null,
  period_start date not null,
  period_end date not null,
  created_at timestamptz not null default now()
);

-- practice_session_id was added to user_attempts by a later migration
alter table public.user_attempts
  add column if not exists practice_session_id uuid references public.practice_sessions (id) on delete set null;

-- ---------- 3. Enable RLS on new tables ----------
alter table public.question_reports enable row level security;
alter table public.ai_question_assets enable row level security;
alter table public.ai_study_plans enable row level security;
alter table public.mock_exams enable row level security;
alter table public.exam_questions enable row level security;
alter table public.user_coins_ledger enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.leaderboard_snapshots enable row level security;

-- ---------- 4. updated_at triggers on new tables ----------
drop trigger if exists set_question_reports_updated_at on public.question_reports;
create trigger set_question_reports_updated_at before update on public.question_reports
  for each row execute function public.set_updated_at();

drop trigger if exists set_ai_question_assets_updated_at on public.ai_question_assets;
create trigger set_ai_question_assets_updated_at before update on public.ai_question_assets
  for each row execute function public.set_updated_at();

drop trigger if exists set_ai_study_plans_updated_at on public.ai_study_plans;
create trigger set_ai_study_plans_updated_at before update on public.ai_study_plans
  for each row execute function public.set_updated_at();

drop trigger if exists set_mock_exams_updated_at on public.mock_exams;
create trigger set_mock_exams_updated_at before update on public.mock_exams
  for each row execute function public.set_updated_at();

drop trigger if exists set_exam_questions_updated_at on public.exam_questions;
create trigger set_exam_questions_updated_at before update on public.exam_questions
  for each row execute function public.set_updated_at();

drop trigger if exists set_badges_updated_at on public.badges;
create trigger set_badges_updated_at before update on public.badges
  for each row execute function public.set_updated_at();

-- ---------- 5. RLS policies on new tables ----------
drop policy if exists question_reports_insert_own on public.question_reports;
create policy question_reports_insert_own on public.question_reports
  for insert with check (reported_by = auth.uid());

drop policy if exists question_reports_select_own_or_admin on public.question_reports;
create policy question_reports_select_own_or_admin on public.question_reports
  for select using (reported_by = auth.uid() or private.is_admin());

drop policy if exists question_reports_update_admin on public.question_reports;
create policy question_reports_update_admin on public.question_reports
  for update using (private.is_admin()) with check (private.is_admin());

drop policy if exists question_reports_delete_admin on public.question_reports;
create policy question_reports_delete_admin on public.question_reports
  for delete using (private.is_admin());

drop policy if exists ai_question_assets_admin_all on public.ai_question_assets;
create policy ai_question_assets_admin_all on public.ai_question_assets
  for all using (private.is_admin()) with check (private.is_admin());

drop policy if exists ai_study_plans_select_own_or_admin on public.ai_study_plans;
create policy ai_study_plans_select_own_or_admin on public.ai_study_plans
  for select using (user_id = auth.uid() or private.is_admin());

drop policy if exists ai_study_plans_write_admin on public.ai_study_plans;
create policy ai_study_plans_write_admin on public.ai_study_plans
  for all using (private.is_admin()) with check (private.is_admin());

drop policy if exists mock_exams_select_published_or_admin on public.mock_exams;
create policy mock_exams_select_published_or_admin on public.mock_exams
  for select using (status = 'published' or private.is_admin());

drop policy if exists mock_exams_write_admin on public.mock_exams;
create policy mock_exams_write_admin on public.mock_exams
  for all using (private.is_admin()) with check (private.is_admin());

drop policy if exists exam_questions_select_inherit on public.exam_questions;
create policy exam_questions_select_inherit on public.exam_questions
  for select using (
    private.is_admin()
    or exists (select 1 from public.mock_exams me where me.id = exam_questions.mock_exam_id and me.status = 'published')
  );

drop policy if exists exam_questions_write_admin on public.exam_questions;
create policy exam_questions_write_admin on public.exam_questions
  for all using (private.is_admin()) with check (private.is_admin());

drop policy if exists user_coins_ledger_select_own_or_admin on public.user_coins_ledger;
create policy user_coins_ledger_select_own_or_admin on public.user_coins_ledger
  for select using (user_id = auth.uid() or private.is_admin());

drop policy if exists badges_read_all on public.badges;
create policy badges_read_all on public.badges for select using (true);

drop policy if exists badges_write_admin on public.badges;
create policy badges_write_admin on public.badges
  for all using (private.is_admin()) with check (private.is_admin());

drop policy if exists user_badges_select_own_or_admin on public.user_badges;
create policy user_badges_select_own_or_admin on public.user_badges
  for select using (user_id = auth.uid() or private.is_admin());

drop policy if exists user_badges_write_admin on public.user_badges;
create policy user_badges_write_admin on public.user_badges
  for all using (private.is_admin()) with check (private.is_admin());

drop policy if exists leaderboard_snapshots_read_all on public.leaderboard_snapshots;
create policy leaderboard_snapshots_read_all on public.leaderboard_snapshots for select using (true);

drop policy if exists leaderboard_snapshots_write_admin on public.leaderboard_snapshots;
create policy leaderboard_snapshots_write_admin on public.leaderboard_snapshots
  for all using (private.is_admin()) with check (private.is_admin());

-- ---------- 6. Supporting functions (private schema helper + RPC) ----------
create or replace function private.admin_role()
returns text
language sql stable security definer set search_path to 'public','private'
as $$
  select role from public.admin_users where user_id = auth.uid();
$$;

create or replace function public.refresh_leaderboard_snapshot(p_scope text, p_period_start date, p_period_end date)
returns void
language plpgsql security definer set search_path to 'public'
as $$
begin
  delete from public.leaderboard_snapshots
    where scope = p_scope and period_start = p_period_start and period_end = p_period_end;

  insert into public.leaderboard_snapshots (scope, scope_id, user_id, rank, score, period_start, period_end)
  select
    p_scope,
    null,
    ua.user_id,
    row_number() over (order by sum(case when ua.is_correct then 1 else 0 end) desc, count(*) desc) as rank,
    sum(case when ua.is_correct then 1 else 0 end)::numeric as score,
    p_period_start,
    p_period_end
  from public.user_attempts ua
  where ua.attempted_at::date between p_period_start and p_period_end
  group by ua.user_id;
end;
$$;

-- End of remote-sync migration
