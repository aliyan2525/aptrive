-- ============================================================
-- Consolidate authorization: retire admin_users / private.is_admin()
-- in favor of the single source of truth, public.is_staff()
-- (which reads live profiles.role, the only role field the app
-- actually manages).
--
-- Ground-truth policy names below were verified against
--   select tablename, policyname, cmd, qual, with_check
--   from pg_policies where schemaname = 'public'
-- run against the live project on 2026-07-26 before writing this
-- file. All names matched exactly; no reconstruction was needed.
--
-- NOTE: this migration intentionally does NOT drop
-- public.admin_users. Per the rollout plan, that table stays in
-- place for a few days after this lands, as a rollback safety
-- net, and is dropped in its own separate migration once
-- production logs confirm nothing still hits it.
-- ============================================================

-- Tables from 0006_phase_0_foundations.sql
drop policy if exists "universities_write_admin" on public.universities;
create policy "universities_write_staff" on public.universities
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "tests_write_admin" on public.tests;
create policy "tests_write_staff" on public.tests
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "chapters_write_admin" on public.chapters;
create policy "chapters_write_staff" on public.chapters
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "topics_write_admin" on public.topics;
create policy "topics_write_staff" on public.topics
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "subtopics_write_admin" on public.subtopics;
create policy "subtopics_write_staff" on public.subtopics
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "difficulty_levels_write_admin" on public.difficulty_levels;
create policy "difficulty_levels_write_staff" on public.difficulty_levels
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "question_images_write_admin" on public.question_images;
create policy "question_images_write_staff" on public.question_images
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "question_tags_write_admin" on public.question_tags;
create policy "question_tags_write_staff" on public.question_tags
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "question_tag_map_write_admin" on public.question_tag_map;
create policy "question_tag_map_write_staff" on public.question_tag_map
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "question_explanations_write_admin" on public.question_explanations;
create policy "question_explanations_write_staff" on public.question_explanations
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "question_hints_write_admin" on public.question_hints;
create policy "question_hints_write_staff" on public.question_hints
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "question_formulas_write_admin" on public.question_formulas;
create policy "question_formulas_write_staff" on public.question_formulas
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "question_references_write_admin" on public.question_references;
create policy "question_references_write_staff" on public.question_references
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "question_reviews_write_admin" on public.question_reviews;
create policy "question_reviews_write_staff" on public.question_reviews
  for all using (public.is_staff()) with check (public.is_staff());

-- Tables from 20260724100000_remote_sync_missing_objects.sql
-- (policy names verified verbatim against pg_policies)
drop policy if exists question_reports_select_own_or_admin on public.question_reports;
create policy question_reports_select_own_or_staff on public.question_reports
  for select using (reported_by = auth.uid() or public.is_staff());

drop policy if exists question_reports_update_admin on public.question_reports;
create policy question_reports_update_staff on public.question_reports
  for update using (public.is_staff()) with check (public.is_staff());

drop policy if exists question_reports_delete_admin on public.question_reports;
create policy question_reports_delete_staff on public.question_reports
  for delete using (public.is_staff());

drop policy if exists ai_question_assets_admin_all on public.ai_question_assets;
create policy ai_question_assets_staff_all on public.ai_question_assets
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists ai_study_plans_select_own_or_admin on public.ai_study_plans;
create policy ai_study_plans_select_own_or_staff on public.ai_study_plans
  for select using (user_id = auth.uid() or public.is_staff());

drop policy if exists ai_study_plans_write_admin on public.ai_study_plans;
create policy ai_study_plans_write_staff on public.ai_study_plans
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists mock_exams_select_published_or_admin on public.mock_exams;
create policy mock_exams_select_published_or_staff on public.mock_exams
  for select using (status = 'published' or public.is_staff());

drop policy if exists mock_exams_write_admin on public.mock_exams;
create policy mock_exams_write_staff on public.mock_exams
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists exam_questions_select_inherit on public.exam_questions;
create policy exam_questions_select_inherit on public.exam_questions
  for select using (
    public.is_staff()
    or exists (select 1 from public.mock_exams me where me.id = exam_questions.mock_exam_id and me.status = 'published')
  );

