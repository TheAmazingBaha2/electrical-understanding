import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {countProperties,particleState,changeParticle,compareCounts,energyTransition,challengeWorking,challengeAction} from '../foundation-model.js';
import {validateStudyBank,presentedItem,answerStudyItem,availableStudyItem} from '../study-bank.js';
import {conceptEvidence,eligibleStudyItems,startReview,repairReview,makeStudyAttempt,lessonCompletion,DAY_MS} from '../review-engine.js';
import {emptyStudyJournal,mergeStudyJournals,evidenceEvents,studyState,StudyStore} from '../study-journal.js';
import {initialStudyLesson,initialStudyActivity,renderStudyWidget,renderLegacyReviewArchive,renderStudyReview} from '../study-module-view.js';
import {studyFixture} from './foundations-fixture.mjs';
const at=day=>new Date(Date.UTC(2026,0,1)+day*DAY_MS).toISOString();
const intro=(concepts=['count','balance','energy','case'])=>({id:'intro',type:'introduction',at:at(0),stepId:'fixture.step',conceptIds:concepts,sourceIds:['fixture']});
const attempt=(item,day=0,answer='yes',assisted=false,id='a'+day)=>makeStudyAttempt({id,sessionId:'session',item:presentedItem(item,id),answer,at:at(day),assisted});
test('count model preserves independent particle roles and bounded integer state',()=>{
 for(const [electrons,charge] of [[6,0],[5,1],[7,-1]])assert.equal(countProperties({protons:6,neutrons:6,electrons}).netChargeUnits,charge);
 const a={protons:6,neutrons:6,electrons:6},b={protons:6,neutrons:8,electrons:6};assert.deepEqual(compareCounts(a,b),{elementIdentityChanged:false,isotopeChanged:true,changedCounts:['neutrons'],atomicNumber:6,nuclearParticleCount:14,netChargeUnits:0});
 const c=countProperties({...b,electrons:5});assert.equal(c.identity,'carbon');assert.equal(c.nuclearParticleCount,14);assert.equal(c.netChargeUnits,1);assert.equal(c.pairedCharges,5);
 assert.deepEqual(changeParticle(a,'add-proton'),{protons:7,neutrons:6,electrons:6});
 for(const n of [-1,.1,NaN,Infinity,21])assert.throws(()=>particleState({...a,electrons:n}));assert.deepEqual(a,{protons:6,neutrons:6,electrons:6});
 assert.equal(energyTransition('lower','higher').energyDirection,'gain');assert.equal(energyTransition('higher','lower').energyDirection,'loss');assert.equal(energyTransition('higher','lower').particleCountsChanged,false);
});
test('bank validation, stable option IDs, immutable presentation snapshots and pre-reveal output',()=>{
 const bank=validateStudyBank(studyFixture()),item=bank.questions[0];for(const seed of ['one','two','three']){const p=presentedItem(item,seed);assert.equal(answerStudyItem(p,'yes').correct,true);assert.deepEqual(p,presentedItem(item,seed));}
 const bad=structuredClone(bank);bad.questions[0].options[0].id='no';assert.throws(()=>validateStudyBank(bad));
 for(const challenge of bank.challenges.slice(0,3)){const html=renderStudyWidget(bank,challenge,{phase:'prediction',prediction:null,working:challengeWorking(challenge),caseAnswers:[],caseIndex:0,caseCount:0});assert.doesNotMatch(html,/Synthetic comparison explained|net charge in unit-charge|nuclear particle count|Prediction matched/);assert.match(html,/Commit prediction/);}
});
test('review excludes unread and flagged-only concepts and remains bounded with distinct repairs',()=>{
 const bank=studyFixture();assert.deepEqual(eligibleStudyItems(bank,[]),[]);assert.equal(startReview(bank,[{id:'flag',type:'flag',at:at(0),conceptId:'count',flagged:true}],{id:'empty',at:at(0)}).tasks.length,0);
 const ev=[intro()],s=startReview(bank,ev,{id:'review',at:at(0)});assert.equal(s.tasks.length,4);assert.equal(new Set(s.tasks.map(t=>t.item.primaryConceptId)).size,4);
 const a={...attempt(s.tasks[0].item,0,'no'),taskId:s.tasks[0].id},next=repairReview(bank,[...ev,a],s,a);assert.ok(next.tasks.length<=5);assert.equal(next.tasks[1].assisted,true);assert.notEqual(next.tasks[1].item.variantFamilyId,a.item.variantFamilyId);assert.equal(next.tasks[1].parentAttemptId,a.id);
 const second={...attempt(next.tasks[1].item,0,'no',true,'retry'),taskId:next.tasks[1].id};next.cursor=1;assert.equal(repairReview(bank,[...ev,a,second],next,second).tasks.length,next.tasks.length);
});
test('scheduling distinguishes independent first outcomes, same-day practice, misses and spaced retention',()=>{
 const b=studyFixture(),q=b.questions[0],q2=b.questions[1];let ev=[intro(['count']),attempt(q,0)];let s=conceptEvidence(ev,{now:Date.parse(at(0))}).count;assert.equal(s.dueAt,Date.parse(at(1)));assert.equal(s.qualifying,1);
 ev.push(attempt(q2,.2,'yes',false,'same-day'));s=conceptEvidence(ev).count;assert.equal(s.qualifying,1);assert.equal(s.lastSpacingAdvancementAt,Date.parse(at(0)));
 ev.push(attempt(q2,1.3));ev.push(attempt(q,3));s=conceptEvidence(ev).count;assert.equal(s.label,'Retaining');assert.equal(s.variants.length,2);assert.equal(s.qualifying,3);
 ev.push(attempt(q2,4,'no'));ev.push(attempt(q,4,'yes',true,'assisted'));s=conceptEvidence(ev).count;assert.equal(s.label,'Needs practice');assert.equal(s.qualifying,0);assert.equal(s.assisted,1);assert.equal(s.misses,1);
 ev.push(attempt(q2,4.5,'yes',false,'too-soon'));assert.equal(conceptEvidence(ev).count.label,'Needs practice');
 ev.push(attempt(q,5.2));assert.equal(conceptEvidence(ev).count.label,'Building confidence');
});
test('attempt-based completion remains independent from correctness and requires actual activity action',()=>{
 const b=studyFixture(),l=b.lessons[0],state=initialStudyLesson(b,l);state.acknowledged=l.steps.map(s=>s.id);const ev=l.requiredIds.map((id,i)=>({...attempt(b.questions.find(q=>q.id===id),0,'no',false,'wrong'+i),sessionId:state.id}));
 assert.equal(lessonCompletion(l,state,ev).complete,false);state.activity.phase='committed';assert.equal(lessonCompletion(l,state,ev).complete,false);state.activity.phase='revealed';assert.equal(lessonCompletion(l,state,ev).complete,false);const challenge=b.challenges[0],prediction=makeStudyAttempt({id:'prediction',sessionId:state.id,item:presentedItem(challenge,'prediction'),answer:{comparison:'b'},at:at(0)});ev.push(prediction);state.activity.attemptId='prediction';state.activity.comparisonAttempted=true;state.activity.attemptedWorking={actionCount:1};assert.equal(lessonCompletion(l,state,ev).complete,true);state.activity.working=challengeWorking(challenge);assert.equal(lessonCompletion(l,state,ev).complete,true);
});
test('event replay/merge is idempotent and competing working copies retain both histories',()=>{
 const b=studyFixture(),base=emptyStudyJournal('owner'),a=attempt(b.questions[0]),one={...base,events:[intro(),a]};assert.equal(mergeStudyJournals(one,one).events.length,2);assert.deepEqual(conceptEvidence(evidenceEvents(mergeStudyJournals(one,one))),conceptEvidence(one.events));
 const changed={...attempt(b.questions[0],0,'no',false,a.id)};const conflict=mergeStudyJournals(one,{...base,events:[changed]});assert.equal(conflict.conflicts.length,1);assert.equal(evidenceEvents(conflict).filter(e=>e.type==='attempt').length,0);
 const states=['a','b'].map(id=>({id,type:'state',at:at(0),target:'lesson',parentId:null,value:{step:id}}));const merged=mergeStudyJournals({...base,events:[states[0]]},{...base,events:[states[1]]});assert.equal(studyState(merged,'lesson').conflicted,true);assert.equal(studyState(merged,'lesson').candidates.length,2);
});
test('existing locked backup transaction retains legacy bytes, active phase and exact question order',async()=>{
 const map=new Map([['eu_demo_v1','{"untouched":true}']]),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),key:i=>[...map.keys()][i],get length(){return map.size}},locks={request:async(k,fn)=>fn()};
 const before=createHash('sha256').update(storage.getItem('eu_demo_v1')).digest('hex'),s=new StudyStore(storage,null,locks),value=initialStudyLesson(studyFixture(),studyFixture().lessons[0]);value.activity.phase='committed';
 const first=await s.updateState('lesson',null,value,[],{id:'state1',at:at(0)});assert.equal(first.conflicted,false);assert.deepEqual(studyState(new StudyStore(storage,null,locks).read(),'lesson').value,value);
 const stale=await s.updateState('lesson',null,{...value,step:1},[],{id:'state2',at:at(1)});assert.equal(stale.conflicted,true);assert.equal(studyState(s.read(),'lesson').conflicted,true);await s.resolve('lesson','state1');assert.equal(studyState(s.read(),'lesson').value.step,0);
 assert.equal(createHash('sha256').update(storage.getItem('eu_demo_v1')).digest('hex'),before);assert.ok(s.backups().length>=3);
 const recovered=new StudyStore({getItem:()=>null,setItem(){},length:0,key(){}},null,locks);await assert.rejects(()=>recovered.import({format:'wrong'}));
});
test('legacy archive is view-only and empty V3 hub never manufactures evidence',()=>{
 const lessons=[{id:'old',module:'Original',title:'Original lesson',questions:[{id:'old-q',prompt:'Original check'}]}],progress={old:{answers:{'old-q':{value:'a',correct:false,attempts:3,reviewDue:1}}}};const before=structuredClone(progress),html=renderLegacyReviewArchive(lessons,progress);assert.deepEqual(progress,before);assert.match(html,/Read only|Read only/i);assert.match(html,/Recorded needs review/);assert.doesNotMatch(html,/data-submit|data-study-submit|data-question=/);assert.match(renderStudyReview(studyFixture(),emptyStudyJournal()),/No topics have been introduced/);
});
test('default review caps compact tasks, budgets repairs, and retains exact source snapshots',()=>{
 const bank=studyFixture(),events=[intro()],session=startReview(bank,events,{id:'bounded',at:at(0),limit:4});
 assert.equal(session.tasks.filter(t=>t.item.kind==='widget_challenge').length,1);assert.deepEqual(session.tasks[0].item.sourceSnapshot,bank.sources);
 let s=session;for(let cursor=0;cursor<s.tasks.length;cursor++){
  s.cursor=cursor;const task=s.tasks[cursor];if(task.item.kind!=='single_choice')continue;
  const a={...attempt(task.item,0,'no',task.assisted,'bounded'+cursor),taskId:task.id};events.push(a);s=repairReview(bank,events,s,a);assert.ok(s.tasks.length<=4);
 }
 assert.ok(Object.values(s.repairs).every(n=>n===1));
 const compact=initialStudyActivity(bank.challenges[3],{compact:true});assert.equal(compact.caseCount,1);const cases=bank.challenges[3].config.cases;const one=makeStudyAttempt({id:'case-one',sessionId:'cases',item:bank.challenges[3],answer:'element',caseId:cases[0].id,at:at(0)}),two=makeStudyAttempt({id:'case-two',sessionId:'cases',item:bank.challenges[3],answer:'mixture',caseId:cases[1].id,at:at(0)});assert.notEqual(one.item.variantId,two.item.variantId);
});
test('many local saves deduplicate presentations, retain all working revisions and bound redundant backups',async()=>{
 const map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>{const total=[...map.entries()].reduce((n,[key,value])=>n+(key===k?0:value.length),0)+v.length;if(total>4000000)throw Error('quota');map.set(k,v)},removeItem:k=>map.delete(k),key:i=>[...map.keys()][i],get length(){return map.size}},locks={request:async(k,fn)=>fn()},store=new StudyStore(storage,null,locks),bank=studyFixture(),state=initialStudyLesson(bank,bank.lessons[0]);
 let parent=null;for(let i=0;i<80;i++){state.step=i;const result=await store.updateState('test',parent,state,[],{id:'working'+i,at:at(i/100)});assert.equal(result.conflicted,false);parent='working'+i;}
 const doc=store.read();assert.equal(doc.events.filter(e=>e.type==='presentation').length,2);assert.equal(doc.events.filter(e=>e.type==='state').length,80);assert.equal(studyState(doc,'test').value.step,79);assert.ok(store.backups().length<=2);
 const restored=JSON.parse(store.export());assert.equal(restored.journal.events.length,82);assert.ok([...map.values()].reduce((n,v)=>n+v.length,0)<4000000);
});

test('saved review cannot activate an absent or retired content bank',()=>{
 const bank=studyFixture(),session=startReview(bank,[intro()],{id:'saved',at:at(0)}),journal={...emptyStudyJournal(),events:[intro(),{id:'saved-state',type:'state',target:'review.active',parentId:null,at:at(0),value:session}]};
 assert.equal(availableStudyItem(null,session.tasks[0].item),false);assert.doesNotMatch(renderStudyReview(null,journal),/data-study-submit|data-study-predict/);assert.match(renderStudyReview(null,journal),/matching approved lesson bank/);
 const retired=structuredClone(bank);retired.questions.find(q=>q.id===session.tasks[0].item.id).retired=true;assert.equal(availableStudyItem(retired,session.tasks[0].item),false);assert.equal(journal.events.length,2);
});
