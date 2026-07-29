-- ============================================================
-- Regression test for public.record_attempt_and_update_progress()
-- (supabase/migrations/0009_practice_session_attempts.sql).
--
-- This is the only sanctioned write path into user_attempts, and the
-- thing that actually re-derives correctness server-side (a client
-- cannot forge a score). Run via:
--
--   supabase test db
--
-- (requires the Supabase CLI + local Docker stack; see TESTING.md)
-- ============================================================
begin;
select plan(9);

-- ---- Fixtures ------------------------------------------------
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000a101', 'rpc-owner@test.local');

insert into public.subjects (id, slug, name) values
  ('00000000-0000-0000-0000-00000000b101', 'rpc-test-subject', 'RPC Test Subject');

insert into public.practice_sets (id, slug, subject_id, title, content_type, topic, difficulty) values
  ('00000000-0000-0000-0000-00000000c101', 'rpc-test-set', '00000000-0000-0000-0000-00000000b101',
   'RPC Test Set', 'mcq', 'RPC Topic', 'Easy');

-- Single-choice question: option e101 is correct.
insert into public.questions (id, practice_set_id, subject_id, prompt, difficulty, topic, question_type) values
  ('00000000-0000-0000-0000-00000000d101', '00000000-0000-0000-0000-00000000c101',
   '00000000-0000-0000-0000-00000000b101', 'RPC single-choice question', 'Easy', 'RPC Topic', 'single_choice');

insert into public.question_options (id, question_id, content, is_correct) values
  ('00000000-0000-0000-0000-00000000e101', '00000000-0000-0000-0000-00000000d101', 'Right', true),
  ('00000000-0000-0000-0000-00000000e102', '00000000-0000-0000-0000-00000000d101', 'Wrong', false);

-- Numeric question: correct value 42, tolerance 0.5.
insert into public.questions (
  id, practice_set_id, subject_id, prompt, difficulty, topic, question_type,
  numeric_answer_value, numeric_answer_tolerance
) values (
  '00000000-0000-0000-0000-00000000d102', '00000000-0000-0000-0000-00000000c101',
  '00000000-0000-0000-0000-00000000b101', 'RPC numeric question', 'Easy', 'RPC Topic', 'numeric',
  42, 0.5
);

insert into public.practice_sessions (id, user_id, practice_set_id, subject_id, total_questions)
values ('00000000-0000-0000-0000-00000000f101', '00000000-0000-0000-0000-00000000a101',
        '00000000-0000-0000-0000-00000000c101', '00000000-0000-0000-0000-00000000b101', 2);

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000a101', true);

-- 1. Unauthenticated calls are rejected outright.
select set_config('request.jwt.claim.sub', '', true);
select throws_ok(
  $$ select public.record_attempt_and_update_progress(jsonb_build_object(
       'practice_session_id', '00000000-0000-0000-0000-00000000f101',
       'question_id', '00000000-0000-0000-0000-00000000d101',
       'selected_option_ids', jsonb_build_array('00000000-0000-0000-0000-00000000e101')
     )) $$,
  'P0001',
  'record_attempt_and_update_progress: not authenticated',
  'an unauthenticated call is rejected'
);
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000a101', true);

-- 2. Exactly one of exam_session_id / practice_session_id is required.
select throws_ok(
  $$ select public.record_attempt_and_update_progress(jsonb_build_object(
       'question_id', '00000000-0000-0000-0000-00000000d101'
     )) $$,
  'P0001',
  'record_attempt_and_update_progress: exactly one of exam_session_id or practice_session_id is required',
  'a call with neither exam_session_id nor practice_session_id is rejected'
);

-- 3. A correct single-choice answer grades as correct and awards XP —
--    the client only supplies selected_option_ids; it cannot pass in
--    is_correct/xp_awarded itself, so this also proves grading is
--    computed server-side rather than trusted from the payload.
select results_eq(
  $$ select (public.record_attempt_and_update_progress(jsonb_build_object(
       'practice_session_id', '00000000-0000-0000-0000-00000000f101',
       'question_id', '00000000-0000-0000-0000-00000000d101',
       'selected_option_ids', jsonb_build_array('00000000-0000-0000-0000-00000000e101')
     ))->>'is_correct')::boolean $$,
  $$ values (true) $$,
  'selecting the correct option grades as correct'
);

select results_eq(
  $$ select is_correct, xp_awarded from public.user_attempts
     where user_id = '00000000-0000-0000-0000-00000000a101'
       and question_id = '00000000-0000-0000-0000-00000000d101' $$,
  $$ values (true, 10) $$,
  'the correct attempt is persisted with is_correct=true and xp_awarded=10'
);

-- 4. Revising that same question to a wrong answer flips correctness,
--    nets the XP ledger out to zero net gain from this question, and
--    does NOT insert a second user_attempts row (upsert, not append).
select public.record_attempt_and_update_progress(jsonb_build_object(
  'practice_session_id', '00000000-0000-0000-0000-00000000f101',
  'question_id', '00000000-0000-0000-0000-00000000d101',
  'selected_option_ids', jsonb_build_array('00000000-0000-0000-0000-00000000e102')
));

select results_eq(
  $$ select count(*)::int from public.user_attempts
     where user_id = '00000000-0000-0000-0000-00000000a101'
       and practice_session_id = '00000000-0000-0000-0000-00000000f101'
       and question_id = '00000000-0000-0000-0000-00000000d101' $$,
  $$ values (1) $$,
  'revising an answer updates the existing user_attempts row instead of inserting a new one'
);

select results_eq(
  $$ select coalesce(sum(xp_delta), 0)::int from public.user_xp_ledger
     where user_id = '00000000-0000-0000-0000-00000000a101'
       and attempt_id = (
         select id from public.user_attempts
         where user_id = '00000000-0000-0000-0000-00000000a101'
           and practice_session_id = '00000000-0000-0000-0000-00000000f101'
           and question_id = '00000000-0000-0000-0000-00000000d101'
       ) $$,
  $$ values (0) $$,
  'the XP ledger nets out to zero net XP after revising a correct answer to a wrong one'
);

-- 5. Numeric grading respects tolerance: 42.3 is within 0.5 of 42.
select results_eq(
  $$ select (public.record_attempt_and_update_progress(jsonb_build_object(
       'practice_session_id', '00000000-0000-0000-0000-00000000f101',
       'question_id', '00000000-0000-0000-0000-00000000d102',
       'numeric_answer_given', 42.3
     ))->>'is_correct')::boolean $$,
  $$ values (true) $$,
  'a numeric answer within tolerance grades as correct'
);

-- 6. ...and 43 is outside tolerance (0.5), so it grades as incorrect.
select results_eq(
  $$ select (public.record_attempt_and_update_progress(jsonb_build_object(
       'practice_session_id', '00000000-0000-0000-0000-00000000f101',
       'question_id', '00000000-0000-0000-0000-00000000d102',
       'numeric_answer_given', 43
     ))->>'is_correct')::boolean $$,
  $$ values (false) $$,
  'a numeric answer outside tolerance grades as incorrect'
);

-- 7. A nonexistent question_id is rejected rather than silently
--    grading as incorrect.
select throws_ok(
  $$ select public.record_attempt_and_update_progress(jsonb_build_object(
       'practice_session_id', '00000000-0000-0000-0000-00000000f101',
       'question_id', '00000000-0000-0000-0000-000000000000'
     )) $$,
  'P0001',
  'grading against a question id that does not exist raises rather than defaulting to incorrect'
);

select * from finish();
rollback;
