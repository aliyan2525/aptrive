-- ============================================================
-- Low-risk fixes (Section 2 of the audit).
-- ============================================================

-- 2.1: question_images has no read policy. Every sibling table
-- (question_tags, question_explanations, etc.) got a
-- "for select using (true)" policy; this one was missed.
-- Applied to production 2026-07-26.
create policy "question_images_read_all" on public.question_images
  for select using (true);
