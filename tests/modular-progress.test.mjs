import test from 'node:test';
import assert from 'node:assert/strict';
import {ProgressRepository,mergeProgressEvents,projectPracticalProgress} from '../modular/progress-events.js';
import {validateEntity} from '../modular/validation.js';
import {entity,ref,uid} from './modular-fixture.mjs';
const event=(i,platform='core',correct=true)=>entity('ProgressEvent',i,{streamId:uid(1),eventType:platform==='core'?'question-result':'lab-result',lesson:ref(9),subject:ref(platform==='core'?10:platform==='desktop'?21:22),platform,...(platform==='core'?{instanceId:uid(200+i)}:{module:ref(platform==='desktop'?11:12)}),attemptId:uid(100+i),sequence:1,timestamp:'2026-10-14T18:00:00Z',correct});
const contract=()=>({streamId:uid(1),lesson:ref(9),coreSubjects:[ref(10)],desktop:{module:ref(11),subjects:[ref(21)]},mobile:{module:ref(12),subjects:[ref(22)]},completionPolicy:'either-platform'});

test('append-only events retain exact revisions and independent practical grades with either completion',()=>{
 const repo=new ProgressRepository();repo.append(event(30));repo.append(event(31,'desktop'));repo.append(event(32,'mobile',false));const p=projectPracticalProgress(repo.list(),contract());assert.equal(p.complete,true);assert.equal(p.core.attempts,1);assert.equal(p.desktop.correct,1);assert.equal(p.mobile.correct,0);
 const next=contract();next.desktop.module.version='2.0.0';assert.equal(projectPracticalProgress(repo.list(),next).desktop.attempts,0);assert.equal(projectPracticalProgress(repo.list(),{...contract(),completionPolicy:'both-platforms'}).complete,false);
 assert.equal(projectPracticalProgress([event(30)],{...contract(),completionPolicy:'no-required-lab'}).complete,true);
 const otherStream=event(33);otherStream.streamId=uid(2);assert.equal(projectPracticalProgress([otherStream],contract()).core.attempts,0);
 repo.append(event(31,'desktop'));assert.equal(repo.list().length,3);assert.throws(()=>repo.append({...event(31,'desktop'),correct:false}),/Immutable/);
});
test('offline merges union nonconflicting events and preserve both conflicting records without timestamp wins',()=>{
 const a=event(30),b=event(31,'desktop'),conflict={...a,correct:false,timestamp:'2026-10-14T19:00:00Z'};
 const merged=mergeProgressEvents([a,b],[conflict,event(32,'mobile')]);assert.equal(merged.conflicts.length,1);assert.equal(merged.conflicts[0].variants.length,2);assert.equal(merged.events.length,2);
 assert.deepEqual(mergeProgressEvents([a,b],[conflict]),mergeProgressEvents([conflict],[b,a]));
 const projection=projectPracticalProgress([a,conflict,b],contract());assert.equal(projection.complete,false);assert.equal(projection.core.attempts,0);
 const duplicate={...a,id:uid(49)};assert.equal(projectPracticalProgress([a,duplicate],contract()).core.attempts,1);
 assert.equal(projectPracticalProgress([a,{...duplicate,correct:false}],contract()).core.attempts,0);
 assert.equal(projectPracticalProgress([a,{...duplicate,correct:false}],contract()).conflicts.length,1);
 const repo=new ProgressRepository();repo.append(a);assert.throws(()=>repo.import([b,conflict]),/Immutable/);assert.deepEqual(repo.list(),[a]);
});
test('event contracts reject ambiguous quiz/platform/module identities and missing exact attempt data',()=>{
 for(const mutate of [e=>e.platform='mobile',e=>delete e.instanceId,e=>delete e.correct,e=>e.code='run',e=>e.subject.version='latest',e=>e.timestamp='bad']){const e=event(30);mutate(e);assert.throws(()=>validateEntity(e));}
 const lab=event(31,'desktop');delete lab.module;assert.throws(()=>validateEntity(lab),/module revision/);
 assert.throws(()=>validateEntity({...event(30),timestamp:'2026-02-31T18:00:00Z'}),/calendar/);
});
