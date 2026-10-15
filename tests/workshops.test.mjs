import {referencePages} from '../generated-library.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {geierChapters} from '../geier-catalog.js';
import {geierWorkshops,toolCards,reviseDmmLessons} from '../geier-workshops.js';
import {evaluateWorkshopActivity,simulationReading,workshopMethods} from '../workshop-widgets.js';
import {lessonRequirementsMet,workshopActivityProgress,workshopCheckUpdate} from '../workshop-progress.js';
import {bookLessons} from '../book-lessons.js';
import {sourceIndex,learningProgress,nextSourceLesson,lessonReferencePages} from '../learning-structure.js';
import {renderSourceSection,renderChapterDashboard} from '../source-navigation.js';
import {tabbedLesson} from '../lesson-view.js';
import {migrateLesson,ProgressStore,equal} from '../persistence.js';
const ctx={bookLessons:[...reviseDmmLessons(bookLessons),...geierWorkshops],progress:{},hasPassed:()=>false};
const solution=a=>a.fields?{fields:Object.fromEntries(a.fields.map(f=>[f.id,f.answer]))}:a.kind==='inspect'?{selected:a.items.filter(i=>i.problem).map(i=>i.id)}:a.kind==='sequence'?{order:a.correctOrder}:{decisions:a.cases.map(c=>String(c.correct))};
test('verified 15-chapter book retains original DMM records and appends source-bound series',()=>{
 assert.equal(geierChapters.length,15);assert.equal(geierChapters[5].title,'Working Your Weapons: Using Test Equipment');
 const source=sourceIndex(ctx).find(s=>s.id==='geier');
 assert.equal(source.chapters.find(c=>c.id==='2').lessons.length,11);
 const six=source.chapters.find(c=>c.id==='6');assert.equal(six.lessons.length,5);assert.equal(six.lessons[0].id,'BDMM-01');assert.equal(six.lessons[1].id,'BDMM-02');assert.match(six.coverage,/Partial/);
 assert.equal(six.lessons.filter(l=>l.chapterSummary).length,0);assert.equal(source.chapters.find(c=>c.id==='2').lessons.at(-1).chapterSummary,true);
 assert.match(renderSourceSection('textbooks',ctx),/2 topic groups/);assert.match(renderChapterDashboard(ctx),/data-dashboard-source="practical-electronics"/);
 assert.deepEqual(bookLessons.map(l=>l.id),['BDMM-01','BDMM-02']);
 assert.equal(nextSourceLesson(bookLessons[0],ctx.bookLessons).id,'BDMM-02');
 assert.equal(nextSourceLesson(bookLessons[1],ctx.bookLessons).id,'GEIER-C6-W03');
 assert.equal(nextSourceLesson(geierWorkshops.find(l=>l.chapterSummary),ctx.bookLessons),null);
});
test('workshops vary depth and methods without fixed time, response or question quotas',()=>{
 const normal=geierWorkshops.filter(l=>l.workshop);assert.equal(normal.length,13);
 const ids=new Set();for(const l of geierWorkshops){assert.equal(l.curriculum.section,'textbooks');assert.equal(l.curriculum.source_id,'geier');assert.equal(l.minutes,undefined);for(const q of l.questions){assert.equal(q.type,'choice');assert.ok(q.correct>=0&&q.correct<q.choices.length);assert.ok(!ids.has(q.id));ids.add(q.id);}}
 for(const l of normal){assert.ok(new Set(l.activities.map(a=>a.kind)).size>=2,l.id);assert.ok(l.sections.every(s=>s.paragraphs.length>=2));for(const a of l.activities){assert.ok(workshopMethods.includes(a.kind));assert.ok(!ids.has(a.id));ids.add(a.id);}}
 assert.ok(new Set(normal.map(l=>l.questions.length)).size>=4);assert.ok(toolCards.length>=25);
 const summary=geierWorkshops.find(l=>l.chapterSummary);assert.equal(summary.activities.length,0);assert.equal(summary.coveredLessonIds.length,10);assert.match(summary.html,/chapter-takeaways/);
});
test('checkpoint validators reject incomplete and incorrect work, accept all authored solutions',()=>{
 for(const l of geierWorkshops.filter(l=>l.workshop))for(const a of l.activities.filter(a=>a.required!==false)){
  assert.equal(evaluateWorkshopActivity(a,{}).correct,false,a.id);
  assert.equal(evaluateWorkshopActivity(a,solution(a)).correct,true,a.id);
  const bad=solution(a);if(a.fields)bad.fields[a.fields[0].id]='wrong';else if(a.kind==='inspect')bad.selected.push('extraneous');else if(a.kind==='sequence')bad.order=[...bad.order].reverse();else bad.decisions[0]='';
  assert.equal(evaluateWorkshopActivity(a,bad).correct,false,a.id);
 }
});
test('instrument models distinguish unsafe preparation, parallel paths, waveform RMS and burden',()=>{
 assert.equal(simulationReading('resistance',{power:'on',energy:'clear',isolate:'isolated'}).display,'TEST BLOCKED');
 assert.equal(simulationReading('resistance',{power:'off',energy:'clear',isolate:'connected'}).display,'50 Ω');
 assert.equal(simulationReading('resistance',{power:'off',energy:'clear',isolate:'isolated'}).display,'100 Ω');
 assert.equal(simulationReading('current',{power:'on',mode:'current',jack:'current',connection:'across'}).display,'NOT READY');
 assert.equal(simulationReading('current',{power:'off',mode:'current',jack:'current',connection:'series'}).display,'READY · 5 mA');
 assert.equal(simulationReading('rms',{wave:'sine'}).display,'1.414 V RMS');assert.equal(simulationReading('rms',{wave:'square'}).display,'2.000 V RMS');
 assert.match(simulationReading('burden',{shunt:'100'}).display,/4.545 mA/);assert.match(simulationReading('burden',{shunt:'100'}).note,/0.455 V/);
 assert.equal(simulationReading('diode',{condition:'short'}).display,'0.00 V / 0.00 V');
});
test('new completion and dashboard include required activity results, never reference views or stale keys',()=>{
 const l=geierWorkshops[0],state={answers:Object.fromEntries(l.questions.map(q=>[q.id,{correct:true}])),workshopChecks:{stale:{correct:true}},complete:true};
 assert.equal(lessonRequirementsMet(l,state),false);assert.equal(workshopActivityProgress(l,state).correct,0);
 const before=learningProgress([l],{progress:{[l.id]:state}});assert.equal(before.total,l.questions.length+3);assert.equal(before.correct,l.questions.length);
 for(const a of l.activities)state.workshopChecks[a.id]=workshopCheckUpdate(undefined,solution(a),true,1000);
 assert.equal(lessonRequirementsMet(l,state),true);assert.equal(learningProgress([l],{progress:{[l.id]:state}}).percent,100);
 state.answers[l.questions.find(q=>q.safety).id].correct=false;assert.equal(lessonRequirementsMet(l,state),false);
 const catalogLesson=geierWorkshops[1];assert.equal(workshopActivityProgress(catalogLesson).total,2);
});
test('activity state survives existing storage migration, export/import and whole-lesson conflict handling',async()=>{
 const l=geierWorkshops[0],state={answers:{old:{correct:true,reviewDue:44}},workshopChecks:{[l.activities[0].id]:workshopCheckUpdate(undefined,solution(l.activities[0]),true,1000)},unknownField:'retain'};
 assert.ok(equal(migrateLesson(state).workshopChecks,state.workshopChecks));assert.equal(migrateLesson(state).answers.old.reviewDue,44);
 const storage=new Map(),adapter={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),key:i=>[...storage.keys()][i],get length(){return storage.size}},locks={request:async(k,fn)=>fn()};
 const store=new ProgressStore(adapter,null,locks);await store.edit(l.id,s=>Object.assign(s,state));const exported=JSON.parse(store.export());
 const otherStorage=new Map(),other=new ProgressStore({...adapter,getItem:k=>otherStorage.get(k)??null,setItem:(k,v)=>otherStorage.set(k,v),key:i=>[...otherStorage.keys()][i],get length(){return otherStorage.size}},null,locks);
 await other.import(exported);assert.ok(equal(other.read().progress[l.id].workshopChecks,state.workshopChecks));assert.equal(other.read().progress[l.id].unknownField,'retain');
 await other.edit(l.id,s=>s.workshopChecks[l.activities[0].id].correct=false);await other.import(exported);
 assert.equal(other.read().conflicts[l.id].incoming.workshopChecks[l.activities[0].id].correct,true);assert.equal(other.read().progress[l.id].workshopChecks[l.activities[0].id].correct,false);
});
test('five-tab workshop view has correct source return, self-paced label and checkpoint review',()=>{
 const l=geierWorkshops[0];const c={lesson:l,answers:{},score:{correct:0,total:l.questions.length},passed:false,questionHtml:()=>''};
 const overview=tabbedLesson({...c,tab:'overview'});assert.match(overview,/Self-paced workshop/);assert.doesNotMatch(overview,/undefined minutes/);assert.match(overview,/Chapter 2, pp. 5–8/);assert.match(overview,/workshop-tool-reference/);
 const review=tabbedLesson({...c,tab:'review'});assert.match(review,/data-goto="lessons" data-lesson="practical-electronics:electronic-tools"/);assert.match(review,/Workshop checkpoints/);
 const interactive=tabbedLesson({...c,tab:'interact',activityIndex:0});assert.match(interactive,/data-workshop-activity="GEIER-C2-W01-A01"/);assert.doesNotMatch(interactive,/textarea|legacy.*workbench/);
});

