import {assertSerializable} from './data-contract.js';
const knownRules=new Set(['divider-connected','equal-resistors','probes','lower-larger','open-upper','isolated-output']);
export function validateGuidedActivity(activity){
 assertSerializable(activity);
 if(!activity.id||!Number.isInteger(activity.version)||!activity.objective||!Array.isArray(activity.steps)||!activity.steps.length)throw Error('Incomplete guided activity');
 const ids=new Set();for(const s of activity.steps){
  if(!s.id||ids.has(s.id)||!s.title||!s.instructions||!['circuit','meter','scope','project'].includes(s.pane))throw Error('Invalid activity step');ids.add(s.id);
  for(const rule of s.requirements||[])if(!knownRules.has(rule.kind))throw Error('Unknown activity requirement');
  if(s.prediction&&(!Array.isArray(s.prediction.choices)||!Number.isInteger(s.prediction.correct)||s.prediction.correct<0||s.prediction.correct>=s.prediction.choices.length))throw Error('Invalid prediction');
 }return activity;
}
export function guidanceState(activity,saved={}){
 validateGuidedActivity(activity);
 return {activityId:activity.id,version:activity.version,mode:saved.mode==='free'?'free':'guided',stepId:activity.steps.some(s=>s.id===saved.stepId)?saved.stepId:activity.steps[0].id,completedStepIds:Array.isArray(saved.completedStepIds)?saved.completedStepIds.filter(id=>activity.steps.some(s=>s.id===id)):[],predictions:saved.predictions&&typeof saved.predictions==='object'?{...saved.predictions}:{}};
}
export function isDivider(c){
 const v=c.components.find(p=>p.id==='V1'),a=c.components.find(p=>p.id==='R1'),b=c.components.find(p=>p.id==='R2');
 return c.components.length===3&&v?.type==='dc-source'&&a?.type==='resistor'&&b?.type==='resistor'&&v.terminals[0].nodeId==='source'&&v.terminals[1].nodeId==='common'&&a.terminals[0].nodeId==='source'&&a.terminals[1].nodeId==='output'&&b.terminals[0].nodeId==='output'&&b.terminals[1].nodeId==='common'&&!c.connections.some(w=>w.closed);
}
export function stepFeedback(activity,state,circuit,instrumentSettings={}){
 const step=activity.steps.find(s=>s.id===state.stepId)||activity.steps[0],parts=Object.fromEntries(circuit.components.map(p=>[p.id,p])),meter=circuit.instruments[0];
 const connected=isDivider(circuit)&&circuit.state.powered&&!parts.V1.state.open&&!parts.R1.state.open&&!parts.R2.state.open;
 for(const rule of step.requirements||[]){
  let valid=false,message='';
  if(rule.kind==='divider-connected'){valid=connected;message='Use the three-component divider with power on and V1, R1 and R2 paths connected.';}
  if(rule.kind==='equal-resistors'){valid=isDivider(circuit)&&parts.R1.properties.resistanceOhms===parts.R2.properties.resistanceOhms;message='Use equal R1 and R2 values for this prediction.';}
  if(rule.kind==='probes'){valid=meter?.redNode===rule.red&&meter?.blackNode===rule.black&&(!instrumentSettings.mode||instrumentSettings.mode==='voltage')&&(!instrumentSettings.jack||instrumentSettings.jack==='VΩ');message='Use DC voltage with the VΩ jack. Select '+rule.red+' for red and '+rule.black+' for black.';}
  if(rule.kind==='lower-larger'){valid=isDivider(circuit)&&parts.R2.properties.resistanceOhms>parts.R1.properties.resistanceOhms;message='Increase R2 above R1, then compare the output reading.';}
  if(rule.kind==='open-upper'){valid=isDivider(circuit)&&circuit.state.powered&&!parts.V1.state.open&&parts.R1.state.open&&!parts.R2.state.open;message='Disconnect R1 and leave the source and R2 connected.';}
  if(rule.kind==='isolated-output'){valid=isDivider(circuit)&&parts.R1.state.open&&parts.R2.state.open;message='Disconnect both R1 and R2 to isolate output.';}
  if(!valid)return {ready:false,message};
 }
 if(step.prediction){const choice=state.predictions[step.id];if(!Number.isInteger(choice))return {ready:false,message:'Choose a prediction before revealing the expected observation.'};return {ready:true,correct:choice===step.prediction.correct,message:(choice===step.prediction.correct?'Your prediction matches. ':'Compare your prediction with the explanation. ')+step.prediction.explanation};}
 return {ready:true,message:step.requirements?.length?'Your circuit and probe settings match this step. Observe the current meter reading, then continue.':'Continue when you are ready.'};
}
export function advanceGuidance(activity,state,circuit,direction){
 const index=activity.steps.findIndex(s=>s.id===state.stepId),next=structuredClone(state);
 if(direction>0){const feedback=stepFeedback(activity,state,circuit);if(!feedback.ready)throw Error(feedback.message);if(!next.completedStepIds.includes(state.stepId))next.completedStepIds.push(state.stepId);}
 next.stepId=activity.steps[Math.max(0,Math.min(activity.steps.length-1,index+direction))].id;return next;
}
export function hideGuidedMeasurements(activity,state){const predictionIndex=activity.steps.findIndex(s=>s.prediction);return predictionIndex>=0&&state.mode==='guided'&&activity.steps.findIndex(s=>s.id===state.stepId)<=predictionIndex&&!Object.hasOwn(state.predictions,activity.steps[predictionIndex].id);}
