# Modular lessons — authoritative resumption checkpoint

Branch: `draft/v2-dmm-companion`. **Last verified implementation/staging: `2cb158085a6df8c7f7f6c263eb7b86bdcce12472`.** Primary CI **38630825370** passed **275/275 deterministic tests, all 19 Chromium suites and both real Windows Electron/Tauri jobs**. Read-back **38630825410**, job **116081684119**, verified build-info and all **73 served asset hashes** at **2026-10-14 20:23:14 UTC**. This following documentation commit cannot self-name: inspect actual HEAD and exact-SHA checks/read-back on resumption.

Starting frontend was 7dff598 (runtime 1684e51). Production main was read back unchanged at **741aa7cd690761d6e088b04fa656d4ad42e25e67**. No V1/production database, Storage, learner record, paid service or repository visibility was changed. Existing 33 approvals/336 questions, all 63 runtime lessons/542 questions, 67 widget capabilities, simulation, projects and progress remain intact. No legacy lesson route was replaced/deleted or regraded.

## Completed increments

- **537e683c392e4d4fcee84e0da0380fe2a1ae3a17:** separate Draft 2020-12 Schema V3 family (19 entity contracts + bundle), strict deterministic structural/reference/provenance/DAG validation, UUID identity/revision/hash separation; immutable content/scoped repository/search ports and private file adapter; complete reproducible inventory/ledger. Initial primary 38627664810/read-back 38627664591 passed.
- **7cbfbe1e89321cc95fb62e8df749c175fb045193:** deterministic assessment generation/evaluation, private immutable progress events/conflict-preserving merge/projections, neutral composition/presentation plans, partial private evidence extraction. Primary 38628705642 passed 273 tests/18 browsers/both shells; its Cloudflare/read-back failed, cause unavailable. It is historical failure, not current deployment status.
- **2cb158085a6df8c7f7f6c263eb7b86bdcce12472:** real semantic private Resistors/DMM drafts; exact assessment-template hashes/owner-revision uniqueness; typed host/service ports; private local classic/linear lesson review renderer and synthetic 320/390/1440 browser coverage. Current five-tab buttons, progressPie, platform labs and assets are reused. This increment closes the previous delivery failure without bypassing CI. Private build failure cause remains unverified.

Schema 1/2, original teaching assets and existing ProgressStore are unchanged. New code is under modular/, scripts/content, content/modular, tests/modular-*; family JSON mirrors modular/contracts.js. New modular code/drafts are not public frontend assets. The staging learner UI and 73-asset inventory remain unchanged.

## Coverage and state

`content/modular/legacy-inventory.json`: **63 lessons, 542 questions, 195 activity entries, 167 source-reference dependencies, 24 safety-critical questions**. Five bibliographic candidates, one known edition label, not five independently verified editions. All **967 mappings remain REQUIRES_REVIEW**, with no granted credit. Module byte hashes and grading/content fingerprints are recorded. Implicit activity-position inventory keys are explicitly distinguished from saved graded IDs.

Private structured-analysis extraction: **36 claims/18 locators**, all under review, all **11 original gaps** retained. Private pilot draft: **seven candidate canonical topics, nine claims, ten semantic blocks, five assessment templates, two lesson drafts, two sources/five locators**. One preparation topic/template is shared instead of copied. **Zero lessons fully migrated; zero owner-accepted graded pilots; no demolition allowed.** Known p.18 source discrepancy and unknown editions remain unresolved. Unavailable raw PDFs were not independently verified; no raw-deletion-safe claim is made.

Assessments: selectable static choice; deterministic finite sets/constraints, Ohm current/voltage, divider, series/parallel resistance and voltage-difference arithmetic. Exact instance/template/version/hash/seed stored; draft templates refuse grading. No arbitrary scripts/evaluator expressions or AI runtime calls. Events are private/in-memory only; no native durable progress adapter or cloud transport is activated. Either/both/no-required-lab policies keep platform/module versions independent and core grades common.

