-- Staging-only, no provider calls. All synthetic rows roll back.
begin;
do $$
declare u uuid; b uuid; j uuid; a uuid; r jsonb; denied boolean:=false; n int;
begin
 select user_id into u from public.ai_test_allowed_users limit 1;
 if u is null then raise exception 'Staging test owner unavailable'; end if;
 insert into public.ai_spend_sessions(user_id,label,authorized_usd) values(u,'QA rollback-only finance',10) returning id into b;
 insert into public.scan_lesson_jobs(user_id,title,source_path,source_kind,source_bytes) values(u,'QA rollback-only source',u||'/'||gen_random_uuid()||'.pdf','application/pdf',10) returning id into j;
 insert into public.scan_model_attempts(user_id,job_id,base_revision,phase,model,status) values(u,j,0,'plan','gpt-6.1-sol','starting') returning id into a;
 r:=public.ai_reserve_attempt(u,a,b,1800);
 if (r->>'reserved_usd')::numeric<>5.8047 then raise exception 'Reservation arithmetic failed'; end if;
 perform public.ai_reserve_attempt(u,a,b,1800);
 select count(*) into n from public.ai_spend_ledger where session_id=b;
 if n<>1 then raise exception 'Duplicate reservation'; end if;
 if not public.ai_dispatch_attempt(u,a) or public.ai_dispatch_attempt(u,a) then raise exception 'Dispatch is not exactly-once'; end if;
 update public.scan_model_attempts set status='unknown' where id=a;
 if (select held_usd from public.ai_spend_ledger where attempt_id=a)<>5.8047 then raise exception 'Unknown billing released hold'; end if;
 update public.scan_model_attempts set status='received',response_id='QA-SYNTHETIC',raw_response='{"status":"completed","service_tier":"default"}',usage='{"input_tokens":1000,"output_tokens":200,"input_tokens_details":{"cached_tokens":100,"cache_write_tokens":400}}' where id=a;
 if (select estimated_usd from public.ai_spend_ledger where attempt_id=a)<>.00401 then raise exception 'Accounting mismatch'; end if;
 if (select held_usd from public.ai_spend_ledger where attempt_id=a)<>5.8047 then raise exception 'Usage mistaken for invoice'; end if;
 perform public.ai_reconcile_invoice(a,0,'QA synthetic evidence: no provider called');
 perform public.ai_reconcile_invoice(a,0,'QA synthetic evidence: no provider called');
 begin perform public.ai_reconcile_invoice(a,1,'QA conflicting synthetic evidence'); exception when others then denied:=true; end;
 if not denied then raise exception 'Conflicting invoice accepted'; end if;
 if has_function_privilege('authenticated','public.ai_reserve_attempt(uuid,uuid,uuid,integer)','execute') or has_function_privilege('anon','public.ai_open_budget(text,numeric)','execute') then raise exception 'Privilege leak'; end if;
end $$;
rollback;
select 'PASS: atomic/idempotent reservation, dispatch, unknown billing, usage, invoice and role grants' result;
