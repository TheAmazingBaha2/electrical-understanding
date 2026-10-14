import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {setup} from './scan-harness.mjs';
import {makeWorkbenchLesson,approvedWorkbenchLessons} from '../generated-library.js';
import {lessonActivities,renderActivitySelector} from '../lesson-tabs.js';
const ids=['S1'];
const section={heading:'Explain and apply',body:'Define the quantities and units, substitute the known values, calculate carefully and check the result. '.repeat(3),source_ids:ids};
const activity={title:'Predict the current',prompt:'What changes when voltage doubles at fixed resistance?',expected:'Current doubles',explanation:'I = V/R; R stays fixed.',source_ids:ids,kind:'choice',choices:['Current doubles','Current halves','Current is unchanged'],correct:0,simulator:'none'};
const simulation={...activity,title:'Explore ideal current',prompt:'Move the voltage slider at fixed resistance and compare current.',kind:'simulation',choices:[],correct:-1,simulator:'ohm',expected:'Higher voltage means higher current',explanation:'The slider calculates I = V/R.'};
const unit={id:'U01',key:'U01',title:'Current',kind:'concept',destination:'source',source_ids:ids,ordering:'independent',prerequisites:[]};
function draft(count){return {title:'Current',description:'A source-supported ideal relationship',objectives:['Explain','Calculate'],sections:[section,{...section,heading:'Apply the model'}],questions:Array.from({length:count},(_,i)=>({type:i===count-1?'number':'choice',prompt:'Check example '+i,answer:i===count-1?'0.005 A':'Current doubles',choices:i===count-1?[]:['Current doubles','Current halves','No change'],correct:i===count-1?-1:0,explanation:'Substitute into I = V/R.',source_ids:ids})),activities:[structuredClone(activity),structuredClone(simulation)],review_lessons:[]};}
function prepared(payload){const h=setup({payloads:{eu_draft:payload}});h.job.state='outlined';h.job.analysis={source_title:'Current',overview:'An ideal low-voltage resistor circuit',facts:[{id:'S1',claim:'I = V/R',location:'p1',confidence:'high'},{id:'S2',claim:'Use base SI units',location:'p1',confidence:'high'}],equations:[],safety_notes:[],gaps:[],chapter_outline:{units:[unit]}};h.job.lesson={lessons:[],pending:[],current:null};return h;}
test('seven and twenty-four questions survive provider validation and renderer without padding',async()=>{
 for(const count of [7,24]){
  const h=prepared(draft(count));const r=await h.invoke({action:'draft'});assert.equal(r.status,200,await r.text());
  assert.equal(h.job.lesson.current.questions.length,count);
  const l=makeWorkbenchLesson(h.job,{...h.job.lesson.current,id:'GEN-ADAPTIVE'},h.job.lesson.current,'unique',0);
  assert.equal(l.questions.length,count);assert.equal(l.questions.filter(q=>q.type==='reflection').length,0);
  assert.equal(l.questions[0].type,'choice');assert.equal(l.questions[0].correct,0);assert.equal(l.questions.at(-1).type,'number');
  assert.equal(h.calls[0].text.format.schema.properties.questions.maxItems,40);
  assert.equal(h.calls[0].text.format.schema.properties.activities.maxItems,8);
 }
});
test('clickable predictions and explicit simulators replace title guesses and typed worksheets',()=>{
 const l=makeWorkbenchLesson({id:'job'},unit,draft(7),'unique',0);const tasks=lessonActivities(l);
 assert.deepEqual(tasks.map(t=>t.kind),['generated-choice','generated-simulation']);
 const choice=renderActivitySelector(l,0);assert.match(choice,/type="radio"/);assert.doesNotMatch(choice,/<textarea/);assert.match(choice,/data-generated-correct="0"/);
 const slider=renderActivitySelector(l,1);assert.match(slider,/data-generated-simulator="ohm"/);
});
test('malformed quiz keys, duplicate choices and wrong widget templates fail without publication',async()=>{
 for(const mutate of [p=>p.questions[0].correct=8,p=>p.questions[0].answer='Current halves',p=>p.questions[0].choices[1]=p.questions[0].choices[0],p=>p.activities[1].simulator='execute-code']){
  const p=draft(7);mutate(p);const h=prepared(p);const r=await h.invoke({action:'draft'});assert.equal(r.status,422);assert.equal(h.job.state,'outlined');assert.equal(approvedWorkbenchLessons([h.job]).length,0);assert.equal(h.attempts[0].status,'invalid');
 }
});
test('new format permits zero or one written check and blocks a worksheet dominated by them',async()=>{
 const p=draft(7);for(let i=0;i<2;i++)Object.assign(p.questions[i],{type:'reflection',choices:[],correct:-1});
 const h=prepared(p);assert.equal((await h.invoke({action:'draft'})).status,422);
});
test('old approved short quizzes preserve supplemental stable IDs while new typed quizzes are scalable',()=>{
 const old=draft(7);old.questions.forEach(q=>{delete q.type;delete q.choices;delete q.correct;});
 const l=makeWorkbenchLesson({id:'source'},{id:'GEN-OLD'},old,'unique',0);assert.equal(l.questions.length,10);assert.equal(l.questions[7].id,'GEN-OLD-P08');
 assert.equal(old.questions.length,7);
});
const oldSource=(id,group,owner='owner',book='Test source')=>({id,user_id:owner,source_book:book,source_pages:'pp. 10-12',title:'Earlier subsection',state:'analyzed',analysis:{intake_context:{group,kind:'subsection',part:1},facts:[{id:'S1',claim:'I = V/R',location:'printed p. 10',confidence:'high'}],gaps:[]},lesson:{lessons:[]}});
test('upload snapshots same-book same-theme prior evidence, excluding foreign owners and other themes',async()=>{
 const h=setup({otherJobs:[oldSource('same','DC'),oldSource('wrong-theme','AC'),oldSource('foreign','DC','another-owner'),oldSource('wrong-book','DC','owner','Other book')]});
 const r=await h.invoke({action:'register',path:'owner/33333333-3333-4333-8333-333333333333.pdf',title:'Part two',book:'Test source',pages:'13-15',track:'guide',chapterGroup:'DC',partKind:'partial'});
 assert.equal(r.status,200,await r.text());assert.equal(h.calls.length,0);assert.equal(h.spending.length,0);
 assert.equal(h.job.analysis.intake_context.part,2);assert.equal(h.job.analysis.intake_context.kind,'partial');
 const prior=h.job.analysis.continuity.sources;assert.equal(prior.length,1);assert.equal(prior[0].id,'same');assert.equal(prior[0].facts[0].id,'B1_S1');assert.equal(prior[0].facts[0].original_id,'S1');
 assert.equal(prior[0].facts[0].pages,'pp. 10-12');assert.equal(prior[0].state,'analyzed','Evidence is not claimed human-approved');
 await h.invoke({action:'plan'});await h.invoke({action:'analyze'});
 assert.equal(h.job.analysis.intake_context.part,2);assert.equal(h.job.analysis.continuity.sources[0].id,'same');
 const input=JSON.parse(h.calls[0].input[0].content[0].text);assert.equal(input.source_metadata.intake.kind,'partial');assert.equal(input.source_metadata.continuity.sources.length,1);
});
test('prior-source grounding retains original citations and rejects invented cross-part IDs',async()=>{
 const p=draft(7);p.sections[1].source_ids=['B1_S1'];
 const h=prepared(p);h.job.analysis.continuity={sources:[{id:'previous',facts:[{id:'B1_S1',original_id:'S1',source_job_id:'previous',book:'Test source',pages:'pp. 10-12',location:'printed p. 10',claim:'I = V/R',confidence:'high'}]}]};
 h.job.analysis.chapter_outline.units[0]={...unit,source_ids:['S1','B1_S1']};
 const result=await h.invoke({action:'draft'});assert.equal(result.status,200,await result.text());
 const l=makeWorkbenchLesson(h.job,{...h.job.lesson.current,id:'GEN-ADD'},h.job.lesson.current,'unique',0);
 assert.match(l.html,/pp\. 10-12/);assert.match(l.html,/B1_S1/);
 const bad=prepared(p);assert.equal((await bad.invoke({action:'draft'})).status,422);
});
test('chapter intake controls and durable design rules match new preferences',()=>{
 const s=readFileSync(new URL('../archive/authoring/scan-inbox.js',import.meta.url),'utf8');assert.match(s,/scan-chapter-group/);assert.match(s,/Partial \/ continuing material/);assert.match(s,/partKind:/);
 const contract=readFileSync(new URL('../docs/v2/TEACHING_AND_DESIGN_CONTRACT.md',import.meta.url),'utf8');assert.match(contract,/no target of ten/);assert.match(contract,/optional and limited to one/);assert.match(contract,/namespaced references/);
});

