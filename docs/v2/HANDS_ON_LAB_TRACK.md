# Electrical Understanding v2.0 — Lab-on-the-Go Project Track

**Status:** Design / curation framework only. Not deployed and no real manual exercises have been cataloged yet.  
**Track name (working):** Hands-On Lab / EIM Lab-on-the-Go  
**Student equipment:** EIM Technology's Lab-on-the-Go platform and four kits with physical components and manuals:

1. **Basic Electric Circuits**
2. **Fundamental Digital Design with FPGA**
3. **Fundamental Analog Circuits and Semiconductors**
4. **Introduction to Microcontroller with RP2040**

**Important source boundary:** This draft uses only the student's kit titles and described learning context. **No EIM manual pages or exercise indexes have been supplied or checked yet.** Every project idea below is a *proposed enhancement or possible project theme*, not a claim that a particular manual contains it, that all necessary parts are in the kit, or that specific I/O connections are safe.

## Position in the three-track course

1. **CETa Core:** Knowledge, calculations, instrumentation, troubleshooting, and exam readiness.
2. **Textbook Companion:** Book-specific chapters and side-lessons, optional and independently navigable.
3. **Hands-On Lab:** Manual-specific experiments, curated worthwhile projects, cross-kit challenges, and skill evidence.

All three share learning outcomes / mastery tags (e.g., series-network reasoning, DMM voltage, logic state, diode bias, ADC calibration). They have independent lesson completion and review queues. No lab or textbook lesson should automatically prevent advancing in the main CETa sequence. Practical exercises can reinforce an outcome but should never silently replace a required safety check.

## What the project curator must do after manual scans arrive

For each manual, extract its **actual** sections, experiments, component requirements, diagrams, and stated learning goals. Record exact page numbers/experiment IDs and label ambiguous scans for verification rather than invent details.

Catalogue each experiment with:
- Kit, manual title/edition/revision, experiment ID/name, and page range.
- Original purpose as described in the manual (brief paraphrase).
- Skills learned or tested; CETa competency / companion cross-links when genuinely relevant.
- Required hardware, power supply and tool requirements; estimated time; prerequisites.
- Prediction to make, measurements to record, troubleshooting opportunities, deliverable.
- Overlap with other kits and lessons: unique / useful foundation / redundant.
- Recommendation: **Essential**, **Combine or Upgrade**, **Quick Check**, **Optional for Now**.
- Risk and hardware-suitability checks before any build.
- Whether the proposed variant is original/ours rather than in the manual.

Do not copy entire textbook/manual chapters or scanned figures into the public repository. Users can consult their paper/manual copy. Preserve author attribution and concise references in site metadata.

## Exercise prioritization: educational value, not sheer count

Give each exercise a **0–3 score** for six criteria (maximum 18):

1. **New skill / needed prerequisite:** Addresses a current weak point or something the learner hasn't practiced yet.
2. **Circuit understanding:** Forces predictions and causal reasoning, not merely following a connection list.
3. **Measurement quality:** Produces interpretable, quantitative evidence, with units and expected-vs-actual comparison.
4. **Debugging value:** Has plausible, safe faults or test decisions that the learner must diagnose.
5. **Transfer / relevance:** Useful for technician work or designing independent electronics projects.
6. **Distinctness:** Adds something not already adequately practiced in an earlier experiment.

Suggested buckets (curation guide, not an automatic verdict):
- **14–18 Essential / Project-worthy:** Build and document fully; often add an extension.
- **9–13 Combine or Upgrade:** Pair with similar exercises or add a worthwhile constraint / failure mode.
- **4–8 Quick Check:** Retain as brief technique practice; include in another project if possible.
- **0–3 Optional for Now:** Defer if truly redundant, except where safety or hardware prerequisites require it.

**Override rules:** A low-scoring exercise can still be **required** if it establishes safe meter use, a critical prerequisite, a necessary hardware setup, or an unpracticed foundation. Conversely, never approve an unsafe experiment just because it scores highly.

## Hands-on lab format

Every selected experiment becomes an accessible, human-sounding **project card**:

1. **Why this is worth doing:** Skills and practical relevance in ordinary language.
2. **Manual cross-reference:** Exact supplied manual name, section/experiment/page.
3. **Before the build:** Identify parts, power rails, data/logic ratings, meter configuration, safety checks.
4. **Predict first:** What readings/output are expected, and why.
5. **Build / run:** Follow the user's official manual for its exact physical assembly; augment with original explanation and checked diagrams where needed.
6. **Measure and compare:** Expected values, actual readings, tolerance/errors, screenshots/photos/optional source code.
7. **Troubleshoot:** Controlled fault/inference exercise (e.g., simulated open/incorrect value) and clear rationale.
8. **Extend:** A meaningfully deeper version using the same hardware when supported (not every exercise needs an extra build).
9. **Reflect / assess:** Ten well-chosen questions for a full lab lesson, or a shorter checklist for an embedded quick-check activity. If grading written reasoning with AI, use the secure backend design, not exposed browser keys.
10. **Save:** Finished / attempted / needs review, measurement log, and next spaced-review date in the student's private account.

A project is **not complete** merely because the student clicked "I did it." Separate completion for correct safe setup, predictions, measurements, and demonstrated understanding. Permit marking "not enough parts" or "awaiting help".

