# Laboratory continuation — October 13, America/New_York

The existing Phases 1–4 are retained. No lesson regeneration, production database changes, paid calls, or account migration is part of this work.

## Guidance and snapshots

`guided-activities.js` contains reviewed activity data; `lab-guidance.js` validates objectives/steps/predictions and named requirements. `lab-guidance-view.js` is the reusable presentation adapter. The ten-step divider activity covers objective, components/terminals, connected path, prediction, source/output probe measurement, resistance ratio, upper open path, isolated/floating output and independent experimentation. Guided/Free modes share the existing model and meter. Guide state saves inside experimentState; legacy projects default to Free instead of being forced through onboarding. No guide check is a graded lesson result. Prediction hides readings only as a presentation choice; it never substitutes another circuit.

Circuit/DMM presentation reuses the existing SVG frame and DMM housing. Divider wiring is explicit; node/probe labels are visible. A configured source that is disconnected is described separately from the actual measured potential. Text and expected observations follow current component values, connections and solver output. Numeric display is rounded and carries units; no realistic meter accuracy is claimed.

Snapshot management uses stable IDs, timestamps and per-row controls. Duplicate names remain distinct. Restore and rename target the ID; deletion requires an inline confirmation and only removes that snapshot. It leaves active circuit/notes/other snapshots/grades unchanged. Deletion tombstones prepare future synchronization. Local stale-write conflicts preserve both copies; explicit selection keeps the two prior versions in recovery metadata. Unknown schema/corrupt storage remains protected by the existing failure behavior. Browser conflict acceptance waits for the locked save to complete.

Verified guidance/snapshot commit: 6a318473da73a955132386498a4a6731d2b35b89. GitHub run 38497766691 passed both jobs, including the new guided desktop/phone suite and all original content/progress suites. Local count at that point: 222 deterministic tests. A preceding run exposed only an acceptance-test wait race; it was fixed rather than weakening the persisted conflict assertion.

## Editable breadboard

`breadboard-model.js` maps a compact 12-row board into the same shared circuit. A–E within a numbered row form one strip; F–J another. Center gap, adjacent rows, left/right rails and positive/negative rails are isolated. Rails split after row 6. Explicit wires bridge separate nodes. The board has 32 electrical nodes and 168 hole contacts. `externalTerminals` extends the v1 graph additively for board contacts; existing model behavior and grading are unchanged. The solver performs actual wire-node joining and calculation. There is no breadboard-specific electrical engine.

The new `breadboard-shared` registry adapter is needed because the old `lab-breadboard` is an illustrative graded activity, not a persistent circuit editor. The original 62 registry entries remain; the total becomes 63. Native buttons reuse existing breadboard hole art/styles, and instrument/circuit graphics remain shared. Component/wire IDs are stable; readable component names are separate labels.

Free editing supports source/resistor placement, moving/removing components, connecting/removing/rerouting wires, values, open paths, tap probe placement, power, blank/template setups and undo/redo (last 50 edits retained). Phone shows focused Left/Right/Rails sections with large native hole buttons. Keyboard supports Tab and Enter/Space. Wire routing is represented by endpoint lists; mechanical shapes and lead packing are not simulated. Invalid hole/duplicate terminal placements are rejected; source shorts/unsupported configurations display solver errors and no fabricated reading. Unused board strips may float naturally. The graph/state must agree on project import; mismatches are rejected with original data preserved.

The breadboard has its own local project, separate from the divider and from grades. Values, placements, wires, probes, undo history, notes and snapshots persist through the existing locked revision store. Switching lab projects flushes a successful save first; failed saves prevent that switch. This is two built-in projects, not the later full searchable/multiple-project manager. The divider guide currently targets its named divider setup; the breadboard uses Free Experiment until dedicated reviewed activities are added.

Breadboard local verification: 225 deterministic tests plus syntax/build/allowlist pass. Exact-commit CI and owner testing are required before accepting the UI increment. Subsequent DMM modes, oscilloscope, full project manager and cross-device contracts remain distinct milestones.

## External status and approvals

Owner reports staging is deployed and production authoring is retired. Read-only inventory confirms the previous PDF absent and no nonempty Storage objects; one zero-byte folder placeholder remains. Nothing was deleted/uploaded here. Do not call the bucket empty or retire it automatically. Current cleanup artifact is aggregate-only and does not republish internal object/user/path identifiers. Approved educational exports were not changed; broader public-history/content exposure decisions require owner review.

PR #4's browser assertion was repaired separately at 5718c99b19005b0119870ea2e4fdb5d1c03b1f94; run 38496606032 passed. It remains unmerged. Cloudflare branch restrictions must stay in place for that maintenance branch. Local shell proxy/socket restrictions still prevent live staging read-back; an owner-reported deployment is not a new exact-commit deployment verification.


## Shared DMM extension

Resistance derives equivalent resistor-network resistance using the same nodal solver with an isolated ideal 1 V meter test source. Existing energized sources block ohms/continuity. Internally connected breadboard contacts correctly read zero; open paths produce OL. Continuity uses a documented example threshold of 30 Ω. DC current requires an explicitly selected component branch prepared while power is off; the ideal zero-burden series connector leaves the underlying DC circuit electrically unchanged, so the reading is the actual solved branch current, with optional reversed polarity. This is not a realistic fused/shunt meter. Across-node current probing, wrong jacks and missing/deleted series branches are blocked. No existing graded DMM lesson scenario was changed.

The runner staging read-back checks the exact commit, branch/Worker identity and every public asset hash after primary CI success. Only its verified report establishes a served deployment; pushing a commit alone does not. Cross-device contracts remain local deterministic logic without a cloud connection.


## Oscilloscope foundation

The new capture contract distinguishes two origins: shared-circuit steady DC values and independent generated demonstrations. It reuses the existing workshop trace/frame/grid, with optional more precise scope time labels that preserve old lesson output. Sine, square and triangle generation, amplitude/offset/frequency, voltage/time scales, basic rising-edge trigger, finite samples and alias disclosure are supported. DC probes read the shared solver; isolated nodes refuse a waveform. Settings/summary measurements persist in projects and snapshots. This does not solve AC/transient circuits or model scope loading/bandwidth/noise/ratings. General analog simulation and multi-channel comparison remain deferred; the original ngspice investigation still informs future engine integration.

Actual staging read-back passed for shared-instrument commit 1bc63d9697b7744c8596ca50829f15543600f800: primary CI run 38500782371 and independent read-back run 38500782593 succeeded. Newer scope deployment needs its own successful gate and served-hash evidence.
