# Laboratory usability sprint

Development branch `draft/v2-dmm-companion`; production/V1/data and existing lessons/grades remain untouched. The direct owner grading/deletion instruction is recorded; attachment proposals did not create source attestations or completed migration coverage. No real grading or legacy deletion was activated.

## Verified workspace/contact increments

- **2240b87c0435f3df57d89a610dda08e862dbe272**: measured desktop geometry, full-width ordinary bench, Expand lab / Return to lesson, scale-aware dragging, responsive docking and non-destructive preferred-layout projection.
- **3e513f0d0291ea879f774c24069df87a11f690a0**: exact physical contact contract, visible snap preview, probe detach, wire-end rerouting, phone tap contacts and real-event tests. Primary **38676739069** passed 301 tests/21 browser suites/both actual Windows prototypes. Read-back **38676738990**, job **116231955882**, verified all **73 assets** at **2026-10-15 03:38:04 UTC**.

Measured cause: private preview at 1650px was already full width and a real drag reached its right edge; that exact reported boundary was not reproduced. At 2560px, the old 1800px controller cap left **735px unreachable**. The ordinary app had a separate 1200px page maximum. Initial geometry, destructive resize fitting and unscaled pointer deltas also contributed. Tests now measure the same stage used for positioning, across zoom/DPR/scroll and viewport changes.

Initial primary **38674509371** passed browser/Tauri/checks but failed Electron's newly added reload test because the helper omitted navigation back from the dashboard. It was corrected; the failed overall run is not counted as a release.

## Guided increment — local validation complete; exact-head verification pending

[ACTIVITY_PRESETS.md](ACTIVITY_PRESETS.md) describes optional versioned presets, minimal setup, actual state-based six-stage guidance, exact resume, isolated restart snapshots/recovery and ungraded examples. The desktop exercise starts with a source, then the learner places and wires two resistors using the existing palette. Phone has its separate compact contact/band activity. Both use the same electrical/instrument models.

Guided browser testing also exposed two real input defects: text/ground glyphs shifted a terminal button's bounding box outside its circular contact, and SVG pointer capture retargeted a probe click to the canvas. Labels are now separate from hit targets, and the shared pointer adapter explicitly completes probe/wire-end selection. Both click-connect and drag-connect are covered. A private guided SVG display is bounded in height so a wide window does not push construction targets below the usable region.

Private candidate **2.2.0**, canonical hash **04bdae446a2b1fa5fff6b6f40bd122cf1187cf881145f0c035b18a7a52da6129**, has **159 entities**, preserving all 149 predecessor entities byte-for-canonical-byte, 10 topics/32 blocks/18 template identities. Four first activities opt into guidance; other activity content/rubrics remain unchanged. Core question IDs and the 2.1.0 bundle are unchanged. New revisions remain drafts; source discrepancies/rights are unresolved and no approval is inferred for the new revision.

Local syntax, 305 deterministic tests / 51 test files, build/73-asset validation and targeted browser suites pass. Guided cycles cover both lessons at 320/390/1650, including the separate phone band task, exact step/circuit reload, restart snapshots, explicit recovery and blocked example submission. Contacts cover desktop/320/390/768, including exact breadboard-hole attachment; ordinary desktop and workspace regressions also pass. All five private phone tabs now wrap visibly, and module/model details are disclosed on demand. Exact-head CI/read-back results must be read from the checkpoint/final verification sidecar. This commit cannot self-name or assert its future CI success. Source-derived bundles, owner instruction record, private ZIP and screenshots stay outside public assets. CI captures are synthetic only.

## Reuse, recovery and remaining work

Reused shared DC solver, canvas/breadboard topology, graphical assets/resistor colors, DMM safety/calculations, guidance renderer, ProjectStore/autosave/snapshots/CAS, Windows chrome, separate phone interface and classic/linear lesson composition. Widget registry remains 67 capabilities; no duplicate simulator or instrument was added.

Keep the earlier private ZIP unchanged. A new private archive is prepared after exact-head checks, with source, ready local 2.2.0 preview, all older bundles, source-preservation exports, review notes, file hashes and verifier. External owner retention remains unverified even when the workspace ZIP exists. See the checkpoint for exact artifact paths/results.

Owner testing: compare Classic/Linear; open first activity in both lessons/platforms; expand desktop, drag/resize right/bottom and shrink/reopen; predict, construct/connect, measure and explain; detach/reverse leads; pause/reload; restart, inspect/restore recovery snapshots and ungraded example; verify grade counters remain unchanged in draft practice. Owner usability acceptance is separate from CI.

Remaining: refine remaining 12 practical starts and instructional density, review all source/content/rights and grading activation, private native storage/Android, conflict UI and private 967-entry migration review. **967 decisions pending, zero legacy credit transfer, zero retirement**. Deletion authorization is recorded but a concrete scope/replacement/dependency/rollback manifest is not yet available. No production release, raw-source operation, paid call, official package or repository visibility change occurred.

Rollback: revert presentation/controller extensions and reopen a retained prior private bundle. Keep all private project/learning/layout exports and new-version readers. No database migration occurred. Do not clear conflicts or assume a frontend rollback changes database compatibility.
