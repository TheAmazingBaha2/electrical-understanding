# Electrical Workbench V3 — Complete Codex Continuation Prompt
## Modular Expandable Lessons, Dynamic Practice, Source Evidence, Dual Labs, and Safe Legacy Retirement

**Assignment:** Implement the next phase of Electrical Workbench V3. This is a working engineering assignment, not another architecture-only report. Continue through authorized, tested milestones while usage permits; commit and checkpoint each increment.

**Repository:** https://github.com/TheAmazingBaha2/electrical-understanding
**Development branch:** draft/v2-dmm-companion
**Last reviewed HEAD:** 9892147e5815f5a65063e31b2075c69b4c4898df
**Staging:** https://eu-v2-staging.vanguardcorbett.workers.dev/

### 0. Mission and overriding direction

The owner wants **one evolving, concept-centered lesson for each coherent subject**, not a separate lesson for each textbook or scan. For example, Resistors and Digital Multimeters must combine verified information from multiple sources, preserve book/edition/printed-page citations, and grow as new source material, explanations, examples, practice questions, graphical widgets, and desktop/mobile labs are reviewed.

**Keep the familiar five-tab lesson presentation and progress pie charts initially**, but completely decouple educational content, assessments, progress, evidence, widgets, and layout. Tabs, navigation, visual styling, and even entire renderers must be replaceable later without rewriting knowledge or changing grades.

The owner wants the legacy V1/V2 lesson implementations **retired from the new V3 app once the replacement is complete**, not maintained forever. However, this does NOT authorize deleting V1 backups, production V2, Git history, source evidence, historical learner data, old grades, or unreviewed material. Demolition is conditional on complete mapping, tested rollback, and owner approval.

Future scans are interpreted **outside the website**, using ChatGPT/Codex or explicitly supplied private authoring artifacts. Never re-enable website scan upload, paid AI lesson generation, or a mandatory GitHub/runtime AI dependency. A model does not reliably remember old scans; use durable, reviewed source records, not inferred memory.

Desktop Windows and phone have **distinct practical lab interfaces and separately versioned/graded lab modules**, while sharing lesson content, core quiz definitions, sources, learning objectives, progress identity, and electrical models. The existing default completion policy is **either-platform**: one platform's required lab satisfies practical completion; the other is optional additional practice.

Build a **modular monolith with enforced contracts and adapters**. Avoid speculative microservices, graph databases, paid infrastructure, or claims of literally zero coupling.

### 1. Verify current state and reuse completed work

Read actual HEAD/status/commits/checks before editing; do not reset to the SHA above if newer work exists. Read:

- AGENTS.md
- docs/v3/CHECKPOINT.md
- docs/v3/MODULAR_LESSON_CHECKPOINT.md
- docs/v3/MODULAR_LESSON_REPORT.md
- docs/v3/MODULAR_LESSON_ARCHITECTURE.md
- docs/v3/MODULAR_LESSON_MIGRATION.md
- docs/v3/CONTENT_PROVENANCE.md
- docs/v3/ASSESSMENT_ARCHITECTURE.md
- docs/v3/DESKTOP_MOBILE_ARCHITECTURE.md
- docs/v3/DESKTOP_MOBILE_REPORT.md
- docs/v3/LESSON_PUBLICATION.md
- docs/v2/TEACHING_AND_DESIGN_CONTRACT.md

Inspect modular/, scripts/content/, content/modular/, content/approved/, lesson-view.js, lesson-tabs.js, lesson-package.js, lesson-labs.js, lab-modules.js, lab-platform.js, desktop-lab.js, mobile-lab.js, widget-registry.js, workshop-progress.js, project-store.js, the shared circuit model, and tests.

