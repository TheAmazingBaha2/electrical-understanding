-- Verify updates against the owner session without committing any changes or calling a provider.
begin;
do $$
declare b public.ai_spend_sessions; amount numeric; before_hold numeric; n int; denied boolean;
begin
 select * into b from public.ai_spend_sessions where state='open' limit 1 for update;
 if not found then raise exception 'Open staging session required'; end if;
 perform set_config('request.jwt.claim.sub',b.user_id::text,true);
 select coalesce(sum(held_usd),0) into before_hold from public.ai_spend_ledger where session_id=b.id;
 amount:=b.authorized_usd+1;
 perform public.ai_update_budget(b.id,b.authorized_usd,amount);
 if (select authorized_usd from public.ai_spend_sessions where id=b.id)<>amount then raise exception 'Update failed'; end if;
 select count(*) into n from public.ai_budget_changes where session_id=b.id;
 perform public.ai_update_budget(b.id,amount,amount);
 if (select count(*) from public.ai_budget_changes where session_id=b.id)<>n then raise exception 'Idempotency failed'; end if;
 denied:=false;
 begin perform public.ai_update_budget(b.id,b.authorized_usd,amount+1); exception when others then denied:=true; end;
 if not denied then raise exception 'Stale authorization accepted'; end if;
 if before_hold>0 then
 denied:=false;
 begin perform public.ai_update_budget(b.id,amount,0.01); exception when others then denied:=true; end;
 if not denied then raise exception 'Held exposure released'; end if;
 end if;
 if (select coalesce(sum(held_usd),0) from public.ai_spend_ledger where session_id=b.id)<>before_hold then raise exception 'Hold changed'; end if;
 perform set_config('request.jwt.claim.sub',gen_random_uuid()::text,true);
 denied:=false;
 begin perform public.ai_update_budget(b.id,amount,amount+1); exception when others then denied:=true; end;
 if not denied then raise exception 'Foreign owner accepted'; end if;
 if has_function_privilege('anon','public.ai_update_budget(uuid,numeric,numeric)','execute') then raise exception 'Anonymous update allowed'; end if;
end $$;
rollback;
select 'PASS: adjustable limits, preserved holds, idempotency, stale limit and foreign-owner rejection; rolled back' result;
