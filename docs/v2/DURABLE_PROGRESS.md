# Durable progress contract and migration runbook

Scope: `draft/v2-dmm-companion`, staging project `hkwmtjhgrskidaizamwy` only. No production migration or deployment is authorized by this work. Site version (v2/v3/v4) and persistence schema version are independent.

## Audit (2026-10-11)

Before this change, `app.js` persisted a bare lesson-ID map under `eu_staging_progress_v1_<user>` (anonymous: `eu_demo_v1`). Cloud rows had `(user_id, lesson_id)` primary key, `data jsonb`, and `updated_at`. Answers were already keyed by explicit question IDs. Lesson-level device timestamps chose winners; unconditional upserts could lose simultaneous answers. Invalid local JSON was silently treated as empty. There was no record version, migration history, or cloud snapshot history. Replacing an answer discarded unfamiliar answer fields.

Staging RLS was enabled with own-user SELECT, INSERT, and UPDATE policies (both USING and WITH CHECK on updates). No DELETE policy existed. Authenticated users nevertheless had unnecessary DELETE, TRUNCATE, REFERENCES and TRIGGER grants. Those were removed; TRUNCATE is not protected by RLS. No production query or mutation was performed.

## Implemented

- `persistence.js` owns persistence independently of views, tabs, routes, lesson ordering and grading UI. Schema 3 is an envelope with `progress`, `owner`, `project`, `bases` and `conflicts`; each lesson also carries `schemaVersion:3`.
- `migrate` accepts the actual v1/v2 unversioned lesson map, old `{version:1,progress}` exports, and explicit schema 1/2 envelopes. Migration copies data, adds the version and missing answer map, and is idempotent. There was no distinct deployed v2 record format; explicit schema-2 fixtures test the supported contract.
- Existing lesson and question IDs are frozen in `tests/stable-ids.json`. Identity is `(lesson.id, question.id)`; IDs are never generated from title, route, position or UI track. Unknown/archived lesson and question entries remain in storage and exports. Current quiz accuracy counts current question IDs only.
- Unknown JSON fields survive migration and edits. Unsafe prototype keys or invalid/future schemas fail closed. Original local bytes remain exportable. Unknown cloud versions pause synchronization without downgrading or overwriting the cloud row.
- Storage keys include staging project and authenticated user, with a separate anonymous scope. Old keys remain untouched. Explicit practice import is the only anonymous-to-account transfer. Versioned exports refuse an account/project mismatch; old unscoped exports require the user's explicit file selection.
- Every local document replacement first creates a separate recovery point under the same user/project namespace. No automatic backup deletion. A quota failure stops the write and reports that the answer was not saved; the form remains available. Web Locks serialize cooperating tabs; unsupported browsers fail closed for writes. These protections do not make browser storage encrypted or protect against someone controlling the browser profile.
- Cloud reads are paginated. Cloud writes use an atomic revision condition and increment, never timestamp ranking or unconditional upsert. A lost response is reconciled by rereading. A local edit during upload stays dirty. Newer revisions acknowledged by another tab cannot be replaced by an older download.
- Simultaneous changes to **the same lesson** create an explicit conflict, even when they affect different questions. Both copies remain locally recoverable. Account lets the learner compare answer values and select one whole lesson copy; both are backed up before resolution. A further cloud edit causes another conflict instead of being overwritten. Different lessons sync independently.
- Offline edits remain on disk and retry on reconnection, tab visibility, manual refresh, subsequent saves, and every 30 seconds while online/visible. Background refresh does not reset an actively edited lesson form. In-flight authentication changes cannot install the previous account's results into the new account.
- Account offers versioned JSON export, validated import and local backup restoration through the same conflict review. Import never restores untrusted sync baselines over current baselines. The entire import source is backed up, including unfamiliar metadata and prior conflicts, even where only its progress map is imported into the active state.
- Database revision guards reject stale v3 updates and schema downgrades, including old clients trying to overwrite a converted row. Existing legacy clients can still write rows that have not yet converted. Rollback to an old UI is therefore safe but **not write-compatible for converted rows**.
- `lesson_progress_history` stores initial snapshots and every successful insert/update in the same transaction. Authenticated users can read only their own snapshots and cannot insert, modify, truncate, or delete them. The internal, unexposed SECURITY DEFINER trigger exists solely to write protected history; ordinary progress writes still pass RLS. Its search path is empty and client-role writes check `auth.uid()`.
- Build/runtime require the exact staging URL and staging environment; build requires a publishable key, scans public assets for the known production project and secret-key prefix, and refuses `main` in Workers Builds. Supabase JS is pinned to 2.57.4. Public assets are allowlisted. The repository has no production credential in its staging configuration.

