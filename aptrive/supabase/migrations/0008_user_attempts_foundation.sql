-- ============================================================
-- Aptrive: user_attempts foundation (RECONSTRUCTED BASELINE)
--
-- ******************************************************************
-- ASSUMPTION FLAG: The engineering ticket this migration was written
-- against ("Migrate Practice Flow to user_attempts (Path A)")
-- describes user_attempts, record_attempt_and_update_progress(),
-- exam_sessions, user_topic_progress, user_xp_ledger, and
-- user_streaks as infrastructure that ALREADY EXISTS in production
-- and is already used by the mock-exam flow. None of these objects
-- were present in the repository snapshot this migration was
-- authored against (supabase/migrations/0001-0007, lib/database.types.ts,
-- and every repository/action file) — only the legacy
-- practice_sessions/question_responses system exists there.
--
-- This file is a best-effort RECONSTRUCTION of that "new path" as
-- described in the ticket (exam-only, exam_session_id required,
-- no practice-session grouping yet), written defensively
-- (`create table if not exists`) so that:
--   - if the real objects already exist in your actual database and
--     this repo snapshot was just missing the migration file, this
--     migration is a no-op against them, and only 0009 (which does
--     the real ticket work) will actually touch anything;
--   - if they genuinely don't exist yet, this migration stands alone
--     as the founding schema for that system.
--
-- Before merging: diff this file's `record_attempt_and_update_progress`
-- body and the exam_sessions/user_attempts column list against the
-- real, currently-deployed versions of these objects. Everything here
-- is inferred from the ticket's prose, not copied from a verified
-- source.
-- ******************************************************************
-- ============================================================

-- 1. Exam sessions (mock-exam grouping; pre-existing per the ticket) --
create table if not exists public.exam_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  test_id uuid references public.tests (id) on delete set null,
  status text not null default 'in_progress'
    check (status in ('in_progress', 'completed', 'abandoned')),
  total_questions int not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists exam_sessions_user_id_idx on public.exam_sessions (user_id);

-- 2. user_attempts (exam-only baseline; RLS has NO client-writable
--    policies — every row is written exclusively through
--    record_attempt_and_update_progress, a SECURITY DEFINER function).
create table if not exists public.user_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  exam_session_id uuid not null references public.exam_sessions (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  selected_option_ids uuid[],
  numeric_answer_given numeric,
  is_correct boolean not null default false,
  time_taken_seconds int not null default 0,
  xp_awarded int not null default 0,
  attempted_at timestamptz not null default now()
);

create index if not exists user_attempts_user_id_idx on public.user_attempts (user_id, attempted_at desc);
create index if not exists user_attempts_question_id_idx on public.user_attempts (question_id);
create index if not exists user_attempts_exam_session_id_idx on public.user_attempts (exam_session_id);

