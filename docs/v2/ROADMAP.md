# Electrical Understanding v2.0 — working draft

**Status:** Design only. Do not deploy to GitHub Pages or migrate the live database until a separate implementation/review step.

## Course architecture

1. Keep existing lessons **L01–L05** as **Pilot Unit 1**, preserving lesson IDs and existing `lesson_progress` records. Improve the structure without resetting student progress. Existing lessons need not be recreated from scratch.
2. Future **CETa core units** follow competency prerequisites and have their own progress sequence.
3. Add a separate, optional **Textbook Companion Library** with selectable books, chapter, subsection, lesson, and capstone. Completing a companion lesson can provide evidence toward shared skills but **must not gate progress in the CETa core**.
4. Current book available: *How to Diagnose and Fix Everything Electronic, Third Edition* (Michael Jay Geier). Other books are **not required or cited in lessons yet**.
5. Record textbook edition, chapter/page ranges, study status, and source notes. Do not publish photographed book pages or large copyrighted excerpts as site assets.
6. Add an independent **Hands-On Lab / EIM Lab-on-the-Go** track built around four user-owned kit manuals: **Basic Electric Circuits**, **Fundamental Digital Design with FPGA**, **Fundamental Analog Circuits and Semiconductors**, and **Introduction to Microcontroller with RP2040**. Rank projects by educational value, measurement and troubleshooting practice, skill novelty, transfer, and redundancy. Keep mandatory first-time safety exercises even if mechanically simple. See [Hands-On Lab Track draft](./HANDS_ON_LAB_TRACK.md). Exact manuals, experiment names, and supplied parts still require review; do not invent project-to-manual references.
7. **Two EIM manuals allocated maximum; one current focus:** *Basic Electric Circuits* is being developed first; *Fundamental Analog Circuits and Semiconductors* is staged/paused after §2.1. Do not continue analog §2.2+ without the learner's approval. Defer FPGA and RP2040 manual reviews/projects until the learner completes/replaces an allocated manual. Treat each kit's equipment/parts as a distinct inventory. The analog manual's photographed first contents page is indexed in [Analog Circuits and Semiconductors draft](./EIM_ANALOG_SEMICONDUCTORS_INDEX.md); its actual procedures and possible later TOC pages remain unverified.

## Nested sub-tracks and current development focus

See **[three-track / sub-track hierarchy](./TRACK_STRUCTURE.md)** for the definitive v2 architecture. **Track 1** contains separate Core CETa Course, **Associate CET Study Guide Companion**, and Competency/Exam Practice sub-tracks. **Track 2** has a distinct sub-track for **each purchased textbook**. **Track 3** has a distinct sub-track for **each EIM kit manual**, including separate physical component/equipment inventories and independent progress.

**Current focus:** Develop **EIM Basic Electric Circuits** thoroughly first. **Fundamental Analog Circuits and Semiconductors is indexed and staged at §2.1 only**; do not request or draft §2.2+ until the learner says to resume it. FPGA and RP2040 stay on hold. Maximum two allocated lab manuals; currently only the first is actively being advanced. Never treat waiting manuals as a failure or force textbook/guide work to advance CETa core.

The user's owned **Associate CET Study Guide** is incorporated as a Track 1 sub-track: its two photographed contents pages have been received (nine units, 22 chapters and appendices), see **[guide index](./CETA_GUIDE_CONTENTS.md)**. The exact edition and *chapter body pages* are not verified; only request short source-specific pages later when needed. The main CETa course stays self-contained.

## Dashboard, just-in-time source requests and automated progression

**Visual dashboard:** Use the learner's favorite **light blues and cyan** for graphs and active controls, yellow multi-bolt branding, and an accessible dark-navy visual foundation. Show overall scope-specific progress, track/sub-track graphs, skills mastery, recent activity, review queue, lab evidence, and scan readiness with clickable drilldowns. **[Dashboard design](./DASHBOARD_DESIGN.md)**.

**New lesson cadence:** On a saved passing/completion event, immediately evaluate/unlock the next approved lesson for **that specific sub-track**. Run a **six-hour server-side reconciliation** to pick up missed completions, approved content and stalled draft jobs; maintain one next approved lesson ahead when verified content allows. Generation requires authenticated Supabase backend scheduling/jobs and (for AI-generated content/feedback) a separate paid model API—**not provided by GitHub Pages or this documentation**. AI drafts must pass source, safety, formula, grading and interaction-template validation before publishing. See **[automation and scan-request design](./AUTOMATION_SCAN_INTAKE.md)**.

**Scan Inbox:** When a source-backed lesson requires unsupplied chapter pages, prompt for the **smallest relevant page range/diagram/procedure**, show what is blocked and let the learner continue in other tracks. No repeated requests for already verified pages. User uploads must be private; no scanned copyrighted book material in the public repository. Paused kit manuals produce no prompts. In-app prompts are the default; external notifications require setup and opt-in.

**CET Guide scan intake complete for 2.0 planning:** The guide's photographed table of contents, **nine units, Chapters 1–22 and appendices**, has been received and indexed in **[CETa Guide chapter index](./CETA_GUIDE_CONTENTS.md)**. Only targeted content scans may be requested in future when the relevant guide companion subsection becomes active. This is the **last intake scan for the v2.0 planning phase**; do not ask to resend the chapter outline.

