// Independently authored recap of the accepted Chapter 3 evidence; no API calls.
// Append only: original sixteen lesson/question objects must remain unchanged.
export function chapter3Summary(source){
 const takeaways=[
  ['S1','S2','Read prefixes before calculating: milli = 10⁻³, micro = 10⁻⁶ and pico = 10⁻¹². For example, 1,000 pF = 0.001 µF.'],
  ['S3','Rearrange an equality by applying the same inverse operation to both sides. Check the result in the original equation.'],
  ['S18','Keep the quantity symbol separate from its unit: resistance, reactance and impedance use Ω; frequency uses Hz, capacitance F and inductance H.'],
  ['S4','S5','Choose the relationship that fits the known values: I = V/R and P = VI = I²R = V²/R. At fixed R, doubling V doubles I and quadruples P.'],
  ['S9','Resistors add in series; in parallel their reciprocals add. With positive branch resistances, the parallel equivalent is below either branch.'],
  ['S6','Internal resistance causes source voltage sag under load: I = EMF/(Rload + r), and terminal voltage = EMF − Ir.'],
  ['S7','For an ideal sine wave, peak-to-peak = 2 × peak and RMS = peak/√2. Do not apply the sine-wave RMS conversion to every waveform.'],
  ['S8','Period and frequency are reciprocals: T = 1/f. Higher frequency means a shorter cycle, not a larger amplitude.'],
  ['S10','Capacitor charge and energy are different: Q = CV and E = ½CV². At fixed C, doubling V doubles charge but quadruples energy.'],
  ['S12','Capacitors add in parallel and use reciprocal sums in series—the opposite combination rule to resistors.'],
  ['S11','The RC time constant is τ = RC. Ideal charging reaches about 63.2% after one τ; the final value is approached rather than reached exactly.'],
  ['S13','Capacitive reactance is X_C = 1/(2πfC): increasing f or C lowers it. In the ideal capacitor, current leads voltage.'],
  ['S15','Simple inductor combination rules require negligible mutual coupling: series adds; parallel uses reciprocal sums.'],
  ['S14','Inductive reactance is X_L = 2πfL: increasing f or L raises it. The accepted source describes voltage leading current.'],
  ['S16','For the ideal series RLC model, |Z| = √(R² + (X_L − X_C)²). Preserve the signed difference when identifying inductive or capacitive predominance.'],
  ['S17','Ideal resonance occurs when X_L = X_C, with f_r = 1/(2π√(LC)). Convert prefixes first and check the result using both reactances.']
 ];
 const rows=[
  ['Which conversion keeps the capacitance unchanged?','1,000 pF = 0.001 µF',['1,000 pF = 1 µF','1,000 pF = 1,000 µF','1,000 pF = 0.1 µF'],'Pico and micro differ by six powers of ten; divide the pF number by one million.',['S1','S2']],
  ['Which method reliably checks your rearranged equation?','Substitute the result into the original equality',['Only check that it is positive','Remove the unit before comparing','Use a different formula without checking the original'],'A valid solution reproduces the original relationship.',['S3']],
  ['Which pair correctly distinguishes a quantity and its unit?','Capacitance C, measured in farads F',['Capacitance F, measured in coulombs C','Frequency Ω, measured in resistance','Inductance Hz, measured in hertz'],'Quantity symbols name the variable; unit symbols state the measurement scale.',['S18','S10']],
  ['At fixed resistance, voltage doubles. What happens to current and power?','Current doubles; power quadruples',['Both double','Both quadruple','Current halves; power doubles'],'I = V/R is linear in V; P = V²/R contains its square.',['S4','S5']],
  ['Two positive resistors are connected in parallel. Their equivalent resistance is…','Lower than either branch resistance',['The sum of the branch values','Always greater than both branches','Negative'],'Reciprocal addition increases conductance and lowers equivalent resistance.',['S9']],
  ['Why can a loaded battery have terminal voltage below its EMF?','Load current creates a voltage drop across internal resistance',['Every load permanently changes the unit volt','EMF must be divided by capacitance','Terminal voltage always equals EMF'],'The series internal resistance drops Ir while current flows.',['S6']],
  ['Which amplitude conversion requires the ideal sine-wave assumption?','RMS = peak/√2',['Frequency = 1/period','Charge = capacitance × voltage','Series resistance is the sum'],'The 1/√2 factor is specific to the ideal sinusoidal waveform used here.',['S7']],
  ['Frequency doubles. What happens to period?','It halves',['It doubles','It quadruples','It stays fixed'],'T = 1/f: doubling the denominator halves the period.',['S8']],
  ['At fixed capacitance, voltage doubles. What happens to charge and stored energy?','Charge doubles; energy quadruples',['Both double','Charge quadruples; energy doubles','Both stay fixed'],'Q = CV is linear in V; E = ½CV² contains its square.',['S10']],
  ['Which ideal capacitor combination rule is correct?','Parallel capacitances add; series uses reciprocal sums',['Series capacitances add; parallel uses reciprocal sums','Both arrangements add directly','Both arrangements equal the smallest capacitor exactly'],'The capacitor rules reverse the familiar resistor arrangements.',['S12']],
  ['After one RC time constant, an ideal charging capacitor has reached approximately…','63.2% of its final voltage',['100% exactly','36.8% for the charging curve','0% for every charging circuit'],'One time constant identifies a characteristic charging timescale; it is not exact completion.',['S11']],
  ['At fixed capacitance, increasing frequency makes capacitive reactance…','Smaller',['Larger','Unchanged','Equal to resistance in every circuit'],'Frequency is in the denominator of X_C = 1/(2πfC).',['S13']],
  ['When is simple arithmetic for ideal inductor combinations appropriate?','When mutual magnetic coupling is negligible',['For every magnetically coupled arrangement','Only when inductance is measured in farads','When voltage is zero regardless of magnetic coupling'],'Mutual coupling changes the model; the simple rules are explicitly limited here.',['S15']],
  ['At fixed inductance, doubling frequency makes inductive reactance…','Twice as large',['Half as large','Four times as large','Unchanged'],'X_L = 2πfL contains frequency as a direct factor, unlike capacitive reactance.',['S14']],
  ['A series circuit has R = 3 Ω, X_L = 16 Ω and X_C = 20 Ω. Which answer is correct?','|Z| = 5 Ω; predominantly capacitive',['|Z| = 39 Ω; predominantly inductive','|Z| = −5 Ω; predominantly capacitive','|Z| = 4 Ω; purely resistive'],'X_L − X_C = −4 Ω; √(3² + (−4)²) = 5 Ω. A magnitude is nonnegative.',['S16']],
  ['At fixed L, quadrupling C changes ideal resonant frequency to…','Half its previous value',['One quarter','Twice its previous value','The same frequency'],'The factor of four becomes a factor of two under √(LC), which is in the denominator.',['S17']]
 ];
 const id='C3-CURATED-SUMMARY';
 const questions=rows.map(([prompt,answer,wrong,explanation,source_ids],i)=>{const choices=[answer,...wrong];const shift=i%choices.length;const rotated=[...choices.slice(shift),...choices.slice(0,shift)];return {id:id+'-Q'+String(i+1).padStart(2,'0'),type:'choice',prompt,answer,choices:rotated,correct:rotated.indexOf(answer),explanation,source_ids};});
 const ids=[...new Set(takeaways.flatMap(t=>t.slice(0,-1)))];
 if(source.analysis?.facts&&!ids.every(id=>source.analysis.facts.some(f=>f.id===id)))throw Error('Chapter 3 recap requires its accepted source evidence.');
 return {id,title:'Chapter 3 summary · The ideas to keep',description:'A short recap of the covered chapter, followed by a quiz on its most important relationships and common mistakes.',kind:'summary',chapter_summary:true,curated:true,series_id:'C3-CURATED-20261013',series_order:17,destination:'source',dashboard_track:'ceta',dashboard_ready:true,ordering:'independent',prerequisites:[],objectives:['Recall the chapter’s key relationships','Distinguish the assumptions and avoid common calculation errors'],sections:[{heading:'Key takeaways',body:takeaways.map(t=>t.at(-1)).join('\n'),source_ids:ids}],questions,activities:[],review_lessons:[],plan:{id:'U17',title:'Chapter 3 summary · The ideas to keep',kind:'summary',destination:'source',ordering:'independent',prerequisites:[],source_ids:ids},curriculum:{section:'exam',source_id:'associate-cet',source_title:source.source_book||'Associate CET Study Guide',chapter_id:'3',chapter_title:'Basic Math used in Electronic Service & Decibels',order:17,dashboard:true},source:{scanId:source.id,book:source.source_book,pages:source.source_pages,unit:'U17'},summary:{scope:'Covered Chapter 3 lessons',covered_lesson_ids:Array.from({length:16},(_,i)=>'C3-CURATED-U'+String(i+1).padStart(2,'0')),authorship:'Authored in this Work conversation from saved accepted Chapter 3 extraction; no paid API call or fresh image review.'}};
}
