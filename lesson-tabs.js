// Teaching-view presentation helpers. Does not mutate saved lesson answers.
export const lessonTabs=[
  {id:"overview",label:"Overview",symbol:"✦"},
  {id:"learn",label:"Learn",symbol:"◇"},
  {id:"interact",label:"Interact",symbol:"⌁"},
  {id:"quiz",label:"Quiz",symbol:"✓"},
  {id:"review",label:"Review",symbol:"↺"}
];
const escapeHtml = x => String(x ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const widgetPattern=/<div class="lab-widget" data-lab-kind="([^"]+)">[\s\S]*?<\/div>/g;
export function learningContent(lesson) {
  // Remove only the authored interactive placeholders; section explanations remain.
  return lesson.experiment==="embedded"
    ? lesson.html.replace(widgetPattern, '<div class="lesson-practice-hint"><span>✧</span> Practice this in the <button data-lesson-tab="interact" type="button">Interact tab →</button></div>')
    : lesson.html;
}
// For source-backed EIM lessons, the Learn tab itself is also broken into
// bite-sized concept cards instead of five sections in one scrolling document.
export function renderLearnSteps(lesson,step=0){
 const html=learningContent(lesson);
 if(!["embedded","generated"].includes(lesson.experiment))return html;
 const pieces=html.split(/(?=<h3>)/);
 const intro=pieces.shift()||"";
 if(!pieces.length)return html;
 const current=Math.min(Math.max(0,step),pieces.length-1);
 const headings=pieces.map((part,i)=>part.match(/<h3>([\s\S]*?)<\/h3>/)?.[1]?.replace(/<[^>]+>/g,"")||"Concept "+(i+1));
 return '<div class="learning-concept"><div class="activity-step-top"><span class="v2-kicker">CONCEPT '+(current+1)+' OF '+pieces.length+'</span><span class="activity-caption">Small steps, lasting understanding</span></div>'+
 (current===0?'<div class="learning-intro">'+intro+'</div>':'')+
 '<div class="learning-concept-steps" role="group" aria-label="Choose a lesson concept">'+
 headings.map((head,i)=>'<button class="concept-step'+(current===i?' selected':'')+'" data-learn-index="'+i+'" aria-current="'+(current===i?'step':'false')+'" aria-label="'+escapeHtml(head)+'">'+(i+1)+'</button>').join('')+'</div>'+
 '<div class="learning-concept-reading">'+pieces[current]+'</div>'+
 '<div class="activity-nav"><button class="outline small-button" '+(current===0?'disabled':'data-learn-index="'+(current-1)+'"')+'>← Previous idea</button>'+
 '<span class="muted sm">'+(current+1)+' / '+pieces.length+'</span>'+
 '<button class="primary small-button" '+(current===pieces.length-1?'data-lesson-tab="interact"':'data-learn-index="'+(current+1)+'"')+'>'+(current===pieces.length-1?'Try the activities →':'Next idea →')+'</button></div></div>';
}

