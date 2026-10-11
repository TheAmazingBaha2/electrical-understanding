// Lesson-specific orientation: concrete scenarios rather than repeating tab names.
// Legacy L01–L05 use their existing learning topics; EIM companion numbers derive from scanned PreLab and DC 02.
const intro = {
 "CETA-G03-01":{
   eyebrow:"ASSOCIATE CET GUIDE / UNIT 2 / CHAPTER 3 / P. 16",
   hint:"Can a unit error change your answer by 1,000 times?",
   mission:"A simulated 5 V supply drives a 1 kΩ resistor. Your worksheet says the current is 5 A. Where did the calculation go wrong?",
   reveal:"Ohm’s law gives 5 V ÷ 1,000 Ω = 0.005 A, which equals 5 mA. Forgetting the milli prefix inflates the result by a factor of one thousand.",
   anchors:[["1 kΩ = 1,000 Ω","Kilo is 10³, or one thousand"],["1 mA = 0.001 A","Milli is 10⁻³, or one thousandth"],["Check the scale","A unit mistake can invalidate a component calculation"]],
   missionType:"units",
   outcome:"Convert among scientific notation, SI prefixes, base units and everyday electronic measurements without losing the scale factor.",
   caution:"All examples are simulated. Check power, voltage and current limits before any real-world hookup; a correct unit conversion is not a safety rating."
 },
 "BDMM-01":{
  eyebrow:"GEIER / CHAPTER 6 / PP. 97–98",
  mission:"A supply labeled 5 V produces a display reading of 5.04 V. Has the DMM proven that the supply is defective?",
  reveal:"No. The nominal label is a target and the meter has its own resolution and accuracy limits. Check permitted variation, test conditions and circuit behavior before diagnosing a fault.",
  anchors:[["5.04 V","A reading, not a standalone fault diagnosis"],["Resolution","Smallest change the display can show"],["Fast dropout","May be missed by slow numerical updates"]],
  missionType:"wave",hint:"What does this number prove?",
  outcome:"Decide what confidence a meter reading supports and whether a time trace would provide better evidence.",
  caution:"No physical probing of mains, energized appliances or circuits beyond verified equipment ratings. Scope grounding and probe ratings must be checked separately."
 },
 "BDMM-02":{
  eyebrow:"GEIER / CHAPTER 6 / PP. 98–99",
  mission:"Your virtual red probe touches a point at +5 V and the black probe touches verified common. What appears if you swap the probes?",
  reveal:"The meter changes from +5 V to −5 V, because it reads the potential of red relative to black. Neither the circuit nor the two selected nodes have changed.",
  anchors:[["+5 V","Red at source, black at verified common"],["−5 V","Red at common, black at source"],["Reference","Must come from verified circuit information"]],
  missionType:"meter",hint:"Two points, one difference",
  outcome:"Select a circuit reference, interpret probe polarity and locate a modeled open circuit from voltage measurements.",
  caution:"Never assume a chassis, heat sink or speaker negative is safe circuit common. Check meter mode, input jacks and voltage rating."
 },
 "EIM-BEC-PRELAB":{
  eyebrow:"PRELAB · BENCH READINESS",
  mission:"You pull a resistor labeled 1 kΩ ±5% from your kit. Your meter reads 1,080 Ω. Would you use it as an in-tolerance 1 kΩ component?",
  reveal:"Not as a ±5% part: the allowed interval is 950–1,050 Ω. Check the label, your connections, and the meter before assuming the part is faulty.",
  anchors:[
   ["950–1,050 Ω","Acceptable ±5% range for a nominal 1 kΩ resistor"],
   ["One five-hole strip","Typical breadboard connectivity on one side of the center gap"],
   ["Power OFF","Required before resistance or continuity measurements"]
  ],
  missionType:"resistor",hint:"Your equipment mission",
  outcome:"Finish with a plan for identifying the component, confirming the breadboard path, and choosing the correct meter setup.",
  caution:"A current-mode DMM is not a voltmeter. Never connect its current input directly across a supply."
 },
 "EIM-BEC-DC02":{
  eyebrow:"DC 02 · THREE-RESISTOR CHALLENGE",
  mission:"You have three 1 kΩ resistors and an ideal 5 V source. Does connecting them in series or parallel draw more total current?",
  reveal:"Parallel draws more: about 15 mA total, versus about 1.67 mA in series. All three resistors are identical; only the topology changed.",
  anchors:[
   ["3 kΩ","Total series resistance: one current path"],
   ["≈333 Ω","Three equal 1 kΩ resistors in parallel"],
   ["15 mA","Ideal 5 V source current in the three-branch parallel network"]
  ],
  missionType:"circuit",hint:"Your circuit mission",
  outcome:"Before touching wires, predict the current and voltage at each branch, then recognize what a disconnected branch changes.",
  caution:"Keep the power disconnected while building or changing wiring, and always take ohmmeter readings with power off."
 },
 "L01":{
  eyebrow:"LEGACY · ELECTRICAL FOUNDATIONS",
  mission:"A device takes 2 coulombs of charge every second at 12 volts. What is its power consumption?",
  reveal:"24 watts: 2 A × 12 V = 24 W. Current is charge per second, and voltage is energy per unit charge.",
  anchors:[["2 A","Two coulombs crossing a point each second"],["12 J/C","Energy transferred per coulomb"],["24 W","24 joules transferred every second"]],
  missionType:"units",hint:"Units in context",outcome:"Recognize voltage, current, power and energy as related but distinct quantities.",caution:"The numerical example is theoretical; actual circuit safety depends on source and component ratings."
 },
 "L02":{
  eyebrow:"LEGACY · MEASUREMENT AND SAFETY",
  mission:"You want to measure the voltage across a resistor. Should your meter replace a wire in series or touch both ends of the resistor?",
  reveal:"Touch both ends using voltage mode: voltage is measured across two nodes. Series insertion is for a suitably rated current measurement.",
  anchors:[["Across","Voltage uses two nodes"],["In series","Current passes through the meter"],["Unpowered","Resistance and continuity testing"]],
  missionType:"meter",hint:"Probe placement matters",outcome:"Choose the meter function, jack and probe arrangement appropriate to the requested quantity.",caution:"Never place an ammeter directly across a source. Confirm jack, fuse and range ratings."
 },
 "L03":{
  eyebrow:"LEGACY · OHM'S LAW",
  mission:"A fixed 1 kΩ resistor has 5 V across it. If the voltage doubles while resistance stays fixed, what happens to the current?",
  reveal:"It doubles: 5 mA becomes 10 mA because I = V/R and R stays constant.",
  anchors:[["5 mA","Current at 5 V across 1 kΩ"],["10 mA","Current at 10 V across 1 kΩ"],["I = V/R","Keep units consistent"]],
  missionType:"circuit",hint:"Predict the relationship",outcome:"Calculate current and explain what changes when voltage or resistance changes.",caution:"Theoretical voltages in a simulation do not imply your physical parts are rated for them."
 },
 "L04":{
  eyebrow:"LEGACY · SERIES AND PARALLEL",
  mission:"Three identical branches share a 5 V source. If one branch opens, will the remaining branches automatically draw extra current?",
  reveal:"No. With an ideal regulated 5 V source, the surviving parallel branches keep the same voltage and individual currents. Only the total falls.",
  anchors:[["Same current","Components in a series path"],["Same voltage","Parallel branches between the same nodes"],["Open branch","No current through that broken path"]],
  missionType:"circuit",hint:"Trace the current paths",outcome:"Predict how series and parallel arrangements respond when a branch opens.",caution:"A short circuit is not the same as an open circuit; never deliberately short an energized source."
 },
 "L05":{
  eyebrow:"LEGACY · AC AND FILTERS",
  mission:"An audio signal is 1,000 Hz. How long does one complete cycle take?",
  reveal:"1 millisecond. Period is the reciprocal of frequency: 1/1,000 second = 0.001 s.",
  anchors:[["1 kHz","One thousand cycles each second"],["1 ms","Duration of one cycle at 1 kHz"],["RC","Resistors and capacitors can shape frequency response"]],
  missionType:"wave",hint:"Audio and changing signals",outcome:"Connect frequency, period and reactive components to practical filter behavior.",caution:"The signal and filter examples are conceptual; use appropriately rated, isolated low-voltage training setups."
 }
};
const escapeHtml=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function miniFigure(kind) {
 if(kind==="resistor")return '<svg class="overview-figure" viewBox="0 0 350 125" role="img" aria-label="Illustrated resistor showing nominal 1 kiloohm and five percent tolerance"><path d="M17 63 H88 M270 63 H332" stroke="#C6F5FF" stroke-width="5"/><rect x="82" y="34" width="196" height="58" rx="22" fill="#D5EDF5"/><rect x="128" y="35" width="15" height="56" fill="#A47151"/><rect x="169" y="35" width="15" height="56" fill="#293D4C"/><rect x="210" y="35" width="15" height="56" fill="#DD6C5D"/><rect x="248" y="35" width="14" height="56" fill="#B99C51"/><text x="175" y="19" text-anchor="middle" fill="#E4F9FF" font-size="16">1 kΩ ±5%</text></svg>';
 if(kind==="meter")return '<svg class="overview-figure" viewBox="0 0 350 125" role="img" aria-label="Voltmeter symbol connected across two resistor nodes"><path d="M35 38 H124 M226 38 H315 M35 38 V95 H315 V38" fill="none" stroke="#89DDF5" stroke-width="4"/><path d="M124 38 L136 26 L148 50 L160 26 L172 50 L184 26 L196 50 L208 26 L226 38" fill="none" stroke="#E4F9FF" stroke-width="3"/><circle cx="175" cy="95" r="20" fill="#26556B" stroke="#C0F3FF" stroke-width="3"/><text x="175" y="102" text-anchor="middle" fill="#E4F9FF" font-size="19">V</text></svg>';
 if(kind==="wave")return '<svg class="overview-figure" viewBox="0 0 350 125" role="img" aria-label="Sine-wave cycle for an alternating signal"><path d="M16 68 H332" stroke="#6086A2" stroke-width="2"/><path d="M20 68 C52 68 52 20 96 20 S144 68 176 68 S220 115 257 115 S303 68 330 68" stroke="#84F4FF" stroke-width="4" fill="none"/><text x="170" y="15" text-anchor="middle" fill="#DDF7FF" font-size="14">One cycle = one period</text></svg>';
 if(kind==="circuit")return '<svg class="overview-figure" viewBox="0 0 350 125" role="img" aria-label="Simple three-branch parallel schematic"><path d="M38 32 H310 M38 32 V97 H310 V32 M118 32 V48 M118 80 V97 M180 32 V48 M180 80 V97 M247 32 V48 M247 80 V97" fill="none" stroke="#99DCF3" stroke-width="3"/><rect x="109" y="48" width="18" height="32" rx="3" fill="#DBF4FB"/><rect x="171" y="48" width="18" height="32" rx="3" fill="#DBF4FB"/><rect x="238" y="48" width="18" height="32" rx="3" fill="#DBF4FB"/><text x="175" y="119" fill="#C9F1FC" font-size="13" text-anchor="middle">Three paths, shared voltage</text></svg>';
 return '<svg class="overview-figure" viewBox="0 0 350 125" role="img" aria-label="Electrical units in context"><text x="175" y="64" text-anchor="middle" fill="#C8F7FF" font-size="30" font-weight="700">V × A = W</text><text x="175" y="92" text-anchor="middle" fill="#A5DCEF" font-size="13">Energy per charge × charge per second</text></svg>';
}
export function lessonOverview(lesson) {
 const x=intro[lesson.id]||{
  eyebrow:"STUDY BRIEFING",hint:"Starting question",
  mission:lesson.questions[0]?.prompt||lesson.description,
  reveal:lesson.questions[0]?.explain||"Use the Learn tab to investigate before attempting the quiz.",
  anchors:[["Concept",lesson.description],["Explore","Observe the guided simulation"],["Verify","Check your explanation against the evidence"]],
  missionType:"units",outcome:lesson.description,
  caution:"Use the verified equipment ratings and the procedure from the relevant source before touching a physical circuit."
 };
 return '<section class="lesson-overview lesson-briefing"><div class="briefing-top"><div><span class="v2-kicker">'+escapeHtml(x.eyebrow)+'</span><h3>'+escapeHtml(x.hint)+'</h3><p>'+escapeHtml(x.mission)+'</p></div><div class="briefing-figure">'+miniFigure(x.missionType)+'</div></div>'+
 '<div class="briefing-reveal"><button class="outline small-button" type="button" data-reveal-insight aria-expanded="false" aria-controls="starting-insight">Reveal the starting insight <span aria-hidden="true">⌄</span></button>'+
 '<p id="starting-insight" class="briefing-insight" hidden>'+escapeHtml(x.reveal)+'</p></div>'+
 '<h4 class="briefing-section-name">Three things to keep in mind</h4><div class="briefing-facts">'+x.anchors.map((a,i)=>'<article><span>0'+(i+1)+'</span><b>'+escapeHtml(a[0])+'</b><p>'+escapeHtml(a[1])+'</p></article>').join('')+'</div>'+
 '<div class="briefing-outcome"><div><strong>Your goal</strong><p>'+escapeHtml(x.outcome)+'</p></div><div><strong>Before the physical bench</strong><p>'+escapeHtml(x.caution)+'</p></div></div>'+
 '<button class="primary" data-lesson-tab="learn">Begin the first concept →</button></section>';
}
