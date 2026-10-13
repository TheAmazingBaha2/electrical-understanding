// Independently authored explanations and virtual cases. No scanned pages or copied book prose.
// Chapter 2: supplied pp.5–47. Chapter 6: supplied DMM subsection pp.97–103 ONLY.
import {geierBookTitle,geierChapters} from './geier-catalog.js';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const section=(title,pages,...paragraphs)=>({title,pages,paragraphs});
const field=(id,label,options,answer)=>({id,label,options,answer});
const select=(title,pages,prompt,fields,debrief,kind='match')=>({kind,title,pages,prompt,fields,debrief});
const inspect=(title,pages,prompt,items,debrief)=>({kind:'inspect',title,pages,prompt,items,debrief});
const scenario=(title,pages,cases)=>({kind:'scenario',title,pages,prompt:'Choose the next useful action in each stage. Check your decisions to see what the evidence supports.',cases});
const decision=(prompt,choices,correct,explain)=>({prompt,choices,correct,explain});
const sequence=(title,pages,steps,order,debrief)=>({kind:'sequence',title,pages,prompt:'Use Move up and Move down to put the preparation steps in a sensible order.',steps:steps.map(([id,text])=>({id,text})),correctOrder:order,debrief});
const q=(prompt,choices,correct,explain,safety=false)=>({type:'choice',prompt,choices,correct,explain,...(safety?{safety:true}:{})});
const instrumentChoices=[['dmm','DMM'],['scope','Oscilloscope'],['esr','ESR meter'],['cap','Capacitance meter'],['generator','Signal generator'],['counter','Frequency counter']];
const precautions='These are virtual preparation and measurement exercises. Passing them records understanding, not verified physical repair skill. Equipment ratings, manuals and appropriate training govern real work.';
function workshop(chapter,order,title,description,pages,sections,activities,questions,options={}){
 const id=`GEIER-C${chapter}-W${String(order).padStart(2,'0')}`;
 const chapterTitle=geierChapters.find(c=>c.id===String(chapter)).title;
 return {id,module:geierBookTitle,subtrack:'geier',workshop:true,independent:true,experiment:'workshop',title,description,
  seriesId:`GEIER-C${chapter}-WORKSHOPS`,seriesOrder:order,scope:chapter===6?'Digital Multimeter subsection only · Chapter 6 remains open':'Chapter 2 companion',
  curriculum:{section:'textbooks',source_id:'geier',source_title:geierBookTitle,chapter_id:String(chapter),chapter_title:chapterTitle,order,dashboard:true},
  sourceAttribution:`Michael Jay Geier, ${geierBookTitle}, 3rd ed., Chapter ${chapter}, pp. ${pages}. Independently written companion; numerical values and practice cases are illustrative.`,
  sourcePages:pages,sections,
  html:'<p>'+esc(description)+'</p>'+sections.map(s=>'<h3>'+esc(s.title)+'</h3>'+s.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join('')+'<p class="muted sm">Book reference: pp. '+esc(s.pages)+'.</p>').join(''),
  activities:activities.map((a,i)=>({...a,id:`${id}-A${String(i+1).padStart(2,'0')}`})),
  questions:questions.map((a,i)=>({...a,id:`${id}-Q${String(i+1).padStart(2,'0')}`})),
  overview:{eyebrow:`GEIER / CHAPTER ${chapter} / WORKSHOP ${order}`,hint:title,mission:description,
   reveal:sections[0]?.paragraphs[0]||description,anchors:[['Explore',activities[0]?.title||'Key takeaways'],['Apply',activities[1]?.title||'Check the important ideas'],['Keep', 'Open the tool reference whenever you need it']],
   missionType:chapter===6?'meter':'circuit',outcome:description,caution:precautions},...options};
}

export const toolCards=[
 ['DMM','Measurements','Steady voltage, resistance, continuity and current using the appropriate function.','A number alone does not reveal every brief event or prove the cause of a fault.','Ch. 2 pp. 8–10; Ch. 6 pp. 97–103'],
 ['ESR meter','Measurements','Investigates equivalent series resistance, especially in electrolytic capacitors.','ESR is not capacitance; nearby parallel components can influence results.','Ch. 2 pp. 10–11'],
 ['Capacitance meter','Measurements','Reports capacitance and can help identify an unmarked capacitor.','A plausible capacitance reading does not establish good ESR or every aspect of health.','Ch. 2 p. 30'],
 ['Oscilloscope','Measurements','Shows a signal over time and supports investigation of timing and shape.','Usable bandwidth, acquisition settings, probe loading and grounding limit what can be concluded.','Ch. 2 pp. 11–20'],
 ['Scope probe','Measurements','Provides the intended connection and attenuation between circuit and scope.','Match probe/scope ratings and attenuation; a probe is not just any piece of wire.','Ch. 2 pp. 19–20'],
 ['Signal generator','Measurements','Supplies a known test waveform to investigate a signal path.','Its output settings and connection must suit the circuit; it does not measure the response by itself.','Ch. 2 pp. 30–31'],
 ['Frequency counter','Measurements','Counts cycles over a gate interval for suitable repetitive signals.','A frequency value is not a display of shape or proof of amplitude.','Ch. 2 pp. 31–32'],
 ['Bench power supply','Measurements','Provides a controlled source for suitable low-voltage equipment.','Verify voltage, polarity, current limit and device requirements before connecting.','Ch. 2 pp. 29–30'],
 ['Transistor / component tester','Measurements','Offers component-specific checks and can help identify parts.','Do not treat identification or one test result as a complete operating-condition diagnosis.','Ch. 2 pp. 30, 32–34'],
 ['Analog meter','Measurements','A moving needle can make some slower changes easier to notice.','Needle movement still needs scale interpretation and circuit context.','Ch. 2 pp. 34–35'],
 ['Soldering station','Assembly','Controlled heat and an appropriate tip support a suitable solder joint.','Tip size, thermal recovery, alloy and contact matter; a wattage label alone is not a complete setting.','Ch. 2 pp. 19–22'],
 ['Solder wick','Assembly','Braided material draws molten solder from a joint.','Avoid prolonged heating and pulling before solder melts; detailed technique comes later.','Ch. 2 pp. 22–23'],
 ['Solder sucker','Assembly','Suction removes molten solder, especially from larger joints.','The joint must be accessible and molten; suction does not guarantee a lead is free.','Ch. 2 pp. 23–24'],
 ['Hot-air station / soldering tweezers','Assembly','Helps heat multiple connections on suitable surface-mounted parts.','Heat can also affect nearby parts; this chapter introduces equipment rather than a complete rework procedure.','Ch. 2 pp. 39–40'],
 ['Solder paste / low-melting removal alloy','Assembly','Paste supports suitable SMD attachment; removal alloy can help keep old solder molten.','These serve different jobs. Follow the actual material and process instructions.','Ch. 2 p. 40'],
 ['Drivers, cutters and pliers','Handling','Fit fasteners, trim leads and hold or position parts.','Match size and geometry; forcing an ill-fitting driver can damage a screw.','Ch. 2 pp. 24–25'],
 ['Hemostats / bench vise','Handling','Hold a lead or board so your hands can perform the task.','Grip and positioning must avoid crushing or stressing the part.','Ch. 2 pp. 25, 37'],
 ['Magnifier / microscope','Handling','Makes small pads, markings and solder bridges easier to inspect.','Working clearance, focus and illumination matter as much as magnification.','Ch. 2 pp. 25, 36–37'],
 ['Camera and labeled parts cups','Handling','Preserve connector positions, layer order and screw locations.','A blurry image or an unlabeled cup may not preserve enough information to reassemble.','Ch. 2 pp. 29, 36'],
 ['Clip leads','Handling','Make suitable temporary connections.','An internal break can mislead the diagnosis; check the lead itself when results conflict.','Ch. 2 pp. 27–28'],
 ['Heat-shrink tubing','Supplies','Fits suitable wire insulation and connection protection.','Remember when it must be slipped on; material ratings and fit still matter.','Ch. 2 p. 28'],
 ['Cleaning products / swabs','Supplies','Remove suitable residue using compatible materials.','Check the exact cleaner, surface and instructions; no solvent is universally safe for every plastic or display.','Ch. 2 pp. 25–28'],
 ['Adhesives / thermal interface material','Supplies','Adhesives secure compatible items; thermal materials support the specified heat-transfer interface.','Mechanical loads, outgassing, material compatibility and the component instructions determine suitability.','Ch. 2 pp. 28, 40–41'],
 ['Parts drawers / donor boards','Supplies','Organize components by identity and value, with donor boards available for suitable parts.','A salvaged part still needs identification, ratings and condition checks; appearance alone is insufficient.','Ch. 2 pp. 41–43'],
 ['Isolation transformer / variac','Specialized','An isolation transformer and a voltage-adjusting autotransformer have different functions.','Neither makes exposed mains work safe for a beginner; never defeat an oscilloscope’s protective earth.','Ch. 2 pp. 35–36; Tektronix grounding guidance'],
 ['LCR meter','Specialized','Measures inductance, capacitance and resistance under its specified test conditions.','Interpret the reading against a known expected value and the instrument’s conditions.','Ch. 2 pp. 43–44'],
 ['Logic analyzer','Specialized','Examines logic states and their timing across multiple channels.','It is not an analog waveform display; meaningful analysis needs circuit/protocol expectations.','Ch. 2 p. 45'],
 ['Spectrum analyzer','Specialized','Shows how a signal’s content is distributed by frequency.','It answers a different question from a voltage-versus-time trace and has its own input limits.','Ch. 2 pp. 45–46'],
 ['LCD separator / BGA station','Specialized','Supports specialized display separation or high-density component rework.','An equipment introduction is not a complete repair procedure; BGA procedures are outside this chapter.','Ch. 2 pp. 37, 45–47'],
 ['GPS-disciplined oscillator','Specialized','Provides a suitable frequency reference for compatible test equipment.','Compatibility and specifications matter; it does not replace the signal-measuring instrument.','Ch. 2 pp. 32–33']
].map(([name,category,purpose,limit,pages])=>({name,category,purpose,limit,pages}));

