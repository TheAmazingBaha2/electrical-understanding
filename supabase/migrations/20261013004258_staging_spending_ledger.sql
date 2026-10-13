-- Staging only. No existing job, attempt, progress or book is modified.
create table public.ai_price_versions (
 id text primary key, model text not null, input_rate numeric not null check(input_rate>0),
 cached_rate numeric not null check(cached_rate>=0), write_rate numeric not null check(write_rate>0),
 output_rate numeric not null check(output_rate>0), context_tokens int not null check(context_tokens>0),
 long_threshold int not null, long_input numeric not null, long_output numeric not null,
 tier text not null check(tier='default'), safety_multiplier numeric not null check(safety_multiplier>=1),
 valid_until timestamptz not null, source_url text not null
);
insert into public.ai_price_versions values
 ('2026-10-13-sol','gpt-6.1-sol',2,.1,2.5,10,1050000,272000,2,1.5,'default',1.1,'2026-11-13','https://developers.openai.com/api/docs/models/gpt-6.1-sol'),
 ('2026-10-13-astra','gpt-6-astra',10,1,12.5,50,1050000,272000,2,1.5,'default',1.1,'2026-11-13','https://developers.openai.com/api/docs/models/gpt-6-astra');
create table public.ai_spend_sessions (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id),
 label text not null check(length(label) between 1 and 120),
 authorized_usd numeric(16,8) not null check(authorized_usd>0 and authorized_usd<=1000),
 state text not null default 'open' check(state in ('open','closed','frozen')),
 created_at timestamptz not null default now()
);
create unique index ai_one_open_budget on public.ai_spend_sessions(user_id) where state='open';
create table public.ai_spend_ledger (
 attempt_id uuid primary key, session_id uuid not null references public.ai_spend_sessions(id),
 user_id uuid not null references auth.users(id), job_id uuid not null,
 phase text not null, model text not null, base_revision bigint not null,
 price_id text not null references public.ai_price_versions(id), pricing_snapshot jsonb not null,
 max_input_tokens int not null, max_output_tokens int not null,
 reserved_usd numeric(16,8) not null check(reserved_usd>0), held_usd numeric(16,8) not null check(held_usd>=0),
 estimated_usd numeric(16,8), provider_billed_usd numeric(16,8), billed_evidence text,
 provider_response_id text, provider_request_id text, provider_status text,
 input_tokens bigint, output_tokens bigint, cached_tokens bigint, cache_write_tokens bigint,
 billing_uncertain boolean not null default true, retry_of uuid,
 created_at timestamptz not null default now(), dispatched_at timestamptz, completed_at timestamptz,
 last_recovered_at timestamptz, last_resumed_at timestamptz,
 check(provider_billed_usd is null or (provider_billed_usd>=0 and length(billed_evidence)>0))
);
create index ai_ledger_session on public.ai_spend_ledger(session_id);
create table public.ai_spend_events (
 id bigint generated always as identity primary key, attempt_id uuid not null,
 user_id uuid not null, operation text not null, created_at timestamptz not null default now()
);
create index ai_events_attempt on public.ai_spend_events(attempt_id);
alter table public.ai_price_versions enable row level security;
alter table public.ai_spend_sessions enable row level security;
alter table public.ai_spend_ledger enable row level security;
alter table public.ai_spend_events enable row level security;
revoke all on public.ai_price_versions,public.ai_spend_sessions,public.ai_spend_ledger,public.ai_spend_events from public,anon,authenticated;
grant select on public.ai_price_versions,public.ai_spend_sessions,public.ai_spend_ledger,public.ai_spend_events to authenticated;
grant all on public.ai_price_versions,public.ai_spend_sessions,public.ai_spend_ledger,public.ai_spend_events to service_role;
create policy ai_price_read on public.ai_price_versions for select to authenticated using (true);
create policy ai_session_read on public.ai_spend_sessions for select to authenticated using(user_id=(select auth.uid()));
create policy ai_ledger_read on public.ai_spend_ledger for select to authenticated using(user_id=(select auth.uid()));
create policy ai_events_read on public.ai_spend_events for select to authenticated using(user_id=(select auth.uid()));

