# Electrical Workbench V3 foundation — 2026-10-14

Implemented authorized Phases 1–4 and completed automated Phase 5 acceptance. Owner acceptance, live staging read-back and production cleanup remain pending. No production/V1 mutations, paid AI calls, destructive operations, backend creation or production deployment occurred.

## Branch and tested commits

Branch: `draft/v2-dmm-companion`; production `main` was not changed. Upstream base: `9c63daf8585f110c5714e0315c70659e1e75f97d`.

- `24f14a701ff7cb63eac276fd65ef0a6a0d6ec89e`: retire V3 authoring and preserve approvals.
- `a199ddbed04057fdbbf26666cafbcc3fef0f73f0`: external lesson packages and reusable widget registry.
- `38e883c016774385866e763e2c449bae8b5f89dc`: shared DC circuit, adaptive workspace and local projects.
- `5fdcfae82c1d2c00bd0d1a8577aa1b1f9c8038ec`: acceptance/checkpoint documentation.
- `72bff3118ae711384bb8c0937eac16cf41a07331`: browser selectors scoped to preserved collections; last fully verified implementation head.

Initial checkout was reconstructed through GitHub because shell networking/socket access was unavailable. All original blobs and tree matched upstream. Remote commits use exactly the tested local trees; local history was subsequently reconciled with canonical GitHub objects. The original local verified lineage is retained at `archive/local-verified-foundation`. Documentation following the tested head records results; inspect current branch/CI before any staging promotion.

## Changed source and reuse

Application integration: app.js, index.html, ai-chat-widget.js, generated-library.js, lesson-tabs.js, styles.css. Build/QA: package.json, scripts/build.mjs, .github/workflows/v2-checks.yml, deployment validation, historical authoring test paths and affected browser fixtures. dmm-widgets.js and lab-visuals.js expose their existing instrument/frame graphics without changing existing scenarios. Active Edge source for scan-lesson-pipeline and ai-model-lab is replaced by HTTP 410 tombstones, not deployed.

New modules: approved-lessons.js, published-lessons.js, data-contract.js, lesson-package.js, widget-registry.js, widget-improvements.js, circuit-model.js, project-store.js, electronics-workspace.js and tutor-contract.js. New content: approved export/inventory, lesson/circuit/project JSON Schemas and improvement queue. New developer tools: scripts/content/preserve-approved.mjs and publish-package.mjs. New focused tests: preservation-retirement, v3-publication, shared-circuit-project and v3-browser. Reports/checkpoint are in docs/v3.

Reused: existing five-tab engine, lesson views/overview/prediction and quiz logic; learning-structure/source-navigation/dashboard placement and page references; ProgressStore/local backups/cloud revision/conflict handling and schedules; workshop assessment/control persistence; DMM SVG housing/display, circuit SVG frame, original breadboard interaction; all math/lab/CET renderers; generated-simulations calculations/controls/plots. No existing widget physics or grading was replaced.

## Authoring retirement and lesson preservation

Scan Inbox/upload UI and AI benchmark frontend are quarantined under archive/authoring; app navigation/imports and public asset allowlist exclude them. Historical backend source remains there for audit/tests. V3 reads approved repository assets without scan-table access. Tutor interface/launcher movement/context code remains, with all legacy gateway dispatch removed and authorization forced false. The active backend tombstones reject every legacy action without reading credentials, database/storage or providers. V3 has no backend configured. Production functions/policies remain live pending explicitly authorized retirement; hiding buttons is not represented as production backend retirement.

`content/approved/source-jobs.json`: exact structured read-only export of the one approved source, revision 61, including original unknown fields, references and technical approvals. No raw file, owner identity/path, learner answers or tokens are included. Original 16 units render as 12 source lessons plus 4 reinforcement lessons; curated series adds 17 lessons including summary. Total 33 renderable lessons and 336 question IDs. `inventory.json` fingerprints source/quiz data and records placement/prerequisites/activities. `approved-lessons.js` exactly equals the preexisting adapter output; archived organization, supplemental legacy IDs, grading rules and five tabs remain intact. No paid regeneration or conversion to static HTML occurred. Existing data is not rewritten through new-package validation.

## Raw cleanup and current production evidence

`RAW_SCAN_CLEANUP.json` identifies the sole current 3,312,722-byte private PDF and its approved source job; ownership/path/size match. Approved rendering uses structured data, not the binary. Required structured educational results are preserved, and tests verify rendering/IDs/references/activities. No raw backup was downloaded or created.

Deletion status: pending owner approval; zero deletions performed; absence not claimed. Production recheck still shows one raw object, 8 progress records, 38 history records and source revision 61. The bucket is private, with 5 MB file limit and PDF/image MIME types. Exact raw-only Storage API deletion, fresh absence verification and any empty-bucket retirement are future approved operations. Do not use whole-job deletion. `PRODUCTION_RETIREMENT_PLAN.md` separates gateway/write-policy/RPC changes from raw cleanup and protects runtime SELECT access, progress and financial/attempt history. No tables were dropped.

## Publication, registry, simulation and projects

