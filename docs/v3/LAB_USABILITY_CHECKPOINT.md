# Laboratory usability continuation

Active continuation from `e6114639f2eec377a13aab1af86bc82f3e68b8ac`, on `draft/v2-dmm-companion`. Read this before the historical modular checkpoint sections. Baseline exact-head primary **38646672608** and staging read-back **38646672584** were rechecked as successful. Working tree was clean. Private candidate 2.1.0 and every old lesson/project/grade remain unchanged.

## Owner instruction and boundaries

The attached combined sprint brief supplies proposed engineering tasks and reported feedback. It does not independently establish source verification, completed tests or new approvals. The subsequent direct owner instruction **approves the current draft lessons for grading and deletion**. It is recorded privately against candidate 2.1.0's exact canonical hash `fc10bbef75a0c31795a7d8a7a35b279d108619b08d1d46bc932f6a95099ba1bb`. Do not ask for the same grading permission again. Technical/educational/source-rights attestations were not invented; the immutable draft entities have not been changed or activated. Prepare approved immutable successors only after those checks pass.

Deletion authorization is recorded, but no exact file/record scope was supplied. Establish replacement/mapping coverage, dependencies, a concrete deletion manifest and tested recovery before removing anything. All 967 semantic mappings remain pending. No production/V1/database/storage/real-learner deletion or release is inferred. Existing grading semantics remain unchanged.

## Milestone 1: measured desktop workspace

Actual local Chromium reproduction against the preserved private ZIP:

- At **1650×900**, private `#main` is already full width (1650), stage 1626. A real meter-title drag reaches the right border (1px border gap). The reported 1650px drag boundary was **not reproduced** with this artifact; do not attribute it to a `main` cap in the private preview.
- At **2560×900**, stage 2536, meter right edge stops at 1813, leaving **735px unreachable**. The window controller's 1800px cap is confirmed. Ordinary app `main` separately retains a 1200px maximum. Initial fixed window geometry leaves unused space even where drag works.
- Original preferred geometry was destructively fitted on resize; keyboard movement had separate hard limits. Pointer deltas assumed screen pixels equaled stage CSS pixels.

Implemented: actual measured stage projection, responsive docking, no fixed workspace maximum, local pointer conversion including border/scroll/scale, ResizeObserver, viewport expansion/return, all existing handles/actions and device-local saving. Temporary shrink/zoom does not overwrite a preferred free layout. Default right dock occupies the actual right side. No project/circuit/assessment migration.

Local validation: syntax, 49 test files/**296 direct deterministic tests**, build and 73-asset validation passed. Targeted desktop workspace browser test passes at 1280×720, 1440×900, 1650×900, 1920×1080, 2560×1080, 768px shrink/recovery, DPR 1.5, CSS transform and zoom. Existing desktop and private modular browser suites pass, including 320/390/1440 and synthetic approved independent grades. An initial minimize regression in dock projection was detected and fixed; no failed result is counted as a pass. Windows and full branch CI/read-back for this increment are pending until verified against its actual commit.

Next: exact contact fidelity, then lesson-specific minimal/guided starts and private immutable pilot revisions. Inspect current HEAD/status and exact-SHA CI before assuming an interrupted operation completed. Do not repeat prior foundation audits.

## Private recovery

Original `/workspace/electrical-workbench-private-pilot-v2-review.zip` retained unchanged: 440 files, 3,006,565 bytes, SHA-256 `ab780698deb8e4f28719d54773cbc0443f37198193b97005e166077e5a65f957`. ZIP integrity and **all 439 inner file hashes reverified**. Owner reports local review; external durable backup remains unverified. New tested UI needs a separately named private preview/archive, never overwrite the old one or publish private source-derived drafts/learner data to staging/CI.

Rollback: revert the additive presentation changes, retaining device layout records and all private originals. Layout schema/key remain v1. No database change occurred. Older UI may clamp a wide layout; export/retain the device preference before downgrading. Production compatibility cannot be restored by a frontend rollback after unrelated database changes.

## Milestone 2: exact contact interaction

Shared `probeContact`/`withProbeContact` helpers in the existing pure circuit model distinguish connected, detached, invalid and historical node-only state. New edits explicitly version the contact contract. Canvas and breadboard preserve the actual terminal/hole, including equivalent copper points; explicit stale/mismatched contacts never teleport. New-version measurements block invalid contacts; historical snapshots without that contract retain their original reader behavior. No electrical solver or old graded scenario was replaced.

Implemented real screen-space snap previews, forgiving handle/tip drops, cancel/Escape restoration, wire-end grips and keyboard/click rerouting, explicit detach/reattach, undo and saved contact restoration. Breadboard clear now actually switches power off and detaches probes, with prior state retained for Undo. Phone keeps its own large, nonoverlapping tap contacts, explicit terminal/node metadata, red/black selection, detach/cancel and signed readings. Current remains the separately prepared ideal series-branch adapter, with parallel leads hidden in the phone schematic.

Local checks: **301 deterministic tests / 50 test files** pass, including five new contact tests. Existing desktop, breadboard, shared-meter, phone and modular browser suites passed during implementation. New real-event contact suite passes desktop and phone 320/390/768: correct and reversed polarity, same node, invalid/canceled drag, physical snap, curved-wire stroke hit/reroute, detach/undo/reload and saved graph correspondence. One touch failure was real: text inside an SVG button shifted its bounding-box center outside the round contact. Labels are now separate from the exact 56-unit contact target; tests use real taps without force.

Milestone-1 commit **2240b87c0435f3df57d89a610dda08e862dbe272**: primary **38674509371** passed checks, all 20 browser suites and actual Windows Tauri. Windows Electron passed the lab/UI checks, then the newly added test's reload callback incorrectly waited for a lab on the default dashboard; the overall run failed and was not staging-ready. The callback now navigates back to the lab, matching normal app behavior. The following contact increment must pass its own full CI and read-back before deployment can be claimed.

Remaining highest priority: lesson-specific blank/minimal/guided starts, prediction/measurement/debrief cycles, clearer desktop band exercise adapter, new immutable private pilot revisions and review/packaging. Real 2.1.0 entities remain unchanged, owner grading authorization retained, other technical/source attestations pending. No legacy mapping review/deletion, source verification, real grading activation or production change has been performed.