**Existing verified foundation — do not rebuild:**
- Independent Schema V3 domain with 19 entity contracts plus bundle, separate from existing Schema 1/2.
- Source works/editions/locators, evidence claims, canonical topics, revisions, objectives, semantic blocks, lesson compositions, assessments, platform labs, presentation profiles, progress events, migration mappings, and ingestion proposals.
- Immutable content repository/host interfaces, private file adapters, reference/provenance/DAG validation.
- Deterministic versioned assessment generator, immutable private progress-event merge/projection.
- Classic five-tab/pie-chart and linear read-only preview profiles.
- Initial private semantic Resistors and DMM drafts, source extraction, and migration ledger.
- Desktop freeform circuit, graphical resistor/DMM/supply, separate mobile lab, widget registry, project storage, Electron/Tauri evaluation prototypes.

Verified implementation 2cb158085a6df8c7f7f6c263eb7b86bdcce12472 passed 275 deterministic tests, 19 Chromium suites, both Windows native evaluation jobs, and 73/73 served staging hashes. The later documentation-only HEAD also passed checks.

**Legacy inventory:** 63 lessons, 542 questions, 195 activities, 167 source-reference dependencies, 24 safety-critical questions; original 33 preserved source-derived lessons/336 questions are INCLUDED. All 967 mapping dispositions still require review. The private source extraction preserves 36 under-review claims/18 locators/11 known gaps. Initial drafts include seven candidate topics, nine claims, ten blocks, five templates, two lesson drafts. **Zero fully migrated lessons and zero approved graded pilots.** Do not falsely report these as completed.

### 2. Complete the canonical topic and lesson model

Stable topic and lesson identity must not depend on title, slug, source book, chapter, page, tab, renderer or device. Revisions and hashes remain immutable. A lesson composes versioned topic revisions, objectives, reusable semantic blocks, evidence, examples, safety notes, predictions, assessments, desktop/mobile labs, and review rules.

Build a deterministic topic search/alias/coverage service to recommend:
1. Enrich existing topic/lesson.
2. Add a useful subtopic.
3. Create a genuinely new lesson.
4. Split an overbroad lesson.
5. Merge overlapping lessons.
6. Flag duplicate/conflicting/unverifiable evidence.
7. Make no change.

Produce reviewable evidence and diffs; **never auto-merge, split, publish, delete, or regrade**. Reuse topic blocks across lessons rather than copying authoritative facts. Check prerequisite cycles, alias ambiguity, unknown references, revisions, unsupported block types and widget capabilities.

### 3. Finish two real pilot lessons: Resistors and DMM

Use the existing private draft entities, source records, and approved principles. Do not wrap old lesson HTML or create superficial placeholder sections.

**Resistors:** role and operation; nominal resistance; Ohm's law; four/five-band codes; tolerance versus measurement uncertainty; series/parallel; power ratings; current/voltage; safe measurement; troubleshooting.

**Digital Multimeters:** functions, jack selection, voltage, polarity, resistance/continuity, current preparation, verified common/reference, safety, accuracy/resolution, interpretation, troubleshooting.

Each pilot needs: meaningful Overview/Learn/Interact/Quiz/Review; reviewed objectives and prerequisites; multi-source page references; worked examples; predictions/discussion/debrief; safety material; static and parameterized questions; answer explanations; separate lesson-specific desktop/mobile practical modules; review and reinforcement; classic/pie and alternative linear presentation; owner-readable source/content/grade review sheet.

Reuse shared DMM preparation content in both lessons without duplicating the authoritative evidence. Add a Voltage Divider pilot only after the first two prove the complete pipeline. Pilots remain private and **ungraded until explicitly reviewed and approved**.

### 4. Preserve source knowledge and build future enrichment

Trace LessonRevision → TopicRevision/ContentBlock/Objective/Assessment → EvidenceClaim → SourceLocator → SourceEdition → SourceWork. Preserve printed versus digital page distinctions, edition status, provenance, claim state, source conflicts, and known limitations.

The original raw PDFs may be unavailable. **Never reconstruct a page or passage from model memory.** Preserve the recorded page-18 prose/formula discrepancy, 11 gaps and unknown EIM edition. Historical citations are not independent verification. Clearly distinguish reviewed evidence, historical approved interpretation, authored example, and unresolved claim.

