-- ============================================================
-- 2.2: contact_messages volume guard.
--
-- APPLIED 2026-07-26, after 20260726120000_contact_messages.sql
-- (which had existed in this repo but was never deployed —
-- confirmed missing via supabase_migrations.schema_migrations
-- and information_schema before this fix). Both are now live;
-- verified with a smoke-test insert/delete against production.
-- ============================================================

create or replace function public.guard_contact_messages_volume()
returns trigger
language plpgsql
as $$
declare
  recent_count int;
begin
  select count(*) into recent_count
  from public.contact_messages
  where created_at > now() - interval '5 minutes';

  if recent_count > 100 then
    raise exception 'contact_messages: submission volume limit reached, try again shortly';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_contact_messages_volume on public.contact_messages;
create trigger guard_contact_messages_volume
  before insert on public.contact_messages
  for each row execute function public.guard_contact_messages_volume();
