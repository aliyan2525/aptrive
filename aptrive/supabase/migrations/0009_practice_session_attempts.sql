-- ============================================================
-- Aptrive: Migrate Practice Flow to user_attempts (Path A)
--
-- This is the migration the engineering ticket actually asked for:
-- extend user_attempts to support practice-session grouping
-- (previously exam-only), with upsert/re-grade semantics for
-- "change your answer before finishing", and switch the dashboard
-- off the tables the legacy trigger populated.
--
-- Depends on 0008_user_attempts_foundation.sql. See the header of
-- that file for the reconstruction caveat — diff both files against
-- your real, deployed schema before merging.
-- ============================================================

-- 1. Schema migration --------------------------------------------------
alter table public.user_attempts
  add column if not exists practice_session_id uuid
    references public.practice_sessions (id) on delete set null;

-- exam_session_id was `not null` in the exam-only baseline; practice
-- attempts don't have one, so it has to become nullable. Enforce
-- "exactly one context" instead, mirroring the existing
-- bookmarks_exactly_one_target pattern in 0003_progress_practice_engagement.sql.
alter table public.user_attempts
  alter column exam_session_id drop not null;

alter table public.user_attempts
  drop constraint if exists user_attempts_exactly_one_context;
alter table public.user_attempts
  add constraint user_attempts_exactly_one_context check (
    (exam_session_id is not null and practice_session_id is null) or
    (exam_session_id is null and practice_session_id is not null)
  );

-- Upsert target for "change your answer before finishing the session".
create unique index if not exists user_attempts_practice_session_question_uq
  on public.user_attempts (user_id, practice_session_id, question_id)
  where practice_session_id is not null;

create index if not exists user_attempts_practice_session_id_idx
  on public.user_attempts (practice_session_id);

-- ============================================================
-- 2. Extend record_attempt_and_update_progress
--
--    New input shape adds an optional practice_session_id:
--      { "practice_session_id": uuid, "question_id": uuid, ... }
--    (exam_session_id and practice_session_id are mutually exclusive —
--    exactly one must be present, matching the new check constraint.)
--
--    XP-on-revision decision (documented in full in the deliverable
--    writeup): NET-OUT. When an existing practice attempt for
--    (user_id, practice_session_id, question_id) is re-answered, the
--    function inserts a *reversing* ledger entry for the old xp_delta
--    before applying the new one, rather than blocking re-grading or
--    silently skipping XP on revision. This was chosen over
--    "one-time-only" because it keeps user_xp_ledger fully additive
--    and auditable (sum(xp_delta) is always correct) without a
--    separate "has this question already paid out XP" flag, and it
--    means a learner who fixes a wrong answer does get the XP for
--    getting it right the second time — which matches the existing
--    mastery_percent behavior (topic progress also recomputes, not
--    just accumulates, on revision).
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
  v_practice_session_id uuid := (attempt->>'practice_session_id')::uuid;
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

  v_existing_id uuid;
  v_existing_is_correct boolean;
  v_existing_xp int;
  v_is_revision boolean := false;

  today date := current_date;
  yesterday date := today - 1;
  prev_last_active date;
