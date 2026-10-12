-- Staging migration: source-specific lessons versus cross-book reinforcement.
-- Owner RLS and existing IDs remain unchanged. No existing study answers are modified.
alter table public.scan_lesson_jobs
 add column if not exists source_book text,
 add column if not exists source_pages text,
 add column if not exists source_track text not null default 'other';

do $$
begin
 if not exists(select 1 from pg_constraint where conname='scan_source_book_length') then
  alter table public.scan_lesson_jobs add constraint scan_source_book_length
   check (source_book is null or char_length(source_book) between 1 and 180);
 end if;
 if not exists(select 1 from pg_constraint where conname='scan_source_pages_length') then
  alter table public.scan_lesson_jobs add constraint scan_source_pages_length
   check (source_pages is null or char_length(source_pages) between 1 and 80);
 end if;
 if not exists(select 1 from pg_constraint where conname='scan_source_track_valid') then
  alter table public.scan_lesson_jobs add constraint scan_source_track_valid
   check (source_track in ('geier','teach','principles','cabling','guide','basic','other'));
 end if;
end $$;
