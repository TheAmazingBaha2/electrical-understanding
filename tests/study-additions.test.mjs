import test from 'node:test';import assert from 'node:assert/strict';
import {additionsFixture} from './study-additions-fixture.mjs';
import {additionAssets,additionCompletion,additionGauge,renderAdditionCards,renderOptionalAdditionHomes,renderAdditionReadingLists,additionActivityComplete,renderStudyContentStatus} from '../study-additions.js';
import {initialStudyLesson,initialStudyActivity,lessonTarget,studyEsc,renderStudyLesson} from '../study-module-view.js';
import {allStudyItems,studyPresentation,mergeStudyBanks,studyLessonAssets} from '../study-bank.js';
import {makeStudyAttempt,lessonCompletion,introducedConcepts} from '../review-engine.js';
import {challengeAction} from '../foundation-model.js';
import {emptyStudyJournal,StudyStore,studyState,evidenceEvents,mergeStudyJournals} from '../study-journal.js';
import {learningProgress} from '../learning-structure.js';
import {renderChapterDashboard,renderSourceSection,renderMathPractice} from '../source-navigation.js';
const at='2026-10-16T00:00:00.000Z';
function attempt(s,item,answer,p='shared',assisted=false){return {...makeStudyAttempt({id:s.id+':'+item.id,sessionId:s.id,item,answer,at,assisted}),scope:{...s.scope,platform:p,variant:p==='shared'?null:structuredClone(s.requirements.variants[p])}};}
function exercise(bank,lesson,{platform='desktop'}={}){
 const s=initialStudyLesson(bank,lesson),step=lesson.steps[0],events=[{id:'intro-addition',type:'introduction',at,stepId:step.id,sourceIds:step.sourceIds,conceptIds:step.conceptIds,scope:s.scope}];s.acknowledged=lesson.steps.map(s=>s.id);
 events.push(...s.requiredItems.map((q,i)=>attempt(s,q,'no','shared',i===1)));s.platform=platform;const item=allStudyItems(bank).find(i=>i.id===lesson.addition.variants[platform].challengeId);s.activity=initialStudyActivity(item);const a=attempt(s,studyPresentation(bank,item,s.id),item.predictionOptions[1].value,platform);events.push(a);s.activity.attemptId=a.id;s.activity.working=challengeAction(item,s.activity.working,item.config.allowedActions[0]);s.activity.attemptedWorking=structuredClone(s.activity.working);s.activity.comparisonAttempted=true;s.activity.phase='revealed';return {s,events};
}
test('optional enrollment/completion cannot change actual core gauges, IDs, grades or achievements',()=>{
 const {base,bank,pack}=additionsFixture(),core=studyLessonAssets(base),before=initialStudyLesson(base,core[0]),progress={[core[0].id]:{complete:true,answers:{[core[0].questions[0].id]:{correct:true,reviewDue:777}}}},context={progress,hasPassed:l=>progress[l.id]?.complete===true};
 assert.deepEqual(mergeStudyBanks(bank,pack),bank);assert.deepEqual(studyLessonAssets(bank).map(l=>l.questions),core.map(l=>l.questions));const l=additionAssets(bank)[0],{s,events}=exercise(bank,l);
 assert.equal(additionCompletion(l,s,events).complete,true);assert.equal(additionGauge(l,s,events).total,4);assert.equal(additionGauge(l,s,events).correct,0);assert.equal(additionGauge(l,s,events).assisted,1);
 assert.deepEqual(learningProgress(studyLessonAssets(bank),context),learningProgress(core,context));assert.deepEqual(initialStudyLesson(bank,studyLessonAssets(bank)[0]).requiredItems.map(i=>i.id),before.requiredItems.map(i=>i.id));assert.equal(progress[core[0].id].answers[core[0].questions[0].id].reviewDue,777);assert.equal(lessonCompletion(core[0],before,events).complete,false);
});
test('authored platform selection is independent, either meets only common work and movements create no attempts',()=>{
 const {bank}=additionsFixture(),l=additionAssets(bank)[0],{s,events}=exercise(bank,l,{platform:'mobile'}),c=additionCompletion(l,s,events);assert.equal(c.complete,true);assert.equal(c.platform.mobile.complete,true);assert.equal(c.platform.desktop.complete,false);assert.equal(c.platform.desktop.attempts.length,0);const mislabeled=structuredClone(events);mislabeled.at(-1).scope.platform='desktop';assert.equal(additionCompletion(l,s,mislabeled).activityAttempted,false);
 const newState=initialStudyLesson(bank,l);assert.equal(newState.platform,null);assert.equal(introducedConcepts([]).size,0);assert.equal(additionCompletion(l,newState,events).platform.desktop.complete,false);assert.equal(additionCompletion({...l,addition:{...l.addition,completionPolicy:'both-platforms'}},s,events).complete,false);
 assert.match(renderStudyLesson(bank,l,{...emptyStudyJournal(),events:[]}),/Optional addition/);
});
test('earned requirements survive new versions, and source/Math/catalog routes resume identical supplemental IDs',()=>{
 const {bank,addition}=additionsFixture(),l=additionAssets(bank)[0],{s,events}=exercise(bank,l),journal={...emptyStudyJournal(),events:[...events,{id:'state',type:'state',at,target:lessonTarget(l),parentId:null,value:s}]};
 const next=mergeStudyBanks(bank,{schemaVersion:1,approved:true,revision:3,additions:[{...addition,version:'2.0.0',requiredCheckCount:4}]});assert.deepEqual(studyState(journal,lessonTarget(l)).value.requirements,s.requirements);assert.equal(additionCompletion(l,s,events).complete,true);
 const cards=context=>renderAdditionCards(next,journal,bank.lessons[0].id,{escape:studyEsc,context}),c={bookLessons:studyLessonAssets(next),progress:{},additionCards:()=>cards('catalog'),additionContextCards:()=>cards('math')};
 for(const html of [cards('source'),cards('lesson'),renderSourceSection('lessons',c),renderChapterDashboard(c),renderMathPractice(c)]){assert.match(html,/Completed at earned revision 1.0.0/);assert.match(html,/New additions available/);assert.ok(html.includes('data-lesson="'+l.id+'" data-revision="1.0.0"'));assert.match(html,/1 \/ 1 enrolled completed/);}
 const nextLesson=additionAssets(next).find(l=>l.contentRevision==='2.0.0'),nextState=initialStudyLesson(next,nextLesson),withSecond={...journal,events:[...journal.events,{id:'v2-state',type:'state',at,target:lessonTarget(nextLesson),parentId:null,value:nextState}]};const versionCards=renderAdditionCards(next,withSecond,bank.lessons[0].id,{escape:studyEsc});assert.match(versionCards,/Completed at earned revision 1.0.0/);assert.ok(versionCards.includes('data-revision="2.0.0"'));assert.match(versionCards,/Continue revision 2.0.0/);
 const bad=structuredClone(addition);bad.variants.mobile.id=bad.variants.desktop.id;assert.throws(()=>mergeStudyBanks(bank,{schemaVersion:1,approved:true,additions:[{...bad,version:'3.0.0'}]}),/Independent/);
});
test('same offline journal saves exact scope, chosen checks, assistance and task state; duplicate and conflicting imports preserve evidence',async()=>{
 const {bank}=additionsFixture(),l=additionAssets(bank)[0],{s,events}=exercise(bank,l),map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k),key:i=>[...map.keys()][i],get length(){return map.size}},locks={request:async(k,f)=>f()},store=new StudyStore(storage,null,locks);
 await store.updateState(lessonTarget(l),null,s,events,{id:'first',at});const raw=store.export(),reload=new StudyStore(storage,null,locks);assert.deepEqual(studyState(reload.read(),lessonTarget(l)).value,s);await reload.import(JSON.parse(raw));assert.equal(evidenceEvents(reload.read()).filter(e=>e.type==='attempt').length,4);
 const left=await reload.updateState(lessonTarget(l),'first',{...s,tab:'learn'},[],{id:'left',at}),right=await reload.updateState(lessonTarget(l),'first',{...s,tab:'quiz'},[],{id:'right',at});assert.equal(right.conflicted,true);assert.equal(studyState(reload.read(),lessonTarget(l)).candidates.length,2);assert.ok(left.document||left);
 const conflict=structuredClone(reload.read()),a=conflict.events.find(e=>e.type==='attempt');a.assisted=!a.assisted;const merged=mergeStudyJournals(reload.read(),conflict);assert.equal(merged.conflicts.length,1);assert.equal(evidenceEvents(merged).some(e=>e.id===a.id),false);
});