-- 3. user_topic_progress (new-path equivalent of topic_mastery) ------
create table if not exists public.user_topic_progress (
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

create index if not exists user_topic_progress_user_id_idx on public.user_topic_progress (user_id);

drop trigger if exists set_user_topic_progress_updated_at on public.user_topic_progress;
create trigger set_user_topic_progress_updated_at
  before update on public.user_topic_progress
  for each row execute function public.set_updated_at();

-- 4. user_xp_ledger (append-only; lets progress be recomputed/netted
--    out without re-deriving XP from scratch — needed so answer
--    revisions in 0009 don't double-count XP).
create table if not exists public.user_xp_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  attempt_id uuid references public.user_attempts (id) on delete cascade,
  source text not null default 'question_attempt'
    check (source in ('question_attempt', 'achievement', 'bonus')),
  xp_delta int not null,
  created_at timestamptz not null default now()
);

create index if not exists user_xp_ledger_user_id_idx on public.user_xp_ledger (user_id);
create index if not exists user_xp_ledger_attempt_id_idx on public.user_xp_ledger (attempt_id);

-- 5. user_streaks (new-path equivalent of study_streaks) -------------
create table if not exists public.user_streaks (
  user_id uuid primary key references auth.users (id) on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_active_date date,
  updated_at timestamptz not null default now()
);

drop trigger if exists set_user_streaks_updated_at on public.user_streaks;
create trigger set_user_streaks_updated_at
  before update on public.user_streaks
  for each row execute function public.set_updated_at();

-- ============================================================
-- 6. record_attempt_and_update_progress(attempt jsonb)
--    SECURITY DEFINER — the only sanctioned write path into
--    user_attempts. Baseline (exam-only) behavior; extended for
--    practice sessions in 0009_practice_session_attempts.sql.
--
--    Expected input shape (baseline):
--      {
--        "exam_session_id": uuid,
--        "question_id": uuid,
--        "selected_option_ids": uuid[] | null,
--        "numeric_answer_given": numeric | null,
--        "time_taken_seconds": int
--      }
--    Returns:
--      {
--        "is_correct": boolean,
--        "correct_option_ids": uuid[] | null,
--        "correct_numeric_value": numeric | null,
--        "xp_awarded": int
--      }
-- ============================================================
create or replace function public.record_attempt_and_update_progress(attempt jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_exam_session_id uuid := (attempt->>'exam_session_id')::uuid;
  v_question_id uuid := (attempt->>'question_id')::uuid;
  v_selected_option_ids uuid[] := case
    when attempt ? 'selected_option_ids' and jsonb_typeof(attempt->'selected_option_ids') = 'array'
      then (select array_agg(value::uuid) from jsonb_array_elements_text(attempt->'selected_option_ids'))
    else null
  end;
  v_numeric_answer_given numeric := (attempt->>'numeric_answer_given')::numeric;
  v_time_taken_seconds int := coalesce((attempt->>'time_taken_seconds')::int, 0);

  v_question_type text;
  v_subject_id uuid;
  v_topic text;
  v_numeric_answer_value numeric;
  v_numeric_answer_tolerance numeric;
  v_correct_option_ids uuid[];
  v_is_correct boolean := false;
  v_xp_awarded int := 0;
  v_attempt_id uuid;

  today date := current_date;
  yesterday date := today - 1;
  prev_last_active date;
begin
  if v_user_id is null then
    raise exception 'record_attempt_and_update_progress: not authenticated';
  end if;
  if v_exam_session_id is null then
    raise exception 'record_attempt_and_update_progress: exam_session_id is required';
  end if;

  select question_type, subject_id, topic, numeric_answer_value, numeric_answer_tolerance
    into v_question_type, v_subject_id, v_topic, v_numeric_answer_value, v_numeric_answer_tolerance
  from public.questions
  where id = v_question_id;

  if not found then
    raise exception 'record_attempt_and_update_progress: question % not found', v_question_id;
  end if;

  -- Server-side grading (mirrors lib/services/scoring.ts::gradeAttempt) --
  if v_question_type = 'numeric' then
    v_is_correct := v_numeric_answer_value is not null
      and v_numeric_answer_given is not null
      and abs(v_numeric_answer_given - v_numeric_answer_value) <= coalesce(v_numeric_answer_tolerance, 0);
  elsif v_question_type = 'multiple_choice' then
    select array_agg(id order by id) into v_correct_option_ids
    from public.question_options
    where question_id = v_question_id and is_correct = true;

    v_is_correct := coalesce(
      (select array_agg(x order by x) from unnest(v_selected_option_ids) x)
        = v_correct_option_ids,
      false
    );
  else
    -- single_choice
    select array_agg(id) into v_correct_option_ids
    from public.question_options
    where question_id = v_question_id and is_correct = true;

    v_is_correct := v_selected_option_ids is not null
      and array_length(v_selected_option_ids, 1) = 1
      and v_selected_option_ids[1] = any(v_correct_option_ids);
  end if;

  v_xp_awarded := case when v_is_correct then 10 else 0 end;

  insert into public.user_attempts (
    user_id, exam_session_id, question_id, selected_option_ids,
    numeric_answer_given, is_correct, time_taken_seconds, xp_awarded, attempted_at
  ) values (
    v_user_id, v_exam_session_id, v_question_id, v_selected_option_ids,
    v_numeric_answer_given, v_is_correct, v_time_taken_seconds, v_xp_awarded, now()
  )
  returning id into v_attempt_id;

  if v_xp_awarded <> 0 then
    insert into public.user_xp_ledger (user_id, attempt_id, source, xp_delta)
    values (v_user_id, v_attempt_id, 'question_attempt', v_xp_awarded);
  end if;

  -- Topic progress -------------------------------------------------
  if v_subject_id is not null and v_topic is not null then
    insert into public.user_topic_progress (
      user_id, subject_id, topic, questions_attempted, questions_correct,
      mastery_percent, last_practiced_at
    ) values (
      v_user_id, v_subject_id, v_topic, 1,
      case when v_is_correct then 1 else 0 end,
      case when v_is_correct then 100 else 0 end,
      now()
    )
    on conflict (user_id, subject_id, topic) do update
      set questions_attempted = public.user_topic_progress.questions_attempted + 1,
          questions_correct = public.user_topic_progress.questions_correct
            + case when v_is_correct then 1 else 0 end,
          mastery_percent = round(
            (public.user_topic_progress.questions_correct + case when v_is_correct then 1 else 0 end)::numeric
            / (public.user_topic_progress.questions_attempted + 1) * 100, 2
          ),
          last_practiced_at = now();
  end if;

  -- Streak -----------------------------------------------------------
  select last_active_date into prev_last_active
  from public.user_streaks where user_id = v_user_id;

  if prev_last_active is null then
    insert into public.user_streaks (user_id, current_streak, longest_streak, last_active_date)
    values (v_user_id, 1, 1, today)
    on conflict (user_id) do update
      set current_streak = 1,
          longest_streak = greatest(public.user_streaks.longest_streak, 1),
          last_active_date = today
      where public.user_streaks.last_active_date is distinct from today;
  elsif prev_last_active = today then
    null; -- already counted today
  elsif prev_last_active = yesterday then
    update public.user_streaks
      set current_streak = current_streak + 1,
          longest_streak = greatest(longest_streak, current_streak + 1),
          last_active_date = today
      where user_id = v_user_id;
  else
    update public.user_streaks
      set current_streak = 1,
          longest_streak = greatest(longest_streak, 1),
          last_active_date = today
      where user_id = v_user_id;
  end if;

  return jsonb_build_object(
    'is_correct', v_is_correct,
    'correct_option_ids', to_jsonb(v_correct_option_ids),
    'correct_numeric_value', v_numeric_answer_value,
    'xp_awarded', v_xp_awarded
  );
end;
$$;

-- Only authenticated users may call the RPC; it enforces auth.uid()
-- internally and is the sole write path (see RLS block below).
revoke all on function public.record_attempt_and_update_progress(jsonb) from public;
grant execute on function public.record_attempt_and_update_progress(jsonb) to authenticated;

-- ============================================================
-- Row Level Security — zero client-writable policies on
-- user_attempts. Select-only for the owning user / staff; all
-- writes are funneled through the SECURITY DEFINER RPC above.
-- ============================================================
alter table public.exam_sessions enable row level security;
alter table public.user_attempts enable row level security;
alter table public.user_topic_progress enable row level security;
alter table public.user_xp_ledger enable row level security;
alter table public.user_streaks enable row level security;

drop policy if exists "exam_sessions_all_own" on public.exam_sessions;
create policy "exam_sessions_all_own" on public.exam_sessions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "exam_sessions_select_staff" on public.exam_sessions;
create policy "exam_sessions_select_staff" on public.exam_sessions for select
  using (public.is_staff());

drop policy if exists "user_attempts_select_own" on public.user_attempts;
create policy "user_attempts_select_own" on public.user_attempts for select
  using (auth.uid() = user_id);
drop policy if exists "user_attempts_select_staff" on public.user_attempts;
create policy "user_attempts_select_staff" on public.user_attempts for select
  using (public.is_staff());
-- Deliberately no insert/update/delete policy: rows are written only
-- via record_attempt_and_update_progress (SECURITY DEFINER).

drop policy if exists "user_topic_progress_select_own" on public.user_topic_progress;
create policy "user_topic_progress_select_own" on public.user_topic_progress for select
  using (auth.uid() = user_id);
drop policy if exists "user_topic_progress_select_staff" on public.user_topic_progress;
create policy "user_topic_progress_select_staff" on public.user_topic_progress for select
  using (public.is_staff());

drop policy if exists "user_xp_ledger_select_own" on public.user_xp_ledger;
create policy "user_xp_ledger_select_own" on public.user_xp_ledger for select
  using (auth.uid() = user_id);

drop policy if exists "user_streaks_select_own" on public.user_streaks;
create policy "user_streaks_select_own" on public.user_streaks for select
  using (auth.uid() = user_id);
drop policy if exists "user_streaks_select_staff" on public.user_streaks;
create policy "user_streaks_select_staff" on public.user_streaks for select
  using (public.is_staff());
