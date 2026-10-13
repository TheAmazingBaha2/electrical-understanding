-- Staging-only private source uploads and reviewable AI lesson drafts.
-- No changes to the stable lesson_progress schema or production project.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('eu-private-scans','eu-private-scans',false,5242880,ARRAY['application/pdf','image/png','image/jpeg','image/webp'])
on conflict(id) do nothing;
-- Never turn this bucket public, even if the row already existed.
update storage.buckets set public=false,file_size_limit=5242880,
  allowed_mime_types=ARRAY['application/pdf','image/png','image/jpeg','image/webp']
where id='eu-private-scans';

drop policy if exists "eu_owner_upload_scans" on storage.objects;
create policy "eu_owner_upload_scans" on storage.objects
for insert to authenticated
with check (
 bucket_id='eu-private-scans'
 and (storage.foldername(name))[1]=(select auth.uid()::text)
 and storage.extension(name) in ('pdf','png','jpg','jpeg','webp')
 and exists (select 1 from public.ai_test_allowed_users a
             where a.user_id=(select auth.uid()))
);
drop policy if exists "eu_owner_read_scans" on storage.objects;
create policy "eu_owner_read_scans" on storage.objects
for select to authenticated
using (
 bucket_id='eu-private-scans'
 and (storage.foldername(name))[1]=(select auth.uid()::text)
 and exists (select 1 from public.ai_test_allowed_users a
             where a.user_id=(select auth.uid()))
);
-- No client update/delete of scans; never issue public URLs.

create table if not exists public.scan_lesson_jobs (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 title text not null check(char_length(title) between 1 and 140),
 source_kind text not null check(source_kind in ('application/pdf','image/png','image/jpeg','image/webp')),
 source_path text not null,
 source_bytes bigint not null check(source_bytes between 1 and 5242880),
 state text not null default 'uploaded'
   check(state in ('uploaded','analyzed','drafted','reviewed','needs_revision','approved')),
 analysis jsonb,
 lesson jsonb,
 review jsonb,
 draft_id text unique,
 approved_at timestamptz,
 revision bigint not null default 0,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(user_id,source_path),
 check ((state != 'approved') or (lesson is not null and review is not null and approved_at is not null)),
 check (draft_id is null or (draft_id ~ '^GEN-[A-F0-9-]{36}$'))
);
create index if not exists scan_lesson_jobs_owner_created on public.scan_lesson_jobs(user_id,created_at desc);
alter table public.scan_lesson_jobs enable row level security;
revoke all on public.scan_lesson_jobs from public,anon,authenticated;
grant select on public.scan_lesson_jobs to authenticated;
drop policy if exists "owner_read_private_scans" on public.scan_lesson_jobs;
create policy "owner_read_private_scans" on public.scan_lesson_jobs for select
to authenticated using ((select auth.uid())=user_id
  and exists(select 1 from public.ai_test_allowed_users a where a.user_id=(select auth.uid())));
-- Writes happen only through the account-verified Edge Function using its server-only credential.
