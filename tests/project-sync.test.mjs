import test from 'node:test';
import assert from 'node:assert/strict';
import {newProject,addSnapshot,renameSnapshot,deleteSnapshot} from '../project-store.js';
import {mergeProjectCopies,projectSyncEnvelope} from '../project-sync.js';
test('independent notes and experiment edits merge; clocks never choose surviving content',()=>{
 const base=newProject(),local=structuredClone(base),remote=structuredClone(base);local.notes='Offline notes';remote.circuit.components[1].properties.resistanceOhms=2000;local.metadata.updatedAt='2099-01-01';remote.metadata.updatedAt='2000-01-01';
 const result=mergeProjectCopies(base,local,remote);assert.equal(result.status,'merged');assert.equal(result.project.notes,'Offline notes');assert.equal(result.project.circuit.components[1].properties.resistanceOhms,2000);assert.equal(result.project.syncOrigins[0].remoteUpdatedAt,'2000-01-01');
});
test('conflicting circuit or note changes preserve complete base and both versions',()=>{
 const base=newProject(),local=structuredClone(base),remote=structuredClone(base);local.notes='A';remote.notes='B';let r=mergeProjectCopies(base,local,remote);assert.equal(r.status,'conflict');assert.deepEqual(r.remote,remote);assert.deepEqual(r.local,local);assert.deepEqual(r.base,base);
 local.notes=remote.notes='';local.circuit.components[1].state.open=true;remote.circuit.components[2].state.open=true;r=mergeProjectCopies(base,local,remote);assert.deepEqual(r.conflicts,['experiment']);
});
test('snapshot identity, deletion/rename conflicts and unknown metadata survive synchronization',()=>{
 const base=addSnapshot(newProject(),'Duplicate','a');base.unknownApproved={keep:true};
 const local=deleteSnapshot(base,'a'),remote=renameSnapshot(base,'a','Changed');const conflict=mergeProjectCopies(base,local,remote);assert.equal(conflict.status,'conflict');assert.ok(conflict.conflicts.includes('snapshots.a'));
 const merged=mergeProjectCopies(base,addSnapshot(base,'Duplicate','b'),base);assert.equal(merged.status,'merged');assert.deepEqual(merged.project.snapshots.map(s=>s.id),['a','b']);assert.deepEqual(merged.project.unknownApproved,{keep:true});
 const envelope=projectSyncEnvelope(base,{revision:2,parentRevision:1,deviceId:'device',mutationId:'mutation'});assert.equal(envelope.projectId,base.id);assert.equal(envelope.project.notes,base.notes);assert.equal(envelope.layout,undefined);
});
