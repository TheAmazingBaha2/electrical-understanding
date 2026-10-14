import {solveDC,measureVoltage,circuitLimitations} from './circuit-model.js';
import {visualDMM} from './dmm-widgets.js';
import {renderCircuitView,voltageDisplay,voltageExplanation} from './circuit-view.js';
import {dividerActivity} from './guided-activities.js';
import {guidanceState,stepFeedback,advanceGuidance,hideGuidedMeasurements} from './lab-guidance.js';
import {renderGuidance} from './lab-guidance-view.js';
import {ProjectStore,newProject,validateProject,addSnapshot,restoreSnapshot,renameSnapshot,deleteSnapshot} from './project-store.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const projectId='divider-project';
export function renderElectronicsWorkspace(){return `<section class="electronics-lab"><header><p class="v2-kicker">SHARED ELECTRONICS LAB · DC FOUNDATION</p><h2>One circuit, connected instruments</h2><p>Explore a low-voltage divider, place probes with the selectors, then open a resistor path. All readings come from the same circuit state.</p></header>
 <div class="experiment-mode" role="group" aria-label="Experiment mode"><button class="outline" data-experiment-mode="guided">Guided Experiment</button><button class="outline" data-experiment-mode="free">Free Experiment</button></div><div data-lab-guide></div>
 <div class="lab-workspace-selector" role="group" aria-label="Focused workspace"><button data-lab-pane="circuit" class="outline">Circuit</button><button data-lab-pane="meter" class="outline">Meter</button><button data-lab-pane="project" class="outline">Project</button></div>
 <div class="lab-workspace-grid" data-focused-pane="circuit">
 <section class="panel workspace-pane" data-pane="circuit"><h3>Circuit</h3><div data-circuit-scene></div><label class="lab-control workspace-check"><input type="checkbox" data-circuit-power checked> Circuit power enabled</label><div data-circuit-controls></div><div data-circuit-values></div></section>
 <section class="panel workspace-pane" data-pane="meter"><h3>Digital multimeter</h3><div data-meter-controls></div><div data-meter-scene></div><p data-meter-explanation></p><label class="lab-control">Difficulty<select data-lab-difficulty><option value="beginner">Beginner · guided</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced · model limits apply</option></select></label><label class="lab-control">Instrument view<select data-meter-view><option value="realistic">Instrument</option><option value="educational">Measurement explanation</option></select></label></section>
 <section class="panel workspace-pane" data-pane="project"><h3>Personal project</h3><p class="muted sm">Experiments save locally, separately from lesson grades. Cloud synchronization is not enabled.</p><label class="lab-control">Notes<textarea data-project-notes rows="4"></textarea></label><label class="lab-control">Snapshot name<input data-snapshot-name placeholder="Before opening R1"></label><button class="outline" data-save-snapshot>Save snapshot</button><details data-snapshot-manager class="snapshot-manager"><summary>Manage snapshots <span data-snapshot-count></span></summary><div data-snapshots></div></details><div data-project-conflicts></div><div class="actions"><button class="outline" data-project-export>Export project</button><label class="project-import-control">Import project JSON<input type="file" data-project-import accept="application/json,.json"></label></div><button class="outline" data-export-project-recovery>Export saved copies</button></section>
 </div><p data-project-status role="status" aria-live="polite"></p><details class="panel"><summary>Model limitations and safety</summary><ul>${circuitLimitations.map(l=>'<li>'+esc(l)+'</li>').join('')}</ul><p>Use this trainer for simulated low-voltage experiments only. Advanced presentation uses the same ideal DC solver; it does not enable unsupported realism.</p></details></section>`;}