test('existing cloud sync transports complete workshop checkpoint state and preserves concurrent copies',async()=>{
 const l=geierWorkshops[0],data={answers:{old:{correct:true,reviewDue:44}},workshopChecks:{[l.activities[0].id]:workshopCheckUpdate(undefined,solution(l.activities[0]),true,1000)}};
 const locks={request:async(k,fn)=>fn()},storage=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),key:i=>[...m.keys()][i],get length(){return m.size}};};
 const first=new ProgressStore(storage(),'fixture-owner',locks),second=new ProgressStore(storage(),'fixture-owner',locks);let row=null;
 const transport={list:async()=>row?[structuredClone(row)]:[],compareAndSet:async(id,state,revision)=>{assert.equal(revision,row?.revision??null);row={lesson_id:id,data:structuredClone(state),revision:revision===null?0:revision+1};return structuredClone(row);}};
 await first.edit(l.id,s=>Object.assign(s,data));await first.sync(transport);await second.sync(transport);
 assert.ok(equal(second.read().progress[l.id].workshopChecks,data.workshopChecks));assert.equal(second.read().progress[l.id].answers.old.reviewDue,44);
 await first.edit(l.id,s=>s.workshopChecks[l.activities[0].id].correct=false);await second.edit(l.id,s=>s.answers.new={correct:true});await first.sync(transport);await second.sync(transport);
 assert.equal(second.read().conflicts[l.id].incoming.workshopChecks[l.activities[0].id].correct,false);assert.equal(second.read().progress[l.id].workshopChecks[l.activities[0].id].correct,true);assert.equal(second.read().progress[l.id].answers.new.correct,true);
});

