import {learningProgress} from '../learning-structure.js';
import {renderFlowScene} from '../study-flow-view.js';
import {flowWorking} from '../foundation-flow-model.js';
import test from 'node:test';import assert from 'node:assert/strict';
import {flowFixture} from './foundations-flow-fixture.mjs';
import {validateStudyBank,mergeStudyBanks,allStudyItems,studyLessonAssets,studyPresentation} from '../study-bank.js';
import {initialStudyLesson,renderStudyWidget,renderStudyLesson,lessonTarget} from '../study-module-view.js';
import {challengeAction} from '../foundation-model.js';
import {makeStudyAttempt,lessonCompletion,startReview} from '../review-engine.js';
import {startStudyRecap,recapCoverage} from '../study-recap.js';
import {emptyStudyJournal,mergeStudyJournals,studyState} from '../study-journal.js';
import {energyDevice,energyWorking,energyAction,energyObservation} from '../foundation-energy-model.js';
const at='2026-10-16T00:00:00.000Z';
test('new scenes preserve old items, require actual action, hide feedback and complete even with misses',()=>{
 const {base,addition,bank}=flowFixture();assert.deepEqual(mergeStudyBanks(bank,addition),bank);for(const key of ['lessons','questions','challenges'])assert.deepEqual(bank[key].slice(0,base[key].length),base[key]);
 for(const [k,l] of studyLessonAssets(bank).slice(-6,-1).entries()){
  const s=initialStudyLesson(bank,l),item=allStudyItems(bank).find(i=>i.id===l.challengeId),events=l.steps.map(step=>({id:step.id,type:'introduction',at,conceptIds:step.conceptIds}));s.acknowledged=l.steps.map(s=>s.id);
  assert.doesNotMatch(renderStudyWidget(bank,item,s.activity),/Synthetic flow explanation|data-flow-observation|data-energy-observation/);
  const a=makeStudyAttempt({id:'prediction',sessionId:s.id,item:studyPresentation(bank,item,item.id),answer:item.predictionOptions[1].value,at});events.push(a,...s.requiredItems.map(q=>makeStudyAttempt({id:q.id,sessionId:s.id,item:q,answer:'no',at})));s.activity.attemptId=a.id;s.activity.phase='committed';assert.equal(lessonCompletion(l,s,events).complete,false);
  for(const action of [['run'],['discharge'],['open-path'],['change-voltage'],['input:electrical','output:mechanical','compare']][k])s.activity.working=challengeAction(item,s.activity.working,action);
  s.activity.comparisonAttempted=true;s.activity.attemptedWorking=structuredClone(s.activity.working);s.activity.phase='revealed';assert.equal(lessonCompletion(l,s,events).complete,true);assert.match(renderStudyWidget(bank,item,s.activity,{attempts:events}),/Synthetic flow explanation/);
 }
 const bad=structuredClone(bank);bad.challenges.at(-1).grading.expectedPrediction.input='chemical';assert.throws(()=>validateStudyBank(bad),/contradicts/);
});
test('energy maps preserve all named directions and require selections without invented efficiency',()=>{
 assert.deepEqual(energyDevice('lamp'),{input:'electrical',outputs:['light','heat']});assert.notDeepEqual(energyDevice('motor'),energyDevice('generator'));assert.throws(()=>energyDevice('reactor'));
 const item=flowFixture().bank.challenges.at(-1);let s=energyWorking(item);assert.throws(()=>energyAction(item,s,'compare'));for(const a of ['input:electrical','output:mechanical','compare','chain:battery','chain:electrical','chain:motor','chain:mechanical'])s=energyAction(item,s,a);assert.equal(s.actionCount,1);assert.equal(energyObservation(s).selectionMatches,true);assert.equal(energyObservation(s).efficiency,null);assert.equal(energyObservation(s).chargeConsumed,false);
});
test('recap selects only introduced bank identities, freezes blocks and preserves history across restart/recovery',()=>{
 const {bank}=flowFixture(),l=studyLessonAssets(bank).at(-1),intro=bank.concepts.map(c=>({id:'intro:'+c.id,type:'introduction',at,stepId:'step:'+c.id,conceptIds:[c.id],sourceIds:['fixture']}));
 assert.equal(startStudyRecap(bank,l,[],{}).requiredItems.length,0);assert.equal(recapCoverage(l,[]).full,false);
 const partial=startStudyRecap(bank,l,intro.filter(e=>e.conceptIds.includes('flow')),{limit:12});assert.equal(partial.requiredItems.length,2);assert.equal(partial.coverage.full,false);
 const s=startStudyRecap(bank,l,intro,{limit:12});assert.equal(s.requiredItems.length,10);assert.equal(s.coverage.full,true);assert.ok(s.requiredItems.every(q=>bank.questions.some(i=>i.id===q.id)));assert.equal(new Set(s.requiredItems.map(q=>q.id)).size,10);
 const attempts=s.requiredItems.map(q=>makeStudyAttempt({id:s.id+q.id,sessionId:s.id,item:q,answer:'no',at}));assert.equal(lessonCompletion(l,s,attempts).complete,true);
 const journal={...emptyStudyJournal(),events:[...intro,...attempts,{id:'saved-recap',type:'state',at,target:lessonTarget(l),parentId:null,value:s}]};
 const merged=mergeStudyJournals(journal,JSON.parse(JSON.stringify(journal)));assert.deepEqual(studyState(merged,lessonTarget(l)).value,s);
 for(const tab of ['overview','learn','interact','quiz','review']){const copy=structuredClone(journal);copy.events.at(-1).value.tab=tab;assert.match(renderStudyLesson(bank,l,copy),/lesson-panel/);}
 assert.notEqual(startStudyRecap(bank,l,intro,{run:2}).id,s.id);const daily=startReview(bank,intro,{id:'daily',at,limit:6});assert.ok(daily.tasks.length<=6);assert.equal(daily.tasks.filter(t=>t.item.kind==='widget_challenge').length<=1,true);
});

test('open-path explanation distinguishes source voltage from the resistor voltage and hides optional comparisons',()=>{
 const item={widgetKey:'simple-dc-scene',config:{sourceVoltageV:3,resistanceOhm:3,initialPath:'open'}},scene=renderFlowScene(item,{phase:'revealed',working:flowWorking(item)},{compact:false,e:String,button:(action,label)=>'<button>'+label+'</button>'});assert.match(scene.observation,/Initial open path: source-terminal voltage 3 V; load voltage 0 V; load current 0 A/);assert.doesNotMatch(scene.observation,/3 V.*3 Ω = 0 A/);assert.match(scene.actions,/<details class="study-explore">/);
});

test('optional cumulative recap retains its own gauge without enlarging core progress totals',()=>{
 const assets=studyLessonAssets(flowFixture().bank),recap=assets.at(-1),before=learningProgress(assets,{progress:{},hasPassed:()=>false}),progress={[recap.id]:{checksTotal:12,answers:{a:{correct:true},b:{correct:false}},complete:true}},context={progress,hasPassed:l=>l.id===recap.id};assert.deepEqual(learningProgress(assets,context),before);const own=learningProgress([recap],context,{includePractice:true});assert.equal(own.total,12);assert.equal(own.correct,1);assert.equal(own.incorrect,1);assert.equal(own.mastered,1);
});
