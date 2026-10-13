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

## Spending-limit UI repair — October 13, 2026 UTC

Owner verified all seven free phone/desktop tests. Chapter3 paid Sol outline succeeded:16units, revision3 outlined,18facts/16equations retained. Attempt6094364f-bb8f-4e90-83a1-6b37614cb125 has reserved/held$5.9004 and usage estimate$0.036246 (not invoiced). Draft attempt708f85e2-e539-4270-a164-4255ec83b296 failed before provider dispatch for insufficient budget, with no response ID or new reservation. Do not automatically retry it.

Bug: Set limit always called ai_open_budget, causing ai_one_open_budget duplicate-key error. Added ai_update_budget with owner/allowlist checks, session locking shared with reservations, expected-limit guard, idempotent no-op, refusal below held exposure, and private authorization-change history. UI now updates existing sessions, disables the button during submission and keeps failure text inline. Toasts moved top-center above tutor layers, with wrapped/scrollable text. Migration adjustable_spending_sessions applied; live rollback test tests changes/idempotency/stale authorizations/held exposure/foreign users. No budget increase committed, no paid call or retry initiated.

Full16-unit draft/review exposure at normal output caps:16*$11.682=$186.912 additional, total including held outline$192.8124 (round total session authorization$193). This is NOT expected actual bill. Full-chapter batching still needs the earlier human-approval gate changed; current UI remains individual stages. Do not tell the owner that automatic batch generation is already implemented. Retain explicit human approval after completed reviews. Obtain separate spending approval before new calls.

## Whole-chapter batch workflow — October 13, 2026 UTC

Owner confirmed spending-limit fix and authorized workflow engineering, not new paid generation. Added explicitly confirmed whole-chapter draft/review runner. Each successfully reviewed current draft moves via free revision-guarded queue-reviewed action to lesson.pending; lesson.lessons remains human-approved only. The cursor counts approved+pending units. Completed pending objects persist through subsequent drafts/reviews/recovery and feed the next prompt as reviewed_chapter_drafts, distinguished from approved_chapter_lessons. Final explicit free approve-batch validates every pending unit/review and merges stable IDs while leaving earlier approvals unchanged. Neither extraction nor outline is rebuilt.

Batch uses the existing durable attempts, unique active-request guard, session budget reservations and dispatch claims. Unknown/invalid/incomplete failures stop; failed technical review stops without paid correction. Only one exact earlier budget-denied attempt with proof in its saved message may be retried when the owner explicitly confirms batch startup including that attempt; later failures are not retried. Output inflation is now conditional on actual saved output, so a rejected-before-submission attempt does not unnecessarily raise its token bound.

Browser orchestrates the batch. Keep Scan Inbox open; this is not an unattended server scheduler. Pause stops before the next request; an in-flight response remains recoverable. Closing/reloading requires an explicit resume click; known response IDs are polled without new reservations, and pending units are skipped. The current request's ordinary polling may time out locally after about two minutes; batch stops and saved ID can be resumed, never silently regenerated.

Fresh budget/pricing is checked before batch authorization. UI refuses startup if the conservative remaining exposure is unavailable; server still atomically guards every individual POST. Concurrent independent spending can exhaust funds mid-batch and stop it safely. All16 ungenerated Chapter3 units require32 new requests, extra$186.912 plus outline hold$5.9004; total$192.8124, round session limit$193. This is not expected usage cost or provider billing cap. NO authorization to spend that amount has been granted in chat; owner must explicitly authorize the chosen limit and chapter batch. No actual budget changes or paid calls made during engineering.

144 local tests pass, including full batch+free approval, pause/restart, approved-object preservation, review rejection, concurrent queue conflict, uncertain failures, scoped one-time retry, prompt handoffs and exposure bounds. Chromium fixture now also exercises two-unit batch and deferred approval. Await exact-commit CI/browser and served-source verification. No database migration needed; checkpoints use the existing private lesson JSON and revision CAS.
