# EIM Lab-on-the-Go — Fundamental Analog Circuits and Semiconductors

**Status:** Contents-only intake and provisional project-curation plan; no individual lab procedures or equipment lists have been scanned for this manual yet. This is a planning document, **not a published or implemented lesson**.

**Source:** Student's photographed first table-of-contents page for *Fundamental Analog Circuits and Semiconductors* (EIM Technology). This page lists Chapters 1–6 and subsections. It does **not** establish whether additional chapters appear on subsequent contents pages. All page numbers below are **starting pages printed in the supplied contents**, not confirmed end pages.

**Active-kit policy:** For the current phase, **only** (A) *Basic Electric Circuits* and (B) *Fundamental Analog Circuits and Semiconductors* are actively reviewed, expanded, or studied within the EIM Hands-On Lab track. The FPGA and RP2040 kits are **on hold** until these two active manuals have been worked through as agreed, or the student explicitly changes the active pair. Do **not** design projects requiring parts from inactive kits. Each active kit has its own isolated parts/tools/power inventory, source references, lab progress, and build checklists. Cross-linking conceptual skills across tracks is appropriate; cross-kit physical wiring is **not presumed**.

## 1. Source-grounded chapter and subsection index

### Chapter 1 — Review of Fundamentals (starts p. 1)

| Section | Title in contents | Starts p. |
|---|---|---:|
| 1.1 | Basic Concepts | 1 |
| 1.2 | Fundamental Circuit Laws | 12 |
| 1.3 | Operational Amplifiers | 20 |
| 1.4 | Diodes | 33 |
| 1.5 | MOS Field-Effect Transistors | 43 |
| 1.6 | Bipolar Junction Transistors | 62 |

Provisional treatment: **concept-and-prerequisite checks**, skipping unnecessary repetition only after the learner demonstrates understanding. Build no electronics from chapter-title assumptions.

### Chapter 2 — Getting Prepared for Practice (starts p. 81)

| Section | Title in contents | Starts p. |
|---|---|---:|
| 2.1 | A List of Equipment and Tools | 81 |
| 2.2 | Familiarize Your Power Supply | 94 |
| 2.3 | Techniques of Measurement | 102 |
| 2.4 | Grounding | 112 |
| 2.5 | Datasheets | 118 |

Provisional treatment: **essential bench-readiness and hardware-specific safety**; must precede recommending real build voltages and connections. Cross-link common principles to the existing DMM book companion but use the **analog kit's own** supply and component specifications.

### Chapter 3 — Op-amp Experiments (starts p. 129)

| Section | Title in contents | Starts p. |
|---|---|---:|
| 3.1 | Basic Amplifiers | 129 |
| 3.2 | More Amplifiers | 142 |
| 3.3 | Practical Op-amps | 150 |
| 3.4 | Non-linear Applications | 167 |

Provisional treatment: **high-value investigation** — when actual experiments are verified, favor comparison of gain, saturation/headroom, feedback behavior, frequency response, and non-linear functions where supported. Do not claim any specific circuit topology is in the manual until scanned.

### Chapter 4 — Diode Experiments (starts p. 181)

| Section | Title in contents | Starts p. |
|---|---|---:|
| 4.1 | Diodes Characteristics | 181 |
| 4.2 | Protection Circuits | 192 |
| 4.3 | Rectifier Circuit | 200 |
| 4.4 | Other Diodes | 209 |

Provisional treatment: **high-value investigation** — compare predicted vs measured bias behavior, protect circuits with correctly rated components, and interpret rectification and waveform changes *if these are covered in the actual experiments*.

### Chapter 5 — MOSFET Experiments (starts p. 219)

| Section | Title in contents | Starts p. |
|---|---|---:|
| 5.1 | Fundamental Characteristics | 219 |
| 5.2 | MOSFET as a Switch | 225 |
| 5.3 | MOSFET as a Discrete Amplifier | 238 |

Provisional treatment: **high-value investigation** — contrasting switch and amplifier use is central to practical analog and hardware design, subject to verified device part numbers, gate-drive range, dissipation, and power rails.

### Chapter 6 — BJT Experiments (starts p. 257)

| Section | Title in contents | Starts p. |
|---|---|---:|
| 6.1 | Fundamental Characteristics | 257 |
| 6.2 | BJT as a Switch | 265 |
| 6.3 | BJT as a Discrete Amplifier | 279 |

Provisional treatment: **high-value investigation** — base/collector/emitter relationships and current control, with comparison of switching to biasing for analog gain, subject to actual schematics, polarity, power and resistor limits.