import {simulationCurve} from '../generated-simulations.js';
test('trusted widget graphs follow the formulas and reject invalid numeric state',()=>{
 const ohm=simulationCurve('ohm',[5,1000]);assert.equal(ohm.points.at(-1)[1],24);
 const rc=simulationCurve('rc',[10,5]);assert.ok(Math.abs(rc.points[16][1]-63.212055882855765)<1e-9);
 assert.ok(simulationCurve('xc',[1,100]).points.at(-1)[1]<simulationCurve('xc',[1,100]).points[0][1]);
 assert.ok(simulationCurve('xl',[1,10]).points.at(-1)[1]>simulationCurve('xl',[1,10]).points[0][1]);
 assert.equal(simulationCurve('execute-code',[1,2]),null);assert.equal(simulationCurve('ohm',[5,0]),null);
});
test('first planning refresh discovers earlier parts analyzed after the new part was uploaded',async()=>{
 const prior=oldSource('previous','DC');delete prior.analysis.facts;
 const h=setup({otherJobs:[prior]});
 assert.equal((await h.invoke({action:'register',path:'owner/33333333-3333-4333-8333-333333333333.pdf',title:'Second part',book:'Test source',pages:'13-15',track:'guide',chapterGroup:'DC'})).status,200);
 assert.equal(h.job.analysis.continuity.sources.length,0);
 prior.analysis.facts=[{id:'S1',claim:'Ohms law applies to this ideal resistor.',location:'p10',confidence:'high'}];
 assert.equal((await h.invoke({action:'plan'})).status,200);
 assert.equal(h.job.analysis.continuity.sources[0].id,'previous');
 const input=JSON.parse(h.calls[0].input[0].content[0].text);assert.equal(input.source_metadata.continuity.sources.length,1);
});

import {simulatorCatalog} from '../generated-simulations.js';
test('draft prompt receives exactly the available widget controls, ranges, defaults and units',async()=>{
 const h=prepared(draft(7));assert.equal((await h.invoke({action:'draft'})).status,200);
 const input=JSON.parse(h.calls[0].input);assert.deepEqual(input.supported_widgets,simulatorCatalog);
 assert.match(h.calls[0].instructions,/real widget supports/);
});
