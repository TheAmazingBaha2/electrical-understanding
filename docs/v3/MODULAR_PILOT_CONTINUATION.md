# Private pilot continuation — 2026-10-14

This is the continuation of the verified `9892147` baseline, not a replacement of its completed foundations. Production V2/V1, live progress and all old lesson/question IDs remain unchanged.

## Implemented increment

Schema V3 accepts optional prediction feedback, objective-linked assessment templates, fixed common review policy, and concrete `LabModuleDefinition` references. Old bundles and assessment instances remain accepted. Four/five-band arithmetic reuses the resistor color model. Practical rubric v1 verifies actual topology, source/component values, opens, probe contacts, meter mode/jack, isolation and prepared series-current state through the existing shared engine. Definitions reject contradictory expected divider readings and unrepresentable band codes. These are grading-capable rules, not learner approval.

The private candidate revision 2 retains all 69 original entities byte-for-byte. It has 139 total entities, 10 topics, 32 semantic blocks, 17 templates, four platform definitions and 16 independent activities. Resistors covers Ohm's law, four/five bands, tolerance versus uncertainty, series/parallel/dividers, dissipation and opens. DMM covers modes/jacks, reference/polarity, resistance, continuity, current preparation, resolution and troubleshooting. Shared preparation content is referenced, not copied. Both lesson identities and old revisions survive. Review policy remains 80% plus safety, with 1/7/21-day reinforcement; no real credit or changed legacy behavior.

Private artifacts, outside the repository:

- `/workspace/electrical-workbench-private-authoring/candidates-v2/pilots-v2.bundle.json`: canonical SHA-256 `3d3886255ca6beb0dd709af4bbf331cb2aa95f33e095dfcf5525599fa1c00e9d`.
- Adjacent `OWNER_REVIEW.md`, `coverage.json`, private developer `authoring.mjs`.
- Original source extraction hash verified unchanged: `54d001f285f3139ccaa8b70494d8a22f431337ab463c8607e09bb12f65981a19`.
- Original pilot hash verified unchanged: `509fe23f7fa2c7344435e5be403d456003b1e523d5ad178544655219143f185a`.
- Earlier recovery ZIP verified unchanged: `74618d167e5482021b169126b9a79397813dc0482dd135291c3ed3e6189a169d`.

These workspace paths are ephemeral. A new owner-downloadable recovery export is required before handoff; external durable retention is not yet verified. Never commit these bundles or real learner records. `scripts/content/private-review-sheet.mjs` produces owner-readable content/source/grade sheets using an exclusive private output path.

## Verification and remaining gates

Local syntax checks, 279 deterministic tests, build and deployment validation passed for this increment. Browser/native exact-commit CI and staging read-back are pending. No public assets were added; private candidates are not active staging curriculum. Unknown EIM edition, preserved-versus-verified references, the page-18 discrepancy and all previous extraction gaps remain unresolved. No raw page was reconstructed or independently verified.

Zero fully migrated lessons; zero approved graded pilots; all 967 legacy mappings still require review. The newer continuation brief additionally requires **owner approval of the exact V3 deletion scope**. No legacy demolition is authorized by this implementation. Full mapping, accepted usable pilots, credit-equivalence review, immutable backups, rollback rehearsal and passing tests remain required before that approval.

## Next steps

1. Add host-port durable private storage with CAS, identity binding, conflict preservation, export/import and recovery; keep practice separate from mastery.
2. Integrate actual platform rubrics and reproducible practice into both private profiles, using synthetic graded fixtures only.
3. Add deterministic ingestion proposals and developer publication approvals; never promote drafts automatically.
4. Verify desktop/320/390 browser and Windows prototypes against the exact source commit; export private owner review and checkpoints.
5. Obtain source/technical/educational/owner acceptance before real grades. Complete reviewed legacy mappings and exact deletion-scope approval before demolition.

Rollback: revert new modular files/contract extensions on the development branch and reopen the preserved v1 private bundle. No live schema, old progress or production state was modified. New private records must retain their original reader/export when rolling back storage code.

## Durable learning and private interaction increment

First increment `ca4820435f936fd641880e3b5883fae965a42731` passed primary CI 38637943799 and exact-commit staging read-back 38637943737 (job 116105815823). The subsequent increment has 286 deterministic tests passing locally, plus `npm test` (46 files), syntax/build/allowlist checks. Its browser/Windows checks are pending until the exact commit is published.

Implemented private host adapters: IndexedDB read/write transactions with revision comparison, and optional Node filesystem storage with exclusive locks, atomic replacement, fsync, owner-only files, pre-write backups, hash/identity validation, retained stale candidates and explicit recovery. Interrupted locks fail closed; no database is reset. File recovery is exportable; existing malformed primary data is never silently replaced. No production-origin storage is copied. Native transport is not wired into either prototype; actual Windows file tests are added to CI. Filesystem power-loss guarantees still depend on the host/OS. History currently retains full documents and backups; compaction is deliberately deferred rather than deleting history.