test('a reviewed optional-only canonical home remains discoverable without creating a core lesson',()=>{
 const {base,pack,addition}=additionsFixture(),home={id:'00000000-0000-4000-8000-000000000602',aliases:[],title:'Synthetic optional-only topic',optionalOnly:true},bank=mergeStudyBanks(base,{...pack,canonicalLessons:[home],additions:[{...addition,homeLessonId:home.id}]});
 const c={bookLessons:studyLessonAssets(bank),progress:{},optionalAdditionHomes:()=>renderOptionalAdditionHomes(bank,emptyStudyJournal(),{escape:studyEsc})};assert.equal(studyLessonAssets(bank).length,base.lessons.length);assert.match(renderSourceSection('lessons',c),/Synthetic optional-only topic/);assert.match(renderSourceSection('lessons',c),/No core completion requirement/);
});

test('source-contribution reading view uses the same canonical addition/revision, source labels and gauge',()=>{
 const {bank}=additionsFixture(),l=additionAssets(bank)[0],{s,events}=exercise(bank,l),journal={...emptyStudyJournal(),events:[...events,{id:'source-state',type:'state',at,target:lessonTarget(l),parentId:null,value:s}]};
 const reading=renderAdditionReadingLists(bank,journal,{escape:studyEsc});
 assert.match(reading,/Source contributions/);assert.match(reading,/Reference pages:/);assert.match(reading,/4 \/ 4 requirements/);assert.match(reading,/1 \/ 1 enrolled completed/);assert.ok(reading.includes('data-lesson="'+l.id+'" data-revision="1.0.0"'));
 assert.equal((reading.match(/data-addition=/g)||[]).length,1);
 const c={bookLessons:studyLessonAssets(bank),progress:{},additionReadingLists:()=>reading};for(const html of [renderSourceSection('lessons',c),renderChapterDashboard(c)])assert.ok(html.includes(reading));
 assert.equal(renderAdditionReadingLists(null,journal,{escape:studyEsc}),'');
});
test('legacy case-sorter supplement completion requires every scoped authored case attempt',()=>{
 const activity={comparisonAttempted:true,caseCount:2,caseAnswers:[{attemptId:'a'},{attemptId:'b'}]},attempts=[{id:'a',item:{id:'challenge'}},{id:'b',item:{id:'challenge'}}];
 assert.equal(additionActivityComplete(activity,attempts,'challenge'),true);assert.equal(additionActivityComplete(activity,attempts.slice(0,1),'challenge'),false);assert.equal(additionActivityComplete({...activity,caseAnswers:[]},attempts,'challenge'),false);assert.equal(additionActivityComplete(activity,attempts,'another-platform'),false);
});

test('content indicator distinguishes the missing public shell from an installed real-count bank',()=>{
 assert.match(renderStudyContentStatus(null,{escape:studyEsc}),/not installed/);const {bank}=additionsFixture();const text=renderStudyContentStatus(bank,{escape:studyEsc});assert.match(text,/1 optional additions/);assert.ok(text.includes(bank.lessons.length+' teaching lessons'));assert.ok(text.includes(bank.id));
});
