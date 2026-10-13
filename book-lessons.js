// Original educational companions based on Geier Chapter 6 pp. 97–99 (3rd edition); no scanned text reproduced.
export const bookLessons = [
  {
    "id": "BDMM-01",
    "module": "Geier · Chapter 6 · Digital Multimeter · pp. 97–98",
    "title": "Reading a Digital Multimeter — Beyond the Digits",
    "subtrack": "geier",
    "minutes": 40,
    "experiment": "embedded",
    "description": "Work out what a DMM reading tells you—and what resolution, accuracy, noise and fast changes can conceal.",
    "html": "<p>Imagine a regulated supply labeled 5 V. A meter shows 5.04 V. That does not prove anything is broken. Before making a diagnosis, separate the intended value, the actual circuit behavior and the limits of the instrument doing the measuring.</p>\n<h3>1. A single number can't show every kind of signal</h3><p>A DMM is useful for inspecting slowly varying or reasonably steady quantities. A very brief dropout can happen between display updates. Compare two signals in a virtual time trace, then decide if a screen reading would be enough.</p><div class=\"lab-widget\" data-lab-kind=\"dmm-signal\"><p class=\"muted sm\">Loading DMM visual challenge…</p></div>\n<h3>2. Expected voltage isn't the same as observed voltage</h3><p>A nominal voltage is a target; the acceptable range depends on the specifications and test conditions. Use the example 5 V ±5% specification to make a judgment. It is an example tolerance, <em>not</em> a universal rule for supplies.</p><div class=\"lab-widget\" data-lab-kind=\"dmm-tolerance\"><p class=\"muted sm\">Loading DMM visual challenge…</p></div>\n<h3>3. Resolution and accuracy answer different questions</h3><p>Resolution tells you the size of the display step. Accuracy concerns how close the reported value is to the actual quantity. A display with more decimal places can still be less accurate than one with fewer.</p><div class=\"lab-widget\" data-lab-kind=\"dmm-digits\"><p class=\"muted sm\">Loading DMM visual challenge…</p></div>\n<h3>4. Readings may move without proving a failure</h3><p>A changing last digit could reflect source variation, test-lead contact, noise or the meter settling. Watch the simulated measurement over time, rather than interpreting a single fluctuation as a diagnosis.</p><div class=\"lab-widget\" data-lab-kind=\"dmm-noise\"><p class=\"muted sm\">Loading DMM visual challenge…</p></div>\n<h3>5. Choosing a meter is choosing what evidence you need</h3><p>To check a stable battery, use a correctly rated DMM. To see pulse shape or short events, a properly used oscilloscope is usually more informative. A scope is <em>not</em> automatically safe to connect to any circuit: grounding, voltage ratings and isolation matter.</p><div class=\"lab-widget\" data-lab-kind=\"dmm-choice\"><p class=\"muted sm\">Loading DMM visual challenge…</p></div>\n<div class=\"callout\"><b>Book reference:</b> Geier, 3rd edition, Chapter 6, pp. 97–98. This is an original educational companion, not a reproduction of the book. All signal changes here are virtual; no live appliances or mains wiring are used.</div>",
    "questions": [
      {
        "id": "b101",
        "type": "choice",
        "prompt": "Which instrument is a good first choice for checking an approximately steady 3 V battery?",
        "choices": [
          "A correctly configured DMM",
          "A logic analyzer alone",
          "A continuity tester on the powered battery",
          "A meter set to its current jack across the terminals"
        ],
        "correct": 0,
        "explain": "A DMM in a suitable voltage mode provides a useful steady DC measurement."
      },
      {
        "id": "b102",
        "type": "choice",
        "prompt": "What instrument better reveals a voltage dropout lasting about 1 ms?",
        "choices": [
          "A basic slow-updating DMM display",
          "A suitable oscilloscope showing voltage versus time",
          "A passive resistor alone",
          "A continuity beep"
        ],
        "correct": 1,
        "explain": "The time-domain trace reveals a short dropout that a numeric meter can miss."
      },
      {
        "id": "b103",
        "type": "choice",
        "prompt": "A nominal 6 V supply measures 6.1 V. What should you conclude?",
        "choices": [
          "It is definitely defective",
          "It is definitely perfect",
          "Check its allowed tolerance and conditions before deciding",
          "The DMM must be broken"
        ],
        "correct": 2,
        "explain": "A nominal label by itself does not establish the allowable range."
      },
      {
        "id": "b104",
        "type": "choice",
        "prompt": "A meter reads 5.002 V instead of 5.00 V. Does that guarantee higher accuracy?",
        "choices": [
          "Yes, because it has more digits",
          "No, resolution does not by itself prove accuracy",
          "Yes, provided it has an LCD",
          "It means the voltage changed by 2 V"
        ],
        "correct": 1,
        "explain": "Finer display steps do not establish the meter's true error."
      },
      {
        "id": "b105",
        "type": "choice",
        "prompt": "A 5 V supply wobbles by ±0.02 V. What does that observation alone prove?",
        "choices": [
          "Every component is faulty",
          "The load has an open",
          "Nothing conclusive without specifications and context",
          "The source frequency is exactly 50 Hz"
        ],
        "correct": 2,
        "explain": "Small changes may be expected; check accuracy, noise, conditions and specification."
      },
      {
        "id": "b106",
        "type": "number",
        "prompt": "What is the lower limit, in volts, of an example 5 V ±5% acceptable range?",
        "answer": 4.75,
        "tolerance": 0.001,
        "unit": "V",
        "explain": "5 × (1 − 0.05) = 4.75 V."
      },
      {
        "id": "b107",
        "type": "number",
        "prompt": "What is the upper limit, in volts, of the same 5 V ±5% example?",
        "answer": 5.25,
        "tolerance": 0.001,
        "unit": "V",
        "explain": "5 × (1 + 0.05) = 5.25 V."
      },
      {
        "id": "b108",
        "type": "choice",
        "prompt": "A DC display suddenly alternates between 0 and 5 V. What's a useful next action?",
        "choices": [
          "Assume one specific failed component",
          "Investigate the connection or changing signal behavior",
          "Switch to ohms mode with power applied",
          "Short the supply to test the fuse"
        ],
        "correct": 1,
        "safety": true,
        "explain": "This requires investigation with safe, appropriate measurements; never switch to resistance on a powered circuit."
      },
      {
        "id": "b109",
        "type": "reflection",
        "prompt": "Why might a healthy circuit give slightly different readings each time you check it?",
        "rubric": "Mention at least two plausible factors: noise, supply variation, contact, settling, resolution, or measurement accuracy. Explain why a slight change alone is not proof of failure.",
        "explain": "A varying number is evidence to interpret, not an automatic fault diagnosis."
      },
      {
        "id": "b110",
        "type": "reflection",
        "prompt": "When would you choose an oscilloscope instead of a DMM, and what safety limitation should you check?",
        "rubric": "Identify rapidly changing waveforms/pulses, contrast with relatively steady DMM readings, and mention scope voltage, ground/reference or isolation ratings before a real connection.",
        "explain": "An oscilloscope helps with waveform timing but must be connected with appropriate grounding and ratings."
      }
    ]
  },
  {
    "id": "BDMM-02",
    "module": "Geier · Chapter 6 · Digital Multimeter · pp. 98–99",
    "title": "DC Voltage — Compare Two Points",
    "subtrack": "geier",
    "minutes": 45,
    "experiment": "embedded",
    "description": "Position simulated probes, choose a verified reference node and interpret positive, negative and suspicious DC voltage readings.",
    "html": "<p>Voltage always describes a difference between two points. The meter doesn't know what you intend to call “ground”—it reports the potential at the red probe relative to the black probe.</p>\n<h3>1. Every voltage measurement needs two probes</h3><p>Place a virtual red and black probe on a low-voltage circuit. If the red probe is at +5 V relative to common and black is at 0 V, the meter reads +5 V. Reverse them, and it reads −5 V. The physical circuit hasn't changed.</p><div class=\"lab-widget\" data-lab-kind=\"dmm-probes\"><p class=\"muted sm\">Loading DMM visual challenge…</p></div>\n<h3>2. Choose a reference rather than guessing one</h3><p>A marked circuit-common node is a possible voltage reference when verified by a schematic or measurement plan. A heat sink, chassis or speaker terminal is <em>not</em> automatically common. Experiment with verified and unverified locations.</p><div class=\"lab-widget\" data-lab-kind=\"dmm-reference\"><p class=\"muted sm\">Loading DMM visual challenge…</p></div>\n<h3>3. A measurement sequence is a fault-location strategy</h3><p>In an illustrative 5 V source–switch–resistor circuit, compare the source node and the load node. When the switch is open, the downstream load node in this modeled circuit falls to common through its resistor. Notice how two readings narrow the fault without breaking a wire.</p><div class=\"lab-widget\" data-lab-kind=\"dmm-fault\"><p class=\"muted sm\">Loading DMM visual challenge…</p></div>\n<h3>4. Match the voltage function and range to the question</h3><p>A DC source should be checked with a properly rated DC voltage function. If using a manual-ranging DMM on a known-safe training circuit, begin at a suitably high voltage range, then refine it; a low range may simply report overrange.</p><div class=\"lab-widget\" data-lab-kind=\"dmm-range\"><p class=\"muted sm\">Loading DMM visual challenge…</p></div>\n<h3>5. When the display can't explain the timing</h3><p>A steady rail and a rail with short simulated dropouts might show similar numbers on a slowly updating DMM. See what the time trace shows, and consider what observation would test a proposed intermittent fault.</p><div class=\"lab-widget\" data-lab-kind=\"dmm-dropout\"><p class=\"muted sm\">Loading DMM visual challenge…</p></div>\n<div class=\"callout\"><b>Book reference:</b> Geier, 3rd edition, Chapter 6, pp. 98–99. Probe training here is entirely simulated. Real circuit-common nodes, return wiring, meter jack ratings and electrical hazards must be verified from the device and schematic.</div>",
    "questions": [
      {
        "id": "b201",
        "type": "choice",
        "prompt": "To measure the voltage across a resistor, where do the two probes go?",
        "choices": [
          "Across its two terminals",
          "Both in the current jack",
          "In series, replacing one wire",
          "Across an unknown energized mains outlet"
        ],
        "correct": 0,
        "safety": true,
        "explain": "Voltage is a potential difference between two nodes; position the probes across the resistor."
      },
      {
        "id": "b202",
        "type": "number",
        "prompt": "Red at +5 V relative to common, black at 0 V: what does the meter display in volts?",
        "answer": 5,
        "tolerance": 0.001,
        "unit": "V",
        "explain": "V(red) − V(black) = +5 − 0 = +5 V."
      },
      {
        "id": "b203",
        "type": "number",
        "prompt": "Red at common (0 V), black at +5 V: what does the meter display in volts?",
        "answer": -5,
        "tolerance": 0.001,
        "unit": "V",
        "explain": "Reversing the test leads reverses the sign: 0 − 5 = −5 V."
      },
      {
        "id": "b204",
        "type": "choice",
        "prompt": "Is a metal heat sink always at circuit common?",
        "choices": [
          "Yes, because it is metal",
          "No; its potential and connection must be verified",
          "Yes, when an LED is nearby",
          "Only when a DMM is in ohms mode"
        ],
        "correct": 1,
        "explain": "Metal parts can be isolated, live or tied to a different potential; never assume."
      },
      {
        "id": "b205",
        "type": "choice",
        "prompt": "Can you assume a speaker's negative terminal is chassis/common?",
        "choices": [
          "Always",
          "No; audio outputs can be bridged or otherwise arranged",
          "Only on the right channel",
          "Yes, if the cabinet is black"
        ],
        "correct": 1,
        "explain": "Audio return wiring is device-specific; the terminal is not guaranteed common."
      },
      {
        "id": "b206",
        "type": "choice",
        "prompt": "For an unknown but known-safe low DC voltage on a manual-ranging DMM, which general approach is sensible?",
        "choices": [
          "Start on the lowest current range",
          "Start with a suitably high DC voltage range and refine downward",
          "Use continuity on the powered circuit",
          "Place current leads across the battery"
        ],
        "correct": 1,
        "safety": true,
        "explain": "Choose DC voltage, correct input jacks and an adequately high range before decreasing it."
      },
      {
        "id": "b207",
        "type": "choice",
        "prompt": "What function measures an approximately steady DC rail?",
        "choices": [
          "Resistance across the live rail",
          "Correctly rated DC volts",
          "Diode test with supply powered",
          "Unfused current input across the source"
        ],
        "correct": 1,
        "safety": true,
        "explain": "Use the appropriate DC voltage function and input ratings."
      },
      {
        "id": "b208",
        "type": "choice",
        "prompt": "A nominal 5 V rail shows modest variation. What is the next sound diagnostic step?",
        "choices": [
          "Declare the regulator failed",
          "Check rail specification, meter limitations and measurement conditions",
          "Replace every capacitor",
          "Short the rail briefly"
        ],
        "correct": 1,
        "explain": "A small variation must be interpreted against specification and context."
      },
      {
        "id": "b209",
        "type": "reflection",
        "prompt": "Explain how you'd choose the black-probe reference before measuring a DC voltage on a circuit board.",
        "rubric": "Mention that voltage compares two nodes; identify common from a verified schematic/ground reference rather than appearance; never assume chassis, heat sink or speaker negative is safe common.",
        "explain": "Correct reference selection depends on verified circuit information, not the color or material of a part."
      },
      {
        "id": "b210",
        "type": "reflection",
        "prompt": "A modeled circuit shows +5 V at the source and 0 V after a switch feeding a resistor to common. How would you investigate?",
        "rubric": "Describe checking the 5 V source, comparing upstream/downstream node potentials against verified common, suspecting an open switch/wire/path in this modeled circuit, and turning power off before continuity checks or rewiring.",
        "explain": "The voltage pattern suggests an interrupted path in this model, which you can test safely after de-energizing."
      }
    ]
  }
];