const benchFields=[
 field('device','Repair item',[['blocked','Behind stacked tools'],['center','Clear center of bench'],['edge','Unstable bench edge']],'center'),
 field('iron','Iron stand',[['loose','Loose on the work surface'],['stand','Stable stand with a clear cord path'],['over','Above the open device']],'stand'),
 field('light','Task light',[['shadow','Behind you, casting a shadow'],['aimed','Aimed at the work without blocking access']],'aimed'),
 field('parts','Removed screws',[['pile','One loose mixed pile'],['cups','Labeled containers by stage']],'cups')
];
const prepSequence=()=>sequence('Document before the parts move','29, 36',[
 ['remove','Remove the next layer and put its hardware in a labeled container.'],['photo','Photograph the current connector positions and orientation.'],['identify','Identify the layer and assign a matching photo/container label.'],['check','Check that the photo is sharp enough to distinguish connections.']
],['identify','photo','check','remove'],'A label ties the picture and hardware to the same stage. A photo taken after disconnecting may miss the information you wanted to preserve. This is a documentation sequence, not a device-specific opening procedure.');

const chapter2=[
 workshop(2,1,'Set up a bench you can actually work at','Arrange a repair space around access, visibility and control of small parts, then explain the consequences of a poor layout.','5–8',[
  section('Give the repair item room','5–7','The center of the bench is your working area. If the device competes with instruments, loose leads and containers for space, every movement becomes harder to control. Place supporting equipment where it can be read or reached without reaching across the open device.','A good layout is not one universal floor plan. Left-handed work, device size and available space can change the arrangement. The useful test is whether you can see the task, move deliberately and put a hot tool back into a stable stand without crossing the work.'),
  section('Visibility is part of the job','7–8','Illumination helps you distinguish markings, screw heads and adjacent connections. A light that makes the whole room bright may still leave your hands casting a shadow on the board. Aim task lighting at the actual work and add magnification when the detail demands it.','A smooth, light-colored work surface also helps you find dropped hardware. Storage should make small parts recoverable, rather than merely move clutter out of sight. A clear container marked with its removal stage is more useful than a mystery pile.'),
  section('Control the surroundings','5–7','Think about who or what can reach an unfinished repair when you leave. Children, pets, spills and accidental contact can turn an organized session into a damaged project. A workspace that can be secured helps preserve the device and the people around it.','The workshop below asks you to fix specific layout problems. It does not require buying a particular bench or replicating the author’s shop. Existing sturdy furniture can be evaluated by the same practical criteria.')
 ],[
  select('Arrange the virtual bench','5–8','Move each item by choosing a location. Find an arrangement with a clear work area and useful access.',benchFields,'The repair item remains accessible, the iron has a stable home, light reaches the task and each group of screws has a traceable location.','bench'),
  inspect('Spot the problems before starting','5–8','Select every item that would interfere with this preparation.',[
   {id:'cord',label:'An iron cord crosses the repair item',problem:true,note:'Route cords without crossing the work.'},
   {id:'cup',label:'A labeled cup holds the screws from one layer',problem:false,note:'The label preserves context.'},
   {id:'shadow',label:'Your hands block the only task light',problem:true,note:'Aim lighting at the work.'},
   {id:'loose',label:'Tiny fasteners sit on the bench edge',problem:true,note:'Use recoverable storage.'}
  ],'The useful distinction is whether the arrangement helps you control the task. Labeled storage is an improvement, while obstructed light, loose hardware and crossing cords introduce avoidable problems.'),
  scenario('Adapt the setup','5–8',[decision('A larger device no longer fits in the clear center. What changes first?',['Stack it on the instruments','Rearrange supporting equipment to preserve stable access','Let the device hang over the edge'],1,'Adapt the arrangement to the task; preserving access matters more than keeping a fixed layout.')])
 ],[
  q('What should guide where supporting instruments go?',['Their color','Readable displays and access without crowding the repair','A fixed arrangement for every device'],1,'The layout serves the actual task.'),
  q('A bright ceiling light still leaves a shadow on the board. What helps?',['Aim task lighting at the working area','Use more unlabeled containers','Read the meter more often'],0,'Local visibility matters.'),
  q('What makes a screw container useful for reassembly?',['It is full','It is the largest container','Its label connects the hardware to a removal stage'],2,'Preserve origin, not just the pieces.'),
  q('Does a tidy bench certify that live appliance work is safe?',['Yes','No; electrical hazards require separate controls and training'],1,'Organization reduces avoidable mistakes but does not remove electrical hazards.',true)
 ]),

 workshop(2,2,'Choose the tool for the evidence you need','Compare measuring, displaying and supplying a signal; use the question you are trying to answer to select equipment.','8–11, 29–34',[
  section('Start with the missing information','8–11','“Which tool is best?” needs a second question: best for finding out what? A DMM can report an approximately steady voltage. A scope can show how a voltage changes through time. A signal generator supplies a test signal; it does not report what a circuit did with that signal.','In an illustrative audio repair, a DMM might check the supply first, then a scope could help investigate the changing signal. These tools complement one another. Choosing a useful first test does not prove the other instruments are unnecessary.'),
  section('Capacitor tests answer different questions','10–11, 30','Capacitance describes storage behavior. ESR describes a resistive part of the capacitor’s behavior under specified conditions. A meter reporting one of those properties has not automatically tested the other.','Imagine two example capacitors with similar capacitance but very different ESR. A capacitance-only test might not distinguish the difference that matters to the circuit. Conversely, one ESR result does not certify every possible failure mode. Interpret a test as evidence within its limits.'),
  section('More equipment is not more certainty','29–34','A component tester may identify a part and report selected characteristics. A counter may report frequency. Neither result replaces knowing the expected behavior and the conditions of the test. Conflicting evidence is a reason to investigate, not to average incompatible measurements.','Use the tool reference to explore unfamiliar equipment. The activity asks you to choose a tool by function, rather than memorize the chapter’s buying priorities.')
 ],[
  select('Match the question to the instrument','8–11, 30–32','Choose the instrument that directly answers each stated question.',[
   field('steady','Approximately steady battery voltage',instrumentChoices,'dmm'),field('timing','Shape and timing of a brief voltage event',instrumentChoices,'scope'),field('storage','Capacitance of an identified isolated capacitor',instrumentChoices,'cap'),field('supply','Provide a test waveform to a suitable signal path',instrumentChoices,'generator')
  ],'The same fault investigation can use several tools. Each selection is matched to a particular information need, not to a universal ranking.'),
  scenario('Two capacitor measurements','10–11, 30',[
   decision('An example capacitor reads its labeled capacitance. Is that enough to rule out elevated ESR?',['Yes, those are the same property','No; check the separate property when relevant','Only if the display has many digits'],1,'Capacitance and ESR describe different behavior.'),
   decision('A specialized tester says a transistor is identified. What is established?',['Every operating condition is healthy','Its board must be good','The reported identification/test result, within that tester’s limits'],2,'Identification is useful evidence, not a comprehensive circuit diagnosis.')
  ]),
  {kind:'catalog',title:'Explore the measurement tools',pages:'8–11, 29–34',prompt:'Search the tool cards by name or purpose. Open a card to compare its purpose and limits.',required:false}
 ],[
  q('Which instrument supplies a known test waveform?',['Frequency counter','Signal generator','Capacitance meter'],1,'A generator provides an input; another measurement observes the response.'),
  q('A scope’s ordinary time display primarily plots what?',['Voltage against time','Resistance against cost','Capacitance against age'],0,'It reveals changing voltage.'),
  q('What does an ESR reading directly describe?',['The capacitor’s case color','The total board current','Equivalent series resistance under the test conditions'],2,'It is distinct from capacitance.'),
  q('Can a useful investigation begin with a DMM and later use a scope?',['Yes, because the information needs can change','No, the first instrument must do everything'],0,'Tools can provide complementary evidence.'),
  q('A frequency counter reports a frequency. Has it shown the entire waveform shape?',['Yes','No'],1,'A frequency value is not a time trace.')
 ]),

 workshop(2,3,'Read the digits without overtrusting them','Separate resolution, accuracy and expected behavior, using a virtual meter and decisions about conflicting readings.','8–10',[
  section('Digits describe the display, not certainty','9–10','Resolution is the size of a change that the display can show. Accuracy concerns agreement with the measured quantity under stated conditions. Adding a decimal place improves the detail of the display, but it does not independently improve the instrument’s error.','For an illustrative true value of 5.000 V, a meter with a +0.040 V error can display 5.04 V or 5.040 V. The second display has finer resolution; both show the same underlying error. Use the demonstration to separate those two changes.'),
  section('An expected value needs conditions','9–10','A label such as “5 V” gives you a starting expectation. A meaningful judgment also needs the allowable range and the conditions in which it applies. A small difference from the label can be acceptable, but you should not invent a universal tolerance for every supply.','Our practice specifies 5 V ±5%, which means 4.75–5.25 V. Those bounds belong to this hypothetical case. A reading outside that interval is a reason to examine the setup and device; it is not a unique identification of a failed component.'),
  section('Compare evidence before replacing parts','9–10','If two instruments disagree, first ask whether they used the same reference, mode, range and conditions. Then consider their accuracy specifications and whether the quantity was changing. Picking the reading with more digits skips those questions.','The chapter’s broad buying advice is context, not a price-based guarantee of quality. Here we practice interpreting evidence, without making current shopping recommendations.')
 ],[
  {kind:'simulation',model:'digits',title:'Change resolution and error separately',pages:'9–10',prompt:'Set three decimals and a +0.04 V modeled error. Then select what changed.',fields:[field('digits','Decimal places',[['2','Two'],['3','Three']],'3'),field('error','Modeled error',[['0','0 V'],['0.04','+0.04 V'],['-0.04','−0.04 V']],'0.04'),field('meaning','What does 5.040 V establish?',[['accurate','Error must be zero'],['detail','Finer display detail; the +0.04 V error remains']],'detail')],debrief:'The display changes to 5.040 V while the true model value remains 5.000 V. Extra digits did not remove the error.'},
  scenario('Interpret an example specification','9–10',[
   decision('This case specifies 5 V ±5%. Your display shows 5.12 V. What is supported?',['Within the stated example interval','Definitely failed','Exactly 5.12 V with no uncertainty'],0,'5.12 lies between 4.75 and 5.25 V; the reading still has instrument uncertainty.'),
   decision('Two meters disagree. Which action is useful first?',['Trust whichever has more decimal places','Check reference, settings and measurement conditions','Replace every capacitor'],1,'Comparable conditions are needed before interpreting disagreement.')
  ])
 ],[
  q('What does finer display resolution establish?',['A smaller displayed increment','No instrument error','A healthy circuit'],0,'Resolution and accuracy are different.'),
  q('A 5.000 V true value is displayed as 5.040 V. What happened when a third decimal was enabled?',['The true voltage increased','The +0.040 V error disappeared','The display gave more detail without removing the error'],2,'The model separates resolution from error.'),
  q('What should accompany a nominal voltage in a fault judgment?',['Only the case color','Allowed tolerance and test conditions','The number of knobs'],1,'Nominal values alone are insufficient.'),
  q('Why not always trust the display with more digits?',['Resolution alone does not establish accuracy','All extra digits are false','Analog instruments never have errors'],0,'Use the actual specifications and conditions.'),
  q('An out-of-spec reading identifies exactly which part failed.',['True','False'],1,'It narrows the investigation but does not uniquely identify the cause.'),
  q('Should the example ±5% band be applied to every real supply?',['Yes','No, use the actual specification'],1,'The numerical example is explicitly hypothetical.')
 ]),

 workshop(2,4,'Make sense of a waveform','Explore a voltage-versus-time display, identify what the axes mean and choose whether a number or a trace answers a question.','11–16',[
  section('A waveform is many readings arranged in time','11–12','A scope’s time display places successive moments from left to right and voltage vertically. A flat line represents a level that stays steady during the shown interval. A rise, fall or repeated curve shows changing voltage.','Start by identifying the scales. If the vertical setting is 1 V per division, two divisions from the reference level represent 2 V. If one cycle spans four horizontal divisions at 1 ms per division, the period is 4 ms. Reading the picture without its scales loses the numerical meaning.'),
  section('Change the view, not the signal','11–16','Increasing the vertical display scale spreads or compresses the same voltage on the screen. Changing time per division changes how much time the display window covers. The underlying signal does not have to change when the displayed picture changes.','In our ideal example, a sine wave has a 2 V peak and a 4 ms period. With 1 V/div and 1 ms/div, its peak is two vertical divisions and one cycle spans four horizontal divisions. This prepares you to read a display; detailed real-scope setup belongs to the later use chapter.'),
  section('Look for the feature that answers the question','11–16','A DMM value can be enough for an approximately steady rail. To investigate a brief interruption, waveform shape or the timing of two signals, a suitable scope provides different evidence. A recorded trace still depends on settings, triggering and instrument limits.','The scenario gives you several possible observations. Pick the observation that directly addresses the stated problem, rather than treating a scope as an automatic upgrade for every measurement.')
 ],[
  {kind:'simulation',model:'scope',title:'Frame the example sine wave',pages:'11–12',prompt:'Show the 2 V peak, 4 ms period sine using 1 V/div and 1 ms/div. Then interpret its period.',fields:[field('vdiv','Vertical scale',[['0.5','0.5 V/div'],['1','1 V/div'],['2','2 V/div']],'1'),field('tdiv','Horizontal scale',[['0.5','0.5 ms/div'],['1','1 ms/div'],['2','2 ms/div']],'1'),field('period','One complete cycle is',[['2','2 ms'],['4','4 ms'],['8','8 ms']],'4')],debrief:'The peak is two divisions above zero and the period spans four divisions. Scale changes alter the view, not the source.'},
  inspect('Read the display labels','11–12','Select the statements that would be mistakes when reading this voltage-versus-time display.',[
   {id:'time',label:'Horizontal distance means elapsed time',problem:false,note:'That is the time axis.'},
   {id:'cost',label:'Vertical divisions show equipment cost',problem:true,note:'Vertical position represents voltage.'},
   {id:'scale',label:'A cycle spanning four divisions always lasts four seconds',problem:true,note:'Multiply by the actual time/div setting.'},
   {id:'source',label:'Changing the display scale necessarily changes the source voltage',problem:true,note:'The display setting need not change the signal.'}
  ],'Use the axis labels and settings. A screen distance is not a quantity until the scale is included.'),
  scenario('Select the useful view','11–16',[decision('You need to know whether a rail briefly drops out. Which evidence helps?',['Only a single average-looking number','A suitable captured time trace of the interruption','The price of the scope'],1,'The timing question calls for a time-domain observation.')])
 ],[
  q('What does 1 ms/div describe?',['One millisecond per horizontal division','One milliamp per resistor','One millisecond per volt'],0,'It is a time scale.'),
  q('A cycle spans four divisions at 1 ms/div. Its period is',['1 ms','4 ms','4 V'],1,'4 × 1 ms = 4 ms.'),
  q('A 2 V peak is shown at 1 V/div. Its height from zero is',['One division','Four divisions','Two divisions'],2,'2 V ÷ 1 V/div = 2 divisions.'),
  q('Changing time/div necessarily changes the source frequency.',['True','False'],1,'It changes the displayed interval.'),
  q('Why use a suitable scope for a brief dropout?',['To reveal change over time','To automatically identify the failed part','To remove all grounding concerns'],0,'A time trace provides timing evidence.')
 ]),

 workshop(2,5,'Know what a scope can miss','Investigate sparse sampling, compare capability cards and remember that probes and acquisition settings are part of the measurement.','12–20',[
  section('Samples are evidence from selected moments','13–16','A digital scope acquires samples. If those moments miss important changes, the reconstructed display can be misleading. Aliasing is one example: a rapid signal can appear to vary much more slowly when sampled inadequately.','The demonstration uses a deliberately simplified signal and two sampling rates. The point is not a shopping rule based on one ratio. Real capture depends on bandwidth, sample rate, record length, acquisition mode, signal content and the observation you need.'),
  section('Different capabilities serve different tasks','12–19','An analog instrument displays through its own circuitry; a digital instrument can retain acquired records and often provides measurement tools. Those broad categories do not settle which model is suitable for a particular job.','The author discusses limitations and preferences in the context of equipment available to him. We preserve the useful lesson—check what the instrument can capture—without grading “analog is always better” or “every digital scope misses envelopes” as universal facts. Consult the actual model’s documentation.'),
  section('The probe belongs in the measurement chain','19–20','A scope probe has electrical behavior, attenuation and ratings. A 10× probe attenuates the voltage reaching the input; the scope’s configured factor must match if its displayed measurement is to represent the intended circuit voltage.','For an illustrative 2 V circuit signal, ideal 10× attenuation presents 0.2 V at the scope input. A scope configured for that probe can report 2 V. A mismatched setting can produce a tenfold interpretation error. Grounding, input voltage and probe limits remain separate checks.'),
  section('Grounding is not a shortcut','19–20; manufacturer supplement','A ground-referenced bench scope’s ground connection must not be casually treated like a floating DMM lead. Appropriate differential or isolated measurement equipment and its instructions govern floating measurements. Never remove the scope’s protective earth or isolate its power to defeat that protection.','All displays here are generated training signals. This is an equipment-selection and interpretation workshop, not a procedure for connecting a scope to mains or an open switching power supply.')
 ],[
  {kind:'simulation',model:'alias',title:'Compare dense and sparse samples',pages:'13–16',prompt:'Switch between sampling rates. Select the dense capture and the conclusion supported by the comparison.',fields:[field('sampling','Samples per second',[['90','90 samples/s'],['2000','2,000 samples/s']],'2000'),field('inference','What does the sparse picture mean?',[['slower','The source definitely slowed down'],['capture','The sampled display may misrepresent the same source']],'capture')],debrief:'The source stays at 100 Hz. The sparse sample pattern can suggest a much slower variation. More suitable acquisition is needed; the picture alone is not proof that the source changed.'},
  select('Match the task and capability','12–20','Use the stated capability rather than assuming an instrument category guarantees it.',[
   field('record','Review a captured one-time event',[['storage','Suitable capture and storage'],['color','Any color display']],'storage'),
   field('probe','A 10× probe is attached',[['one','Leave the scope set to 1×'],['ten','Configure the matching 10× factor and verify ratings']],'ten'),
   field('ground','Keep a bench scope’s protective earth',[['keep','Retain it and use an appropriate measurement method'],['remove','Remove it to make any measurement float']],'keep')
  ],'Stored capture and matching attenuation answer specific needs. Protective earth is not an optional display setting.'),
  scenario('Does this specification answer the task?','12–20',[
   decision('A listing names bandwidth but gives no needed one-shot capture information. What next?',['Assume the bandwidth number proves everything','Check the model’s acquisition specifications and manual','Choose whichever case is smaller'],1,'Front-end bandwidth is only part of capture capability.')
  ])
 ],[
  q('What can inadequate sampling do?',['Guarantee the true frequency','Make a signal’s displayed behavior misleading','Eliminate input limits'],1,'Sampling must suit the observation.'),
  q('Is sample rate the same specification as analog bandwidth?',['Yes','No'],1,'They describe different constraints.'),
  q('A 10× probe receives an ideal 2 V signal. What reaches the input before scope compensation?',['0.2 V','20 V','2,000 V'],0,'Ideal attenuation divides by ten.'),
  q('What should match the probe attenuation?',['Bench color','Parts drawer label','The scope’s configured probe factor'],2,'Mismatch can scale the interpretation incorrectly.'),
  q('How should you make a grounded bench scope float?',['Remove protective earth','Use an isolation transformer on its power cord','Do not defeat its protective earth; use suitable approved measurement equipment'],2,'Tektronix explicitly rejects defeating protective grounding.',true),
  q('Does “digital” by itself guarantee suitable capture of your event?',['Yes','No; verify the actual capabilities and settings'],1,'Category names are not complete specifications.'),
  q('If a sparse display looks slow, did the real source necessarily slow?',['No','Yes'],0,'An acquisition artifact can change the apparent shape or frequency.')
 ]),

 workshop(2,6,'Prepare for soldering and removal','Choose equipment by the joint and component, recognize heat-transfer problems and separate preparation from detailed rework technique.','19–24, 39–40',[
  section('Heating the joint takes more than a number','19–22','The tool must transfer enough heat to the joint without unnecessarily heating the surrounding assembly. Tip geometry, contact, thermal recovery, component size and solder alloy all affect that transfer. A large metal connection draws heat away differently from a tiny surface-mounted pad.','Think of two hypothetical jobs: a small board joint and a large connector. One tool or tip may not serve both well. Too little useful heat can lead to prolonged contact and poor wetting; excessive heat or force can damage components and pads. The correct procedure and equipment instructions determine actual settings.'),
  section('Melting point is not a universal iron setting','20–22','Solder alloy affects melting behavior, while a working iron must also transfer heat into the joint. Do not copy a printed melting temperature and treat it as a universal station setpoint. The material, tip, board and process instructions must be considered together.','Keep a suitable stand and maintain the tip as directed. Flux fumes also need effective control; a plume not containing visible lead is not therefore harmless. This companion introduces the preparation decisions rather than assigning physical soldering from a scanned overview.'),
  section('Removal tools solve different access problems','22–24, 39–40','Wick draws molten solder into braid. Suction tools remove molten solder through a nozzle. Hot air and soldering tweezers can heat suitable multiple-lead or two-ended surface-mounted components. Select by access, geometry and the approved process.','A component does not become free simply because one visible joint looks clean. Pulling against a connection that remains attached can lift a pad or break a lead. Inspect the state of the attachment before applying force. Detailed techniques are reserved for the relevant later book sections.'),
  section('Keep materials with their purpose','21–22, 40','Wire solder, solder paste and a low-melting removal alloy are not interchangeable labels for one job. Paste can support an appropriate assembly process; a removal alloy can help an old attachment remain molten long enough for removal. Follow their actual instructions.','A separate tool used for plastic work should not contaminate the soldering tip. The useful habit is to track what a tool has contacted and keep the equipment appropriate to its next task.')
 ],[
  select('Choose by the job','19–24, 39–40','Match a prepared job to equipment that directly supports it.',[
   field('braid','Remove a small amount of accessible molten solder',[['wick','Suitable solder wick'],['glue','Adhesive'],['counter','Frequency counter']],'wick'),
   field('joint','A large heat-absorbing connection',[['tiny','Assume the smallest tip always wins'],['transfer','Assess suitable tip contact and heat delivery']],'transfer'),
   field('plastic','An iron tip was used to melt plastic',[['same','Immediately use that contaminated tip for a fine joint'],['separate','Keep plastic work separate from the soldering tool']],'separate')
  ],'Tool choice follows the joint and process. A small tip is not automatically gentle if it cannot deliver useful heat.'),
  inspect('Inspect preparation, not just appearance','19–24','Select the problems that need correction before a soldering session.',[
   {id:'stand',label:'The hot iron has no stable stand',problem:true,note:'Provide a suitable holder.'},
   {id:'fumes',label:'Flux smoke is directed toward your face',problem:true,note:'Use appropriate fume control.'},
   {id:'force',label:'A lead is being forced while its joint remains attached',problem:true,note:'Do not substitute force for release.'},
   {id:'tip',label:'The tip and process have been selected for this job',problem:false,note:'That is a useful preparation step.'}
  ],'Control the tool, exposure and attachment. A visually tidy setup is not enough if these conditions remain wrong.'),
  sequence('Prepare the equipment before heating','19–24',[
   ['inspect','Inspect the intended joint and surrounding clearance.'],['select','Choose the suitable tool, tip and process instructions.'],['control','Arrange the stand, cord path and appropriate fume controls.'],['start','Begin only when the prepared task and controls are verified.']
  ],['inspect','select','control','start'],'Decide what the work requires before arranging and starting the tool. This sequence is preparation, not a complete soldering procedure.')
 ],[
  q('Why might a very small tip be unsuitable for a large connector?',['It may not transfer useful heat effectively','Small tips are always unsafe','The connector changes frequency'],0,'Joint size and thermal behavior matter.'),
  q('Is solder’s melting point a universal station setpoint?',['Yes','No'],1,'Heat transfer and process conditions matter.'),
  q('What should happen before pulling a component free?',['Verify its attachments are released','Ignore the remaining joints','Pull harder if a pad bends'],0,'Force against an attached joint can cause damage.',true),
  q('Wick and suction primarily remove what?',['The circuit’s schematic','Molten solder','All component faults'],1,'They are solder-removal approaches.'),
  q('Flux fumes are harmless because they are not visible lead.',['True','False'],1,'Rosin-based flux fumes can harm health; effective controls matter.',true),
  q('Where should detailed BGA or SMD rework technique come from?',['An equipment introduction alone','The relevant procedure and equipment/material instructions','A fixed quiz score'],1,'Familiarity is not full procedure training.')
 ]),

 workshop(2,7,'Keep disassembly traceable','Choose fitting hand tools, preserve connector and screw information and inspect whether your documentation is useful.','24–29, 36–37',[
  section('Fit the tool to the part','24–25','Different screws need different driver shapes and sizes. A tool that almost fits can still damage a head, especially when the screw is tiny. Check the engagement rather than assuming force will compensate.','Pliers, hemostats and vises help hold or position parts, but gripping adds its own stresses. Magnification is useful when you need to see the contact rather than guess where the tool is. This chapter introduces those roles; device-specific opening techniques follow later.'),
  section('Record before you disturb the evidence','29, 36','A photo can preserve connector orientation and layer arrangement. It is most useful when taken before the connection changes and when the relevant details are sharp. Assign the same stage label to the image and its hardware container.','Imagine four screw groups from different layers. Saving all the screws is necessary but does not tell you where they belong. A sequence of labeled cups and pictures preserves that relationship. The documentation activity evaluates whether the information survives the next step.'),
  section('Magnification should support the task','25, 36–37','Higher magnification is not always the best working view. You need enough detail while retaining clearance and orientation. A close inspection view and a wider manipulation view can serve different purposes.','Pictures and magnification can expose confusing details, but they do not establish that a connector is safe to pull or that a board is unpowered. Keep observation, documentation and the actual procedure distinct.')
 ],[
  prepSequence(),
  inspect('Which records will fail you later?','24–29, 36','Select every documentation or handling problem.',[
   {id:'blur',label:'The connector orientation is hidden by blur',problem:true,note:'Retake while orientation is still available.'},
   {id:'mixed',label:'Four screw groups are mixed without labels',problem:true,note:'Preserve the removal stage.'},
   {id:'fit',label:'The driver seats correctly in the fastener',problem:false,note:'Fit supports controlled removal.'},
   {id:'after',label:'The first connector picture is taken after all cables are removed',problem:true,note:'Record the original arrangement first.'}
  ],'A record must preserve the needed relationship. Keeping a picture or a screw is not enough when its origin is lost.'),
  scenario('Choose useful magnification','25, 36–37',[decision('Your view shows one pad clearly but hides the surrounding board while you position a tool. What helps?',['Increase magnification indefinitely','Use a wider working view, then zoom in to inspect','Work without seeing the tool'],1,'Inspection detail and working orientation can need different views.')])
 ],[
  q('What should a disassembly photo preserve?',['Only the bench color','Relevant orientation and connections before they change','Only the finished empty case'],1,'Photograph useful relationships.'),
  q('A nearly fitting driver is best corrected by more force.',['True','False'],1,'Choose appropriate engagement.'),
  q('How should parts cups connect to photos?',['Use matching stage labels','Mix everything together','Use unrelated random names'],0,'Matching labels preserve sequence.'),
  q('Why might you reduce magnification while positioning a tool?',['To lose all detail','To see the work area and retain orientation','To alter the board voltage'],1,'A wider working view can be useful.')
 ]),

 workshop(2,8,'Choose supplies without creating a new problem','Use compatibility and purpose to select accessories, cleaning materials, insulation and component storage.','25–29, 40–43',[
  section('Check the accessory when evidence conflicts','27–28','A clip lead is convenient because it creates a temporary connection. Its convenience can also make it easy to overlook an internal break or poor contact. When a connection behaves unexpectedly, examine the lead and its contacts before assuming the board is at fault.','Swabs and other cleaning aids have different properties too. A material useful on one surface may leave fibers or damage another. The right question is what the particular surface and task require, not whether a cleaning supply is generally popular.'),
  section('Compatibility comes before convenience','25–28, 40–41','Cleaning products and adhesives can affect plastics, coatings, optics and nearby components. Check the exact material instructions and the device’s requirements. The author’s successful use of a product is experience, not proof that every formulation is compatible with every display or case.','Adhesives also face mechanical demands. A joint under repeated stress needs a material and repair method suited to that load. A thermal interface serves a different purpose from structural glue, and the part’s specified pad or compound should govern the choice.'),
  section('Plan insulation while the connection is accessible','28','Heat-shrink tubing can provide suitable insulation when its material, size and ratings match the work. In a common splice arrangement, tubing has to be slipped over the wire before completing the connection. Planning that order prevents discovering afterward that it cannot pass over the joint.','This sequencing example is original practice. It is not an instruction to repair mains insulation; the workshop remains a virtual preparation exercise.'),
  section('Store identity with the component','41–43','A useful parts drawer preserves enough information to select a component deliberately. Value, rating and identity are more helpful than “looks close.” Donor boards can be retained for suitable parts, without stripping every component in advance.','A salvaged part still needs identification and condition checks. Organization saves search time; it does not establish compatibility or health. Treat the reference as a reminder of what to verify.')
 ],[
  scenario('Investigate the supply you are using','25–28, 40–43',[
   decision('A test result changes when you move a clip lead. What is a useful next check?',['Inspect the lead and contacts','Declare the device’s processor failed','Trust the first reading only'],0,'The test connection itself can be responsible.'),
   decision('You want to clean a coated plastic display. What establishes suitability?',['The solvent worked on another device','The exact cleaner and surface compatibility instructions','The bottle is small'],1,'Compatibility is material-specific.'),
   decision('A donor-board part looks similar to the failed part. What next?',['Install it on appearance alone','Assume all salvaged parts are good','Verify identity, ratings and condition'],2,'Resemblance does not establish substitution suitability.')
  ]),
  sequence('Remember the tubing before the joint','28',[
   ['joint','Complete the intended low-voltage example connection using its proper procedure.'],['select','Choose compatible tubing of suitable size and rating.'],['slip','Slip the tubing onto an accessible wire before closing the joint.'],['cover','After the connection is checked, position and finish the tubing according to its instructions.']
  ],['select','slip','joint','cover'],'In this common arrangement, the closed joint prevents slipping on tubing afterward. The real material and connection instructions still govern finishing.'),
  {kind:'catalog',title:'Find a supply by purpose',pages:'25–29, 40–43',prompt:'Filter the reference to Supplies or Handling. Compare each item’s purpose and limits.',required:false}
 ],[
  q('An unstable clip lead can affect a diagnosis.',['True','False'],0,'Test accessories are part of the measurement path.'),
  q('What governs cleaner suitability for a display?',['Exact material compatibility','A universal rule that every solvent is safe','The price alone'],0,'Check the surface and product.'),
  q('When may tubing need to be slipped onto a wire?',['Before a joint blocks access','Only after every connection is closed','Never'],0,'Plan the sequence.'),
  q('A salvaged part needs which checks?',['Only its color','Identity, ratings and condition','Only the drawer number'],1,'Storage origin is not a health test.'),
  q('Is a thermal interface compound interchangeable with any glue?',['Yes','No; the purposes and requirements differ'],1,'Follow the intended interface.'),
  q('Can a material’s success on one surface prove compatibility with every coating?',['Yes','No'],1,'Formulations and materials vary.')
 ]),

 workshop(2,9,'Know when specialized equipment earns its place','Compare optional instruments by what they add to a specific task, while keeping advanced repair procedures outside this introduction.','29–47',[
  section('Choose an addition for a recurring need','29–47','The chapter groups equipment into priorities. Those priorities reflect a repair context, not a universal requirement for every learner. A recurring task can make a specialized tool valuable; a tool you cannot yet interpret may add cost without useful evidence.','For example, a logic analyzer helps investigate states and timing on multiple digital lines. A spectrum analyzer shows frequency content. A scope’s ordinary time trace answers another question. Each becomes useful when you know what behavior you expect.'),
  section('A measurement needs a comparison','31–35, 43–45','A frequency counter or inductance meter reports a quantity, but a diagnostic judgment needs an expected value or suitable comparison. The result “some inductance” does not tell you whether an unknown coil is correct for its circuit.','A calibrated or compatible reference can support measurements where accuracy matters. That is a role for specialized references such as the GPS-disciplined oscillator described in the chapter. It does not remove the need to understand the instrument being referenced.'),
  section('Equipment familiarity is a starting point','35–40, 45–47','The chapter introduces microscopes, display separators, hot-air tools and BGA stations. Recognizing their purpose is useful even when you do not need to own or operate them now. Detailed rework depends on the component, assembly and specific procedure.','The BGA overview explicitly does not teach a complete reballing procedure. Keep it as recognition and reference until appropriate procedure material is available. Likewise, an isolation transformer is not interchangeable with a variac, and owning either does not qualify someone for exposed mains work.'),
  section('Look up what the task requires','29–47','A practical reference should let you search by the problem, not only by a tool’s name. “See several digital lines together” leads you toward logic timing; “compare frequency content” leads toward a spectrum view. The activity tests these distinctions.','Current purchase prices and specific product rankings are not taught here. This chapter’s enduring value is matching equipment capabilities to the work and knowing what information is still missing.')
 ],[
  select('Match the specialized view','31–35, 43–47','Choose the capability that directly supports the task.',[
   field('logic','Timing across several digital lines',[['logic','Logic analyzer'],['lcr','LCR meter'],['iron','Soldering station']],'logic'),
   field('spectrum','Signal content distributed by frequency',[['scope','Ordinary voltage-versus-time view'],['spectrum','Spectrum analyzer']],'spectrum'),
   field('coil','Compare coil inductance with a known expected value',[['lcr','Suitable inductance/LCR measurement'],['camera','Camera alone']],'lcr'),
   field('variac','A voltage-adjusting autotransformer is',[['isolation','Always an isolation transformer'],['different','A different function; isolation must not be assumed']],'different')
  ],'Specialized tools answer specialized questions. A capability or name is not a complete procedure or safety guarantee.'),
  scenario('What information is missing?','43–47',[
   decision('An unmarked coil gives an inductance reading, but you have no expected value. Can you certify it correct?',['Yes, any reading means healthy','No; obtain suitable circuit information or a known-good comparison','Yes, if the display is digital'],1,'A value needs a relevant comparison.'),
   decision('You recognize a BGA rework station after this chapter. What is the appropriate next step before performing rework?',['Invent settings from its appearance','Treat this overview as complete training','Study the actual equipment and component procedure'],2,'Recognition is not procedural competence.')
  ]),
  {kind:'catalog',title:'Browse specialized tools without a shopping quota',pages:'29–47',prompt:'Open Specialized cards, then compare them with Measurements. Use the task, not the category, to judge relevance.',required:false}
 ],[
  q('A logic analyzer primarily helps with',['Multiple digital states and timing','The exact color of a resistor','Solder melting'],0,'It is distinct from an analog waveform display.'),
  q('Which view distributes signal content by frequency?',['Parts photo','Spectrum view','Continuity beep'],1,'That is a frequency-domain view.'),
  q('A coil reading without an expected value certifies its suitability.',['True','False'],1,'A relevant comparison is needed.'),
  q('Does a variac automatically provide isolation?',['Yes','No'],1,'Do not confuse the functions.',true),
  q('Why keep an advanced tool in the reference before operating it?',['Recognition can be useful before full procedure training','It proves physical mastery','It forces a purchase'],0,'Reference and operation are different stages.')
 ]),

 workshop(2,10,'Prepare a complete repair session','Combine workspace, documentation and evidence selection for a fictional low-voltage audio device without jumping to unsupported component replacement.','5–47',[
  section('Bring the decisions together','5–47','The fictional device in this case is a small low-voltage audio unit whose sound intermittently disappears. You have its service information and suitable equipment, but no established component fault. The preparation goal is to preserve information and choose evidence that can distinguish possibilities.','Begin with a clear working space and useful documentation. Then identify the information needed: a supply-level question differs from a brief-event question. A suitable first voltage check can be followed by a suitable time trace when the symptom involves timing.'),
  section('A sensible next step follows the evidence','8–20, 27–29','Suppose the first display is near the specified supply voltage. That does not rule out a very short dropout. Suppose moving the clip lead changes the result. Now the test connection deserves examination before blaming the device.','These are different branches of an investigation, not a required order for every real repair. The activity supplies each observation explicitly and asks you to choose a justified next action. It does not pretend to diagnose a real device from a fictional reading.'),
  section('Preserve what the next session will need','24–29, 36','A paused repair should leave you able to reconstruct what happened. Keep photos tied to stage labels, hardware groups traceable and observations distinct from conclusions. “Supply appeared near expected value in this check” is more honest than “all supply components good.”','Your final record here consists of the activity decisions and knowledge checks. Real physical observations would require their own evidence and procedure; no workshop result certifies a hands-on repair.')
 ],[
  select('Prepare the case’s bench','5–8','Arrange the fictional session before choosing tests.',benchFields,'This arrangement preserves access, illumination, stable tool storage and traceable small parts.','bench'),
  prepSequence(),
  scenario('Follow the supplied observations','8–20, 27–29',[
   decision('The service information calls for a steady low-voltage supply check. Start with',['A suitably configured/rated DMM voltage measurement','Current mode directly across the source','An adhesive test'],0,'A steady voltage question calls for a voltage measurement.'),
   decision('The display is near expected, but the symptom is a very brief interruption. What helps next?',['A claim that every part is healthy','A suitable time capture of the relevant rail or signal','A parts replacement based only on age'],1,'The missing information is time behavior.'),
   decision('The reading changes whenever a clip lead moves. What deserves checking?',['Only the processor','Only the speaker color','The lead and contact integrity'],2,'The measurement connection can create misleading evidence.'),
   decision('You pause the repair. Which note best preserves what is known?',['All components are good','The supplied check was near expected; brief behavior and connection integrity still need investigation','The device is fixed because the bench is organized'],1,'Keep observations separate from unsupported conclusions.')
  ])
 ],[
  q('A sensible first test follows',['The information you need and the supplied conditions','A rule to use the largest instrument','A universal one-tool solution'],0,'Choose evidence deliberately.'),
  q('A steady-looking number excludes every brief interruption.',['True','False'],1,'Display behavior can hide short events.'),
  q('What helps preserve connector origin?',['Photos taken before disturbing connections, with stage labels','A single unlabeled final picture','Memory alone'],0,'Keep relationships recoverable.'),
  q('Should a changing clip connection be checked before blaming a board?',['Yes','No'],0,'Accessories are part of the evidence chain.'),
  q('Which statement is an observation?',['Every capacitor is healthy','The supply read near expected in the stated test','The processor is definitely faulty'],1,'A bounded observation is not a global diagnosis.'),
  q('Does completing this virtual preparation certify physical repair skill?',['Yes','No'],1,'Hands-on competency requires separate evidence.',true)
 ])
];

