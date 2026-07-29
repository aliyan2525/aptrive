-- ============================================================
-- Regression test for guard_practice_session_score_columns()
-- (supabase/migrations/20260727000100_lock_practice_session_scores.sql,
-- corrected by 20260727010000_fix_score_percent_validation.sql).
--
-- This is the exact bug class that was already found and fixed once:
-- a client (or a careless future migration) able to PATCH
-- practice_sessions.score_percent / correct_count / incorrect_count
-- directly, bypassing server-side grading. Run via:
--
--   supabase test db
--
-- (requires the Supabase CLI + local Docker stack; see TESTING.md)
-- ============================================================
begin;
select plan(6);

-- ---- Fixtures ------------------------------------------------
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000a001', 'guard-owner@test.local'),
  ('00000000-0000-0000-0000-00000000a002', 'guard-other@test.local');

insert into public.subjects (id, slug, name) values
  ('00000000-0000-0000-0000-00000000b001', 'guard-test-subject', 'Guard Test Subject');

insert into public.practice_sets (id, slug, subject_id, title, content_type, topic, difficulty) values
  ('00000000-0000-0000-0000-00000000c001', 'guard-test-set', '00000000-0000-0000-0000-00000000b001',
   'Guard Test Set', 'mcq', 'Guard Topic', 'Easy');

insert into public.questions (id, practice_set_id, subject_id, prompt, difficulty, topic, question_type) values
  ('00000000-0000-0000-0000-00000000d001', '00000000-0000-0000-0000-00000000c001',
   '00000000-0000-0000-0000-00000000b001', 'Guard test question', 'Easy', 'Guard Topic', 'single_choice');

insert into public.question_options (id, question_id, content, is_correct) values
  ('00000000-0000-0000-0000-00000000e001', '00000000-0000-0000-0000-00000000d001', 'Right', true),
  ('00000000-0000-0000-0000-00000000e002', '00000000-0000-0000-0000-00000000d001', 'Wrong', false);

insert into public.practice_sessions (id, user_id, practice_set_id, subject_id, total_questions)
values ('00000000-0000-0000-0000-00000000f001', '00000000-0000-0000-0000-00000000a001',
        '00000000-0000-0000-0000-00000000c001', '00000000-0000-0000-0000-00000000b001', 2);

-- Two attempts already recorded directly (bypassing the RPC on purpose,
-- since we only want to drive the trigger here, not the RPC) so the
-- "computed from user_attempts" side of the trigger has real data:
-- 1 correct / 1 total answered so far for this session.
insert into public.user_attempts (user_id, practice_session_id, question_id, is_correct)
values ('00000000-0000-0000-0000-00000000a001', '00000000-0000-0000-0000-00000000f001',
        '00000000-0000-0000-0000-00000000d001', true);

-- ---- Simulate the owning user (RLS + trigger both apply) -----
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000a001', true);

-- 1. THE REGRESSION CASE: this is the exact call shape completeSession()
--    makes — score_percent set to the value that matches user_attempts,
--    correct_count/incorrect_count left at their default 0/0 (the app
--    stopped writing those columns; see 20260727010000's writeup).
--    The first version of this trigger rejected this legitimate call.
--    It must succeed.
select lives_ok(
  $$ update public.practice_sessions
     set score_percent = 100, status = 'completed', completed_at = now()
     where id = '00000000-0000-0000-0000-00000000f001' $$,
  'completeSession()-shaped update (score matches user_attempts, counts untouched) succeeds'
);

-- 2. Forging score_percent to a value that does NOT match user_attempts
--    must be rejected outright — this is the actual tampering attempt
--    the migration exists to close off.
select throws_ok(
  $$ update public.practice_sessions
     set score_percent = 0
     where id = '00000000-0000-0000-0000-00000000f001' $$,
  'P0001',
  'practice_sessions: score_percent must match user_attempts',
  'forging score_percent to a value that disagrees with user_attempts is rejected'
);

-- 3. correct_count is no longer client-writable at all, even to a
--    value that would otherwise look "correct" — any change is
--    rejected outright per the 20260727010000 fix.
select throws_ok(
  $$ update public.practice_sessions
     set correct_count = 1
     where id = '00000000-0000-0000-0000-00000000f001' $$,
  'P0001',
  'practice_sessions: correct_count/incorrect_count are no longer client-writable',
  'any change to correct_count is rejected regardless of value'
);

-- 4. Same for incorrect_count.
select throws_ok(
  $$ update public.practice_sessions
     set incorrect_count = 1
     where id = '00000000-0000-0000-0000-00000000f001' $$,
  'P0001',
  'practice_sessions: correct_count/incorrect_count are no longer client-writable',
  'any change to incorrect_count is rejected regardless of value'
);

-- 5. Columns unrelated to scoring (e.g. time_spent_seconds) are
--    untouched by the guard and still update normally.
select lives_ok(
  $$ update public.practice_sessions
     set time_spent_seconds = 120
     where id = '00000000-0000-0000-0000-00000000f001' $$,
  'updating a non-score column is unaffected by the guard'
);

-- 6. Direct-API access (auth.uid() = a different user) is blocked by
--    RLS before the trigger even runs — the row isn't visible/writable
--    to a non-owner. This guards the *other* half of the original gap
--    (the "for all" policy split in the same migration).
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000a002', true);
select is_empty(
  $$ update public.practice_sessions
     set time_spent_seconds = 999
     where id = '00000000-0000-0000-0000-00000000f001'
     returning id $$,
  'a different authenticated user cannot update another user''s practice session'
);

select * from finish();
rollback;
