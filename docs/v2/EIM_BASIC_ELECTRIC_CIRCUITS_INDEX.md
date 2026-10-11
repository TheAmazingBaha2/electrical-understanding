# EIM Technology — Basic Electric Circuits: preliminary project map

**Status:** Table-of-contents review only; no manual experiments have been reviewed or implemented.  
**Course:** Hands-On Lab track of Electrical Understanding v2.0  
**Available source:** User-uploaded photograph of the manual's table of contents (2026-10-10).  
**Caution:** The table of contents establishes **titles and starting pages**, not procedures, components, diagrams, power levels, safety conditions, or actual educational value. Recommendations below are **provisional**; confirm after reviewing original experiment pages.

## Source-backed review received: PreLab and DC 02

The learner has provided a **36-image PDF scan** covering PreLab (component basics, values/tolerance, resistor bands/power, breadboards and jumper wires, MEGO supply, VEGO DMM) and DC 02 (actual series and parallel three-1-kΩ-resistor measurements with a 5 V source).

This permits upgrading the **PreLab** from "provisional required" to a confirmed useful **bench-readiness / measurement-safety module**, and **DC 02** from provisional to a confirmed **essential hands-on measurement lab**. The recommended enhancement uses real resistor measurements, computed and observed equivalent resistance, an original virtual breadboard/probe trainer, and an original introduced-fault challenge. It specifically reinforces the learner's prior DC-circuit diagnostic gaps.

**Read [full source-backed PreLab + DC 02 review, original lesson drafts and 10-question assessments](./EIM_BEC_PRELAB_DC02_REVIEW.md).**

**Page coverage resolved:** The learner subsequently supplied the PreLab opening on **printed p. 1**, and confirmed that **DC 02 ends on p. 27** (p. 28 is blank). No further page scans are needed for these two sections. The remaining 17 numbered experiments have only their table-of-contents titles reviewed, so keep **their** priorities provisional.

## Inventory: 1 PreLab, 19 numbered experiments, appendix

| Manual entry | Starts page | Provisional treatment | Why / what to examine when pages arrive |
| --- | ---: | --- | --- |
| PreLab — Component Basics | 1 | **Required quick foundation** | Inventory, breadboard conventions, component identification, meter jacks and safe low-voltage procedure; retain even if easy |
| DC 01 — Ohm's Law | 13 | **Combine or upgrade** | Use as a measurement baseline: predict current, verify values and units, explain discrepancies, distinguish voltmeter parallel and ammeter series |
| DC 02 — Series & Parallel Circuits | 21 | **Essential** | Prioritize network prediction, node voltage, branch current, open fault diagnosis; directly addresses diagnostic misconceptions |
| DC 03 — Voltage & Current Divider | 29 | **Essential** | Compare predicted versus measured divider behavior and loading; choose appropriate node/reference |
| DC 04 — Watt's Law | 35 | **Combine or upgrade** | Fold power and energy calculations, resistor ratings and measurement uncertainty into DC 01–03 where suitable |
| DC 05 — Kirchhoff's Laws | 43 | **Essential** | Measure several branch currents/voltage drops and test conservation, with a justified measurement plan |
| DC 06 — Superposition | 51 | **Advanced, worthwhile** | Test contribution of independent sources if actual manual provides a safe supported circuit; clarify source deactivation rules after reading |
| DC 07 — Thevenin Theorem | 57 | **Advanced, highly worthwhile** | Find equivalent source/resistance and compare load readings against the original network |
| DC 08 — Maximum Power Transfer | 63 | **Upgrade into design challenge** | Vary loads and measure/plot power, contrast maximum power transfer with efficiency; watch part ratings |
| DC 09 — Norton's Theorem | 69 | **Combine or cross-check with DC 07** | Compare Norton and Thevenin equivalents through a safe load; do not dismiss the theory |
| DC 10 — Mesh Analysis | 75 | **Advanced, worthwhile** | Verify calculated loop currents against real measurements; useful for complex network reasoning |
| DC 11 — Nodal Analysis | 83 | **Advanced, highly worthwhile** | Model nodes, predict voltages, measure against circuit common, and compare with mesh methods |
| DC 12 — Capacitor Basics | 91 | **Essential** | Charge/discharge and stored-energy awareness, polarity and voltage ratings, safe capacitor handling |
| DC 13 — RC Circuits | 101 | **Essential** | Build or simulate timing/filters, predict time constant and compare transient response |
| DC 14 — Inductors | 109 | **Essential** | Induction and current-change behavior, magnetic field, switching transients, safe energy dissipation |
| AC 15 — Introduction of AC | 117 | **Essential** | Signal amplitude, period/frequency, RMS, and what a meter shows; use approved low-voltage signal source |
| AC 16 — Oscilloscope and Function Generators | 129 | **Essential skill lab** | Instrument setup, probe reference, time/voltage scales, signal generator verification; no live-mains probing |
| AC 17 — Resistors and Diodes in AC | 143 | **Essential** | Resistance under AC and diode waveform shaping/rectification; actual circuit content to confirm |
| AC 18 — Capacitors in AC | 155 | **Essential** | Frequency-dependent behavior and RC filtering, vary frequency/value and explain waveform changes |
| AC 19 — "Warp-up Project" (title as visible in photographed contents) | 165 | **Capstone candidate** | Examine actual goal and hardware before designing any extension; integrate reasoning, measurement and troubleshooting if appropriate |
| Appendix — Answer Sheet | 175 | **Reference only** | Could help compare student answers after their own attempts; do not publish a full answer sheet |

