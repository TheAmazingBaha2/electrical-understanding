-- Staging-only integration assertions. All fixtures and writes roll back.
begin;
select set_config('test.alice',gen_random_uuid()::text,true);
select set_config('test.bob',gen_random_uuid()::text,true);
insert into auth.users(id) values(current_setting('test.alice')::uuid),(current_setting('test.bob')::uuid);
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.alice'),true);
insert into public.lesson_progress(user_id,lesson_id,data)
 values(auth.uid(),'__persistence_test__','{"answers":{"q":{"value":"legacy"}},"unknown":{"keep":true}}');
do $$
declare n integer;
begin
 if (select count(*) from public.lesson_progress) <> 1 then raise exception 'RLS read isolation failed'; end if;
 begin
  insert into public.lesson_progress(user_id,lesson_id,data) values(current_setting('test.bob')::uuid,'forbidden','{}');
  raise exception 'Cross-user insert allowed';
 exception when insufficient_privilege then null; end;
 -- Old clients may still save untouched legacy rows before they upgrade.
 update public.lesson_progress set data=data||'{"complete":true}' where lesson_id='__persistence_test__';
 if (select revision from public.lesson_progress where lesson_id='__persistence_test__') <> 1 then raise exception 'Legacy revision failed'; end if;
 -- One idempotent, optimistic conversion: repeat WHERE revision=1 cannot apply twice.
 update public.lesson_progress set data=data||'{"schemaVersion":3}',revision=2 where lesson_id='__persistence_test__' and revision=1;
 update public.lesson_progress set data=data||'{"lost":true}',revision=2 where lesson_id='__persistence_test__' and revision=1;
 get diagnostics n = row_count;
 if n <> 0 then raise exception 'Stale conditional update succeeded'; end if;
 begin
  update public.lesson_progress set data=data||'{"stale":true}' where lesson_id='__persistence_test__';
  raise exception 'Unconditional stale writer allowed';
 exception when serialization_failure then null; end;
 begin
  update public.lesson_progress set data='{"answers":{}}' where lesson_id='__persistence_test__';
  raise exception 'Legacy downgrade allowed';
 exception when raise_exception then
  if sqlerrm <> 'Progress schema downgrade blocked' then raise; end if;
 end;
 begin
  update public.lesson_progress set user_id=current_setting('test.bob')::uuid where lesson_id='__persistence_test__';
  raise exception 'Owner reassignment allowed';
 exception when raise_exception then
  if sqlerrm <> 'Progress identity is immutable' then raise; end if;
 end;
 if (select count(*) from public.lesson_progress_history) <> 3 then raise exception 'History snapshot count failed'; end if;
 if not (select data ? 'unknown' from public.lesson_progress_history where revision=0) then raise exception 'Original backup lost'; end if;
 begin
  delete from public.lesson_progress_history;
  raise exception 'History deletion allowed';
 exception when insufficient_privilege then null; end;
 begin
  insert into public.lesson_progress_history(user_id,lesson_id,revision,data) values(auth.uid(),'forged',0,'{}');
  raise exception 'History forgery allowed';
 exception when insufficient_privilege then null; end;
 if has_table_privilege('authenticated','public.lesson_progress','TRUNCATE') then raise exception 'TRUNCATE grant remains'; end if;
 if has_table_privilege('authenticated','public.lesson_progress','DELETE') then raise exception 'DELETE grant remains'; end if;
 update public.lesson_progress set data=data||'{"schemaVersion":4,"future":true}',revision=3 where lesson_id='__persistence_test__' and revision=2;
 begin
  update public.lesson_progress set data=data||'{"schemaVersion":3}',revision=4 where lesson_id='__persistence_test__';
  raise exception 'Future downgrade allowed';
 exception when raise_exception then
  if sqlerrm <> 'Progress schema downgrade blocked' then raise; end if;
 end;
end;
$$;
select set_config('request.jwt.claim.sub',current_setting('test.bob'),true);
do $$
begin
 if (select count(*) from public.lesson_progress) <> 0 then raise exception 'Other user can read progress'; end if;
 if (select count(*) from public.lesson_progress_history) <> 0 then raise exception 'Other user can read history'; end if;
 update public.lesson_progress set data='{}' where lesson_id='__persistence_test__';
 if found then raise exception 'Other user can update progress'; end if;
end;
$$;
set local role anon;
do $$
begin
 begin
  perform * from public.lesson_progress;
  raise exception 'Anonymous read allowed';
 exception when insufficient_privilege then null; end;
end;
$$;
rollback;
select 'PASS: RLS, history, revisions, stale writes, legacy/future downgrade, least privilege; fixtures rolled back' as result;
