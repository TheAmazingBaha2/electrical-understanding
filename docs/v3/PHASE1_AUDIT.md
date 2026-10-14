# V3 Phase 1 — 2026-10-14

Base: draft/v2-dmm-companion at 9c63daf8585f110c5714e0315c70659e1e75f97d, tree ac878d3ec33f2f0aed3a206d5fc7c9a890dc8bcd. Shell network proxy is unreachable. Connector reconstruction matched every upstream blob and the complete tree. Local snapshot commit is a reconstruction, not upstream history.

## Preservation and dependency map

Production read-only inventory: one approved source, revision 61. Sixteen original units yield twelve source lessons and four reinforcement lessons; seventeen curated units include the chapter summary. Total runtime inventory: 33 lessons, 336 question IDs. `content/approved/source-jobs.json` preserves the structured source, evidence, references, approvals, unknown fields and original unit objects. It contains no owner identity, private storage path, raw file or learner answers. `inventory.json` records placement, prerequisites, activity contracts and question fingerprints. `approved-lessons.js` is the exact existing adapter output, published in place of authenticated scan-table reads. No paid regeneration or manual rewrite. Retained numeric tolerances and legacy supplemental reflection IDs are existing behavior.

Dependency chain: app → scan-inbox → scan-lesson-pipeline → scan_lesson_jobs / scan_model_attempts / scan_quota_completion / study_books / eu-private-scans / spending tables. AI benchmark and Study Tutor shared ai-model-lab. The tutor no longer invokes that gateway; launcher movement and conversation/context UI remain reusable, disabled. generated-library is the preserved lesson adapter; generated-simulations is educational interaction and remains. lesson-tabs/view, learning-structure and source-navigation still own five tabs, curriculum, references and dashboard placement. ProgressStore, grading, review scheduling and cloud conflict handling are unchanged.

Authoring frontend and historical backend source are quarantined in archive/authoring, excluded from the public allowlist and application imports. Historical tests explicitly exercise that archive with mocked providers; they cannot invoke real paid models. Active backend source is a dependency-free HTTP 410 tombstone. It has NOT been deployed. Production functions remain active: scan-lesson-pipeline v31, ai-model-lab v8. All website authoring entry points are removed from V3. Production upload INSERT policy remains pending separately reviewed retirement.

Historical migrations remain untouched. They are audit history, not instructions to apply them to a new V3 database. A fresh backend must not replay the obsolete upload grants. No database reset, branch, project or migration was created.

## Database and security

Read-only counts: 8 progress records, 38 history records, one approved source, one raw storage object. No learner answer/history exports were placed in the repository. The only reported Supabase branch is the default `main`, status MIGRATIONS_FAILED, project_ref equals production; there is no isolated development backend to deploy to. Do not reset it. Further migration diagnostic access is deferred.

`ai_open_budget`, `ai_update_budget` and `ai_test_reserve` are SECURITY DEFINER functions executable by authenticated users. Definitions were inspected: all gate on auth.uid and ai_test_allowed_users; update additionally checks ownership, expected budget and held exposure. Callers: archived scan UI opens/updates budgets; legacy Edge reservations use the quota function. Revocation belongs in production retirement after caller review, not ordinary UI engineering. Existing financial records remain intact. Live ai_test_reserve limits differ from checked-in benchmark limits (10/minute, 60/hour, 200/day, 40 Astra/day); no calls were made. [Advisor remediation](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable).

RLS-with-no-policy informational findings on ai_test_request_log and scan_quota_completion are consistent with internal-only tables; do not add public policies. [Remediation](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy). [Leaked-password protection is disabled](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection); owner must review plan/cost before changing it. cron.job does not exist, so no pg_cron jobs could be inventoried; this does not establish the absence of external schedulers.

## Verification limits

All 23 test files pass with the optional synthetic fixture generated locally by the existing Python author script. Restricted executor rejects synchronous process waiting despite the subprocess completing; EU_SYNTHETIC_SERIES avoids that wait without changing the fixture content. Syntax, static build and deployment allowlist validation pass. Browser launch and local HTTP serving are blocked by sandbox socket permissions. No browser result or deployment is claimed. CI must pass on the exact commit before staging promotion. Production/V1 are untouched.

Rollback: revert V3 frontend commits to the base above; preserve local exports before switching site versions. No database change occurred, so no database rollback is needed for this increment. Future raw-file deletion cannot be reversed by frontend rollback. Never restore obsolete authoring permissions as a side effect of a UI rollback.
