# Chapter 6 Companion — Digital Multimeters

**Status:** BDMM-01 and BDMM-02 are implemented as working, graded and visually interactive staging lessons. BDMM-03 through BDMM-07 remain authored curriculum plans, **not** published or accessible lessons.  
**Companion unit ID:** BOOK-GEIER3-CH06-DMM  
**Source:** Michael Jay Geier, *How to Diagnose and Fix Everything Electronic*, third edition, Chapter 6, pages 97–103 ("Digital Multimeter"). Chapter 6's separate ESR meter subsection starts on page 103 and is outside this draft.  
**Audience:** A learner with basic experience who mixed up current and voltage probe placement in their CETa diagnostic.  
**Dependency:** Optional companion track; never block the main CETa curriculum.  
**Safety:** All exercises are simulated or use disconnected/battery-powered, low-voltage, current-limited teaching circuits. Nothing requires probing live mains or opening energized appliances.

## Lesson design approach

A lesson is not just reading followed by ten questions. Every teaching point uses four steps:

**Explain** the idea using ordinary language, **Interact** with a working simulation, **Predict** what happens when one thing changes, and **Debrief** the observation in terms of circuit behavior. No passive "click next" disguised as an interaction.

Written answers should be checked against a published rubric. A future AI grader, if enabled, should give feedback on causal reasoning and missing concepts, not reward merely repeating keywords. Authentication, server-side evaluation, pricing, and privacy must be resolved before releasing AI grading. Do not automatically mark safety-critical reasoning as mastered solely on an AI response.

Keep book references visible in a small sidebar ("Read pages X–Y") but make every lesson understandable on its own. All prose and exercises are original, not copies or close paraphrases of book text.

## BDMM-01 — The number on the screen isn't the whole story
**Pages:** 97–98. **Estimated study time:** 30–45 minutes.  
**Outcomes:** Distinguish reading, resolution, accuracy and real change; choose DMM vs oscilloscope; interpret jitter.

### Human explanation — opening sample

You connect a meter to a supply marked 5 V, and it reports 5.04 V. Does that mean the supply is faulty? Usually, no. "5 V" is a target value, and real components have tolerances. A meter has its own accuracy limits too. The extra digits tell you how finely the display can show a number; they don't magically guarantee every digit is correct.

Now imagine the reading dances between 4.98 and 5.03 V. That might be ordinary noise or the meter settling. If your goal is to find out whether a battery is approximately healthy, a DMM is useful. If you want to see the shape of a rapidly changing electrical signal, you usually need an oscilloscope.

### Teaching points and required interactions

1. **What DMMs are good at:** Choose among a steady battery, slowly changing supply, and fast pulses; preview plausible instrument displays. Prediction: which signal's important behavior is hidden by an averaging display?
2. **Expected vs measured:** Adjustable nominal 5 V source, tolerance slider, and simulated reading. Learner classifies "probably normal", "investigate", or "not enough information"; feedback separates tolerance from failure.
3. **Display resolution vs accuracy:** Toggle 2- and 3-decimal displays; independently vary actual error. Explanation shows why more digits do not guarantee less measurement error.
4. **Noisy vs steady:** Adjustable controlled noise around an otherwise stable 5 V line; show snapshots and a time plot. Ask whether a small wobble proves a defective part.
5. **Choosing an instrument:** Simulated signal with brief hidden dropouts; compare slow DMM numerical updates with a time-domain oscilloscope trace.

### Ten assessment questions (specification and expected reasoning)

1. **Choice:** Best instrument to verify a stable 3 V battery? **DMM**; values change slowly enough.
2. **Choice:** Best instrument to see a 1 ms dropout on a 5 V line? **Oscilloscope**; numerical updates can miss it.
3. **Scenario:** Supply rated 6 V measures 6.1 V; immediately declare it defective? **No**; specifications and conditions matter.
4. **Choice:** A 5.002 V display necessarily indicates greater accuracy than 5.00 V? **No**; distinguish resolution and accuracy.
5. **Interactive classification:** Simulated 5 V supply oscillates ±0.02 V; identify whether slight jitter alone proves a fault. **No**.
6. **Numeric:** 5 V ±5% acceptable range? **4.75–5.25 V**.
7. **Choice:** A reading jumps between 0 V and 5 V repeatedly. First conclusion? **Investigate connection / signal behavior**, not assume exact cause.
8. **Interpretation:** Compare two meters with different resolution but documented errors; decide which is closer to a given true voltage. **Use error specifications, not digits**.
9. **Written:** Explain in your words why a display value can change slightly on a healthy circuit. **Rubric:** noise, settling, supply variation, meter limitations; avoid claiming every variation indicates failure.
10. **Written:** When would you choose a scope over a DMM? **Rubric:** rapid changes or waveform shape; DMM useful for relatively steady quantities; instrument suitability depends on frequency and model.