drop policy if exists exam_questions_write_admin on public.exam_questions;
create policy exam_questions_write_staff on public.exam_questions
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists user_coins_ledger_select_own_or_admin on public.user_coins_ledger;
create policy user_coins_ledger_select_own_or_staff on public.user_coins_ledger
  for select using (user_id = auth.uid() or public.is_staff());

drop policy if exists badges_write_admin on public.badges;
create policy badges_write_staff on public.badges
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists user_badges_select_own_or_admin on public.user_badges;
create policy user_badges_select_own_or_staff on public.user_badges
  for select using (user_id = auth.uid() or public.is_staff());

drop policy if exists user_badges_write_admin on public.user_badges;
create policy user_badges_write_staff on public.user_badges
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists leaderboard_snapshots_write_admin on public.leaderboard_snapshots;
create policy leaderboard_snapshots_write_staff on public.leaderboard_snapshots
  for all using (public.is_staff()) with check (public.is_staff());

-- mock_exams.created_by currently references admin_users(user_id) —
-- repoint it at profiles(id) to match every other created_by/reviewed_by
-- column in the schema (see questions.created_by in 0005) before
-- dropping admin_users, or this FK will break the drop.
alter table public.mock_exams
  drop constraint if exists mock_exams_created_by_fkey;
alter table public.mock_exams
  add constraint mock_exams_created_by_fkey
  foreign key (created_by) references public.profiles (id) on delete set null;

-- The following five SELECT policies were NOT listed in the audit
-- doc's Section 1.1 fix — they live on the 0008/0009 tables, which
-- that doc's own Section 2.4 already flagged as unverified
-- reconstructions. Discovered via the DROP FUNCTION dependency
-- error below; all follow the identical "own row or admin" shape,
-- confirmed against live pg_policies before writing this.
drop policy if exists exam_sessions_select_own_or_admin on public.exam_sessions;
create policy exam_sessions_select_own_or_staff on public.exam_sessions
  for select using (user_id = auth.uid() or public.is_staff());

drop policy if exists user_attempts_select_own_or_admin on public.user_attempts;
create policy user_attempts_select_own_or_staff on public.user_attempts
  for select using (user_id = auth.uid() or public.is_staff());

drop policy if exists user_topic_progress_select_own_or_admin on public.user_topic_progress;
create policy user_topic_progress_select_own_or_staff on public.user_topic_progress
  for select using (user_id = auth.uid() or public.is_staff());

drop policy if exists user_xp_ledger_select_own_or_admin on public.user_xp_ledger;
create policy user_xp_ledger_select_own_or_staff on public.user_xp_ledger
  for select using (user_id = auth.uid() or public.is_staff());

drop policy if exists user_streaks_select_own_or_admin on public.user_streaks;
create policy user_streaks_select_own_or_staff on public.user_streaks
  for select using (user_id = auth.uid() or public.is_staff());

-- Now safe to drop private.is_admin() — no remaining policy depends
-- on it. private.admin_role() is NOT dropped here: it's still used
-- by admin_users's own "admin_users_write_super" policy. Since
-- admin_users itself is being kept around temporarily as a rollback
-- safety net (see note at top of file), admin_role() has to stay
-- until that table is dropped in the later, separate migration —
-- drop both together at that point.
drop function if exists private.is_admin();
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
-- ============================================================
-- Low-risk fixes (Section 2 of the audit).
-- ============================================================

