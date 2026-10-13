-- Owner-authorized limit changes retain the session and every reservation.
create table public.ai_budget_changes (
 id bigint generated always as identity primary key,
 session_id uuid not null references public.ai_spend_sessions(id),
 user_id uuid not null references auth.users(id),
 previous_usd numeric(16,8) not null, authorized_usd numeric(16,8) not null,
 created_at timestamptz not null default now()
);
alter table public.ai_budget_changes enable row level security;
revoke all on public.ai_budget_changes from public,anon,authenticated;
grant select on public.ai_budget_changes to authenticated;
grant all on public.ai_budget_changes to service_role;
create policy ai_budget_changes_owner on public.ai_budget_changes for select to authenticated using(user_id=(select auth.uid()));
create function public.ai_update_budget(p_session uuid,p_expected numeric,p_usd numeric) returns uuid
language plpgsql security definer set search_path=public,pg_temp as $$
declare b ai_spend_sessions; u uuid:=auth.uid(); held numeric;
begin
 if u is null or not exists(select 1 from ai_test_allowed_users where user_id=u) then raise exception 'Not authorized'; end if;
 if p_usd is null or p_usd<=0 or p_usd>1000 then raise exception 'Limit must be between $0.01 and $1000'; end if;
 select * into b from ai_spend_sessions where id=p_session and user_id=u for update;
 if not found or b.state<>'open' then raise exception 'Open spending session unavailable; refresh spending'; end if;
 if p_expected is null or b.authorized_usd<>p_expected then raise exception 'Spending limit changed in another session; refresh before authorizing'; end if;
 select coalesce(sum(held_usd),0) into held from ai_spend_ledger where session_id=b.id;
 if p_usd<held then raise exception 'Limit cannot be below existing held exposure of $%',held; end if;
 if p_usd=b.authorized_usd then return b.id; end if;
 insert into ai_budget_changes(session_id,user_id,previous_usd,authorized_usd) values(b.id,u,b.authorized_usd,p_usd);
 update ai_spend_sessions set authorized_usd=p_usd where id=b.id;
 return b.id;
end $$;
revoke all on function public.ai_update_budget(uuid,numeric,numeric) from public,anon;
grant execute on function public.ai_update_budget(uuid,numeric,numeric) to authenticated;