**Review seed:** Present a plausible 5.00 V supply reading with extra digits one week later; ask what those digits do and do not establish.

## BDMM-02 — DC voltage: compare two points
**Pages:** 98–99. **Estimated time:** 40–50 minutes.  
**Outcomes:** Put voltage probes across the right two points; understand reference points; use DC mode and ranges; interpret negative readings.

### Teaching points and interactions

1. **Voltage is a comparison:** Drag two virtual meter probes to nodes in a battery-resistor circuit; output is V(red) – V(black). Prediction: what changes if probes are exchanged?
2. **Identifying a usable reference:** Choose from a verified circuit common node, chassis, heat sink, and speaker terminal. Only permit "known common" without further verification. Explain that chassis/heatsink/speaker terminals are not inherently ground.
3. **Finding a supply fault:** Probe supply input and load node; choose which location to test next from a fault tree.
4. **Auto/manual range:** Choose AC/DC and manual high/low ranges for a known-safe simulated voltage. Feedback shows settling and out-of-range rather than teaching that every real meter behaves identically.
5. **Steady vs unstable:** Compare noisy readings at a filtered power rail vs intentionally pulsed signal. Choose an oscilloscope when timing matters.

### Ten assessment questions

1. **Choice:** Measure resistor voltage by connecting probes **across its two ends**.
2. **Interactive:** Red at 5 V relative to common, black at common ⇒ **+5 V**.
3. **Interactive:** Reverse probes ⇒ **−5 V**.
4. **Choice:** Is a metal heat sink always ground? **No**.
5. **Choice:** Is speaker negative always circuit common? **No**.
6. **Scenario:** A manual-range meter faces unknown *safe low voltage*; **start on an adequately high voltage range**, then reduce.
7. **Choice:** Stable DC rail; appropriate mode? **DC V**, suitably rated.
8. **Interpretation:** Expected 5 V regulated rail, meter shows small fluctuations; what next? **Check specification and circuit behavior before diagnosing**.
9. **Written:** Explain how you determine suitable voltage-reference points. **Rubric:** two-node difference, follow verified schematic/ground, never assume chassis or audio return.
10. **Troubleshooting:** Battery node has proper voltage but load node reads 0 V; next **trace the path and investigate an open connection or switch**.

## BDMM-03 — AC voltage: RMS isn't the peak
**Pages:** 99–100. **Estimated time:** 40–50 minutes.  
**Outcomes:** Distinguish peak, peak-to-peak and RMS for a sine wave; know AC DMM limitations; avoid mains-based exercises.

### Teaching points and interactions

1. **The sine wave:** Plot a simulated AC waveform; sliders for peak amplitude and frequency. Mark Vpeak, Vpp and VRMS distinctly.
2. **What RMS describes:** Compare heating in an ideal resistor driven by sine AC and steady DC; explain why the same RMS voltage gives the same average resistive heating.
3. **Different waveforms:** Toggle sine and square wave, showing that a fixed peak does not imply the same RMS; warn that meter accuracy depends on true-RMS capability, crest factor, and bandwidth.
4. **Why instruments disagree:** Show a DMM AC value beside a scope trace of audio/high-frequency pulses; prompt prediction on misleading/unstable readings.
5. **Safety:** Demonstrate with *virtual* waveforms only. No real mains or grounded-scope measurement task; verify equipment-specific category ratings in later advanced lessons.

### Ten assessment questions

