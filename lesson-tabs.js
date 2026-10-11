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
export function lessonActivities(lesson) {
  if (lesson.experiment!=="embedded") return [{kind:"legacy",title:"Circuit workbench",description:"Adjust the circuit, predict the result, then compare your answer with the calculated values."}];
  const headings=[...lesson.html.matchAll(/<h3>([\s\S]*?)<\/h3>/g)].map(m=>m[1].replace(/<[^>]+>/g,"").replace(/^\d+\.\s*/,""));
  const placeholders=[...lesson.html.matchAll(widgetPattern)].map(m=>m[1]);
  return placeholders.map((kind,i)=>({kind,title:headings[i]||"Circuit challenge "+(i+1),description:activityDescriptions[kind]||"Change a value and observe what the circuit does."}));
}
const activityDescriptions={
  tolerance:"Find the resistor tolerance limits and decide whether an actual meter reading is acceptable.",
  bands:"Decode the resistor's colored bands to predict its nominal resistance.",
  rating:"Explore how dissipated power increases with applied voltage. This is a virtual circuit, not a physical hookup instruction.",
  breadboard:"Select two breadboard holes and discover whether the hidden strip connects them.",
  meter:"Choose meter mode, lead position and power state. The circuit display will flag dangerous arrangements.",
  series:"Change the value of one resistor, then predict the current through the single series path.",
  divider:"Explore how three series voltage drops divide a fixed 5 V.",
  parallel3:"Change one parallel branch while the source remains at 5 V.",
  fault:"Open and close a parallel branch to diagnose the change in total current."
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
  (current.kind==="legacy"?'<section id="experiment" class="experiment"><h3>Interactive circuit lab</h3><p class="muted sm" id="experiment-caption">Make a prediction, adjust a value, and test what happens.</p><div id="experiment-body"></div></section>':
    '<div class="lab-widget" data-lab-kind="'+escapeHtml(current.kind)+'"><p class="muted sm">Loading interactive experiment…</p></div>')+
  '<div class="activity-nav"><button class="outline small-button" type="button" data-activity-index="'+Math.max(0,selectedIndex-1)+'" '+(selectedIndex===0?'disabled':'')+'>← Previous</button><span class="muted sm">'+(selectedIndex+1)+' of '+activities.length+'</span><button class="primary small-button" type="button" '+(selectedIndex===activities.length-1?'data-lesson-tab="quiz"':'data-activity-index="'+(selectedIndex+1)+'"')+'>'+(selectedIndex===activities.length-1?'Ready for the quiz →':'Next challenge →')+'</button></div></div>';
}
