# Electrical Understanding v2.0 — Lesson Progression & Source-Scan Requests

**Status: DESIGN / acceptance criteria, not an enabled website scheduler or running AI service.**
**Intent:** The learner studies chiefly on the phone/desktop website. The site tracks each track and sub-track separately, makes the next approved lesson available when prerequisites are met, and asks for the **specific book/manual scans required** only when that content becomes relevant. ChatGPT conversations are reserved for curriculum revisions, deeper explanations, and exceptions.

## Default cadence and immediate event behavior

1. **Immediately after a graded submission is saved to Supabase**, recompute that learner's completion and mastery *for the affected lesson/sub-track*, and check for its next approved lesson. Do not require a refresh or a new chat prompt. A completed prerequisite can unlock already-authored lessons **immediately**.
2. **Six-hour reconciliation**, server-side: re-evaluate all *active, opted-in sub-tracks* for unfinished prerequisite transitions, pending source materials, approved lessons ready to release, and failed generation jobs. The six-hour cadence is a **fallback/reliability check**, not a reason to delay unlocking prebuilt content.
3. Maintain **at least one approved lesson ahead** of the learner, where enough verified content exists. When the learner reaches the end of the approved backlog, prepare the **next one candidate lesson per eligible sub-track** (not an unlimited batch). A generation job can run after completion or during the next six-hour reconciliation and moves through DRAFT -> VALIDATING -> APPROVED/NEEDS_REVIEW -> PUBLISHED. Quality and safety checks may delay publication.
4. Each *sub-track* has its own progression cursor, prerequisites, backlog and status. **Do not generate lessons merely because a track exists**. Only active and source-ready sub-tracks are eligible. Paused/queued tracks are excluded from generation but retain existing progress and content.
5. **Spaced review** is a separate stream: due questions appear daily/on login (e.g. after 1, 7 and 30 days as starting review intervals) without resetting completed lessons. Repeated failures can recommend a targeted refresher or practice exercise while leaving other sub-tracks usable.
6. **No invented promises:** These are intended behaviors for a to-be-built Supabase-authenticated backend worker / job queue (e.g. an Edge Function and scheduled job). GitHub Pages static hosting, the existing Supabase connection, and a normal ChatGPT conversation do **not** create this service automatically. Do not advertise six-hour checks or AI lesson generation as live until deployed, observable, and tested end-to-end on phone and desktop.

### Cost-aware reconciliation contract (every 6 hours)

- Schedule a **lightweight state/queue reconciliation** on a six-hour cadence (illustrative UTC cron: `0 */6 * * *`). The scheduler is not a subscription to AI model queries.
- Check **only active, opted-in sub-tracks with changed progress, due retries, approved pending content, or overdue source requests**. Paused/empty/no-change queues are ignored without model inference. If no work is due, **perform no paid AI/API calls**.
- Track `last_event_version` / `last_reconciled_version`, status timestamps and a durable pending-job queue to avoid full rescans and duplicate releases. The completion event runs immediately; the six-hour scheduler repairs missed events and resumes incomplete work.
- Budget caps per day and per month, cost-per-generated-lesson estimates, maximum concurrent jobs, user-approved quotas, and a manual **Generate next** control. Upon reaching the budget cap, defer the generation and show the reason; never charge through uncontrolled retries.
- Scheduling exact wall-clock time and available cron facilities are to be confirmed during backend implementation; not yet live.

### What "completion" means

- A quiz submitted is not automatically a passed lesson. Require the declared passing criterion, completion of critical teaching-point interactions and (for physical tasks) safety checkpoints, correct equipment setup and evidence as appropriate.
- Ten scored questions per future full lesson, plus numerous ungraded concept predictions. Written AI feedback may be provisional; fail-open is inappropriate for current/voltage measurement safety and any dangerous wiring scenario.
- **Independent completion** for CETa core, Associate CET Guide, each textbook, and each EIM manual. Shared mastery tags aggregate evidence but do **not** auto-complete separate lessons or physical projects.
- A scan-required book lesson can be BLOCKED_AWAITING_SOURCE while unrelated CETa theory or different textbook study continues.
- The Analog EIM kit is **staged/paused after §2.1**; no scans or generations for §2.2+ until explicitly resumed. FPGA and RP2040 waiting.
- Source-based projects should not automatically become "completed" solely from simulation; real-build evidence is its own progress dimension.