1. **Choice:** RMS represents **DC-equivalent heating in a resistive load**.
2. **Numeric:** 14.14 V peak sine ⇒ approx **10 V RMS**.
3. **Numeric:** 20 V peak-to-peak sine ⇒ approx **7.07 V RMS**.
4. **Numeric:** 5 V peak sine ⇒ **10 V peak-to-peak**.
5. **Choice:** 120 V RMS means 120 V peak? **No**.
6. **Interactive:** Double sine Vpeak; what happens to sine VRMS? **Doubles**.
7. **Choice:** Two different waveforms with identical peak must have same RMS? **No**.
8. **Scenario:** Fast, narrow pulses do not read reliably on a DMM; prefer **scope/appropriate instrument**.
9. **Written:** Contrast DMM RMS value with oscilloscope peak-to-peak display. **Rubric:** RMS and waveform extrema convey different information; Vpp = 2√2 × Vrms for ideal centered sine only.
10. **Instrument choice:** Why can AC readings vary by DMM model? **Bandwidth, waveform assumptions, true-RMS design and accuracy specs**.

## BDMM-04 — Resistance and continuity: the power must be off
**Pages:** 100–101. **Estimated time:** 40–50 minutes.  
**Outcomes:** De-energize safely, recognize alternative paths, interpret continuity and open-circuit displays.

### Teaching points and interactions

1. **Resistance mode supplies its own test signal:** Virtual circuit power toggle; inhibit testing while energized and explain safe discharge.
2. **In-circuit measurement surprises:** Simulator reads 100 Ω alone vs two 100 Ω parallel paths; predict false-low readings. Toggle one resistor leg isolated.
3. **Ranges and resolution:** Adjust manual range and show out-of-range / reduced display resolution, without claiming one universal meter design.
4. **Continuity:** Click open/closed switches and broken wires; show a beep only for modeled low-resistance paths; explain thresholds vary by model.
5. **When 'beep' misleads:** Transformer winding and alternate circuit paths; ask whether audible continuity guarantees a healthy component. It does not.

### Ten assessment questions

1. **Safety:** Resistance measurement requires **power disconnected and stored energy discharged**.
2. **Choice:** Why does the resistance function work with the supply off? **Meter provides a test signal**.
3. **Numeric:** Two 100 Ω resistors in parallel ⇒ **50 Ω**.
4. **Choice:** Can in-circuit reading be below individual resistance? **Yes, through other paths**.
5. **Choice:** Why lift one resistor end when testing? **Remove alternate paths**.
6. **Interactive:** Closed switch continuity ⇒ **low resistance / beep depending threshold**.
7. **Interactive:** Broken wire continuity ⇒ **open/OL or no beep**.
8. **Choice:** Continuity beep tells exact resistance? **No**.
9. **Interpretation:** Low winding resistance means transformer winding must be shorted? **Not necessarily**.
10. **Written:** Describe safe process to test a board resistor. **Rubric:** off, discharged, meter ohms, possible parallel paths, isolate when needed.

## BDMM-05 — Current mode changes the path
**Pages:** 101–102. **Estimated time:** 45–60 minutes.  
**Outcomes:** Correctly measure current in series; select proper fused input; understand meter burden and limits; avoid unsafe connections.

### Teaching points and interactions

1. **Voltage vs current connection:** Drag a virtual DMM into circuit; voltage mode must bridge two nodes, current mode must replace a segment of one path. Explanation: current has to pass through the meter.
2. **Unsafe parallel current path:** Clicking current mode across a source triggers a non-energizing safety lockout plus a clear explanation; never simulate physical damage as a required action.
3. **Jacks and range:** Explore COM, VΩ, mA, and A jacks on generic training DMM; device-specific labels and fuses vary.
4. **Limits and overload:** Change load resistance in a current-limited battery circuit. Mark when the simulated fuse/range would be exceeded.
5. **Burden voltage:** Compare load behavior with ideal ammeter and nonzero meter shunt resistance; predict when the meter affects the circuit.
6. **Fault tracing:** Open a circuit at a known accessible test point and insert the virtual meter; practice choosing between voltage tests and invasive current tests.

### Ten assessment questions

