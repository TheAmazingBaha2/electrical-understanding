-- Staging-only additive change: GPT-6 Astra is a premium benchmark option.
-- Preserve the owner allowlist, RLS, signed-in authorization and existing request history.
alter table public.ai_test_request_log
 drop constraint if exists ai_test_request_log_model_check;
alter table public.ai_test_request_log
 add constraint ai_test_request_log_model_check
 check (model in ('gpt-6-luna','gpt-6.1-sol','gpt-6-astra'));

create or replace function public.ai_test_reserve(p_model text)
returns boolean language plpgsql security definer set search_path = ''
as $$
declare v_user uuid := (select auth.uid());
begin
 if v_user is null or p_model is null or p_model not in ('gpt-6-luna','gpt-6.1-sol','gpt-6-astra') then return false; end if;
 if not exists (select 1 from public.ai_test_allowed_users a where a.user_id = v_user) then return false; end if;
 -- Serialize per-user reservations to make quotas atomic under simultaneous requests.
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(v_user::text),78643);
 if (select count(*) from public.ai_test_request_log where user_id=v_user and requested_at > now()-interval '1 minute') >= 2
 or (select count(*) from public.ai_test_request_log where user_id=v_user and requested_at > now()-interval '1 hour') >= 6
 or (select count(*) from public.ai_test_request_log where user_id=v_user and requested_at > now()-interval '24 hours') >= 24
 then return false; end if;
 -- Stronger premium model limit: at most TWO Astra calls per rolling 24 hours.
 if p_model = 'gpt-6-astra' and
   (select count(*) from public.ai_test_request_log
     where user_id=v_user and model='gpt-6-astra'
       and requested_at > now()-interval '24 hours') >= 2
 then return false; end if;
 insert into public.ai_test_request_log(user_id,model) values(v_user,p_model);
 return true;
end;
$$;
revoke all on function public.ai_test_reserve(text) from public, anon;
grant execute on function public.ai_test_reserve(text) to authenticated;