create function public.ai_open_budget(p_label text,p_usd numeric) returns uuid
language plpgsql security definer set search_path=public,pg_temp as $$
declare v_id uuid; v_user uuid:=auth.uid();
begin
 if v_user is null or not exists(select 1 from ai_test_allowed_users where user_id=v_user) then raise exception 'Not authorized'; end if;
 -- Limits are immutable. Creating another open session is forbidden.
 insert into ai_spend_sessions(user_id,label,authorized_usd) values(v_user,p_label,p_usd) returning id into v_id;
 return v_id;
end $$;
revoke all on function public.ai_open_budget(text,numeric) from public,anon;
grant execute on function public.ai_open_budget(text,numeric) to authenticated;

create function public.ai_reserve_attempt(p_user uuid,p_attempt uuid,p_session uuid,p_output int) returns jsonb
language plpgsql security definer set search_path=public,pg_temp as $$
declare a scan_model_attempts; b ai_spend_sessions; p ai_price_versions; l ai_spend_ledger; amount numeric; used numeric;
begin
 select * into b from ai_spend_sessions where id=p_session and user_id=p_user for update;
 if not found or b.state<>'open' then raise exception 'An open authorized budget is required'; end if;
 select * into a from scan_model_attempts where id=p_attempt and user_id=p_user;
 if not found then raise exception 'Unknown attempt'; end if;
 select * into l from ai_spend_ledger where attempt_id=p_attempt;
 if found then
  if l.session_id<>p_session or l.max_output_tokens<>p_output then raise exception 'Reservation identity mismatch'; end if;
  return to_jsonb(l);
 end if;
 if a.status<>'starting' or not exists(select 1 from scan_lesson_jobs where id=a.job_id and user_id=p_user and revision=a.base_revision) then raise exception 'Stale attempt'; end if;
 if p_output is null or p_output<1 or p_output>11400 then raise exception 'Invalid output bound'; end if;
 select * into p from ai_price_versions where model=a.model and tier='default' and valid_until>now() order by valid_until desc limit 1;
 if not found then raise exception 'Current verified pricing unavailable'; end if;
 amount:=ceil((p.context_tokens*greatest(p.input_rate,p.cached_rate,p.write_rate)*p.long_input+p_output*p.output_rate*p.long_output)*p.safety_multiplier*100)/100000000;
 select coalesce(sum(held_usd),0) into used from ai_spend_ledger where session_id=b.id;
 if used+amount>b.authorized_usd then raise exception 'Budget insufficient: remaining %, required %',b.authorized_usd-used,amount; end if;
 insert into ai_spend_ledger(attempt_id,session_id,user_id,job_id,phase,model,base_revision,price_id,pricing_snapshot,max_input_tokens,max_output_tokens,reserved_usd,held_usd,retry_of)
 values(a.id,b.id,p_user,a.job_id,a.phase,a.model,a.base_revision,p.id,to_jsonb(p),p.context_tokens,p_output,amount,amount,a.retry_of) returning * into l;
 return to_jsonb(l);
end $$;
revoke all on function public.ai_reserve_attempt(uuid,uuid,uuid,int) from public,anon,authenticated;
grant execute on function public.ai_reserve_attempt(uuid,uuid,uuid,int) to service_role;

create function public.ai_dispatch_attempt(p_user uuid,p_attempt uuid) returns boolean
language plpgsql security definer set search_path=public,pg_temp as $$
begin
 update ai_spend_ledger set dispatched_at=now() where attempt_id=p_attempt and user_id=p_user and dispatched_at is null;
 return found;
end $$;
revoke all on function public.ai_dispatch_attempt(uuid,uuid) from public,anon,authenticated;
grant execute on function public.ai_dispatch_attempt(uuid,uuid) to service_role;