1. **Safety:** Current-mode meter is inserted **in series**.
2. **Safety:** Current-mode probes connected across battery ⇒ **short/high overcurrent risk**.
3. **Choice:** Before rewiring for current: **de-energize and check jacks/settings**.
4. **Choice:** Input jack must match expected current and meter rating: **yes**.
5. **Choice:** A current fuse can be exceeded even if a current range is selected: **yes**.
6. **Numeric:** Ideal 5 V and 1 kΩ series load ⇒ **5 mA**.
7. **Interactive:** Insert ammeter in branch; direction reversed ⇒ **negative sign on many DMMs**.
8. **Choice:** Burden voltage is **voltage drop caused by meter's internal measurement resistance**.
9. **Troubleshooting:** Circuit operates until meter inserted; plausible cause? **Wrong connection, wrong range, or burdensome meter insertion**.
10. **Written safety check:** Describe a safe low-voltage current-measurement procedure. **Rubric:** disconnect, estimate current, use appropriate fused jack and range, open branch, series insertion, verify, reenergize only when safe, do not bridge source. MUST pass to mark lesson complete.

## BDMM-06 — Diode testing: conduction in one direction
**Pages:** 102–103. **Estimated time:** 35–50 minutes.  
**Outcomes:** Read a diode-test result as approximate forward drop; distinguish a likely good, open, or shorted diode; recognize test limitations.

### Teaching points and interactions

1. **Current chooses a direction:** Flip a virtual silicon diode; animated current arrow appears only in a forward conducting test configuration.
2. **Display means voltage, not ohms:** Compare resistance and diode modes for one component; explain internal source and forward junction drop.
3. **Reverse test:** Toggle probes on a simulated unpowered diode. "OL" represents the instrument's open/out-of-range indication; not a universal numeric 1.4 V value.
4. **Fault gallery:** Set good / short / open / leaky diode cases, record forward and reverse readings, then classify with reason.
5. **Limitations:** Different junction types and temperature produce different drops; in-circuit parallel paths can mislead. Always power down and discharge before testing.

### Ten assessment questions

1. **Choice:** Diode mode primarily displays **forward junction voltage**.
2. **Choice:** Typical silicon forward example in book: approx **0.6–0.7 V**, not a universal guarantee.
3. **Interactive:** Reverse-bias good diode ⇒ **OL / nonconducting** on a suitable tester.
4. **Interpretation:** ~0 V both directions ⇒ **likely short**.
5. **Interpretation:** OL both directions ⇒ **likely open or incorrect test conditions**.
6. **Choice:** Can diode result vary by meter? **Yes**.
7. **Safety:** Power for diode test? **Off, stored energy discharged**.
8. **Choice:** Is diode test the same as normal ohmmeter measurement? **No**.
9. **Written:** Explain why leads are reversed for a proper diode check. **Rubric:** test forward and reverse behavior; compare possible faults.
10. **Troubleshooting:** Healthy diode gives odd result in circuit; next **consider parallel components, polarity, and isolating one lead**.

## BDMM-07 — Capstone: the silent indicator (original case)
**Pages:** Draws on 97–103, but this case is an original teaching exercise, not in the book. **Estimated time:** 50–65 minutes.  
**Equipment:** Simulated 5 V current-limited source, series resistor, silicon LED, switch, and one hidden open connection. No live measurements needed.

### Teaching points and interactions

1. **Notice symptoms, don't guess:** Indicator is dark; inspect source, switch and path. Learner selects a hypothesis and explains what reading would confirm it.
2. **Voltage before current:** Place probes across verified nodes and infer whether supply reaches the load. Warn against unnecessary series breaking.
3. **Power off for continuity:** Toggle off, discharge if applicable, use a virtual continuity tester to locate the open.
4. **Check components:** Use diode mode to separate good LED from incorrect orientation/defect cases.
5. **Compare evidence:** Show readings in a fault log, force a supported diagnosis, and write a safe repair recommendation.

### Ten assessment questions

