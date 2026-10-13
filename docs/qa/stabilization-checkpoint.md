# Stabilization continuation — October 13, 2026 UTC

Staging project: hkwmtjhgrskidaizamwy. Development branch only. No paid generation authorized. Do not regenerate Chapter 3.

Baseline: 41ad58b, CI 38327155220 success, scan Edge v14, lab v5. Chapter3 revision2 analyzed,18 facts,16 equations,original brief,no outline. Complete-job MD5 d4319ac549c3fd8df0e878279345a34e. Existing learning-progress phone/desktop sync is user-verified.

Applied migration: staging_spending_ledger, source 20261013004258_staging_spending_ledger.sql. Tables: ai_price_versions, ai_spend_sessions, ai_spend_ledger, ai_spend_events. New requests require session ID. No real budget was created. Lab/tutor new generation isolated at zero until equivalent protection. All ordinary study functionality remains.

Conservative reservation uses the documented 1,050,000-token context at max input/cache-write price, long-context multipliers, output bound and 10% safety allowance. Explicit default tier only; other tiers do not reconcile. Pricing expires November13 and must be reviewed. Usage estimates do not release holds. Reliable invoice evidence is required by a service-only RPC. This enforces application exposure under documented provider assumptions, not a provider account cap.

Actual concurrent PostgreSQL test: two overlapping transactions request $5.8047 each against a $10 disposable session. One accepted, one refused (remaining $4.1953). Repeated reservation retained one row; duplicate dispatch returned false. Unknown submission retained $5.8047. Synthetic completion with 1000 input/200 output/100 cached/400 cache-write tokens recorded estimate $0.00401 while retaining the hold and unknown billed amount. No provider endpoint was contacted.

RLS test in a transaction under authenticated role: owner inserted disposable book; foreign JWT subject saw zero books, scans and financial rows. Transaction rolled back. This tests SQL enforcement, not an actual second signed-in device. Browser is signed out; real private book/upload workflow needs owner sign-in.

The migration adds no existing-data rewrite. Retain raw responses, IDs, learner context and approved objects. Tests cover denied budgets, missing IDs, dispatch claims, free resume, stale retry and conservative accounting. Workers builds now require successful complete GitHub CI on the exact development commit; verification errors fail closed.

QA finance records cleaned up by their exact generated IDs. No Storage objects existed. Chapter3 complete-row checksum after cleanup exactly matches initial checksum. No changes to recovered content. Local suite now 135 passing; syntax/build validation pass. Invoice reconciliation was tested with synthetic evidence inside a transaction and rolled back; no real bill inferred.

Release evidence: implementation commit f5e07b668923695a9a0fdfc56ed9f8aeda02f977; CI run38329302170 checks and all six browser scripts passed (135 unit tests). Cloudflare eu-v2-staging check succeeded; live cache-busted build-info reports this commit, built00:52:37.928UTC. Served scan-inbox.js equals local bytes. Scan Edge v15 retrieved source equals local bytes; bundle c9a16fcd7c2c85365a40ed0740567ee6bd9ba2d1d0e94af88db849a3cd093ef4. Lab Edge v6 pauses unprotected generation.

Second actual PostgreSQL race: two overlapping scan_apply_attempt calls returned true for the same synthetic received response. Final revision1 and applied status prove exactly one transition, not revision2. Its disposable job and attempt were removed afterward. Chapter3 checksum again unchanged. All test-created finance sessions/ledgers/jobs removed; no budget remains authorized.

Cloudflare has an unrelated stale check named Workers Builds: electrical-understanding, which fails because that Worker does not exist. The dedicated eu-v2-staging build succeeds. Do not alter the unrelated Worker or production to silence this check.

Outstanding: authenticated book/upload/citation/storage workflow and multi-session browser test need owner sign-in (email-link login). Existing progress sync remains user-verified. No paid call made. Proposed conservative five-call exposure is $75.85215 (round authorization to $76), not predicted actual cost. Do not authorize this automatically. Tiny source expected token cost remains far smaller; input/output inference not yet tested. Do not advertise a $1 guaranteed cap with the full-context reservation design.

## Sol-only continuation — October 13, 2026 UTC

All NEW scan pipeline generations now use gpt-6.1-sol at explicit default service tier: planning, extraction, chapter outline, individual drafting, technical review. Human approval remains free. Historical Astra attempts/raw output and the astra_guidance compatibility field stay intact; saved extraction/review headings are model-neutral and attempt logs show the recorded model. Visual tracker stages remain intact. Separate lab/tutor generation remains paused; do not advertise scan protection as covering those endpoints.

Migration 20261013014158_sol_only_scan_routing applied to staging changes only future quota records. Live rollback test verified extraction/review write Sol quota records. Financial RPC rollback suite passed again: reservation arithmetic/idempotency, dispatch claim, unknown holds, usage estimates, invoice evidence conflicts and role grants. No budget authorized; no paid provider calls. Earlier actual two-transaction reservation/application race evidence remains in the baseline above.

Local 136/136 unit tests, syntax/build/module validation pass. Local browser runner unavailable because the runtime lacks its Chromium executable; rely on new exact-commit GitHub Chromium CI before staging promotion. Do not claim an authenticated browser test: current cloud browser is signed out. Book import/upload/citation/storage and second-session UI checks still require owner sign-in. Existing phone/desktop learning-progress sync remains previously user-verified.

Source extraction row rechecked before work: revision2 analyzed,18facts,16equations,brief retained,no outline; checksum d4319ac549c3fd8df0e878279345a34e. No existing data writes. Budget ledger/accounting details now visible per source. Long-context estimate multipliers now come from the saved central price snapshot, not duplicated application constants.

Scan Edge deployed as v16 (JWT enabled), bundle06c982641d9fd70b70f861cb0d3dde824b1be20faa7052b6d6e8e61b91373ef5. Source readback available. Await branch CI and served build verification for this continuation. Prior head535a0f2 CI38329616363 passed and was served before changes.

Controlled test proposal, NOT AUTHORIZED: five Sol requests with output caps1800/4500/7600/6200/1800; conservative full-context reservations sum$29.23635, suggest$30 authorization. Expected tiny-source actual usage is much smaller; this is an application exposure guard under documented pricing/context assumptions, NOT a provider billing cap. Do not start while authenticated free checks remain incomplete. No extra paid retry or second lesson without renewed owner authorization. Preserve Chapter3; use specially authored5V/1kohm source only.
