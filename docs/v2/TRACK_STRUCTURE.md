# Electrical Understanding v2.0 — Track and Sub-track Architecture

**Status:** Architecture specification for the draft branch only. No website implementation or Supabase migration is included in this file.

## One site, three top-level tracks

### Track 1 — CETa Preparation (primary learning / exam pathway)

1. **Core CETa Course** — competency-led instructional units, including the existing five lessons reorganized into **Pilot Unit 1**. Retain stable `L01`–`L05` IDs and protect all existing progress; each later lesson aims for plain-language explanations, purposeful interactions at each major teaching point, and **10 varied assessment questions**.
2. **Associate CET Study Guide Companion** — a distinct *sub-track nested under Track 1*, NOT duplicated in generic Textbook Companions. It will be divided into guide chapter → section → original companion lesson / interactive exercise → review. The user owns this printed guide; its photographed **table of contents has been supplied** and establishes **nine units, Chapters 1–22 plus appendices** in **[the guide index](./CETA_GUIDE_CONTENTS.md)**. The exact edition and detailed chapter body remain unverified; use chapter titles/page starts only as supported. Never invent detailed text or pretend to have read unscanned chapters. Request small pertinent pages only later through the Scan Inbox.
3. **CETa Competency & Exam Practice** — independent mixed-topic checks, review of areas missed in the 40-question informal diagnostic, spaced retention, and exam-style practice. This is not a claim to reproduce official exam questions.

The Guide sub-track and Core Course can link to the same competency tags, but each stores **distinct completion/progress records**: completing a guide page does not automatically mark the core lesson as complete and vice versa. Guide exercises may inform a separate skill mastery panel.

### Track 2 — Textbook Companions (one sub-track PER book)

1. *How to Diagnose and Fix Everything Electronic*, 3rd ed. — available; its Chapter 6 DMM section pp. 97–103 has been scanned and drafted as `BOOK-GEIER3-CH06-DMM`, with seven lesson/capstone proposals in `DMM_COMPANION.md`.
2. *Teach Yourself Electricity and Electronics*, 7th ed. — on order / not yet introduced through scans.
3. *Electronics: Principles and Applications*, edition to verify on arrival — on order / not yet introduced through scans.
4. *Cabling: The Complete Guide to Copper and Fiber-Optic Networking*, edition to verify — on order / not yet introduced through scans.

Each book gets its own selectable library entry, chapter and subsection tree, related independent exercises, source page references and per-book progress. Students may choose chapters freely; book work **does not gate the main CETa path**. Do not publish user-scanned copyrighted pages to the public GitHub Pages site. Companion prose and simulations should be newly authored.

### Track 3 — Hands-On Laboratory (one sub-track PER manual/kit)

1. **EIM Basic Electric Circuits** — **ACTIVE DEVELOPMENT AND STUDY FOCUS**. Manual contents, PreLab pp. 1–12, and DC 02 pp. 21–27 are documented; focus future scans, project ranking, and website implementations on establishing this manual well before moving to the analog manual in earnest. Use separate physical-kit inventory, measurements, safety constraints and project completion data. Do not force redundant simple lab repetitions if safe skills are already verified.
2. **EIM Fundamental Analog Circuits and Semiconductors** — **INDEXED / PAUSED AFTER §2.1** (pp. 81–93 scan reviewed). Keep its chapter index and §2.1 instrument lesson sketches intact but **do not request §2.2 or develop later sections proactively** until the student confirms Basic Electric Circuits is sufficiently established. This is the second *allocated* manual within the two-manual limit, but **not a second active work queue yet**.
3. **EIM Fundamental Digital Design with FPGA** — **WAITING**. No manual-scanning requests or physical projects in this phase.
4. **EIM Introduction to Microcontroller with RP2040** — **WAITING**. No manual-scanning requests or physical projects in this phase.

**Hard coordination rule:** At most two kit manuals may be allocated for ongoing study at a time, and currently the learner prefers a **one-manual-at-a-time depth of focus** within that pair. The first is active and the second staged. The student chooses when the Basic Electric Circuits manual is adequately established/completed and when the paused Analog manual should resume. Subsequent kit activation requires student approval.