const summaryTakeaways=[
 'Arrange the workspace for visibility, stable access and traceable small parts.',
 'Choose a tool for the information you need; measurements, displays and signal sources serve different roles.',
 'Resolution and accuracy are different; more digits do not remove error.',
 'Interpret a measurement against a real specification and its test conditions.',
 'A waveform needs its voltage and time scales; display settings can change the view without changing the source.',
 'Sampling, bandwidth, acquisition, probes and grounding all constrain a scope measurement.',
 'Select soldering and removal equipment for the joint and process; control heat, force and fumes.',
 'Document connections before disturbing them and keep hardware grouped by stage.',
 'Check accessory integrity and material compatibility before blaming a device or applying a supply.',
 'Advanced tool recognition is useful; it does not replace the relevant repair procedure.'
];
chapter2.push(workshop(2,11,'Chapter 2 summary · A bench built around good decisions','Keep the chapter’s strongest ideas together, then check the decisions that protect a useful repair session.','5–47',[],[],[
 q('What is the best basis for tool selection?',['The missing information in the task','Always the largest instrument','Only its category in a wish list'],0,'Choose the evidence you need.'),
 q('More display digits guarantee greater accuracy.',['True','False'],1,'Resolution does not remove measurement error.'),
 q('Which pair directly supports a waveform reading?',['Case size and cost','Voltage/div and time/div','Drawer count and wire color'],1,'Include both scales.'),
 q('A sparse sampled trace that looks slower proves the source slowed.',['True','False'],1,'Aliasing can misrepresent the same source.'),
 q('A capacitance reading automatically verifies ESR.',['True','False'],1,'They describe different behavior.'),
 q('What preserves disassembly relationships?',['Mixed loose screws','Photos and containers with matching stage labels','A blank notebook'],1,'Record orientation and origin.'),
 q('A lead remains attached during removal. What should you avoid?',['Checking why it remains attached','Forcing the part against the connection','Consulting the procedure'],1,'Force can damage pads and leads.',true),
 q('What establishes a cleaner’s suitability?',['Exact material compatibility and instructions','The author once used a similarly named product','A universal claim that all plastics are alike'],0,'Compatibility is specific.'),
 q('A clip-lead movement changes a reading. What should be investigated?',['The connection and lead integrity','Only the most expensive board component','The price of the bench'],0,'Test accessories can mislead.'),
 q('What should happen to a bench scope’s protective earth?',['Remove it to float the input','Keep it; use an appropriate measurement method','Replace it with a display setting'],1,'Do not defeat protective grounding.',true),
 q('What does recognizing a BGA station establish?',['Familiarity with its role','A complete reballing procedure','Physical repair mastery'],0,'Recognition and procedural training differ.'),
 q('A virtual workshop can record understanding but cannot certify physical repair skill.',['True','False'],0,'The learning record must honestly describe its evidence.')
],{workshop:false,chapterSummary:true,kind:'summary',coveredLessonIds:chapter2.map(l=>l.id),html:'<ul class="chapter-takeaways">'+summaryTakeaways.map(t=>'<li>'+esc(t)+'</li>').join('') }));

