# EIM Analog Kit — Section 2.1 Equipment and Tools (pp. 81–93)

**Status:** Source-reviewed planning notes, **not a deployed website lesson**.  
**Source:** User-supplied 13-page scan from EIM *Fundamental Analog Circuits and Semiconductors*, Chapter 2, §2.1, printed pages 81–93. The user confirms this represents the whole §2.1. The next subsection, **§2.2 Familiarize Your Power Supply**, starts at p. 94.

## Source interpretation and inventory boundary

The user explicitly points out that the small resistors, capacitors, and semiconductors are **not itemized** here. This section primarily describes **instrument categories, examples, specifications, alternatives, and tradeoffs**. It does **not** establish a verified per-kit component inventory or prove the learner possesses every pictured instrument.

Do not repeatedly request a missing "complete components list" from §2.1. When project design needs particular small components or ratings, derive them from the *specific experiment's* bill of materials, diagrams, device markings, or supplied kit photographs. Keep the Basic Electric Circuits kit's parts separate from the Analog kit's parts. The two-active-kit rule remains unchanged.

## Verified section themes and page references

| Printed pages | Section / discussion | Source-supported takeaways |
| --- | --- | --- |
| 81–83 | **2.1.1 Power Supplies** | Analog circuits may require variable DC rails; certain op-amp arrangements use **positive and negative rails** relative to reference ground. The book illustrates alternatives such as an adjustable laboratory supply and portable/rechargeable supply with a **splitter/power rail board**, explaining convenience, portability, available output/current capability and protection tradeoffs. Exact output limits, polarities, and current capacity for the user's actual hardware are **not established by this scan**. |
| 83–85 | **2.1.2 Digital Multimeters** | Meter functions and usefulness, plus distinction between accuracy, precision, resolution and displayed digits. Bench and portable examples are compared. Repetition of DMM meter hookups should be **cross-linked** to textbook DMM companion instead of fully re-taught here. |
| ~86–89 | Oscilloscopes / DSOs | Instrument selection and tradeoffs such as **bandwidth**, sampling/resolution or bit depth, and **number of channels**. Some scanned page images are angled/less legible; avoid attributing exact numeric instrument performance to these pages without a clearer verified close-up. |
| ~90–93 | Function generators | Waveform shapes (e.g. sine, square, triangle), **signal amplitude**, **DC offset**, and **frequency range**; considerations when choosing a generator. Do not infer that an external generator is included in this kit based only on illustrations or alternatives. |

The section's illustrated power-supply and test-equipment options are **alternatives**, not proof of supplied parts. Some textbook generalizations about bandwidth, accuracy, waveform shape or particular DMM readings are model-dependent; check instrument specifications before giving precise practical recommendations.

## Curriculum decision

**Priority: Essential knowledge, condensed/combined where redundant.**

Do **not** construct a passive 13-page retelling or a scavenger hunt of instrument labels. The most useful contribution is an original interactive **Analog Bench Setup & Instrument Choice** mini-unit. Use the existing DMM textbook companion for the fundamentals of voltage, current, resistance, and correct meter hookups, then teach the extra instrument-selection and signal-generation concepts here.

Proposed lesson structure, each concept point with **Explain → Interact → Predict → Debrief**:

### AN-LAB-2.1A — Power rails and instrument readiness
- **Concept 1: Reference and rails.** Virtual 0 V/common, +V and −V rails; learner picks a reference and predicts what the meter shows between two nodes. Explain that 0 V reference is chosen relative to the circuit, and a negative rail is not the same thing as a protective earth connection.
- **Concept 2: Choosing a power source.** Compare an adjustable bench source and a portable supply + splitter in a **simulated** op-amp scenario, with qualitative capabilities and constraints; avoid invented hardware output ratings.
- **Concept 3: Safe setup.** Interactive setup checklist: identify supply polarity, power-off wiring, output limits/current limiting where available, and appropriate supply connection. No physical wiring instructions until §2.2 and actual model markings verified.
- **Concept 4: Avoiding a deceptive reference.** Virtual two-point voltage measurement; distinguish the measured circuit return from an assumed chassis/heatsink/speaker terminal.