Private review UI: classic five tabs/progress pies and an independently identified linear profile, source citations, read-only draft questions and existing free labs. These are useful review tools, **not integrated graded lesson/practical pilots**. Owner content/usability review and actual lesson-specific module definitions remain pending. Transitional shared helper imports still need isolation before eventual legacy-specific demolition.

## Private artifacts and verification

Outside the repository: `/workspace/electrical-workbench-private-authoring/` contains source-1.bundle.json/coverage, modular-pilots.bundle.json/coverage and owner-preview/. Source bundle SHA-256 **54d001f285f3139ccaa8b70494d8a22f431337ab463c8607e09bb12f65981a19**; pilot bundle **509fe23f7fa2c7344435e5be403d456003b1e523d5ad178544655219143f185a**. Both were reloaded/hash-verified; files have mode 0600. Durable input remains unchanged in the original preserved structured artifact; developer scripts reproduce the new private exports. Never overwrite an interrupted exclusive export without inspecting it.

Owner review ZIP: `/workspace/electrical-workbench-private-modular-review.zip`, source commit 2cb1580, **89 files / 528633 bytes**, SHA-256 **74618d167e5482021b169126b9a79397813dc0482dd135291c3ed3e6189a169d**. Checked for blank backend config and no raw scans/secrets/progress. Serve site/ on loopback as README instructs; no GitHub/backend required. It is not an installer/APK. Copy private artifacts through an authorized private channel for long-term retention; do not publish them.

Real synthetic CI screenshots: `/workspace/electrical-workbench-modular-review/modular-classic-{320,390,1440}.jpg`; workflow artifact v2-visual-qa. They validate the renderer with synthetic content, not source-derived pilot visual acceptance. Images were inspected. Phone tab strip intentionally scrolls; review discoverability with the owner. Local browser attempt failed because the Chromium executable is absent; all claimed browser evidence is CI. Local check/test/build/allowlist pass; no local browser pass is claimed.

## Exact next steps

1. Inspect current local/remote HEAD/status and any later exact-commit CI/read-back; no repeat of foundation/pipeline audits. Last verified source is 2cb1580; check the following documentation commit rather than assuming publication success.
2. Review/refine the private semantic Resistors/DMM drafts against original EIM/Geier artifacts. Chapter 3 extraction is not substitute evidence for these pilots. Resolve edition/taxonomy/source discrepancies explicitly; preserve originals.
3. Implement validated lesson-specific desktop/mobile practical definitions and exact assessment instances/event integration, with private transactional persistence through modular/ports.d.ts. Preserve old grades; do not wire unreviewed templates into the learner application. Flesh out predictions/discussions/debriefs and real private pilot visual baselines.
4. Finish developer-controlled V3 publication/export/profile/registered-widget adapters, then preview approved artifacts and owner-test both modules. Current private preview is deliberately read-only for grading. Do not funnel V3 through the old schema-1/2 importer.
5. Implement developer/private-authoring IngestionProvider/retrieval/review and eight deterministic decision fixtures. No website source upload/generation or paid backend. Agent proposals never publish themselves.
6. Complete all remaining source/topic/assessment/legacy mappings and historical-progress round trips. Only after every documented demolition gate passes create pre-demolition tag/tested rollback, replace dependent routes and delete obsolete lesson-specific content/code on this branch. Current gate remains BLOCKED.

## Boundaries and rollback

Private Windows/Android portability is explicit: local approved bundles + host-neutral domain, separate presentations, native storage/identity/import adapters, no public GitHub runtime. Electron/Tauri selection, Android packaging/signing, native persistence and user-data migration remain future work. Do not provision cloud/sync or alter production credentials for convenience.

Approval still required for production release/data changes, paid infrastructure/AI, official installer/APK and historical grading-semantic changes. Development-branch lesson demolition is conditionally authorized only after full coverage/usability/rollback/staging gates. No additional destructive operation is authorized by this checkpoint.

Rollback now: revert additive modular development files/CI test entry, retain private bundles and original lesson/progress/project exports. Existing learner routes/data have not migrated, so no database downgrade exists. Do not delete conflicts or newer private artifacts. Before actual route/storage replacement, test both original backup restoration and new artifact/event round trips; a frontend rollback cannot restore separately changed database compatibility.