Expand extraction to account for all legacy educational explanations, examples, questions, activities and references, not just the 36 claims. Keep the original structured artifacts recoverable. Do not publish long copyrighted excerpts, private storage identifiers, raw scans, private authoring proposals, secrets or learner records in this public GitHub repo or staging assets.

Earlier private files under /workspace/electrical-workbench-private-authoring/ are **ephemeral**. Verify hashes and provide an owner-authorized, durable private export/backup and recovery procedure. Do not place private bundles in public GitHub just for persistence.

Complete the private/developer IngestionProvider using **explicit supplied artifacts**. Validate source and page data, compare against canonical topics, identify additions/duplication/conflicts/coverage gaps, propose blocks/questions/labs and lesson augment/split/merge/new decisions, generate human-readable content diffs, and require approval before publishing. Create eight deterministic fixtures: duplicate fact, new evidence, contradiction, subtopic, new lesson, split, merge, and missing/ambiguous citation. No runtime AI calls or website upload endpoints.

---

# PART B — Practice, grading and learning records

### 5. Expand deterministic parameterized question banks

Extend modular/assessments.js and assessment-rules.js, preserving the existing finite-product@1 generator and exact instance/revision/hash/seed contracts.

Support reviewed static questions and repeatable changing-value exercises. Example: "For an ideal resistor of {resistance} ohms with {voltage} volts across it, calculate current." Use bounded approved value sets and deterministic selection. Store exact parameter values, generator version, question template version/hash, expected result, unit, tolerance, explanation, attempt identity and seed. Historical attempts must reproduce exactly or fail safely; never regrade them under newer rules.

Validate every allowed combination: finite values, divide-by-zero, units and prefixes, meaningful electrical bounds, plausible distractors, supported formula families, safety and answer tolerances. Do not execute arbitrary expressions or accept unreviewed runtime-generated grading rules. Add generator families only as justified by the pilots: color-band decoding, tolerance interval, Ohm's law, series/parallel, divider, polarity, instrument preparation.

**Practice versus grading:** Practice may repeat with new values, hints and explanations without automatically increasing mastery. Graded assessment uses reviewed templates, immutable attempts, existing pass thresholds and safety requirements. A new revision may add requirements without altering old recorded results.

### 6. Implement actual separate desktop/mobile lab rubrics

The existing schema-2 and Schema V3 contracts already separate platform labs and scores. Preserve:
- Common core theory, quizzes and progress identity.
- Desktop module ID/version/activities/results/grade counter.
- Mobile module ID/version/activities/results/grade counter.
- Default either-platform practical completion, with the other optional.
- No double counting shared quiz grades.

Implement **lesson-specific** Resistors and DMM activities, not merely generic free-lab references.

Desktop: construct a resistor network in the existing circuit canvas, adjust values/supply, connect probes, measure and diagnose. Mobile: identify resistor bands/tolerance, choose safe DMM modes/jacks, predict and interpret readings using purpose-built touch widgets. Use the same electrical model and registry; do not duplicate solvers or shrink desktop widgets into phone panels.

A rubric must verify meaningful electrical state or conceptual outcomes, **not merely clicks**. Use stable activity IDs, validated inputs, versioned rubrics, clear hints and review feedback. Do not imply ideal DC measurements are certified physical hardware behavior.

### 7. Durable private assessment progress and sync boundaries

The existing modular/ProgressRepository is currently in-memory. Implement a durable **private host storage adapter** behind modular/ports.d.ts and existing PrivateHostStorage contracts. Provide atomic revision-aware saving, compare-and-swap, conflict preservation, export/import, backup/recovery and identity checks. Do not use production Supabase, enable a paid service or move learner data into public GitHub.

Store immutable results with private learner stream, lesson revision, question instance/template version/hash, seed/parameters, attempt/time, answer/result, safety state and independent platform/module version. No timestamp-only conflict winner. Preserve all variants on conflict, and do not award disputed credit until resolved.

