import test from 'node:test';
import assert from 'node:assert/strict';
import {dividerCircuit,solveDC,measureVoltage} from '../circuit-model.js';
import {dividerActivity} from '../guided-activities.js';
import {guidanceState,advanceGuidance,stepFeedback,hideGuidedMeasurements,validateGuidedActivity} from '../lab-guidance.js';
import {voltageExplanation,renderCircuitView,voltageDisplay} from '../circuit-view.js';
import {newProject,addSnapshot,renameSnapshot,deleteSnapshot,restoreSnapshot,ProjectStore} from '../project-store.js';
test('guided data supports prediction gating, resume, hints and explicit free mode',()=>{
 const c=dividerCircuit();let state=guidanceState(dividerActivity);
 assert.equal(hideGuidedMeasurements(dividerActivity,state),true);
 state=advanceGuidance(dividerActivity,state,c,1);state=advanceGuidance(dividerActivity,state,c,1);state=advanceGuidance(dividerActivity,state,c,1);
 assert.equal(state.stepId,'predict');assert.throws(()=>advanceGuidance(dividerActivity,state,c,1),/prediction/);
 state.predictions.predict=0;assert.match(stepFeedback(dividerActivity,state,c).message,/Compare/);assert.equal(hideGuidedMeasurements(dividerActivity,state),false);
 state=advanceGuidance(dividerActivity,state,c,1);assert.equal(state.stepId,'source-measurement');assert.equal(stepFeedback(dividerActivity,state,c).ready,false);
 c.instruments[0].redNode='source';assert.equal(stepFeedback(dividerActivity,state,c).ready,true);
 assert.throws(()=>advanceGuidance(dividerActivity,state,c,1,{mode:'current',jack:'A'}),/DC voltage/);
 assert.deepEqual(guidanceState(dividerActivity,JSON.parse(JSON.stringify(state))),state);
 state.mode='free';assert.equal(hideGuidedMeasurements(dividerActivity,state),false);
 const other={id:'another',version:1,objective:'Another lab',steps:[{id:'estimate',title:'Estimate',pane:'meter',instructions:'Predict',prediction:{choices:['A','B'],correct:0}}]};
 validateGuidedActivity(other);const s=guidanceState(other);assert.equal(hideGuidedMeasurements(other,s),true);s.predictions.estimate=1;assert.equal(hideGuidedMeasurements(other,s),false);
 assert.throws(()=>validateGuidedActivity({...other,steps:[{...other.steps[0],requirements:[{kind:'arbitrary-script'}]}]}));
});
test('feedback and visuals describe configured source separately from actual solved voltage',()=>{
 const c=dividerCircuit();c.components[2].properties.resistanceOhms=2000;c.components.reverse();
 let result=solveDC(c),reading=measureVoltage(c,'output','common',result);
 assert.match(voltageExplanation(c,reading,result),/2000 \/ \(1000 \+ 2000\)/);
 c.components.find(p=>p.id==='V1').state.open=true;result=solveDC(c);reading=measureVoltage(c,'output','common',result);
 assert.match(voltageExplanation(c,reading,result),/source is disconnected/);assert.doesNotMatch(voltageExplanation(c,reading,result),/Connected divider/);
 assert.match(renderCircuitView(c),/SOURCE DISCONNECTED/);assert.equal(reading.valueVolts,0);
 c.components.find(p=>p.id==='R1').state.open=true;c.components.find(p=>p.id==='R2').state.open=true;
 assert.match(voltageExplanation(c,measureVoltage(c,'output','common'),solveDC(c)),/UNKNOWN is different from 0 V/);
 assert.equal(voltageDisplay(.000002),'2.000 µV');assert.equal(voltageDisplay(null),'UNKNOWN');
});
test('snapshot identities remain distinct with duplicate names; rename/delete do not change active content',()=>{
 const p=newProject();p.notes='Preserve active notes';let saved=addSnapshot(addSnapshot(p,'Test','snapshot-a'),'Test','snapshot-b');
 saved.circuit.components[1].state.open=true;const before=structuredClone(saved);
 const renamed=renameSnapshot(saved,'snapshot-b','Same name');assert.equal(renamed.snapshots[0].name,'Test');assert.equal(saved.snapshots[1].name,'Test');
 const deleted=deleteSnapshot(renamed,'snapshot-a');assert.deepEqual(deleted.circuit,before.circuit);assert.equal(deleted.notes,before.notes);assert.equal(deleted.snapshots[0].id,'snapshot-b');
 assert.equal(deleted.snapshotTombstones[0].id,'snapshot-a');assert.equal(restoreSnapshot(deleted,'snapshot-b').circuit.components[1].state.open,false);
 assert.throws(()=>deleteSnapshot(deleted,'snapshot-a'),/not found/);assert.throws(()=>renameSnapshot(deleted,'snapshot-b',' '),/blank/);
});
test('stale snapshot deletion is preserved and conflict selection archives both versions',async()=>{
 const data=new Map(),storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)},locks={request:async(_key,fn)=>fn()};
 const store=new ProjectStore(storage,'test',locks),p=addSnapshot(newProject(),'Test','snap');await store.save(p,0);
 await store.save(renameSnapshot(p,'snap','Renamed by other tab'),1);
 const conflict=await store.save(deleteSnapshot(p,'snap'),1);assert.equal(conflict.conflict,true);assert.equal(store.read(p.id).project.snapshots.length,1);
 await assert.rejects(store.resolveConflict(p.id,conflict.conflicts[0].id,true,1),/changed/);
 const resolved=await store.resolveConflict(p.id,conflict.conflicts[0].id,true,conflict.revision);assert.equal(resolved.project.snapshots.length,0);assert.equal(resolved.conflicts.length,0);
 assert.equal(resolved.resolvedConflicts[0].current.snapshots[0].name,'Renamed by other tab');assert.equal(resolved.resolvedConflicts[0].incoming.snapshots.length,0);
 assert.equal(store.read(p.id).project.snapshots.length,0);await store.save(resolved.project,resolved.revision);assert.equal(store.read(p.id).resolvedConflicts.length,1);
});
test('snapshots restore exact inventory and legacy snapshots reconstruct only saved components',()=>{
 let p=newProject();p.componentInventory[1].supplierNote='Owner inventory detail';p=addSnapshot(p,'Full inventory','full');
 p.componentInventory=[];const restored=restoreSnapshot(p,'full');assert.equal(restored.componentInventory.length,3);assert.equal(restored.componentInventory[1].supplierNote,'Owner inventory detail');
 const legacy=structuredClone(restored);delete legacy.snapshots[0].experiment.componentInventory;legacy.componentInventory.push({componentId:'OTHER',quantity:9});
 const old=restoreSnapshot(legacy,'full');assert.equal(old.componentInventory.length,3);assert.equal(old.componentInventory[1].supplierNote,'Owner inventory detail');assert.ok(!Object.hasOwn(legacy.snapshots[0].experiment,'componentInventory'));
});
test('snapshot extensions cannot replace project identity or its snapshot collection',()=>{
 const p=addSnapshot(newProject('owner-project'),'Safe snapshot','safe');p.metadata.description='Project metadata';
 Object.assign(p.snapshots[0].experiment,{id:'other-project',metadata:{title:'Overwrite'},snapshots:[],snapshotTombstones:[{id:'safe'}],unknownAnnotation:{keep:true}});
 const restored=restoreSnapshot(p,'safe');assert.equal(restored.id,p.id);assert.deepEqual(restored.metadata,p.metadata);assert.deepEqual(restored.snapshots,p.snapshots);assert.equal(restored.snapshotTombstones,undefined);assert.deepEqual(restored.snapshots[0].experiment.unknownAnnotation,{keep:true});
});
