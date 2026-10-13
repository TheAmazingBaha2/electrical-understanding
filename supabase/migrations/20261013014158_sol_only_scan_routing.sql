-- New staging scan reservations use Sol at every stage. Historical records stay unchanged.
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
m:='gpt-6.1-sol';
capped:=(select count(*) from public.ai_test_request_log where user_id=p_user and requested_at>now()-interval '1 minute')>=10
or (select count(*) from public.ai_test_request_log where user_id=p_user and requested_at>now()-interval '1 hour')>=60
or (select count(*) from public.ai_test_request_log where user_id=p_user and requested_at>now()-interval '24 hours')>=200;
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


revoke all on function public.scan_reserve_stage(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.scan_reserve_stage(uuid,uuid,text) to service_role;
