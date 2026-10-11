-- Staging only. This migration is separately applied to hkwmtjhgrskidaizamwy.
-- Authorized user's exact account ID is intentionally NOT committed to Git.
create table if not exists public.ai_test_allowed_users (
 user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.ai_test_allowed_users enable row level security;
revoke all on public.ai_test_allowed_users from public, anon, authenticated;
grant select on public.ai_test_allowed_users to authenticated;
drop policy if exists ai_owner_can_identify_self on public.ai_test_allowed_users;
create policy ai_owner_can_identify_self on public.ai_test_allowed_users
 for select to authenticated using ((select auth.uid()) = user_id);
create table if not exists public.ai_test_request_log (
 request_id bigint generated always as identity primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 model text not null check(model in ('gpt-6-luna','gpt-6.1-sol')),
 requested_at timestamptz not null default now()
);
create index if not exists ai_test_request_user_time on public.ai_test_request_log(user_id,requested_at desc);
alter table public.ai_test_request_log enable row level security;
revoke all on public.ai_test_request_log from public, anon, authenticated;
create or replace function public.ai_test_reserve(p_model text)
returns boolean language plpgsql security definer set search_path = ''
as $$
declare v_user uuid := (select auth.uid());
begin
 if v_user is null or p_model is null or p_model not in ('gpt-6-luna','gpt-6.1-sol') then return false; end if;
 if not exists (select 1 from public.ai_test_allowed_users a where a.user_id = v_user) then return false; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(v_user::text),78643);
 if (select count(*) from public.ai_test_request_log where user_id=v_user and requested_at > now()-interval '1 minute') >= 2
 or (select count(*) from public.ai_test_request_log where user_id=v_user and requested_at > now()-interval '1 hour') >= 6
 or (select count(*) from public.ai_test_request_log where user_id=v_user and requested_at > now()-interval '24 hours') >= 24
 then return false; end if;
 insert into public.ai_test_request_log(user_id,model) values(v_user,p_model);
 return true;
end; $$;
revoke all on function public.ai_test_reserve(text) from public, anon;
grant execute on function public.ai_test_reserve(text) to authenticated;