**Ten graded assessment targets:** identify reference node; interpret +/− rails; predict rail-to-rail potential; recognize a supply configuration requirement; compare source capabilities qualitatively; choose a safe power-off wiring sequence; verify operating limits; choose suitable meter placement; explain why a source's label alone is insufficient; written explanation of circuit common vs positive/negative rails. Include safety-critical deterministic checks.

### AN-LAB-2.1B — DMM, oscilloscope and function generator selection
- **Concept 1: DMM measurement quality.** Compare displayed digits with independently adjusted accuracy/tolerance/noise; explain why more decimal places do not guarantee accuracy. Link to book's DMM chapter rather than repeating all its content.
- **Concept 2: DMM vs oscilloscope.** Switch between a steady DC signal and rapidly changing pulse/dropout; virtual meter vs waveform plot; select the right instrument for the question.
- **Concept 3: Scope bandwidth.** Adjust input frequency and a *simplified illustrative instrument-bandwidth model*; show why a displayed waveform can be attenuated/misleading near instrument limits. Label simplification, not real oscilloscope metrology.
- **Concept 4: Sampling and bit depth.** Move sampling frequency and vertical bit-depth controls on a simulated waveform; compare timing detail, missed features and amplitude quantization.
- **Concept 5: Channel count.** Examine a hypothetical input and output signal at the same time; choose when dual-channel capture is useful.
- **Concept 6: Function generator.** Adjust frequency, amplitude, waveform shape, and DC offset, predicting resulting signal range and scope appearance; ensure virtual choices do not imply real hardware supports those settings.

**Ten graded assessment targets:** accuracy vs resolution; false precision; choose DMM for slow DC; choose scope for fast pulses; recognize bandwidth limitation; compare sampling rates; recognize quantization limits; explain why two channels help; set a generator to a specified sine amplitude and frequency; written justification of appropriate instrument for amplifier gain measurement.

**Assessment integration:** Short prediction checks at each teaching point in addition to **ten scored questions** for each fully published lesson. Written grading must use approved server-side rubric/AI design (if enabled) with safety-critical deterministic validation and no API credentials in GitHub Pages.

## Suggested 2.1 project evaluation

- Source's explanations of different equipment: **Keep as foundational reference**.
- Repeat basic DMM definitions already covered in textbook companion: **Combine / quick review**, not a redundant full hardware project.
- Split-rail concept: **Essential** for op-amp experiments.
- Scope and generator specifications: **Essential**, but model-dependent; postpone precise instrument operation until actual devices and manual §2.2–2.4 are verified.
- No physical build is prescribed by §2.1 alone. Later sections may provide actual experimental builds.

## Next source pages to request selectively

**§2.2 "Familiarize Your Power Supply" (starts printed p. 94)** is the next source needed to establish the intended supply operation and safe rail configuration, followed by **§2.3 Techniques of Measurement** or **§2.4 Grounding** for physical safety.

If the user wants an immediate build rather than more preparation, first review an **actual analog experiment schematic** from Chapter 3 or 4 and inspect the user's genuine available equipment/parts. The user's hardware pictures or model labels, not a generic instrument-selection chapter, govern exact hookup instructions.

## Practical guardrails

- No mains probing, improvised dual-rail creation, or high-energy/high-voltage work.
- Do not assume a power-supply current limit is adjustable on every supply.
- Check op-amp input/output common mode, rail limits, absolute maximum ratings and intended signal polarity only after real component identification.
- Treat oscilloscope reference clip and instrument grounds as potential hazards; never attach a conventional earth-grounded oscilloscope clip to an arbitrary energized node.
- Do not mix parts from the inactive FPGA / RP2040 kits, or assume Basic Electric Circuits inventory is available inside the Analog kit.
- No photos/scans of copyrighted book pages in the public site. Author original circuit diagrams, explanations and exercises.
