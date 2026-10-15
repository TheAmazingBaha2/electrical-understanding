import test from 'node:test';
import assert from 'node:assert/strict';
import {materialsFixture} from './foundations-materials-fixture.mjs';
import {validateStudyBank,mergeStudyBanks,allStudyItems,studyPresentation} from '../study-bank.js';
import {initialStudyLesson,renderStudyWidget} from '../study-module-view.js';
import {challengeAction} from '../foundation-model.js';
import {makeStudyAttempt,lessonCompletion,eligibleStudyItems,startReview,conceptEvidence} from '../review-engine.js';
const at='2026-10-16T00:00:00.000Z';
test('all progressive modes use the same introduced-only host and attempted-work completion',()=>{
 const {base,addition,bank}=materialsFixture();assert.deepEqual(mergeStudyBanks(bank,addition),bank);for(const key of ['lessons','questions','challenges'])assert.deepEqual(bank[key].slice(0,base[key].length),base[key]);assert.deepEqual(eligibleStudyItems(bank,[]),[]);
 const events=[];
 for(const lesson of bank.lessons.slice(-5)){
  const state=initialStudyLesson(bank,lesson),item=allStudyItems(bank).find(i=>i.id===lesson.challengeId);
  events.push(...lesson.steps.map(s=>({id:'intro:'+s.id,type:'introduction',at,stepId:s.id,conceptIds:s.conceptIds,sourceIds:s.sourceIds})));state.acknowledged=lesson.steps.map(s=>s.id);
  const a=makeStudyAttempt({id:'prediction:'+item.id,sessionId:state.id,item:studyPresentation(bank,item,item.id),answer:item.predictionOptions[1].value,at});events.push(a,...state.requiredItems.map(q=>makeStudyAttempt({id:'wrong:'+q.id,sessionId:state.id,item:q,answer:'no',at})));state.activity.attemptId=a.id;state.activity.phase='committed';assert.equal(lessonCompletion(lesson,state,events).complete,false);
  const action=item.widgetKey==='carrier-vacancy'?'move:3':'compare';state.activity.working=challengeAction(item,state.activity.working,action);state.activity.attemptedWorking=structuredClone(state.activity.working);state.activity.phase='revealed';state.activity.comparisonAttempted=true;assert.equal(lessonCompletion(lesson,state,events).complete,true);assert.match(renderStudyWidget(bank,item,state.activity,{attempts:events}),/First prediction retained/);
 }
 const session=startReview(bank,events,{id:'materials.review',at,limit:6});assert.ok(session.tasks.length<=6);assert.ok(session.tasks.filter(t=>t.item.kind==='widget_challenge').length<=1);assert.ok(Object.values(conceptEvidence(events)).every(s=>s.needsPractice));
 const bad=structuredClone(bank);bad.challenges.at(-1).grading.expectedPrediction.electronCount=5;assert.throws(()=>validateStudyBank(bad),/contradicts/);
});
test('material views do not disclose keyed outcomes before commitment or copy metal animation to liquid cases',()=>{
 const {bank}=materialsFixture();for(const item of bank.challenges.slice(-5)){const s=initialStudyLesson(bank,bank.lessons.find(l=>l.id===item.lessonId)).activity;const html=renderStudyWidget(bank,item,s);assert.match(html,/Commit prediction/);assert.doesNotMatch(html,/Synthetic material comparison|Relative resistance:|Last move: electron/);}
 const item=bank.challenges.at(-5),s=initialStudyLesson(bank,bank.lessons.find(l=>l.id===item.lessonId)).activity;s.phase='revealed';s.working=challengeAction(item,s.working,'case:saltwater-described');const html=renderStudyWidget(bank,item,s);assert.match(html,/solution may use ions/);assert.doesNotMatch(html,/Metal electron-transfer schematic only/);
});
