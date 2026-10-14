> Follow-up acceptance status: a documentation-only rerun at 3854e524 exposed an intermittent project save/switch/delete race that earlier full gates missed. A reliability fix and delayed-lock browser acceptance are now in progress; inspect CHECKPOINT.md/current exact-head CI before treating the latest branch as ready. The earlier deployed feature commit and verification below remain historical evidence, not a claim this later race had already been fixed.

# V3 laboratory continuation — October 13, America/New_York

This report supersedes the original foundation's deferred-feature and pending deployment statements. Development stays on `draft/v2-dmm-companion`; production, V1 and paid services were not changed. The existing 33 approved lessons, 336 question IDs, original widget catalog and learning-progress system are preserved.

## Delivered working features

- Reusable reviewed activity data, validation and presentation; ten-step voltage-divider guide with objectives, component/path explanations, prediction, probe tasks, ratio changes, open/floating troubleshooting, hints, navigation and resumable Guided/Free modes.
- Stable-ID snapshot save/list/restore/rename/confirmed delete, duplicate names and timestamps; deletion leaves the active circuit and notes intact. Revision conflicts preserve both copies and selected prior versions remain exportable. New snapshots include component inventory; older snapshots remain readable. Restoration applies only experiment slots; stored annotations cannot override project identity/metadata/snapshot collections. Storage identity/key disagreement fails safely with original bytes preserved.
- Editable shared-model breadboard with 12 rows, correct five-hole strips/center gap/split rails, sources/resistors, placement/move/remove, values, wire connect/reroute/remove/open, large tap controls, keyboard operation, undo/redo, saved configurations, topology overview and direct-node highlighting.
- One shared multimeter for actual DC voltage/polarity, source-off equivalent resistance, continuity and explicitly prepared ideal series current. Wrong jacks/live ohms/unprepared current are blocked. Existing graded meter lessons retain their prior behavior.
- Scope foundation with actual constant shared-DC observations, clearly separate sine/square/triangle demonstrations, independent probes, voltage/time scales, amplitude/offset/frequency/period, basic rising-edge trigger and sampling warnings. Shared scope traces clear on invalid circuit states.
- Multiple personal projects with naming/descriptions, browsing/search, duplication, three templates, notes, component inventories, settings, measurement records, JSON import/export, exact local reopening and recoverable deletion. Stale tabs cannot resurrect deleted projects. Final queued saves survive navigation DOM replacement.
- Pure future cross-device envelope/three-way merge contract, with safe independent edits and full conflicting copies. No transport/backend is enabled; workspace layouts remain per-device.

The original 62 registered capabilities remain; only the reusable breadboard and scope required new entries (64 total). Existing DMM housing, circuit SVG frame, breadboard hole art and workshop scope plot are reused. The original lesson engines/calculations/grading/progress are not rewritten.

## Commits and verification

| Milestone | Verified commit | Primary CI |
| --- | --- | --- |
| Guidance and snapshots | `6a318473da73a955132386498a4a6731d2b35b89` | `38497766691` |
| Editable breadboard | `2be1157bc87f9cf15ae9f273bb1bdc921692d62b` | `38499569455` |
| Shared multimeter/sync/read-back | `1bc63d9697b7744c8596ca50829f15543600f800` | `38500782371` |
| Scope foundation | `9f22d07c68a0d5754086f8104be11796fbb6bf49` | `38501749625` |
| Personal project manager | `3b4e81351e0b84df58870d7751238635f8dce70b` | `38503196352` |
| Board/restoration/navigation/safety refinement | `83514078ed0e882a9caefa4f1e986de2ae6781d9` | `38504719822` |
| Identity protection and complete milestone report | `fe98a265ef146e2b3d2fea599e8f76a35f789042` | `38505263470` |

Project-manager read-back `38503196301` verified build-info and all 58 served assets. The subsequent breadboard/restoration/navigation refinement is `a24d9a7ca8f70efc1254217048ea807202b3b967`: local 238 deterministic tests, all 32 test files, syntax/build and 59-asset allowlist pass. Primary CI `38504179960` found a route-helper race after awaited final saves; the other 13 suites passed. Read-back did not certify that failed commit. The follow-up helper waits for route completion and additionally detects reference-free active source shorts with readable part/wire labels. Commit `83514078ed0e882a9caefa4f1e986de2ae6781d9` passed all 14 browser suites and read-back `38504719805` verified build-info/all 59 served assets. Its local count was 239 deterministic tests. The final identity-protection commit `fe98a265ef146e2b3d2fea599e8f76a35f789042` passed 241 deterministic tests, all 32 test files, syntax/build/allowlist, and all 14 browser suites in primary CI `38505263470`. Read-back `38505263515` verified its build-info and all 59 served assets. Those exact runs had no failures; a later documentation-only repetition exposed the project transaction race described above. Earlier browser failures were corrected selector/wait issues; the verified milestone runs above all passed. No local Chromium pass is claimed because sandbox sockets are unavailable; real desktop/phone checks run in CI with external requests blocked.