## Applied to staging

`supabase/migrations/20261011192101_durable_progress.sql` was applied to `hkwmtjhgrskidaizamwy`. It added revision/history and guards without rewriting existing JSON. Immediately after verification: two original rows, two initial snapshots, both original rows still unversioned, zero test rows. Reapplying the SQL in a transaction then rolling back succeeded without duplicate history. Future real study activity will increase these counts.

The SQL file was created with Supabase CLI `migration new`. The current CLI could not initialize its home directory in this sandbox; CLI 2.75.0 generated the filename. Deployment used the Supabase migration connector. No linked production project or production credentials were used.

## Proposed / not implemented

- Automatic per-answer three-way merges, including grading-content revisions and same-answer conflict resolution. Current whole-lesson detection is safe but may require more user review.
- Automatic schema 4 conversion. Schema 4 must add an explicit migrator and fixtures; current code deliberately refuses unsupported schema versions.
- Automatic renames/aliases, splits or combinations of lesson IDs. A redesign should keep IDs; intentional semantic changes need reviewed alias mappings or new IDs, never reuse old IDs. Archived records are preserved, not automatically projected into new lessons.
- Provider-level disaster recovery, scheduled off-site backups, automatic retention pruning, and restoring deleted Auth users. History shares the same database and follows Auth-user deletion; it is not a disaster-recovery backup. Monitor history growth and browser quota. Export before any deliberate retention cleanup.
- Cloud-history browsing/restoration in the learner UI. Local recovery is implemented; cloud history recovery uses the operator procedure below.
- Production adoption, main-branch changes, production backup execution, and production deployment. None were performed.

## Staging verification

1. Confirm the checked-out branch and project ref before any action. Run `npm run check`, `npm test`, `npm run build`, and `node tests/deploy.validation.mjs`.
2. Serve `dist` on `127.0.0.1:8080`, then run `node tests/browser-smoke.mjs` and `node tests/persistence-browser.mjs` with Playwright installed. CI runs both. The local verification used installed Chrome; CI uses Chromium.
3. Run `tests/staging-persistence.sql` only in the staging SQL editor or staging connector. It creates two transaction-scoped test Auth users, checks RLS/grants/history/revisions/downgrades, and rolls back everything. Re-query to confirm no `__persistence_test__` row remains.
4. After the draft branch's staging build is available, use two dedicated staging accounts to verify actual email login, refresh/expiry, sign-out/sign-in isolation and separate browser caches. Do not reuse production sessions.
5. With the same staging account on phone and desktop, sync a common baseline, disconnect both, answer different questions in the same lesson, reconnect, and confirm Account shows both copies. Export before resolving. Choose a copy, refresh the other device, and confirm agreement. Repeat with different lessons (both should sync), a network interruption after the server accepts an answer, and account switching during a slow request.
6. Test an old cached browser: unconverted rows still work; after the new browser edits that lesson, the old client's save must fail visibly. Export its local copy, refresh to the new build, then import/review rather than forcing a downgrade.
7. Check schema/version errors and backups before accepting the rollout. Real email delivery and physical phone/desktop acceptance remain manual; automated tests do not establish them.

## Recovery and rollback

**Local answer rollback:** Account → Export first → select a recovery point → Restore through conflict review → compare and choose incoming. Restoration creates another backup and uses normal revision-checked sync. Missing lessons from a backup do not delete current lessons. To recover prior conflicts or alternate copies nested in an exported backup, extract the desired `progress` map into an old-format `{version:1,progress:...}` file, review it, and explicitly import it. Keep the original export intact.