-- 2.1: question_images has no read policy. Every sibling table
-- (question_tags, question_explanations, etc.) got a
-- "for select using (true)" policy; this one was missed.
-- Applied to production 2026-07-26.
create policy "question_images_read_all" on public.question_images
  for select using (true);
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
-- ============================================================
-- Sync migration: codify what's ACTUALLY live for exam_sessions,
-- user_attempts, user_topic_progress, user_xp_ledger, and
-- user_streaks.
--
-- 0008_user_attempts_foundation.sql (which that file's own header
-- already flags as an "unverified reconstruction") does not match
-- production for these five tables. Confirmed via live pg_policies
-- on 2026-07-26:
--
--   exam_sessions: file defines a single "exam_sessions_all_own"
--   (for all, using/with check auth.uid() = user_id) — i.e. a user
--   could freely UPDATE or DELETE their own exam session at any
--   time, same class of gap as the practice_sessions issue fixed in
--   20260727000100. Production instead already runs three separate,
--   correctly-scoped policies (insert_own / select_own_or_staff /
--   update_own_in_progress — the last blocks any update once status
--   is no longer 'in_progress'). Production is already fixed; the
--   file is stale and, if ever re-run against a fresh environment
--   (disaster recovery, a new dev project), would silently
--   reintroduce the hole.
--
--   user_attempts / user_topic_progress / user_xp_ledger /
--   user_streaks: file defines two separate select policies each
--   (*_select_own, *_select_staff); production already runs a
--   single merged *_select_own_or_staff policy per table (renamed
--   from *_or_admin by 20260727000000). Functionally equivalent,
--   just consolidated — recorded here so the file matches reality.
--
-- This migration is a no-op against current production (every
-- policy it creates already exists with the same definition) — it
-- exists so the migration history is an accurate record, and so a
-- fresh environment built from this repo ends up in the same state
-- production is actually in today.
-- ============================================================

drop policy if exists "exam_sessions_all_own" on public.exam_sessions;
drop policy if exists "exam_sessions_select_staff" on public.exam_sessions;
drop policy if exists exam_sessions_select_own_or_staff on public.exam_sessions;
drop policy if exists exam_sessions_insert_own on public.exam_sessions;
drop policy if exists exam_sessions_update_own_in_progress on public.exam_sessions;

create policy exam_sessions_insert_own on public.exam_sessions
  for insert with check (user_id = auth.uid());

create policy exam_sessions_select_own_or_staff on public.exam_sessions
  for select using (user_id = auth.uid() or public.is_staff());

create policy exam_sessions_update_own_in_progress on public.exam_sessions
  for update
  using (user_id = auth.uid() and status = 'in_progress')
  with check (user_id = auth.uid());

drop policy if exists "user_attempts_select_own" on public.user_attempts;
drop policy if exists "user_attempts_select_staff" on public.user_attempts;
drop policy if exists user_attempts_select_own_or_staff on public.user_attempts;
create policy user_attempts_select_own_or_staff on public.user_attempts
  for select using (user_id = auth.uid() or public.is_staff());

drop policy if exists "user_topic_progress_select_own" on public.user_topic_progress;
drop policy if exists "user_topic_progress_select_staff" on public.user_topic_progress;
drop policy if exists user_topic_progress_select_own_or_staff on public.user_topic_progress;
create policy user_topic_progress_select_own_or_staff on public.user_topic_progress
  for select using (user_id = auth.uid() or public.is_staff());

drop policy if exists "user_xp_ledger_select_own" on public.user_xp_ledger;
drop policy if exists user_xp_ledger_select_own_or_staff on public.user_xp_ledger;
create policy user_xp_ledger_select_own_or_staff on public.user_xp_ledger
  for select using (user_id = auth.uid() or public.is_staff());

drop policy if exists "user_streaks_select_own" on public.user_streaks;
drop policy if exists "user_streaks_select_staff" on public.user_streaks;
drop policy if exists user_streaks_select_own_or_staff on public.user_streaks;
create policy user_streaks_select_own_or_staff on public.user_streaks
  for select using (user_id = auth.uid() or public.is_staff());
-- Drops the legacy question_responses table, fully superseded by user_attempts
-- (see PRACTICE_MIGRATION_WRITEUP.md). Confirmed via information_schema/pg_catalog
-- that nothing in the live app queries this table anymore (only comments in
-- practice.repository.ts and progress.repository.ts still reference it by name),
-- and no other table holds an FK into it. Its own trigger
-- (on_question_response_insert), RLS policies (question_responses_insert_own,
-- question_responses_select_own, question_responses_select_staff), and indexes
-- are dropped automatically along with the table.
--
-- Applied directly to the live project on 2026-07-28; this file exists so the
-- migration history in source control matches what's actually live.
drop table if exists public.question_responses;
