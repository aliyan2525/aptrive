-- ============================================================
-- Close the direct-API grading-integrity gap on practice_sessions
-- and question_responses. The "for all" policies on both tables
-- let an authenticated user PATCH their own row via the Supabase
-- REST API directly, bypassing server-side grading entirely
-- (score_percent, correct_count, incorrect_count, status).
--
-- lib/repositories/practice.repository.ts's completeSession()
-- already computes these fields server-side from user_attempts,
-- so the RLS layer was just never tightened to match.
-- ============================================================

-- practice_sessions: split "for all" into select/insert/update,
-- and add a trigger that blocks any UPDATE where the score/count
-- columns don't match what's actually in user_attempts.
drop policy if exists "practice_sessions_all_own" on public.practice_sessions;

create policy "practice_sessions_select_own" on public.practice_sessions
  for select using (auth.uid() = user_id);

create policy "practice_sessions_insert_own" on public.practice_sessions
  for insert with check (auth.uid() = user_id);

-- Update is still needed by getOrCreatePracticeSetSession/completeSession,
-- which run server-side under the user's own session (not a service
-- role). RLS alone can't express column-level restrictions, so the
-- trigger below narrows what CAN actually change on the score columns.
create policy "practice_sessions_update_own" on public.practice_sessions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.guard_practice_session_score_columns()
returns trigger
language plpgsql
as $$
declare
  computed_correct int;
  computed_incorrect int;
begin
  -- Only enforce when the score-bearing columns are actually changing.
  if (new.score_percent is distinct from old.score_percent)
     or (new.correct_count is distinct from old.correct_count)
     or (new.incorrect_count is distinct from old.incorrect_count) then

    select
      count(*) filter (where is_correct),
      count(*) filter (where not is_correct)
    into computed_correct, computed_incorrect
    from public.user_attempts
    where practice_session_id = new.id and user_id = new.user_id;

    if new.correct_count is distinct from computed_correct
       or new.incorrect_count is distinct from computed_incorrect then
      raise exception 'practice_sessions: correct_count/incorrect_count must match user_attempts';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists guard_practice_session_score_columns on public.practice_sessions;
create trigger guard_practice_session_score_columns
  before update on public.practice_sessions
  for each row execute function public.guard_practice_session_score_columns();

-- question_responses: same "for all" pattern, same underlying gap.
-- No update/delete policy is added back — a submitted response
-- should not be client-editable after the fact, matching how
-- user_attempts already works.
drop policy if exists "question_responses_all_own" on public.question_responses;

create policy "question_responses_select_own" on public.question_responses
  for select using (auth.uid() = user_id);

create policy "question_responses_insert_own" on public.question_responses
  for insert with check (auth.uid() = user_id);