export function lessonActivities(lesson) {
  if (lesson.experiment==="generated") {
    const checks=(lesson.activities||[]).map((a,i)=>({
      kind:"generated-check",title:a.title||"Prediction "+(i+1),description:"Make a prediction, explain your reasoning, then compare it with the approved reference.",
      prompt:a.prompt,answer:a.answer,explanation:a.explanation,source_ids:a.source_ids||[]
    }));
    if(lesson.simulator)checks.push({kind:"generated-simulation",title:"Adjust the virtual experiment",description:"Change an ideal circuit value and predict how the result responds.",simulator:lesson.simulator});
    return checks;
  }
  if (lesson.experiment!=="embedded") return [{kind:"legacy",title:"Circuit workbench",description:"Adjust the circuit, predict the result, then compare your answer with the calculated values."}];
  const headings=[...lesson.html.matchAll(/<h3>([\s\S]*?)<\/h3>/g)].map(m=>m[1].replace(/<[^>]+>/g,"").replace(/^\d+\.\s*/,""));
  const placeholders=[...lesson.html.matchAll(widgetPattern)].map(m=>m[1]);
  return placeholders.map((kind,i)=>({kind,title:headings[i]||"Circuit challenge "+(i+1),description:activityDescriptions[kind]||"Change a value and observe what the circuit does."}));
}
const activityDescriptions={
  "math-prefix-current":"Convert a simulated current to amperes while checking the factor of 1,000.",
  "math-prefix-capacitance":"Convert microfarads to farads with the correct power-of-ten scale.",
  "math-ohm-current":"Predict how ideal current changes when source voltage changes at fixed resistance.",
  "math-ohm-voltage":"Use V = IR and correct SI units to predict a voltage drop.",
  "math-series":"Add three resistor values in one current path.",
  "math-divider":"Find a resistor's proportion of the total series voltage.",
  "math-parallel":"Add current contributions from parallel branches.",
  "math-tolerance":"Translate an illustrative percentage tolerance into lower and upper limits.",
  "math-error":"Calculate percentage error relative to a known reference.",
  "math-power":"Watch volts and amperes combine into watts.",
  "math-energy":"Change operating time and observe accumulated joules.",
  "math-period":"Explore how increasing frequency makes each signal cycle shorter.",
  "math-cutoff":"Explore how capacitance changes an ideal RC filter's cutoff frequency.",
  tolerance:"Find the resistor tolerance limits and decide whether an actual meter reading is acceptable.",
  bands:"Decode the resistor's colored bands to predict its nominal resistance.",
  rating:"Explore how dissipated power increases with applied voltage. This is a virtual circuit, not a physical hookup instruction.",
  breadboard:"Select two breadboard holes and discover whether the hidden strip connects them.",
  meter:"Choose meter mode, lead position and power state. The circuit display will flag dangerous arrangements.",
  series:"Change the value of one resistor, then predict the current through the single series path.",
  divider:"Explore how three series voltage drops divide a fixed 5 V.",
  parallel3:"Change one parallel branch while the source remains at 5 V.",
  fault:"Open and close a parallel branch to diagnose the change in total current.",
  "dmm-signal":"Compare steady DC voltage and short events on a time trace versus a numerical display.",
  "dmm-tolerance":"Move a measured voltage across an example tolerance band; decide what it does and does not prove.",
  "dmm-digits":"Vary the decimal precision and meter error independently to separate resolution from accuracy.",
  "dmm-noise":"Change a small simulated ripple; discover why changing digits alone do not reveal its cause.",
  "dmm-choice":"Choose what kind of evidence to seek for a stable rail or a hidden brief dropout.",
  "dmm-probes":"Swap two simulated voltage probes and watch red-minus-black polarity change.",
  "dmm-reference":"Choose a verified common point rather than assuming metal parts share ground.",
  "dmm-fault":"Locate an open switch by comparing upstream and downstream DC voltage readings.",
  "dmm-range":"Choose voltage mode and a sufficient range for a known-safe modeled 5 V circuit.",
  "dmm-dropout":"See a brief voltage interruption on a time trace that may not appear in a DMM snapshot.",
  "ceta-ladder":"See which factor kilo, milli, micro and mega apply without changing the base electrical unit.",
  "ceta-powers":"Move through powers of ten, predicting the decimal equivalent before revealing it.",
  "ceta-notation":"Express one electronics number in scientific notation and in prefixed units.",
  "ceta-convert":"Convert common current, resistance, capacitance and frequency labels to base SI units.",
  "ceta-sanity":"Use current and resistance to diagnose a thousandfold prefix error in a virtual low-voltage circuit."
};
export function renderLessonTabs(active,answersCount,questionCount) {
  return '<nav class="lesson-tabs" role="tablist" aria-label="Lesson sections">'+lessonTabs.map(t=>
    '<button class="lesson-tab'+(t.id===active?' selected':'')+'" type="button" role="tab" id="lesson-tab-'+t.id+'" aria-controls="lesson-panel" aria-selected="'+String(t.id===active)+'" tabindex="'+(t.id===active?'0':'-1')+'" data-lesson-tab="'+t.id+'"><span aria-hidden="true">'+t.symbol+'</span>'+t.label+(t.id==="quiz"?'<small>'+answersCount+'/'+questionCount+'</small>':'')+'</button>'
  ).join('')+'</nav>';
}
export function renderActivitySelector(lesson,selected=0) {
  const activities=lessonActivities(lesson);
  const selectedIndex=Math.min(Math.max(0,selected),activities.length-1);
  const current=activities[selectedIndex];
  return '<div class="activity-shell"><div class="activity-step-top"><span class="v2-kicker">SIMULATION '+(selectedIndex+1)+' / '+activities.length+'</span><span class="activity-caption">Try · Observe · Explain</span></div>'+
  '<div class="activity-steps" role="group" aria-label="Choose an activity">'+activities.map((a,i)=>
    '<button type="button" class="activity-step'+(i===selectedIndex?' selected':'')+'" data-activity-index="'+i+'" aria-current="'+(i===selectedIndex?'step':'false')+'" title="'+escapeHtml(a.title)+'">'+(i+1)+'</button>').join('')+'</div>'+
  '<h3>'+escapeHtml(current.title)+'</h3><p class="muted">'+escapeHtml(current.description)+'</p>'+
  (current.kind==="generated-simulation"?'<div data-generated-simulator="'+escapeHtml(current.simulator)+'"><p class="muted sm">Loading virtual experiment…</p></div>':
  current.kind==="generated-check"?'<section class="generated-activity-check"><p><strong>Predict before checking:</strong> '+escapeHtml(current.prompt)+'</p>'+
    '<label class="question-meta">YOUR PREDICTION<textarea class="short-answer" aria-label="Your prediction" placeholder="Write what you expect and why, then check the reference."></textarea></label>'+
    '<button type="button" class="primary small-button" data-generated-reveal>Compare with the approved explanation</button>'+
    '<div class="feedback" data-generated-feedback hidden><p><b>Expected result:</b> '+escapeHtml(current.answer)+'</p><p><b>Reasoning:</b> '+escapeHtml(current.explanation)+'</p>'+
    '<p class="muted sm">This is an ungraded prediction. The Quiz tab saves your scored self-checks.</p></div></section>':
  current.kind==="legacy"?'<section id="experiment" class="experiment"><h3>Interactive circuit lab</h3><p class="muted sm" id="experiment-caption">Make a prediction, adjust a value, and test what happens.</p><div id="experiment-body"></div></section>':
    '<div class="lab-widget" data-lab-kind="'+escapeHtml(current.kind)+'"><p class="muted sm">Loading interactive experiment…</p></div>')+
  '<div class="activity-nav"><button class="outline small-button" type="button" data-activity-index="'+Math.max(0,selectedIndex-1)+'" '+(selectedIndex===0?'disabled':'')+'>← Previous</button><span class="muted sm">'+(selectedIndex+1)+' of '+activities.length+'</span><button class="primary small-button" type="button" '+(selectedIndex===activities.length-1?'data-lesson-tab="quiz"':'data-activity-index="'+(selectedIndex+1)+'"')+'>'+(selectedIndex===activities.length-1?'Ready for the quiz →':'Next challenge →')+'</button></div></div>';
}