Lesson contract: `content/lesson-package.schema.json` and lesson-package.js; workflow in LESSON_PUBLICATION.md. Explicit supplied owner-approved JSON is imported by a developer, validated, compiled and reviewed in git/staging. Supports flexible objectives, sections/examples/checkpoints/activities, multiple widget references, source evidence/pages, quizzes/safety/grading, curriculum, prerequisites and review rules. Scripts/HTML are not executed. Unsupported versions/configurations and duplicate stable IDs fail. Human technical review is still required; metadata is an approval attestation, not authentication or independent correctness certification. No new real lesson package was published.

Registry: 62 versioned entries covering existing DMM, lab/breadboard, math, CET, deterministic simulations and workshop methods, plus shared circuit/DMM adapters. Metadata exposes capabilities, assets, limits, contracts, difficulty, compatibility/dependencies and regression requirements. Existing native workshop/shared-model entries are cataloged, but package import deliberately rejects adapters not yet supported. Default existing controls are reused; unrestricted authored configuration is not accepted. Refinement queue preserves suggestions, priorities, affected content/projects and compatibility/testing requirements; critical safety/correctness first, ordinary work batched, behavior changes owner-reviewed.

Shared circuit: bounded ideal DC MNA, stable serializable nodes/terminals/components/wires/power/fault/probes, same state across circuit view and DMM. 5 V divider → 2.5 V output and 2.5 mA; open R1 → grounded output 0 V; fully isolated output → unknown. Polarity/current/KCL/energy and numerical parameter sweeps are tested. Same engine serves all difficulty/presentation modes. ngspice README/shared C interface were researched as a later candidate; no SPICE/WASM integration or license/performance acceptance is claimed.

Project foundation: own versioned schema/store, browser-lock/revision local saving, conflict copies, notes, widget settings, measurements, snapshots/restoration and JSON import/export. Layout is local and separate; lesson progress is untouched. Desktop compares instruments; phone focuses Circuit/Meter/Project with native touch-friendly selectors. One-project shell only; no cloud sync. Future tutor contract limits context, excludes notes by default, validates proposals, previews, requires explicit approval and returns undo; no AI backend or paid call exists.

## Verified tests and interface results

Local: 218/218 tests passed; all 25 test files passed through npm test with the optional synthetic series generated by the unchanged Python author script. npm run check/build and node tests/deploy.validation.mjs passed. The optional fixture works around restricted synchronous child-process waiting; normal CI uses the original fixture path. Local sockets blocked browser/server launch, so actual interface verification used GitHub's Chromium environment.

[Exact-commit CI run 38491800538](https://github.com/TheAmazingBaha2/electrical-understanding/actions/runs/38491800538) completed successfully at `72bff3118ae711384bb8c0937eac16cf41a07331`. Both checks and browser-smoke passed. All nine browser suites passed: sidebar, dashboard, source, workshops, original browser smoke, persistence, V3 workspace, math and adaptive. Desktop/phone checks include 320/390/1440px, touch panes and resizing, no horizontal overflow, navigation/modules, all 37 curated activities, stable quizzes/answers, progress imports/conflicts/backups, snapshot/local restoration, open/floating state and disabled tutor with zero external requests. [Visual QA artifact](https://github.com/TheAmazingBaha2/electrical-understanding/actions/runs/38491800538/artifacts/11861629468).

Build explicitly publishes 47 assets plus build-info. Authoring archives, source export, tests, schemas/docs/financial data are not public bundles. URL/key are empty and backend gate is false. The historical production project identifier remains only as a progress namespace, not a configured endpoint/credential. No service-role or private key is shipped. A built local preview ZIP was created in /workspace/electrical-workbench-v3-preview.zip from this exact tested implementation. Cloudflare deployment/build-info/live read-back is NOT verified; do not claim staging publication or production promotion.

## Security/database limits and rollback

Supabase default branch still reports MIGRATIONS_FAILED, points at the production project and was last updated Oct 11. Read-only history shows 15 migrations applied through Oct 13, with several version identifiers differing from repository filenames. This later successful schema history does not resolve the original setup failure or justify reset/replay. No isolated development branch/backend is available. Keep diagnostic/repair work separately reviewable; never reset production or create a billed branch without approval.

Three authenticated SECURITY DEFINER functions were inspected and callers traced: budget creation/update and quota reservation. Each checks owner allowlist/auth.uid; update checks ownership/expected value/held exposure. Active production callers must be retired before revocation. Advisors also show two internal RLS/no-policy tables and disabled leaked-password protection. Remediation links and rationale are in PHASE1_AUDIT.md. cron.job is absent; external schedulers were not proven absent. Historical scan-specific CSS remains inert and can be pruned in a later presentation-only batch. No security fix is falsely reported as applied.

Rollback: revert V3 commits or an explicitly authorized staging version to the base; preserve local progress/project recovery exports first. No database downgrade is required because no DB changes occurred. Existing IDs/progress remain backward compatible. Keep schema-v1 project storage when returning to an older frontend. Future raw deletion or policy changes cannot be undone by frontend rollback. See ACCEPTANCE_AND_RELEASE.md for owner tests and boundaries.

Still requiring approval: production gateway/policy/RPC retirement; exact raw-only deletion; empty bucket retirement/destructive migrations; any development backend/cost; paid tutor enablement; behavior/grading changes to existing widgets; production release. Deferred: physical breadboard editing, oscilloscope/transients/realistic loading, dockable/resizable panels, multiple projects/templates/attachments/sharing, cross-device sync/merge UI, broader package adapters and separately budgeted tutoring.