Preserve existing project storage separately from graded learning records. Device window layouts stay local; learner grades can later sync across devices through a separately approved transport. Support offline access to locally installed approved lessons and saved attempts. No claim of cross-device sync until an authorized backend and tested transport actually exist.

**Historical progress:** New lesson IDs must not erase or silently reinterpret old quiz results. Only map old credit when explicit reviewed objective/rubric equivalence is demonstrated. Otherwise keep old credit readable as historical and require a new assessment for the new objective. Keep the existing common 80% quiz rule and safety-critical rules unless separately approved. New lesson content does not retroactively lower a historical grade.

### 8. Mastery, review and scheduling contracts

Keep existing review and reinforcement schedules functioning. Extend modular projections to stable learning objectives/skills and versioned assessment rules, not UI position. Distinguish previously completed objectives, newly introduced requirements and optional reinforcement. Store review-schedule updates as private validated events or an explicitly versioned projection contract. Do not replace existing spaced-repetition behavior without a reviewed migration.

---

# PART C — Replaceable visual presentation and portable hosts

### 9. Keep the familiar interface, but make it a replaceable profile

Preserve initially:
- Overview, Learn, Interact, Quiz, Review.
- Progress pie charts and completion counters.
- Source citations and printed-page references.
- Shared quiz status and distinct desktop/mobile lab grades.
- Current typography, navigation and graphical widget styling where reusable.

**Never hard-code tab names or their order into canonical content, grading, source evidence or progress.**

Extend PresentationProfile with identity/version, supported hosts, semantic block-to-region mappings, navigation, widget slots, source citation rules, assessment presentation and progress visualization adapters. All progress pies must consume authoritative **progress projections**, not inspect the DOM for grades.

Demonstrate two fully functional profiles using the exact same lesson IDs, questions, evidence and scores:
1. Classic five tabs with progress pies.
2. Linear reading or another clearly different navigation layout.

Switching profiles must not modify lesson content or historical progress. A profile must fail or use a reviewed fallback when it cannot render required blocks; never silently omit content. Keep accessible keyboard focus, labels and practical touch targets even when desktop and mobile use different layouts.

### 10. Portable Windows, Android and offline curriculum

The desktop and phone applications share approved curriculum bundles, source records, assessment rules, simulation calculations and stable IDs, but use independent presentation/lab adapters. Desktop windows/panels and mobile touch flows remain separate.

Keep the domain **free of DOM, Node, HTTP, Supabase, GitHub, Electron/Tauri and Android-specific APIs**. Implement host adapters at explicit ports. Approved content must be loadable locally after installation; GitHub is development/publication infrastructure, not a runtime identity, content or sync provider. A private app must not require live ChatGPT access to display previously approved lessons.

Existing Electron and Tauri shells are evaluation prototypes only. Do not choose a permanent shell, ship an official installer/APK, request code-signing services, or modify production account/cloud infrastructure without approval. When adding native persistence, use scoped local storage and explicit export/backup/import with transactional round trips. Never silently copy production browser-origin storage into native profiles.

### 11. Developer-controlled Schema V3 publication

Build a deterministic publication pipeline from private reviewed authoring bundles to allowlisted approved learner content:

1. Explicit private input and schema validation.
2. Evidence/locator/edition verification status and source-rights review.
3. Topic graph, prerequisite and composition validation.
4. Assessment generator/evaluator and safety tests.
5. Lab capability, widget registry and rubric compatibility checks.
6. Presentation compatibility checks for desktop/mobile/classic/alternative profiles.
7. Human-readable content and grade-impact diff.
8. Recorded technical/educational/owner approval.
9. Immutable revision/hash and reproducible approved bundle build.
10. Private preview and staging acceptance.
11. Exact-commit CI and served-asset read-back.
12. Previous revision retained for rollback.

