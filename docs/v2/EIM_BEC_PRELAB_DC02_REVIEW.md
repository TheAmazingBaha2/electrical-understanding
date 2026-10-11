# EIM Lab-on-the-Go — PreLab + DC 02 evidence review and v2 companion drafts

**Draft status:** Detailed planning based on supplied photographs; **not implemented in site**.  
**Source:** User-provided 36-page PDF scan of the *Basic Electric Circuits* manual, **"PreLab — Component Basics"** and **"DC Experiment 2 — Series & Parallel Circuits."** This source is not a machine-readable PDF; details below were read from rendered scanned pages.  
**Important coverage:** Scan begins at printed **p. 2**, omitting the start of PreLab printed p. 1; several facing-page margins are cut off, and the final **DC 02 exercise text continues beyond / is cropped at the scan's end**. Some intermediate photographs show partial adjacent pages. Do not claim the entire exercises or the full kit inventory have been captured.  
**Reference approach:** Quote only brief labels and refer to printed pages; do not publish the user's scanned manual pages in the public repository.

## 1. What the scans actually establish

### PreLab: Component Basics (printed pp. 2–12 clearly represented; p. 1 not supplied)

From supplied images:
- A resistor has a **nominal value**, **measured value**, and **tolerance**; example uses 1 kΩ ±5%, and resistor color coding, 4-band vs 5-band codes (printed pp. 2–4).
- Resistor **power rating** matters; illustrations show several component sizes / wattages and a burnt resistor. Material says most early labs use **1/4 W** components, with higher wattage in Watt's Law experiments (printed pp. 4–5). The specific user's inventory and component labels still need checking.
- Jumper-wire conductivity, metal material, insulation; **breadboard internal connectivity** and power/ground rails explained (printed pp. 6–8). A board's markings and rail breaks must be verified; pictured layout is not a universal wiring rule.
- DC power supplies and why voltage regulation/current limiting matter, including the small **MEGO** power supply used in the book (printed pp. 9–11).
- The manual describes the **VEGO** multimeter, with voltage/current/resistance functions and additional model-dependent functions (printed pp. 11–12). The manual's pictured controls and socket labels must not be generalized to every DMM.
- A page adjacent to the book refers to another EBL title; it is not evidence of Basic Electric Circuits experiment content.

**Educational value:** Essential safety/bench-readiness micro-module. Some passive component-definition reading can be combined; breadboard connectivity, resistance measurements, meter-jack selection and power ratings must be checked actively.

### DC 02: Series & Parallel Circuits (printed pp. 21–27 represented; last page partly cropped)

**Equipment explicitly pictured/listed at the start of this experiment (printed p. 21):** MEGO portable power supply, VEGO digital multimeter, breadboard, conducting wires, **three resistors (the procedure says each is 1 kΩ)**. This is an **experiment equipment list**, not a proven inventory of everything in the four kits.

**Book's learning goal:** Construct simple series and parallel resistor circuits and verify equivalent-resistance equations against measured values (printed pp. 22–26).

**Part I — Series circuit** (printed pp. 22–24 / scan images):
1. Measure the resistance of **each of the three 1 kΩ resistors**, and record actual values as R1, R2, R3.
2. Compute series equivalent resistance from the **measured individual resistances**.
3. Construct the three resistors in series on a breadboard, and measure **total resistance on the unpowered network** using VEGO's resistance mode.
4. Set power supply to **5 V** and build the powered series circuit.
5. Measure **supply/load voltage** and **circuit current**, changing meter mode and connection properly (printed illustration shows separate voltage/current measurement setups).
6. Use R = V / I to compute equivalent resistance and compare the calculated, direct measured and inferred values.

**Part II — Parallel circuit** (printed pp. 25–27 in scan):
1. Calculate equivalent resistance for the three 1 kΩ resistors using the reciprocal equation.
2. Construct the parallel network, measure equivalent resistance with power **off**.
3. Build the powered version and set the supply to **5 V**.
4. Measure voltage and current, compute resistance from Ohm's law, and compare equivalent resistance methods.
5. Printed exercises ask whether different methods agree closely and whether taking an **ohmmeter reading while supply remains connected and on** is valid. Correct instructional conclusion for safety: **no**—do not attempt energized resistance measurements.
6. The scan cuts off the bottom/continuation of the exercise pages: request the printed final page (around p. 28) if necessary before claiming the full exercise is documented.

**Illustrative readings visible in the book's completed tables**:
- Series: R_total(calc) 3 kΩ, R_total(measured) 3 kΩ, Vs 5 V, Is 1.67 mA, R = Vs/Is ≈ **2.99 kΩ**.
- Parallel: R_total(calc) ~0.33 kΩ, R_total(measured) ~0.33 kΩ, Vs 5 V, Is 15 mA, R = Vs/Is ~0.33 kΩ.

These are **printed example values**. The user's actual physical resistor tolerances and meter readings will differ.

