# Desktop/mobile laboratory continuation report

Development branch: `draft/v2-dmm-companion`. Tested source: **1684e516a81a46b17cdd128bec748dc721e6ec49**. This implements the requested desktop-first prototype and additive dual-lab architecture. It does not declare the complete redesign or a permanent Windows shell accepted.

## Implemented

- Separate Desktop Lab and purpose-built Mobile Lab modules. OS detection selects the normal module; a device-local manual override supports testing/preference. A narrow Windows window stays Desktop Lab. Existing responsive workspace remains available for compatibility.
- Schema-2 lesson packages support independently versioned `labs.desktop` and `labs.mobile`, distinct activity IDs, results, attempts, completion and grade counters. **Either** practical module satisfies the new practical requirement; the other is optional practice. Shared core quizzes remain required and their IDs/grades are not duplicated. Schema 1 and all historical workshop requirements remain accepted. No existing approved lesson was retrofitted.
- Freeform desktop resistor/DC-source canvas with direct placement, movement/keyboard adjustment, explicit terminal wires, reference selection, opens/removal and undo/redo. The existing graph/solver computes measurements. Saved geometry, physical probe contacts and history use backward-compatible project extensions.
- Draggable/snappable red and black probe ends retain the selected actual terminal, including equivalent contacts on the same node. Clear/removing a contacted part marks it unattached and refuses a fabricated reading. Undo/snapshots restore connections.
- Unipolar ordinary source controls enforce 0–24 V. Reversed meter readings and historical signed source values remain supported; signed projects are identified rather than clamped. Dedicated bipolar presentation is deferred.
- Confirmed Clear Circuit/Clear Breadboard, preserving project notes, named snapshots and graded learning data. Inventory annotations/order/unknown unlinked stock survive graphical edits; new canvas history restores inventory through undo/redo.
- Windows-style title dragging, all eight edge/corner resize handles, docking, minimize/reopen, keyboard movement/resize, reset and separate local saved layouts. Restored geometry stays reachable on smaller workspaces. Compact toolbar and contextual editors keep circuit contacts in the opening viewport.
- Mobile's first small divider measurement exercise has large contact/probe targets, visual presets/power state and independent offline experiment saving. It uses the same DC engine and resistor artwork, not the desktop window shell.
- Narrow offline Electron and Tauri evaluation shells. Real Windows CI launches both, tests local Web Locks and native UI interactions, and records screenshots. No installer, updater, privileged project-file API or production backend was enabled. The actual Tauri dependency graph is locked. Permanent selection remains open.

## Reused and preserved

Shared DC model, breadboard topology/adapter, DMM measurement logic and existing housing, scope signal/capture foundation, resistor-color calculations/body, shared graphical controls, widget registry, project manager/store/snapshots/conflicts, guidance framework and five-tab lesson engine. Original 62 registry capabilities remain; catalog is 67. The 33 approved artifacts/336 question IDs, explanations, printed-page references and learning-progress store were not regenerated. The electrical solver/topology/color algorithms and persistence.js have no changes from the starting verified commit.

Main implementation files: lab-modules.js, lesson-package.js, lesson-labs.js, lab-platform.js, desktop-lab.js, desktop-windows.js, circuit-canvas.js/view, mobile-lab.js; reused controllers in electronics-workspace.js, project-store.js, shared-multimeter.js, lesson-tabs.js/view and app.js. Schema: content/lesson-package-v2.schema.json. Native shells: native/electron and native/tauri. Operational changes: explicit public allowlist, native/browser CI and exact-head gate/read-back. See Git diff for the full file list.

Key commits: **deaf888** dual contracts; **adec03e** desktop/mobile prototype; **6ea6600** native evaluation; **3275a25** accepted native/browser functionality and physical contacts; **1684e51** compact viewport/context editor, inventory protection and dependency lock. Intermediate corrections remain in checkpoint history.

## Verification and deployment