## Teaching standard for each future lesson

- An inviting, plain-English opening: what this lets the learner do in the real world.
- Break explanations into **short concept points**, each with **Explain → Interact → Predict → Debrief**. Every concept point has a purposeful interactive task, not an arbitrary control.
- Favor concrete, low-voltage worked examples. Explicitly distinguish electrical quantities, expected values, measurement limitations, and safety decisions.
- Include **10 graded questions** per lesson (varied choice, numerical, ordering, circuit interpretation, fault diagnosis, and written reasoning). Short embedded checks between points are additional, not substitutes.
- Written grading: start with transparent rubric/self-check; optionally add authenticated AI evaluation through a **Supabase Edge Function**, with server-side model credentials, input constraints, privacy policy, costs, rate limits, and defenses against answer-based prompt injection. Never put API secrets in GitHub Pages. Safety-critical answers require deterministic rules and/or instructor-verified feedback, not unquestioned model judgment.
- Feedback should identify **which idea is missing, why it matters, and one concrete way to improve**. Avoid opaque "incorrect" messages.
- Mastery dimensions: conceptual, quantitative, measurement safety, applied troubleshooting, retention. Scheduled review questions can be revisited later.
- Make interfaces touch-friendly, keyboard-accessible, screen-reader labeled, and friendly to mobile and desktop; numerical exercises should not require a physical calculator.
- Synchronize authenticated progress through Supabase; support local offline/cache mode with unambiguous sync status. Protect against stale cross-device overwrites.
- Use a sequence of lightning bolts in distinct yellow shades for favicon, PWA icon, and site branding, with adequate contrast on dark backgrounds.

## Draft companion unit

**ID:** `BOOK-GEIER3-CH06-DMM`  
**Title:** *Digital Multimeters: Know What You're Measuring*  
**Reference:** *How to Diagnose and Fix Everything Electronic*, 3rd ed., Chapter 6, pp. 97–103 (DMM subsection). The ESR meter begins on p. 103 and will be a separate lesson/unit.

Proposed lessons:
- `BDMM-01`: The meter display: accuracy, resolution, noise and stable readings (pp. 97–98)
- `BDMM-02`: DC voltage: comparing points, safe reference points and autoranging (pp. 98–99)
- `BDMM-03`: AC voltage: RMS and what a DMM cannot show (pp. 99–100)
- `BDMM-04`: Resistance and continuity: power off, parallel paths, open/closed (pp. 100–101)
- `BDMM-05`: Measuring DC current: series insertion, correct jacks, limits and burden voltage (pp. 101–102)
- `BDMM-06`: Diode-test mode: forward drop, reverse blocking, open/short interpretation (pp. 102–103)
- `BDMM-07`: Capstone: troubleshoot a safe battery-powered device using virtual measurements (original synthesis; not a separate book subsection)

Each lesson should have **at least one interaction per concept point and 10 graded questions**. See [DMM companion lesson draft](./DMM_COMPANION.md).

## Three-track progress model

- **Core CETa**: sequential competency-based theory and exam preparation.
- **Textbook Companion**: optional reading-aligned lessons and simulations.
- **Hands-On Lab**: curated build/measure/debug projects selected from scanned EIM kit manuals, with dedicated evidence, rubric, and progress. The same underlying skills can be reinforced across all tracks, but progress in one track does not forcibly unlock or block unrelated activities. Preserve stable lesson/project IDs and existing authenticated Supabase progress; test device sync on implementation.

## Book content vs. modern practices

The uploaded section supports the teaching themes and page references, but some instrument capabilities vary by model. Do not imply every DMM supports the same AC frequency range, true-RMS performance, autoranging, diode-test compliance voltage, continuity beep threshold, or resolution. For example, the book describes limited AC performance on many meters; modern true-RMS meters can differ. State instrument-specific limitations rather than universal rules.

The section discusses ground-reference hazards. **Never assume chassis, heat sink, RCA shields, or speaker returns are safe reference points without verification.** Practice on virtual or verified battery-powered, current-limited low-voltage circuits; never require live-mains measurements. Do not reproduce unsafe or outdated equipment procedures uncritically.

## Implementation acceptance checks

- Pilot lesson IDs and synced records remain intact.
- Textbook lessons are independently selectable and save separately without gating core units.
- All concept points have meaningful interactions plus a written explanation of what changes and why.
- Each new lesson has ten varied assessment questions, with safe checking logic and reviewed solutions.
- Fake-meter simulations explicitly distinguish idealized displays from realistic specifications.
- The DMM simulator blocks or flags dangerous current-mode connections to voltage sources.
- No unverified cloud/AI grading claims; any AI integration must be tested end to end before being advertised.
- GitHub Pages only publishes reviewed changes from `main`; drafts remain on feature branches.

## Source material tracking

User-provided scanned PDF: Chapter 6, pp. 97–103. The source covers DMM overview; DC voltage; AC voltage/RMS; resistance; continuity; DC current; diode test. It ends as the ESR Meter section begins. The draft is original lesson design based on these topics and does not reproduce the pages.