### Expected ideal quantities for three 1 kΩ resistors on an *ideal* 5 V DC source

| Configuration | Equivalent R | Supply I | V across each resistor | I in each resistor |
| --- | ---: | ---: | ---: | ---: |
| Series | 3,000 Ω | 1.667 mA | 1.667 V | 1.667 mA |
| Parallel | 333.3 Ω | 15 mA | 5 V | 5 mA |

Interpretation, additional to book exercise:
- Series elements carry the **same current**; identical resistors share an equal portion of voltage.
- Parallel elements have the **same two node voltages**; identical branches carry equal current.
- Opening **one parallel branch** with an ideal 5 V source removes that branch's 5 mA but doesn't increase voltage/brightness in the remaining branches; source current falls from **15 mA to 10 mA**.
- Opening **one series element** interrupts the complete series path; current falls to **0 A**.
- Equivalent-resistance check **R = V/I** uses **total source** V and **total supply** I, not an arbitrary branch current.

## 2. Recommendation on what is worth doing

### PreLab — **Keep, but compact and make interactive**
Don't repeat paragraphs of standard component descriptions. Use a **Bench Readiness Passport** with short checkpoints:
1. Given nominal R and tolerance, predict an acceptable measured range; inspect a 4-/5-band color-code visual.
2. Verify breadboard strip connectivity with an animated, movable virtual continuity probe. Include a deliberate non-connection.
3. Identify the meter's VΩ, COM, and fused current inputs on a *generic* trainer, and distinguish voltage (across), current (inserted in series), and resistance (unpowered).
4. Choose power and resistor ratings; at 5 V across one 1 kΩ resistor ideal power = **25 mW = 0.025 W**, well below 0.25 W when correctly selected and no unexpected conditions.
5. Check real equipment model, power rail polarities, source limit and voltmeter connection before turning on any breadboard circuit.

**Pass/fail:** Demonstrate meter safety before any physical measurements. No artificial unlock for unrelated theory.

### DC 02 — **Essential project**, keep core book measurement procedure once
It is NOT just redundant arithmetic: three distinct methods of equivalent R (from separately measured parts, direct unpowered ohmmeter reading, and inferred from voltage/current) are useful triangulation. Preserve **both** series and parallel assembly and those three methods.

But **upgrade the instructional experience**:
- Require learner to predict **not only total R and total I, but also node voltages and branch currents** before powering.
- Provide a virtual breadboard continuity overlay to catch disconnected strips and miswired resistors.
- Include a meter-placement simulation, with **blocked/flagged current-mode connection across the 5 V source**.
- Explicitly compare book's approximate values and student's real recorded readings with sensible tolerance awareness.
- After the successful circuit, introduce **one safe controlled fault** in simulation first (open branch or misvalued resistor), ask which readings would isolate it; optionally perform a real low-voltage version only after verifying the hardware and student's setup.
- Ask the student to write **one explanation of why an open parallel branch decreases total current while the other branch voltages remain unchanged**. This specifically targets the user's CETa diagnostic misconception.
- Allow a "quick completion" mode for basic one-off repetition **only after** correct safe technique is demonstrated.

### Why we should not skip either series or parallel
The original diagnostic revealed errors around Ohm's law arrangement, selecting total vs individual resistance, predicting circuit behavior, and voltmeter vs ammeter hookups. Completing DC 02 carefully has unusually high payoff because it connects those four weaknesses.

## 3. Proposed v2 lab companion: PreLab Bench Readiness

**ID:** EIM-BEC-PRELAB.  
**Source:** PreLab p. 2 onward; p. 1 not yet supplied.  
**Teach–Interact–Predict–Debrief** at every concept point:
1. **Resistor tolerance:** Value/tolerance sliders and acceptable-range indicator; predict whether 1030 Ω is plausible for 1 kΩ ±5%.
2. **Color codes:** Rotate/select bands and decode / encode values.
3. **Ratings:** Adjust V/R; show expected resistor heating power relative to selected watt rating, clearly distinguishing simulations from approved build ratings.
4. **Breadboard internals:** Tap two holes to see whether they are electronically connected on the illustrated board; highlight rail gaps and center trough.
5. **Bench setup:** Pick probe modes/jacks and set a virtual 5 V source; system catches invalid modes and open/short wiring before "power on".

**Ten graded checks:** nominal vs measured; ±5% limits; color bands; resistor power; selecting safe rating; which breadboard holes share a strip; separate rail continuity; voltage meter placement; resistance with power OFF; correct current-input and series method. A physical safety check is required for practical-lab credit.

## 4. Proposed v2 lab companion: DC 02 Three-Resistor Challenge

**ID:** EIM-BEC-DC02.  
**Source:** DC 02 pp. 21–27; verify last exercise page separately.  
**Activity map (each point has an interaction):**