**Contents coverage limitation:** Only the photographed contents page has been provided. Do not call this a full-book chapter count or assume the manual ends after 6.3.

## 2. How this kit differs from Basic Electric Circuits

- **Basic Electric Circuits** emphasizes foundations, equivalents, dividers, KCL/KVL, passive and reactive elements, signal measurements; its **PreLab** and **DC 02** have actual procedures reviewed.
- **Fundamental Analog Circuits and Semiconductors** appears from the headings to center on devices and functional analog circuitry — op-amps, diodes, MOSFETs and BJTs. That distinction is **an inference from the supplied contents**, not a reading of the experiment procedures.
- Preserve **separate kit parts**, power supply model/rating, board compatibility, wiring photos, and actual measurement logs. Share only learning tags such as DMM safety, voltage references, gain, rectification, transistor switching, and fault tracing.
- Do not assign physical cross-kit capstones or require FPGA/RP2040 components during this active two-kit cycle.

## 3. Potential worthwhile projects to investigate after manual scans
**Original enhancement candidates, not a claim of included manual activities or inventory.**

1. **Amplifier behavior and limits (3.1–3.4):** Set a realistic closed-loop gain; measure input/output, then find a clipping/saturation threshold or a useful signal-processing function. Explain why the behavior changes. Only if the verified analog kit supports it.
2. **Rectifier and smoothing diagnosis (4.1–4.4):** Predict and observe a diode rectifier's pulsed output; if an approved capacitor/filter is available, evaluate ripple or controlled fault conditions. Never connect to mains.
3. **Switch vs amplifier (5.1–5.3; 6.1–6.3):** Compare a correctly biased transistor used to switch a low-voltage load against the same device family used in a small-signal amplifier. Measure control input, load current and output swing; diagnose one safe fault. **Do not assume specific transistors/loads or share supply rails between kits.**
4. **Datasheet-driven repair case (2.5 plus a verified experiment):** Choose the exact supplied component's manufacturer datasheet, check pinout and limits, then explain measurement anomalies and safe substitutions.

Rank only after reviewing actual individual experiments using the six-axis scoring rubric in the Hands-On Lab Track document; section-title priority is not a score for its sub-experiments.

## 4. Suggested course order — not a mandate

Begin with **Chapter 2 bench setup** and targeted Chapter 1 prerequisite checks, then select verified Chapter 4 diode experiments and Chapter 3 op-amps as appropriate to equipment and student readiness; move into Chapters 5 and 6 transistor projects. Allow learner to open any reference section without having a physical build unlocked. Keep the book's original order available as an alternative.

Chapter 2 is a suggested starting point because power rails, reference points, DMM setup, and reading datasheets govern safe measurements throughout all later device labs, not because Chapter 1 is unimportant.

## 5. What to scan next

For this manual, request first:
- **Chapter 2, §2.1 "A List of Equipment and Tools" (starts p. 81)**, especially the *actual kit inventory, bench equipment, part numbers, and diagrams*.
- **§2.2 "Familiarize Your Power Supply" (starts p. 94)**, showing its model and limits. Ask for subsections as convenient rather than requiring all pages at once.
- If a supplied table of contents has a second page, that image to establish whether chapters follow Chapter 6.

These let us build an accurate analog-kit inventory and not mistakenly substitute parts from *Basic Electric Circuits*. Next, ask for a particularly promising **actual experiment** (suggest 3.1 or 4.1, based on the learner's current gaps) and score its individual tasks with evidence.

## 6. Planned v2.0 UI behavior and release checks

- Hands-On Lab landing page shows **two active manuals** prominently; FPGA and RP2040 appear as "On hold (not currently studied)" or can be hidden. No recommendations drawn from inactive-kit contents.
- Separate experiment/project ID namespaces, e.g. \`EIM-BEC-...\` and \`EIM-ANALOG-...\`, avoid overwriting each other's saved lab progress.
- Each project logs **book/manual subsection, hardware list, verified supply limits, calculations, predictions, real measurements, interpretation, and status** separately.
- A lesson may link to shared theory, but there is **no automatic substitution of one kit's components for another**.
- When these two manuals have been completed to the student's desired depth (all selected meaningful labs, major skills, and capstones), request explicit agreement before activating another kit.
- The site's current Supabase data must not be reset. New storage must be authenticated and tested across phone/desktop before publishing.
- Never publish the scanned manual's photographed contents or pages in a public source repository; keep only original summaries, page citations and novel exercises.
