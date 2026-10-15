# Private guided activity presets v1

Schema V3 `LabModuleDefinition.activities[].experiment` is optional. Older entities, hashes and results remain unchanged. Configuration is bounded data: `version: "1.0.0"`, `start`, `template`, `allowExample`. Templates are `divider-construction@1`, `meter-connections@1`, `resistor-bands@1`; each must match its existing rubric. No scripts, arbitrary evaluators or unregistered physics execute.

Starts support blank desktop construction, minimal/guided setup, optional completed examples, and exact saved resumption. A phone template has its own prepared compact fixture/band editor and rejects blank desktop construction. A required activity cannot default to a completed example. Resume reads the existing activity project before any factory is invoked; a new activity with no saved record gets a clearly described initial setup.

`hosts/activity-presets.js` uses the existing project/canvas/probe/measurement models. Desktop begins with an unpowered source and detached probes; blank has no components. Phone meter practice has an explained source/two-resistor fixture with detached probes; band construction has one 100 Ω practice component. Examples use actual shared-model states and are labeled ungraded.

`hosts/private-activity-guide.js` reuses `guidanceState`, `advanceGuidance` and `renderGuidance`. The initial optional templates provide Predict → Build/Connect → Measure/Compare → Explain → Debrief. Selection, actual parts/contact state and the existing practice rubric determine readiness. Wrong predictions can be explored without deducting grades. These bounded templates are not a mandatory section count for every future concept.

A project ID binds the exact module ID/version/activity ID and platform's private storage scope. Its `experimentState` retains the preset identity, guide step, predictions, explanation and example flag. Controller activity APIs use the existing autosave/locks/conflict handling. No general-purpose project data goes into graded progress. Device layouts remain separate.

Restart/example/restore operate only on the activity project. They preserve notes, metadata and snapshots, create a named recovery snapshot, and use existing circuit history on desktop. Recovery selectors target snapshot IDs, never display names. Selecting another project cannot make Restart erase it. Old module projects and all historical attempts remain in their original storage scopes; they are not silently converted into a new activity record.

Examples disable submission until the learner restarts or restores their own state. Guidance itself creates no grade events. The existing practice/graded publication gate remains authoritative. This is local formative study, not authenticated physical competency certification. Existing rubric v1 and old saved snapshots are not rewritten.

Private 2.2.0 candidates opt the first activity of each Resistors/DMM desktop/phone module into these presets. Other activities retain their original behavior. This is four implemented guided paths, not all 16 activities converted. New lesson/module revisions preserve old identities/versions. The DMM 2.2.0 prerequisite explicitly pins Resistors 2.2.0; original pins remain intact. Owner grading permission for 2.1.0 is recorded; new 2.2.0 and source-rights/technical review are not automatically approved by a UI change.

Known limits: diagram labels can overlap, there is no mechanical lead bending, current remains ideal prepared-branch measurement, and explanatory choices are ungraded local guidance. The phone does not build a full desktop circuit. Native private-content transport, Android packaging, cloud sync and broad custom-step templates remain separate work. No GitHub/runtime backend or paid model is required.
