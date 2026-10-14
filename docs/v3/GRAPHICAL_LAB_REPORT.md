# Graphical-first Electronics Lab — 2026-10-14

Development branch: `draft/v2-dmm-companion`. Staging only: https://eu-v2-staging.vanguardcorbett.workers.dev/. Production, V1, databases and learning-progress documents were not changed. No paid model or backend service was enabled. Completed foundations were reused, not rebuilt.

## Implemented experience

The standard interface uses visual part/probe palettes, direct native breadboard contacts, component bodies with real electrical endpoints, a graphical meter, supply controls and a scope display. Resistors/sources/wires use two-hole placement; component/wire editing supports move/reroute, disconnect/reconnect, duplication where supported, removal and the existing undo/redo/autosave layer. Touch contacts remain at least 44 px, with native pan/zoom and section buttons. Editors close during placement/move/reroute/probe operations; selection remains independent of panning. Desktop instruments sit beside the circuit with a saved split-width control. Phone focuses an instrument pane and uses contextual editor sheets.

Four/five-band resistor graphics share one asset and pure color-code conversion. Significant digits, multiplier and tolerance colors are validated by band role. Nominal values, band colors and stored properties agree. 857 Ω stays exact in five bands; four-band alternatives are 850/860 Ω and never silently replace it. Tolerance has an explicit interval and does not vary the ideal simulation. Presets/sliders/color swatches provide the normal workflow; precision values are optional and rejected if outside the supported edit ranges. Unknown saved properties are preserved.

The supply provides a configured-voltage display, coarse slider, fine buttons, presets, power switch and signed terminals. Its connection state is distinct from measured node voltages. The DMM reuses its existing housing and shared voltage/resistance/continuity/ideal-series-current engine, function dials/buttons, COM/VΩ/A jack selection and tap-to-connect probes. Invalid circuit states retain the instrument with UNAVAILABLE and a reason. The scope reuses the existing plot/model, graphical scales/trigger/waveform/frequency/amplitude/offset controls and probe placement. Shared steady DC and independent demonstration origins remain explicit; no AC/transient solver was added.

The reviewed ten-step divider guide and Free Experiment use the same graphic controls and calculations. Compact cards retain predictions, previous/next, hints and complete instructions. Graded lesson widgets were not migrated to these new native adapters.

## Shared implementation and reuse

New common library: `lab-graphics.js`, `graphic-controls.js`, `resistor-color.js`, `graphical-breadboard.js`, `component-editors.js`, `instrument-graphics.js`. Integration: `electronics-workspace.js`, `breadboard-view.js`, `breadboard-model.js` metadata/reference edits, `circuit-view.js`, guided activity/view files and scoped `styles.css`. Build and deployment allowlists include all six new modules. Source/quiz/approved-lesson/progress files remain unchanged.

Reused: `circuit-model.js`, existing breadboard graph/adapter/history, `shared-multimeter.js`, `dmm-widgets.js#visualDMM`, `lab-visuals.js#circuitSvgFrame`, scope signal/capture/plot foundation, project store/locks/conflicts/snapshots/import/export and the guide rules. Existing 33 approved lessons, 336 question IDs, original five tabs and old graded assets were preserved. Registry retains its original catalog and adds three native graphic entries, bringing the total to 67: `lab-graphic-controls`, `resistor-color-editor`, `dc-supply-graphic`. See [shared control contract](GRAPHICAL_CONTROLS.md).

Retained optional text controls: exact component/tolerance/source values, precise probe node/function/jack selectors, circuit diagnostics and scope settings inside disclosures/Advanced controls. Advanced visibility/zoom/split width are per-device preferences, outside project circuit data. Project names, notes, search and snapshot names remain normal text inputs. Standard guided/free experiment checks require no numerical field. Existing snapshots/recovery/conflict transactions and learning progress remain separate and intact.

## Verification and history

