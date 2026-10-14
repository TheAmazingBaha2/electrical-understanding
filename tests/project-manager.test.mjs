import test from 'node:test';
import assert from 'node:assert/strict';
import {ProjectStore,newProject} from '../project-store.js';
import {duplicateProject,renderProjectManager} from '../project-manager.js';
test('independent projects duplicate state and delete to recovery without touching grades',async()=>{
 const data=new Map([['eu_progress:fixture','untouched']]),storage={get length(){return data.size},key:i=>[...data.keys()][i]||null,getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)},locks={request:async(_k,fn)=>fn()},store=new ProjectStore(storage,'local',locks);
 const a=newProject('A');a.metadata.title='Alpha';a.notes='Notes';await store.save(a,0);const b=duplicateProject(a,'B','Beta');await store.save(b,0);assert.equal(store.list().length,2);assert.equal(store.read('B').project.notes,'Notes');
 await store.archiveProject('A',1);assert.equal(store.read('A'),null);assert.equal(store.list().length,1);assert.equal(store.list({includeDeleted:true}).length,2);await assert.rejects(store.save(a,1),/recovery/);await assert.rejects(store.restoreProject('A',1),/changed/);
 await store.restoreProject('A',2);assert.equal(store.read('A').project.notes,'Notes');assert.equal(store.read('A').revision,3);assert.equal(data.get('eu_progress:fixture'),'untouched');
 assert.match(renderProjectManager(store.list(),{search:'Beta'}),/Beta/);assert.doesNotMatch(renderProjectManager(store.list(),{search:'Beta'}),/Alpha/);
});
test('mismatched storage identities fail closed without replacing either saved document',async()=>{
 const data=new Map(),storage={get length(){return data.size},key:i=>[...data.keys()][i]||null,getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)},locks={request:async(_k,fn)=>fn()},store=new ProjectStore(storage,'local',locks);
 await store.save(newProject('A'),0);const raw=store.export('A'),key=store.prefix+'A';const bad=JSON.parse(raw);bad.project.id='B';storage.setItem(key,JSON.stringify(bad));
 assert.throws(()=>store.read('A'),/identity disagrees/);await assert.rejects(store.save(newProject('A'),1),/identity disagrees/);assert.equal(store.export('A'),JSON.stringify(bad));assert.equal(store.export('B'),null);assert.equal(store.list()[0].unreadable,true);
});