An imported artifact is **not** approved by default. Do not route Schema V3 through legacy schema-1/2 importers or allow unreviewed drafts to grade learners. Public bundles exclude private proposals, source scans, internal storage IDs, secrets and personal progress. No website source-upload endpoint is needed.

Deliver at least two validated private pilots with a real graded-capable adapter tested on **synthetic** learner data, then obtain owner acceptance before enabling those pilots for actual learners.

---

# PART D — Complete historical migration and conditional demolition

### 12. Finish the full legacy preservation ledger

The owner wants all obsolete V1/V2 lesson modules **removed from the V3 learner experience after the replacement is ready**. This is a many-to-one/many-to-many **knowledge migration**, not a delete-and-regenerate exercise.

Revalidate the complete inventory of 63 lessons, 542 questions, 195 activities, 167 reference dependencies and 24 safety-critical questions against actual HEAD. Resolve each of the 967 migration entries with a reviewed disposition. Keep the original item identity and original content/grade fingerprints.

Permitted dispositions include:
- incorporated into a canonical lesson;
- referenced as a shared topic/block;
- converted to a reviewed static or parameterized question;
- converted to a platform-specific lab activity;
- preserved in read-only historical archive;
- superseded by a reviewed correction, with rationale;
- pending unavailable source verification;
- explicitly excluded with an approved reason.

Support several legacy lessons mapping to one canonical lesson, and one overbroad legacy lesson mapping to several new topics. Do not infer equivalence from similar wording or titles. Preserve every historical grade, answer key, review date, source citation and safety warning. Original graded activity IDs may differ from positional inventory keys; do not invent historical grade identities.

Produce a complete **source/knowledge coverage report**, **assessment equivalence report**, **safety coverage report**, **historical progress round-trip report**, and **old route/dependency report**. Unresolved gaps must remain visible.

### 13. Migration adapters and historical grades

Provide read-only legacy compatibility for old progress and historical assessment interpretation, even after old lesson routes are retired. The active V3 curriculum should not require the old renderer to author or render NEW lessons.

Design explicit migration mappings from legacy lesson/question/activity identifiers to new objectives/templates/modules, with status and reviewed rationale. No credit transfer until semantic and rubric equivalence is approved. Unknown fields and conflict copies must survive export/import.

Test with sanitized/synthetic records modeled on actual legacy shapes:
- every old question and review schedule remains readable;
- correct/incorrect history and timestamps survive;
- new question variants do not replace old attempts;
- independent desktop/mobile practical results cannot overwrite each other;
- account identity mismatch fails closed;
- partial migration can resume safely without double credit;
- rollback restores the old view of data without dropping new records.

Never perform migration writes against production Supabase during this assignment.

### 14. Conditional retirement of legacy lesson code

**Do not begin destructive retirement until ALL gates are met:**

1. Every legacy lesson/question/activity/reference has an explicit reviewed disposition.
2. Original structured source knowledge and page references are recoverable.
3. Every safety-critical item is accounted for.
4. Canonical replacement lessons are complete, useful and owner-approved.
5. New assessment/desktop/mobile practical modules and rubrics pass tests.
6. Historical progress and review schedules round-trip without loss.
7. Old-to-new credit equivalence is explicitly reviewed; no unearned credit.
8. Both presentation profiles and both platform interfaces work.
9. No active new-lesson route depends on old lesson-specific modules.
10. A pre-demolition Git tag, verified backups and migration manifest exist.
11. A rollback rehearsal actually succeeds.
12. Staging CI and exact-served-asset verification pass.
13. **The owner explicitly approves the exact V3 deletion scope.**

If any gate fails, stop demolition and keep implementing prerequisites. A schema, inventory, read-only preview or two private drafts alone do not authorize removal.

Once approved, remove obsolete **lesson-specific** content/routes/renderers and redundant old question logic from the **V3 development application**, replacing them with canonical Schema V3 modules. Keep reusable circuit models, graphics, instruments, registry, project manager, source evidence, historical read-only adapters and all needed migration maps. Do not erase Git history or source archives. Do not touch stable production V2, V1 backup, Supabase production records, private learner history, raw files or unrelated Storage resources.