The private learning journal stores exact template/instance/hash/seed/parameters, actual lab submissions and versioned definition snapshots, answer/result/time, safety semantics, approval hashes and review scheduling. Practice cannot produce grade events. Graded starts require a publication matching exact content/grade hashes, rights/edition/locator decisions, technical/educational/owner approval and registered platform definitions. Only synthetic fixtures exercise that path. Disputed answers retain both versions and contribute no disputed credit. Old revision results remain readable; new revisions start independently. Core remains shared and either platform can satisfy practical completion.

Both private presentation profiles now render predictions/discussions and the same functioning practice and independent practical adapters. Desktop reuses the complete existing bench. Phone uses bounded band-code and meter/isolation/series exercises with shared assets, solver and ProjectStore. Experiments are scoped away from ordinary projects and progress. Precision remains optional. Profile switching/reload preserves private instances; private recovery export/import has explicit identity switching and never merges two learner identities automatically. Learning recovery does not include device layouts or all project files; use existing project export separately. The public 73-asset staging application is unchanged; these files remain developer/private-preview tools.

Next: verify the new UI with synthetic 320/390/desktop browser tests and Windows jobs, finish deterministic ingestion/publication export, produce an updated private recovery archive and owner acceptance checklist. All source/educational/owner gates and all 967 migration reviews remain pending. No approved graded pilot or completed legacy migration is claimed.

## Ingestion/publication and browser correction increment

Durable-learning commit `9acb44c559d5f6423f24cc10ec76b7c91fae0c4b` passed deterministic checks and both Windows jobs (including actual Windows file persistence), but its browser check exposed an explicit-mode default missing from the phone adapter. Its browser check failed at the default 30-second wait; it must not be called a successful full CI/deployment. Local browser verification with the installed headless binary reproduced the failure. The correction stores explicit default function/jack values without changing shared measurement calculations. Status read-back lagged actual job completion. Explicit per-operation/suite/job bounds and normal workflow concurrency are retained; the temporary obsolete-run cancellation helper/write permission is removed. Further local browser runs remain limited by sandbox network/IPC permissions; exact-head CI is required.

`DeterministicIngestionProvider` now implements all eight private decision fixtures, explicit-source validation, exact title/alias/claim comparison, ambiguity/conflict deferral, context/input hashes and human-readable content/grade-impact proposals. It applies no canonical change or credit mapping. Split/merge/new-lesson proposals require supplied identities/objectives; they are not verified semantic decisions. `publish-reviewed-bundle.mjs` exports local reviewed immutable files/manifest/rollback metadata with `activated:false`; private draft revisions are rejected from learner exports. See [PRIVATE_LEARNING_WORKFLOW.md](PRIVATE_LEARNING_WORKFLOW.md). This is implemented tooling with synthetic tests, not owner approval of the real pilots.

Follow-up `b5954162dbb835b63a60d74cb42aff13cb4a5a83` passed both Windows jobs and deterministic checks; browser CI then rejected a test selector matching both the function dial and its matching mode button. The test is scoped to the dial's choice buttons; no instrument behavior changed for that correction. This commit also must not be called fully verified. The next source increment additionally moves all browser presentation into `hosts/private-lesson-preview.js`, tests the full host-neutral domain dependency graph, handles conflicting valid attempt-start snapshots without losing other results, rejects invalid journal imports before activation, verifies existing file backups, and exports all 63 original lesson objects plus byte-exact original modules privately. That preservation is not semantic migration: all 967 dispositions and original source gaps remain unresolved.

`b1bfd5c699cb7cda9921663e2e1298200a1aa904`: 292 deterministic tests and both Windows jobs passed, including private file storage/domain portability. Phone browser practicals passed at 320/390px. Full browser CI failed on desktop's capture of the same optional meter defaults. The following adapter-only correction records the actual default V/VΩ settings for new snapshots; existing projects, rubric v1 and historical result evaluation are unchanged. A focused test compares readings and verifies wrong-jack current remains blocked. Full exact-head verification is pending for that correction.

Active private candidate **2.1.0**: `/workspace/electrical-workbench-private-authoring/candidates-v2-1/pilots-v2-1.bundle.json`, canonical SHA-256 **fc10bbef75a0c31795a7d8a7a35b279d108619b08d1d46bc932f6a95099ba1bb**. It contains 149 entities, 10 topics, 32 blocks, 18 template identities/23 immutable template revisions, six historical/current lesson revisions and the same four modules/16 activities. All 139 v2 entities (therefore all 69 v1 entities) remain unchanged. New template versions/objective links and a nominal-value check close objective coverage: all nine Resistors and five DMM objectives have assessment/practical coverage, without adding credit or resolving source gaps. Both latest lessons remain drafts. Approval must use new reviewed/published revisions, never flip the status of an already stored immutable draft at the same ID/version. No source, technical, rights or owner approval is implied.
