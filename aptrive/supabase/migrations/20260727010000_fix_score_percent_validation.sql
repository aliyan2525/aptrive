-- ============================================================
-- Fix a bug in the previous migration
-- (20260727000100_lock_practice_session_scores.sql), found before
-- it caused visible harm but confirmed to be live-broken:
--
-- completeSession() (lib/repositories/practice.repository.ts) only
-- writes status/completed_at/score_percent/skipped_count on
-- practice_sessions — it deliberately stopped writing
-- correct_count/incorrect_count (see that file's comments and
-- PRACTICE_MIGRATION_WRITEUP.md: "computed on read" decision).
-- Those two columns default to 0 and are never updated again by any
-- app code path (confirmed by grepping the whole repo).
--
-- The previous trigger required new.correct_count/incorrect_count to
-- match a live count from user_attempts on every score_percent
-- change. Since the app never updates those columns, they stay at 0
-- while the computed value is whatever the user actually got right —
-- so the trigger rejected every legitimate completeSession() call
-- except the (score = 0) edge case. It also never validated
-- score_percent itself, which was the actual point of the fix.
--
-- Correct behavior:
--   1. correct_count/incorrect_count are not client-writable at all —
--      nothing legitimate changes them post-2026-07-26, so ANY change
--      is rejected outright rather than "checked against user_attempts".
--   2. score_percent, when changed, must match the same
--      round(correct/answered * 10000) / 100 computation
--      completeSession() itself uses.
-- ============================================================

create or replace function public.guard_practice_session_score_columns()
returns trigger
language plpgsql
as $$
declare
  computed_correct int;
  computed_total int;
  computed_score numeric;
begin
  if (new.correct_count is distinct from old.correct_count)
     or (new.incorrect_count is distinct from old.incorrect_count) then
    raise exception 'practice_sessions: correct_count/incorrect_count are no longer client-writable';
  end if;

  if new.score_percent is distinct from old.score_percent then
    select
      count(*) filter (where is_correct),
      count(*)
    into computed_correct, computed_total
    from public.user_attempts
    where practice_session_id = new.id and user_id = new.user_id;

    -- Mirrors completeSession()'s
    -- Math.round((correct / answered) * 10000) / 100 exactly: both
    -- round a non-negative value away from zero, so they agree on
    -- every input, including the answered = 0 edge case (both -> 0).
    computed_score := case when computed_total > 0
      then round((computed_correct::numeric / computed_total) * 10000) / 100
      else 0
    end;

    if new.score_percent is distinct from computed_score then
      raise exception 'practice_sessions: score_percent must match user_attempts';
    end if;
  end if;

  return new;
end;
$$;

-- Trigger definition itself is unchanged (still before update, still
-- the same function name) — replacing the function body is enough,
-- no drop/recreate of the trigger needed.