## Proposed lab categories and possible advanced extensions
**These are ideas for later matching against the manuals, NOT verified experiment titles.**

### Basic Electric Circuits
- Prioritize DMM practice **before** ambitious wiring: voltage across components, current meter in series only, resistance on powered-off circuits, identifying correct reference nodes.
- Upgrade repeated single-resistor/Ohm-law exercises into a mixed-network measurement map: predict 3+ node voltages and branch currents, measure, and diagnose one safe introduced wiring/value error.
- Bundle near-identical reading exercises into one **measurement competency check**, but keep critical first-time tests.
- Cross-link to the DMM companion unit from *How to Diagnose and Fix Everything Electronic* (chapter 6 pp. 97–103).

### Fundamental Digital Design with FPGA
- Explore combinational truth tables, inputs/outputs, and logic validation **if present** in manual, then prefer experiments that combine multiple gates into meaningful behavior.
- Possible extension: debounced switch input, counter or simple state machine, with clear output-state predictions and timing/logic checks **only if board, I/O and toolchain support them**.
- Include troubleshooting of swapped I/O assignments, inversion, and unstable inputs when it can be done safely without exceeding device specifications.

### Fundamental Analog Circuits and Semiconductors
- Prioritize component behavior and measurement: diode forward/reverse, transistor switching, resistor/capacitor response, amplifier gain and headroom **when supported by supplied circuits**.
- Possible extension: characterize an RC filter across frequency, plot predicted vs measured response, then change R or C and compare; diagnose an incorrect part or missing reference.
- Avoid encouraging repair/measurement of live mains or charged/high-energy circuits.

### Introduction to Microcontroller with RP2040
- Prioritize purposeful embedded projects: digital input/output, timing, ADC readings, PWM control, serial output, and fault handling **only when documented for the supplied kit**.
- Possible extension: sample a safe analog voltage with an RP2040 ADC, convert raw readings into voltage using verified reference/scaling, log/plot data, and investigate noise.
- Use a staged coding scaffold: code to run, explanation of each new command, expected output, and debugging prompts.

### Cross-kit capstones (later, only after checking manuals and pinouts)
- **Measure → Decide → Act:** Analog sensor or adjustable divider → RP2040 input → threshold decision → indicator output; add fault cases and test points.
- **Digital controls analog:** Verified logic output switches a small low-voltage load through a suitable driver; measure voltage drop, current and signal shape with safe boundaries.
- **Verification challenge:** Compare a predicted RC response to observed data, then use a microcontroller to log or visualize it if hardware/toolchain permits.

**Safety and electrical compatibility gates:** Never presume the FPGA board and RP2040 pins share the same I/O-voltage tolerance. Confirm rails, common-ground requirements, current limits, level shifting, ADC ranges, correct pinouts, ESD handling, component ratings, and short-circuit protection from the actual manuals and hardware markings *before* proposing specific interconnections. The RP2040 GPIO is generally 3.3 V domain, but do not specify exact safe wiring without board model and manual confirmation. Prohibit direct mains experiments.

## Site IA, assessment, and cloud tracking

Navigation proposal: **Dashboard | CETa Units | Textbook Companions | Hands-On Lab | Review Queue | Account**.

Lab main page:
- Kit selector (4 named kits).
- Project cards with labels: *Essential / Combine / Quick Check / Optional*, "Why do this?", estimates, prerequisites, manual source.
- A "Most worthwhile next project" recommendation derived from learning gaps, available equipment, and actual catalogued manual content.
- Filter by skill, equipment needed, difficulty, topic, not-started, and whether an experiment is redundant with completed work.
- Each project links to the relevant theory lesson and companion-book subsection without treating them as mandatory dependencies.
- Progress stored by stable kit/project IDs, not array positions, to prevent updates from overwriting completed history.
- Cloud records include optional measurements, expected/actual comparisons, evidence references, code/simulation notes, and manual pages studied. Do not publicly expose private photos or scanned copyrighted manual pages; decide privacy/storage scheme before file uploads.
- Sync tests across phone/desktop, including interrupted sync and revision conflicts.

## Implementation acceptance criteria

- The current five pilot lessons and user progress remain intact.
- Four kit categories appear only as planned/not yet catalogued until their manuals are supplied; no falsely grounded project list.
- One project can be completed without having to complete all prior book/CETa lessons.
- Duplicate/overlapping labs can be combined or upgraded, **without losing prerequisite/safety proficiency exercises**.
- Each published project distinguishes manual experiment instructions from new original exercises.
- Safe wiring rules and meter protections enforced in simulations and plainly explained.
- Actual hardware tasks tested against source manual and part ratings; website sync, mobile controls, and review queue tested before deployment.
- No unauthorized changes to the live site or production Supabase schema from a planning-only draft.

## What to request next

For each kit, **just the cover/product revision, contents page, experiment/project index, and parts/supplied equipment list**. Additional pages (diagrams, specific procedure, expected results) are requested **only for promising experiments**. This avoids needing to scan entire manuals before prioritizing.

First suggestion: begin with **Basic Electric Circuits**, since the learner's diagnostic revealed DMM current/voltage measurement gaps, series/parallel prediction trouble, and Ohm's-law confusion. That is a teaching priority, not an assertion about the kit's exact experiments.
