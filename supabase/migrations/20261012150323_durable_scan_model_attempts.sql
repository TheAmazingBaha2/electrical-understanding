create table public.scan_model_attempts (
 id uuid primary key default gen_random_uuid(),
 job_id uuid not null references public.scan_lesson_jobs(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 base_revision bigint not null,
 phase text not null check(phase in ('plan','analyze','draft','review')),
 model text not null,
 status text not null check(status in ('starting','running','received','applied','incomplete','invalid','failed','unknown')),
 response_id text,
 provider_request_id text,
 raw_response text,
 output_text text,
 usage jsonb,
 error_message text,
 learner_context text not null default '',
 retry_of uuid,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index scan_attempt_job on public.scan_model_attempts(job_id,created_at desc);
create unique index scan_attempt_one_active on public.scan_model_attempts(job_id) where status in ('starting','running','received');
alter table public.scan_model_attempts enable row level security;
revoke all on public.scan_model_attempts from public,anon,authenticated;
grant select on public.scan_model_attempts to authenticated;
grant all on public.scan_model_attempts to service_role;
create policy owner_read_attempts on public.scan_model_attempts for select to authenticated
 using (user_id=(select auth.uid()) and exists(select 1 from public.ai_test_allowed_users a where a.user_id=(select auth.uid())));

