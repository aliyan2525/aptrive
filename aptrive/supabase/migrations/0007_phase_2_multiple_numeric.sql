-- ============================================================
-- Aptrive: Phase 2 — Multiple-answer & Numeric scoring
-- 1) Allow multiple correct options for questions with question_type = 'multiple_choice'
-- 2) Keep single-answer enforcement for questions with question_type = 'single_choice'
-- 3) Add selected_option_ids array to question_responses to record multi-choice picks
-- ============================================================

-- 1. Replace enforce_single_correct_option() so it only enforces a single
-- correct option when the parent question is single_choice. This keeps
-- backward compatibility while allowing multiple correct options for
-- multiple_choice questions.
create or replace function public.enforce_single_correct_option()
returns trigger
language plpgsql
as $$
begin
  -- Query the parent question's type (default to 'single_choice' for old rows)
  if new.is_correct then
    -- If the question exists and is explicitly single_choice, toggle others off
    if exists (select 1 from public.questions q where q.id = new.question_id and (q.question_type is null or q.question_type = 'single_choice')) then
      update public.question_options
      set is_correct = false
      where question_id = new.question_id
        and id <> new.id
        and is_correct = true;
    end if;
  end if;
  return new;
end;
$$;

-- Recreate trigger (idempotent)
drop trigger if exists enforce_single_correct_option on public.question_options;
create trigger enforce_single_correct_option
  before insert or update on public.question_options
  for each row execute function public.enforce_single_correct_option();

-- 2. Add selected_option_ids to question_responses to support multi-choice
alter table public.question_responses
  add column if not exists selected_option_ids uuid[];

-- No further constraints: selected_option_id continues to be populated
-- for single-choice attempts; selected_option_ids will record arrays
-- for multiple-choice attempts. Grading logic is performed server-side.

-- End of migration
