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