Create a tested pre-demolition rollback point. Never delete user data to make an older frontend appear compatible.

---

# PART E — Verification, quality and owner acceptance

### 15. Required deterministic tests

Add focused tests to existing suites for:

**Domain/knowledge:** UUID identity versus title/alias, immutable revisions/hashes, graph cycles, source/edition/page validity, missing/unverified evidence, conflicts, topic duplication, shared-block composition, semantic coverage, unsupported block rejection, lesson merge/split proposals and source-rights boundaries.

**Ingestion:** Eight fixtures for duplicate/new/conflict/subtopic/new lesson/split/merge/missing citation; reviewable diffs; no automatic publication or AI calls.

**Assessments:** deterministic seeds, generator versions, all finite value combinations, zero/negative/division boundaries, units, tolerance, distractors, safety questions, tamper rejection, old instance reproducibility, no accidental repeated-practice grade inflation, immutable historical grades.

**Practical labs:** independent desktop/mobile module IDs/versions/grades, either-platform completion, shared core quiz only once, meaningful graph-based rubric checks, invalid probe/jack/power states, mobile touch interaction, no duplicate electrical solver.

**Presentation:** five-tab/pie and linear profiles consume identical canonical IDs/evidence/questions/progress, changing tabs does not change grades, unsupported block type fails safely, source references remain visible, progress pie is a pure projection.

**Persistence/migration:** transactional local saves, interruption recovery, export/import, identity mismatch, revision conflicts, legacy 967-entry disposition accounting, historical answers/schedules/safety coverage, zero production writes, backup/rollback rehearsal.

**Privacy:** no raw PDFs, private authoring bundles, internal Storage paths, service keys or learner events in public GitHub build allowlist, staging assets or CI artifacts; no runtime GitHub/ChatGPT dependency for installed curriculum.

**Regression:** original approved lessons, 336 preserved question IDs, existing 63-lesson inventory, progress, review rules, widget registry, desktop canvas, phone lab, projects and source references remain functional until approved cutover.

### 16. Browser and native acceptance

Use real Chromium browser tests at 320 px, 390 px and desktop widths, plus existing Windows Electron and Tauri evaluation CI where applicable. Keep external paid/model and production network requests blocked during tests.

For each pilot demonstrate:
- classic Overview/Learn/Interact/Quiz/Review with progress pie and citations;
- switch to linear presentation with same knowledge/IDs/grades;
- parameterized practice varies values and shows correct explanations;
- graded instance is reproducible from stored seed/version/hash;
- desktop and mobile practical grades are independent;
- either-platform practical completion does not fabricate the other platform's score;
- lesson revision enrichment adds a new source without duplicating the lesson or rewriting prior grades;
- unsupported or unreviewed draft cannot award real learner credit.

Produce owner-review screenshots and a clear manual acceptance checklist. CI correctness is not equivalent to owner educational approval. Private source-derived review previews must remain private; public CI screenshots should use synthetic content only.

### 17. Development order and milestones

Work in this order, with small verified commits. Continue to the next **authorized** milestone while usage remains; do not stop after an arbitrary phase if it is safe to proceed.

**Milestone 1 — Complete content/source review and pilots.**
Review private Resistors/DMM evidence and taxonomy, expand meaningful content, document unknown editions/pages, add predictions, examples, debriefs and lesson-specific desktop/mobile practical definitions. Preserve private bundles and owner-review sheets. Do not award grades yet.

**Milestone 2 — Real assessment and persistence adapters.**
Integrate deterministic instances, answer validation, private durable events and versioned rubrics with both platform labs. Use synthetic learner fixtures; prove offline/recovery and no old grade changes.

**Milestone 3 — Authoring and publication.**
Complete deterministic ingestion/search/review decisions and developer-controlled approval/export/publish adapters. Build classic and linear learner renderers from approved bundles; demonstrate changing UI without rewriting content.

