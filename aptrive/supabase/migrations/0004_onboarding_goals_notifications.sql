-- 0004_onboarding_goals_notifications.sql
-- Adds everything the onboarding flow, dashboard goals, notification
-- center, admission-deadline widget, and university test selector need.
-- Run after 0001-0003.

-- ============================================================
-- 1. Onboarding / academic profile
-- ============================================================
-- Kept as its own table (not bolted onto `profiles`) so profiles stays
-- a thin auth-identity table and this can be nullable / filled in over
-- the multi-step onboarding flow without migrations later.

create type entry_test as enum ('NET', 'ECAT', 'MDCAT', 'NAT', 'SAT', 'GAT', 'OTHER');
create type education_level as enum ('matric', 'intermediate', 'a_levels', 'undergraduate', 'other');
create type study_schedule as enum ('early_morning', 'morning', 'afternoon', 'evening', 'night', 'flexible');

create table student_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  target_university text,
  target_degree text,
  entry_test entry_test,
  entry_test_other text,
  education_level education_level,
  matric_marks numeric(5,2),
  matric_total numeric(6,2),
  intermediate_marks numeric(5,2),
  intermediate_total numeric(6,2),
  expected_test_date date,
  preferred_schedule study_schedule,
  daily_study_target_minutes int not null default 60,
  weak_subjects text[] not null default '{}',
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table student_profiles enable row level security;

create policy "student_profiles_select_own" on student_profiles
  for select using (auth.uid() = user_id or public.is_staff());
create policy "student_profiles_upsert_own" on student_profiles
  for insert with check (auth.uid() = user_id);
create policy "student_profiles_update_own" on student_profiles
  for update using (auth.uid() = user_id);

drop trigger if exists set_student_profiles_updated_at on public.student_profiles;
create trigger set_student_profiles_updated_at
  before update on public.student_profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- 2. Goals (targets the dashboard compares daily_activity against)
-- ============================================================
create type goal_period as enum ('daily', 'weekly');

create table study_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  period goal_period not null,
  -- the day (for daily) or the Monday of the ISO week (for weekly) this row targets
  period_start date not null,
  target_minutes int not null default 0,
  target_questions int not null default 0,
  target_sessions int not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, period, period_start)
);

alter table study_goals enable row level security;

create policy "study_goals_select_own" on study_goals
  for select using (auth.uid() = user_id or public.is_staff());
create policy "study_goals_write_own" on study_goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Convenience view: today's + this week's goal vs. actual, joined from
-- daily_activity. Dashboard reads this one view instead of computing
-- the join client-side.
create or replace view goal_progress as
select
  g.id as goal_id,
  g.user_id,
  g.period,
  g.period_start,
  g.target_minutes,
  g.target_questions,
  g.target_sessions,
  coalesce(sum(a.study_seconds) / 60, 0)::int as actual_minutes,
  coalesce(sum(a.questions_attempted), 0)::int as actual_questions,
  coalesce(sum(a.sessions_completed), 0)::int as actual_sessions
from study_goals g
left join daily_activity a
  on a.user_id = g.user_id
  and (
    (g.period = 'daily' and a.activity_date = g.period_start)
    or (g.period = 'weekly' and a.activity_date between g.period_start and g.period_start + 6)
  )
group by g.id;

