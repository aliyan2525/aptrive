-- ============================================================
-- Aptrive: Progress tracking, practice history, streaks,
-- bookmarks, and achievements.
-- Everything here is user-scoped and RLS-protected: a user can
-- only ever read/write their own rows; staff/admins can read all.
-- ============================================================

-- 1. Practice sessions ----------------------------------------------
create table if not exists public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  practice_set_id uuid references public.practice_sets (id) on delete set null,
  subject_id uuid references public.subjects (id) on delete set null,
  mode text not null default 'practice'
    check (mode in ('practice', 'mock', 'exam', 'daily-challenge')),
  status text not null default 'in_progress'
    check (status in ('in_progress', 'completed', 'abandoned')),
  total_questions int not null default 0,
  correct_count int not null default 0,
  incorrect_count int not null default 0,
  skipped_count int not null default 0,
  score_percent numeric(5, 2),
  time_spent_seconds int not null default 0,
  timer_enabled boolean not null default true,
  randomized boolean not null default false,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists practice_sessions_user_id_idx on public.practice_sessions (user_id);
create index if not exists practice_sessions_started_at_idx on public.practice_sessions (user_id, started_at desc);

-- 2. Question responses (one row per answered question) -------------
create table if not exists public.question_responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.practice_sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  selected_option_id uuid references public.question_options (id) on delete set null,
  is_correct boolean not null default false,
  flagged_for_review boolean not null default false,
  time_spent_seconds int not null default 0,
  answered_at timestamptz not null default now(),
  unique (session_id, question_id)
);

create index if not exists question_responses_user_id_idx on public.question_responses (user_id, answered_at desc);
create index if not exists question_responses_question_id_idx on public.question_responses (question_id);

-- 3. Topic mastery (aggregated per user/subject/topic) ---------------
create table if not exists public.topic_mastery (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject_id uuid references public.subjects (id) on delete cascade,
  topic text not null,
  questions_attempted int not null default 0,
  questions_correct int not null default 0,
  mastery_percent numeric(5, 2) not null default 0,
  last_practiced_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, subject_id, topic)
);

create index if not exists topic_mastery_user_id_idx on public.topic_mastery (user_id);

drop trigger if exists set_topic_mastery_updated_at on public.topic_mastery;
create trigger set_topic_mastery_updated_at
  before update on public.topic_mastery
  for each row execute function public.set_updated_at();

-- 4. Daily activity (powers streaks, heatmap, weekly summary) --------
create table if not exists public.daily_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  activity_date date not null default (now()::date),
  questions_attempted int not null default 0,
  correct_count int not null default 0,
  study_seconds int not null default 0,
  sessions_completed int not null default 0,
  unique (user_id, activity_date)
);

create index if not exists daily_activity_user_id_date_idx on public.daily_activity (user_id, activity_date desc);

-- 5. Study streaks (one row per user) ---------------------------------
create table if not exists public.study_streaks (
  user_id uuid primary key references auth.users (id) on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_active_date date,
  updated_at timestamptz not null default now()
);

drop trigger if exists set_study_streaks_updated_at on public.study_streaks;
create trigger set_study_streaks_updated_at
  before update on public.study_streaks
  for each row execute function public.set_updated_at();

-- 6. Bookmarks (a question OR a whole practice set, never neither) ---
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id uuid references public.questions (id) on delete cascade,
  practice_set_id uuid references public.practice_sets (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint bookmarks_exactly_one_target check (
    (question_id is not null and practice_set_id is null) or
    (question_id is null and practice_set_id is not null)
  )
);

create unique index if not exists bookmarks_user_question_uq
  on public.bookmarks (user_id, question_id) where question_id is not null;
create unique index if not exists bookmarks_user_set_uq
  on public.bookmarks (user_id, practice_set_id) where practice_set_id is not null;

-- 7. Recently viewed --------------------------------------------------
create table if not exists public.recently_viewed (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  resource_type text not null check (resource_type in ('practice_set', 'question', 'video', 'pdf')),
  resource_id uuid not null,
  viewed_at timestamptz not null default now(),
  unique (user_id, resource_type, resource_id)
);

create index if not exists recently_viewed_user_id_idx on public.recently_viewed (user_id, viewed_at desc);

