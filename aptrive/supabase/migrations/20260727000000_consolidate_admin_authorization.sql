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