**Hardware separation:** Kit component inventories and instrument/power ratings must never be conflated. No projects requiring parts borrowed from another EIM kit unless student explicitly requests a combined project, the parts exist, and compatibility/safety has been independently verified. Theory competency relationships are allowed across kit boundaries.

## Hierarchy to implement

```text
Electrical Understanding
├─ CETa Preparation
│  ├─ Core Course → Unit → Lesson → Teaching point / Experiment / Questions
│  ├─ Associate CET Study Guide → Chapter → Section → Companion lesson / Questions
│  └─ Competency & Exam Practice → Topic → Assessment / Review
├─ Textbook Companions
│  ├─ How to Diagnose and Fix Everything Electronic → Chapter → Section → Lessons
│  ├─ Teach Yourself Electricity and Electronics → Chapter → Section → Lessons
│  ├─ Electronics: Principles and Applications → Chapter → Section → Lessons
│  └─ Cabling: The Complete Guide → Chapter → Section → Lessons
└─ Hands-On Laboratory
   ├─ Basic Electric Circuits [Current priority] → Experiments → Selected projects
   ├─ Fundamental Analog Circuits and Semiconductors [Staged after §2.1]
   ├─ Fundamental Digital Design with FPGA [Waiting]
   └─ Introduction to Microcontroller with RP2040 [Waiting]
```

## Study automation and progress visualizations

- **[Lesson progression / six-hour reconciliation / Scan Inbox specification](./AUTOMATION_SCAN_INTAKE.md)**: completion check immediately after successful answer submission; **six-hour server-side follow-up** for missed events and queued content. AI generation is opt-in, backend-driven, source-verified and gated by validation. This is planned behavior, not a running automation.
- **[Dashboard and visual theme specification](./DASHBOARD_DESIGN.md)**: ice/sky blue and cyan controls and charts, accessible dark-navies, three yellow lightning bolts as brand artwork, progress per track and sub-track, actionable review/scan queue, sources-of-evidence matrix. Exclude staged and waiting manuals from misleading completion denominators.
- The user designated the two CET Guide TOC photographs as the **last scan for v2 planning**. Only contextually needed *lesson-specific* scans should be requested as later content work advances.

## Tracking model and publishing acceptance criteria

- Stable IDs should distinguish `track_id`, `subtrack_id`, `unit_id`, `lesson_id`, `experiment_id`. Avoid collisions with existing `L01`–`L05` and already drafted `BDMM-...` and `EIM-BEC-...`.
- Per-sub-track progress: last visited location, completed concepts, question attempts and feedback, reviewed/scheduled concepts, study-guide/book page status, physical lab evidence; a cross-track **skill mastery** record is separate from completion.
- Use distinct **status** values for unstarted, in progress, paused, awaiting book, awaiting selected lab manual source, and complete. Paused/waiting should not be displayed as "failed".
- Navigate and resume at **chapter/section** granularity; the same account syncs between phone and desktop via Supabase with no loss of existing data. Migrate carefully, test user sessions on both devices, preserve existing records, protect row-level access.
- Books and guide act as optional reinforcements; neither their availability nor a completed physical build is an enforced prerequisite to core CETa theory progression unless safety competency genuinely requires verification for a physical task.
- Existing EIM analog §2.1 draft remains saved, with explicit **hold** status; stop prompting for §2.2 while Basic Electric Circuits is the focus.
- All live-site changes should be developed/tested off production and deployed only after reviewing and verifying UI, cloud sync, content quality, and safety. No API service secrets inside GitHub Pages.

## Next intake

**Only when convenient:** The user may provide **Associate CET Study Guide cover/edition and table of contents** to map its future chapter sub-track. There is no requirement to send it before continuing the Basic Electric Circuits lab focus.

For now, concentrate new source requests and real hardware project curation on **EIM Basic Electric Circuits**. The staged Analog and waiting FPGA/RP2040 manuals should not generate reminders or unsolicited scan requests.