-- ============================================================
-- 3. Notifications
-- ============================================================
create type notification_type as enum (
  'study_reminder',
  'admission_deadline',
  'new_material',
  'practice_milestone',
  'achievement_unlocked',
  'system_announcement'
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text,
  link_href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_unread_idx on notifications (user_id, read_at, created_at desc);

alter table notifications enable row level security;

create policy "notifications_select_own" on notifications
  for select using (auth.uid() = user_id);
create policy "notifications_update_own" on notifications
  for update using (auth.uid() = user_id);
-- inserts happen via service role (triggers/cron/admin), not directly from the client.

-- Auto-notify on achievement unlock, reusing the existing user_achievements table.
create or replace function notify_on_achievement_unlock()
returns trigger as $$
declare
  achievement_name text;
begin
  select name into achievement_name from achievements where id = new.achievement_id;
  insert into notifications (user_id, type, title, body)
  values (
    new.user_id,
    'achievement_unlocked',
    'Achievement unlocked',
    coalesce(achievement_name, 'You unlocked a new badge.')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_user_achievement_insert
  after insert on user_achievements
  for each row execute function notify_on_achievement_unlock();

-- ============================================================
-- 4. Admission deadlines (reference data, staff-managed)
-- ============================================================
create table admission_deadlines (
  id uuid primary key default gen_random_uuid(),
  university text not null,
  program text,
  entry_test entry_test,
  deadline_date date not null,
  application_url text,
  notes text,
  created_at timestamptz not null default now()
);

alter table admission_deadlines enable row level security;

create policy "admission_deadlines_read_all" on admission_deadlines
  for select using (true);
create policy "admission_deadlines_write_staff" on admission_deadlines
  for all using (public.is_staff()) with check (public.is_staff());

-- ============================================================
-- 5. University test interface configs
-- ============================================================
-- Drives the "University Interface Selector" in the practice engine:
-- one row per supported university, holding the display + timing rules
-- so the frontend doesn't hardcode them.
create table university_test_configs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,               -- e.g. 'nust-net'
  university text not null,                -- e.g. 'NUST'
  test_name text not null,                 -- e.g. 'NET'
  accent_color text not null default '#3E6AE1',
  total_minutes int not null,
  total_questions int not null,
  negative_marking boolean not null default false,
  negative_marking_fraction numeric(3,2),  -- e.g. 0.25
  navigation_style text not null default 'grid', -- 'grid' | 'linear' | 'sectioned'
  sections jsonb not null default '[]',    -- [{ name, question_count, minutes }]
  is_verified boolean not null default false, -- true = sourced from official docs, false = labeled approximation
  source_url text,
  created_at timestamptz not null default now()
);

alter table university_test_configs enable row level security;

create policy "university_test_configs_read_all" on university_test_configs
  for select using (true);
create policy "university_test_configs_write_staff" on university_test_configs
  for all using (public.is_staff()) with check (public.is_staff());

insert into university_test_configs
  (slug, university, test_name, accent_color, total_minutes, total_questions, negative_marking, negative_marking_fraction, navigation_style, sections, is_verified, source_url)
values
  ('nust-net', 'NUST', 'NET', '#1F4FD1', 120, 200, true, 0.25, 'sectioned',
    '[{"name":"Mathematics","question_count":80,"minutes":48},{"name":"Physics","question_count":60,"minutes":36},{"name":"English & Intelligence","question_count":60,"minutes":36}]',
    false, null),
  ('fast-admission', 'FAST-NUCES', 'Admission Test', '#0E7C66', 90, 100, false, null, 'grid',
    '[{"name":"Mathematics","question_count":30,"minutes":30},{"name":"English","question_count":20,"minutes":15},{"name":"Analytical Skills","question_count":20,"minutes":15},{"name":"Physics/CS","question_count":30,"minutes":30}]',
    false, null),
  ('comsats-nat', 'COMSATS', 'NAT / Entry Test', '#7C3AED', 90, 90, false, null, 'grid', '[]', false, null),
  ('giki-test', 'GIKI', 'Admission Test', '#B45309', 150, 100, false, null, 'sectioned',
    '[{"name":"Mathematics","question_count":40,"minutes":60},{"name":"Physics","question_count":30,"minutes":45},{"name":"English & IQ","question_count":30,"minutes":45}]',
    false, null),
  ('pieas-test', 'PIEAS', 'Admission Test', '#0369A1', 150, 100, false, null, 'sectioned', '[]', false, null),
  ('uet-taxila-ecat', 'UET', 'ECAT', '#DC2626', 100, 100, false, null, 'linear', '[]', false, null)
on conflict (slug) do nothing;

-- ============================================================
-- 6. Seed a starter achievement catalog (table existed, was empty)
-- ============================================================
insert into achievements (slug, name, description, icon, criteria) values
  ('first-session', 'First Steps', 'Complete your first practice session.', 'footprints', '{"sessions_completed":1}'),
  ('streak-3', 'Warming Up', 'Reach a 3-day study streak.', 'flame', '{"streak_days":3}'),
  ('streak-7', 'One Week Strong', 'Reach a 7-day study streak.', 'flame', '{"streak_days":7}'),
  ('streak-30', 'Unstoppable', 'Reach a 30-day study streak.', 'flame', '{"streak_days":30}'),
  ('questions-100', 'Century', 'Answer 100 questions.', 'target', '{"questions_answered":100}'),
  ('questions-1000', 'Grinder', 'Answer 1,000 questions.', 'target', '{"questions_answered":1000}'),
  ('accuracy-90', 'Sharpshooter', 'Hit 90% accuracy across 50+ questions in a session.', 'crosshair', '{"min_accuracy":0.9,"min_questions":50}'),
  ('mock-first', 'Test Day', 'Complete your first full mock test.', 'clipboard-check', '{"mock_sessions_completed":1}')
on conflict (slug) do nothing;