**Milestone 4 — Pilot acceptance.**
Present reviewed Resistors/DMM lessons in isolated preview/staging when safe. Require owner educational/usability acceptance and exact-commit CI/hash read-back before making them active for real learners.

**Milestone 5 — Full migration coverage.**
Map the entire legacy inventory and source evidence; complete history and safety reconciliation, progress compatibility and rollback rehearsal. Never silently invent grade equivalence.

**Milestone 6 — Conditional V3 demolition.**
ONLY after all demolition gates and explicit owner approval, remove obsolete V3 lesson-specific implementations/routes/content. Preserve historical readers and all production/V1/backup data. Verify clean new routes and rollback.

If milestones 4–6 cannot pass their gates within the current usage window, leave completed safe work committed and continue next session. Do not bypass approvals to maximize usage.

### 18. Git, CI, staging and spending controls

- Work from the latest verified V3 development branch; use a scoped feature branch if appropriate, with a clear integration/handoff plan.
- Never merge to main, publish production, alter V1, delete production records, reset Supabase, deploy Edge Functions, or change production credentials.
- No new paid AI calls, cloud backend, GitHub-hosted private authoring data, or external paid services without separate approval.
- Run targeted tests after each change, full relevant regression gate before marking a milestone verified.
- Do not claim staging deployment from a successful build alone: verify build-info, exact commit SHA and all expected served asset hashes.
- Keep official Windows installer/Android APK release decisions separate from lesson migration.
- Do not rewrite existing graded semantics without explicit authorization.
- Protect private sources and user progress from public repo/history/artifacts.

### 19. Durable checkpoint and resumption

Update docs/v3/MODULAR_LESSON_CHECKPOINT.md (or linked successor) after each verified milestone. Include:
- exact branch/commit and tested SHA;
- what is implemented versus interface-only or deferred;
- private artifact location/hash and durable backup instructions;
- approved/unapproved source claims and content revisions;
- current count of reviewed versus unresolved legacy mappings;
- pilot lesson status, graded/ungraded status and owner approvals;
- tests passed/failed and deployment read-back evidence;
- rollback state, unresolved defects, explicit next steps and approval gates.

When interrupted by usage limits, preserve tested commits, unfinished work and checkpoint. On resumption inspect actual HEAD/status, validate incomplete operations, then continue without repeating finished audits or rebuilding completed architecture.

### 20. Final handoff report

Provide a concise but complete report containing:
1. Commits and changed files.
2. Actual implemented features and reused existing systems.
3. New canonical lesson coverage, sources and unresolved evidence.
4. Parameterized question families, rubric and persistence status.
5. Desktop/mobile practical modules and independent grading status.
6. Classic/alternative presentation proof.
7. Ingestion/review/publication workflow status.
8. Legacy mapping coverage and **whether demolition is still BLOCKED**.
9. Automated/browser/native test results and exact staging read-back.
10. Private artifact handling, backups and rollback procedure.
11. Owner testing checklist.
12. Deferred features and approvals needed.

**Never call a private draft an approved graded lesson, a contract an implemented storage transport, a CI screenshot owner acceptance, or an inventory a completed migration.**

### Final acceptance definition

The new V3 lesson engine must be able to:

- show one expandable **Resistors** lesson and one **DMM** lesson built from reusable topics and multiple accurately attributed sources;
- accept a new reviewed source insight and update the appropriate existing lesson via a new revision instead of creating a duplicate book-specific lesson;
- add reproducible dynamic practice and independently graded desktop/mobile labs without rewriting past attempts;
- render the same canonical lesson and grades in a classic five-tab/pie UI and an alternative presentation;
- run from approved local curriculum bundles without GitHub or ChatGPT online;
- preserve historical grades, references and source knowledge while retiring obsolete legacy lesson code **only after the explicit gates pass**.

Begin by reading the current modular checkpoint and completing the real private Resistors/DMM educational pilots. Then implement and verify the next authorized milestones, checkpointing for future sessions.