test('authorized DMM revisions preserve exact questions and add independently saved mixed-method checkpoints',()=>{
 const revised=reviseDmmLessons(bookLessons);
 for(const [i,l] of revised.entries()){assert.equal(l.id,bookLessons[i].id);assert.equal(l.questions,bookLessons[i].questions);assert.equal(l.workshop,true);assert.equal(l.independent,true);assert.equal(l.minutes,undefined);assert.equal(l.activities.length,3);assert.ok(new Set(l.activities.map(a=>a.kind)).size>=2);assert.equal(l.curriculum.order,i+1);assert.equal(l.curriculum.dashboard,true);assert.equal(lessonRequirementsMet(l,{complete:true,answers:Object.fromEntries(l.questions.map(q=>[q.id,{correct:true}]))}),false);for(const a of l.activities)assert.equal(evaluateWorkshopActivity(a,solution(a)).correct,true);}
 assert.equal(simulationReading('voltage',{mode:'dc',jack:'volts',red:'common',black:'source',switch:'closed',range:'20'}).display,'−5.00 V'.replace('−','-'));
 assert.equal(simulationReading('voltage',{mode:'dc',jack:'volts',red:'load',black:'common',switch:'open',range:'20'}).display,'+0.00 V');
 assert.equal(simulationReading('voltage',{mode:'current',jack:'current'}).display,'TEST BLOCKED');
});
test('references sit between card description and completion with no invented book pages',()=>{
 const menu=renderSourceSection('textbooks',ctx),dashboard=renderChapterDashboard(ctx);
 for(const html of [menu,dashboard]){const start=html.indexOf('data-content-lesson="BDMM-01"'),end=html.indexOf('</article>',start),card=html.slice(start,end);assert.match(card,/Reference pages:<\/strong> 97–98/);assert.ok(card.indexOf('5.04 V')<card.indexOf('Reference pages:'));assert.ok(card.indexOf('Reference pages:')<card.indexOf('correct ·'));}
 assert.equal(lessonReferencePages({id:'EIM-BEC-PRELAB'}),'1–12');assert.equal(lessonReferencePages({id:'EIM-BEC-DC02'}),'21–27');assert.match(lessonReferencePages({id:'CETA-G03-01'}),/table of contents only/);assert.match(lessonReferencePages({subtrack:'math'}),/no book pages/);assert.match(lessonReferencePages({generated:true}),/Not recorded/);
});

test('approved page references use only cited current-source printed locations with upload-range fallback',()=>{
 const job={source_pages:'16–24',analysis:{facts:[{id:'S1',confidence:'high',location:'Printed p. 18, upper column'},{id:'S2',confidence:'high',location:'Printed pp. 19–20, figure'},{id:'S3',confidence:'uncertain',location:'Printed p. 88'},{id:'S4',confidence:'high',location:'Printed p. 77',source_job_id:'earlier'}]}};
 assert.equal(referencePages(job,[{source_ids:['S1','S2','S3','S4']}]),'18, 19–20');assert.equal(referencePages(job,[{source_ids:['missing']}]),'16–24');assert.equal(lessonReferencePages({curriculum:{section:'textbooks',source_id:'future-book'}}),'Not recorded for this source');
});
