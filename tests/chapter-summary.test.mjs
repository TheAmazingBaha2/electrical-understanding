import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chapter3Summary} from '../scripts/content/chapter3-summary.mjs';
import {authoredSeries} from './chapter3-series-fixture.mjs';
import {approvedWorkbenchLessons} from '../generated-library.js';
import {sourceIndex} from '../learning-structure.js';
import {renderChapterDashboard,renderSourceSection} from '../source-navigation.js';
import {tabbedLesson} from '../lesson-view.js';
import {lessonActivities,renderActivitySelector} from '../lesson-tabs.js';
import {setup} from './scan-harness.mjs';
const {source,series}=authoredSeries();const summary=chapter3Summary(source);
const job=()=>({...source,state:'approved',lesson:{lessons:[],curated_series:{...series,lessons:[...series.lessons,summary]}}});
test('Chapter 3 gains one final short recap without modifying its original sixteen lessons or question IDs',()=>{
 const j=job(),original=JSON.stringify(j.lesson.curated_series.lessons.slice(0,16)),all=approvedWorkbenchLessons([j]);
 const ctx={activeGeneratedLessons:all,progress:{},hasPassed:()=>false};const ch=sourceIndex(ctx).find(s=>s.id==='associate-cet').chapters.find(ch=>ch.id==='3');
 assert.equal(ch.lessons.length,17);assert.equal(ch.lessons.at(-1).id,'C3-CURATED-SUMMARY');assert.equal(JSON.stringify(j.lesson.curated_series.lessons.slice(0,16)),original);
 assert.equal(all.at(-1).questions.length,16);assert.equal(all.at(-1).chapterSummary,true);assert.ok(all.at(-1).questions.every(q=>q.type==='choice'));
 assert.match(renderChapterDashboard(ctx),/17 lessons mastered · 176 checks/);assert.match(renderSourceSection('ceta',ctx),/CHAPTER WRAP-UP/);
});
test('summary opens directly on key takeaways and offers its quiz without fabricated extra activities',()=>{
 const l=approvedWorkbenchLessons([job()]).at(-1);assert.equal(l.teachingSections.length,1);assert.equal(lessonActivities(l).length,0);
 const html=tabbedLesson({lesson:l,answers:{},score:{correct:0,total:16},passed:false,tab:'overview',activityIndex:0,learnIndex:0,quizIndex:0,questionHtml:()=>''});
 assert.equal((html.match(/<li>/g)||[]).length,16);assert.match(html,/Start the summary quiz/);assert.doesNotMatch(html,/data-reveal-insight|textarea/);
 assert.match(renderActivitySelector(l),/Start the summary quiz/);assert.doesNotMatch(renderActivitySelector(l),/textarea|data-generated-simulator/);
});
test('summary validator accepts flexible seven and twenty-four checks while ordinary lessons keep their depth requirements',async()=>{
 for(const count of [7,24]){
  const payload=structuredClone(summary);payload.questions=Array.from({length:count},(_,i)=>({...summary.questions[i%16],prompt:summary.questions[i%16].prompt+' Check '+i}));
  const h=setup({payloads:{eu_draft:payload}});Object.assign(h.job,{state:'outlined',analysis:{...source.analysis,chapter_outline:{units:[summary.plan]}},lesson:{lessons:[],current:null,pending:[]}});
  const r=await h.invoke({action:'draft'});assert.equal(r.status,200,await r.text());assert.equal(h.job.lesson.current.questions.length,count);
  const normal=setup({payloads:{eu_draft:payload}});Object.assign(normal.job,{state:'outlined',analysis:{...source.analysis,chapter_outline:{units:[{...summary.plan,kind:'math'}]}},lesson:{lessons:[],current:null,pending:[]}});assert.equal((await normal.invoke({action:'draft'})).status,422);
 }
});
test('new complete intake requires one final summary, while old outlines and partial source recovery stay compatible',async()=>{
 const core={key:'U01',title:'Core',goal:'Understand',focus:'Teach a supported skill',kind:'concept',destination:'source',ordering:'independent',prerequisites:[],source_ids:['S1','S2']};
 const wrap={...core,key:'U02',title:'Summary',kind:'summary'};
 for(const [units,expected] of [[[core],422],[[wrap,core],422],[[core,wrap,wrap],422],[[core,wrap],200]]){
  const h=setup({payloads:{eu_outline:{chapter_title:'Covered chapter',rationale:'Two supported skills',units}}});Object.assign(h.job,{state:'analyzed',analysis:{...source.analysis,intake_context:{summary_required:true}}});
  const r=await h.invoke({action:'outline'});assert.equal(r.status,expected,await r.text());
 }
 const legacy=setup({payloads:{eu_outline:{chapter_title:'Old chapter',rationale:'Saved legacy plan',units:[core]}}});Object.assign(legacy.job,{state:'analyzed',analysis:source.analysis});assert.equal((await legacy.invoke({action:'outline'})).status,200);
 const partial=setup();await partial.invoke({action:'register',path:'owner/33333333-3333-4333-8333-333333333333.pdf',title:'Partial material',book:'Guide',pages:'1',track:'guide',partKind:'partial'});assert.equal(partial.job.analysis.intake_context.summary_required,false);assert.equal(partial.calls.length,0);
});
test('summary stays last even when its numeric order is smaller and prompts never impose a sixteen-question quota',()=>{
 const all=approvedWorkbenchLessons([job()]);all.at(-1).curriculum.order=0;const ch=sourceIndex({activeGeneratedLessons:all}).find(s=>s.id==='associate-cet').chapters.find(ch=>ch.id==='3');assert.equal(ch.lessons.at(-1).chapterSummary,true);
 const src=readFileSync(new URL('../supabase/functions/scan-lesson-pipeline/index.ts',import.meta.url),'utf8');assert.match(src,/no target of sixteen/);assert.match(src,/1-40 technical bound/);
});
