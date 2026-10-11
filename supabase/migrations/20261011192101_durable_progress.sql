-- Additive staging rollout. Never run against production without explicit approval.
-- Existing JSON is not rewritten. Legacy clients work until a row first becomes v3.
alter table public.lesson_progress add column if not exists revision bigint not null default 0;
alter table public.lesson_progress enable row level security;
revoke all on public.lesson_progress from anon, authenticated;
grant select, insert, update on public.lesson_progress to authenticated;

create table if not exists public.lesson_progress_history (
 user_id uuid not null references auth.users(id) on delete cascade,
 lesson_id text not null,
 revision bigint not null,
 data jsonb not null,
 saved_at timestamptz not null default now(),
 primary key(user_id, lesson_id, revision)
);
alter table public.lesson_progress_history enable row level security;
revoke all on public.lesson_progress_history from anon, authenticated;
grant select on public.lesson_progress_history to authenticated;
drop policy if exists read_own_progress_history on public.lesson_progress_history;
create policy read_own_progress_history on public.lesson_progress_history for select to authenticated
 using ((select auth.uid()) = user_id);

-- Snapshot existing records before installing guards, without transferring learner data.
insert into public.lesson_progress_history(user_id,lesson_id,revision,data,saved_at)
 select user_id,lesson_id,revision,data,updated_at from public.lesson_progress
 on conflict do nothing;

create schema if not exists progress_private;
revoke all on schema progress_private from public, anon, authenticated;
create or replace function progress_private.guard_progress() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare old_version integer; new_version integer;
begin
 new_version := coalesce((new.data->>'schemaVersion')::integer,1);
 if jsonb_typeof(new.data) <> 'object' or new_version < 1 then
  raise exception 'Invalid progress document';
 end if;
 if tg_op = 'UPDATE' then
  if new.user_id is distinct from old.user_id or new.lesson_id is distinct from old.lesson_id then
   raise exception 'Progress identity is immutable';
  end if;
  old_version := coalesce((old.data->>'schemaVersion')::integer,1);
  if new_version < old_version then raise exception 'Progress schema downgrade blocked'; end if;
  if new_version >= 3 and new.revision <> old.revision + 1 then
   raise exception 'Stale progress revision; reload and resolve conflict' using errcode = '40001';
  end if;
  new.revision := old.revision + 1;
 else
  if new.revision <> 0 then raise exception 'Initial revision must be zero'; end if;
 end if;
 new.updated_at := clock_timestamp();
 return new;
end;
$$;
-- SECURITY DEFINER is limited to an internal trigger so users can READ history but
-- cannot forge, replace, or delete snapshots. Original table writes still use RLS.
create or replace function progress_private.archive_progress() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
 if current_setting('role',true) in ('anon','authenticated') and
    (auth.uid() is null or auth.uid() <> new.user_id) then
  raise exception 'Progress owner mismatch';
 end if;
 insert into public.lesson_progress_history(user_id,lesson_id,revision,data,saved_at)
 values(new.user_id,new.lesson_id,new.revision,new.data,new.updated_at);
 return new;
end;
$$;
revoke all on function progress_private.guard_progress() from public, anon, authenticated;
revoke all on function progress_private.archive_progress() from public, anon, authenticated;
drop trigger if exists guard_progress on public.lesson_progress;
create trigger guard_progress before insert or update on public.lesson_progress
 for each row execute function progress_private.guard_progress();
drop trigger if exists archive_progress on public.lesson_progress;
create trigger archive_progress after insert or update on public.lesson_progress
 for each row execute function progress_private.archive_progress();
