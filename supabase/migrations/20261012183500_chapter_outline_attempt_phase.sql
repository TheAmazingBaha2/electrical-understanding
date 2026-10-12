-- Admit a distinct paid Sol outline stage without changing old attempt records.
alter table public.scan_model_attempts drop constraint if exists scan_model_attempts_phase_check;
alter table public.scan_model_attempts add constraint scan_model_attempts_phase_check
 check (phase in ('plan','analyze','outline','draft','review'));
