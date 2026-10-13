# Prompt and design audit — October 13, 2026

Scope: development branch `draft/v2-dmm-companion`, staging Worker `eu-v2-staging`, isolated Supabase `hkwmtjhgrskidaizamwy`. Baseline commit `a51fc9b5b8a56b91b1e2d11908fee16367c10514`. All code changes are staging-only. No paid calls, financial authorization changes, lesson approvals or data edits.

## Context reviewed

Visible project chat summaries and two Personal Context retrievals cover original tutor requirements, design/track decisions, Cloudflare setup, mobile upload, book catalog, recovery, Sol-only routing, spending controls, chapter batching, citation/approval fixes, and the later lesson-format/Legacy/dashboard changes. Both original QA and stabilization reports were read in full, along with the current specification/design documents, implementation checkpoint and repository history. Personal Context returns summaries, not a complete export of every message; exhaustive transcript review cannot be claimed.

## Structural inspection

Live staging browser: dashboard, exam, textbooks, laboratory, mathematics, review, Legacy and Account/Scan Inbox access gates. Source inspection covered lesson rendering and simulations, quiz persistence/reviews, approved inventory/dashboard routing, private book/upload controls, durable attempt/approval handler, financial migrations and paused lab/tutor endpoint. The browser is signed out: real private scan controls and owner-only chapter workbenches were inspected through code and mocked automated workflows, not an authenticated live session.

Live database: Chapter 3 approved, revision 54, 16 units, 18 evidence facts; two progress rows. Full scan-row baseline MD5 `7603a8fcd0ad449bcd1c542f59edf2c7`. No source/lesson/progress/budget writes. Chapter 3 remains archived by its exact source identity; future chapters remain active.

## Repairs

- One shared teaching contract accompanies every active paid scan stage. It specifies the five-tab guided tutor, plain explanations, symbols/units/assumptions, intermediate worked steps, discussion/prediction before feedback, misconceptions/debrief, ten varied checks including written reasoning, and source-grounded activities.
- Drafting now obeys one selected unit and outline routing, avoiding conflicting directions to create extra reinforcement lessons. Model extraction is no longer described as certified/verified truth. Technical review explicitly checks educational completeness and states whether original pages were actually inspected.
- Extraction guidance matches the existing 2–30-fact validator instead of requesting 3–18 regardless of source complexity. Outline guidance requires high-confidence coverage and avoids lesson-count padding. Verify data reports uncovered facts and unresolved gaps.
- One Run/Resume button sequences durable Sol checkpoints and remaining unit draft/reviews. It never approves, automatically corrects/retries failures, rebuilds completed evidence, or silently exceeds the spending session. Initial source stages save before known chapter exposure is checked. Insufficient exposure retains the outline and stops before lesson generation.
- Verify data downloads the stored original and checks extraction, outline, current/pending draft structure, references, saved review readiness and approved historical references without OpenAI calls. Older approved formats are reported without rewriting them. It is structural verification, not independent source interpretation.
- Approval and pause remain visible; advanced stage/retry/recovery controls are collapsed; attempt logs stay below controls. Existing accounting, citations, source download/delete, uploads/books and sync controls remain available.
- Decimal/scientific numeric answers now become deterministic quiz checks. Real paragraph breaks render correctly. Learn includes source-related discussion prompts before moving to Interact, without revealing answers.
- Active CETa guide counts now come from active inventory; published labs no longer claim to be only in development.
- Removed unreachable unprotected paid-provider implementation from the paused lab/tutor backend. Benchmark scenarios remain metadata; neither endpoint has a dormant dispatch to accidentally enable with a presentation edit.
- Added root `AGENTS.md`, the durable teaching/design contract, and workflow/prompt/renderer regressions to guide future chat-led changes.

## Why requests remain separate

User's single-call suggestion was optional. One giant chapter response would share one output limit across every lesson, lose separate technical review and make interruption or a bad lesson costly to correct. The UI now offers one run action while the backend preserves evidence, outline and per-lesson checkpoints. All active calls use Sol/default; review is a separate pass by the same model, not independent-model corroboration. No prompt can guarantee model accuracy or educational quality.

## Verification and remaining boundaries

Local: 164 tests pass, syntax checks pass, staging build and asset/module validation pass. Mocked workflow proves plan/extraction/outline → all lesson draft/reviews → pending manual approval, interruption reuse, known-ID polling, unknown-outcome refusal, no-progress/source-change stops, insufficient chapter exposure, and free structural verification. New prompts were not evaluated through paid inference.

Keep the page open during a run. Leaving/reloading pauses browser orchestration; a submitted request may continue and its saved response can be collected later. No webhook/unattended completion system is certified. Written quizzes remain self-assessments, not an automated written-answer grader. Numeric checks are deterministic when the answer has the supported single-quantity format. Interact supplies typed predictions/revealable feedback and approved reusable simulations, not arbitrary newly authored widgets.

An arbitrary long chapter cannot be certified complete from a 30-fact extraction and 5 MB source limit. All new lessons must stay within visible evidence; long/complex chapters may need multiple coherent excerpts. The existing data model treats each upload as a source job, rather than merging multiple uploads into one chapter automatically.

Financial reservation, dispatch claim, unknown-billing holds and provider estimates remain unchanged. Exposure is not expected actual cost or a provider-account spending cap. Refresh, verification, free recovery and navigation never imply spending authorization.

Deployment evidence will be appended after exact-commit CI and live readback. Real signed-in phone/desktop interruption and source correctness remain owner acceptance checks. No production release is implied.

## Questions for James — optional, current assumptions stated

1. Do you want generated lessons to include more custom adjustable circuit/graph widgets, or is typed prediction plus the relevant reusable simulator enough for now? Current implementation uses predictions and approved reusable simulators; custom widget authoring needs a vetted template system.
2. Should the ten questions have a fixed multiple-choice/numeric/written mix? Current schema supports deterministic single-quantity numeric checks and written self-checks, with varied tasks; it does not generate multiple-choice distractors. The original authored lessons already use multiple-choice.
3. For long chapters supplied in several uploads, should those uploads be gathered into one chapter before planning? Current assumption is coherent source jobs under the same saved book, with overlap comparison and no claims about unseen pages. Automatic multi-upload chapter aggregation would need an explicit chapter grouping design.

No answer is required to preserve the implemented improvements. No prior settled choice (Sol-only, independent math, Legacy Chapter 3, dashboard links, human approval, spending protections) is asked again.
