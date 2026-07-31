-- ============================================================
-- Fix: Secure question_options to hide is_correct from public
-- ============================================================

-- 1. Drop the old insecure policy
drop policy if exists "question_options_select_published_or_staff" on public.question_options;
drop policy if exists "question_options_select_all" on public.question_options;

-- 2. Create the new staff-only policy
create policy "question_options_select_staff_only"
  on public.question_options for select
  using (public.is_staff());

-- 3. Create the public-safe view (id, question_id, label, content, position)
create or replace view public.v_public_question_options as
select 
  id,
  question_id,
  label,
  content,
  position
from public.question_options;

-- 4. Grant select on the view to everyone
grant select on public.v_public_question_options to anon, authenticated;