1. **Predict:** Choose 3 resistors, initially 1 kΩ each, configure series; calculate total R and current at 5 V. Reveal with a virtual ammeter.
2. **Build:** Assemble on an interactive breadboard, placing jumper wires and exploring hidden connections.
3. **Measure without power:** Place probes for resistance; challenge learner to explain why source must be disconnected.
4. **Measure with power:** Change virtual meter from resistance to voltage to current and connect appropriately; flag short-risk configurations.
5. **Independent verification:** Enter the learner's **actual R1,R2,R3 and measured total resistance, V, I** from manual lab. Compare three approaches with tolerance and uncertainty caveats, rather than grading a memorized 3 kΩ.
6. **Switch to parallel:** Rebuild so resistor terminals share the same nodes; predict 333.3 Ω and 15 mA total at 5 V.
7. **Branch current:** Change one resistor to 2 kΩ in the virtual experiment; observe total vs individual branch currents at the same voltage.
8. **Fault mode:** Open one parallel branch; predict what stays constant and what changes.
9. **Diagnostic mode:** Find an open series link or a wrong resistor value from measured node potentials.
10. **Debrief:** Explain in plain language which readings justify the diagnosis, and identify what would have gone wrong if the multimeter were left in current mode across the supply.

**Ten graded assessment checks** (in addition to within-lesson prediction):
1. Calculate 3×1 kΩ series equivalent ⇒ 3 kΩ.
2. At 5 V with 3 kΩ series load, calculate source current ⇒ ~1.667 mA.
3. Calculate voltage drop per ideal equal series resistor ⇒ ~1.667 V.
4. Calculate parallel equivalent ⇒ ~333.3 Ω.
5. Calculate total parallel current at 5 V ⇒ 15 mA.
6. Virtual measurement: place a voltmeter across one parallel branch (correct: parallel).
7. Virtual measurement: position a current meter in series at a safe open link; direct across source is blocked.
8. A parallel branch opens: predict source current decreases to 10 mA; surviving branch voltage remains 5 V for ideal regulated source.
9. An unpowered parallel network measured 345 Ω vs ideal 333 Ω: explain plausible tolerances/lead or contact effects and that a small deviation by itself doesn't prove a fault. Exact acceptability depends on actual parts/specs.
10. Written troubleshooting: given fault readings, identify likely break and justify a safe next measurement; rubric requires distinct V/I/R modes, power state and instrument reference.

**Physical project report fields:** resistor color/nominal/tolerance, three individually measured resistor values, measured series and parallel equivalent R (unpowered), source V, total I, computed V/I resistance, predicted vs measured differences, wiring photo optional/private, misconception correction, completion of safety checks.

**Review cycle:** 1 day (meter hookup); 1 week (open parallel branch), 3–4 weeks (fault tracing) as a flexible proposed schedule, not a claim that reminders or scheduler are already enabled.

## 5. Safety and source limitations

- The manual mentions a regulated power supply capable of adjustments below a stated voltage range. That does **not** mean every such voltage or supply is safe in all circumstances. **Use only a verified current-limited low-voltage setup** and follow the actual MEGO/VEGO ratings and manual.
- Resistor meter measurements are on **power-off, safely discharged, disconnected** setups. Physical meter probes, selector and input jacks must be inspected.
- **Do not connect a current-mode DMM across a power supply**; the resulting low-resistance path can produce a short.
- In-circuit resistance can be distorted by other paths; the lab's isolated resistor network should be checked before measuring.
- Simulated rails/points, not assumptions about chassis or ground terminals, dictate measuring references.
- The scan includes photos of a **generic full-size breadboard** and **MEGO's rail interface**; don't assume all actual boards' split power rails, pin layouts or supplied connectors are identical.
- This study draft does not certify any physical electrical setup. No mains measurement or real high-energy fault injection.

## 6. Implementation / staging

This file is a **reviewed-source design draft** on \`draft/v2-dmm-companion\`, not installed executable lessons. When implementing v2:
- Link to the EIM source in the new Hands-On Lab track and tag competencies shared with CETa DC01/02 and textbook DMM work.
- Use stable IDs \`EIM-BEC-PRELAB\` and \`EIM-BEC-DC02\` to prevent progress collisions.
- Keep physical build evidence separate from virtual-completion credit.
- Make all experiments mobile friendly and cloud synced; avoid client-side AI secrets.
- Do not publicly upload the source scan or its figures. The website should contain **original** circuit art and authored prompts.
- QA meter protections and actual source ratings before enabling project completion.

## 7. Additional documentation to request

The scan covers enough to start designing this lab, but before final publication / real hardware instructions ask for:
1. **PreLab printed p. 1** (not in provided scan) to complete introductory source coverage.
2. **The final page of DC 02** (likely p. 28), including any exercises cropped by the end of the scan.
3. Actual MEGO and VEGO **model labels/rating screens** and kit component inventory *only if the published project needs precise instrument setup or special component choices*. The visible official experiment list already confirms MEGO, VEGO, breadboard, jumpers and three nominal 1 kΩ resistors.

