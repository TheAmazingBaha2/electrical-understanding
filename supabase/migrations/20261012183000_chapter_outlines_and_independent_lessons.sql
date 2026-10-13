-- Staging-only migration: Sol creates a flexible chapter outline, then one unit per paid draft.
-- Existing scan IDs, source evidence, and grades remain unchanged.
alter table public.scan_lesson_jobs drop constraint if exists scan_lesson_jobs_state_check;
alter table public.scan_lesson_jobs add constraint scan_lesson_jobs_state_check
 check (state in ('uploaded','analyzed','outlined','drafted','reviewed','needs_revision','approved'));
CREATE OR REPLACE FUNCTION public.scan_reserve_stage(p_user uuid, p_job uuid, p_stage text)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare j public.scan_lesson_jobs%rowtype; g public.scan_quota_completion%rowtype; m text; capped boolean;
begin
if p_stage not in ('plan','analyze','outline','draft','review') then return false; end if;
if not exists(select 1 from public.ai_test_allowed_users where user_id=p_user) then return false; end if;
perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(p_user::text),78643);
select * into j from public.scan_lesson_jobs where id=p_job and user_id=p_user for update;
if not found then return false; end if;
if not ((p_stage in ('plan','analyze') and j.state='uploaded') or (p_stage='outline' and j.state='analyzed') or (p_stage='draft' and j.state in ('analyzed','outlined','needs_revision')) or (p_stage='review' and j.state='drafted')) then return false; end if;
m:=case when p_stage in ('plan','outline','draft') then 'gpt-6.1-sol' else 'gpt-6-astra' end;
capped:=(select count(*) from public.ai_test_request_log where user_id=p_user and requested_at>now()-interval '1 minute')>=10
or (select count(*) from public.ai_test_request_log where user_id=p_user and requested_at>now()-interval '1 hour')>=60
or (select count(*) from public.ai_test_request_log where user_id=p_user and requested_at>now()-interval '24 hours')>=200
or (m='gpt-6-astra' and (select count(*) from public.ai_test_request_log where user_id=p_user and model=m and requested_at>now()-interval '24 hours')>=40);
if capped then
-- Only already-started work qualifies. One completion job per rolling day.
if j.revision=0 then return false; end if;
select * into g from public.scan_quota_completion where user_id=p_user;
if not found then
 insert into public.scan_quota_completion(user_id,job_id) values(p_user,p_job);
elsif g.started_at<=now()-interval '24 hours' then
 update public.scan_quota_completion set job_id=p_job,started_at=now(),used_stages='{}',closed=false where user_id=p_user;
elsif g.job_id<>p_job or g.closed then return false;
end if;
select * into g from public.scan_quota_completion where user_id=p_user;
-- One over-limit request per remaining stage, plus one shared recovery/revision request.
if cardinality(g.used_stages)>=4 or (select count(*) from unnest(g.used_stages) s where s=p_stage)>=2 then return false; end if;
update public.scan_quota_completion set used_stages=array_append(used_stages,p_stage) where user_id=p_user;
end if;
insert into public.ai_test_request_log(user_id,model) values(p_user,m);
return true;
end $function$;

CREATE OR REPLACE FUNCTION public.scan_apply_attempt(p_user uuid, p_attempt uuid, p_patch jsonb, p_next text)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
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
 or (a.phase='outline' and j.state='analyzed' and p_next='outlined')
 or (a.phase='draft' and j.state in ('analyzed','outlined','needs_revision') and p_next='drafted')
 or (a.phase='review' and j.state='drafted' and p_next in ('reviewed','needs_revision'))) then return false; end if;
update public.scan_lesson_jobs set
 analysis=case when p_patch ? 'analysis' then p_patch->'analysis' else analysis end,
 lesson=case when p_patch ? 'lesson' then p_patch->'lesson' else lesson end,
 review=case when p_patch ? 'review' then nullif(p_patch->'review','null'::jsonb) else review end,
 approved_at=null,
 state=p_next,revision=revision+1,updated_at=now()
where id=j.id;
update public.scan_model_attempts set status='applied',error_message=null,updated_at=now() where id=a.id;
-- Completion allowance closes only after the last chapter unit is approved;
-- intermediate technical reviews must not close it.
return true;
end $function$;

