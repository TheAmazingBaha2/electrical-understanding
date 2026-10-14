import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile,writeFile,open} from 'node:fs/promises';
import {join} from 'node:path';import {tmpdir} from 'node:os';
import {FilePrivateStorage} from '../scripts/content/private-file-storage.mjs';
import {validatePrivateDocument} from '../modular/private-documents.js';
import {uid} from './modular-fixture.mjs';
test('private file CAS survives reopening and stale updates preserve both full values without a timestamp winner',async()=>{
 const root=await mkdtemp(join(tmpdir(),'eu-private-cas-'));try{
  let host=await FilePrivateStorage.open({root,ownerId:uid(100)});assert.deepEqual(await host.readPrivateDocument('learning'),{revision:null,value:null});
  const one=await host.compareAndSwap('learning',null,{unknownOldField:{answer:17},notes:'retained'});assert.equal(one.saved,true);
  host=await FilePrivateStorage.open({root,ownerId:uid(100)});assert.equal((await host.readPrivateDocument('learning')).value.unknownOldField.answer,17);
  const two=await host.compareAndSwap('learning',one.revision,{notes:'device A',time:1});assert.equal(two.saved,true);
  const stale=await host.compareAndSwap('learning',one.revision,{notes:'device B',time:999});assert.equal(stale.saved,false);assert.equal(stale.conflicts.length,1);assert.equal((await host.readPrivateDocument('learning')).value.notes,'device A');
  const recovery=await host.exportRecovery('learning');assert.equal(recovery.records.length,3);assert.ok(recovery.records.some(r=>r.value.notes==='device B'));assert.ok((await host.listRecoveryFiles('learning')).length>=2);
  const foreign=await FilePrivateStorage.open({root,ownerId:uid(101)});await assert.rejects(foreign.importRecovery('learning',recovery),/identity/);
  const tampered=structuredClone(recovery);tampered.records[0].value.notes='corrupt';await assert.rejects(validatePrivateDocument(tampered,uid(100),'learning'),/corruption/);
  const restore=await host.restoreRevision('learning',one.revision,two.revision);assert.equal(restore.saved,true);assert.equal((await host.readPrivateDocument('learning')).value.unknownOldField.answer,17);assert.equal((await host.exportRecovery('learning')).records.length,4);
  await assert.rejects(host.compareAndSwap('../progress',null,{}),/namespace/);
 }finally{await rm(root,{recursive:true,force:true});}
});
test('recovery import keeps conflicting heads and corrupted primary never resets or silently restores',async()=>{
 const root=await mkdtemp(join(tmpdir(),'eu-private-recovery-')),otherRoot=await mkdtemp(join(tmpdir(),'eu-private-device-'));try{
  const a=await FilePrivateStorage.open({root,ownerId:uid(100)}),b=await FilePrivateStorage.open({root:otherRoot,ownerId:uid(100)});
  const initial=await a.compareAndSwap('learning',null,{notes:'base'});await b.importRecovery('learning',await a.exportRecovery('learning'));
  const changed=await a.compareAndSwap('learning',initial.revision,{notes:'A'});await b.compareAndSwap('learning',initial.revision,{notes:'B'});
  const merge=await a.importRecovery('learning',await b.exportRecovery('learning'));assert.equal(merge.conflicted,true);assert.equal(merge.heads.length,2);assert.equal((await a.readPrivateDocument('learning')).revision,changed.revision);assert.equal((await a.exportRecovery('learning')).records.length,3);
  const backup=(await a.listRecoveryFiles('learning'))[0],saved=JSON.parse(await readFile(join(root,backup),'utf8'));await writeFile(a.path('learning'),'partial interrupted corruption');await assert.rejects(a.readPrivateDocument('learning'));await assert.rejects(a.compareAndSwap('learning',changed.revision,{}));assert.equal(await readFile(a.path('learning'),'utf8'),'partial interrupted corruption');assert.ok(saved.head);
 }finally{await rm(root,{recursive:true,force:true});await rm(otherRoot,{recursive:true,force:true});}
});
test('concurrent processes cannot overwrite a locked private record and interruption lock is never automatically discarded',async()=>{
 const root=await mkdtemp(join(tmpdir(),'eu-private-lock-'));try{const a=await FilePrivateStorage.open({root,ownerId:uid(100)}),b=await FilePrivateStorage.open({root,ownerId:uid(100)});const f=await open(join(root,a.key('learning')+'.lock'),'wx',0o600);try{await assert.rejects(b.compareAndSwap('learning',null,{value:1}),/busy or interrupted/);assert.equal((await a.readPrivateDocument('learning')).revision,null);}finally{await f.close();}
 }finally{await rm(root,{recursive:true,force:true});}
});
test('a corrupt existing backup cannot be silently reused while replacing a healthy primary',async()=>{
 const root=await mkdtemp(join(tmpdir(),'eu-private-backup-'));try{const a=await FilePrivateStorage.open({root,ownerId:uid(100)});await a.compareAndSwap('learning',null,{value:'base'});await a.compareAndSwap('learning',null,{value:'stale'});await a.compareAndSwap('learning',null,{value:'stale'});
  const before=await a.exportRecovery('learning'),files=await a.listRecoveryFiles('learning');for(const name of files)await writeFile(join(root,name),'broken backup');await assert.rejects(a.compareAndSwap('learning',null,{value:'stale'}),/backup is corrupt/);assert.deepEqual(await a.exportRecovery('learning'),before);
 }finally{await rm(root,{recursive:true,force:true});}
});
