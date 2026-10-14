import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {FilePrivateStorage} from '../scripts/content/private-file-storage.mjs';import {PrivateLearningStore} from '../modular/private-learning.js';import {learningFixture} from './modular-learning-fixture.mjs';import {ref,uid} from './modular-fixture.mjs';import {dividerCircuit} from '../circuit-model.js';import {inspectPublication} from '../modular/publication.js';
import {generatePractice} from '../modular/assessments.js';import {privateRecord} from '../modular/private-documents.js';
async function setup(options={},run){const root=await mkdtemp(join(tmpdir(),'eu-study-journal-'));try{const fixture=await learningFixture(options),host=await FilePrivateStorage.open({root,ownerId:uid(100)}),args={...fixture,host,ownerId:uid(100),widgetLookup:()=>true,clock:()=> '2026-10-14T12:00:00.000Z'},store=await PrivateLearningStore.open(args);await run(store,args);}finally{await rm(root,{recursive:true,force:true});}}
test('draft practice persists exact historical values across reopen and repeated correct practice never awards mastery',async()=>{
 await setup({published:false},async(store,args)=>{
  for(const seed of ['first','second','third']){const a=await store.startQuestion(ref(13),ref(10),{seed}),r=await store.submit(a.id,{value:a.instance.expected,unit:'A'});assert.equal(r.result.correct,true);assert.equal(r.reviewDue,undefined);}
  const reopened=await PrivateLearningStore.open(args),p=await reopened.project(ref(13));assert.equal(p.practiceAttempts,3);assert.equal(p.core.correct,0);assert.equal(p.events.length,0);assert.equal(p.complete,false);
  const rows=(await reopened.read()).value.records;assert.ok(rows[0]);assert.equal(rows.filter(r=>r.kind==='question-start').every(r=>r.instance.templateHash.length===64&&r.template.version==='1.0.0'),true);
  await assert.rejects(store.startQuestion(ref(13),ref(10),{seed:'unapproved',purpose:'graded'}),/Publication blocked|Draft/);
 });
});
test('synthetic approved grades require safety and either independent module; snapshots/results survive revision changes and recovery',async()=>{
 await setup({},async(store,args)=>{
  const q=await store.startQuestion(ref(13),ref(10),{seed:'graded',purpose:'graded'}),answer={value:q.instance.expected,unit:'A'},r=await store.submit(q.id,answer);assert.equal(r.reviewDue,'2026-10-21T12:00:00.000Z');assert.equal((await store.submit(q.id,answer)).id,r.id);
  const desktop=await store.startLab(ref(13),'desktop',uid(21),{purpose:'graded'});await store.submit(desktop.id,{circuit:dividerCircuit(),settings:{mode:'voltage',jack:'VΩ'}});
  const projection=await store.project(ref(13));assert.equal(projection.complete,true);assert.equal(projection.core.attempts,1);assert.equal(projection.desktop.complete,true);assert.equal(projection.mobile.complete,false);assert.equal(projection.mobile.attempts,0);
  const newer=structuredClone(args.bundle);newer.version='3.0.0';newer.entities.push({...newer.entities.find(e=>e.kind==='LessonRevision'),version:'2.0.0',supersedes:ref(13)});
  const next=await PrivateLearningStore.open({...args,bundle:newer,publication:null});assert.equal((await next.project(ref(13))).complete,true);assert.equal((await next.project(ref(13,'2.0.0'))).core.correct,0);await assert.rejects(next.startQuestion(ref(13,'2.0.0'),ref(10),{seed:'no',purpose:'graded'}),/Owner-approved/);
  const recovery=await store.exportRecovery(),fingerprint=await store.fingerprint();await next.importRecovery(recovery);assert.equal(await next.fingerprint(),fingerprint);assert.equal((await next.project(ref(13))).core.attempts,1);
 });
});
test('disputed answers preserve both versions and remove disputed credit; missed/retry schedules retain 1/7/21 behavior',async()=>{
 await setup({},async(store)=>{
  const q=await store.startQuestion(ref(13),ref(10),{seed:'wrong',purpose:'graded'});const wrong=await store.submit(q.id,{value:1,unit:'A'});assert.equal(wrong.reviewDue,'2026-10-15T12:00:00.000Z');
  const retry=await store.startQuestion(ref(13),ref(10),{seed:'retry',purpose:'graded'});const good=await store.submit(retry.id,{value:retry.instance.expected,unit:'A'});assert.equal(good.reviewDue,'2026-11-04T12:00:00.000Z');assert.equal((await store.project(ref(13))).core.correct,1);
  await store.submit(retry.id,{value:99,unit:'A'});const p=await store.project(ref(13));assert.equal(p.core.correct,0);assert.equal(p.journalConflicts.length,1);assert.equal((await store.read()).value.records.filter(r=>r.attemptId===retry.id).length,2);
 });
});
test('publication requires exact content/grade hashes, rights, edition/locator, all review roles, widgets and published platform definitions',async()=>{
 const {bundle,publication}=await learningFixture();assert.equal((await inspectPublication(bundle,publication,{widgetLookup:()=>true})).valid,true);
 for(const mutate of [m=>m.reviews=[],m=>m.rights=[],m=>m.locatorReviews=[],m=>m.editionReviews=[],m=>m.gradeDiffHash='a'.repeat(64),m=>m.target='public']){const m=structuredClone(publication);mutate(m);assert.equal((await inspectPublication(bundle,m,{widgetLookup:()=>true})).valid,false);}
 assert.equal((await inspectPublication(bundle,publication)).valid,false);const changed=structuredClone(bundle);changed.entities[6].text='Changed after approval';assert.equal((await inspectPublication(changed,publication,{widgetLookup:()=>true})).valid,false);
});
test('conflicting valid start snapshots remain readable with all results retained and disputed credit withheld',async()=>{
 await setup({},async(store)=>{
  const a=await store.startQuestion(ref(13),ref(10),{seed:'original'});await store.submit(a.id,{value:a.instance.expected,unit:'A'});
  const variant={...a,instance:await generatePractice(a.template,'another-device')};await store.append([variant]);const p=await store.project(ref(13));assert.equal(p.journalConflicts.length,1);assert.equal(p.core.correct,0);assert.equal((await store.read()).value.records.filter(r=>r.id===a.id).length,2);
  const before=await store.fingerprint(),invalid=await store.exportRecovery(),bad=await privateRecord(store.ownerId,'learning',invalid.head,{format:'future-unreadable',unknown:{retained:true}});invalid.records.push(bad);invalid.head=bad.revision;
  await assert.rejects(store.importRecovery(invalid),/Unknown private learning format/);assert.equal(await store.fingerprint(),before);
 });
});
