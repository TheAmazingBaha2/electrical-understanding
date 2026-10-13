# Stabilization continuation — October 13, 2026 UTC

Staging project: hkwmtjhgrskidaizamwy. Development branch only. No paid generation authorized. Do not regenerate Chapter 3.

Baseline: 41ad58b, CI 38327155220 success, scan Edge v14, lab v5. Chapter3 revision2 analyzed,18 facts,16 equations,original brief,no outline. Complete-job MD5 d4319ac549c3fd8df0e878279345a34e. Existing learning-progress phone/desktop sync is user-verified.

Applied migration: staging_spending_ledger, source 20261013004258_staging_spending_ledger.sql. Tables: ai_price_versions, ai_spend_sessions, ai_spend_ledger, ai_spend_events. New requests require session ID. No real budget was created. Lab/tutor new generation isolated at zero until equivalent protection. All ordinary study functionality remains.

Conservative reservation uses the documented 1,050,000-token context at max input/cache-write price, long-context multipliers, output bound and 10% safety allowance. Explicit default tier only; other tiers do not reconcile. Pricing expires November13 and must be reviewed. Usage estimates do not release holds. Reliable invoice evidence is required by a service-only RPC. This enforces application exposure under documented provider assumptions, not a provider account cap.

Actual concurrent PostgreSQL test: two overlapping transactions request $5.8047 each against a $10 disposable session. One accepted, one refused (remaining $4.1953). Repeated reservation retained one row; duplicate dispatch returned false. Unknown submission retained $5.8047. Synthetic completion with 1000 input/200 output/100 cached/400 cache-write tokens recorded estimate $0.00401 while retaining the hold and unknown billed amount. No provider endpoint was contacted.

RLS test in a transaction under authenticated role: owner inserted disposable book; foreign JWT subject saw zero books, scans and financial rows. Transaction rolled back. This tests SQL enforcement, not an actual second signed-in device. Browser is signed out; real private book/upload workflow needs owner sign-in.

The migration adds no existing-data rewrite. Retain raw responses, IDs, learner context and approved objects. Tests cover denied budgets, missing IDs, dispatch claims, free resume, stale retry and conservative accounting. Workers builds now require successful complete GitHub CI on the exact development commit; verification errors fail closed.

QA finance records cleaned up by their exact generated IDs. No Storage objects existed. Chapter3 complete-row checksum after cleanup exactly matches initial checksum. No changes to recovered content. Local suite now 135 passing; syntax/build validation pass. Invoice reconciliation was tested with synthetic evidence inside a transaction and rolled back; no real bill inferred.
