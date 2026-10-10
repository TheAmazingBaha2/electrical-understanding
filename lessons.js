// Original lessons, intentionally not copied from any textbook.
// Questions: choice, number, or reflection (requires learner comparison to a rubric).
export const books = [
  {title:'Teach Yourself Electricity and Electronics — Seventh Edition',role:'Primary conceptual reference: units, DC/AC, components and signals.',note:'Use the corresponding topic in the table of contents; page numbers depend on your copy.'},
  {title:'Electronics: Principles and Applications (with MultiSim CD)',role:'Applied circuit examples, measuring, diodes, transistors, op-amps and power supplies.',note:'Edition appears to be the 7th from the listing; confirm it when the book arrives.'},
  {title:'How to Diagnose and Fix Everything Electronic — Third Edition',role:'Repair methods, test equipment, fault isolation and practical safety.',note:'Pair theory lessons with the book’s real-world troubleshooting examples.'},
  {title:'Cabling: The Complete Guide to Copper and Fiber-Optic Networking',role:'Cabling, connectors, transmission and communications practice.',note:'Edition not yet confirmed. We will check the standards against current references.'}
];

export const lessons = [
  {
    id:'L01', module:'01 · Electrical foundations', title:'Voltage, current, power and energy', minutes:35, experiment:'power',
    description:'Make sense of volts, amperes, watts, coulombs and joules without mixing up their units.',
    references:['Teach Yourself Electricity and Electronics — topics on electrical units and electric current'],
    html:`
      <p>We use the terms <strong>voltage</strong>, <strong>current</strong> and <strong>power</strong> so often that it is easy to confuse what each one measures. They describe different properties of one electrical process.</p>
      <h3>Current: charge moving through a point</h3>
      <p>Electric charge is measured in <strong>coulombs (C)</strong>. Current tells us how much charge passes a location in a circuit per second. If two coulombs pass a point every second, the current is two amperes.</p>
      <span class="formula">1 ampere = 1 coulomb / second</span>
      <p>A useful distinction: current measures <em>flow rate</em> of charge, not how much energy that charge carries.</p>
      <h3>Voltage: energy transferred per unit of charge</h3>
      <p>A voltage difference between two points describes how much energy can be transferred <em>per coulomb</em> of charge moving between those points. A 12-volt source provides 12 joules of energy for each coulomb of charge that passes through it (under its rated operating conditions).</p>
      <span class="formula">1 volt = 1 joule / coulomb</span>
      <div class="callout"><b>Connect them:</b> If 2 coulombs pass through a load each second, and each coulomb transfers 12 joules, then that load receives 24 joules per second.</div>
      <h3>Power and energy are not interchangeable</h3>
      <p><strong>Power</strong> is the rate of energy transfer. One watt means one joule per second. <strong>Energy</strong> is the accumulated amount transferred over time, measured in joules.</p>
      <span class="formula">P = V × I &nbsp; · &nbsp; E = P × t</span>
      <p>For example, a 3-watt device operating for ten seconds transfers 30 joules of energy. A 3-watt device operating for one hour uses much more energy even though its instantaneous power remains 3 watts.</p>
      <h3>What to watch for</h3><ul><li>Voltage is not joules per second.</li><li>Watts are not coulombs per joule.</li><li>Amps describe charge flow, even when different sources deliver different voltages.</li></ul>
    `,
    questions:[
      {id:'u1',type:'choice',prompt:'Which expression describes one volt?',choices:['One joule per second','One joule per coulomb','One coulomb per second','One coulomb per joule'],correct:1,explain:'Voltage is energy transferred per unit charge: J/C.'},
      {id:'u2',type:'choice',prompt:'One ampere tells you…',choices:['One watt for every volt','One coulomb passing a point per second','One joule passing a point per coulomb','One ohm per second'],correct:1,explain:'Current is the rate of electric charge flow, in coulombs per second.'},
      {id:'u3',type:'number',prompt:'A 12 V load draws 0.25 A. Find the power in watts.',answer:3,tolerance:0.001,unit:'W',explain:'Power = 12 × 0.25 = 3 W.'},
      {id:'u4',type:'number',prompt:'A component dissipates 8 W for 30 seconds. How many joules are transferred?',answer:240,tolerance:0.01,unit:'J',explain:'Energy = 8 W × 30 s = 240 J.'},
      {id:'u5',type:'reflection',prompt:'In your own words, distinguish the role of voltage from the role of current in a circuit.',rubric:'A strong answer says voltage is energy transferred per charge (J/C), while current is rate of charge flow (C/s). They describe different properties; neither is automatically a measure of power.',explain:'Power depends on voltage and current together.'},
      {id:'u6',type:'choice',prompt:'If an unchanged load draws 2 A from a 6 V supply, what is its power?',choices:['3 W','8 W','12 W','24 W'],correct:2,explain:'P = V × I = 6 × 2 = 12 W.'}
    ]
  },
  {
    id:'L02', module:'01 · Electrical foundations', title:'Meter connections and electrical safety', minutes:40, experiment:'meters',
    description:'Practice voltage, current and resistance measurements without creating shorts or unsafe conditions.',
    references:['How to Diagnose and Fix Everything Electronic — measurement and test-equipment topics','Electronics: Principles and Applications — electrical measurements'],
    html:`
      <p>A multimeter does not measure everything using the same connection. The connection is part of the measurement itself, and mistakes can damage the meter or the circuit.</p>
      <h3>Voltage: compare two locations</h3>
      <p>Voltage is always a difference <em>between two points</em>. To measure across a resistor, connect a voltmeter <strong>in parallel</strong> with that resistor. Its high input resistance limits how much current it draws from the measured circuit.</p>
      <h3>Current: pass through the meter</h3>
      <p>To measure current with a conventional multimeter, <strong>disconnect power, open the circuit at the intended measurement point, connect the meter in series using the correct fused current input, and then reapply power</strong> if safe. Current-mode inputs have very low resistance and must never be placed directly across a power supply.</p>
      <div class="callout"><b>Critical safety principle:</b> An ammeter directly across a source may act like a short circuit. Never use your multimeter as if it were a voltmeter when its lead is connected to the current jack.</div>
      <h3>Resistance: isolate the component</h3>
      <p>Resistance mode injects a small test signal. Power must be off, and stored energy safely discharged. Other connections across the component can create alternate current paths, making an in-circuit resistance reading misleading.</p>
      <h3>Before any physical test</h3><ul><li>Identify the expected voltage range and whether the circuit is AC or DC.</li><li>Inspect meter leads, fuses, input jacks and measurement category/rating.</li><li>Disconnect power before changing current-measurement connections.</li><li>Do not probe live mains with improvised setups. Low-voltage, current-limited circuits are our practice environment.</li></ul>
    `,
    questions:[
      {id:'m1',type:'choice',prompt:'A voltmeter measuring the drop across a resistor should be connected…',choices:['In series','In parallel','In place of the battery','Only to chassis ground'],correct:1,explain:'A voltmeter reads the potential difference between the ends of the resistor.'},
      {id:'m2',type:'choice',prompt:'To measure current with a conventional multimeter, first…',choices:['Put the current leads across the battery','Set the probes at random nodes','De-energize the circuit and insert the meter in series','Leave the circuit unchanged and touch one probe to ground'],correct:2,explain:'Open the circuit safely and insert the current-mode meter in series.'},
      {id:'m3',type:'choice',safety:true,prompt:'Which action can create a serious short circuit?',choices:['A correctly rated voltmeter across a low-voltage load','An ammeter connected directly across the power supply','An unpowered resistor measured in isolation','An oscilloscope reading a known-safe isolated signal'],correct:1,explain:'Current mode offers a low-resistance path; direct connection across a source is hazardous.'},
      {id:'m4',type:'choice',prompt:'Before using the ohmmeter function on a circuit-board resistor you should…',choices:['Increase the supply voltage','Ensure power is removed and stored energy safely discharged','Put the meter in current mode','Make the circuit warmer'],correct:1,explain:'Resistance measurements are made on de-energized equipment.'},
      {id:'m5',type:'reflection',prompt:'Describe a safe setup to measure the current through a resistor on a low-voltage breadboard.',rubric:'Mention disconnecting power; identifying the correct current jack, meter setting, and fuse/range; opening the resistor’s branch; connecting the meter in series; checking wiring; then restoring power only if safe. Never bridge the supply terminals with a current-mode meter.',explain:'The wiring sequence is more important than memorizing meter symbols.'},
      {id:'m6',type:'choice',prompt:'Why can an in-circuit resistance measurement be too low?',choices:['A voltmeter creates a magnetic field','Parallel paths can conduct the ohmmeter’s test current','Resistors always halve their value when cooled','The circuit uses DC instead of AC'],correct:1,explain:'Parallel branches can make the equivalent resistance lower than the resistor itself.'}
    ]
  },
  {
    id:'L03', module:'02 · DC circuits', title:'Ohm’s law and predicting current', minutes:35, experiment:'ohm',
    description:'Predict how voltage and resistance alter current, with units that actually make sense.',
    references:['Teach Yourself Electricity and Electronics — Ohm’s law and DC circuits','Electronics: Principles and Applications — resistive circuits'],
    html:`
      <p>Ohm’s law describes the relationship among voltage, current and resistance for an ohmic component. The challenge is rarely memorizing the equation: it is deciding <em>which voltage and which resistance</em> belong in the calculation.</p>
      <span class="formula">I = V / R</span>
      <p>Current equals the voltage across a resistance divided by that resistance. Increasing voltage with the same resistance increases current; increasing resistance with the same voltage decreases current.</p>
      <h3>Keep the units consistent</h3>
      <p>One kilohm means 1,000 ohms. For a 24-volt source and a 6 kΩ resistor, first convert 6 kΩ to 6,000 Ω. Then the current is 24 / 6,000 = 0.004 A = 4 mA.</p>
      <h3>Check your answer before trusting it</h3>
      <p>More resistance means less current, everything else held fixed. A 6,000-ohm resistor should not draw hundreds of amperes from a small 24 V supply. Estimating the direction of change catches many arithmetic mistakes.</p>
      <div class="callout">Real-world component values and behaviors may depend on temperature, voltage and frequency. Ohm’s law is a model that works especially well with ideal resistors.</div>
    `,
    questions:[
      {id:'o1',type:'number',prompt:'A 24 V source is across a 6 kΩ resistor. Find the current in milliamperes.',answer:4,tolerance:.01,unit:'mA',explain:'6 kΩ = 6,000 Ω; I = 24/6000 = 0.004 A = 4 mA.'},
      {id:'o2',type:'choice',prompt:'With voltage unchanged, doubling resistance makes current…',choices:['Double','Half as large','Four times as large','Unchanged'],correct:1,explain:'Current and resistance are inversely proportional for a fixed voltage.'},
      {id:'o3',type:'number',prompt:'An ideal resistor carries 3 mA when 9 V is across it. Its resistance in kilohms is…',answer:3,tolerance:.01,unit:'kΩ',explain:'R=V/I = 9/0.003 = 3000 Ω = 3 kΩ.'},
      {id:'o4',type:'choice',prompt:'Which pairing is correct for the equation I = V/R?',choices:['Total supply voltage and any arbitrarily chosen resistor','Voltage across the selected component and its resistance','Voltage measured to earth and the cable length','A watt reading and a capacitance'],correct:1,explain:'Use the voltage across the same component or equivalent network as the resistance.'},
      {id:'o5',type:'reflection',prompt:'A series resistor is replaced with one twice as large. Describe the effect on current if the source and everything else stays the same.',rubric:'The circuit’s total resistance increases, so current falls. In a simple one-resistor circuit it becomes half; with other series resistors, it falls but not necessarily by half.',explain:'Be precise about what is held constant and whether there are other elements.'},
      {id:'o6',type:'number',prompt:'What voltage is across a 2 kΩ resistor that carries 5 mA? Enter volts.',answer:10,tolerance:.01,unit:'V',explain:'V = I×R = 0.005×2000 = 10 V.'}
    ]
  },
  {
    id:'L04', module:'02 · DC circuits', title:'Series, parallel and fault behavior', minutes:45, experiment:'parallel',
    description:'Find the current path and predict what changes when one branch opens or shorts.',
    references:['Teach Yourself Electricity and Electronics — series and parallel circuits','How to Diagnose and Fix Everything Electronic — tracing opens and shorts'],
    html:`
      <p>In a <strong>series</strong> circuit, elements share one current path. Each resistor contributes to total resistance and divides the voltage. In a <strong>parallel</strong> circuit, branches share the same pair of nodes and therefore the same voltage.</p>
      <span class="formula">Series: Rtotal = R1 + R2 + …</span>
      <p>With a 12 V source and series resistors of 2 kΩ and 4 kΩ, the total resistance is 6 kΩ and the same 2 mA passes through both. The 4 kΩ resistor drops 8 V, not 4 V. The bigger resistance gets a larger voltage drop because the series current is equal.</p>
      <span class="formula">Parallel: 1/Rtotal = 1/R1 + 1/R2 + …</span>
      <p>Each parallel branch has the full supply voltage. A 6 Ω branch across 12 V takes 2 A; a 3 Ω branch takes 4 A. Source current is 6 A. Total resistance is 2 Ω.</p>
      <h3>What happens when something opens?</h3>
      <p>For an ideal 12 V voltage source powering identical parallel bulbs, one failed-open bulb removes its own current path. The other bulbs retain their 12 V and their brightness. <strong>Total source current decreases</strong> because one branch no longer carries current.</p>
      <h3>What happens when something shorts?</h3>
      <p>A very low-resistance unintended path can draw dangerously high current, limited by the source, conductors and any protection. In practical troubleshooting, distinguish an open (missing path) from a short (unwanted low-resistance path).</p>
      <div class="callout">Kirchhoff’s Current Law: Current entering a node equals current leaving it. This follows from conservation of electric charge.</div>
    `,
    questions:[
      {id:'p1',type:'number',prompt:'Two resistors, 2 kΩ and 4 kΩ, are in series. Enter total resistance in kΩ.',answer:6,tolerance:.01,unit:'kΩ',explain:'Add series resistances: 2 + 4 = 6 kΩ.'},
      {id:'p2',type:'number',prompt:'Those resistors are connected to 12 V. Enter their shared series current in mA.',answer:2,tolerance:.01,unit:'mA',explain:'I = 12/6000 = .002 A = 2 mA through both.'},
      {id:'p3',type:'number',prompt:'What voltage drops across the 4 kΩ resistor in that circuit?',answer:8,tolerance:.01,unit:'V',explain:'V = .002 A × 4000 Ω = 8 V.'},
      {id:'p4',type:'choice',prompt:'Three identical parallel bulbs are powered by an ideal 12 V source. One fails open. What happens?',choices:['Remaining bulbs brighten; total current rises','Remaining bulbs stay at the same brightness; total source current falls','All bulbs go dark','Remaining bulbs dim; total current rises'],correct:1,explain:'Each surviving branch still has 12 V; the failed branch stops drawing current.'},
      {id:'p5',type:'number',prompt:'6 Ω and 3 Ω are placed in parallel. What is equivalent resistance in ohms?',answer:2,tolerance:.01,unit:'Ω',explain:'1/R = 1/6+1/3=1/2, so R = 2 Ω.'},
      {id:'p6',type:'reflection',prompt:'A branch is open. Explain how you would distinguish that from a short in a safe, low-voltage circuit.',rubric:'An open interrupts a current path (typically zero current in that branch). A short creates unintended very low resistance and can raise current. You should use safely de-energized checks and suitable voltage/current measurements, never direct current-mode meter bridging.',explain:'This is the reasoning behind real fault isolation.'}
    ]
  },
  {
    id:'L05', module:'03 · AC and reactive components', title:'AC frequency, capacitors and RC filters', minutes:45, experiment:'rc',
    description:'Use period and capacitive reactance to reason about filters and audio signals.',
    references:['Teach Yourself Electricity and Electronics — AC waveforms, capacitance and filters','Electronics: Principles and Applications — RC circuits'],
    html:`
      <p>AC signals repeat over time. <strong>Frequency</strong> measures cycles per second, while <strong>period</strong> measures seconds per cycle. They are reciprocals.</p>
      <span class="formula">T = 1/f &nbsp; · &nbsp; f = 1/T</span>
      <p>A 50 Hz signal has 50 cycles every second. Each cycle lasts 1/50 s, or 20 milliseconds. For a sine wave, RMS voltage is peak voltage divided by √2: a 14.14 V peak sine wave is approximately 10 V RMS.</p>
      <h3>Capacitors respond to changing voltages</h3>
      <p>A capacitor stores energy in an electric field. In steady-state ideal DC it blocks continuous current; with varying signals, current can flow into and out of its terminals as it charges and discharges. Its capacitive reactance decreases with frequency.</p>
      <span class="formula">Xc = 1 / (2π f C)</span>
      <h3>The low-pass filter</h3>
      <p>In an RC low-pass arrangement, a resistor comes before the output node and a capacitor connects that output node to the return path. At higher frequencies the capacitor offers less reactance, so a greater proportion of the signal is shunted toward the return rather than appearing at the output.</p>
      <span class="formula">Cutoff frequency: fc = 1 / (2π R C)</span>
      <p>Increasing capacitance <strong>lowers</strong> the cutoff frequency, so more high-frequency content is attenuated. This is how a simple analog tone-control or anti-aliasing stage begins to shape an audio signal.</p>
      <div class="callout">This lesson uses a simple ideal RC model. Real capacitors have tolerance, losses and frequency-dependent behavior.</div>
    `,
    questions:[
      {id:'a1',type:'number',prompt:'A repeating waveform has a 2 ms period. Enter its frequency in hertz.',answer:500,tolerance:.1,unit:'Hz',explain:'0.002 seconds per cycle; f=1/0.002=500 Hz.'},
      {id:'a2',type:'number',prompt:'A 14.14 V peak sine wave has approximately what RMS voltage?',answer:10,tolerance:.07,unit:'V RMS',explain:'14.14/√2 ≈ 10 V.'},
      {id:'a3',type:'choice',prompt:'For an ideal capacitor, increasing AC frequency makes its reactance…',choices:['Increase','Decrease','Stay unchanged','Become zero at any frequency'],correct:1,explain:'Xc = 1/(2πfC), which decreases as frequency increases.'},
      {id:'a4',type:'choice',prompt:'In an RC low-pass filter, increasing capacitor size makes cutoff frequency…',choices:['Higher','Lower','Identical','Unpredictably alternate'],correct:1,explain:'fc=1/(2πRC). Higher C means lower cutoff.'},
      {id:'a5',type:'reflection',prompt:'Explain why high-frequency audio is reduced at the output of the RC filter while low-frequency audio passes more easily.',rubric:'Higher frequency means lower capacitive reactance, creating an easier shunt path to the return after the resistor. Therefore the output node has less high-frequency voltage. At low frequency the capacitor shunts less, so more appears at output.',explain:'This connects capacitive reactance to signal attenuation.'},
      {id:'a6',type:'number',prompt:'A 100 Hz signal completes one cycle in how many milliseconds?',answer:10,tolerance:.01,unit:'ms',explain:'1/100 second = .01 s = 10 ms.'}
    ]
  }
];