**Corrupt/future local data:** Export preserves raw bytes and all recovery points. Do not clear browser storage or reinstall before exporting. Use a version that understands the schema, or have an operator recover a validated progress map from the export. The current app intentionally cannot write through a corrupt/future cache.

**Cloud rollback:** Take an external snapshot first. Select the desired row from `lesson_progress_history` by user ID, lesson ID and revision; compare with current data. Restore through a supported client import, or an approved operator transaction that locks the current row and writes the selected document with `revision = current revision + 1`. Migrate the old JSON to the current supported schema before restoring it. Never decrease revision or schema version. The trigger snapshots the replacement too. Keep every source snapshot.

**Code rollback:** Redeploy the last known-good build that supports schema 3. Keep the additive database columns/history/guards and the new local keys. Rolling UI back to the pre-change build leaves its legacy cache intact but cannot safely save converted rows. Do not drop history, disable RLS, remove the guard, or copy stale legacy caches over v3 to make an old client writable. A new forward compatibility fix is safer than destructive down-migration.

## Eventual production procedure — requires separate approval

1. Choose an approved commit; review stable IDs, new migration fixtures, RLS and content/grading changes. Inventory active client versions and pause production writes or establish a verified consistent snapshot boundary.
2. In the explicitly approved production project, create a provider database backup/PITR checkpoint where available and an encrypted logical export of schema, progress, history, policies, grants, triggers/functions and Auth identity mappings. Record project ref, UTC time, row counts and checksums. Export unsynced progress on each device separately; server backups cannot include offline answers. Keep secrets and learner data outside Git and public assets.
3. Restore that backup into an isolated rehearsal project and prove counts, sample answer equality, user ownership and restore access. Test schema conversion twice, old/new clients, concurrent writes, rollback and offline replay. Do not map users by email alone across independent Supabase projects; use an explicitly reviewed identity mapping.
4. Only after approval, apply the additive SQL to production, verify snapshots/RLS, then release a production-configured client through the production release process. This staging build intentionally refuses production; do not merely change its config and bypass the checks.
5. Monitor conflicts, blocked old clients, schema failures, sync errors and history growth. Retain pre-migration external backups and schema-3-compatible rollback builds through the agreed retention period. Any destructive cleanup requires separate review.

## References and audit caveat

Supabase RLS guidance: https://supabase.com/docs/guides/database/postgres/row-level-security
The current changelog and PostgreSQL minor-release notice were checked; the implementation uses none of the affected ltree, legacy pgcrypto ciphers, btree_gist float indexes or custom operators.
Staging security advisor found no new database warnings. Its pre-existing **leaked password protection disabled** warning remains: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection . This app uses email-link login; changing Auth password policy was outside this persistence rollout.

## Verification results for this change

- 53 Node tests passed (23 persistence/identity tests plus 30 existing source/UI tests).
- Module syntax checks, staging build and deployment allowlist/branch/config validation passed.
- Desktop and mobile browser smoke suite passed using installed Chrome.
- Browser persistence suite passed: legacy migration, import conflict display/resolution, export payload including old data/backups, archived records, shared-tab writes, future-schema warning and raw recovery export. Windows sandbox canceled actual file downloads; local run used `CAPTURE_EXPORT=1` to validate the exact generated Blob. CI runs the real-download path.
- Live staging transaction tests passed for RLS (two synthetic users and anonymous role), revision guards, stale conditional writes, legacy/future downgrade blocking, protected history and least privilege. Test users/rows were rolled back; final read verified zero test rows and the original two rows plus two snapshots.
- Migration reapplication/idempotency passed inside a rolled-back staging transaction.
- Staging security advisor: no new database warnings; existing leaked-password-protection warning remains as described above.
- Physical phone/desktop email-link login and offline acceptance on the new staging build remain manual, even though the user confirmed the previous build syncs successfully.
