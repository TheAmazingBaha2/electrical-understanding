// Original CETa preparatory exercises aligned only to the user-supplied study-guide Chapter 3 table-of-contents topic; chapter prose not reviewed.
export const cetaLessons = [
  {
    "id": "CETA-G03-01",
    "subtrack": "guide",
    "module": "Associate CET Study Guide · Unit 2 · Chapter 3 · printed p. 16",
    "title": "Engineering Prefixes — Think in Powers of Ten",
    "minutes": 40,
    "experiment": "embedded",
    "description": "Master the prefixes and place values that keep electronic measurements and calculations trustworthy.",
    "html": "<p>In electronics, a value's prefix can matter as much as the number. A meter reading of 5 mA is not 5 A; the difference is a factor of one thousand. Your Associate CET Study Guide table of contents lists “Basic Math used in Electronic Service & Decibels” (Chapter 3, p. 16), including powers of ten. This is an independently written foundational companion about that topic; it is not a summary of unseen chapter pages.</p>\n<h3>1. Why prefixes exist</h3><p>Component values span huge ranges. Rather than write 4,700 Ω every time, we often write 4.7 kΩ. The prefix “kilo” means multiply by 1,000. “milli” means divide by 1,000. “micro” means divide by 1,000,000. Prefixes scale the unit; they do not create a new physical quantity.</p><p>Make one prefix change in the visual scale ladder, then explain the resulting factor.</p><div class=\"lab-widget\" data-lab-kind=\"ceta-ladder\"><p class=\"muted sm\">Loading metric ladder…</p></div>\n<h3>2. Read powers of ten as place-value shifts</h3><p>10³ means 1,000, while 10⁻³ means 0.001. A positive exponent multiplies; a negative exponent divides. Scientific notation keeps numbers manageable: 0.0047 A = 4.7 × 10⁻³ A.</p><p>Move an exponent slider and inspect where its decimal point belongs.</p><div class=\"lab-widget\" data-lab-kind=\"ceta-powers\"><p class=\"muted sm\">Loading exponent explorer…</p></div>\n<h3>3. Translate between scientific notation and a display</h3><p>A quantity such as 2.2 × 10³ Ω equals 2,200 Ω, which is also 2.2 kΩ. All three expressions describe the same resistance. Be alert to unit symbols: m (milli), k (kilo), M (mega) and µ (micro) are not interchangeable.</p><p>Set the coefficient and exponent to see equivalent forms.</p><div class=\"lab-widget\" data-lab-kind=\"ceta-notation\"><p class=\"muted sm\">Loading scientific notation trainer…</p></div>\n<h3>4. Convert first, calculate second</h3><p>Most basic circuit equations work cleanly with base SI units: volts (V), amperes (A), ohms (Ω), watts (W) and seconds (s). For example, 2.5 mA is 0.0025 A. You can instead keep the prefix consistent when using convenient shortcuts, but never mix scale factors unnoticed.</p><p>Choose an electronics value and convert it into its base unit.</p><div class=\"lab-widget\" data-lab-kind=\"ceta-convert\"><p class=\"muted sm\">Loading unit conversion desk…</p></div>\n<h3>5. The unit error that breaks a circuit calculation</h3><p>A 5 V source across a 1 kΩ resistor gives I = 5 V / 1,000 Ω = 0.005 A = 5 mA. Reporting 5 A would overstate the actual current by a thousandfold. Changing a unit's prefix during a calculation is not harmless formatting; it changes the interpretation of the result.</p><p>Adjust the ideal, low-voltage example and compare milliamperes with amperes. This is a theoretical calculation, not permission to wire a source without verifying part and supply ratings.</p><div class=\"lab-widget\" data-lab-kind=\"ceta-sanity\"><p class=\"muted sm\">Loading current sanity checker…</p></div>\n<div class=\"callout\"><b>Source boundary:</b> Associate CET Study Guide contents, Unit 2, Chapter 3 starts on printed p. 16 and lists Basic Math, powers of ten and Ohm's Law among its topics. We have not examined the chapter's teaching pages, worked examples, or end-of-chapter questions. These explanations and exercises are original and should not be mistaken for the author's treatment.</div>",
    "questions": [
      {
        "id": "c30101",
        "type": "number",
        "prompt": "How many ohms are in 1 kΩ?",
        "answer": 1000,
        "tolerance": 0.01,
        "unit": "Ω",
        "explain": "Kilo is 10³, so 1 kΩ = 1,000 Ω."
      },
      {
        "id": "c30102",
        "type": "number",
        "prompt": "Convert 4.7 kΩ to ohms.",
        "answer": 4700,
        "tolerance": 0.01,
        "unit": "Ω",
        "explain": "Multiply 4.7 by 1,000 to obtain 4,700 Ω."
      },
      {
        "id": "c30103",
        "type": "number",
        "prompt": "Convert 0.002 A to milliamperes.",
        "answer": 2,
        "tolerance": 0.0001,
        "unit": "mA",
        "explain": "Multiply amperes by 1,000: 0.002 A = 2 mA."
      },
      {
        "id": "c30104",
        "type": "number",
        "prompt": "Convert 4,700 Ω to kilo-ohms.",
        "answer": 4.7,
        "tolerance": 0.0001,
        "unit": "kΩ",
        "explain": "Divide ohms by 1,000: 4,700 Ω = 4.7 kΩ."
      },
      {
        "id": "c30105",
        "type": "number",
        "prompt": "Convert 330 µF to farads.",
        "answer": 0.00033,
        "tolerance": 1e-8,
        "unit": "F",
        "explain": "Micro means 10⁻⁶, so 330 µF = 330 × 10⁻⁶ F = 0.00033 F."
      },
      {
        "id": "c30106",
        "type": "choice",
        "prompt": "What multiplier does the prefix micro (µ) represent?",
        "choices": [
          "10³",
          "10⁻³",
          "10⁻⁶",
          "10⁶"
        ],
        "correct": 2,
        "explain": "Micro represents one millionth, or 10⁻⁶."
      },
      {
        "id": "c30107",
        "type": "choice",
        "prompt": "Which expression equals 2.2 × 10³ Ω?",
        "choices": [
          "2.2 mΩ",
          "2.2 kΩ",
          "2.2 MΩ",
          "220 µΩ"
        ],
        "correct": 1,
        "explain": "10³ is kilo, so 2.2 × 10³ Ω = 2.2 kΩ."
      },
      {
        "id": "c30108",
        "type": "number",
        "prompt": "Convert 1 MHz to hertz.",
        "answer": 1000000,
        "tolerance": 0.01,
        "unit": "Hz",
        "explain": "Mega represents one million: 1 MHz = 1,000,000 Hz."
      },
      {
        "id": "c30109",
        "type": "choice",
        "prompt": "You predict 5 mA in a low-voltage virtual resistor circuit, but your worksheet says 5 A. What should you do before using that result to choose real components?",
        "choices": [
          "Ignore the unit mismatch; the number 5 is the same",
          "Recheck the unit conversion and recalculate using correct units and ratings",
          "Use the largest available physical power supply to find out",
          "Bridge the source with a current-meter input"
        ],
        "correct": 1,
        "safety": true,
        "explain": "5 A is 1,000 times 5 mA. Check units, calculations and actual ratings before any physical circuit work."
      },
      {
        "id": "c30110",
        "type": "reflection",
        "prompt": "Explain why writing 0.005 A as 5 mA is correct, but writing it as 5 A is a serious mistake.",
        "rubric": "Explicitly state that milli is 10⁻³, so 5 mA equals 0.005 A; 5 A is one thousand times larger. Explain how a wrong prefix distorts calculations or component selection.",
        "explain": "Units carry scale factors; correct engineering notation is part of correct circuit reasoning."
      }
    ]
  }
];
