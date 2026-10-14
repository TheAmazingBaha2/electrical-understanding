import {solveDC,measureVoltage,circuitLimitations} from './circuit-model.js';
import {visualDMM} from './dmm-widgets.js';
import {circuitSvgFrame} from './lab-visuals.js';
import {ProjectStore,newProject,validateProject,addSnapshot,restoreSnapshot} from './project-store.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const projectId='divider-project';
export function renderElectronicsWorkspace(){return `<section class="electronics-lab"><header><p class="v2-kicker">SHARED ELECTRONICS LAB · DC FOUNDATION</p><h2>One circuit, connected instruments</h2><p>Explore a low-voltage divider, place probes with the selectors, then open a resistor path. All readings come from the same circuit state.</p></header>
 <div class="lab-workspace-selector" role="group" aria-label="Focused workspace"><button data-lab-pane="circuit" class="outline">Circuit</button><button data-lab-pane="meter" class="outline">Meter</button><button data-lab-pane="project" class="outline">Project</button></div>
 <div class="lab-workspace-grid" data-focused-pane="circuit">
 <section class="panel workspace-pane" data-pane="circuit"><h3>Circuit</h3><div data-circuit-scene></div><div data-circuit-controls></div><div data-circuit-values></div></section>
 <section class="panel workspace-pane" data-pane="meter"><h3>Digital multimeter</h3><div data-meter-controls></div><div data-meter-scene></div><p data-meter-explanation></p><label class="lab-control">Difficulty<select data-lab-difficulty><option value="beginner">Beginner · guided</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced · model limits apply</option></select></label><label class="lab-control">Instrument view<select data-meter-view><option value="realistic">Instrument</option><option value="educational">Measurement explanation</option></select></label></section>
 <section class="panel workspace-pane" data-pane="project"><h3>Personal project</h3><p class="muted sm">Experiments save locally, separately from lesson grades. Cloud synchronization is not enabled.</p><label class="lab-control">Notes<textarea data-project-notes rows="4"></textarea></label><label class="lab-control">Snapshot name<input data-snapshot-name placeholder="Before opening R1"></label><button class="outline" data-save-snapshot>Save snapshot</button><div data-snapshots></div><div class="actions"><button class="outline" data-project-export>Export project</button><label class="project-import-control">Import project JSON<input type="file" data-project-import accept="application/json,.json"></label></div><button class="outline" data-export-project-recovery>Export saved copies</button></section>
 </div><p data-project-status role="status" aria-live="polite"></p><details class="panel"><summary>Model limitations and safety</summary><ul>${circuitLimitations.map(l=>'<li>'+esc(l)+'</li>').join('')}</ul><p>Use this trainer for simulated low-voltage experiments only. Advanced presentation uses the same ideal DC solver; it does not enable unsupported realism.</p></details></section>`;}