-- Reconcile from durable attempt updates, never from client-supplied usage.
create function public.ai_account_attempt() returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare l ai_spend_ledger; p jsonb; i bigint; o bigint; c bigint; w bigint; estimate numeric; valid boolean:=false; tier text;
begin
 select * into l from ai_spend_ledger where attempt_id=new.id;
 if not found then return new; end if;
 -- Same session lock as reserve; prevents reconciliation/reservation races.
 perform 1 from ai_spend_sessions where id=l.session_id for update;
 p:=l.pricing_snapshot;
 begin
  i:=(new.usage->>'input_tokens')::bigint; o:=(new.usage->>'output_tokens')::bigint;
  c:=coalesce((new.usage->'input_tokens_details'->>'cached_tokens')::bigint,0);
  w:=coalesce((new.usage->'input_tokens_details'->>'cache_write_tokens')::bigint,0);
  tier:=coalesce((new.raw_response::jsonb)->>'service_tier','default');
  valid:=i is not null and o is not null and i>=0 and o>=0 and c>=0 and w>=0 and c+w<=i
   and i<=l.max_input_tokens and o<=l.max_output_tokens and tier='default'
   and new.response_id is not null and new.status in ('received','applied','invalid','incomplete');
  if valid then
   estimate:=((i-c-w)*(p->>'input_rate')::numeric+c*(p->>'cached_rate')::numeric+w*(p->>'write_rate')::numeric)
     *case when i>(p->>'long_threshold')::int then (p->>'long_input')::numeric else 1 end/1000000
     +o*(p->>'output_rate')::numeric*case when i>(p->>'long_threshold')::int then (p->>'long_output')::numeric else 1 end/1000000;
  end if;
 exception when others then valid:=false; end;
 update ai_spend_ledger set provider_response_id=coalesce(new.response_id,provider_response_id),
  provider_request_id=coalesce(new.provider_request_id,provider_request_id),provider_status=new.status,
  input_tokens=case when valid then i else input_tokens end,output_tokens=case when valid then o else output_tokens end,
  cached_tokens=case when valid then c else cached_tokens end,cache_write_tokens=case when valid then w else cache_write_tokens end,
  estimated_usd=case when valid then estimate else estimated_usd end,
  -- Keep the original conservative hold until invoice reconciliation. Usage is NOT an invoice.
  completed_at=case when valid then coalesce(completed_at,now()) else completed_at end,
  billing_uncertain=provider_billed_usd is null
 where attempt_id=new.id;
 if new.status is distinct from old.status then insert into ai_spend_events(attempt_id,user_id,operation) values(new.id,new.user_id,new.status); end if;
 return new;
end $$;
revoke all on function public.ai_account_attempt() from public,anon,authenticated;
create trigger ai_account_attempt after update on public.scan_model_attempts for each row execute function public.ai_account_attempt();

create function public.ai_record_recovery(p_user uuid,p_attempt uuid,p_operation text) returns boolean
language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if p_operation not in ('resume','recover') or not exists(select 1 from scan_model_attempts where id=p_attempt and user_id=p_user) then return false; end if;
 insert into ai_spend_events(attempt_id,user_id,operation) values(p_attempt,p_user,p_operation);
 update ai_spend_ledger set last_recovered_at=case when p_operation='recover' then now() else last_recovered_at end,
 last_resumed_at=case when p_operation='resume' then now() else last_resumed_at end where attempt_id=p_attempt and user_id=p_user;
 return true;
end $$;
revoke all on function public.ai_record_recovery(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.ai_record_recovery(uuid,uuid,text) to service_role;

-- Administrative invoice evidence only. No browser grant; never guess a billed amount.
create function public.ai_reconcile_invoice(p_attempt uuid,p_billed numeric,p_evidence text) returns boolean
language plpgsql security definer set search_path=public,pg_temp as $$
declare l ai_spend_ledger;
begin
 select * into l from ai_spend_ledger where attempt_id=p_attempt;
 if not found or p_billed is null or p_billed<0 or p_billed>100000 or length(coalesce(p_evidence,''))<10 then raise exception 'Reliable invoice evidence required'; end if;
 perform 1 from ai_spend_sessions where id=l.session_id for update;
 select * into l from ai_spend_ledger where attempt_id=p_attempt for update;
 if l.provider_billed_usd is not null then
  if l.provider_billed_usd<>p_billed or l.billed_evidence<>p_evidence then raise exception 'Conflicting invoice reconciliation'; end if;
  return true;
 end if;
 update ai_spend_ledger set provider_billed_usd=p_billed,billed_evidence=p_evidence,held_usd=p_billed,billing_uncertain=false where attempt_id=p_attempt;
 if p_billed>l.reserved_usd then update ai_spend_sessions set state='frozen' where id=l.session_id; end if;
 return true;
end $$;
revoke all on function public.ai_reconcile_invoice(uuid,numeric,text) from public,anon,authenticated;
grant execute on function public.ai_reconcile_invoice(uuid,numeric,text) to service_role;
alter table public.scan_model_attempts add column budget_session_id uuid references public.ai_spend_sessions(id);