1. **Choice:** First non-invasive low-voltage supply check ⇒ **DC voltage at source**.
2. **Interactive:** Probe a verified 5 V node against known common ⇒ **5 V**.
3. **Choice:** Dark LED means diode definitely defective? **No**.
4. **Choice:** Verify continuity only after **de-energizing**.
5. **Interpretation:** Open switch gives no conduction through that path ⇒ **no current**.
6. **Interactive:** Place the meter across source in current mode ⇒ **unsafe / locked out**.
7. **Interactive:** Correct forward LED diode test on safe unpowered simulated circuit ⇒ **modelled forward junction drop**.
8. **Troubleshooting:** Source 5 V, upstream node 5 V, downstream node 0 V across an open trace: **investigate broken connection**.
9. **Written:** Explain why voltage tests can isolate faults before opening circuit for current tests. **Rubric:** less invasive, compare reference-node potential, maintain safety.
10. **Written capstone:** Give fault, supporting measurements, and safe next step. **Rubric:** coherent evidence chain, correct units/meter mode, power-off work, never bypass protection.

## Learning interface and persistence

- **Hierarchy:** Companion Library > book > chapter > subsection > lesson > teaching point > experiment > ten-question assessment.
- **IDs:** Stable \`BDMM-01\` through \`BDMM-07\` used in database records; must not conflict with core \`L01\`–\`L05\`.
- **Progress:** save teaching-point interactions / predictions, question attempts, rubric feedback, mastery tags, reviewDue, and updatedAt per authenticated user. Prevent stale merges and retain user history.
- **Access:** The companion sequence is suggested, not locked behind CETa core; allow opening later subsections voluntarily.
- **AI evaluation:** Future authenticated server-side AI for written work only if explicitly enabled, with transparent rubric, clear uncertainty, an option to challenge feedback, and non-AI fallback.
- **QA:** Simulations produce internally consistent values and units, no dangerous real-world instructions, 10 graded questions per lesson, sync validated across both devices, touch + keyboard controls.
- **Copyright:** Do not upload the scanned pages to public site source. Point to chapter and page numbers, and publish original explanations, diagrams and exercises.

## Follow-on unit

Page 103 begins **ESR Meter**, which continues on subsequent pages that were not included in the provided scan. Do not develop that companion lesson from presumed chapter content; request the next pages before grounding it in the book.

## Implementation milestone — the first two DMM lessons (2026-10-11)

**Implemented on \`draft/v2-dmm-companion\`; not merged into \`main\` or production.**

- \`book-lessons.js\`: original independent companion lesson records \`BDMM-01\` and \`BDMM-02\`, ten graded checks each, clear source-page annotations (pp. 97–98 and 98–99), and five substantive Explain → Interact mini-labs each. Safety-critical checks must pass. Written reflections use explicit self-assessment rubrics; AI grading is still **not** enabled.
- \`dmm-widgets.js\`: ten responsive SVG visual experiments for steady/transient signals, specified voltage tolerance, display accuracy vs resolution, fluctuation, instrument choice, two-node voltage probes, verified circuit common, simulated open switch fault, proper voltage function/range, and an intermittent rail.
- \`v2-panels.js\`: a dedicated Geier Chapter 6 sub-track page with only the first two lessons launchable, \`BDMM-02\` gated behind completion of \`BDMM-01\`. BDMM-03 through 07 appear as **planned** only.
- \`app.js\`: book progress and review items are recorded under separate stable \`BDMM-* \` keys, using the existing \`lesson_progress\` structure without touching core \`L01–L05\` or \`EIM-BEC-*\` records. Unlocking a textbook lesson **never gates other tracks**.
- Dashboard includes separate virtual textbook completion and graded-evidence categories. The answer pie correctly separates answered and unattempted checks for both EIM and textbook companions.
- \`lesson-overviews.js\` provides independent real electronics scenarios instead of repeating Learn/Interact/Quiz tab labels.
- Cloudflare Workers \`*.workers.dev\` staging safeguard remains in force: production Supabase sync disabled; practice saves to this browser only.
- JavaScript check, static asset deployment allowlist, Node regression tests and headless Chromium desktop/mobile browser tests cover the new content. Inspect the latest GitHub Actions result before claiming deployment verified.
- Textbook citations here refer to the specific **previously reviewed** Geier section. Original illustrations and explanatory wording are used; the scanned chapter is not uploaded or copied into the public repository.

**Known limitations:** No physical bench probe placement, actual instrument calibration, live wave capture, secure AI evaluation or user-approved cross-device staging sync. The five remaining DMM chapter designs are **not** passed or published. No new user scans are required to review this first pair.