export function attachElectronicsWorkspace(root,storage=localStorage){
 const scope=root.querySelector('.electronics-lab');if(!scope)return;
 const store=new ProjectStore(storage);let project,revision=0,blocked=false,timer,saveChain=Promise.resolve();
 const at=selector=>scope.querySelector(selector),status=message=>{at('[data-project-status]').textContent=message;};
 try{const saved=store.read(projectId);project=saved?.project||newProject();revision=saved?.revision||0;if(saved?.conflicts.length){blocked=true;status('Saved copies disagree. Export saved copies for review; autosave is paused.');}}catch(error){project=newProject();blocked=true;status(error.message+' Autosave is paused; original storage is preserved.');}
 function download(name,value){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 async function persist(){if(!scope.isConnected||blocked)return;try{project.metadata.updatedAt=new Date().toISOString();const saved=await store.save(project,revision);revision=saved.revision;if(saved.conflict){blocked=true;status('Another saved copy changed. Both versions are preserved; export saved copies for review.');}else status('Experiment saved on this device · revision '+revision);}catch(e){status('Not saved: '+e.message);}}
 function save(){saveChain=saveChain.then(persist);return saveChain;}
 function autosave(){clearTimeout(timer);timer=setTimeout(save,250);}
 function scene(result){
  const parts=project.circuit.components;
  // Display model terminals and properties rather than a separate hard-coded topology.
  const rows=parts.map((p,i)=>{const y=55+i*62,label=p.type==='resistor'?p.properties.resistanceOhms+' Ω':p.properties.voltageVolts+' V';return '<g><text x="20" y="'+y+'" class="lab-svg-label">'+esc(p.id)+'</text><path d="M160 '+(y-5)+' H270 M370 '+(y-5)+' H485" class="lab-wire"/><rect x="270" y="'+(y-18)+'" width="100" height="26" rx="5" class="lab-resistor"/><text x="320" y="'+y+'" text-anchor="middle" class="lab-svg-info">'+esc(p.state.open?'OPEN':label)+'</text><text x="160" y="'+(y+22)+'" class="lab-svg-info">'+esc(p.terminals[0].nodeId)+'</text><text x="460" y="'+(y+22)+'" class="lab-svg-info">'+esc(p.terminals[1].nodeId)+'</text></g>';}).join('');
  at('[data-circuit-scene]').innerHTML=circuitSvgFrame(rows,'Shared model components and their named electrical nodes','0 0 640 '+Math.max(250,parts.length*62+45));
  at('[data-circuit-values]').innerHTML='<p class="muted sm">Terminals with the same node name are connected. '+(project.circuit.connections.length?'Explicit wire links: '+esc(project.circuit.connections.filter(w=>w.closed).map(w=>w.from+' ↔ '+w.to).join('; ')):'' )+'</p><ul>'+project.circuit.nodes.map(n=>'<li>'+esc(n.id)+': '+(result.nodeVoltages[n.id]===null?'unknown floating potential':Number(result.nodeVoltages[n.id].toPrecision(6))+' V')+'</li>').join('')+'</ul>';
 }
 function readings(){try{
  const result=solveDC(project.circuit),meter=project.circuit.instruments[0];if(!meter)throw Error('Workspace needs a DC voltage instrument');
  const reading=measureVoltage(project.circuit,meter.redNode,meter.blackNode,result),display=reading.valueVolts===null?'UNKNOWN':reading.valueVolts.toFixed(3)+' V';
  project.measurementResults=[{instrumentId:meter.id,...reading}];scene(result);
  const settings=project.instrumentSettings[meter.id]||{difficulty:'beginner',presentation:'realistic'};
  at('[data-meter-scene]').innerHTML=settings.presentation==='educational'?'<output class="shared-meter-reading">'+esc(display)+'</output>':visualDMM(display,'', 'Shared DC voltage · red minus black');
  at('[data-meter-explanation]').textContent=reading.valueVolts===null?'One or both probes are on a floating node. This model cannot determine its potential.':meter.redNode+' − '+meter.blackNode+' = '+display+'. '+(settings.difficulty==='beginner'?'With both 1 kΩ resistors connected, 5 V divides to 2.5 V; compare the actual values above.':'Ideal infinite-impedance DC voltage measurement; no loading correction.');
 }catch(error){project.measurementResults=[];at('[data-circuit-values]').textContent='Electrical results unavailable: '+error.message;at('[data-meter-scene]').textContent='Unsupported circuit state: '+error.message;status(error.message);}}
 function controls(){
  at('[data-circuit-controls]').innerHTML=project.circuit.components.map(p=>'<label class="lab-control">'+esc(p.id)+(p.type==='dc-source'?' source voltage (V)':' resistance (Ω)')+'<input type="number" data-component-value="'+esc(p.id)+'" min="'+(p.type==='dc-source'?'-24':'.001')+'" max="'+(p.type==='dc-source'?'24':'1000000000')+'" step="any" value="'+(p.type==='dc-source'?p.properties.voltageVolts:p.properties.resistanceOhms)+'"></label><label class="lab-control workspace-check"><input type="checkbox" data-component-open="'+esc(p.id)+'" '+(p.state.open?'checked':'')+'> Open '+esc(p.id)+' path</label>').join('');
  const meter=project.circuit.instruments[0];if(!meter){readings();return;}
  at('[data-meter-controls]').innerHTML=['redNode','blackNode'].map(key=>'<label class="lab-control">'+(key==='redNode'?'Red probe':'Black probe')+'<select data-probe="'+key+'">'+project.circuit.nodes.map(n=>'<option value="'+esc(n.id)+'" '+(n.id===meter[key]?'selected':'')+'>'+esc(n.id)+'</option>').join('')+'</select></label>').join('');
  at('[data-project-notes]').value=project.notes;
  const settings=project.instrumentSettings[meter.id]||{difficulty:'beginner',presentation:'realistic'};project.instrumentSettings[meter.id]=settings;
  at('[data-lab-difficulty]').value=settings.difficulty;at('[data-meter-view]').value=settings.presentation;
  snapshots();readings();
 }
 function snapshots(){at('[data-snapshots]').innerHTML=project.snapshots.map(s=>'<button class="outline" data-restore-snapshot="'+esc(s.id)+'">Restore '+esc(s.name)+'</button>').join('');}
 scope.addEventListener('change',event=>{
  const input=event.target;try{
   const previous=structuredClone(project);
   if(input.dataset.componentValue){const part=project.circuit.components.find(c=>c.id===input.dataset.componentValue);part.properties[part.type==='dc-source'?'voltageVolts':'resistanceOhms']=Number(input.value);try{validateProject(project)}catch(e){project=previous;controls();throw e;}}
   else if(input.dataset.componentOpen)project.circuit.components.find(c=>c.id===input.dataset.componentOpen).state.open=input.checked;
   else if(input.dataset.probe)project.circuit.instruments[0][input.dataset.probe]=input.value;
   else if(input.matches('[data-lab-difficulty],[data-meter-view]')){const settings=project.instrumentSettings[project.circuit.instruments[0].id];if(input.matches('[data-lab-difficulty]'))settings.difficulty=input.value;else settings.presentation=input.value;}
   else return;
   readings();autosave();
  }catch(e){status(e.message);}
 });
 at('[data-project-notes]').addEventListener('input',event=>{project.notes=event.target.value;autosave();});
 scope.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;try{
  if(button.dataset.labPane){at('.lab-workspace-grid').dataset.focusedPane=button.dataset.labPane;try{storage.setItem('eu_workspace_layout_v1:'+(innerWidth<700?'mobile':'desktop'),button.dataset.labPane)}catch{};return;}
  if(button.hasAttribute('data-save-snapshot')){project=addSnapshot(project,at('[data-snapshot-name]').value,crypto.randomUUID());snapshots();save();}
  else if(button.dataset.restoreSnapshot){project=restoreSnapshot(project,button.dataset.restoreSnapshot);controls();save();}
  else if(button.hasAttribute('data-project-export'))download('electronics-project.json',project);
  else if(button.hasAttribute('data-export-project-recovery'))download('electronics-project-saved-copies.json',{raw:store.export(projectId),unsavedProject:project});
 }catch(e){status(e.message);}});
 at('[data-project-import]').addEventListener('change',async event=>{try{const file=event.target.files[0];if(!file)return;if(file.size>2e6)throw Error('Project import exceeds 2 MB local limit');const imported=JSON.parse(await file.text());validateProject(imported);if(imported.id!==projectId)throw Error('This foundation workspace imports only divider-project; original file is untouched');if(blocked)throw Error('Resolve/export saved conflicts before importing');project=imported;controls();save();}catch(e){status('Import rejected: '+e.message);}finally{event.target.value='';}});
 try{const layout=storage.getItem('eu_workspace_layout_v1:'+(innerWidth<700?'mobile':'desktop'));if(['circuit','meter','project'].includes(layout))at('.lab-workspace-grid').dataset.focusedPane=layout;}catch{}
 controls();
 // A disconnected workspace must not lose its last edit when navigation replaces the DOM.
 root.addEventListener('click',event=>{if(event.target.closest('[data-goto],[data-view]')&&timer){clearTimeout(timer);save();}},true);
 window.addEventListener('pagehide',save);
 return async()=>{clearTimeout(timer);window.removeEventListener('pagehide',save);await save();};
}
