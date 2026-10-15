import {isFlowWidget} from './foundation-flow-model.js';
import {renderFlowScene,renderEnergyScene} from './study-flow-view.js';
import {isMaterialWidget} from './foundation-material-model.js';
import {renderMaterialScene} from './study-material-view.js';
import {moleculeCase,motionFrame,continuationObservation} from './foundation-continuation-model.js';
// Uses the same host, saved phases, prediction events and teaching sources as A.
export function renderContinuationWidget(bank,item,s,{compact=false,attempts=[],escape:e,sourceDetails}={}) {
 const revealed=s.phase==='revealed',committed=s.phase!=='prediction',last=attempts.find(a=>a.id===s.attemptId),w=s.working;
 const button=(action,label,disabled=false)=>'<button class="outline" data-study-action="'+e(action)+'" '+(disabled?'disabled':'')+'>'+e(label)+'</button>';
 let visual='',actions='',observation='';
 if(isFlowWidget(item)){({visual,actions,observation}=renderFlowScene(item,s,{compact,e,button}));}
 else if(item.widgetKey==='energy-map'){({visual,actions,observation}=renderEnergyScene(item,s,{compact,e,button}));}
 else if(isMaterialWidget(item)){({visual,actions,observation}=renderMaterialScene(item,s,{compact,e,button}));}
 else if(item.widgetKey==='material-classifier') {
  const c=moleculeCase(w.formula),positions=c.atoms.map((a,i)=>({id:a.id,x:70+i*95,y:i===1&&c.atoms.length===3?72:110}));
  visual='<svg viewBox="0 0 340 190" class="study-concept-scene" role="img" aria-label="Original formula-based model '+e(c.formula)+'; lines explicitly join named atoms; not a reconstruction of a textbook figure">'+c.bonds.map(b=>{const a=positions.find(p=>p.id===b.from),z=positions.find(p=>p.id===b.to);return '<path d="M'+a.x+' '+a.y+'L'+z.x+' '+z.y+'" stroke="currentColor" stroke-width="5"/>';}).join('')+c.atoms.map((a,i)=>'<g><circle cx="'+positions[i].x+'" cy="'+positions[i].y+'" r="28" fill="'+(a.element==='O'?'#273e51':'#4c4664')+'" stroke="'+(w.inspectedAtomIds.includes(a.id)?'#f6d968':'#8eecff')+'" stroke-width="3"/><text x="'+positions[i].x+'" y="'+(positions[i].y+6)+'" text-anchor="middle" fill="white">'+a.element+'</text></g>').join('')+'</svg><p>Authored formula: <b>'+e(c.formula.replace('2','₂').replace('3','₃'))+'</b> · pure sample · '+c.atoms.length+' labeled atom positions.</p>';
  if(committed)actions=c.atoms.map(a=>button('atom:'+a.id,'Inspect '+a.element+' · '+a.id)).join('');
  if(revealed){observation='<dl class="study-axes"><dt>Particle grouping</dt><dd>'+e(c.particle)+'</dd><dt>Sample composition</dt><dd>'+e(c.composition)+'</dd><dt>Counts per particle</dt><dd>H: '+c.counts.H+' · O: '+c.counts.O+' · total: '+c.counts.total+'</dd></dl><p>Grouping and composition answer different questions. These are authored examples; this is not a general chemistry predictor.</p>';
   if(!compact)actions+=['O','O2','O3','H2O'].map(f=>button('formula:'+f,'Explore '+f)).join('');}
 } else {
  const positions=motionFrame(w);
  visual='<svg viewBox="0 0 340 210" class="study-concept-scene" role="img" aria-label="Qualitative particle frame '+w.frame+'; nine particles; no temperature calibration"><rect x="12" y="12" width="316" height="188" rx="12" fill="none" stroke="currentColor"/>'+positions.map(p=>(p.anchor?'<circle cx="'+p.anchor.x+'" cy="'+p.anchor.y+'" r="8" stroke="#8eecff" fill="none" stroke-dasharray="2 3"/>':'')+'<circle data-motion-particle="'+p.id+'" cx="'+p.x.toFixed(2)+'" cy="'+p.y.toFixed(2)+'" r="7" fill="#f6d968"/>').join('')+'</svg><p>Nine particles · '+e(w.statePreset)+' preset · '+e(w.temperatureBand)+' motion setting · frame '+w.frame+'. '+(w.playing?'Playing a bounded 20-step comparison.':'Paused. Use one step for a motion-free frame comparison.')+'</p>';
  if(committed)actions=button('step','One step')+button('replay','Replay from the same seed');
  if(revealed&&!compact)actions+=button('play','Play 20 steps',w.playing)+button('pause','Pause',!w.playing)+'<fieldset><legend>Separate state preset</legend>'+['solid','liquid','gas'].map(v=>button('state:'+v,v)).join('')+'</fieldset><fieldset><legend>Qualitative motion setting · no automatic phase transition</legend>'+['cooler','middle','warmer'].map(v=>button('temperature:'+v,v)).join('')+'</fieldset>';
  if(revealed)observation='<p data-motion-observation>'+e(continuationObservation(item,w).motion)+'. Particle number stays nine. State presets are separate from the uncalibrated motion setting. No temperature, pressure, exact trajectory or phase-change physics is calculated.</p>';
 }
 let controls=!committed?'<fieldset class="study-options"><legend>Predict before revealing</legend>'+item.predictionOptions.map((p,i)=>'<label class="option"><input type="radio" name="study-prediction" value="'+i+'" '+(s.prediction===i?'checked':'')+'><span>'+e(p.label)+'</span></label>').join('')+'</fieldset><button class="primary" data-study-predict>Commit prediction</button>':'<p>First prediction is saved. '+(revealed?'Further changes are ungraded exploration; reset cannot replace that result.':'Try the comparison before revealing the explanation.')+'</p><div class="actions study-scene-controls">'+actions+'</div>';
 if(committed&&!revealed)controls+='<button class="primary" data-study-reveal '+(w.actionCount<(item.config.targetActionCount||1)?'disabled':'')+'>Reveal observation</button>';
 if(revealed)controls+='<section class="feedback" role="status"><b>'+(last?.result.correct?'Prediction matched':'First prediction retained · compare the explanation')+'</b><p>'+e(item.explanation)+'</p>'+observation+'</section>';
 return '<section class="panel study-widget" data-study-widget="'+e(item.widgetKey)+'" data-study-scene><h3>'+e(item.instruction)+'</h3>'+visual+controls+sourceDetails(bank,item.sourceIds,item.sourceSnapshot)+'</section>';
}
