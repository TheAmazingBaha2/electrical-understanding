-- Staging-only personal book/source catalog. No model calls or edits to study progress.
-- Existing scan citations remain snapshots; the catalog is a convenient selector for future uploads.
create table if not exists public.study_books (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 title text not null check (char_length(btrim(title)) between 1 and 180),
 author text check (author is null or char_length(btrim(author)) between 1 and 180),
 edition text check (edition is null or char_length(btrim(edition)) between 1 and 50),
 source_track text not null default 'other'
  check (source_track in ('geier','teach','principles','cabling','guide','basic','other')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create unique index if not exists study_books_unique_title_edition_per_owner
 on public.study_books (user_id,lower(btrim(title)),lower(btrim(coalesce(edition,''))));
create index if not exists study_books_by_owner on public.study_books(user_id,title);

alter table public.study_books enable row level security;
drop policy if exists study_books_self_select on public.study_books;
drop policy if exists study_books_self_insert on public.study_books;
drop policy if exists study_books_self_update on public.study_books;
drop policy if exists study_books_self_delete on public.study_books;
create policy study_books_self_select on public.study_books for select to authenticated
 using (auth.uid()=user_id);
create policy study_books_self_insert on public.study_books for insert to authenticated
 with check (auth.uid()=user_id);
create policy study_books_self_update on public.study_books for update to authenticated
 using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy study_books_self_delete on public.study_books for delete to authenticated
 using (auth.uid()=user_id);
revoke all on public.study_books from anon;
grant select,insert,update,delete on public.study_books to authenticated;

-- Import previously recorded book names without changing any scan, lesson, score or checkpoint.
insert into public.study_books(user_id,title,source_track,created_at,updated_at)
select distinct on (s.user_id,lower(btrim(s.source_book)))
 s.user_id,btrim(s.source_book),s.source_track,s.created_at,now()
from public.scan_lesson_jobs s
where s.source_book is not null and btrim(s.source_book)<>''
order by s.user_id,lower(btrim(s.source_book)),s.created_at desc
on conflict do nothing;