[Primary 38607660349](https://github.com/TheAmazingBaha2/electrical-understanding/actions/runs/38607660349) passed **259/259** tests, syntax/build/73-asset allowlist, all **18 browser suites** and **both real Windows native jobs**. Browser coverage includes 320/390 phone and larger desktop widths, original content/navigation/grade/review/conflict regressions, source/probe safety, snapshots/projects, independent practical grades and default viewport usability. All application external requests are blocked in browser tests; no paid inference or real learner writes occur.

Earlier failures were corrected, not declared successful: native viewport sampling/selector mistakes, phone contact interception, required Windows icon, WebView2 elevated-runner automation and metadata serialization. The normal-integrity Tauri test follows upstream CI guidance; WebView2 was not downgraded. Playwright's 1.55.0 certificate advisory was patched to 1.55.1.

**Current deployment failure:** Cloudflare rejected the 1684e51 build; [read-back 38607660760](https://github.com/TheAmazingBaha2/electrical-understanding/actions/runs/38607660760) did not find that commit served. Cause is unverified because private Cloudflare logs are unavailable through connected tools. Last verified served staging: **3275a25**, with all 73 asset hashes matching. The following documentation commit retries the existing staging pipeline. Check its exact result in CHECKPOINT before describing the compact layout as deployed. No quality gate was bypassed.

Screenshot artifacts: `v2-visual-qa`, `windows-electron-evaluation`, `windows-tauri-evaluation` in the primary run. Seven images are also in `/workspace/electrical-workbench-v3-desktop-review/`. They are genuine CI captures of synthetic experiments. Native testing is runner evidence, not owner usability/HiDPI acceptance.

## Owner acceptance checklist

After matching staging delivery is verified, open [V3 staging](https://eu-v2-staging.vanguardcorbett.workers.dev/):
1. On Windows select Desktop/Automatic. Confirm circuit and meter are visible; drag titles, resize edges/corners, dock/minimize/reopen and reload saved layout.
2. Click a resistor/source for its contextual editor. Change presets/bands/source voltage. Drag probes to source/output/reference and reverse polarity. Confirm unavailable measurements are explained.
3. Clear Circuit with confirmation, place source/resistors, connect terminal wires, choose source − as Reference, connect both probes and enable power. Undo/redo, save/reload and restore a named snapshot.
4. Select Breadboard, check existing editing/probes, Clear Breadboard and Undo. Open Project for snapshot rename/delete and project recovery.
5. On the phone use Automatic/Mobile: tap red/black and the large Supply/Output/Common contacts, adjust presets/power and reload. Confirm this is its own exercise. Recheck the original Chapter 3 quizzes.

Dual-module grades are currently demonstrated by automated synthetic fixtures. Future approved lessons use the developer publication workflow in LESSON_PUBLICATION.md; existing content is not silently converted.

## Limits, next milestones and safeguards

The canvas is bounded (1400×900) and retains ideal DC limits; no SPICE/AC/transient behavior is implied. Wires/probe leads are illustrative routes within the circuit pane, not physical cable routing between moving windows. Close labels can overlap. Full keyboard placement, lesson-specific experiment presets, multiple native instruments/layout presets, HiDPI/multi-monitor acceptance and more phone exercises remain. Mobile is one useful initial exercise, not a complete independent curriculum. Shared practical validation currently supports choice/DC-voltage checks, not general construction certification.

Cross-device project contracts remain transport-free; an isolated V3 backend is not authorized. Native evaluation profiles are separate from browser storage. No account migration or production connection was forced. Production main remains 741aa7c, V1 is untouched, and no new Supabase/database/security-policy or raw-scan cleanup operation occurred. Prior backend/security deferrals remain open; no database rollback compatibility is claimed from a frontend rollback.

Rollback: export project/progress recovery files first; use the retained compatibility module for the former workspace, or restore a previously verified staging frontend through the same exact-head CI gate. Preserve new package/progress/project fields and raw backups. Do not reset local/cloud data or touch production/V1. No database migration from this increment needs reversal.

Owner approval remains necessary for production promotion/maintenance merge, official installer, paid backend/services, destructive data changes and old graded-semantic changes. Next work should use owner feedback, batch graphical polish and develop module-specific presets/mobile exercises before adding advanced physics. Permanent shell choice is not made solely from debug CI measurements.
