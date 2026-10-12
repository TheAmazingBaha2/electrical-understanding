// Original, source-independent mathematics companions linked to published electronics lessons.
// Math IDs and question IDs are permanent. Keep existing source lesson IDs unchanged.
// A new companion is added after a human-reviewed lesson introduces mathematics not yet covered here.
const step=(title,prose,widget)=>'<h3>'+title+'</h3><p>'+prose+'</p>'+ (widget?'<div class="lab-widget" data-lab-kind="'+widget+'"><p class="muted sm">Loading the math workbench…</p></div>':'');
const q=(id,prompt,answer,unit,explain,tolerance=.01)=>({id,type:'number',prompt,answer,unit,tolerance,explain});
const choice=(id,prompt,choices,correct,explain)=>({id,type:'choice',prompt,choices,correct,explain});
export const mathLessons=[
 {id:'MATH-001',subtrack:'math',topic:'units',module:'Mathematics Companion · Units and scale',title:'Scale, Prefixes and Powers of Ten',minutes:35,experiment:'embedded',
  description:'Learn why a milli-, micro- or kilo-prefix changes a circuit calculation, and how to convert without losing the meaning of the unit.',
  sourceLessonIds:['CETA-G03-01','L01'],sourceTopics:['Engineering prefixes','Voltage, current and energy'],
  html:'<p>Electronics measurements use quantities that vary by factors of a thousand or more. The goal is not to move a decimal mechanically: it is to understand what the prefix means and confirm the final unit.</p>'+
   step('1. Read the prefix as a multiplier','Milli means one thousandth: 5 mA = 5 × 0.001 A = 0.005 A. Kilo means one thousand: 2.2 kΩ = 2,200 Ω. The physical quantity is unchanged; only the way we express its scale changes.','math-prefix-current')+
   step('2. Understand negative powers','Micro means 10⁻⁶. A 330 µF capacitor is 330 × 10⁻⁶ F = 0.000330 F. Negative exponents do not imply negative capacitance; they show a fractional scale.','math-prefix-capacitance')+
   step('3. Check units before using equations','In I = V/R, volts divided by ohms gives amperes. 5 V ÷ 1,000 Ω gives 0.005 A, not 5 A. Treat a suspiciously large result as a cue to check the prefixes before believing the number.')+
   step('4. Reason from the result','When you convert from mA to A the number becomes 1,000 times smaller, but the amount of current is identical. When converting A to mA the number becomes 1,000 times larger. The direction should make sense before you calculate.'),
  questions:[
   q('m001q01','Convert 12 mA into amperes.',.012,'A','12 ÷ 1,000 = 0.012 A.',.00001),
   q('m001q02','Convert 4.7 kΩ into ohms.',4700,'Ω','Multiply 4.7 by 1,000.',.1),
   q('m001q03','Convert 220 µF into farads.',.00022,'F','Micro is one millionth; 220 × 10⁻⁶ F = 0.00022 F.',.00000001),
   choice('m001q04','A value is rewritten from 0.005 A to 5 mA. What changed?',['The physical current increased','The unit notation only','The circuit resistance increased'],1,'Both describe the same current.'),
   choice('m001q05','Why should a calculation convert mA to A before applying V/R in base SI units?',['To keep scale factors consistent','To reduce real power','To make the battery safer'],0,'Matching base units prevents a factor-of-1,000 mistake.'),
   q('m001q06','How many mA are in 0.025 A?',25,'mA','Multiply A by 1,000.',.001)
  ]},
 {id:'MATH-002',subtrack:'math',topic:'algebra',module:'Mathematics Companion · Solving equations',title:'Ohm’s Law as an Algebra Tool',minutes:40,experiment:'embedded',
  description:'Understand why V = IR can be rearranged, how the units prove the answer, and how changing one variable changes another.',
  sourceLessonIds:['L03','EIM-BEC-PRELAB'],sourceTopics:['Ohm’s law','Low-voltage bench calculations'],
  html:'<p>An equation describes a relationship, not a memory trick. Voltage is the amount of potential difference, current describes charge flow, and resistance controls how much current results from a given voltage in an ideal resistor.</p>'+
   step('1. Rearrange by doing the same thing to each side','Start with V = I × R. To isolate I, divide both sides by R: V/R = I. You are not changing the physical law—you are expressing the same relationship in terms of a different unknown.','math-ohm-current')+
   step('2. Multiply to find an unknown voltage','Rearrange the same equality to find V. A resistance of 1,000 Ω carrying 0.005 A has a drop of 5 V. Check: A × Ω = V.','math-ohm-voltage')+
   step('3. Solve for resistance','Starting from V = IR, divide both sides by I to get R = V/I. With 6 V and 0.002 A, resistance is 3,000 Ω. That is also 3 kΩ. Do not divide by zero; an open path requires separate physical interpretation.')+
   step('4. Explain which quantities stay fixed','For a fixed resistor, doubling applied voltage doubles ideal current. For a fixed voltage, doubling resistance halves ideal current. Always name what is held constant before predicting a change.'),
  questions:[
   q('m002q01','An ideal 5 V source drives 1,000 Ω. Calculate the current in mA.',5,'mA','I=5/1000 A=0.005 A=5 mA.',.001),
   q('m002q02','A 2 kΩ resistor carries 3 mA. Find the voltage across it.',6,'V','V = 0.003 A × 2,000 Ω = 6 V.',.01),
   q('m002q03','If an ideal resistor has 12 V across it and 4 mA through it, find R in kΩ.',3,'kΩ','R=12/.004=3000 Ω=3 kΩ.',.01),
   choice('m002q04','What operation isolates current in V = IR?',['Add R to both sides','Divide both sides by R','Multiply both sides by V'],1,'Both sides divided by R leaves I.'),
   choice('m002q05','At a fixed voltage, what happens if resistance doubles?',['Current doubles','Current stays fixed','Current halves'],2,'I=V/R, so current is inversely related to resistance.'),
   q('m002q06','A 10 V source has a 5 kΩ ideal load. Give the current in mA.',2,'mA','10/5000 A=2 mA.',.001)
  ]},
 {id:'MATH-003',subtrack:'math',topic:'networks',module:'Mathematics Companion · Series and parallel',title:'Combining Resistances and Dividing Voltage',minutes:45,experiment:'embedded',
  description:'Use addition, reciprocal relationships and ratios to predict series voltage drops and parallel branch currents.',
  sourceLessonIds:['L04','EIM-BEC-DC02'],sourceTopics:['Three-resistor networks','Series and parallel'],
  html:'<p>Connecting components changes the geometry of current paths. In series, current travels one path; in parallel, each branch shares the same pair of voltage nodes. The mathematics follows those connections.</p>'+
   step('1. Add resistances in a single path','Three series resistors of 1 kΩ each form 3 kΩ total. Across 6 V, their common current is 6/3000 = 2 mA. The combined resistance grows because each component opposes the same current.','math-series')+
   step('2. Use a ratio to split voltage','For series resistors, each drop is Vsource × Rpart/Rtotal. If the three equal resistors share 6 V, each drops 2 V; the drops must add back up to 6 V.','math-divider')+
   step('3. Add parallel currents','Each parallel branch sees the same applied voltage. For three 1 kΩ branches across 6 V, each carries 6 mA, so source current is 18 mA. The total is the sum of branch currents—not a fixed current divided between them.','math-parallel')+
   step('4. Check equivalent resistance','Equivalent parallel resistance is 1/(1/R1 + 1/R2 + …). Three equal 1 kΩ branches give approximately 333.3 Ω. The equivalent must be lower than the smallest individual branch resistance.'),
  questions:[
   q('m003q01','Find the series equivalent of 1 kΩ, 2 kΩ and 3 kΩ.',6,'kΩ','Add all values: 1+2+3=6 kΩ.',.01),
   q('m003q02','Two equal 1 kΩ resistors in series share 10 V. What is the voltage across one?',5,'V','Equal resistances divide voltage equally.',.01),
   q('m003q03','Three 1 kΩ branches in parallel across 6 V carry what TOTAL current?',18,'mA','Each branch carries 6 mA; sum to 18 mA.',.01),
   q('m003q04','Two equal 1 kΩ resistors in parallel have what equivalent resistance in ohms?',500,'Ω','1/(1/1000+1/1000)=500 Ω.',.1),
   choice('m003q05','In an ideal parallel network, what do all branches share?',['Equal voltage','Equal resistance','Equal current'],0,'Branches connect to the same two nodes, so the branch voltage is equal.'),
   choice('m003q06','Why must the parallel equivalent be below the smallest branch resistance?',['Extra branches provide more current paths','A branch adds extra series resistance','The voltage source loses voltage'],0,'An extra branch adds conductance, reducing the equivalent resistance.')
  ]},
 {id:'MATH-004',subtrack:'math',topic:'measurement',module:'Mathematics Companion · Measurement math',title:'Tolerance, Error and What a Meter Digit Means',minutes:40,experiment:'embedded',
  description:'Calculate allowable ranges, percent error and resolution without confusing a precise-looking display with an accurate measurement.',
  sourceLessonIds:['BDMM-01','BDMM-02','L02'],sourceTopics:['Digital multimeter','Measurement uncertainty'],
  html:'<p>Measurement is always an estimate with limitations. The number of displayed digits, the accuracy specification and the acceptable circuit tolerance answer three different questions.</p>'+
   step('1. Apply a percent tolerance','A 5 V target with ±5% tolerance allows a deviation of 0.25 V because 5 × 0.05 = 0.25. The acceptable interval is 4.75 V to 5.25 V. This is a worked example, not a universal specification.','math-tolerance')+
   step('2. Compute an error percentage','If a known reference is 5.00 V and a meter reads 5.10 V, the absolute error is 0.10 V. Percent error relative to the reference is |5.10−5.00| ÷ 5.00 × 100% = 2%. Do not confuse percent error with a manufacturer accuracy guarantee.','math-error')+
   step('3. Separate resolution and accuracy','A 5.002 V display has a finer last digit than 5.00 V. That alone does not prove the meter is closer to the actual voltage. Resolution is the smallest step displayed; accuracy is related to closeness to the true value.')+
   step('4. Compare against the correct limit','When a specification provides a tolerance or accuracy range, calculate the permitted band using the specified conditions. If you lack the accuracy specification, do not invent a number or treat the displayed decimals as proof.'),
  questions:[
   q('m004q01','A specified 5 V ±5% supply permits how much absolute deviation?',.25,'V','0.05 × 5 = 0.25 V.',.001),
   q('m004q02','Find the lower limit of a 12 V ±10% example specification.',10.8,'V','12−(12 × .10)=10.8 V.',.01),
   q('m004q03','A 10 V reference is read as 10.5 V. What is the absolute percent error?',5,'%','0.5/10 ×100%=5%.',.01),
   choice('m004q04','Which statement about a 5.002 V meter display is justified?',['It is necessarily more accurate than a 5.00 V meter','It displays a finer resolution','Its calibration cannot drift'],1,'Extra displayed digits do not guarantee a smaller error.'),
   choice('m004q05','What should determine a real acceptable reading range?',['The device or meter specification','The prettiest decimal display','An assumed universal 5% tolerance'],0,'Use actual manufacturer/test-condition limits.'),
   q('m004q06','A reference is 4.00 V and a measurement is 3.92 V. What is the absolute error in volts?',.08,'V','|3.92−4.00|=0.08 V.',.001)
  ]},
 {id:'MATH-005',subtrack:'math',topic:'power',module:'Mathematics Companion · Power and efficiency',title:'Power, Energy, Time and Efficiency',minutes:40,experiment:'embedded',
  description:'Connect watts to joules per second, estimate energy consumption over time, and distinguish useful output from wasted input.',
  sourceLessonIds:['L01','L03','EIM-BEC-DC02'],sourceTopics:['Power and energy','DC resistor loading'],
  html:'<p>Power measures how quickly energy is transferred. Energy accumulates over time. In a simple DC circuit under steady conditions, both relationships can be calculated from the measured voltage and current.</p>'+
   step('1. Watts connect voltage and current','For steady DC, P = V × I. A 5 V supply delivering 0.2 A provides 1 W to its load. Because 1 W = 1 J/s, the load transfers 1 joule each second.','math-power')+
   step('2. Convert time before finding energy','E = P × t, with time in seconds when you want joules. A 24 W device operating for five minutes transfers 24 × 300 = 7,200 J. Minutes must become seconds first.','math-energy')+
   step('3. Predict heat in resistors','A resistor dissipates power as heat. With the ideal resistor law, P = I²R or V²/R. If voltage doubles across a fixed resistor, power rises by a factor of four; this is why selecting real component ratings matters.')+
   step('4. Efficiency expresses a ratio','Efficiency = useful output power ÷ total input power × 100%. If an imaginary device uses 10 W and provides 8 W of useful output, it is 80% efficient, with 2 W going to other processes such as heat. This ideal bookkeeping is not a claim that real devices have a universal loss mechanism.'),
  questions:[
   q('m005q01','Find power for 12 V and 0.5 A of steady DC.',6,'W','P=VI=12×0.5=6 W.',.01),
   q('m005q02','A 20 W lamp operates for 3 minutes. Find the energy in joules.',3600,'J','3 minutes=180 s, so E=20×180=3600 J.',.1),
   q('m005q03','A device consumes 50 W and delivers 40 W useful output. Find its efficiency.',80,'%','40/50 ×100%=80%.',.01),
   q('m005q04','A 100 Ω resistor has 10 V across it. Calculate its power.',1,'W','P=V²/R=100/100=1 W.',.01),
   choice('m005q05','What does one watt represent?',['One joule per second','One coulomb per volt','One ohm per ampere'],0,'Power is rate of energy transfer.'),
   choice('m005q06','If voltage doubles across a fixed ideal resistance, dissipated power…',['Doubles','Quadruples','Stays constant'],1,'P=V²/R; the squared voltage changes power by four.')
  ]},
 {id:'MATH-006',subtrack:'math',topic:'ac',module:'Mathematics Companion · Timing and filters',title:'Frequency, Period and RC Filter Mathematics',minutes:45,experiment:'embedded',
  description:'Learn reciprocal relationships, frequency units and the meaning of an RC cutoff equation before using a filter design formula.',
  sourceLessonIds:['L05'],sourceTopics:['AC frequency','RC filters'],
  html:'<p>Signals change in time. Frequency measures cycles per second and period measures seconds per cycle. Capacitors respond differently as frequency changes, making the math useful for practical audio circuits.</p>'+
   step('1. Turn frequency into time','T = 1/f. A 100 Hz wave repeats every 0.01 seconds, or 10 ms. Frequency and period are reciprocals: more cycles each second mean less time per cycle.','math-period')+
   step('2. Understand the frequency factor','For a first-order RC low-pass filter, the cutoff frequency is fₙ = 1/(2πRC). R is in ohms and C in farads. The factor 2π connects angular frequency to cycles per second; a missing prefix or a missing π can severely change the answer.','math-cutoff')+
   step('3. Predict direction without a calculator','Holding R constant, a larger capacitor produces a lower cutoff. Holding C constant, a larger resistor also produces a lower cutoff. A cutoff frequency is a characteristic of this ideal filter; it is not a brick-wall stop for every signal above that value.')+
   step('4. Interpret the physical circuit','In the simple low-pass arrangement, R is in series and C shunts higher-frequency content toward the reference node. The cutoff marks approximately −3 dB magnitude, or about 0.707 times the low-frequency voltage amplitude for an ideal first-order filter.'),
  questions:[
   q('m006q01','Find the period of a 100 Hz signal in milliseconds.',10,'ms','T=1/100 s=0.01 s=10 ms.',.01),
   q('m006q02','Find the frequency of a 0.020 second period.',50,'Hz','f=1/0.020=50 Hz.',.01),
   choice('m006q03','For fixed R, making C larger causes RC cutoff frequency to…',['Increase','Decrease','Stay fixed'],1,'f=1/(2πRC).'),
   choice('m006q04','What is the reciprocal of frequency?',['Resistance','Period','Power'],1,'T=1/f.'),
   q('m006q05','In an ideal RC low pass with R=1,000 Ω and C=1 µF, find cutoff approximately.',159.15,'Hz','1/(2π × 1000 × .000001) ≈ 159.15 Hz.',.6),
   choice('m006q06','At the ideal first-order RC cutoff, voltage magnitude is approximately…',['0.707 of the low-frequency value','Zero','Twice the low-frequency value'],0,'A single pole has a −3 dB magnitude at cutoff.')
  ]}
];
export const mathById=id=>mathLessons.find(x=>x.id===id);
export const relatedMath=sourceId=>mathLessons.filter(x=>x.sourceLessonIds.includes(sourceId));
// Gate a companion on reachability of at least one of its ORIGINAL source lessons,
// not completion of another math topic. Math itself never blocks core curriculum.
export function mathAvailability(math,sourceLessons,sourceAvailable){
 return math.sourceLessonIds.some(id=>{
  const source=sourceLessons.find(l=>l.id===id);
  return Boolean(source&&sourceAvailable(source));
 });
}