begin
  if v_user_id is null then
    raise exception 'record_attempt_and_update_progress: not authenticated';
  end if;
  if (v_exam_session_id is null) = (v_practice_session_id is null) then
    raise exception 'record_attempt_and_update_progress: exactly one of exam_session_id or practice_session_id is required';
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

  -- Look for an existing attempt to revise (practice path only — the
  -- exam path has no upsert target and always inserts fresh).
  if v_practice_session_id is not null then
    select id, is_correct into v_existing_id, v_existing_is_correct
    from public.user_attempts
    where user_id = v_user_id
      and practice_session_id = v_practice_session_id
      and question_id = v_question_id
    for update;

    v_is_revision := found;
  end if;

  if v_is_revision then
    -- Net out the previous XP entry, then record the new one — keeps
    -- user_xp_ledger additive/auditable (see decision note above).
    select coalesce(sum(xp_delta), 0) into v_existing_xp
    from public.user_xp_ledger
    where attempt_id = v_existing_id;

    if v_existing_xp <> 0 then
      insert into public.user_xp_ledger (user_id, attempt_id, source, xp_delta)
      values (v_user_id, v_existing_id, 'question_attempt', -v_existing_xp);
    end if;

    update public.user_attempts
      set selected_option_ids = v_selected_option_ids,
          numeric_answer_given = v_numeric_answer_given,
          is_correct = v_is_correct,
          time_taken_seconds = v_time_taken_seconds,
          xp_awarded = v_xp_awarded,
          attempted_at = now()
      where id = v_existing_id
      returning id into v_attempt_id;

    if v_xp_awarded <> 0 then
      insert into public.user_xp_ledger (user_id, attempt_id, source, xp_delta)
      values (v_user_id, v_attempt_id, 'question_attempt', v_xp_awarded);
    end if;

    -- Topic progress: undo the previous correctness contribution, then
    -- reapply with the new one. questions_attempted does NOT change
    -- (revision of an already-attempted question, not a new attempt).
    if v_subject_id is not null and v_topic is not null then
      update public.user_topic_progress
        set questions_correct = greatest(
              questions_correct
                - case when v_existing_is_correct then 1 else 0 end
                + case when v_is_correct then 1 else 0 end,
              0
            ),
            mastery_percent = case when questions_attempted > 0 then round(
              (greatest(
                questions_correct
                  - case when v_existing_is_correct then 1 else 0 end
                  + case when v_is_correct then 1 else 0 end,
                0
              ))::numeric / questions_attempted * 100, 2
            ) else 0 end,
            last_practiced_at = now()
        where user_id = v_user_id and subject_id = v_subject_id and topic = v_topic;
    end if;
  else
    insert into public.user_attempts (
      user_id, exam_session_id, practice_session_id, question_id, selected_option_ids,
      numeric_answer_given, is_correct, time_taken_seconds, xp_awarded, attempted_at
    ) values (
      v_user_id, v_exam_session_id, v_practice_session_id, v_question_id, v_selected_option_ids,
      v_numeric_answer_given, v_is_correct, v_time_taken_seconds, v_xp_awarded, now()
    )
    returning id into v_attempt_id;

    if v_xp_awarded <> 0 then
      insert into public.user_xp_ledger (user_id, attempt_id, source, xp_delta)
      values (v_user_id, v_attempt_id, 'question_attempt', v_xp_awarded);
    end if;

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
  end if;

  -- Streak — only bump on a genuinely new attempt, not a revision of
  -- an already-answered question within the same session.
  if not v_is_revision then
    select last_active_date into prev_last_active
    from public.user_streaks where user_id = v_user_id;

    if prev_last_active is null then
      insert into public.user_streaks (user_id, current_streak, longest_streak, last_active_date)
      values (v_user_id, 1, 1, today);
    elsif prev_last_active = today then
      null;
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
  end if;

  return jsonb_build_object(
    'is_correct', v_is_correct,
    'correct_option_ids', to_jsonb(v_correct_option_ids),
    'correct_numeric_value', v_numeric_answer_value,
    'xp_awarded', v_xp_awarded
  );
end;
$$;

revoke all on function public.record_attempt_and_update_progress(jsonb) from public;
grant execute on function public.record_attempt_and_update_progress(jsonb) to authenticated;

-- ============================================================
-- 3. Dashboard summary view
--
-- practice_sessions.correct_count/incorrect_count decision
-- (documented in full in the writeup): COMPUTE ON READ, columns
-- KEPT for historical rows. The columns stay in the schema (dropping
-- them would be a breaking change for any historical/admin read we
-- haven't audited), but the application layer (0009's repository
-- changes) stops writing to and reading them for anything driven by
-- user_attempts — score/live-count are always derived fresh from
-- user_attempts going forward, so there's no dual-write to keep in
-- sync and no risk of the cached columns drifting stale silently.
--
-- v_user_dashboard_summary replaces daily_activity as the dashboard's
-- per-day activity source (sessions_completed here is approximated as
-- "distinct sessions with at least one attempt that day" rather than
-- the old exact "session transitioned to completed" count — see
-- writeup for why that tradeoff was accepted).
-- ============================================================
create or replace view public.v_user_dashboard_summary as
select
  user_id,
  attempted_at::date as activity_date,
  count(*)::int as questions_attempted,
  count(*) filter (where is_correct)::int as correct_count,
  coalesce(sum(time_taken_seconds), 0)::int as study_seconds,
  count(distinct coalesce(practice_session_id, exam_session_id))::int as sessions_completed
from public.user_attempts
group by user_id, (attempted_at::date);

-- Views inherit RLS from their underlying tables' policies only when
-- queried as the invoking user (security invoker, the default) — this
-- view is safe to expose broadly since user_attempts already
-- restricts select to auth.uid() = user_id / staff.
grant select on public.v_user_dashboard_summary to authenticated;