"Essential" means priority for **learning outcomes**, not that every exercise in that section deserves a full-length build. Actual page review may move entries among categories. Protect first-time safety demonstrations and essential measurement competencies even when repetitive.

## Tentative recommended order for THIS learner

Priority is based on the user's earlier CETa diagnostic, not on a claim about the manual's exact procedures.

**First wave (foundations and measurement safety):** PreLab → DC 01 + DC 04 (as a combined measurement/power check where compatible) → DC 02 → DC 03 → DC 05.

**Second wave (reactive behavior and real instruments):** DC 12 → DC 13 → DC 14 → AC 15 → AC 16 → AC 17 → AC 18.

**Third wave (network analysis and design):** DC 06 → DC 07 ↔ DC 09 → DC 08 → DC 10 ↔ DC 11. These are worth doing, not discardable; sequence may change after reviewing prerequisites and the available components.

**Final:** AC 19, once its actual instructions and prerequisite skills are understood.

This is a possible study path; maintain the original manual order as a selectable alternative in the UI.

## Three high-value proposed multi-experiment upgrades
**Original extensions, not verified EIM manual projects.** All component choices and physical wiring depend on the manual's inventory, supply/probe ratings, and safety instructions.

### A. The faulty resistor network (DC 01–05)

- Read/review the manual's relevant circuit examples.
- Predict total current, branch currents and 3 or more node voltages.
- Use a virtual or low-voltage current-limited physical circuit; practice correct voltage probe positioning.
- Compare predicted and observed values; record tolerances.
- Introduce one controlled safe fault (misvalued resistor or open branch) and locate it using *voltage readings first*.
- **Deliverable:** annotated schematic, prediction table, measurement table, explanation of the fault, and a safe test plan.
- **Why it's useful:** integrates Ohm's law, dividers, Kirchhoff, measurement, and circuit behavior without making the learner repeat identical measurement prompts.

### B. The equivalent-source design challenge (DC 06–11)

- Select a manual-supported network with one or more independent sources as appropriate.
- Derive or measure Thevenin/Norton equivalent safely; use mesh/nodal analysis as independent checks where meaningful.
- Predict and compare load voltages/currents at several load values.
- Plot power versus load and explain maximum power transfer versus practical efficiency.
- **Deliverable:** two equivalent-circuit explanations, load comparison, measurement evidence, and limitations.
- **Why useful:** connects abstract theorems to actual design and troubleshooting, not merely algebra.

### C. See the signal change (DC 12–14, AC 15–18)

- Experiment with capacitance, frequency, phase and waveform changes using a safe signal generator and correct measurement reference.
- Build an RC low-pass or timing application if supported by actual manual components.
- Predict, measure and plot output versus frequency or time; diagnose an incorrect component value.
- Add inductive switching only after source and protection components are verified from the manual.
- **Deliverable:** before/after graphs, oscilloscope captures or simulated traces, reasons for changes.
- **Why useful:** turns rule memorization into observable dynamics.

## Exact information needed before final ranking or project instructions

For **PreLab and DC 01–05** (first pass):
1. **Completed:** PreLab opening p. 1 and remaining PreLab pp. 2–12 reviewed; no missing opening page.
2. **Completed:** DC 02 pp. 21–27 reviewed, and the owner confirmed p. 28 is blank.
3. **If needed for a real build:** Check the particular MEGO/VEGO model's markings, ratings, and the learner's actual component inventory. Don't assume specifications from a drawing alone.
4. **Other experiments:** Request exact diagrams/procedures selectively for worthwhile projects after evaluating their titles and prerequisites.

Project review should record actual experiment identifiers if present (e.g. DC 02 Task 2.1), which of its sub-exercises are redundant, the instrument use involved, verified power/component constraints, and an original extension. Do not use guessed lab IDs or claim proposed extensions are official exercises.

## Companion and CETa cross-links

- **DMM companion:** Ch. 6 pp. 97–103 of *How to Diagnose and Fix Everything Electronic* (third edition), especially series/parallel meter hookups, reference points and continuity with power off.
- **CETa concepts:** current/voltage/power units; Ohm's law; network laws; reactive circuits; safe test procedures; AC/RMS; waveform analysis; component function.
- Separate evidence records for **read / simulated / assembled / measured / explained / troubleshot / mastered**. Completing a theory lesson cannot falsely mark physical lab completed.

## Safety / accuracy policy

Do not propose actual pinouts, current limits, specific power rails, scope ground connections, energized resistance checks, high-energy capacitor discharge techniques, or FPGA/RP2040 interconnects until the exact EIM manuals and equipment model/rating details are available. Avoid live mains entirely. Probes in current mode must be correctly inserted **in series** and never across a supply; voltage probes normally compare two nodes **in parallel**. Simulation is useful to preview safe setups, but never substitutes for checked physical wiring.

## Progress and publishing

Document stays on the v2 **draft branch**. No changes to the deployed site or production Supabase schema. The next implementation should provide:
- Kit landing page and official manual table-of-contents navigation.
- Clear preliminary project priorities; mark "needs manual scan" until each exercise is reviewed.
- Source page references and a visible distinction between official manual experiment and companion enhancement.
- Measurement logs and diagnostic prompts with cloud-synced progress, without publishing scanned manual pages.
- Cross-link to core competency lessons and DMM companion sections.
