// Reviewed, local widget implementations. Authored data selects a renderer; no eval, generated code or provider calls.
import {toolCards,workshopReferences} from './geier-workshops.js';
export const workshopMethods=['bench','inspect','match','sequence','scenario','simulation','catalog'];
const e=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const selected=(value,expected)=>String(value)===String(expected)?' selected':'';
function controls(a,value={}){
 return '<div class="workshop-controls">'+(a.fields||[]).map(f=>'<label class="lab-control">'+e(f.label)+'<select data-workshop-field="'+e(f.id)+'"><option value="">Choose…</option>'+f.options.map(([id,label])=>'<option value="'+e(id)+'"'+selected(value.fields?.[f.id],id)+'>'+e(label)+'</option>').join('')+'</select></label>').join('')+'</div>';
}
function readingSVG(body,label){return '<svg class="workshop-visual" viewBox="0 0 640 260" role="img" aria-label="'+e(label)+'"><rect x="1" y="1" width="638" height="258" rx="18" fill="#12384f" stroke="#49728a"/>'+body+'</svg>';}
export function plotWave(fn,xMax,voltsDiv=1,timeDiv=xMax/10,samples=null,{timeLabel}={}){
 const x=v=>40+v/xMax*560,y=v=>125-v/voltsDiv*38;
 const grid=Array.from({length:11},(_,i)=>'<path d="M'+(40+i*56)+' 25 V225" stroke="#34586c"/>').join('')+Array.from({length:5},(_,i)=>'<path d="M40 '+(49+i*38)+' H600" stroke="#34586c"/>').join('');
 const count=samples||300,points=Array.from({length:count+1},(_,i)=>{const t=xMax*i/count;return x(t).toFixed(2)+','+y(fn(t)).toFixed(2);}).join(' ');
 const dots=samples?Array.from({length:count+1},(_,i)=>{const t=xMax*i/count;return '<circle cx="'+x(t).toFixed(2)+'" cy="'+y(fn(t)).toFixed(2)+'" r="4" fill="#ffe47b"/>';}).join(''):'';
 return readingSVG('<defs><clipPath id="workshop-trace-clip"><rect x="40" y="25" width="560" height="200"/></clipPath></defs>'+grid+'<path d="M40 125 H600" stroke="#93b8c9"/><g clip-path="url(#workshop-trace-clip)"><polyline points="'+points+'" fill="none" stroke="#8ceafa" stroke-width="3"/>'+dots+'</g><text x="12" y="130" fill="#d8f5fc" font-size="13">0 V</text><text x="40" y="247" fill="#d8f5fc" font-size="14">'+e(voltsDiv)+' V/div</text><text x="250" y="247" fill="#d8f5fc" font-size="14">'+e((timeDiv*1000).toFixed(2))+' ms/div · time →</text>','Virtual voltage plotted against time');
}
function meterDisplay(value,caption){
 return readingSVG('<rect x="188" y="32" width="264" height="190" rx="22" fill="#2c7189" stroke="#96d7ea"/><rect x="210" y="51" width="220" height="74" rx="9" fill="#092a3e"/><text x="320" y="100" fill="#b8f9f4" font-size="29" text-anchor="middle">'+e(value)+'</text><circle cx="320" cy="169" r="26" fill="#abcbd9"/><path d="M320 169 l14 -17" stroke="#1a4055" stroke-width="7"/><text x="320" y="243" fill="#d8f5fc" font-size="14" text-anchor="middle">'+e(caption)+'</text>',caption);
}
export function simulationReading(model,f={}){
 if(model==='voltage'){
  if(f.mode!=='dc'||f.jack!=='volts')return {display:'TEST BLOCKED',note:'Use DC voltage and the voltage input for this virtual comparison.'};
  const potentials={common:0,source:5,load:f.switch==='open'?0:5},red=f.red||'source',black=f.black||'common',v=potentials[red]-potentials[black];
  return {display:Math.abs(v)>Number(f.range||20)?'OL':(v>=0?'+':'')+v.toFixed(2)+' V',note:'Red minus black · source +5 V · load '+potentials.load+' V · verified common 0 V. '+(f.switch==='open'?'Open switch; load has a resistor to common.':'Closed switch supplies the load.')};
 }
 if(model==='digits'){const digits=Number(f.digits)||2,error=Number(f.error)||0;return {display:(5+error).toFixed(digits)+' V',note:'Actual model 5.000 V · modeled error '+error.toFixed(3)+' V'};}
 if(model==='rms'){const rms=f.wave==='square'?2:2/Math.sqrt(2);return {display:rms.toFixed(3)+' V RMS',note:'Peak 2 V · peak-to-peak 4 V · ideal 1 kΩ average power '+(rms*rms).toFixed(3)+' mW'};}
 if(model==='resistance'){const ready=f.power==='off'&&f.energy==='clear';return {display:!ready?'TEST BLOCKED':f.isolate==='isolated'?'100 Ω':'50 Ω',note:!ready?'Disconnect external power and verify stored-energy conditions.':'Ideal 100 Ω component '+(f.isolate==='isolated'?'isolated':'with another 100 Ω parallel path')};}
 if(model==='diode'){const values=f.condition==='short'?['0.00 V','0.00 V']:f.condition==='open'?['OL','OL']:['0.65 V','OL'];return {display:values.join(' / '),note:'Illustrative isolated diode · forward / reverse. OL is this trainer’s open indication.'};}
 if(model==='current'){const ready=f.power==='off'&&f.mode==='current'&&f.jack==='current'&&f.connection==='series';return {display:ready?'READY · 5 mA':'NOT READY',note:ready?'Prepared while disconnected; 5 mA is the predicted ideal current.':'No current test energized. Verify source, function, input and series connection.'};}
 if(model==='burden'){const shunt=Number(f.shunt)||0,current=5/(1000+shunt);return {display:(current*1000).toFixed(3)+' mA',note:'Illustrative shunt '+shunt+' Ω · meter drop '+(current*shunt).toFixed(3)+' V · load voltage '+(current*1000).toFixed(3)+' V'};}
 return null;
}
function visual(a,f){
 if(a.kind==='bench'){
  const positions={device:f.device==='center'?[320,150]:f.device==='edge'?[555,215]:[110,65],iron:f.iron==='stand'?[540,65]:f.iron==='over'?[320,90]:[280,195],light:f.light==='aimed'?[110,125]:[440,215],parts:f.parts==='cups'?[90,195]:[555,225]};
  const items=[['device','Repair item',positions.device],['iron','Iron / stand',positions.iron],['light','Task light',positions.light],['parts','Small parts',positions.parts]];
  return readingSVG('<rect x="28" y="32" width="584" height="204" rx="12" fill="#315268"/><rect x="200" y="95" width="240" height="108" rx="12" fill="#133b4f" stroke="#90daea" stroke-dasharray="5 5"/><text x="320" y="85" text-anchor="middle" fill="#d8f5fc" font-size="15">Clear working area</text>'+items.map(([id,label,[x,y]])=>'<g><rect x="'+(x-62)+'" y="'+(y-17)+'" width="124" height="36" rx="7" fill="'+(id==='device'?'#8fbaa7':id==='iron'?'#d7b879':'#82a9c3')+'"/><text x="'+x+'" y="'+(y+5)+'" text-anchor="middle" fill="#092a3e" font-size="13">'+label+'</text></g>').join(''),'Virtual bench layout selected with the location controls');
 }
 if(a.model==='scope'){const vd=Number(f.vdiv)||1,td=(Number(f.tdiv)||1)/1000;return plotWave(t=>2*Math.sin(2*Math.PI*250*t),td*10,vd,td)+'<p class="workshop-reading">Source: 2 V peak · 4 ms period · 250 Hz. Changing display scales leaves the source unchanged.</p>';}
 if(a.model==='alias'){const rate=Number(f.sampling)||90;return plotWave(t=>2*Math.sin(2*Math.PI*100*t),.1,1,.01,Math.round(rate*.1))+'<p class="workshop-reading">Source remains 100 Hz · '+rate+' samples/s · '+(rate<200?'Sparse samples can imply a slower variation.':'Denser samples reveal the rapid cycles.')+'</p>';}
 const reading=simulationReading(a.model,f);
 if(reading){const wave=a.model==='rms'?plotWave(t=>f.wave==='square'?(Math.sin(2*Math.PI*250*t)>=0?2:-2):2*Math.sin(2*Math.PI*250*t),.008,1,.0008):'';return wave+meterDisplay(reading.display,a.model==='current'?'Virtual preparation: no unsafe hookup energized':'Illustrative instrument display')+'<p class="workshop-reading" aria-live="polite">'+e(reading.note)+'</p>';}
 return '';
}
export function evaluateWorkshopActivity(a,value){
 if(['bench','match','simulation'].includes(a.kind))return {correct:(a.fields||[]).every(f=>String(value.fields?.[f.id])===String(f.answer)),feedback:a.debrief};
 if(a.kind==='inspect'){
  const actual=[...new Set(value.selected||[])].sort(),expected=a.items.filter(x=>x.problem).map(x=>x.id).sort();
  return {correct:JSON.stringify(actual)===JSON.stringify(expected),feedback:a.debrief};
 }
 if(a.kind==='sequence')return {correct:JSON.stringify(value.order)===JSON.stringify(a.correctOrder),feedback:a.debrief};
 if(a.kind==='scenario')return {correct:a.cases.every((c,i)=>Number(value.decisions?.[i])===c.correct&&value.decisions?.[i]!==''&&value.decisions?.[i]!==undefined),feedback:a.cases.map((c,i)=>'Stage '+(i+1)+': '+c.explain).join(' ')};
 return {correct:false,feedback:'This reference is not a scored activity.'};
}
function catalogMarkup(){
 return '<div class="workshop-reference"><label class="lab-control">Find a tool or purpose<input type="search" data-tool-search placeholder="Try capacitor, timing, storage…"></label><label class="lab-control">Category<select data-tool-category><option value="">All tools</option>'+[...new Set(toolCards.map(c=>c.category))].map(c=>'<option>'+e(c)+'</option>').join('')+'</select></label><p class="muted sm" data-tool-count></p><div class="tool-card-grid"></div><details class="workshop-supplements"><summary>Manufacturer and safety supplements</summary><p class="muted sm">These clarify equipment-dependent statements in the book; they are not additional scanned chapter sections.</p>'+workshopReferences.map(r=>'<p><a href="'+e(r.url)+'" target="_blank" rel="noopener noreferrer">'+e(r.title)+'</a></p>').join('')+'</details></div>';
}
function attachCatalog(el){
 const refresh=()=>{const search=el.querySelector('[data-tool-search]').value.trim().toLowerCase(),category=el.querySelector('[data-tool-category]').value;const cards=toolCards.filter(c=>(!category||c.category===category)&&(!search||[c.name,c.purpose,c.limit].join(' ').toLowerCase().includes(search)));el.querySelector('[data-tool-count]').textContent=cards.length+' reference cards · opening a card is not a mastery check';el.querySelector('.tool-card-grid').innerHTML=cards.map(c=>'<details class="tool-card"><summary><span>'+e(c.category)+'</span><strong>'+e(c.name)+'</strong></summary><div><h4>What it helps you find or do</h4><p>'+e(c.purpose)+'</p><h4>What to check or avoid assuming</h4><p>'+e(c.limit)+'</p><small>Book reference: '+e(c.pages)+'</small></div></details>').join('')||'<p>No matching cards. Try a broader purpose or another category.</p>';};
 el.querySelector('[data-tool-search]').addEventListener('input',refresh);el.querySelector('[data-tool-category]').addEventListener('change',refresh);refresh();
}
export function renderWorkshopActivity(a){
 return '<section class="workshop-widget" data-workshop-activity="'+e(a.id)+'"><p class="workshop-task">'+e(a.prompt)+'</p><p class="muted sm">Book reference: pp. '+e(a.pages)+'. '+(a.kind==='catalog'?'Optional reference':'Original virtual practice · checkpoint saves to your workshop')+'</p><div data-workshop-body></div></section>';
}
export function renderWorkshopReference(){return '<details class="workshop-tool-reference"><summary>Open the tool reference</summary>'+catalogMarkup()+'</details>';}
export function attachWorkshopWidgets(root,lesson,state={},save=async()=>false){
 for(const reference of root.querySelectorAll('.workshop-tool-reference'))attachCatalog(reference);
 for(const el of root.querySelectorAll('[data-workshop-activity]')){
  const a=lesson?.activities?.find(x=>x.id===el.dataset.workshopActivity);if(!a)continue;
  const saved=state.workshopChecks?.[a.id],value=structuredClone(saved?.value||{}),body=el.querySelector('[data-workshop-body]');
  if(a.kind==='catalog'){body.innerHTML=catalogMarkup();attachCatalog(body);continue;}
  let markup='';
  if(['bench','match','simulation'].includes(a.kind))markup='<div data-workshop-visual></div>'+controls(a,value);
  if(a.kind==='inspect')markup='<div class="inspection-grid">'+a.items.map(item=>'<label class="inspection-card"><input type="checkbox" value="'+e(item.id)+'" '+((value.selected||[]).includes(item.id)?'checked':'')+'><span class="inspection-marker" aria-hidden="true">?</span><span>'+e(item.label)+'</span></label>').join('')+'</div>';
  if(a.kind==='scenario')markup='<div class="workshop-case">'+a.cases.map((c,i)=>'<fieldset class="case-stage"><legend>Stage '+(i+1)+' · '+e(c.prompt)+'</legend>'+c.choices.map((choice,j)=>'<label class="option"><input type="radio" name="'+e(a.id)+'-case-'+i+'" data-case="'+i+'" value="'+j+'" '+(String(value.decisions?.[i])===String(j)?'checked':'')+'>'+e(choice)+'</label>').join('')+'</fieldset>').join('')+'</div>';
  if(a.kind==='sequence'){
   let order=value.order;if(!Array.isArray(order)||order.length!==a.steps.length||new Set(order).size!==a.steps.length||order.some(id=>!a.steps.some(s=>s.id===id)))order=a.steps.map(s=>s.id);
   // Never present an already-complete ordering by default.
   if(!saved&&JSON.stringify(order)===JSON.stringify(a.correctOrder))order=[...order.slice(1),order[0]];
   value.order=order;markup='<ol class="workshop-sequence" data-sequence-list></ol>';
  }
  body.innerHTML=markup+'<div class="workshop-check-actions"><button type="button" class="primary" data-workshop-check>Check and save this activity</button><span class="muted sm" data-workshop-status>'+ (saved?(saved.correct?'Checkpoint completed':'Saved attempt · revise and check again'):'Not checked yet')+'</span></div><div class="feedback" data-workshop-feedback hidden aria-live="polite"></div>';
  const feedback=body.querySelector('[data-workshop-feedback]'),status=body.querySelector('[data-workshop-status]');
  const hideOld=()=>{feedback.hidden=true;status.textContent='Changes not checked · check again to save';};
  if(a.fields){
   const refresh=()=>{value.fields=Object.fromEntries([...body.querySelectorAll('[data-workshop-field]')].map(s=>[s.dataset.workshopField,s.value]));body.querySelector('[data-workshop-visual]').innerHTML=visual(a,value.fields);};
   for(const control of body.querySelectorAll('[data-workshop-field]'))control.addEventListener('change',()=>{refresh();hideOld();});refresh();
  }
  if(a.kind==='sequence'){
   const refresh=()=>{const list=body.querySelector('[data-sequence-list]');list.innerHTML=value.order.map((id,i)=>'<li><span>'+e(a.steps.find(s=>s.id===id).text)+'</span><div><button type="button" class="outline small-button" data-sequence-move="'+i+'" data-direction="-1" '+(i===0?'disabled':'')+' aria-label="Move step '+(i+1)+' up">↑ Up</button><button type="button" class="outline small-button" data-sequence-move="'+i+'" data-direction="1" '+(i===value.order.length-1?'disabled':'')+' aria-label="Move step '+(i+1)+' down">↓ Down</button></div></li>').join('');for(const button of list.querySelectorAll('[data-sequence-move]'))button.addEventListener('click',()=>{const from=Number(button.dataset.sequenceMove),to=from+Number(button.dataset.direction);[value.order[from],value.order[to]]=[value.order[to],value.order[from]];refresh();hideOld();});};refresh();
  }
  for(const input of body.querySelectorAll('input'))input.addEventListener('change',hideOld);
  const button=body.querySelector('[data-workshop-check]');
  button.addEventListener('click',async()=>{
   if(a.kind==='inspect')value.selected=[...body.querySelectorAll('input:checked')].map(x=>x.value);
   if(a.kind==='scenario')value.decisions=a.cases.map((c,i)=>body.querySelector('[data-case="'+i+'"]:checked')?.value??'');
   const result=evaluateWorkshopActivity(a,value);button.disabled=true;
   try{
    const persisted=await save(a.id,structuredClone(value),result.correct);
    if(!persisted){status.textContent='Not saved · retry when storage is available';return;}
    status.textContent=result.correct?'Checkpoint completed and saved':'Attempt saved · revise the choices';
    feedback.textContent=(result.correct?'Your decisions fit this task. ':'Some decisions need another look. ')+result.feedback;
    feedback.classList.toggle('good',result.correct);feedback.hidden=false;
   }catch{status.textContent='Not saved · your choices are still here';}finally{button.disabled=false;}
  });
  if(saved){const result=evaluateWorkshopActivity(a,value);feedback.textContent=(saved.correct?'Saved checkpoint. ':'Saved attempt. ')+result.feedback;feedback.classList.toggle('good',saved.correct);feedback.hidden=false;}
 }
}
