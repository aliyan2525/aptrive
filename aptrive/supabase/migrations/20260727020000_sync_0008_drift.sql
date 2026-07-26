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