const chapter6=[
 workshop(6,3,'AC readings · Understand the waveform behind RMS','Compare sine and square waves, interpret RMS as a heating-equivalent measure and use actual meter specifications to judge an AC reading.','99–100',[
  section('RMS is a useful equivalent, not the largest swing','99–100','An alternating voltage changes through a cycle. RMS describes the DC voltage that would give the same average heating in an ideal resistor. It is not the peak and it is not the full positive-to-negative swing.','For an ideal zero-centered sine wave with a 2 V peak, peak-to-peak is 4 V and RMS is 2/√2, about 1.414 V. In a 1 kΩ resistor, average power is 1.414²/1,000, about 0.002 W or 2 mW. The example stays entirely virtual.'),
  section('Waveform shape changes the conversion','99–100','The sine-wave factor follows that waveform’s shape. An ideal symmetric square wave that spends equal time at +2 V and −2 V has 2 V RMS, because the magnitude stays at 2 V. Its peak-to-peak value is still 4 V.','Do not apply the sine factor to every waveform. The chapter highlights limitations of sine-calibrated meters; modern true-RMS models can handle supported nonsinusoidal waveforms within their specified limits. “True RMS” still does not imply unlimited bandwidth, amplitude or crest factor.'),
  section('Ask whether the meter supports this signal','99–100','An AC reading must be interpreted using the actual meter’s frequency range, measurement method, input limits and conditions. A meter suitable for one slow sine signal is not thereby suitable for every audio or switching waveform.','Our mock specification card is deliberately explicit. It is an invented training instrument, not a real model recommendation. When its stated conditions do not cover the signal, the right conclusion is that the displayed number alone is insufficient.'),
  section('Keep timing and magnitude questions distinct','97–100','A DMM can provide a suitable magnitude reading. A scope can help investigate shape and timing. The two observations may complement each other, while each has its own constraints.','You can open the older Reading a Digital Multimeter and DC Voltage lessons in this chapter for the display and reference-point foundations. This workshop adds AC interpretation without replacing their saved answers.')
 ],[
  {kind:'simulation',model:'rms',title:'Compare waveforms with the same peak',pages:'99–100',prompt:'Switch waveform shape and observe peak, peak-to-peak and RMS. Finish with square selected and the appropriate RMS interpretation.',fields:[field('wave','Waveform',[['sine','Sine'],['square','Symmetric square']],'square'),field('rms','Square wave at ±2 V has RMS',[['1.414','1.414 V'],['2','2 V'],['4','4 V']],'2')],debrief:'The square wave’s magnitude stays 2 V, so its RMS is 2 V. The sine spends less time near its peaks and has about 1.414 V RMS. Both have 4 V peak-to-peak.'},
  scenario('Read the mock meter specification','99–100',[
   decision('Training meter A specifies sine-calibrated AC over 40–400 Hz. Your test signal is a 100 Hz sine within its input limit. What is supported?',['Its stated conditions cover this example','All future waveforms are covered','Its protective ratings no longer matter'],0,'Use the stated conditions, not a universal AC rule.'),
   decision('Now the signal is a 20 kHz square wave. What is justified?',['Trust the same number without checking','The mock specification does not establish a valid reading for this signal','Apply the sine factor to any waveform'],1,'Both frequency and waveform fall outside the stated example conditions.')
  ]),
  select('Match the quantity to its meaning','99–100','Use the ideal sine example to separate three quantities.',[
   field('peak','Largest positive level',[['2','2 V'],['4','4 V'],['1.414','1.414 V']],'2'),
   field('swing','Full positive-to-negative swing',[['2','2 V'],['4','4 V'],['1.414','1.414 V']],'4'),
   field('heat','DC heating-equivalent voltage',[['2','2 V'],['4','4 V'],['1.414','About 1.414 V']],'1.414')
  ],'Peak, peak-to-peak and RMS describe different aspects of the same ideal sine.')
 ],[
  q('An ideal sine has a 2 V peak. Its peak-to-peak value is',['1 V','4 V','2 V'],1,'The span is from −2 V to +2 V.'),
  q('The same sine’s RMS is approximately',['1.414 V','4 V','2.828 V'],0,'2/√2 ≈ 1.414 V.'),
  q('An ideal symmetric square at ±2 V has RMS',['1.414 V','4 V','2 V'],2,'The squared magnitude remains 4 V².'),
  q('Should a sine-calibrated AC meter be trusted on every waveform?',['Yes','No; check waveform and instrument limits'],1,'The calibration method and specified conditions matter.'),
  q('Does true-RMS labeling remove frequency and input limitations?',['Yes','No'],1,'Use the actual specifications.'),
  q('RMS describes an equivalent for what load in this explanation?',['An ideal resistor’s average heating','Any mechanical load regardless of circuit','The display’s color'],0,'The definition here uses resistive heating.'),
  q('Which instrument view helps investigate shape and timing?',['A suitable scope time trace','Only a capacitance number','A screw container'],0,'Timing and shape are time-domain information.')
 ]),

 workshop(6,4,'Unpowered tests · Resistance, continuity and diodes','Prepare an unpowered test, recognize alternate paths and interpret resistance, beeps and two-direction diode evidence.','100–103',[
  section('The meter supplies the test signal','100–101','Resistance, continuity and diode functions apply a small test signal. External circuit power or stored energy can invalidate the result and damage the instrument. Preparation means disconnecting the source and addressing stored energy using the appropriate verified procedure before these functions are used.','The simulated preparation has three separate states: external power, stored energy and component isolation. Turning a switch off is not the same as establishing that the test points are free of applied voltage. Nothing here asks you to discharge a real unknown capacitor.'),
  section('The display can include other paths','100–101','If a resistor remains connected to a network, the meter’s test current can travel through surrounding components. The measured network resistance can therefore differ from the individual component’s value.','In the ideal example, two 100 Ω resistors are parallel. Their equivalent is 1/(1/100 + 1/100) = 50 Ω. A meter across one still-connected resistor sees the network. Isolating the intended component by an appropriate procedure can remove that alternate path; our virtual switch simply models the distinction.'),
  section('A beep is a threshold result','101','Continuity indicates a sufficiently low-resistance path for the particular meter’s threshold. It is useful for investigating a wire, switch or connector, but it does not report exact resistance or guarantee that a whole component is healthy.','An alternate path can produce a beep even when the intended path is open. Before interpreting it as proof that a particular switch is closed, consider how the meter’s test current could travel through the rest of the circuit.'),
  section('Test a diode in both directions','102–103','Diode mode generally reports a forward junction voltage rather than ohms. A suitable isolated silicon diode can show a plausible forward drop in one direction and an open indication in the reverse direction. A very low result both ways suggests a short; open indications both ways suggest an open under the test conditions.','Our generic display uses OL for open. The source describes another meter’s indication; neither OL nor a particular numeric value is universal. Check the actual manual, test voltage, diode type and surrounding paths. A two-direction result supports a diagnosis under those conditions, not every operating behavior.')
 ],[
  {kind:'simulation',model:'resistance',title:'Separate a component from its alternate path',pages:'100–101',prompt:'Compare connected and isolated readings. Finish with external power off, stored energy addressed and the intended resistor isolated.',fields:[field('power','External source',[['on','Applied'],['off','Disconnected']],'off'),field('energy','Stored energy',[['unknown','Not verified'],['clear','Addressed and verified for this virtual test']],'clear'),field('isolate','Second 100 Ω path',[['connected','Connected in parallel'],['isolated','Removed from the measurement']],'isolated')],debrief:'The connected ideal network reads 50 Ω; the isolated intended resistor reads 100 Ω. The safe preparation states are required before interpreting either result.'},
  inspect('What can the beep fail to prove?','101','Select the claims that go beyond a continuity beep.',[
   {id:'exact',label:'The resistance is exactly 0.000 Ω',problem:true,note:'A beep is threshold-based.'},
   {id:'switch',label:'The intended switch must be closed even if a parallel path exists',problem:true,note:'Another path can carry test current.'},
   {id:'low',label:'The meter found a path within its beep threshold',problem:false,note:'That is the bounded conclusion.'},
   {id:'healthy',label:'Every function of the component is healthy',problem:true,note:'One low-resistance path is not a complete component test.'}
  ],'A continuity result answers a bounded path question. Exact resistance, intended-path identity and complete health require more evidence.'),
  {kind:'simulation',model:'diode',title:'Compare both diode directions',pages:'102–103',prompt:'Explore the examples. Finish with the shorted model and the interpretation supported by both directions.',fields:[field('condition','Isolated diode model',[['good','Silicon junction'],['short','Shorted'],['open','Open']],'short'),field('conclusion','Near-zero both directions suggests',[['short','A short under these test conditions'],['good','Guaranteed healthy'],['frequency','A frequency measurement']],'short')],debrief:'The shorted model displays nearly zero both ways. The ordinary silicon model is 0.65 V forward and OL reverse; the open model is OL both ways. These are illustrative, not universal instrument readouts.'},
  scenario('Decide whether the test is ready','100–103',[decision('Power is disconnected, but stored energy at the test area is unverified. Start ohms now?',['Yes; the switch position is enough','No; establish the appropriate unpowered/stored-energy conditions first'],1,'Disconnection alone does not address all stored energy.')])
 ],[
  q('Resistance and continuity testing require',['The source to stay energized','Appropriate power disconnection and stored-energy verification','Current mode across the source'],1,'The meter supplies the test signal.',true),
  q('Two ideal 100 Ω parallel paths read',['50 Ω','100 Ω','200 Ω'],0,'Their equivalent is 50 Ω.'),
  q('An in-circuit reading can include alternate paths.',['True','False'],0,'The surrounding network matters.'),
  q('A continuity beep establishes',['Exact zero resistance','A path meeting that meter’s threshold','All component functions are good'],1,'Interpret the threshold indication.'),
  q('Diode mode generally reports',['The case temperature','Approximate junction voltage under its test conditions','The resistor’s tolerance color'],1,'It is not an ohms reading.'),
  q('Near-zero isolated diode readings both directions suggest',['A short under the test conditions','A guaranteed healthy diode','Normal reverse blocking'],0,'Check both directions.'),
  q('Is OL the universal open indication on every DMM?',['Yes','No; consult the actual manual'],1,'Displays vary.'),
  q('An open switch can be masked by another low-resistance path.',['True','False'],0,'The beep may describe the alternate path.')
 ]),

 workshop(6,5,'Current measurements · Put the meter in the path','Configure a virtual series current measurement, compare it with voltage placement and explore how meter resistance can affect the circuit.','101–102',[
  section('Current must pass through the meter','101–102','Voltage compares two points. Current measurement places the meter in the path so the measured current passes through it. That difference changes both the connection and the meaning of the result.','In the ideal example, a 5 V source and a 1 kΩ load produce 5/1,000 = 0.005 A, or 5 mA. To measure that branch current, the prepared connection inserts an appropriately configured meter in series. Current mode across the source would instead create an unintended low-resistance path.'),
  section('Prepare the jack, range and connection together','101–102','De-energize before changing the connection. Estimate the required current and check the actual meter’s input, fuse and range limits. The dial setting does not make an unsuitable jack or exceeded fuse rating acceptable.','Our generic trainer has a COM return and separate voltage and fused-current choices. Actual labels, fusing and permitted durations vary. The activity checks the combination: source disconnected, DC current, suitable fused current input and series placement. It will not energize an unsafe arrangement.'),
  section('The instrument can change the measurement','102','A current range uses a shunt resistance to develop a measurable voltage. That resistance introduces a voltage drop, called burden voltage, into the circuit being tested. Some ranges can affect a small or sensitive load noticeably.','In the simple model, 0 Ω meter resistance gives 5 mA through a 1 kΩ load. Adding 100 Ω in series changes the current to 5/(1,000 + 100), about 4.545 mA. The meter drop is then 0.004545 × 100, about 0.455 V. These large illustrative values make the effect visible; they are not a real meter specification.'),
  section('Choose current only when its evidence is useful','101–102','Breaking a path to insert a meter is more invasive than a suitable voltage observation. Decide whether current is the quantity you need before disturbing the circuit. A zero result could reflect an open, an unpowered branch, an input/fuse issue or another setup problem.','Restore the intended lead and function configuration after the task, using the actual procedure. Keeping a lead in a current input can create trouble during a later voltage check. The final preparation sequence makes that transition explicit.')
 ],[
  {kind:'simulation',model:'current',title:'Configure the current measurement before power',pages:'101–102',prompt:'Prepare the generic 5 V/1 kΩ model with power disconnected, DC current, fused current input and series placement.',fields:[field('power','Virtual source',[['on','Applied'],['off','Disconnected']],'off'),field('mode','Function',[['voltage','DC voltage'],['current','DC current']],'current'),field('jack','Red lead input',[['volts','VΩ input'],['current','Suitable fused current input']],'current'),field('connection','Meter connection',[['across','Across the source'],['series','In series with the load']],'series')],debrief:'The prepared combination measures the path current. A current-mode source bridge is blocked rather than energized. Real input and fuse limits must be verified separately.'},
  {kind:'simulation',model:'burden',title:'See how shunt resistance changes the circuit',pages:'102',prompt:'Compare ideal and illustrative 100 Ω meter resistance. Finish with 100 Ω and identify the current change.',fields:[field('shunt','Meter resistance',[['0','Ideal 0 Ω'],['100','Illustrative 100 Ω']],'100'),field('effect','Compared with ideal current',[['same','Exactly unchanged'],['less','It decreases because total series resistance rises'],['more','It increases']],'less')],debrief:'The ideal 5 mA becomes about 4.545 mA. The meter itself introduced an approximately 0.455 V drop in this simplified circuit.'},
  sequence('Prepare, measure, then restore','101–102',[
   ['insert','With power disconnected, configure the rated input/range and insert the meter in series.'],['off','Disconnect the source before changing the circuit.'],['verify','Verify the connection and ratings, then make the measurement only under the proper procedure.'],['restore','Disconnect power again, remove the meter and restore the circuit and lead configuration.']
  ],['off','insert','verify','restore'],'Connection changes happen unpowered. Verification precedes measurement; restoration prevents carrying a current-input setup into the next voltage task.'),
  scenario('Investigate an unexpected zero','101–102',[decision('The circuit worked before insertion but now reads zero. What is justified?',['The load is definitely good','The battery is definitely dead','Check the connection, input/range, fuse and circuit conditions'],2,'Zero current is evidence to investigate; it does not uniquely identify a fault.')])
 ],[
  q('Where does a current-mode meter go?',['In the current path, in series','Directly across the source','Only across an unconnected case'],0,'The branch current passes through the meter.',true),
  q('What is wrong with current mode across a source?',['It may create an unintended low-resistance path','It gives more voltage resolution','Nothing if the display is digital'],0,'Prevent that arrangement.',true),
  q('When should the measurement connection be changed?',['While the source is applied','With the source disconnected under the proper procedure'],1,'Prepare before energizing.',true),
  q('5 V across ideal 1 kΩ produces',['5 A','5 mA','500 mA'],1,'5/1,000 A = 0.005 A.'),
  q('What is burden voltage?',['A display color','The voltage drop introduced by the current-measuring resistance','The power supply’s maximum frequency'],1,'The shunt can affect circuit behavior.'),
  q('Adding illustrative 100 Ω meter resistance to 1 kΩ makes current',['Lower than ideal 5 mA','Higher than ideal 5 mA','Exactly 5 A'],0,'5/1,100 A ≈ 4.545 mA.'),
  q('Does selecting a current range make every input jack suitable?',['Yes','No; input, fuse and rating still matter'],1,'The whole configuration matters.',true),
  q('An unexpected zero identifies one unique fault.',['True','False'],1,'Check setup and conditions.'),
  q('Why restore lead configuration after measuring current?',['To avoid carrying a current input into a later voltage task','To change the battery chemistry','To erase saved progress'],0,'Restoration is part of preparation for the next task.',true)
 ])
];

export const geierWorkshops=[...chapter2,...chapter6];
export const workshopReferences=[
 {title:'Tektronix · floating measurements and protective grounding',url:'https://www.tek.com/en/documents/technical-brief/floating-oscilloscope-measurements-and-operator-protection'},
 {title:'Tektronix · identifying aliasing',url:'https://www.tek.com/en/support/faqs/what-aliasing-and-how-do-i-detect-it-and-fix-it-my-oscilloscope'},
 {title:'Fluke · true-RMS measurement',url:'https://www.fluke.com/en-us/learn/blog/electrical/what-is-true-rms'},
 {title:'Fluke 187/189 · instrument-specific safety and measurement instructions',url:'https://assets.fluke.com/manuals/187_189_cmeng0000.pdf'},
 {title:'HSE · rosin-based solder flux fume',url:'https://www.hse.gov.uk/asthma/solderers.htm'},
 {title:'Hakko · soldering temperature and tip condition',url:'https://www.hakko.com/english/support/maintenance/detail.php?seq=103'}
];
