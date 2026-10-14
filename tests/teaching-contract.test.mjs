import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {setup} from './scan-harness.mjs';
import {runScanWorkflow,scanRunLabel} from '../archive/authoring/scan-inbox.js';
import {makeWorkbenchLesson} from '../generated-library.js';
import {renderLearnSteps} from '../lesson-tabs.js';
const units=[1,2].map(i=>({key:'U0'+i,title:'Unit '+i,goal:'Calculate safely',focus:'Explain steps',kind:'math',destination:'source',ordering:'independent',prerequisites:[],source_ids:['S1']}));
const section={heading:'Meaning and method',body:'Define voltage and resistance, substitute values, calculate and check the units. '.repeat(4),source_ids:['S1']};
const draft={title:'Current',description:'A hypothetical ideal circuit',objectives:['Explain','Calculate'],sections:[section,{...section,heading:'Check your reasoning'}],questions:Array.from({length:10},(_,i)=>({prompt:'Explain example '+i,answer:'0.005 A',explanation:'5 / 1000 = 0.005 A.',source_ids:['S1']})),activities:[{title:'Predict',prompt:'What happens at twice the voltage?',expected:'Twice the current',explanation:'Resistance stays constant',source_ids:['S1']},{title:'Discuss',prompt:'Why convert kilo-ohms first?',expected:'To use base units',explanation:'1000 ohms per kilo-ohm',source_ids:['S1']}],review_lessons:[]};
const options={payloads:{eu_outline:{chapter_title:'Chapter',rationale:'Two skills',units},eu_draft:draft,eu_review:{ready:true,summary:'Saved extraction reviewed',findings:[]}}};
function controller(h,extra={}){return {getJob:()=>({...h.job,attempts:[...h.attempts].reverse()}),refresh:async()=>{},stage:async body=>{const r=await h.invoke(body);const data=await r.json();if(!r.ok)throw Error(data.error);return data;},...extra};}
test('one scan run creates all reviewed units while approvals remain exclusively human',async()=>{
 const h=setup(options);let checks=0;await runScanWorkflow(controller(h,{beforeChapter:async()=>checks++}));
 assert.equal(checks,1);assert.equal(h.calls.length,7);assert.equal(h.job.lesson.pending.length,2);assert.equal(h.job.lesson.lessons.length,0);assert.equal(h.job.state,'reviewed');
 assert.deepEqual(h.calls.map(x=>x.text.format.name),['eu_plan','eu_analysis','eu_outline','eu_draft','eu_review','eu_draft','eu_review']);
});
test('every paid stage receives one consistent teaching contract and review checks educational quality',async()=>{
 const h=setup(options);await runScanWorkflow(controller(h));
 for(const call of h.calls){
  assert.match(call.instructions,/TEACHING CONTRACT v4/);
  assert.match(call.instructions,/Overview, Learn, Interact, Quiz and Review/);
  assert.match(call.instructions,/FLEXIBLE WORKSHOPS/);assert.match(call.instructions,/combines multiple task-appropriate methods/);assert.match(call.instructions,/not completion of that parent chapter/);assert.match(call.instructions,/do not invent unsupported widget kinds/);
  assert.match(call.instructions,/intermediate steps/);assert.match(call.instructions,/never more than one/);
  assert.match(call.instructions,/untrusted data/);assert.match(call.instructions,/not certified truth/);
 }
 const d=h.calls.find(x=>x.text.format.name==='eu_draft');assert.match(d.instructions,/leave review_lessons empty for an outlined source unit/);
 const review=h.calls.find(x=>x.text.format.name==='eu_review');assert.match(review.instructions,/ready true ONLY/);assert.match(review.instructions,/pedagogically complete/);assert.match(review.instructions,/did not re-inspect/);
});
test('pause after source evidence then resume reuses paid checkpoints and original instructions',async()=>{
 const h=setup(options);let stop=false;const c=controller(h);await runScanWorkflow({...c,learnerContext:'Explain intermediate steps',stopped:()=>stop,stage:async b=>{const v=await c.stage(b);if(b.action==='analyze')stop=true;return v;}});
 assert.equal(h.calls.length,2);assert.equal(h.job.state,'analyzed');
 await runScanWorkflow(controller(h));assert.equal(h.calls.length,7);assert.equal(h.job.analysis.planning_brief.learner_context,'Explain intermediate steps');
});
test('resume polls a saved request instead of resubmitting; unknown attempts halt',async()=>{
 const h=setup({...options,background:true});await h.invoke({action:'plan'});const c=controller(h);
 await runScanWorkflow({...c,stage:async b=>{let r=await c.stage(b);while(r.pending)r=await c.stage({action:'check',jobId:h.job.id,attemptId:r.attemptId});return r;}});
 assert.equal(h.calls.filter(x=>x.method!=='GET').length,7);
 const broken=setup(options);broken.attempts.push({id:'lost',phase:'plan',base_revision:0,status:'unknown'});
 await assert.rejects(runScanWorkflow(controller(broken)),/separately confirmed retry/);assert.equal(broken.calls.length,0);
});
test('source changes and lack of checkpoint progress stop the authorized run',async()=>{
 const h=setup(options);const c=controller(h);await assert.rejects(runScanWorkflow({...c,stage:async b=>{await c.stage(b);h.job.source_pages='999';}}),/Source changed/);
 const no=setup(options);await assert.rejects(runScanWorkflow(controller(no,{stage:async()=>{}})),/did not advance/);assert.equal(no.calls.length,0);
});
test('chapter exposure refusal keeps extraction and outline without drafting',async()=>{
 const h=setup(options);await assert.rejects(runScanWorkflow(controller(h,{beforeChapter:async()=>{throw Error('Budget insufficient')}})),/Budget insufficient/);
 assert.equal(h.calls.length,3);assert.equal(h.job.state,'outlined');assert.equal(h.job.lesson.lessons.length,0);
});
test('verify data detects invalid reviewed source references without generation or reservations',async()=>{
 const h=setup(options);await runScanWorkflow(controller(h));const calls=h.calls.length,spending=h.spending.length;
 h.job.lesson.pending[0].activities[0].source_ids=['S999'];
 const r=await h.invoke({action:'preflight'});const data=await r.json();assert.equal(data.ready,false);assert.match(data.errors.join(' '),/Reviewed draft 1/);
 assert.equal(data.paidModelCallsStarted,0);assert.equal(h.calls.length,calls);assert.equal(h.spending.length,spending);
});
test('run label distinguishes a new scan from saved progress',()=>{
 assert.equal(scanRunLabel({state:'uploaded'}),'Run scan & build lessons');
 for(const job of [{state:'analyzed'},{state:'uploaded',attempts:[{status:'unknown'}]},{state:'uploaded',analysis:{planning_brief:{}}}])assert.equal(scanRunLabel(job),'Resume scan & lessons');
});
test('decimal and scientific answers produce numeric checks and paragraphs display separately',()=>{
 for(const [answer,n,unit] of [['0.005 A',.005,'A'],['1e-6 F',1e-6,'F'],['-5 V',-5,'V'],['.25 W',.25,'W']]){
  const raw={...draft,id:'GEN-NUMERIC',questions:[{...draft.questions[0],answer}],sections:[{...section,body:'First paragraph.\n\nSecond paragraph.'}]};
  const lesson=makeWorkbenchLesson({id:'scan',source_track:'guide'},raw,raw,'unique',0);
  assert.equal(lesson.questions[0].type,'number');assert.equal(lesson.questions[0].answer,n);assert.equal(lesson.questions[0].unit,unit);assert.equal(lesson.questions[0].id,'GEN-NUMERIC-Q01');
  assert.match(lesson.html,/First paragraph\.<\/p><p>/);assert.equal(raw.questions[0].answer,answer);
 }
});
test('unprotected paused endpoints have no dormant provider call; future design contract remains tracked',()=>{
 const lab=readFileSync(new URL('../archive/authoring/ai-model-lab/index.ts',import.meta.url),'utf8');assert.doesNotMatch(lab,/api\.openai\.com|await fetch/);
 const rules=readFileSync(new URL('../AGENTS.md',import.meta.url),'utf8');assert.match(rules,/stable lesson\/question IDs/);assert.match(rules,/No design edit may enable a paid request/);
});

test('generated Learn links a source-related discussion without revealing its answer',()=>{
 const unit={...draft,id:'GEN-DISCUSS'};
 const lesson=makeWorkbenchLesson({id:'source',source_track:'guide'},unit,unit,'unique',0);
 const html=renderLearnSteps(lesson,0);assert.match(html,/Pause and explain/);assert.match(html,/What happens at twice the voltage/);assert.doesNotMatch(html,/Twice the current/);
});
