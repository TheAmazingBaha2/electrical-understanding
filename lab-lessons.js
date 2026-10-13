// Original interactive EIM companion lessons based on user-supplied PreLab pp. 1–12 and DC 02 pp. 21–27. Not reproductions of the manual.
export const labLessons = [
  {
    "id": "EIM-BEC-PRELAB",
    "module": "EIM · Basic Electric Circuits · PreLab",
    "subtrack": "basic",
    "title": "Bench Readiness — Components and Instruments",
    "minutes": 50,
    "experiment": "embedded",
    "description": "Understand the parts you handle, how your breadboard connects, and how to choose safe measurement methods before building circuits.",
    "html": "<p>You don't need to memorize a pile of component names before touching a breadboard. You do need to know what a component is supposed to do, how its terminals are connected, and what kind of measurement is safe to make. This PreLab is a short series of experiments that help you see those ideas in action.</p>\n <h3>1. A resistor's printed value is a target, not a promise</h3><p>A resistor labeled <strong>1 kΩ ±5%</strong> can be a little above or below 1,000 Ω and still meet its rating. Slide the measured value and see when it falls outside the expected range. Real meters also have their own accuracy limits.</p><div class=\"lab-widget\" data-lab-kind=\"tolerance\"><p class=\"muted sm\">Loading interactive activity…</p></div>\n <h3>2. The color bands are a value label</h3><p>For a common four-band resistor, the first two colors are significant digits, the third is a multiplier, and the fourth usually describes tolerance. Change the bands to decode the value rather than trying to recognize the resistor by appearance alone.</p><div class=\"lab-widget\" data-lab-kind=\"bands\"><p class=\"muted sm\">Loading interactive activity…</p></div>\n <h3>3. A resistor also has a power limit</h3><p>Resistors convert electrical energy into heat. More voltage across a fixed resistor means more power to dissipate. Changing the voltage below simulates that effect; it does <strong>not</strong> authorize using that voltage on the real kit.</p><div class=\"lab-widget\" data-lab-kind=\"rating\"><p class=\"muted sm\">Loading interactive activity…</p></div>\n <h3>4. A breadboard hides connections underneath</h3><p>On the typical training breadboard illustrated in the manual, the five holes in one numbered strip on either side of the center gap are connected. The two sides are separated. Side supply rails can be connected differently or split, so always verify your actual board.</p><div class=\"lab-widget\" data-lab-kind=\"breadboard\"><p class=\"muted sm\">Loading interactive activity…</p></div>\n <h3>5. A meter changes how it connects depending on the measurement</h3><p>Voltage is a difference between two points, so measure <strong>across</strong> a component. Current passes through the meter when it is inserted <strong>in series</strong>. Resistance testing supplies its own small test signal, so the circuit must be disconnected from power and safely discharged.</p><div class=\"lab-widget\" data-lab-kind=\"meter\"><p class=\"muted sm\">Loading interactive activity…</p></div>\n <div class=\"callout\"><b>Physical work:</b> Before using the MEGO supply or VEGO DMM, check the actual labeling, rating, lead jacks and power-limiting features on your device. Practice these examples virtually first. No mains equipment is involved.</div>",
    "questions": [
      {
        "id": "p01",
        "type": "choice",
        "prompt": "What does the ±5% marking on a 1 kΩ resistor tell you?",
        "choices": [
          "It can only withstand 5 volts",
          "Its actual resistance can vary by 5% around nominal",
          "Its power is 5 watts",
          "It changes resistance by 5% every second"
        ],
        "correct": 1,
        "explain": "Tolerance gives the permitted variation from the nominal resistance."
      },
      {
        "id": "p02",
        "type": "number",
        "prompt": "What is the minimum resistance, in ohms, for 1 kΩ ±5%?",
        "answer": 950,
        "tolerance": 0.2,
        "unit": "Ω",
        "explain": "1,000 × (1 − 0.05) = 950 Ω."
      },
      {
        "id": "p03",
        "type": "number",
        "prompt": "What is the maximum resistance, in ohms, for 1 kΩ ±5%?",
        "answer": 1050,
        "tolerance": 0.2,
        "unit": "Ω",
        "explain": "1,000 × 1.05 = 1,050 Ω."
      },
      {
        "id": "p04",
        "type": "choice",
        "prompt": "Brown–Black–Red on the first three bands of a four-band resistor indicates:",
        "choices": [
          "10 Ω",
          "100 Ω",
          "1 kΩ",
          "10 kΩ"
        ],
        "correct": 2,
        "explain": "Brown=1, black=0, red means ×100, giving 10 × 100 = 1,000 Ω."
      },
      {
        "id": "p05",
        "type": "number",
        "prompt": "A 1 kΩ resistor has 5 V across it. How many milliwatts does it dissipate?",
        "answer": 25,
        "tolerance": 0.05,
        "unit": "mW",
        "explain": "P=V²/R=25/1000 W=0.025 W=25 mW."
      },
      {
        "id": "p06",
        "type": "choice",
        "prompt": "On a typical breadboard, which pair is connected?",
        "choices": [
          "A1 and E1 on the same side",
          "A1 and F1 across the center gap",
          "A1 and A2 in different rows",
          "Every red power rail on every board"
        ],
        "correct": 0,
        "explain": "A1 and E1 usually share the same five-hole strip on one side of the gutter."
      },
      {
        "id": "p07",
        "type": "choice",
        "prompt": "For a resistance reading, the circuit should be:",
        "choices": [
          "Powered from a 5 V source",
          "Powered from an AC source",
          "Off and safely discharged",
          "Connected across the meter's current jack"
        ],
        "correct": 2,
        "safety": true,
        "explain": "Ohmmeter mode injects its own test signal. External voltage can damage the meter or give false readings."
      },
      {
        "id": "p08",
        "type": "choice",
        "prompt": "How should the DMM connect to measure voltage across a resistor?",
        "choices": [
          "In parallel across the two resistor terminals",
          "In series in place of a wire",
          "In continuity mode with power on",
          "Only across the power switch"
        ],
        "correct": 0,
        "safety": true,
        "explain": "A voltmeter compares potentials at two nodes."
      },
      {
        "id": "p09",
        "type": "choice",
        "prompt": "What happens if you connect a meter set to current across a battery?",
        "choices": [
          "It measures battery voltage safely",
          "It risks a short and excessive current",
          "It measures resistance",
          "It automatically becomes a voltmeter"
        ],
        "correct": 1,
        "safety": true,
        "explain": "Current mode offers a very low-resistance path; never place it directly across the source."
      },
      {
        "id": "p10",
        "type": "reflection",
        "prompt": "Explain how you would verify that two breadboard holes are connected and why you disconnect power first.",
        "rubric": "Mention the breadboard's internal metal strips, a continuity or resistance test on an unpowered circuit, correct meter mode and that external power must not be applied in resistance/continuity mode.",
        "explain": "You should be able to trace a path and verify it safely rather than relying on visual proximity."
      }
    ]
  },
  {
    "id": "EIM-BEC-DC02",
    "module": "EIM · Basic Electric Circuits · DC 02",
    "subtrack": "basic",
    "title": "Three-Resistor Challenge — Series and Parallel",
    "minutes": 60,
    "experiment": "embedded",
    "description": "Predict, measure and troubleshoot the same three 1 kΩ resistors connected in series and in parallel.",
    "html": "<p>The official DC 02 experiment uses <strong>three nominal 1 kΩ resistors</strong>, a breadboard and a nominal <strong>5 V supply</strong>. It asks you to find equivalent resistance in more than one way: calculate from the component values, measure the unpowered network, and infer resistance from voltage and current. We'll keep that useful comparison and add circuit-prediction and fault activities.</p>\n <h3>1. Series is one path</h3><p>Imagine three resistors end to end. The same current has to pass through each. More resistance in the path means less current for the same voltage. Change a resistor and predict both the equivalent resistance and current.</p><div class=\"lab-widget\" data-lab-kind=\"series\"><p class=\"muted sm\">Loading interactive activity…</p></div>\n <h3>2. Voltage gets divided along that path</h3><p>With an ideal 5 V source and three equal series resistors, each resistor accounts for one third of the total voltage drop. But the drops change if the resistor values change—even though the current stays equal everywhere along the one path.</p><div class=\"lab-widget\" data-lab-kind=\"divider\"><p class=\"muted sm\">Loading interactive activity…</p></div>\n <h3>3. Parallel means separate paths between the same nodes</h3><p>With three identical 1 kΩ resistors in parallel, each one has the full 5 V across it. Each branch draws 5 mA, so the source supplies 15 mA in total. Add or remove a branch to see what changes.</p><div class=\"lab-widget\" data-lab-kind=\"parallel3\"><p class=\"muted sm\">Loading interactive activity…</p></div>\n <h3>4. An open branch does not automatically brighten the others</h3><p>A broken parallel branch stops drawing current. In an ideal regulated supply, the other branch voltages stay at 5 V; the source supplies less total current, not more current to each remaining resistor. The simulation lets you open one branch safely.</p><div class=\"lab-widget\" data-lab-kind=\"fault\"><p class=\"muted sm\">Loading interactive activity…</p></div>\n <h3>5. Three independent measurements help confirm a result</h3><p>Try comparing a calculated equivalent resistance, an ohmmeter result with <strong>power off</strong>, and a resistance inferred by dividing the total source voltage by the total current. You should obtain approximately the same number, with small differences due to actual parts and instruments.</p><div class=\"lab-widget\" data-lab-kind=\"meter\"><p class=\"muted sm\">Loading interactive activity…</p></div>\n <div class=\"callout\"><b>When you do the physical lab:</b> Measure the resistors individually first; disconnect power for every ohmmeter reading; use the voltmeter across two nodes and an appropriately fused/current-rated ammeter in series. Start with virtual circuit checks. The values displayed here are ideal examples and your actual readings will vary.</div>",
    "questions": [
      {
        "id": "s01",
        "type": "number",
        "prompt": "Three 1 kΩ resistors in series have how many ohms of equivalent resistance?",
        "answer": 3000,
        "tolerance": 1,
        "unit": "Ω",
        "explain": "For series resistors, add 1,000 + 1,000 + 1,000 = 3,000 Ω."
      },
      {
        "id": "s02",
        "type": "number",
        "prompt": "What is the total current in milliamps at 5 V across those 3 kΩ?",
        "answer": 1.6666666666666667,
        "tolerance": 0.02,
        "unit": "mA",
        "explain": "I = 5 V / 3,000 Ω = 0.001667 A = 1.667 mA."
      },
      {
        "id": "s03",
        "type": "number",
        "prompt": "What voltage appears across each identical resistor in that 5 V series circuit?",
        "answer": 1.6666666666666667,
        "tolerance": 0.02,
        "unit": "V",
        "explain": "Each resistor receives one third of the 5 V in the ideal equal-value case."
      },
      {
        "id": "s04",
        "type": "number",
        "prompt": "Three 1 kΩ resistors in parallel have what equivalent resistance (nearest ohm)?",
        "answer": 333.33,
        "tolerance": 0.75,
        "unit": "Ω",
        "explain": "1/Rt = 1/1000 + 1/1000 + 1/1000, giving about 333 Ω."
      },
      {
        "id": "s05",
        "type": "number",
        "prompt": "How many milliamps does the full 5 V parallel circuit draw?",
        "answer": 15,
        "tolerance": 0.05,
        "unit": "mA",
        "explain": "Three branches draw 5 mA each, for 15 mA total."
      },
      {
        "id": "s06",
        "type": "choice",
        "prompt": "If one of three identical parallel branches opens, what happens with an ideal regulated source?",
        "choices": [
          "Surviving branches each see 10 V",
          "The remaining branches keep 5 V, and total current drops",
          "Other branches automatically double current",
          "The source voltage becomes zero"
        ],
        "correct": 1,
        "explain": "Parallel branches see the same voltage. The open branch simply stops drawing its share of current."
      },
      {
        "id": "s07",
        "type": "number",
        "prompt": "With one of three 1 kΩ parallel branches open at 5 V, what is total current in mA?",
        "answer": 10,
        "tolerance": 0.05,
        "unit": "mA",
        "explain": "Two branches remain; each draws 5 mA, so total is 10 mA."
      },
      {
        "id": "s08",
        "type": "choice",
        "prompt": "Which method correctly measures the unpowered network resistance?",
        "choices": [
          "DMM in ohms mode across the isolated network with source off/disconnected",
          "DMM in amps mode straight across the source",
          "DMM in ohms mode with 5 V still connected",
          "DMM in voltage mode, placed in series"
        ],
        "correct": 0,
        "safety": true,
        "explain": "Resistance testing requires an unpowered and safely discharged network."
      },
      {
        "id": "s09",
        "type": "choice",
        "prompt": "To infer equivalent resistance from V/I, which readings belong in the calculation?",
        "choices": [
          "Total supply voltage divided by total supply current",
          "One branch voltage divided by an unrelated branch's current",
          "Any two numbers shown on the meter",
          "The circuit current divided by voltage"
        ],
        "correct": 0,
        "explain": "For total equivalent resistance, use the same network's total applied voltage and total source current."
      },
      {
        "id": "s10",
        "type": "reflection",
        "prompt": "Explain why opening a parallel branch reduces total current while the other resistors keep the same voltage.",
        "rubric": "Mention the same two connection nodes across each branch, regulated 5 V remaining unchanged, the opened branch's current becoming zero, and total current being the sum of the surviving branch currents. Avoid claiming extra current is automatically distributed among them.",
        "explain": "The branches share voltage, not a fixed total current budget."
      }
    ]
  }
];
