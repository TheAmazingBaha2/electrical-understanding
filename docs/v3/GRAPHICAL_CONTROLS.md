# Shared graphical laboratory controls v1

Graphical interaction is the standard laboratory presentation. Circuit state, instrument settings and project transactions remain in the existing models; renderers never solve circuits or write storage. Precision fields, node lists and diagnostics are optional. Advanced visibility, board zoom and desktop split width are device preferences (`eu_lab_graphics_v1`), separate from synchronized project content.

## Reuse contract

- `lab-graphics.js`: one resistor body/artwork, DC-source body and extensible reviewed part palette. Only resistors, sources, wires, reference, probes, inspection and opens are electrically supported. Unknown future parts are not advertised as supported.
- `graphic-controls.js`: escaped native buttons, function dial, indexed/graduated range sliders, power switches and delegated callbacks. Callback signature is `(command, value, element)`. Indexed controls resolve their displayed position to an actual structured value; renderers do not execute authored code. Buttons/ranges support keyboard and touch; SVG band controls support Enter/Space.
- `graphical-breadboard.js`: exact `boardPoint(hole)` geometry and real component/wire endpoints. Native contacts are at least 44 px. Board pan/zoom does not mutate electrical state. Selection, second-endpoint preview, placement, moves, rerouting and removal dispatch existing reviewed adapter actions, retaining undo and autosaving.
- `component-editors.js`: reusable contextual resistor and supply sheets. Metadata changes go through the existing board/project validator. Four/five-band nominal values are exact; unrepresentable values remain unchanged until an alternative is explicitly selected. Tolerance is distinct metadata and is not manufacturing variation in the ideal solver. Supply status distinguishes configured voltage from connected output; actual readings always depend on wiring.
- `instrument-graphics.js`: existing DMM housing and shared function/jack/probe controls, plus shared scope controls. Resistance/continuity require disconnected power; current uses an explicitly prepared ideal series branch. Scope DC observations and independent demonstration signals retain distinct origins.

Registry entries: `lab-graphic-controls`, `resistor-color-editor`, `dc-supply-graphic`; existing `breadboard-shared`, `dmm-shared`, `scope-foundation` remain available. These native workspace adapters are not executable lesson-package scripts or new graded behaviors. Future package integration requires a reviewed native adapter.

## Adding an interaction

Search the existing registry first. Select an existing graphic/control and pass validated structured settings. Handle its callback in a native controller, validate through the shared model, and update through the project transaction/undo layer. Preserve unknown approved/project properties; reject invalid edits without destroying the original. Add focused model tests plus browser construction/restoration checks. Put ordinary improvements in `content/widget-improvements.json`; changes to physics or grading need separate owner review and a version decision.

Default phone controls must avoid numerical keyboards. Text for project names and notes is independent of circuit operation. Precision fields remain inside disclosures; a user may explicitly enable retained advanced node/control lists. Current zoom is bounded to retain forgiving contacts; physical part packing and mechanical wire routes are illustrative. Owner testing remains required for ergonomics, panning and editor-sheet density.
