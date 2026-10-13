import test from 'node:test';
import assert from 'node:assert/strict';
import {authoredSeries} from './chapter3-series-fixture.mjs';
import {setup} from './scan-harness.mjs';
import {approvedWorkbenchLessons} from '../generated-library.js';
import {legacyGroup} from '../legacy-groups.js';
import {renderSourceSection,renderMathPractice} from '../source-navigation.js';
import {lessonOverview} from '../lesson-overviews.js';
import {tabbedLesson} from '../lesson-view.js';
import {simulationCurve,simulatorCatalog} from '../generated-simulations.js';
const {source,series}=authoredSeries();
const active=()=>approvedWorkbenchLessons([{...source,state:'approved',lesson:{lessons:[],curated_series:series}}]);
test('sixteen authored lessons have variable selectable quizzes, supported widgets and unique identities',()=>{
 assert.equal(series.lessons.length,16);
 assert.equal(series.lessons.reduce((n,l)=>n+l.questions.length,0),160);
 assert.equal(series.lessons.reduce((n,l)=>n+l.activities.length,0),37);
 assert.ok(new Set(series.lessons.map(l=>l.questions.length)).size>3);
 const ids=series.lessons.flatMap(l=>[l.id,...l.questions.map(q=>q.id)]);assert.equal(new Set(ids).size,ids.length);
 for(const l of active()){
  assert.equal(legacyGroup(l),null);assert.equal(l.archived,false);assert.equal(l.libraryView,'ceta');
  assert.equal(l.sourceTrack,'guide');assert.equal(l.seriesId,series.id);
  assert.ok(l.questions.every(q=>['number','choice'].includes(q.type)));
  assert.ok(l.activities.every(a=>a.kind==='choice'||(a.kind==='simulation'&&simulatorCatalog[a.simulator])));
  assert.match(lessonOverview(l),/CHAPTER 3/);assert.ok(l.teachingSections.length>=4);
 }
});
test('every authored lesson passes the actual paid-pipeline draft validator using mocked responses',async()=>{
 for(const l of series.lessons){
  const h=setup({payloads:{eu_draft:l}});Object.assign(h.job,{state:'outlined',analysis:{...source.analysis,chapter_outline:{units:[l.plan]}},lesson:{lessons:[],current:null,pending:[]}});
  const r=await h.invoke({action:'draft'});assert.equal(r.status,200,l.title+': '+await r.text());
  assert.equal(h.job.lesson.current.questions.length,l.questions.length);
 }
});
test('additive publication preserves the original sixteen IDs and keeps pending curation out of inventory',()=>{
 const originals=series.lessons.map((l,i)=>({...l,id:'ORIGINAL-'+i,curated:false,series_id:undefined,series_order:undefined}));
 const job={...source,state:'approved',lesson:{lessons:originals,curated_series:series}};
 const before=JSON.stringify(job.lesson.lessons),inventory=approvedWorkbenchLessons([job]);
 assert.equal(inventory.length,32);assert.equal(inventory.filter(l=>l.archived).length,16);assert.equal(inventory.filter(l=>!l.archived).length,16);
 assert.equal(JSON.stringify(job.lesson.lessons),before);assert.deepEqual(inventory.filter(l=>l.archived).map(l=>l.id),originals.map(l=>l.id));
 job.lesson.curated_series={...series,status:'draft'};assert.equal(approvedWorkbenchLessons([job]).length,16);
 job.state='reviewed';job.lesson.lessons=[];job.lesson.curated_series=series;assert.equal(approvedWorkbenchLessons([job]).length,0);
});
test('math cards and lesson continuation use generated routes without a duplicate collection',()=>{
 const lessons=active(),html=renderSourceSection('ceta',{activeMathLessons:[],activeGeneratedLessons:lessons});
 assert.equal((html.match(/class="chapter-lesson"/g)||[]).length,16);
 assert.equal((html.match(/data-goto="generated-lesson"/g)||[]).length,16);assert.match(html,/22 chapters · 16 lessons/);assert.doesNotMatch(renderMathPractice({activeGeneratedLessons:lessons}),/data-content-lesson=/);
 const result=tabbedLesson({lesson:lessons[0],answers:{},passed:true,score:{correct:8,total:8},nextLesson:lessons[1],tab:'review',activityIndex:0,learnIndex:0,quizIndex:0,questionHtml:()=>''});
 assert.match(result,/data-goto="generated-lesson" data-lesson="C3-CURATED-U02"/);
});
test('power graph follows the quadratic relation at fixed resistance',()=>{
 const p=simulationCurve('power',[5,1000]);assert.equal(p.points.at(-1)[1],576);
 assert.equal(p.points[40][1]/p.points[20][1],4);
});
test('free data verification includes the additive series and rejects broken citations without provider calls',async()=>{
 const h=setup();Object.assign(h.job,{state:'approved',source_book:'Test',source_pages:'16–24',analysis:source.analysis,lesson:{lessons:[],curated_series:{...series,source_scan_id:h.job.id}}});
 let r=await h.invoke({action:'preflight'});assert.equal(r.status,200);let data=await r.json();assert.ok(data.notes.some(n=>n.includes('16 separately authored')));
 h.job.lesson.curated_series=structuredClone(h.job.lesson.curated_series);h.job.lesson.curated_series.lessons[0].questions[0].source_ids=['MISSING'];
 r=await h.invoke({action:'preflight'});data=await r.json();assert.ok(data.errors.some(n=>n.includes('Curated lesson')));assert.equal(h.calls.length,0);assert.equal(h.spending.length,0);
});
