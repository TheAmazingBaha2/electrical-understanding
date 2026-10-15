import {guidanceState,advanceGuidance} from '../lab-guidance.js';
import {renderGuidance} from '../lab-guidance-view.js';
import {evaluatePracticalState,dividerRoles} from '../modular/practical-rules.js';
import {encodeResistance,decodeBands} from '../resistor-color.js';
import {probeContact} from '../circuit-model.js';
import {formatMeterReading} from '../shared-multimeter.js';
import {makeActivityProject} from './activity-presets.js';
export function activityGuide(activity,platform){
 const r=activity.rubric,bands=r.kind==='resistor-bands@1',expected=bands?r.nominalOhms:r.expectedVolts??r.expectedValue,unit=bands?'Ω':r.mode==='current'?'A':['resistance','continuity'].includes(r.mode)?'Ω':'V',values=[...new Set([0,expected,expected===0?5:expected*2])],correct=values.indexOf(expected);
 const setup=bands?'Build '+r.nominalOhms+' Ω ±'+r.tolerancePercent+'% using '+r.bandCount+' bands.':r.kind==='divider-voltage@1'?r.sourceVolts+' V source, '+r.upperOhms+' Ω upper resistor and '+r.lowerOhms+' Ω lower resistor.':'A 5 V source and two 1 kΩ resistors form the reusable test fixture.';
 return {id:activity.id,version:1,objective:activity.prompt,steps:[
  {id:'predict',title:'Predict before measuring',pane:'circuit',instructions:setup+' Choose the reading you expect for the activity’s stated measurement.',hint:activity.hint,prediction:{choices:values.map(v=>v+' '+unit),correct,explanation:'Keep your prediction; compare it with the actual model in the measurement step.'}},
  {id:'build',title:bands?'Build the band code':'Build the small test fixture',pane:'circuit',instructions:bands?'Use the resistor presets and color bands; the starting 100 Ω component is a practice part, not the requested answer.':platform==='desktop'?'New guided attempts begin with one unpowered supply. Place the missing two resistors from the palette. Set their values as stated: '+setup+' Each new part’s two pins are electrically separate until wired.':'The compact phone fixture shows the source and two resistors already connected. These are the only parts used in this exercise; its probes start detached.',hint:bands?'Select a band, then a color; nominal and tolerance must agree.':'Desktop: click a Resistor icon, then empty canvas; click its body for visual value presets.'},
  {id:'connect',title:bands?'Inspect nominal and tolerance':'Connect the instrument',pane:'meter',instructions:bands?'Read the nominal resistance, tolerance and interval shown by your actual band settings.':platform==='desktop'?'Wire source + → upper A, upper B → lower A, lower B → source −; choose Reference at source −. Click a probe, then a destination. Select the requested mode and jack. Power must stay OFF for Ω/continuity and while preparing current.':'Tap Red probe, then the required Supply/Output/Common contact; repeat for Black. Choose the function and red jack on the meter. Power stays OFF for Ω/continuity and while preparing current.',hint:'Choose actual pin/contact circles. Detach unplugs the selected probe; Cancel only ends selection.'},
  {id:'measure',title:'Measure and compare',pane:'meter',instructions:bands?'Decode your selected colors and compare with your prediction.':'Set the requested power/fault state and observe the actual meter. A blocked or floating result is not a successful measurement. Compare with your prediction.',hint:activity.hint},
  {id:'explain',title:'Explain the observation',pane:'meter',instructions:'Explain why the observation is meaningful. Select the statement supported by this model.',hint:activity.explanation},
  {id:'debrief',title:'Debrief and experiment',pane:'circuit',instructions:activity.explanation+' Your prediction and circuit stay saved. Continue into free practice or return later.',hint:'Core quiz and the other platform’s practical grade remain independent.'}
 ]};
}
export function activityStepFeedback(activity,platform,state,project){
 const r=activity.rubric,bands=r.kind==='resistor-bands@1',c=project.circuit,settings=project.instrumentSettings.DMM1||{},step=state.stepId;
 try{
  const colors=bands?encodeResistance(c.components.find(p=>p.id==='R1').properties.resistanceOhms,c.components.find(p=>p.id==='R1').properties.bandCount||4,c.components.find(p=>p.id==='R1').properties.tolerancePercent??5).colors:null;
  if(step==='predict')return {ready:Number.isInteger(state.predictions.predict),message:Number.isInteger(state.predictions.predict)?'Prediction saved. Build/connect before checking it.':'Choose a prediction; being wrong here does not deduct a grade.'};
  if(step==='build'){
   const ready=bands?evaluatePracticalState(r,{colors}).correct:platform==='mobile'||c.components.filter(p=>p.type==='resistor').length===2&&c.components.filter(p=>p.type==='dc-source').length===1;
   return {ready,message:ready?'The required parts are present. Continue to connect/inspect them.':'Place the required parts, or adjust the actual resistor bands. No measurement has been assumed.'};
  }
  if(step==='connect'){
   if(bands)return {ready:evaluatePracticalState(r,{colors}).correct,message:'Nominal resistance and tolerance come from the displayed bands; manufacturing variation is not simulated.'};
   if(platform==='desktop')dividerRoles(c);
   const ready=r.mode==='current'?settings.currentConnection?.preparedWithPowerOff===true:['red','black'].every(color=>probeContact(c,color).state==='connected');
   return {ready,message:ready?'Actual contact identities/series preparation are saved. Continue to measure.':'Connect both physical probes; current instead needs explicit off-power series preparation. Check the source → upper → lower → common path.'};
  }
  if(step==='measure'){
   const result=evaluatePracticalState(r,bands?{colors}:{circuit:c,settings}),observed=bands?decodeBands(colors).resistanceOhms+' Ω':formatMeterReading(result.observation.reading),predicted=activityGuide(activity,platform).steps[0].prediction.choices[state.predictions.predict];
   return {ready:result.correct,message:(observed?'Actual observation: '+observed+'. ':'')+'Your prediction: '+predicted+'. '+result.feedback+' Practice guidance does not award grades.'};
  }
  if(step==='explain')return {ready:state.explanation===0,message:state.explanation===0?'Correct: actual contacts, values, mode and power define the observation.':state.explanation===1?'A matching display alone cannot prove the connections. Inspect the actual state.':'Choose the explanation supported by your observation.'};
  return {ready:true,message:'Activity cycle complete. Use the separate Check actual experiment button for the current practice/approved session; an example cannot be submitted.'};
 }catch(e){return {ready:false,message:e.message};}
}
export function mountActivityGuide(root,activity,definition,platform,controller,{onExample=()=>{}}={}){
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const spec=activityGuide(activity,platform);let pending=null;
 const get=()=>{const saved=controller.read().experimentState.activitySession||{};return {...saved,...guidanceState(spec,saved)};};
 function draw(){const snapshots=controller.read().snapshots;const state=get(),feedback=activityStepFeedback(activity,platform,state,controller.read());root.innerHTML='<div class="private-activity-guide">'+renderGuidance(spec,state,feedback)+(state.stepId==='explain'&&state.mode==='guided'?'<button data-activity-explain="0">The shared model uses my actual component/contact and instrument state.</button><button data-activity-explain="1">A plausible number is enough even with detached probes.</button>':'')+'<div class="actions"><button data-activity-mode>'+(state.mode==='free'?'Guided activity':'Free practice')+'</button><button data-activity-restart>Restart this activity</button>'+(activity.experiment.allowExample?'<button data-activity-example '+(!Number.isInteger(state.predictions.predict)?'disabled':'')+'>Show example · ungraded</button>':'')+'</div>'+(state.example?'<p class="callout">Example mode: inspect this completed setup. Restart to submit your own experiment; no example result can be graded.</p>':'')+(pending?'<p role="alert">'+(pending==='restart'?'Restart only this activity?':'Open a completed example?')+' A named recovery snapshot retains the present circuit and guidance; other projects, notes, prior attempts and grades stay unchanged.</p><button data-activity-confirm>Continue</button><button data-activity-cancel>Cancel</button>':'')+(snapshots.length?'<details><summary>Activity recovery snapshots ('+snapshots.length+')</summary><label>Saved state<select data-activity-recovery>'+snapshots.map((s,i)=>'<option value="'+escape(s.id)+'">'+escape(s.name)+' · '+escape(s.createdAt)+' · '+(i+1)+'</option>').join('')+'</select></label><button data-activity-restore>Restore selected state</button></details>':'')+'</div>';onExample(Boolean(state.example));}
 const click=e=>{try{let state=get();if(e.target.closest('[data-activity-restart]'))pending='restart';else if(e.target.closest('[data-activity-example]'))pending='example';else if(e.target.closest('[data-activity-cancel]'))pending=null;else if(e.target.closest('[data-activity-confirm]')){const mode=pending==='example'?'completed-example':activity.experiment.start;controller.replace(makeActivityProject(definition,activity,platform,{mode}),'Before '+pending+' · '+activity.title);pending=null;}
  else if(e.target.closest('[data-activity-restore]'))controller.restore(root.querySelector('[data-activity-recovery]').value);
  else if(e.target.closest('[data-activity-mode]'))controller.session({...state,mode:state.mode==='free'?'guided':'free'});
  else if(e.target.closest('[data-activity-explain]'))controller.session({...state,explanation:Number(e.target.dataset.activityExplain)});
  else if(e.target.closest('[data-guide-prediction]'))controller.session({...state,predictions:{...state.predictions,predict:Number(e.target.dataset.guidePrediction)}});
  else if(e.target.closest('[data-guide-previous]')){const i=spec.steps.findIndex(s=>s.id===state.stepId);if(i>0)controller.session({...state,stepId:spec.steps[i-1].id});}
  else if(e.target.closest('[data-guide-next]')){if(activityStepFeedback(activity,platform,state,controller.read()).ready)controller.session({...state,...advanceGuidance(spec,state,controller.read().circuit,1),...(state.stepId==='debrief'?{mode:'free'}:{})});}
  else if(e.target.closest('[data-guide-focus]')){root.dispatchEvent(new CustomEvent('activity-pane',{bubbles:true,detail:spec.steps.find(s=>s.id===state.stepId).pane}));}
  else return;draw();
 }catch(e){const p=document.createElement('p');p.setAttribute('role','alert');p.textContent=e.message;root.append(p);}};
 root.addEventListener('click',click);draw();return {refresh:draw,dispose:()=>root.removeEventListener('click',click)};
}