Final tested graphical implementation: `410db791e1732f3089cc56bc27fbd732e01ebb37`, following metadata/label refinement `34e963537917f979ea7929a00fd501aae16a04dc`. Primary [38570418305](https://github.com/TheAmazingBaha2/electrical-understanding/actions/runs/38570418305) passed syntax, build/allowlist, all 246 deterministic tests and all 15 real Chromium suites. Graphical acceptance completed the guide, constructed/measured circuits, operated color/preset/coarse/fine controls, rejected invalid tolerance without mutation, preserved DMM safety and scope origins, and tested move/remove/wires/undo/snapshots/reload at 320/390/1440 px with external requests blocked. Original lessons/quizzes/progress/IDs passed their regression suites. Local Chromium is not claimed: workspace server sockets remain restricted, so real browser verification ran in CI.

Read-back [38570418254](https://github.com/TheAmazingBaha2/electrical-understanding/actions/runs/38570418254), attempt 2/job `115878017526`, verified the exact build-info, staging branch/worker and SHA-256 of every one of 65 served assets at 13:25:21 UTC. First attempt caught a briefly mixed graphical-breadboard asset during deployment; only the complete successful hash retry certifies delivery. Cloudflare build succeeded. Production `main` was checked read-only and remained `741aa7cd690761d6e088b04fa656d4ad42e25e67`. The following report/checkpoint commit is documentation only and repeats the exact-head pipeline; check its actual Actions status before treating a later HEAD as verified.

Relevant published increments:

| Commit | Result |
| --- | --- |
| `09d8dfc62feccc8009f2f366f6eaa1a178573115` | Shared graphic library and direct canvas |
| `f432e342fe1a3594aba3b95cde4b4a1b857525db` | Connected component editors and instruments |
| `318022c623f9207ffd83d9ad210a8c1506c79b37` | Mobile obstruction and direct band fixes |
| `9f2eb3eeb5421a41e4bfefd7294ad9c141d341da` | Compact palettes, honest invalid displays, reuse contract |
| `e853806092f24ea3d71c9d9812f942d60b83cbeb` | Graphical guide and wire fault coverage |
| `c4b23721aa2d77880b5a4bec5830b9dde5c58b80` | First fully verified graphical build; shared dials and exact-head gate |
| `34e963537917f979ea7929a00fd501aae16a04dc` | Validated metadata, contextual feedback and upright labels |
| `410db791e1732f3089cc56bc27fbd732e01ebb37` | Final tested and hash-verified implementation |

Intermediate failures are retained in [checkpoint history](GRAPHICAL_LAB_CHECKPOINT.md): actual mobile toolbar/editor obstruction, palette overflow, missing draft controls and later corrected browser selector/visibility/percentage-message assertions. They were not reported as accepted releases. Read-back authentication now uses an ephemeral Actions read token, outside public assets, with exact branch/SHA/workflow gating still enforced. Cloudflare credentials were not inspected or altered. A transient asset 404 during the first accepted deployment was followed by a completed exact-hash retry; it was not ignored.

Screenshots: primary CI visual QA artifact includes full pages and scope captures at 320/390/1440 px. Original circuit/resistor review JPEGs are also available locally in `/workspace/electrical-workbench-v3-graphical-review`. These are synthetic test projects, not personal learning records. Owner ergonomics and physical-phone acceptance remain separate from CI success.

## Owner acceptance

1. Open Electronics Lab → Editable breadboard → Free Experiment → Board templates → Blank board. Keep Advanced controls off.
2. Select DC supply, tap LP1 then LN1; use 5 V. Select a 1 kΩ resistor, tap A1 then F1. Place another 1 kΩ resistor at G1/F2. Use section/pan controls when a contact is outside the phone viewport.
3. Select jumper wire: LP2/B1, then LN2/G2. Select red probe/H1 and black probe/LN3. With source power on, the shared ideal meter should read 2.500 V. No numeric field is needed.
4. Tap a resistor body. Try four/five bands, color swatches, presets and tolerance. Check the nominal value and interval. Try supply slider/fine/power controls; distinguish configured voltage, an available reading and UNKNOWN floating state.
5. Move/remove/open parts, reroute/open/remove wires, undo/redo, and restore a snapshot. Rename/delete duplicate-name snapshots by their individual rows; verify notes, other snapshots and active circuit remain intact. Reload and repeat offline.
6. Try proper meter functions/jacks and source-off resistance/continuity/current preparation. Compare Circuit DC and Demo generator scope origins. No physical instrument accuracy or fuse behavior is promised.
7. Switch to Divider → Guided Experiment and complete prediction/source/output/ratio/open/floating steps using the same graphics. Test at 320/390 px and desktop; report crowded labels, troublesome pan/selection, inaccessible controls or obstructive editor sheets.

## Limits and next work

Physics remain ideal DC resistors/sources, infinite-impedance voltage readings and ideal selected-branch current. Mechanical component packing, wire crossing geometry and drag-based physical routing are illustrative; this is a compact 12-row board with split rails. A full board cannot fit on a narrow phone while retaining large contacts, so native panning is intentional. Sheets scroll internally. No extra component types, manufacturing variation, general analog transient analysis, unrestricted tutor or cloud synchronization were introduced.

After owner feedback, batch ergonomic refinements, wire-crossing selection and breadboard construction guides through the existing improvement queue. Reuse this library for future native lessons/projects; adapting existing graded behavior requires explicit approval. Additional electrical realism needs a separately reviewed version/model decision. Cross-device transport still needs an authorized isolated backend/cost decision; existing local sync contracts remain the foundation.

Rollback: use a known verified V3 staging revision or revert the relevant development commits, require exact-head CI and hash read-back, and preserve all local project/recovery/progress keys. New metadata is additive; never delete saved data to make an older frontend appear compatible. No database migration was performed, and a frontend rollback does not reverse separately performed historical production operations. Production release, paid services/cloud provisioning and destructive operations still require owner approval. No production approval was requested or exercised in this assignment.