export function attachElectronicsWorkspace(root,storage=localStorage){
 const scope=root.querySelector('.electronics-lab');if(!scope)return;
 const store=new ProjectStore(storage);let project,revision=0,blocked=false,timer,saveChain=Promise.resolve(),pendingDelete=null;
 const at=selector=>scope.querySelector(selector),status=message=>{at('[data-project-status]').textContent=message;};
 try{const saved=store.read(projectId);project=saved?.project||newProject();revision=saved?.revision||0;if(saved?.conflicts.length){blocked=true;status('Saved copies disagree. Export saved copies for review; autosave is paused.');}}catch(error){project=newProject();blocked=true;status(error.message+' Autosave is paused; original storage is preserved.');}
 project.experimentState.guidance=guidanceState(dividerActivity,project.experimentState.guidance||{mode:revision?'free':'guided'});
 function currentGuide(){return project.experimentState.guidance;}
 function focusPane(pane){at('.lab-workspace-grid').dataset.focusedPane=pane;}
 function guidance(){
  const open=at('[data-guide-hint]')?.open,state=currentGuide();
  at('[data-lab-guide]').innerHTML=renderGuidance(dividerActivity,state,stepFeedback(dividerActivity,state,project.circuit));
  if(open&&at('[data-guide-hint]'))at('[data-guide-hint]').open=true;
  for(const b of scope.querySelectorAll('[data-experiment-mode]'))b.setAttribute('aria-pressed',String(b.dataset.experimentMode===state.mode));
 }
 function conflicts(){
  let saved;try{saved=store.read(projectId)}catch{return;}
  at('[data-project-conflicts]').innerHTML=(saved?.conflicts||[]).map(c=>'<section class="project-conflict"><p>Saved copy conflict · '+esc(c.savedAt)+'. Both versions are preserved. Export unsaved changes before choosing a full copy.</p><button class="outline" data-resolve-project="'+esc(c.id)+'" data-use-incoming="false">Keep current saved copy</button><button class="outline" data-resolve-project="'+esc(c.id)+'" data-use-incoming="true">Use conflicting copy</button></section>').join('');
 }
 function download(name,value){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 async function persist(){if(!scope.isConnected||blocked)return;try{project.metadata.updatedAt=new Date().toISOString();const saved=await store.save(project,revision);revision=saved.revision;if(saved.conflict){blocked=true;status('Another saved copy changed. Both versions are preserved; review saved copies in Project.');conflicts();}else status('Experiment saved on this device · revision '+revision);}catch(e){status('Not saved: '+e.message);}}
 function save(){saveChain=saveChain.then(persist);return saveChain;}
 function autosave(){clearTimeout(timer);timer=setTimeout(save,250);}
 function scene(result,hidden){
  at('[data-circuit-scene]').innerHTML=renderCircuitView(project.circuit,{hidden});
  at('[data-circuit-values]').innerHTML='<p class="muted sm">Common is the circuit’s reference node. '+(hidden?'Measurements are hidden until you make a prediction; Free Experiment reveals them immediately.':'Probe readings use the actual solved node potentials.')+'</p><ul>'+project.circuit.nodes.map(n=>'<li>'+esc(n.id)+': '+(hidden?'measurement hidden':result.nodeVoltages[n.id]===null?'unknown floating potential':Number(result.nodeVoltages[n.id].toPrecision(6))+' V')+'</li>').join('')+'</ul>';
 }
 function readings(){try{
  const result=solveDC(project.circuit),meter=project.circuit.instruments[0];if(!meter)throw Error('Workspace needs a DC voltage instrument');
  const reading=measureVoltage(project.circuit,meter.redNode,meter.blackNode,result),hidden=hideGuidedMeasurements(dividerActivity,currentGuide()),display=hidden?'PREDICT FIRST':voltageDisplay(reading.valueVolts);
  project.measurementResults=[{instrumentId:meter.id,...reading}];scene(result,hidden);
  const settings=project.instrumentSettings[meter.id]||{difficulty:'beginner',presentation:'realistic'};
  at('[data-meter-scene]').innerHTML=settings.presentation==='educational'?'<output class="shared-meter-reading">'+esc(display)+'</output>':visualDMM(display,'', 'Shared DC voltage · red minus black');
  at('[data-meter-explanation]').textContent=hidden?'Make a prediction in the guide before checking the reading.':voltageExplanation(project.circuit,reading,result);
  guidance();
 }catch(error){project.measurementResults=[];at('[data-circuit-values]').textContent='Electrical results unavailable: '+error.message;at('[data-meter-scene]').textContent='Unsupported circuit state: '+error.message;status(error.message);guidance();}}
 function controls(){
  at('[data-circuit-power]').checked=project.circuit.state.powered;
  at('[data-circuit-controls]').innerHTML=project.circuit.components.map(p=>'<fieldset class="component-control"><legend>'+esc(p.id)+(p.type==='dc-source'?' · DC source':' · resistor')+'</legend><label class="lab-control">'+esc(p.id)+(p.type==='dc-source'?' source voltage (V)':' resistance (Ω)')+'<input type="number" data-component-value="'+esc(p.id)+'" min="'+(p.type==='dc-source'?'-24':'.001')+'" max="'+(p.type==='dc-source'?'24':'1000000000')+'" step="any" value="'+(p.type==='dc-source'?p.properties.voltageVolts:p.properties.resistanceOhms)+'"></label><label class="lab-control workspace-check"><input type="checkbox" data-component-open="'+esc(p.id)+'" '+(p.state.open?'checked':'')+'> Disconnect '+esc(p.id)+' path <span class="connection-badge">'+(p.state.open?'Disconnected':'Connected')+'</span></label></fieldset>').join('');
  const meter=project.circuit.instruments[0];if(!meter){readings();return;}
  at('[data-meter-controls]').innerHTML=['redNode','blackNode'].map(key=>'<label class="lab-control">'+(key==='redNode'?'Red probe':'Black probe')+'<select data-probe="'+key+'">'+project.circuit.nodes.map(n=>'<option value="'+esc(n.id)+'" '+(n.id===meter[key]?'selected':'')+'>'+esc(n.id)+'</option>').join('')+'</select></label>').join('');
  at('[data-project-notes]').value=project.notes;
  const settings=project.instrumentSettings[meter.id]||{difficulty:'beginner',presentation:'realistic'};project.instrumentSettings[meter.id]=settings;
  at('[data-lab-difficulty]').value=settings.difficulty;at('[data-meter-view]').value=settings.presentation;
  snapshots();conflicts();readings();
 }
 function snapshots(){
  at('[data-snapshot-count]').textContent='('+project.snapshots.length+')';
  at('[data-snapshots]').innerHTML=project.snapshots.length?project.snapshots.map((s,i)=>{
   const identity='Snapshot '+(i+1)+' · '+s.id.slice(-8),time=Number.isFinite(Date.parse(s.createdAt))?new Date(s.createdAt).toLocaleString():'Time not recorded';
   return '<article class="snapshot-row" data-snapshot-id="'+esc(s.id)+'"><strong>'+esc(s.name)+'</strong><small>'+esc(identity)+' · '+esc(time)+'</small><div class="actions"><button class="outline" data-restore-snapshot="'+esc(s.id)+'" aria-label="Restore '+esc(s.name)+' '+esc(identity)+'">Restore</button><button class="outline" data-delete-snapshot="'+esc(s.id)+'" aria-label="Delete '+esc(s.name)+' '+esc(identity)+'">Delete</button></div><label class="lab-control">Snapshot name<input data-snapshot-rename="'+esc(s.id)+'" value="'+esc(s.name)+'"></label><button class="outline" data-rename-snapshot="'+esc(s.id)+'">Apply name</button>'+ (pendingDelete===s.id?'<div class="snapshot-confirmation" role="alert"><p>Delete this snapshot? The active circuit, notes and other snapshots stay unchanged.</p><button class="outline" data-confirm-delete-snapshot="'+esc(s.id)+'">Confirm deletion</button><button class="outline" data-cancel-delete-snapshot>Cancel</button></div>':'')+'</article>';
  }).join(''):'<p class="muted sm">No snapshots yet. Save a named snapshot before changing the circuit.</p>';
 }
 scope.addEventListener('change',event=>{
  const input=event.target;try{
   const previous=structuredClone(project);
   if(input.matches('[data-circuit-power]'))project.circuit.state.powered=input.checked;
   else if(input.dataset.componentValue){if(!input.value.trim())throw Error('Enter a component value');const part=project.circuit.components.find(c=>c.id===input.dataset.componentValue);part.properties[part.type==='dc-source'?'voltageVolts':'resistanceOhms']=Number(input.value);try{validateProject(project)}catch(e){project=previous;controls();throw e;}}
   else if(input.dataset.componentOpen)project.circuit.components.find(c=>c.id===input.dataset.componentOpen).state.open=input.checked;
   else if(input.dataset.probe)project.circuit.instruments[0][input.dataset.probe]=input.value;
   else if(input.matches('[data-lab-difficulty],[data-meter-view]')){const settings=project.instrumentSettings[project.circuit.instruments[0].id];if(input.matches('[data-lab-difficulty]'))settings.difficulty=input.value;else settings.presentation=input.value;}
   else return;
   for(const part of project.circuit.components){const badge=scope.querySelector('[data-component-open="'+part.id+'"]')?.closest('label').querySelector('.connection-badge');if(badge)badge.textContent=part.state.open?'Disconnected':'Connected';}
   readings();autosave();
  }catch(e){status(e.message);}
 });
 at('[data-project-notes]').addEventListener('input',event=>{project.notes=event.target.value;autosave();});
 scope.addEventListener('click',async event=>{const button=event.target.closest('button');if(!button)return;try{
  if(button.dataset.experimentMode){currentGuide().mode=button.dataset.experimentMode;guidance();readings();autosave();return;}
  if(button.dataset.guidePrediction!==undefined){currentGuide().predictions[currentGuide().stepId]=Number(button.dataset.guidePrediction);readings();autosave();return;}
  if(button.hasAttribute('data-guide-previous')||button.hasAttribute('data-guide-next')){
   if(button.hasAttribute('data-guide-next')&&currentGuide().stepId===dividerActivity.steps.at(-1).id)currentGuide().mode='free';
   else project.experimentState.guidance=advanceGuidance(dividerActivity,currentGuide(),project.circuit,button.hasAttribute('data-guide-next')?1:-1);
   focusPane(dividerActivity.steps.find(s=>s.id===currentGuide().stepId).pane);readings();autosave();at('[data-guide-title]')?.focus();return;
  }
  if(button.hasAttribute('data-guide-focus')){focusPane(dividerActivity.steps.find(s=>s.id===currentGuide().stepId).pane);return;}
  if(button.dataset.resolveProject){await saveChain;const saved=await store.resolveConflict(projectId,button.dataset.resolveProject,button.dataset.useIncoming==='true',revision);project=saved.project;revision=saved.revision;blocked=saved.conflicts.length>0;project.experimentState.guidance=guidanceState(dividerActivity,project.experimentState.guidance||{mode:'free'});controls();status(blocked?'Another conflict still needs review.':'Saved copy selected. Both prior versions remain in the recovery export.');return;}
  if(button.dataset.labPane){at('.lab-workspace-grid').dataset.focusedPane=button.dataset.labPane;try{storage.setItem('eu_workspace_layout_v1:'+(innerWidth<700?'mobile':'desktop'),button.dataset.labPane)}catch{};return;}
  if(button.hasAttribute('data-save-snapshot')){if(blocked)throw Error('Resolve saved copy conflicts before managing snapshots');project=addSnapshot(project,at('[data-snapshot-name]').value,crypto.randomUUID());snapshots();at('[data-snapshot-manager]').open=true;save();}
  else if(button.dataset.renameSnapshot){if(blocked)throw Error('Resolve saved copy conflicts first');project=renameSnapshot(project,button.dataset.renameSnapshot,scope.querySelector('[data-snapshot-rename="'+button.dataset.renameSnapshot+'"]').value);snapshots();save();}
  else if(button.dataset.deleteSnapshot){pendingDelete=button.dataset.deleteSnapshot;snapshots();}
  else if(button.hasAttribute('data-cancel-delete-snapshot')){pendingDelete=null;snapshots();}
  else if(button.dataset.confirmDeleteSnapshot){if(blocked)throw Error('Resolve saved copy conflicts first');project=deleteSnapshot(project,button.dataset.confirmDeleteSnapshot);pendingDelete=null;snapshots();save();}
  else if(button.dataset.restoreSnapshot){if(blocked)throw Error('Resolve saved copy conflicts first');project=restoreSnapshot(project,button.dataset.restoreSnapshot);project.experimentState.guidance=guidanceState(dividerActivity,project.experimentState.guidance||{mode:'free'});controls();save();}
  else if(button.hasAttribute('data-project-export'))download('electronics-project.json',project);
  else if(button.hasAttribute('data-export-project-recovery'))download('electronics-project-saved-copies.json',{raw:store.export(projectId),unsavedProject:project});
 }catch(e){status(e.message);}});
 at('[data-project-import]').addEventListener('change',async event=>{try{const file=event.target.files[0];if(!file)return;if(file.size>2e6)throw Error('Project import exceeds 2 MB local limit');const imported=JSON.parse(await file.text());validateProject(imported);if(imported.id!==projectId)throw Error('This foundation workspace imports only divider-project; original file is untouched');if(blocked)throw Error('Resolve/export saved conflicts before importing');project=imported;project.experimentState.guidance=guidanceState(dividerActivity,project.experimentState.guidance||{mode:'free'});controls();save();}catch(e){status('Import rejected: '+e.message);}finally{event.target.value='';}});
 try{const layout=storage.getItem('eu_workspace_layout_v1:'+(innerWidth<700?'mobile':'desktop'));if(['circuit','meter','project'].includes(layout))at('.lab-workspace-grid').dataset.focusedPane=layout;}catch{}
 controls();
 // A disconnected workspace must not lose its last edit when navigation replaces the DOM.
 root.addEventListener('click',event=>{if(event.target.closest('[data-goto],[data-view]')&&timer){clearTimeout(timer);save();}},true);
 window.addEventListener('pagehide',save);
 return async()=>{clearTimeout(timer);window.removeEventListener('pagehide',save);await save();};
}
