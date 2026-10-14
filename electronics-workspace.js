import {sharedMeterReading,formatMeterReading,prepareCurrentConnection} from './shared-multimeter.js';
import {newBreadboardProject} from './breadboard-project.js';
import {compileBreadboard,boardHistoryEdit,boardUndo,boardRedo,holeNode,breadboardHoles,emptyBreadboard,dividerBreadboard} from './breadboard-model.js';
import {renderBreadboardEditor} from './breadboard-view.js';
import {solveDC,measureVoltage,circuitLimitations} from './circuit-model.js';
import {visualDMM} from './dmm-widgets.js';
import {renderCircuitView,voltageDisplay,voltageExplanation} from './circuit-view.js';
import {dividerActivity} from './guided-activities.js';
import {guidanceState,stepFeedback,advanceGuidance,hideGuidedMeasurements} from './lab-guidance.js';
import {renderGuidance} from './lab-guidance-view.js';
import {ProjectStore,newProject,validateProject,addSnapshot,restoreSnapshot,renameSnapshot,deleteSnapshot} from './project-store.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function renderElectronicsWorkspace(){return `<section class="electronics-lab"><header><p class="v2-kicker">SHARED ELECTRONICS LAB · DC FOUNDATION</p><h2>One circuit, connected instruments</h2><p>Choose the Divider for an introduction, or build your own DC circuit on the editable breadboard. Both use the same virtual meter and electrical model.</p></header>
 <label class="lab-control">Lab project<select data-lab-project><option value="divider-project">Voltage-divider experiment</option><option value="breadboard-project">Editable breadboard</option></select></label><div class="experiment-mode" role="group" aria-label="Experiment mode"><button class="outline" data-experiment-mode="guided">Guided Experiment</button><button class="outline" data-experiment-mode="free">Free Experiment</button></div><div data-lab-guide></div>
 <div class="lab-workspace-selector" role="group" aria-label="Focused workspace"><button data-lab-pane="circuit" class="outline">Circuit</button><button data-lab-pane="meter" class="outline">Meter</button><button data-lab-pane="project" class="outline">Project</button></div>
 <div class="lab-workspace-grid" data-focused-pane="circuit">
 <section class="panel workspace-pane" data-pane="circuit"><h3>Circuit</h3><div data-breadboard-editor></div><div data-circuit-scene></div><label class="lab-control workspace-check"><input type="checkbox" data-circuit-power checked> Circuit power enabled</label><div data-circuit-controls></div><div data-circuit-values></div></section>
 <section class="panel workspace-pane" data-pane="meter"><h3>Digital multimeter</h3><label class="lab-control">Meter function<select data-meter-mode><option value="voltage">DC voltage · across two nodes</option><option value="resistance">Resistance · sources disconnected</option><option value="continuity">Continuity · sources disconnected</option><option value="current">DC current · prepared series branch</option></select></label><label class="lab-control">Red input jack<select data-meter-jack><option value="VΩ">VΩ</option><option value="A">A</option></select></label><p class="muted sm">Black lead: COM. This instrument is ideal; accuracy, current fuses and burden voltage are not modeled.</p><div data-meter-controls></div><div data-current-connection></div><div data-meter-scene></div><p data-meter-explanation></p><label class="lab-control">Difficulty<select data-lab-difficulty><option value="beginner">Beginner · guided</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced · model limits apply</option></select></label><label class="lab-control">Instrument view<select data-meter-view><option value="realistic">Instrument</option><option value="educational">Measurement explanation</option></select></label></section>
 <section class="panel workspace-pane" data-pane="project"><h3>Personal project</h3><p class="muted sm">Experiments save locally, separately from lesson grades. Cloud synchronization is not enabled.</p><label class="lab-control">Notes<textarea data-project-notes rows="4"></textarea></label><label class="lab-control">Snapshot name<input data-snapshot-name placeholder="Before opening R1"></label><button class="outline" data-save-snapshot>Save snapshot</button><details data-snapshot-manager class="snapshot-manager"><summary>Manage snapshots <span data-snapshot-count></span></summary><div data-snapshots></div></details><div data-project-conflicts></div><div class="actions"><button class="outline" data-project-export>Export project</button><label class="project-import-control">Import project JSON<input type="file" data-project-import accept="application/json,.json"></label></div><button class="outline" data-export-project-recovery>Export saved copies</button></section>
 </div><p data-project-status role="status" aria-live="polite"></p><details class="panel"><summary>Model limitations and safety</summary><ul>${circuitLimitations.map(l=>'<li>'+esc(l)+'</li>').join('')}</ul><p>Use this trainer for simulated low-voltage experiments only. Advanced presentation uses the same ideal DC solver; it does not enable unsupported realism.</p></details></section>`;}
export function attachElectronicsWorkspace(root,storage=localStorage){
 const scope=root.querySelector('.electronics-lab');if(!scope)return;
 let projectId='divider-project';try{const id=storage.getItem('eu_lab_active_project_v1');if(['divider-project','breadboard-project'].includes(id))projectId=id;}catch{}
 const makeProject=()=>projectId==='breadboard-project'?newBreadboardProject():newProject();
 const store=new ProjectStore(storage);let boardUI={tool:'wire',selection:[],section:'left'},project,revision=0,blocked=false,timer,saveChain=Promise.resolve(),pendingDelete=null;
 const at=selector=>scope.querySelector(selector),status=message=>{at('[data-project-status]').textContent=message;};
 try{const saved=store.read(projectId);project=saved?.project||makeProject();revision=saved?.revision||0;if(saved?.conflicts.length){blocked=true;status('Saved copies disagree. Export saved copies for review; autosave is paused.');}}catch(error){project=makeProject();blocked=true;status(error.message+' Autosave is paused; original storage is preserved.');}
 project.experimentState.guidance=guidanceState(dividerActivity,project.experimentState.guidance||{mode:revision?'free':'guided'});
 function currentGuide(){return project.experimentState.guidance;}
 function focusPane(pane){at('.lab-workspace-grid').dataset.focusedPane=pane;}
 function guidance(){
  const open=at('[data-guide-hint]')?.open,state=currentGuide();
  at('[data-lab-guide]').innerHTML=renderGuidance(dividerActivity,state,stepFeedback(dividerActivity,state,project.circuit,project.instrumentSettings[project.circuit.instruments[0]?.id]));
  if(open&&at('[data-guide-hint]'))at('[data-guide-hint]').open=true;
  for(const b of scope.querySelectorAll('[data-experiment-mode]'))b.setAttribute('aria-pressed',String(b.dataset.experimentMode===state.mode));
 }
 function conflicts(){
  let saved;try{saved=store.read(projectId)}catch{return;}
  at('[data-project-conflicts]').innerHTML=(saved?.conflicts||[]).map(c=>'<section class="project-conflict"><p>Saved copy conflict · '+esc(c.savedAt)+'. Both versions are preserved. Export unsaved changes before choosing a full copy.</p><button class="outline" data-resolve-project="'+esc(c.id)+'" data-use-incoming="false">Keep current saved copy</button><button class="outline" data-resolve-project="'+esc(c.id)+'" data-use-incoming="true">Use conflicting copy</button></section>').join('');
 }
 function board(){return project.experimentState.breadboard;}
 function boardView(){at('[data-breadboard-editor]').innerHTML=board()?renderBreadboardEditor(board(),{...boardUI,instrumentSettings:project.instrumentSettings.DMM1}):'';at('[data-circuit-scene]').hidden=Boolean(board());}
 function syncBoard(){if(!board())return;project.circuit=compileBreadboard(board().state);project.componentInventory=project.circuit.components.map(c=>({componentId:c.id,quantity:1}));}
 function nextPartLabel(prefix){const used=new Set(board().state.placements.map(p=>p.label||p.id));let i=1;while(used.has(prefix+i))i++;return prefix+i;}
 function applyBoard(action){if(blocked)throw Error('Resolve saved copies before editing');project.experimentState.breadboard=boardHistoryEdit(board(),action);syncBoard();boardView();controls();autosave();}
 function download(name,value){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 async function persist(){if(!scope.isConnected||blocked)return false;try{project.metadata.updatedAt=new Date().toISOString();const saved=await store.save(project,revision);revision=saved.revision;if(saved.conflict){blocked=true;status('Another saved copy changed. Both versions are preserved; review saved copies in Project.');conflicts();}else{status('Experiment saved on this device · revision '+revision);return true;}}catch(e){status('Not saved: '+e.message);return false;}}
 function save(){saveChain=saveChain.then(persist);return saveChain;}
 function autosave(){clearTimeout(timer);timer=setTimeout(save,250);}
 function scene(result,hidden){
  at('[data-circuit-scene]').innerHTML=renderCircuitView(project.circuit,{hidden,instrumentSettings:project.instrumentSettings[project.circuit.instruments[0]?.id]});
  at('[data-circuit-values]').innerHTML='<p class="muted sm">Common is the circuit’s reference node. '+(hidden?'Measurements are hidden until you make a prediction; Free Experiment reveals them immediately.':'Probe readings use the actual solved node potentials.')+'</p><ul>'+project.circuit.nodes.filter(n=>n.used!==false).map(n=>'<li>'+esc(n.label||n.id)+': '+(hidden?'measurement hidden':result.nodeVoltages[n.id]===null?'unknown floating potential':Number(result.nodeVoltages[n.id].toPrecision(6))+' V')+'</li>').join('')+'</ul>';
 }
 function readings(){try{
  const result=solveDC(project.circuit),meter=project.circuit.instruments[0];if(!meter)throw Error('Workspace needs a DC voltage instrument');
  const settings=project.instrumentSettings[meter.id]||{difficulty:'beginner',presentation:'realistic'},reading=sharedMeterReading(project.circuit,settings),hidden=hideGuidedMeasurements(dividerActivity,currentGuide()),display=hidden?'PREDICT FIRST':reading.mode==='voltage'&&reading.status!=='blocked'?voltageDisplay(reading.value):formatMeterReading(reading);
  project.measurementResults=[{instrumentId:meter.id,...reading}];scene(result,hidden);
  at('[data-meter-controls]').hidden=settings.mode==='current';
  at('[data-current-connection]').hidden=settings.mode!=='current';
  at('[data-meter-scene]').innerHTML=settings.presentation==='educational'?'<output class="shared-meter-reading">'+esc(display)+'</output>':visualDMM(display,'', 'Shared circuit · '+(settings.mode||'voltage'));
  at('[data-meter-explanation]').textContent=hidden?'Make a prediction in the guide before checking the reading.':reading.mode==='voltage'&&reading.status!=='blocked'?voltageExplanation(project.circuit,reading,result):reading.reason||((reading.mode==='continuity'?'Continuity threshold: ≤30 Ω in this example. '+(reading.continuity?'Connected path detected. ':'No continuity indication. '):'Equivalent resistance of the connected resistor network. ')+'Ideal 1 V test with modeled power sources disconnected; actual hardware requires power/stored-energy verification.');
  guidance();
 }catch(error){project.measurementResults=[];at('[data-circuit-values]').textContent='Electrical results unavailable: '+error.message;at('[data-meter-scene]').textContent='Unsupported circuit state: '+error.message;at('[data-meter-explanation]').textContent='No reading is available for this configuration. Review the connections and solver message before continuing.';status(error.message);guidance();}}
 function controls(){
  at('[data-lab-project]').value=projectId;boardView();
  at('[data-circuit-power]').checked=project.circuit.state.powered;
  at('[data-circuit-controls]').innerHTML=project.circuit.components.map(p=>'<fieldset class="component-control"><legend>'+esc(p.label||p.id)+(p.type==='dc-source'?' · DC source':' · resistor')+'</legend><label class="lab-control">'+esc(p.id)+(p.type==='dc-source'?' source voltage (V)':' resistance (Ω)')+'<input type="number" data-component-value="'+esc(p.id)+'" min="'+(p.type==='dc-source'?'-24':'.001')+'" max="'+(p.type==='dc-source'?'24':'1000000000')+'" step="any" value="'+(p.type==='dc-source'?p.properties.voltageVolts:p.properties.resistanceOhms)+'"></label><label class="lab-control workspace-check"><input type="checkbox" data-component-open="'+esc(p.id)+'" '+(p.state.open?'checked':'')+'> Disconnect '+esc(p.id)+' path <span class="connection-badge">'+(p.state.open?'Disconnected':'Connected')+'</span></label></fieldset>').join('');
  const meter=project.circuit.instruments[0];if(!meter){readings();return;}
  at('[data-meter-controls]').innerHTML=['redNode','blackNode'].map(key=>'<label class="lab-control">'+(key==='redNode'?'Red probe':'Black probe')+'<select data-probe="'+key+'">'+project.circuit.nodes.map(n=>'<option value="'+esc(n.id)+'" '+(n.id===meter[key]?'selected':'')+'>'+esc(n.label||n.id)+'</option>').join('')+'</select></label>').join('');
  at('[data-project-notes]').value=project.notes;
  const settings=project.instrumentSettings[meter.id]||{difficulty:'beginner',presentation:'realistic'};project.instrumentSettings[meter.id]=settings;
  at('[data-meter-mode]').value=settings.mode||'voltage';at('[data-meter-jack]').value=settings.jack||'VΩ';
  at('[data-current-connection]').innerHTML='<label class="lab-control">Series component branch<select data-current-branch>'+project.circuit.components.map(p=>'<option value="'+p.id+'" '+(settings.currentConnection?.componentId===p.id?'selected':'')+'>'+esc(p.label||p.id)+'</option>').join('')+'</select></label><button class="outline" data-prepare-current>Prepare series connection · power off first</button><label class="lab-control workspace-check"><input type="checkbox" data-current-reverse '+(settings.currentConnection?.polarity==='reverse'?'checked':'')+'> Reverse current connection polarity</label>';
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
 scope.addEventListener('change',async event=>{
  const input=event.target;try{
   if(input.matches('[data-lab-project]')){
    clearTimeout(timer);if(!await save()){input.value=projectId;throw Error('Export or resolve unsaved changes before switching projects');}
    projectId=input.value;const saved=store.read(projectId);project=saved?.project||makeProject();revision=saved?.revision||0;blocked=Boolean(saved?.conflicts.length);project.experimentState.guidance=guidanceState(dividerActivity,project.experimentState.guidance||{mode:board()?'free':'guided'});boardUI={tool:'wire',selection:[],section:'left'};storage.setItem('eu_lab_active_project_v1',projectId);controls();return;
   }
   if(input.matches('[data-board-tool]')){boardUI.tool=input.value;boardUI.selection=[];boardUI.newValue=input.value==='source'?5:1000;boardView();return;}
   if(input.matches('[data-board-new-value]')){boardUI.newValue=input.value;return;}
   if(input.matches('[data-board-move-id]')){boardUI.moveId=input.value;return;}
   if(input.matches('[data-board-reroute-id]')){boardUI.rerouteId=input.value;return;}
   if(input.matches('[data-meter-mode],[data-meter-jack],[data-current-reverse]')){
    const settings=project.instrumentSettings[project.circuit.instruments[0].id];
    if(input.matches('[data-meter-mode]'))settings.mode=input.value;
    if(input.matches('[data-meter-jack]'))settings.jack=input.value;
    if(input.matches('[data-current-reverse]')){if(!settings.currentConnection)throw Error('Prepare a series connection first');settings.currentConnection.polarity=input.checked?'reverse':'forward';}
    readings();autosave();return;
   }
   if(board()){ 
    if(input.matches('[data-circuit-power]'))applyBoard({type:'power',powered:input.checked});
    else if(input.dataset.componentValue)applyBoard({type:'value',id:input.dataset.componentValue,value:input.value.trim()?Number(input.value):NaN});
    else if(input.dataset.componentOpen)applyBoard({type:'open',id:input.dataset.componentOpen,open:input.checked});
    else if(input.dataset.probe){const hole=breadboardHoles.find(h=>holeNode(h)===input.value);applyBoard({type:'probe',probe:input.dataset.probe==='redNode'?'red':'black',hole});}
    else if(!input.matches('[data-lab-difficulty],[data-meter-view]'))return;
    else {const settings=project.instrumentSettings[project.circuit.instruments[0].id];if(input.matches('[data-lab-difficulty]'))settings.difficulty=input.value;else settings.presentation=input.value;readings();autosave();}
    return;
   }
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
  if(button.hasAttribute('data-prepare-current')){const settings=project.instrumentSettings[project.circuit.instruments[0].id];settings.currentConnection=prepareCurrentConnection(project.circuit,at('[data-current-branch]').value);readings();autosave();return;}
  if(button.dataset.breadboardHole){
   const hole=button.dataset.breadboardHole;
   if(['red','black'].includes(boardUI.tool)){applyBoard({type:'probe',probe:boardUI.tool,hole});return;}
   if(boardUI.selection.includes(hole))boardUI.selection=boardUI.selection.filter(h=>h!==hole);else boardUI.selection=[...boardUI.selection,hole].slice(-2);
   const part=at('[data-board-move-id]')?.value,wire=at('[data-board-reroute-id]')?.value,value=at('[data-board-new-value]')?.value;boardUI.moveId=part;boardUI.rerouteId=wire;boardUI.newValue=value;boardView();if(part)at('[data-board-move-id]').value=part;if(wire)at('[data-board-reroute-id]').value=wire;at('[data-board-new-value]').value=value;return;
  }
  if(button.dataset.boardSection){boardUI.section=button.dataset.boardSection;boardView();return;}
  if(button.hasAttribute('data-board-apply')){
   const [a,b]=boardUI.selection;if(!a||!b)throw Error('Select two endpoints');
   const value=Number(at('[data-board-new-value]').value),tool=boardUI.tool;let action;
   if(tool==='wire')action={type:'connect',wire:{id:'W-'+crypto.randomUUID(),fromHole:a,toHole:b,closed:true}};
   else if(['resistor','source'].includes(tool))action={type:'place',component:{id:(tool==='resistor'?'R-':'V-')+crypto.randomUUID(),label:nextPartLabel(tool==='resistor'?'R':'V'),type:tool==='resistor'?'resistor':'dc-source',holes:[a,b],properties:tool==='resistor'?{resistanceOhms:value}:{voltageVolts:value},state:{open:false}}};
   else if(tool==='move')action={type:'move',id:at('[data-board-move-id]').value,holes:[a,b]};
   else if(tool==='reroute')action={type:'reroute-wire',id:at('[data-board-reroute-id]').value,fromHole:a,toHole:b};
   applyBoard(action);boardUI.selection=[];boardView();return;
  }
  if(button.hasAttribute('data-board-undo')||button.hasAttribute('data-board-redo')){project.experimentState.breadboard=button.hasAttribute('data-board-undo')?boardUndo(board()):boardRedo(board());syncBoard();controls();autosave();return;}
  if(button.hasAttribute('data-board-blank')||button.hasAttribute('data-board-template')){const history=board();project.experimentState.breadboard={schemaVersion:1,state:button.hasAttribute('data-board-blank')?emptyBreadboard():dividerBreadboard(),undo:[...history.undo,structuredClone(history.state)].slice(-50),redo:[]};boardUI.selection=[];syncBoard();controls();autosave();return;}
  if(button.dataset.boardRemoveComponent){applyBoard({type:'remove-component',id:button.dataset.boardRemoveComponent});return;}
  if(button.dataset.boardRemoveWire){applyBoard({type:'remove-wire',id:button.dataset.boardRemoveWire});return;}
  if(button.dataset.experimentMode){if(board()&&button.dataset.experimentMode==='guided'){status('The introductory guide uses the Divider project. Choose it above; breadboard editing uses Free Experiment.');return;}currentGuide().mode=button.dataset.experimentMode;guidance();readings();autosave();return;}
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
 at('[data-project-import]').addEventListener('change',async event=>{try{const file=event.target.files[0];if(!file)return;if(file.size>2e6)throw Error('Project import exceeds 2 MB local limit');const imported=JSON.parse(await file.text());validateProject(imported);if(imported.id!==projectId)throw Error('Select the matching lab project before importing; original file is untouched');if(blocked)throw Error('Resolve/export saved conflicts before importing');project=imported;project.experimentState.guidance=guidanceState(dividerActivity,project.experimentState.guidance||{mode:'free'});controls();save();}catch(e){status('Import rejected: '+e.message);}finally{event.target.value='';}});
 try{const layout=storage.getItem('eu_workspace_layout_v1:'+(innerWidth<700?'mobile':'desktop'));if(['circuit','meter','project'].includes(layout))at('.lab-workspace-grid').dataset.focusedPane=layout;}catch{}
 controls();
 // A disconnected workspace must not lose its last edit when navigation replaces the DOM.
 root.addEventListener('click',event=>{if(event.target.closest('[data-goto],[data-view]')&&timer){clearTimeout(timer);save();}},true);
 window.addEventListener('pagehide',save);
 return async()=>{clearTimeout(timer);window.removeEventListener('pagehide',save);await save();};
}
