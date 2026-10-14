# Desktop and mobile laboratory contract

Owner direction, October 14, 2026 (America/New_York): Desktop Lab is the primary Windows application prototype. Mobile Lab is a separate, smaller exercise interface. They share curriculum, sources, the five lesson tabs, core quizzes, account/progress synchronization contracts, electrical models, instrument calculations and graphical assets. Presentation and practical records are independent. Neither platform is a resized copy of the other.

## Publication and practical progress

`content/lesson-package.schema.json` remains immutable schema 1. New schema 2 is `content/lesson-package-v2.schema.json`, validated by `validateLessonPackage`. All original fields and grading/review rules remain. Schema 2 adds `labs: {completionPolicy: "either", desktop, mobile}`. Each module supplies its own stable `id`, semantic `version`, title and any number of activities. Activity IDs are distinct from all core questions and the other module. Required flags, references and deterministic assessment definitions are explicit. Initial assessment contracts support choice checks and shared-engine DC voltage checks; executable content and unsupported assessments reject before publication.

The existing per-lesson progress document receives additive `labModules.desktop["module-id@version"]` and `labModules.mobile[...]` records containing independent results, attempts, completion and grade counters. Version changes retain earlier records; they do not silently reinterpret old grades. Core `answers`, workshop checks and review schedules remain untouched. A new dual-module lesson requires its original quiz and practical completion from **either** module. Completing the other module is additional practice. Lessons without `labs` retain their historical requirements. Existing approved lessons are not retrofitted.

The existing progress store preserves these fields, backs up edits and keeps conflicting lesson copies for explicit recovery. No database migration or production connection is needed. Cross-device transport remains disabled in V3; concurrent conflicting practical edits are preserved as full lesson copies rather than guessed by timestamps.

Device platform override and window layouts are local presentation preferences, separate from project content and assessment records. Electrical placement/connection state belongs to projects; window coordinates do not. Desktop/mobile renderer adapters must never manufacture scores from widget display text.

## Safeguards

Ordinary unipolar bench supply controls support 0–24 V. Signed meter readings and historical signed-source project values remain valid in the common engine. Legacy signed sources must be clearly identified and preserved, not silently clamped; future bipolar controls need an explicit separate model/UI contract. Clearing a circuit/board requires confirmation and undo, preserving notes, snapshots and graded progress.

Windows packaging is an evaluation, not a release. Compare narrow Electron and Tauri prototypes using the same built static assets, no production backend, no paid services and no privileged project-file/AI access. Native runtime/build evidence and owner testing are required before choosing the permanent shell or publishing an installer.
