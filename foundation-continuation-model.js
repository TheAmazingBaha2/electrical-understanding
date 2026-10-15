import {isMaterialWidget,validateMaterialWidget,materialWorking,materialAction,materialObservation} from './foundation-material-model.js';
// Reviewed conceptual scenes. No chemistry inference, circuit solver or thermal physics.
const formulas = {
 O:{elements:['O'],bonds:[]},
 O2:{elements:['O','O'],bonds:[[0,1]]},
 O3:{elements:['O','O','O'],bonds:[[0,1],[1,2]]},
 H2O:{elements:['H','O','H'],bonds:[[0,1],[1,2]]}
};
export function moleculeCase(formula) {
 const spec=formulas[formula];if(!spec)throw Error('Choose an authored O, O2, O3 or H2O case');
 const atoms=spec.elements.map((element,index)=>({id:'atom-'+index,element,groupId:'particle-1'}));
 return {formula,atoms,bonds:spec.bonds.map(([a,b])=>({from:atoms[a].id,to:atoms[b].id})),counts:{H:spec.elements.filter(e=>e==='H').length,O:spec.elements.filter(e=>e==='O').length,total:atoms.length},particle:atoms.length===1?'atom':'molecule',composition:new Set(spec.elements).size===1?'one element':'compound',pure:true};
}
export const isContinuationWidget=item=>isMaterialWidget(item)||item?.widgetKey==='particle-motion'||(item?.widgetKey==='material-classifier'&&item.config?.mode==='molecules');
export const isLegacyClassifier=item=>item?.widgetKey==='material-classifier'&&!isContinuationWidget(item);
export function motionState({seed=1,statePreset='solid',temperatureBand='middle',frame=0,playing=false,remaining=0}={}) {
 if(!Number.isInteger(seed)||seed<0||seed>4294967295||!['solid','liquid','gas'].includes(statePreset)||!['cooler','middle','warmer'].includes(temperatureBand)||!Number.isSafeInteger(frame)||frame<0||!Number.isInteger(remaining)||remaining<0||remaining>20||typeof playing!=='boolean')throw Error('Invalid qualitative motion state');
 return {seed,statePreset,temperatureBand,frame,playing,remaining};
}
export function motionFrame(input) {
 const s=motionState(input),rate={cooler:0.45,middle:0.85,warmer:1.4}[s.temperatureBand],t=s.frame*rate;
 return Array.from({length:9},(_,i)=>{
  const anchor={x:110+(i%3)*45,y:62+Math.floor(i/3)*43},phase=(s.seed%97+i*17)*0.37;
  if(s.statePreset==='solid')return {id:'particle-'+i,anchor,x:anchor.x+5*Math.sin(t+phase),y:anchor.y+5*Math.cos(t+phase)};
  if(s.statePreset==='liquid')return {id:'particle-'+i,anchor:null,x:160+62*Math.sin(phase+t*.6),y:103+52*Math.cos(phase*1.7+t*.8)};
  return {id:'particle-'+i,anchor:null,x:30+((i*97+(s.seed%41)+t*(13+i))%280),y:25+((i*47+t*(9+i*2))%160)};
 });
}
export function validateContinuation(item) {
 if(isMaterialWidget(item))validateMaterialWidget(item);
 else if(item.widgetKey==='particle-motion'){
  const s=motionState(item.config),expected={solid:'vibration',liquid:'rearrangement',gas:'wide-separation'}[s.statePreset];
  if(item.grading?.expectedPrediction?.motion!==expected)throw Error('Motion key contradicts the authored preset');
 } else if(item.config.mode==='molecules'){
  const c=moleculeCase(item.config.particleFormula),expected=(c.particle==='atom'?'atoms-':'molecules-')+(c.composition==='compound'?'compound':'one-element');
  if(item.config.samplePurity&&item.config.samplePurity!=='pure')throw Error('Only authored pure-sample cases are supported');
  if(item.grading?.expectedPrediction?.descriptionId!==expected)throw Error('Grouping key contradicts the authored formula');
 }
 if(!item.predictionOptions?.length||!Array.isArray(item.config.allowedActions))throw Error('Concept scene needs authored predictions and actions');
 return item;
}
export function continuationWorking(item) {
 validateContinuation(item);
 if(isMaterialWidget(item))return materialWorking(item);
 return item.widgetKey==='particle-motion'?{...motionState(item.config),actionCount:0}:{formula:item.config.particleFormula,inspectedAtomIds:[],actionCount:0};
}
export function continuationAction(item,working,action) {
 if(isMaterialWidget(item))return materialAction(item,working,action);
 const next=structuredClone(working);
 if(item.widgetKey==='material-classifier') {
  if(action==='inspect')next.inspectedAtomIds=moleculeCase(next.formula).atoms.map(a=>a.id);
  else if(action.startsWith('atom:')){const id=action.slice(5);if(!moleculeCase(next.formula).atoms.some(a=>a.id===id))throw Error('Unknown atom');next.inspectedAtomIds=[...new Set([...next.inspectedAtomIds,id])];}
  else if(action.startsWith('formula:')){moleculeCase(action.slice(8));next.formula=action.slice(8);next.inspectedAtomIds=[];}
  else throw Error('Unsupported molecule action');
 } else {
  motionState(next);
  if(action==='step'||action==='tick'){next.frame++;if(action==='tick'){if(!next.playing)throw Error('Motion is paused');next.remaining=Math.max(0,next.remaining-1);next.playing=next.remaining>0;}}
  else if(action==='replay'){next.frame=0;next.playing=false;next.remaining=0;}
  else if(action==='play'){next.playing=true;next.remaining=20;}
  else if(action==='pause'){next.playing=false;next.remaining=0;}
  else if(action.startsWith('state:')){next.statePreset=action.slice(6);next.frame=0;next.playing=false;}
  else if(action.startsWith('temperature:'))next.temperatureBand=action.slice(12);
  else throw Error('Unsupported motion action');
  motionState(next);
 }
 next.actionCount+=Number(['step','tick','inspect'].includes(action)||action.startsWith('atom:'));return next;
}
export function continuationObservation(item,working) {
 if(isMaterialWidget(item))return materialObservation(item,working);
 return item.widgetKey==='material-classifier'?moleculeCase(working.formula):{...motionState(working),particleCount:9,motion:{solid:'vibration about fixed positions',liquid:'rearrangement',gas:'widely separated motion'}[working.statePreset],positions:motionFrame(working)};
}
