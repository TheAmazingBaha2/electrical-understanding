# Electrical Understanding v2.0 — Feature Specification & Release Plan

**Document status:** APPROVED DESIGN BASELINE (ready for implementation planning; **not built or deployed**)  
**Date:** October 10, 2026  
**Target deployment:** https://theamazingbaha2.github.io/electrical-understanding/  
**Working draft / review:** https://github.com/TheAmazingBaha2/electrical-understanding/pull/1  
**Source of truth:** This specification plus the linked topic drafts in \`docs/v2/\`. This is a living engineering document; substantive changes require review before deployment.

---

## 1. Product goal

Turn Electrical Understanding from a five-lesson practice website into a **long-term, self-contained, interactive electronics learning environment** for Associate CET (CETa) examination preparation, independent hardware design, and hands-on technician skills.

The student primarily **uses the website**, not an ongoing ChatGPT question-and-answer thread. The site explains concepts like a patient human tutor, makes the learner predict and interact with electrical phenomena, gives detailed feedback, tracks retention, and uses book/manual scans only when the chosen activity truly needs them.

**Non-negotiables:** preserve existing five pilot lessons and recorded progress; synchronize across desktop/phone; source-ground book/manual content; do not mix kit hardware without verification; prioritize measurement safety; no hidden unlimited AI spend; paused manuals never generate new assignments.

## 2. Final content hierarchy

### Track 1 — CETa Preparation

- **Core CETa Course:** original, prerequisite-based units. Existing \`L01\`–\`L05\` become **Pilot Unit 1** with unchanged stable IDs; future lessons have more human explanations, purposeful interactions at every major teaching point, and 10 scored questions.
- **Associate CET Study Guide Companion:** independent sub-track using the **supplied two TOC scans** establishing **9 units, chapters 1–22 and appendices**; preserve chapter titles/page starts in \`CETA_GUIDE_CONTENTS.md\`. Only specific detailed chapter pages still need future scans. This guide belongs to Track 1, **not** Track 2.
- **CETa Practice & Review:** diagnostic-led practice, cumulative competency tests and spaced retrieval; avoid representing unofficial practice questions as official exam items.

### Track 2 — Textbook Companions

Each book has its **own sub-track, chapter/section tree, progress and review queue**, separate from CETa core:

1. *How to Diagnose and Fix Everything Electronic*, 3rd edition — available; Chapter 6 Digital Multimeter pp. 97–103 has a drafted **seven-lesson/capstone** companion, \`DMM_COMPANION.md\`.
2. *Teach Yourself Electricity and Electronics*, 7th edition — listed, awaiting book and scans as needed.
3. *Electronics: Principles and Applications* — listed, exact edition on arrival.
4. *Cabling: The Complete Guide to Copper and Fiber-Optic Networking* — listed, exact edition on arrival.

Do not treat missing books as overdue work. No user-scanned copyrighted pages go into public website assets.

### Track 3 — EIM Hands-On Laboratory

Each kit/manual has its **own** project list, component inventory, physical measurement records, experiment IDs and completion:

1. **Basic Electric Circuits — CURRENT DEVELOPMENT PRIORITY.** TOC, PreLab pp. 1–12 and DC 02 pp. 21–27 reviewed. Build the PreLab Bench Readiness and DC 02 Three-Resistor Challenge companions; then curate further experiments selectively.
2. **Fundamental Analog Circuits and Semiconductors — STAGED / PAUSED after §2.1 (pp. 81–93).** Keep existing index and instrument notes; do **not** request §2.2+ or develop further analog lessons until the learner explicitly resumes.
3. **Fundamental Digital Design with FPGA — WAITING.**
4. **Introduction to Microcontroller with RP2040 — WAITING.**

**Two-kit limit:** at most two EIM manuals allocated concurrently, with **one currently developed in earnest**. The four kits have distinct component sets; do not assume interchangeable parts or compatible voltage rails. No cross-kit builds are assigned in this release.

**Completion philosophy:** select worthwhile real measurements, debugging, circuit prediction and design work; combine redundant tasks without skipping first-time safety/measurement skills. "Simulated" and "physically completed" are distinct achievements.

## 3. Design language / navigation — F-01

- **Visual identity:** deep navy canvas/panels with **light blue, sky blue and cyan** as the main accents: proposed \`#101B2A\`, \`#19283B\`, \`#E6F7FF\`, \`#83CFFF\`, \`#35E0F2\`, \`#6FE5E6\`; validate accessibility contrast.
- **New icon:** three sequential/staggered lightning bolts in three distinguishable yellows (\`#FFF0A6\`, \`#FFD84D\`, \`#F5AF27\`) for sidebar mark, favicon and installable PWA icon. Crisp at small sizes. Icon asset to be created in implementation, not represented as already generated.
- **Navigation:** Dashboard; CETa Preparation; Textbook Companions; Hands-On Lab; Review Queue; Scan Inbox; Account & Sync. Track landing pages show their sub-tracks and clear **Active / Paused / Awaiting Book** states.
- **Responsive:** wide charts and lesson + circuit side-by-side on desktop; stacked panels, touch-friendly virtual controls and compact nav on phone. Screen reader/keyboard access, reduced-motion respect and error text that doesn't rely only on color.
- **Acceptance:** every top-level track/sub-track is findable in ≤3 actions; desktop and Android layouts are usable without horizontal overflow; branded icon visible as favicon/site mark; dark theme maintains legible contrast.

## 4. Dashboard, graphs and drilldowns — F-02

**Overview:** "Resume where you left off"; current focal lab; next available CETa lesson; upcoming reviews; valid source requests; cloud sync state.

**Visuals, each drawn from actual saved records (no invented demo figures in production):**

| Display | Primary measure | Interaction |
|---|---|---|
| Scope-labeled progress ring | Completed vs currently assigned/released lessons (not future infinite curriculum) | Open counted units and denominator |
| Track & sub-track progress bars | Units/chapters completed, active, paused/waiting | Select a sub-track and resume |
| Competency heatmap (radar optional) | Evidence for DC, AC, components, semiconductors, meters, digital, repair, safety etc. | Click a skill to see evidence from all three tracks |
| Assessment trend | First-attempt accuracy, improvement and misconceptions over time | Filter by skill/lesson/date |
| Activity timeline & calendar | Recorded lesson/review/lab activity, with periods of study | Open that day's actual work |
| Review urgency | Due/overdue concepts with scheduled revisit | Start due review |
| Physical lab board | Read, predicted, simulated, built, measured, troubleshot, mastered | Open measurement log by kit |
| Scan Inbox/pipeline | Verified sources, outstanding small scan requests, lesson preparation status | Open request/upload/snooze |
| System health line | Last six-hour reconciliation, sync status, pipeline errors | Show meaningful recovery action |

**Important metric semantics:** distinguish **assigned-course completion**, **curriculum coverage**, **competency mastery**, and **exam readiness**. Adding content must not silently make historical achievements disappear. Waiting/paused manuals do not dilute active completion. The earlier informal 40-question diagnostic can be shown as *baseline only*, not a CETa pass prediction.

**Acceptance:** charts match underlying query results and update after cloud sync; empty states say "No evidence yet"; tapping a visual reveals exactly which records produced it; accessible tabular equivalents for dense graphs.

## 5. Lesson format and interaction standard — F-03

Every substantial concept point follows:

**Explain → Interact → Predict → Debrief**

- **Explain:** clear, conversational language, concrete technician/audio/hardware use, jargon only after defining it, no textbook-like abrupt leaps.
- **Interact:** a real hands-on action rather than a decorative button. Reusable templates include virtual multimeter + movable probes, editable resistor/branch circuits, breadboard connection highlighting, capacitor charge/discharge, frequency/RC plot, oscilloscope waveform manipulation, diode polarity testing and safe fault tracing.
- **Predict:** ask for the learner's expectation *before* showing the solution.
- **Debrief:** explain **why** the behavior followed from circuit relationships, including an incorrect hypothesis's misconception.

**Graded questions:** 10 per new **full lesson**; varied conceptual, choice, numeric, schematic interpretation, troubleshooting, and free text. Embedded checks are additional and can be ungraded. A compact manual exercise may be a "quick check" with fewer scored items rather than masquerading as a full lesson.

**Pilot unit:** existing five lessons remain intact with current question counts and progress; optional later rewrite is separate, with reviewed content/progress migration.

**Acceptance:** each major concept point has a meaningful, touch-accessible interactive task; correct circuit values/units and plausible fault readings; helpful feedback tied to the specific error; all 10 assessment answers/solutions validated before publication.

## 6. AI-written-response feedback — F-04

- Start with explicit assessment rubrics and deterministic safety/numeric checks, without needing an AI API.
- Add optional **authenticated server-side** language-model assessment for conceptual explanations; feedback should say what is correct, which idea is missing, and one concrete next step, with "ask for re-evaluation" support.
- **Never put an AI API secret in GitHub Pages.** Use Supabase Edge Functions or another secure backend, limiting per-user requests, answer sizes, concurrent evaluations and costs.
- No model judgment alone certifies physical electrical safety or dangerous meter hookup competency. Keep a non-AI fallback if the service is offline.
- AI assessment and content creation are **separately billed services**, not automatically covered by a ChatGPT plan.
- **Acceptance:** a written response receives readable, accurate feedback; unsafe current-meter connections fail the deterministic check; quota and offline behaviors show clear status; no secret credentials in public source or client network requests.

## 7. Completion, review and new-lesson generation — F-05

### Event-driven behavior (immediate)

A correctly saved lesson completion triggers an **immediate, cheap backend eligibility check for that sub-track**:

1. Validate passing criteria and safety requirements; distinguish attempted vs passed.
2. Save progress to the authenticated account; avoid stale writes from phone/desktop.
3. Unlock the **next already-approved lesson** as soon as prerequisites are met.
4. If no ready lesson exists and adequate verified materials are available, queue **one** candidate generation/assembly job, not many duplicates.
5. If essential pages are missing, create a source request and allow other sub-tracks to continue.

**No artificial six-hour wait between completed lessons.**

### Backup reconciliation (EVERY SIX HOURS)

- Proposed server schedule: **one lightweight reconciliation every 6 hours** (for example \`0 */6 * * *\` on a configured UTC scheduler; implementation platform/time to be verified).
- Inspect **changed or pending work only**, not every chapter or every book and not all user progress from scratch. Paused/queued books/kits are skipped.
- **No paid AI/model invocation when nothing is pending.** An idle check should be only inexpensive database/queue work.
- Repair missed completion transitions, retry failed jobs with backoff, release previously approved lessons, and surface source requests.
- Track each sub-track's last checked/last progressed timestamp; visible "Preparing", "Awaiting scan", "Review needed", "Generation failed", "Paused" and "Up to date" states.
- Aim to keep **one approved lesson ahead** when sources and validated content permit. AI draft generation is **not** automatic approval: formula/source/safety/content QA may delay a lesson.
- Include per-day/month AI budgets, maximum attempts, rate limits, duplicate generation locks, manual "Prepare next" control and status for quota pauses.

**Definition of reliable:** independent cursor per sub-track, no stalled silence, deduplicated jobs, retry/status visibility and end-to-end tests. Reliability is an implementation and monitoring obligation, **not** something promised by a draft document.

### Spaced retention

New knowledge returns in scheduled reviews (initial suggestion: 1 day, 7 days, ~30 days, adjusted by results). Failed recall prompts a focused refresher but does not erase prior physical completion or force unrelated tracks to repeat.

**Acceptance:** complete a pilot lesson on desktop and see the next approved lesson/same progress on phone without waiting 6 hours; six-hour job performs **zero paid generation calls** when all queues are empty; independent sub-track completion and pause behavior verified; a failed job remains visible/retryable.

## 8. "Scan Inbox" — just-in-time source requests — F-06

- At the moment a *chosen active lesson* genuinely needs source content, show the **smallest necessary scan**: title, chapter/subsection, known start/end page or requested diagram/procedure, explanation of why it matters, and "Upload / Later / Skip for now".
- **Do not ask again** for scans already verified: CET Guide TOC (9 units / 22 chapters), Geier DMM pp. 97–103, EIM Basic PreLab p. 1 and pp. 2–12, EIM DC 02 pp. 21–27. DC 02 p. 28 is blank.
- The EIM Analog manual §2.1 pp. 81–93 remains reviewed and on hold; no proactive requests for §2.2+. No scanning requests for books still in the mail unless learner begins that sub-track.
- Store uploaded scans privately with authentication/policies, **never in a public GitHub Pages repository**. Associate each with a source/edition/chapter page range; mark \`Requested / Uploaded / Under Review / Verified / Need Better Scan\`. Generate original study explanations and activities rather than reproducing copyrighted pages.
- AI extraction of new uploads must distinguish **verified source facts** from *our original proposed exercises*. If unclear, request a targeted re-scan of that diagram instead of inventing it.
- In-app prompts default; external notification/email requires explicit opt-in and setup. Do not assume the site can initiate a new ChatGPT message by itself.
- **Acceptance:** missing active source creates exactly one prompt; upload verification resolves it; unrelated lessons remain available; paused manuals create no prompts; uploaded file is inaccessible to another user or anonymous web visitor.

## 9. Hands-on projects and safety — F-07

- Each EIM manual has its own curated list; rank original experiments **Essential / Combine or Upgrade / Quick Check / Optional** based on new skills, circuit insight, measurements, diagnostic value, real-world transfer and redundancy. Safety prerequisites override any skip decision.
- First release content: **EIM Basic PreLab Bench Readiness**, **DC 02 Three-Resistor Challenge**, including verified three 1 kΩ resistors at a nominal 5 V lab supply, expected vs observed totals, virtual safe DMM connections, open-branch diagnosis and written explanation. Physical component settings must be checked against the actual device label/manual before directing wiring.
- Project records distinguish **read, predicted, simulated, physically assembled, measured, diagnosed, understood**; completion cannot be obtained by clicking a button.
- No real mains exercises; no energized ohmmeter; current meter in series only; clear protective-earth/scope grounding warnings. Device-specific power and pin limits must be verified before physical builds.
- **Acceptance:** measured values persist separately from simulated answers; the learner can finish CETa theory while a lab awaits parts or scans; physically unsafe tasks aren't published on conjectured kit ratings.

## 10. Source and content integrity — F-08

- **Source-backed:** books/manuals follow their scanned headings, section start pages, verified figures and procedures. Never invent unscanned chapter details, unofficial kit inventories or page numbers.
- **Original extension:** added virtual experiments, faults and projects must be visibly distinct from the manual's official work.
- **Curriculum independent:** CETa core can teach known foundational electronics without needing unopened books.
- **Quality gates:** validate equations, engineering units, numeric tolerance bands, logical answers, interaction template parameters and no unsafe measurement steps. Record lesson versions and source provenance to prevent revision overwrites.

## 11. Technical stack, privacy, and migration — F-09

- **Hosting:** GitHub Pages for client/static resources, version control and reviewed deployments.
- **Cloud:** existing Supabase project for email account/session and private learning data; database row-level security and appropriate private storage policies.
- **Backend:** authenticated Edge Functions / scheduled queue workers for content readiness and optional server-side AI; exact Supabase APIs/scheduler/features must be checked during implementation.
- **Dynamic content:** render structured, validated lesson data via safe prebuilt UI templates; **do not let AI generate arbitrary executable JS that is injected into the website**.
- **Identifiers:** separate track, subtrack, unit, lesson, question, project, source and generation-job IDs. Keep **L01–L05 stable**, preserve current \`lesson_progress\` records and existing student responses; migrations reversible/backed up.
- **Sync:** save answers and measurements online, report last sync/offline/error, and prevent stale-write overwrites when desktop and phone edit around the same time.
- **Acceptance:** no Supabase service-role key/model secret published, no existing user progress lost, proper RLS isolation, tests of on/offline/retry and simultaneous-device updates.

## 12. Delivery phases — build in this order

| Phase | Deliverable | Exit criterion |
|---|---|---|
| **P0 — Protect baseline** | Inspect repo and Supabase, back up data, implement development/test strategy and feature flags | Proven ability to roll back; stable pilot IDs preserved |
| **P1 — Three-track framework** | Navigation, distinct sub-tracks, staged/waiting states, Pilot Unit 1 grouping | Existing lessons work, original progress visible on phone+desktop |
| **P2 — Dashboard + branding** | Responsive sky-blue/cyan visual analytics, yellow multi-bolt favicon/app mark, valid metrics | Charts match real data; no inflated or fabricated stats; mobile tested |
| **P3 — Lesson engine** | Explain/Interact/Predict/Debrief components and 10-question full lesson assessments | Tested live simulator templates; accuracy/safety QA |
| **P4 — First real content** | EIM Basic PreLab & DC 02; Geier DMM companion; CET Guide tree ready | Original lessons source-grounded, safety reviewed, progress saved |
| **P5 — Scan Inbox and cadence** | Source registry, private uploads, just-in-time prompts, event-driven unlocking, six-hour cheap reconciliation | Idle worker makes **no model calls**, pausing works, uploads remain private, no duplicate jobs |
| **P6 — AI grading and controlled generation** | Authenticated paid AI response feedback, vetted lesson drafting, caps, retries, validation and approval | End-to-end QA, billing limits authorized, visible failures, no arbitrary JS injection |
| **P7 — Release and monitor** | Merge reviewed PR, deploy, test phone/desktop, monitor queue and logs, revise from feedback | All release checks passing with rollback plan |

Phases may be combined for efficient implementation, but do not mark P6 complete before model/API budgets, quality controls and monitored backend operation exist.

## 13. Release acceptance checklist

- [ ] Existing five lessons and cloud-synced progress preserved.
- [ ] All three tracks and separate sub-tracks navigable; analog frozen at §2.1; FPGA/RP2040 still waiting.
- [ ] CET Guide TOC 9 units / 22 chapters and appendices indexed; no false claim the chapter pages have been read.
- [ ] Light blue/cyan responsive dashboard with valid drilldown charts and three-yellow-bolt brand mark.
- [ ] Every major teaching point in new full lessons has a meaningful interactive task.
- [ ] New full lessons have 10 accurate scored questions, including written reasoning.
- [ ] Safety-critical meter and instrument behavior is deterministically checked.
- [ ] DMM companion and first two EIM Basic companion lessons source-grounded and tested.
- [ ] Immediately after passing a lesson, next *approved* lesson unlocks without polling delay.
- [ ] Background reconciliation runs every **six hours**, does **not call AI when idle**, and never creates duplicate jobs.
- [ ] Paused/queued sub-tracks don't generate lessons, scan requests or artificial backlog.
- [ ] Scan Inbox requests only genuinely necessary source sections once and stores pages privately.
- [ ] Server-side AI checking/generation clearly marked optional, tested and budget-capped before enablement.
- [ ] Cross-device login, resume, offline recovery and stale-write handling verified.
- [ ] GitHub Pages production release reviewed with backup/rollback and no leaked secrets.

## 14. Known prerequisites / blocked items

- No new physical source scans are required to **begin implementation**. Later scan requests happen **contextually** as content work reaches unverified parts of books/manuals.
- The exact editions and chapter text of books on order will be supplied only when available. Do not hold the CETa core course hostage to deliveries.
- Advanced AI services need an explicit external model API choice, billing limits, server-side credential configuration and secure backend integration.
- Project-specific wiring needs actual part numbers and equipment ratings from corresponding experiment sections.
- The **Work weekly reset** is an implementation scheduling preference, not a scheduled action: **no automatic production changes or GitHub merges are authorized merely by the passage of time**. Development resumes when explicitly requested.

## 15. Supporting design documents

- [Three-track/sub-track structure](./TRACK_STRUCTURE.md)
- [CET Study Guide TOC index](./CETA_GUIDE_CONTENTS.md)
- [Dashboard design & palette](./DASHBOARD_DESIGN.md)
- [Six-hour lesson engine and Scan Inbox](./AUTOMATION_SCAN_INTAKE.md)
- [Textbook DMM companion](./DMM_COMPANION.md)
- [Hands-On Laboratory strategy](./HANDS_ON_LAB_TRACK.md)
- [EIM Basic Electric Circuits experiment index](./EIM_BASIC_ELECTRIC_CIRCUITS_INDEX.md)
- [EIM Basic PreLab + DC 02 detailed review](./EIM_BEC_PRELAB_DC02_REVIEW.md)
- [EIM Analog contents index (paused)](./EIM_ANALOG_SEMICONDUCTORS_INDEX.md)
- [EIM Analog §2.1 reviewed section (paused)](./EIM_ANALOG_SECTION_2_1_REVIEW.md)

**End of specification.**