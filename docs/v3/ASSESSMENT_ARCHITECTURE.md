# Deterministic assessments and private progress

AssessmentTemplate is independent of lessons, topics and layouts. Templates pin identity/version, reviewed allowed value sets, constraints, renderer/evaluator contract, canonical SI unit, tolerances, safety and evidence. AssessmentInstance records its exact template reference, seed, generator version, generated values, expected value and unit. It is private attempt data, excluded from curriculum bundles.

`modular/assessments.js` implements frozen `finite-product@1`: stable parameter order, bounded finite Cartesian product, declarative filtering, FNV-1a UTF-16 seed selection and RFC UUIDv5 instance identity. The same template/version/seed reproduces identical JSON. Revision changes yield different identities. Evaluating an instance regenerates and compares every field, refusing mismatched or tampered historical data rather than regrading it under a new template.

Reviewed operations: static selectable choice; Ohm current/voltage; ideal unloaded resistor-divider voltage; series and parallel resistance. No JavaScript expression, eval, function name from input, paid provider or model-generated runtime values execute. Every feasible combination is checked for finite/valid electrical arithmetic before a template is imported. The 16,384-combination limit bounds deterministic validation work; it does not constrain lesson length, activities or curriculum taxonomy. More generator families need separately versioned implementations/tests.

Numeric answers require a finite number and explicit canonical unit (`V`, `A`, `Ω`). Tolerance is `max(absolute, abs(expected) × relative)`, inclusive. Choice grading uses exact index and no unit. Formatting/prefix-entry adapters may be added separately without changing the evaluator. This is simplified reviewed teaching arithmetic, not a physical instrument accuracy claim. QTI can map independent template/instance data later; no full QTI adapter is implemented.

## Event contract

`ProgressRepository` is a private append-only in-memory port with defensive copies and atomic validated import. No events are wired into existing ProgressStore yet; no historical grade behavior changes. Results pin private stream, lesson revision, template/activity revision, attempt, timestamp and correctness. Question attempts/results also pin exact instance identity. Practical events additionally pin their independent platform/module revision. Device layouts and circuit projects are separate records.

`SyncProvider.mergeAttempts` is transport-free. It unions nonconflicting immutable events; conflicting event IDs or contradictory results for one attempt preserve all variants and contribute no projected credit until explicit reconciliation. Duplicate result IDs cannot inflate attempt counts. No timestamp winner is selected. Mutable notes/projects retain the existing separate conflict-preserving project contract; this event merge is not a CRDT for those documents.

The projection filters one explicit private stream and exact lesson/module/assessment versions. Common quiz completion uses the existing 80% rule and explicit safety subjects; required practical activities need their own correct results. An accumulated correct result represents demonstrated completion; individual attempts remain immutable. Either/both/no-required-lab policies do not manufacture the other platform's grades. New lesson or module versions do not reinterpret earlier results. Review-scheduling events are representable but no new scheduler or cloud transport is activated.

## Presentation boundary

`composeLesson` resolves topics, semantic blocks, objectives, assessments, labs and all supporting/disputed evidence, including references used only by an assessment or objective. Duplicate evidence support does not duplicate content blocks. `presentationPlan` applies independent regional profiles and consumes an external progress projection; it refuses to silently omit a block type. Tests prove classic and linear profiles preserve lesson/quiz/lab identities and progress. This is a renderer-neutral plan, **not yet a browser-rendered pilot or completed pie-chart UI**.

Revision-level title/alias overrides allow renaming through a new revision while old identities/content remain readable. Registered lab capabilities are checked through an injected widget lookup, reusing the current registry. No renderer, simulation engine or instrument is rebuilt here.
