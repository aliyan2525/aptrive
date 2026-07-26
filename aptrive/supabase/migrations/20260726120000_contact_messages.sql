-- 20260726120000_contact_messages.sql
-- Backs the public contact form (components/ContactForm.tsx), which
-- previously had no destination at all. Anonymous visitors can insert
-- (submit the form); only staff (public.is_staff(), defined in
-- 0002_library_content.sql) can read or update submissions.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  exam_interest text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'resolved')),
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

-- Anyone (including anon) can submit a message — this is the public
-- contact form — but can't read messages back, including their own.
drop policy if exists "contact_messages_insert_anyone" on public.contact_messages;
create policy "contact_messages_insert_anyone" on public.contact_messages
  for insert
  with check (
    char_length(name) between 1 and 200
    and char_length(email) between 3 and 320
    and char_length(message) between 1 and 5000
  );

drop policy if exists "contact_messages_select_staff" on public.contact_messages;
create policy "contact_messages_select_staff" on public.contact_messages
  for select
  using (public.is_staff());

drop policy if exists "contact_messages_update_staff" on public.contact_messages;
create policy "contact_messages_update_staff" on public.contact_messages
  for update
  using (public.is_staff())
  with check (public.is_staff());