New/changed source groups: guided-activities/lab-guidance/view and circuit-view; breadboard-model/view/overview/project; shared-multimeter; scope-signals/view and existing workshop plot adapter; project-store/manager/sync; electronics-workspace/styles; schemas/catalog/queue; exact-commit read-back workflow/tool, asset allowlists and focused unit/browser tests. See git diff from `7a4c161` for complete file changes. Developer lesson publication remains LESSON_PUBLICATION.md and content/lesson-package.schema.json; preserved assets remain content/approved and approved-lessons.js.

## Owner checks on staging

Use disposable local projects on https://eu-v2-staging.vanguardcorbett.workers.dev/ from a desktop and phone. Do not import official learning progress just to test.

1. Open Electronics Lab → Divider → Guided Experiment. Predict, measure source/output, change R2, disconnect R1, then both resistors. Confirm state-specific 5 V/ratio/0 V/UNKNOWN explanations. Free Experiment should remain available and saved guide position should resume.
2. In Project, save two snapshots with the same name. Rename/restore/delete one; cancel a deletion once. Check remaining snapshots, circuit and notes after reload.
3. Choose Editable breadboard or create a blank template. Select holes to inspect directly connected copper; place a source/resistors, connect/reroute/open wires, move/remove parts and undo/redo. Confirm large tap targets, visible open states, and consistent meter values. Shorting an ideal source must refuse a shared reading rather than invent one.
4. Test voltage polarity, power-off resistance/continuity, and power-off preparation of a current branch before switching power on. Select the proper jack. These are ideal simulated measurements, not hardware operating instructions.
5. Compare shared steady-DC scope and independent demonstrations. Change scales/frequency/trigger; float the DC probe and confirm no inferred trace. General AC/transient circuit behavior is not supported.
6. Create/describe/duplicate/search projects, record a measurement, delete to recovery, restore, export/import a local project and reload to confirm saved state. Test offline edits while the app is already loaded, then reopen after connectivity returns. Test editing notes immediately before leaving the lab. Project IDs, notes and snapshots must stay independent of lesson grades.
7. Browse Chapter 3, original workshops and archived material on both devices; confirm references, five tabs and saved quiz behavior. Major widget acceptance is still owner testing, separate from automated checks.

## Limits, approvals and next work

The board is a compact electrical graph editor, not a mechanical breadboard or unrestricted parts library. Only positive resistors and ideal DC sources are modeled. Meter loading/fuses/burden/ratings, scope bandwidth/noise/multichannel comparison and general transient/AC analysis are deferred. Docking/resizing, attachments/sharing/third-party formats and transport are not delivered. Saving requires browser locks and available local storage; clearing site data removes local projects, so export important work. Local recovery is not a cloud backup. Saving works with an already loaded app during outages; an initial load/reload without connectivity is not guaranteed because the fully cached offline app shell is deferred. Safe merges are conservative when both copies alter experiment state. Engine research remains documented in SIMULATION_AND_PROJECT_FOUNDATION.md; no SPICE/WASM engine is integrated.

Three reviewed improvement proposals are queued for breadboard activities, versioned instrument realism and scope channels. No automatic behavior update is enabled. Next implementation: owner usability findings, then reviewed board activities and shared-timebase scope comparisons; investigate bounded transient integration separately. Existing graded semantics require explicit approval before changes.

Read-only Storage inventory verified the reported raw PDF absent and zero nonempty objects; one zero-byte folder placeholder remains. RAW_SCAN_CLEANUP.json is aggregate-only. No raw scan was downloaded, backed up, re-uploaded or deleted here. Bucket retirement still needs authorization. Previously reported production security/database advisories remain deferred, not fixed by this frontend work; see PHASE1_AUDIT.md. No new database investigation/reset/migration was performed. Historical public source-derived exports remain unchanged; broader content/history exposure decisions need owner review, not silent removal.

Separate PR #4's obsolete scan-link test was fixed at `5718c99b19005b0119870ea2e4fdb5d1c03b1f94`; run `38496606032` passed. It is not merged. Approval is still needed for any production release/maintenance merge, destructive Storage/database operation, new isolated backend/costs, paid tutoring or incompatible/graded widget change.

Rollback: export important project JSON and saved conflict/recovery copies before changing frontend versions. Revert only the relevant V3 commits or use a known approved staging revision; rerun exact-head CI/read-back. Preserve all project keys, including newer widget records that older frontends may reject safely; never delete them to make rollback appear clean. No database rollback is needed for this session. Frontend rollback cannot undo historical production Storage/policy changes made separately by the owner. The latest exact checkpoint remains authoritative for resumption.
