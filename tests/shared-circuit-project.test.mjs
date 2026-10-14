import test from 'node:test';
import assert from 'node:assert/strict';
import {dividerCircuit,solveDC,measureVoltage,validateCircuit} from '../circuit-model.js';
import {newProject,ProjectStore,addSnapshot,restoreSnapshot,validateProject} from '../project-store.js';
import {tutorContext,previewTutorProposal,applyTutorProposal} from '../tutor-contract.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9*Math.max(1,Math.abs(b)),a+' != '+b);
test('DC MNA agrees with divider law, current, KCL and energy balance across parameters',()=>{
 for(const voltage of [-12,0,5,24])for(const r1 of [100,1000,10000])for(const r2 of [220,1000,47000]){
  const c=dividerCircuit();c.components[0].properties.voltageVolts=voltage;c.components[1].properties.resistanceOhms=r1;c.components[2].properties.resistanceOhms=r2;
  const result=solveDC(c);near(result.nodeVoltages.source,voltage);near(result.nodeVoltages.output,voltage*r2/(r1+r2));
  near(result.componentCurrents.R1,voltage/(r1+r2));near(result.componentCurrents.R1,result.componentCurrents.R2);
  near(voltage*result.componentCurrents.V1+(r1+r2)*result.componentCurrents.R1**2,0);
  near(measureVoltage(c,'common','output').valueVolts,-result.nodeVoltages.output);
 }
});
test('open paths, power state and floating nodes are solved rather than scenario-selected',()=>{
 const c=dividerCircuit();c.components[1].state.open=true;near(measureVoltage(c,'output','common').valueVolts,0);near(measureVoltage(c,'source','common').valueVolts,5);
 c.components[1].state.open=false;c.components[2].state.open=true;near(measureVoltage(c,'output','common').valueVolts,5);
 c.components[1].state.open=true;assert.equal(measureVoltage(c,'output','common').status,'floating-reference');assert.equal(measureVoltage(c,'output','common').valueVolts,null);
 c.components.forEach(c=>c.state.open=false);c.state.powered=false;near(measureVoltage(c,'output','common').valueVolts,0);
});
test('connection IDs alter shared electrical nets and invalid/singular models fail honestly',()=>{
 const c=dividerCircuit();c.connections.push({id:'bypass',from:'R1.a',to:'R1.b',closed:true});near(solveDC(c).nodeVoltages.output,5);
 c.connections[0].closed=false;near(solveDC(c).nodeVoltages.output,2.5);
 c.connections.push({id:'short',from:'V1.p',to:'V1.n',closed:true});assert.throws(()=>solveDC(c),/shorted/);
 const invalid=dividerCircuit();invalid.components[1].properties.resistanceOhms=0;assert.throws(()=>validateCircuit(invalid));
 invalid.components[1].type='capacitor';assert.throws(()=>validateCircuit(invalid),/Unsupported/);
 const redundant=dividerCircuit();redundant.components.push({...structuredClone(redundant.components[0]),id:'V2',terminals:[{id:'V2.p',nodeId:'source'},{id:'V2.n',nodeId:'common'}]});assert.throws(()=>solveDC(redundant),/Singular/);
});
test('project restoration, snapshots and local conflicts preserve both independent versions',async()=>{
 const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};
 let chain=Promise.resolve();const locks={request:(_key,fn)=>{const task=chain.then(fn);chain=task.catch(()=>{});return task;}};
 const store=new ProjectStore(storage,'local',locks),p=newProject();p.notes='Before fault';p.extraApprovedMetadata={preserve:true};
 const snapshot=addSnapshot(p,'Before fault','snap-1');snapshot.circuit.components[1].state.open=true;snapshot.notes='After fault';
 const restored=restoreSnapshot(snapshot,'snap-1');assert.deepEqual(restored.circuit,p.circuit);assert.equal(restored.notes,'Before fault');assert.deepEqual(restored.extraApprovedMetadata,p.extraApprovedMetadata);
 const first=await store.save(restored,0);assert.equal(first.revision,1);assert.deepEqual(store.read(p.id).project,restored);
 const second=structuredClone(restored);second.notes='Other tab';await store.save(second,1);
 const conflict=await store.save(snapshot,1);assert.equal(conflict.conflict,true);assert.equal(conflict.project.notes,'Other tab');assert.equal(conflict.conflicts[0].project.notes,'After fault');
 assert.ok([...data.keys()].every(k=>k.startsWith('eu_projects_v1:')));
 const raw=JSON.parse(store.export(p.id));raw.schemaVersion=9;storage.setItem(store.prefix+p.id,JSON.stringify(raw));await assert.rejects(store.save(p,3),/Unsupported/);assert.equal(JSON.parse(store.export(p.id)).schemaVersion,9);
 assert.deepEqual(validateProject(JSON.parse(JSON.stringify(p))),p);
});
test('tutor context is scoped and proposals are previewed, reversible and explicitly approved',()=>{
 const p=newProject();p.notes='Private notes';assert.equal(tutorContext(p).notes,undefined);assert.equal(tutorContext(p,{includeNotes:true}).notes,'Private notes');
 const proposal={schemaVersion:1,projectId:p.id,baseCircuit:JSON.stringify(p.circuit),explanation:'Preview an open R1',operations:[{componentId:'R1',property:'open',value:true}]};
 const preview=previewTutorProposal(proposal,p);assert.equal(preview.after.circuit.components[1].state.open,true);assert.equal(p.circuit.components[1].state.open,false);
 assert.throws(()=>applyTutorProposal(proposal,p),/approval/);const applied=applyTutorProposal(proposal,p,{approved:true});assert.deepEqual(applied.undo,p);
 assert.throws(()=>applyTutorProposal(proposal,applied.project,{approved:true}),/stale/);
 assert.throws(()=>previewTutorProposal({...proposal,operations:[{componentId:'R1',property:'code',value:'x'}]},p),/Unsupported/);
});
