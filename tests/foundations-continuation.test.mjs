import test from 'node:test';
import assert from 'node:assert/strict';
import {moleculeCase,motionState,motionFrame,isLegacyClassifier} from '../foundation-continuation-model.js';
import {challengeWorking,challengeAction} from '../foundation-model.js';
import {mergeStudyBanks,studyLessonAssets,answerStudyItem,presentedItem} from '../study-bank.js';
import {initialStudyLesson,initialStudyActivity,lessonTarget,renderStudyWidget,renderStudyLesson} from '../study-module-view.js';
import {emptyStudyJournal,mergeStudyJournals,studyState} from '../study-journal.js';
import {eligibleStudyItems,makeStudyAttempt,lessonCompletion,startReview} from '../review-engine.js';
import {continuationFixture} from './foundations-continuation-fixture.mjs';
const at='2026-10-16T00:00:00.000Z';
test('authored grouping and composition are separate; joins and formula counts are explicit',()=>{
 for(const f of ['O2','O3','H2O']){const c=moleculeCase(f);assert.equal(c.particle,'molecule');assert.equal(c.composition,f==='H2O'?'compound':'one element');assert.ok(c.bonds.every(b=>c.atoms.some(a=>a.id===b.from)&&c.atoms.some(a=>a.id===b.to)));assert.equal(new Set(c.atoms.map(a=>a.groupId)).size,1);}
 assert.deepEqual(moleculeCase('H2O').counts,{H:2,O:1,total:3});assert.equal(moleculeCase('O2').counts.O,2);assert.equal(moleculeCase('O3').counts.O,3);assert.equal(moleculeCase('O').particle,'atom');assert.throws(()=>moleculeCase('invented molecule'));
});
test('motion preserves fixed particles, anchored vibration and deterministic replay without phase inference',()=>{
 const {bank}=continuationFixture(),item=bank.challenges.at(-1),initial=challengeWorking(item);let state=initial;
 for(let i=0;i<20;i++)state=challengeAction(item,state,'step');
 assert.equal(motionFrame(state).length,9);for(const p of motionFrame(state)){assert.ok(Math.abs(p.x-p.anchor.x)<=5);assert.ok(Math.abs(p.y-p.anchor.y)<=5);}
 const replay=challengeAction(item,state,'replay');assert.deepEqual(motionFrame(replay),motionFrame(initial));assert.equal(replay.seed,17);
 const warm=challengeAction(item,initial,'temperature:warmer');assert.equal(warm.statePreset,'solid');assert.equal(warm.actionCount,0);
 const delta=band=>{const a=motionFrame({...initial,temperatureBand:band,frame:0})[0],b=motionFrame({...initial,temperatureBand:band,frame:1})[0];return Math.hypot(a.x-b.x,a.y-b.y);};assert.ok(delta('warmer')>delta('cooler'));
 for(const preset of ['liquid','gas']){const s=challengeAction(item,initial,'state:'+preset);assert.equal(motionFrame(s).length,9);assert.ok(motionFrame(s).every(p=>p.anchor===null));}
 for(const bad of [{seed:-1},{frame:NaN},{statePreset:'plasma'},{temperatureBand:'melting'},{remaining:21}])assert.throws(()=>motionState({...initial,...bad}));
 let playing=challengeAction(item,initial,'play');for(let i=0;i<20;i++)playing=challengeAction(item,playing,'tick');assert.equal(playing.playing,false);assert.equal(playing.frame,20);assert.throws(()=>challengeAction(item,playing,'tick'));
});
test('idempotent additions preserve old content, source identities and per-lesson progress revisions',()=>{
 const {base,addition,bank}=continuationFixture(),before=structuredClone(base);assert.deepEqual(mergeStudyBanks(bank,addition),bank);assert.deepEqual(base,before);
 for(const key of ['sources','concepts','lessons','questions','variants','challenges'])assert.deepEqual(bank[key].slice(0,base[key].length),base[key]);
 assert.equal(initialStudyLesson(bank,bank.lessons[0]).id,initialStudyLesson(base,base.lessons[0]).id);assert.equal(lessonTarget(studyLessonAssets(bank)[0]),lessonTarget(studyLessonAssets(base)[0]));
 const older={...structuredClone(base),revision:7},updated=mergeStudyBanks(older,{...addition,revision:8});assert.equal(initialStudyLesson(updated,updated.lessons[0]).id,initialStudyLesson(older,older.lessons[0]).id);
 const bad={...addition,sources:[{...base.sources[0],printedPage:99}]};assert.throws(()=>mergeStudyBanks(base,bad),/collision/);assert.equal(base.sources[0].printedPage,1);
});
test('legacy classifier still has its cases; new mode uses ordinary immutable prediction and bounded Review',()=>{
 const {bank}=continuationFixture(),old=bank.challenges[3],fresh=bank.challenges[4];assert.ok(isLegacyClassifier(old));assert.ok(!isLegacyClassifier(fresh));assert.equal(initialStudyActivity(old).caseCount,3);assert.equal(initialStudyActivity(fresh).caseCount,0);assert.ok(answerStudyItem(old,'element',{caseId:'one'}).correct);assert.ok(answerStudyItem(fresh,{descriptionId:'molecules-one-element'}).correct);
 assert.deepEqual(eligibleStudyItems(bank,[]),[]);const ev=[{id:'intro',type:'introduction',at,stepId:'test',conceptIds:['case'],sourceIds:['fixture']}];assert.ok(eligibleStudyItems(bank,ev).every(i=>!i.id.startsWith('extension.')));
 const all=[...ev,{id:'new-intro',type:'introduction',at,stepId:'test2',conceptIds:['grouping','motion'],sourceIds:['fixture']}],session=startReview(bank,all,{id:'r',at,limit:6});assert.ok(session.tasks.length<=6);assert.ok(session.tasks.filter(t=>t.item.kind==='widget_challenge').length<=1);
});
test('first wrong prediction survives replay, refresh and duplicate offline merge; completion is attempted work',()=>{
 const {bank}=continuationFixture(),lesson=bank.lessons.at(-1),s=initialStudyLesson(bank,lesson),item=bank.challenges.at(-1);
 s.acknowledged=lesson.steps.map(x=>x.id);s.activity.prediction=1;s.activity.phase='committed';const a=makeStudyAttempt({id:'prediction',sessionId:s.id,item:presentedItem(item,'r'),answer:{motion:'still'},at});s.activity.attemptId=a.id;
 const events=[a,...s.requiredItems.map((i,n)=>makeStudyAttempt({id:'wrong'+n,sessionId:s.id,item:i,answer:'no',at}))];assert.equal(lessonCompletion(lesson,s,events).complete,false);
 s.activity.working=challengeAction(item,s.activity.working,'step');s.activity.attemptedWorking=structuredClone(s.activity.working);s.activity.phase='revealed';s.activity.comparisonAttempted=true;assert.ok(lessonCompletion(lesson,s,events).complete);
 const doc={...emptyStudyJournal(),events:[...events,{id:'state',type:'state',at,target:lessonTarget(lesson),parentId:null,value:s}]},merged=mergeStudyJournals(doc,structuredClone(doc));assert.equal(merged.events.length,doc.events.length);const restored=studyState(merged,lessonTarget(lesson)).value;assert.deepEqual(restored.activity,s.activity);assert.equal(merged.events[0].result.correct,false);
 const html=renderStudyWidget(bank,item,restored.activity,{attempts:events});assert.match(html,/First prediction retained/);assert.match(html,/ungraded exploration/);assert.doesNotMatch(renderStudyWidget(bank,item,initialStudyActivity(item)),/Synthetic explanation|vibration about fixed positions|Prediction matched/);
 assert.match(renderStudyLesson(bank,bank.lessons[3],emptyStudyJournal()),/Optional onward connection/);
});