-- 8. Achievements catalog + earned achievements ------------------------
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  icon text,
  criteria jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  achievement_id uuid not null references public.achievements (id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

create index if not exists user_achievements_user_id_idx on public.user_achievements (user_id);

-- ============================================================
-- Triggers: keep daily_activity / study_streaks / topic_mastery
-- in sync automatically whenever a question is answered, and
-- bump sessions_completed when a session finishes.
-- ============================================================

create or replace function public.handle_question_response()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  q_subject_id uuid;
  q_topic text;
  today date := (new.answered_at)::date;
  yesterday date := today - 1;
  prev_last_active date;
begin
  select subject_id, topic into q_subject_id, q_topic
  from public.questions
  where id = new.question_id;

  -- Daily activity upsert
  insert into public.daily_activity (user_id, activity_date, questions_attempted, correct_count, study_seconds)
  values (new.user_id, today, 1, case when new.is_correct then 1 else 0 end, new.time_spent_seconds)
  on conflict (user_id, activity_date) do update
    set questions_attempted = public.daily_activity.questions_attempted + 1,
        correct_count = public.daily_activity.correct_count + case when new.is_correct then 1 else 0 end,
        study_seconds = public.daily_activity.study_seconds + new.time_spent_seconds;

  -- Study streak upsert
  select last_active_date into prev_last_active
  from public.study_streaks where user_id = new.user_id;

  if prev_last_active is null then
    insert into public.study_streaks (user_id, current_streak, longest_streak, last_active_date)
    values (new.user_id, 1, 1, today);
  elsif prev_last_active = today then
    -- already counted today, no streak change
    null;
  elsif prev_last_active = yesterday then
    update public.study_streaks
      set current_streak = current_streak + 1,
          longest_streak = greatest(longest_streak, current_streak + 1),
          last_active_date = today
      where user_id = new.user_id;
  else
    update public.study_streaks
      set current_streak = 1,
          longest_streak = greatest(longest_streak, 1),
          last_active_date = today
      where user_id = new.user_id;
  end if;

  -- Topic mastery upsert
  if q_subject_id is not null and q_topic is not null then
    insert into public.topic_mastery (user_id, subject_id, topic, questions_attempted, questions_correct, mastery_percent, last_practiced_at)
    values (
      new.user_id, q_subject_id, q_topic, 1,
      case when new.is_correct then 1 else 0 end,
      case when new.is_correct then 100 else 0 end,
      new.answered_at
    )
    on conflict (user_id, subject_id, topic) do update
      set questions_attempted = public.topic_mastery.questions_attempted + 1,
          questions_correct = public.topic_mastery.questions_correct + case when new.is_correct then 1 else 0 end,
          mastery_percent = round(
            (public.topic_mastery.questions_correct + case when new.is_correct then 1 else 0 end)::numeric
            / (public.topic_mastery.questions_attempted + 1) * 100, 2
          ),
          last_practiced_at = new.answered_at;
  end if;

  return new;
end;
$$;

drop trigger if exists on_question_response_insert on public.question_responses;
create trigger on_question_response_insert
  after insert on public.question_responses
  for each row execute function public.handle_question_response();

-- Bump sessions_completed the moment a session transitions to 'completed'
create or replace function public.handle_session_completed()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status = 'completed' and old.status is distinct from 'completed' then
    insert into public.daily_activity (user_id, activity_date, sessions_completed)
    values (new.user_id, (coalesce(new.completed_at, now()))::date, 1)
    on conflict (user_id, activity_date) do update
      set sessions_completed = public.daily_activity.sessions_completed + 1;
  end if;
  return new;
end;
$$;

drop trigger if exists on_practice_session_completed on public.practice_sessions;
create trigger on_practice_session_completed
  after update on public.practice_sessions
  for each row execute function public.handle_session_completed();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.practice_sessions enable row level security;
alter table public.question_responses enable row level security;
alter table public.topic_mastery enable row level security;
alter table public.daily_activity enable row level security;
alter table public.study_streaks enable row level security;
alter table public.bookmarks enable row level security;
alter table public.recently_viewed enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;

-- practice_sessions: user owns their rows; staff can read all
drop policy if exists "practice_sessions_all_own" on public.practice_sessions;
create policy "practice_sessions_all_own" on public.practice_sessions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "practice_sessions_select_staff" on public.practice_sessions;
create policy "practice_sessions_select_staff" on public.practice_sessions for select
  using (public.is_staff());

-- question_responses
drop policy if exists "question_responses_all_own" on public.question_responses;
create policy "question_responses_all_own" on public.question_responses for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "question_responses_select_staff" on public.question_responses;
create policy "question_responses_select_staff" on public.question_responses for select
  using (public.is_staff());

-- topic_mastery (system-maintained; user can read own, no direct writes from client)
drop policy if exists "topic_mastery_select_own" on public.topic_mastery;
create policy "topic_mastery_select_own" on public.topic_mastery for select
  using (auth.uid() = user_id);
drop policy if exists "topic_mastery_select_staff" on public.topic_mastery;
create policy "topic_mastery_select_staff" on public.topic_mastery for select
  using (public.is_staff());

-- daily_activity (system-maintained; user can read own)
drop policy if exists "daily_activity_select_own" on public.daily_activity;
create policy "daily_activity_select_own" on public.daily_activity for select
  using (auth.uid() = user_id);
drop policy if exists "daily_activity_select_staff" on public.daily_activity;
create policy "daily_activity_select_staff" on public.daily_activity for select
  using (public.is_staff());

-- study_streaks (system-maintained; user can read own)
drop policy if exists "study_streaks_select_own" on public.study_streaks;
create policy "study_streaks_select_own" on public.study_streaks for select
  using (auth.uid() = user_id);
drop policy if exists "study_streaks_select_staff" on public.study_streaks;
create policy "study_streaks_select_staff" on public.study_streaks for select
  using (public.is_staff());

-- bookmarks
drop policy if exists "bookmarks_all_own" on public.bookmarks;
create policy "bookmarks_all_own" on public.bookmarks for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- recently_viewed
drop policy if exists "recently_viewed_all_own" on public.recently_viewed;
create policy "recently_viewed_all_own" on public.recently_viewed for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- achievements catalog: public read, staff write
drop policy if exists "achievements_select_all" on public.achievements;
create policy "achievements_select_all" on public.achievements for select using (true);
drop policy if exists "achievements_write_staff" on public.achievements;
create policy "achievements_write_staff" on public.achievements for all
  using (public.is_staff()) with check (public.is_staff());

-- user_achievements: user reads own; system/staff can insert
drop policy if exists "user_achievements_select_own" on public.user_achievements;
create policy "user_achievements_select_own" on public.user_achievements for select
  using (auth.uid() = user_id);
drop policy if exists "user_achievements_select_staff" on public.user_achievements;
create policy "user_achievements_select_staff" on public.user_achievements for select
  using (public.is_staff());
drop policy if exists "user_achievements_write_staff" on public.user_achievements;
create policy "user_achievements_write_staff" on public.user_achievements for insert
  with check (public.is_staff());