## Source request engine ("Scan Inbox")

### Metadata required for every book/manual section
- Stable source_id, track_id, subtrack_id, book/manual edition/revision when known, chapter, subsection, printed page span if known, page_verified boolean, scan_status, last_request_at, source_uploaded_at, reviewed_at, upload_private_file_reference.
- A request explains **exactly why** a scan is necessary, precisely which *minimum page range or diagrams* are needed, what activity depends on it, and how the learner can continue without it.
- Prefer asking for **a small section** (title, figure, equipment list, circuit diagram, steps and relevant results), not entire books. When no exact ending page has been confirmed, request section-start-to-next heading and label it a guess.
- Never request the same verified section twice. Do not re-request EIM PreLab p. 1 or DC 02 p. 28 (now resolved as intentionally blank), nor CET Study Guide contents (now supplied).
- Source gaps: \`NOT_NEEDED_YET\`, \`NEEDED\`, \`REQUESTED\`, \`UPLOADED\`, \`UNDER_REVIEW\`, \`VERIFIED\`, \`NEEDS_BETTER_SCAN\`, \`SKIPPED\`. Requests de-duplicate on source_id + edition/revision + required section and reopen only for actual missing or unreadable evidence.
- The user can **dismiss / snooze / upload now** from the website; optional email/push notifications only after opt-in. The assistant cannot automatically send a new chat message from the website by magic.
- Textbook scans and actual handwritten notes live in **private, authenticated Supabase Storage (with correct RLS/storage policies)** or other approved private source storage, not a public GitHub repository. Publish only original explanations, diagrams, exercises and concise chapter/page citations.
- AI analysis after upload is a backend task requiring an approved model API; scanned source-based generation must document whether the content came from the provided pages, previously verified data, or original educational extension. Blurry/truncated diagrams become a targeted re-scan request.
- A **"What I need from you" panel** displays only blocking/valuable scan requests for active sections, not pages for paused kits. Example: "Basic Electric Circuits — DC 03 schematic and procedure (starts p. 29): Needed to build the divider fault simulation. Scan the experiment pages when you reach it; DC 02 remains available in the meantime."

### Example UI states

| Section | Status | Site behavior |
| --- | --- | --- |
| CETa Core Unit 2, lesson after Pilot Unit | Source-independent / lesson authored | Unlock immediately after prior mastery; if next lesson not authored, enqueue safe structured draft |
| CETa Guide Chapter 4 | TOC known; detailed content not scanned | Prompt for selected subsection pages only when a chapter companion is activated; other CETa work proceeds |
| *How to Diagnose and Fix Everything Electronic* Ch. 6 DMM | pp. 97–103 verified | Prepare lessons from verified scan without re-request |
| EIM Basic Electric Circuits PreLab / DC 02 | verified | Build actual hands-on companion lessons from existing scans; next selected project scanned only when necessary |
| EIM Analog §2.2 onward | PAUSED | No scan prompt or generation |
| FPGA / RP2040 | WAITING | No scan prompt or generation |
| Other textbooks still in mail | AWAITING_BOOK | No urgency or blank completion penalty |

## Dynamic lesson implementation principles

- **Generate structured lesson content, not untrusted executable JavaScript.** Interactive experiences use vetted reusable components (sliders, movable virtual probes, waveform charts, breadboards, resistance network explorers, fault injectors, drag/drop sequence, etc.). AI may choose an interaction template and parameters that pass schema validation and electrical formula tests.
- Future content can be served from authenticated Supabase lesson/content tables rather than committing a new JS application bundle to GitHub every six hours. GitHub continues to manage the application and its tested component library. Source uploads remain private. Never permit AI to inject arbitrary scripts into the browser.
- Source-grounding gate: reject lessons that invent textbook/manual pages, unverified real hardware pinouts/ratings, or unsupported learning claims; request minimum necessary scans.
- Engineering gate: verify units/dimensions, calculated examples, numerical quiz answers/tolerances, cross-track references, safe volt/current/resistance hookups and critical simulated fault states. Require additional explicit human review for physical-hardware steps, safety-critical content, AI-origin answers of low confidence, and any major code change.
- AI feedback, source analysis and generation require **server-side API credentials** not stored in the GitHub Pages bundle, plus usage limits, rate limits, privacy controls, retry budgets, and a visible "AI services unavailable" fallback. Model API usage is separately billed and must be budgeted/authorized.
- Persist content status \`AVAILABLE\`, \`PREPARING\`, \`WAITING_FOR_SCAN\`, \`REVIEW_NEEDED\`, \`PAUSED\`, \`GENERATION_FAILED\` (and timestamps). Students can always revisit completed material, even while a new lesson waits.

## Reliability, idempotency, synchronization

- Completion event -> transactional authorized progress update (or proper conflict detection) -> idempotent next-lesson evaluation.
- Unique generation job key: (subtrack_id, next_lesson_id, syllabus_version) for shared curriculum, not one duplicate job per device or user. A lesson generated once can be assigned to many learners; private user progress stays separate.
- Use job queue with attempts, next_retry_at, lease/heartbeat, terminal failure visible, backoff, and per-sub-track last_checked_at / last_published_at. Cron re-evaluates missed events every six hours. Add monitoring/alerts when a job is stuck.
- Source request uniqueness and "once reviewed, no repeat" logic. Logged provenance by page/source revision; on new sources, update only relevant drafts rather than rewriting completed units.
- Prevent desktop/mobile stale write overwrites using server-side version or updated_at / optimistic concurrency. Test simultaneous submissions, disconnect/reconnect, local offline cache and reconciliation.
- Human-readable status on dashboard: "Up to date", "Next lesson available", "Preparing next lesson", "Scan requested", "Review due", "Paused", "Needs attention". A visible **Last checked** timestamp and **Retry** option (for permitted failed jobs) avoids silently stalled tracks.
- Opt-in notifications: in-app by default, optional email or other configured channel. Never spam; consolidate multiple scan requests into a digest.
- Quality assurance before promising reliability: mocked workflow tests for all three tracks and their independent sub-tracks, prerequisites, safety gate, no duplicate jobs, bad/late scans, pausing, retries, recovery after server downtime, cross-device sync and stale writes.

## Compact suggested admin/operator dashboard

- Queue: lessons published, drafts pending review, blocked by scan, generation failed, upcoming reviews.
- Generation metrics: last run, status, jobs completed, pending, failed, API cost estimate, rate-limit state.
- Content quality: unsupported figure/page references, safety issues, quiz validation status, untested interaction schema.
- Manual override to approve, request source, pause/resume, skip redundant content, reorder priorities or re-run generation.
- User-facing graph denominator: **avoid misleading "overall 14%"** when total lesson count can grow. Separate **published content completion** vs **planned syllabus coverage** vs **skill mastery**. Paused/waiting books don't count as overdue/incomplete.
- Release rollout: Stage A reliable pre-authored lessons + completion-driven unlocks; Stage B six-hour reconciliation and Scan Inbox; Stage C server-side AI grading; Stage D controlled source-grounded next-lesson generation. Do not label Stage D working before it is deployed.

## Palette/design tokens

The learner's favorite colors are **light blue and cyan**; emphasize these in the dashboard charts and interactive controls. Use yellow gradient lightning-bolt brand icon from the separate v2 branding brief.

Suggested **design direction only** (contrast to validate):
- Deep navy canvas: \`#101B2A\`; panel: \`#19283B\`; lighter panels: \`#21334A\`.
- Pale ice-blue typography/highlights: \`#E6F7FF\`; sky blue: \`#83CFFF\`.
- Bright cyan: \`#35E0F2\`; softer cyan: \`#6FE5E6\`.
- Lightning bolts: three distinct yellows \`#FFF0A6\`, \`#FFD84D\`, \`#F5AF27\`.
- Success/caution/error must not depend on color alone: icons, text, patterns; selected bright blues contrasted against dark surfaces, labels accessible.

Dashboard chart choices to implement after data-model test: overall *active syllabus* coverage, track/sub-track stacked progress, lesson activity timeline, competency heatmap/radar *with accessible table alternative*, review-due trend, and lab theory-vs-measured evidence. Do not fabricate progress stats to populate visuals.
