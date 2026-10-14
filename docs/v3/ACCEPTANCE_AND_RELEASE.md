# V3 owner acceptance and release boundaries

Implemented foundation: authoring retirement in V3, approved lesson preservation, external structured-package publication, reusable widget catalog/queue, shared DC simulation, adaptive circuit/meter/project panes, local saving/snapshots/recovery, constrained future tutor proposals. Existing lessons, workshop logic, grading, stable IDs, local/cloud progress contract and review schedules remain compatible.

## Acceptance after successful exact-commit CI

- Open isolated V3 staging on desktop and phone. Confirm local practice banner and no cloud/AI access. Do not import official production progress merely to test development.
- Browse Exam Prep → Associate CET → Chapter 3. Confirm 17 curated lessons including final summary, printed-page references and all five tabs. In Account → Archived study material confirm the 16 original Legacy source/reinforcement lessons remain available.
- Open existing Geier/DMM workshops and lab/math exercises. Confirm original instrument graphics, interactions and quizzes; use disposable local practice only.
- Open Electronics Lab. Both 1 kΩ resistors: source-to-common 5 V, output-to-common 2.5 V; swap probes for negative sign. Open R1: output 0 V. Open R2 as well: output unknown. Restore a named snapshot for exactly 2.5 V again.
- On phone select Circuit/Meter/Project panes and use probe selectors without tiny drag targets. Check 320/390px widths, long notes, keyboard focus and no horizontal overflow. Desktop compares circuit and meter simultaneously.
- Save notes/snapshot, navigate away, reload and restore. Export/import project JSON and recovery copies. Confirm lesson grades remain independent. Unsupported schema/version or corrupt storage must preserve the original and display an error.
- Tutor interface may be inspected through controlled test fixtures; it remains disabled and cannot send a paid call. No new AI backend exists.

## Explicit owner approvals still required

Production function retirement and write-policy/RPC changes; raw-only deletion of the exact manifest object; empty bucket retirement; any destructive migration/table drop; new development backend and expected costs; paid tutor/backend/budget enablement; behavior/grading compatibility changes to existing widgets; production release. No production cleanup is complete. No schema reset or branch creation occurred.

## Rollback

Keep progress/project exports before changing site versions. Revert only the V3 commit series or point an explicitly authorized staging release to 9c63daf8585f110c5714e0315c70659e1e75f97d. This increment has no DB mutations, so no DB downgrade is needed. Repository lesson preservation artifacts remain recoverable from commit history. Existing lesson progress retains the original identifiers and schema. Project local data has its own schema and recovery export and is not understood by older frontends; do not delete it during rollback. Frontend rollback cannot reverse any future production object deletion/policy change.

## Remaining work

Owner acceptance and deployment read-back; production cleanup approvals; fuller package adapters for native workshops/shared instruments; realistic DMM loading/ratings/tolerances; breadboard connectivity editor; oscilloscope/transient engine adapter; dockable/resizable desktop workspace; multiple project browsing/templates/attachments/sharing; cross-device sync and conflict resolution UI; independently budgeted tutor backend. External schedulers and failed Supabase migration diagnostics need additional evidence. Advisory fixes stay separate from ordinary frontend work.
