create or replace function public.scan_apply_attempt(p_user uuid,p_attempt uuid,p_patch jsonb,p_next text)
returns boolean language plpgsql security invoker set search_path='' as $body$
declare a public.scan_model_attempts%rowtype; j public.scan_lesson_jobs%rowtype;
begin
select * into a from public.scan_model_attempts where id=p_attempt and user_id=p_user;
if not found then return false; end if;
select * into j from public.scan_lesson_jobs where id=a.job_id and user_id=p_user for update;
if not found then return false; end if;
if a.status='applied' then return true; end if;
if j.revision<>a.base_revision or a.status<>'received' then return false; end if;
if not ((a.phase='plan' and j.state='uploaded' and p_next='uploaded')
 or (a.phase='analyze' and j.state='uploaded' and p_next='analyzed')
 or (a.phase='draft' and j.state in ('analyzed','needs_revision') and p_next='drafted')
 or (a.phase='review' and j.state='drafted' and p_next in ('reviewed','needs_revision'))) then return false; end if;
update public.scan_lesson_jobs set
 analysis=case when p_patch ? 'analysis' then p_patch->'analysis' else analysis end,
 lesson=case when p_patch ? 'lesson' then p_patch->'lesson' else lesson end,
 review=case when p_patch ? 'review' then nullif(p_patch->'review','null'::jsonb) else review end,
 approved_at=null,
 state=p_next,revision=revision+1,updated_at=now()
where id=j.id;
update public.scan_model_attempts set status='applied',error_message=null,updated_at=now() where id=a.id;
if p_next='reviewed' then update public.scan_quota_completion set closed=true where user_id=p_user and job_id=j.id; end if;
return true;
end $body$;
revoke all on function public.scan_apply_attempt(uuid,uuid,jsonb,text) from public,anon,authenticated;
grant execute on function public.scan_apply_attempt(uuid,uuid,jsonb,text) to service_role;
