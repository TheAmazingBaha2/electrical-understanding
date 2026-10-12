import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {setup} from './scan-harness.mjs';
const extraction=JSON.parse(readFileSync(new URL('./fixtures/astra-completed-extraction.json',import.meta.url)));
const brief={astra_guidance:'Check source.',lesson_guidance:'Teach clearly.',review_guidance:'Check arithmetic.'};
const outline={chapter_title:'Two units',rationale:'Separate skills.',units:[1,2].map(i=>({key:'U0'+i,title:'Unit '+i,goal:'Use the equation.',focus:'Explain its operation.',kind:'math',destination:'source',ordering:'sequential',prerequisites:i===2?['U01']:[],source_ids:['S1']}))};
const section={heading:'Worked example',body:'Explain each symbol and substitute the known values. '.repeat(4),source_ids:['S1']};
const question={prompt:'What is the result?',answer:'2',explanation:'Substitute and calculate.',source_ids:['S1']};
const draft={title:'Practice',description:'Use the source equation.',objectives:['Explain','Calculate'],sections:[section,section],questions:[question,question],review_lessons:[]};
const payloads={eu_analysis:extraction,eu_outline:outline,eu_draft:draft,eu_review:{ready:true,summary:'Checked.',findings:[]}};
function saved(h,phase,payload,status='invalid'){
 const a={id:'saved',job_id:h.job.id,user_id:'owner',phase,model:phase==='analyze'?'gpt-6-astra':'gpt-6.1-sol',base_revision:h.job.revision,status,response_id:'resp_saved',learner_context:'Keep every intermediate step',raw_response:JSON.stringify({id:'resp_saved',status:'completed',output_text:JSON.stringify(payload),usage:{input_tokens:67018,output_tokens:3638}}),output_text:JSON.stringify(payload)};
 h.attempts.push(a);return a;
}
test('real 18-fact Astra output recovers with all 16 equations and no provider or quota calls',async()=>{
 const h=setup();h.job.analysis={planning_brief:brief};const a=saved(h,'analyze',extraction);
 const before=a.raw_response;
 const r=await h.invoke({action:'recover',attemptId:a.id});assert.equal(r.status,200,await r.text());
 assert.equal(h.job.analysis.facts.length,18);assert.equal(h.job.analysis.equations.length,16);
 assert.deepEqual(structuredClone(h.job.analysis.gaps),extraction.gaps);assert.deepEqual(h.job.analysis.planning_brief,brief);
 assert.equal(a.raw_response,before);assert.equal(a.status,'applied');assert.equal(h.job.revision,1);
 assert.equal(h.calls.length,0);assert.equal(h.quotas.length,0);
});
test('free plan recovery retains original learner instructions',async()=>{
 const h=setup();const a=saved(h,'plan',brief);assert.equal((await h.invoke({action:'recover',attemptId:a.id})).status,200);
 assert.equal(h.job.analysis.planning_brief.learner_context,a.learner_context);
});
test('failed atomic apply resumes received output without another generation',async()=>{
 const options={applyError:true};const h=setup(options);
 assert.equal((await h.invoke({action:'plan'})).status,503);assert.equal(h.attempts[0].status,'received');
 options.applyError=false;assert.equal((await h.invoke({action:'resume'})).status,200);
 assert.equal(h.calls.length,1);assert.equal(h.quotas.length,1);assert.equal(h.job.revision,1);
});
test('502 on poll and concurrent repeated resume preserve provider ID and one POST',async()=>{
 const opts={background:true,pollError:true};const h=setup(opts);await h.invoke({action:'plan'});
 const id=h.attempts[0].response_id;assert.equal((await h.invoke({action:'resume'})).status,502);
 assert.equal(h.attempts[0].response_id,id);opts.pollError=false;
 await Promise.all(Array.from({length:5},()=>h.invoke({action:'resume'})));
 assert.equal(h.calls.filter(c=>c.method!=='GET').length,1);assert.equal(h.quotas.length,1);assert.equal(h.job.revision,1);
});
test('running without ID and stale starting submissions never silently resubmit',async()=>{
 for(const status of ['running','starting']){
  const h=setup();h.attempts.push({id:'lost',job_id:h.job.id,user_id:'owner',phase:'plan',status,base_revision:0,created_at:'2000-01-01'});
  for(let i=0;i<4;i++)await h.invoke({action:'resume'});
  assert.equal(h.calls.length,0);assert.equal(h.attempts[0].status,'unknown');
 }
});
test('an unapplied old revision is not falsely marked applied',async()=>{
 const h=setup();const a=saved(h,'plan',brief,'received');h.job.revision=2;
 assert.equal((await h.invoke({action:'check',attemptId:a.id})).status,409);assert.equal(a.status,'received');assert.equal(h.calls.length,0);
});
test('two-unit mock pipeline preserves IDs, evidence and approvals across the next lesson',async()=>{
 const h=setup({payloads});
 for(const action of ['plan','analyze','outline','draft','review','approve']){
  const r=await h.invoke({action});assert.equal(r.status,200,action+': '+await r.text());
 }
 assert.equal(h.job.state,'outlined');assert.equal(h.job.lesson.lessons.length,1);
 const first=structuredClone(h.job.lesson.lessons[0]);
 assert.equal(first.ordering,'independent');assert.deepEqual(first.prerequisites,[]);
 for(const action of ['draft','review','approve']){const r=await h.invoke({action});assert.equal(r.status,200,await r.text());}
 assert.equal(h.job.state,'approved');assert.equal(h.job.lesson.lessons.length,2);
 assert.deepEqual(h.job.lesson.lessons[0],first);assert.equal(h.job.analysis.facts.length,18);
 assert.deepEqual(h.calls.map(c=>c.model),['gpt-6.1-sol','gpt-6-astra','gpt-6.1-sol','gpt-6.1-sol','gpt-6-astra','gpt-6.1-sol','gpt-6-astra']);
 assert.equal(h.calls.filter(c=>Array.isArray(c.input)&&c.input[0].content.some(p=>p.type==='input_file')).length,2);
 assert.equal((await h.invoke({action:'draft'})).status,409);assert.equal(h.calls.length,7);
});
test('free recovery rejects review schema defects and wrong destination just like ordinary apply',async()=>{
 const h=setup();h.job.state='drafted';h.job.analysis=extraction;
 const a=saved(h,'review',{ready:true,summary:'',findings:[]});
 assert.equal((await h.invoke({action:'recover',attemptId:a.id})).status,422);assert.equal(a.status,'invalid');
 const d=setup();d.job.state='outlined';d.job.analysis={...extraction,chapter_outline:{units:[{...outline.units[0],destination:'review'}]}};
 const b=saved(d,'draft',draft);assert.equal((await d.invoke({action:'recover',attemptId:b.id})).status,422);assert.equal(d.calls.length,0);
});
test('malformed evidence references are preserved and rejected, never silently deleted or reassigned',async()=>{
 const h=setup();h.job.analysis={planning_brief:brief};const bad=structuredClone(extraction);bad.facts[1].id=bad.facts[0].id;
 const a=saved(h,'analyze',bad);assert.equal((await h.invoke({action:'recover',attemptId:a.id})).status,422);assert.equal(a.output_text,JSON.stringify(bad));
});
test('missing citation fails before quota; complete chapter rejects draft before quota',async()=>{
 const h=setup();h.job.source_book='';assert.equal((await h.invoke({action:'plan'})).status,409);assert.equal(h.quotas.length,0);
 const c=setup();c.job.state='outlined';c.job.analysis={chapter_outline:{units:[]}};assert.equal((await c.invoke({action:'draft'})).status,409);assert.equal(c.quotas.length,0);
});
test('stale resume and repeated retry authorization cannot pay for the next request',async()=>{
 const h=setup();await h.invoke({action:'plan'});
 assert.equal((await h.invoke({action:'resume',expectedRevision:0})).status,409);assert.equal(h.calls.length,1);
 const f=setup({httpError:true});await f.invoke({action:'plan'});const retryOf=f.attempts[0].id;
 await f.invoke({action:'resume',retry:true,retryOf});assert.equal(f.calls.length,2);
 await f.invoke({action:'resume',retry:true,retryOf});assert.equal(f.calls.length,2);
});
test('provider schemas expose local evidence/text limits before generation',async()=>{
 const h=setup();await h.invoke({action:'plan'});
 assert.equal(h.calls[0].text.format.schema.properties.astra_guidance.maxLength,1800);
 await h.invoke({action:'analyze'});
 const schema=h.calls[1].text.format.schema.properties;
 assert.equal(schema.facts.items.properties.location.maxLength,400);
 assert.equal(schema.equations.maxItems,60);
});
test('cache-write and cached input prices are reflected in saved-output estimates',async()=>{
 const h=setup();h.job.analysis={planning_brief:brief};const a=saved(h,'analyze',extraction,'received');
 const raw=JSON.parse(a.raw_response);raw.usage.input_tokens_details={cached_tokens:0,cache_write_tokens:67015};a.raw_response=JSON.stringify(raw);
 const r=await h.invoke({action:'check',attemptId:a.id});const result=await r.json();
 assert.ok(Math.abs(result.usage.estimatedUSD-1.0196175)<1e-9);assert.equal(h.calls.length,0);
});
test('planning inventory includes approved units inside unfinished chapters but excludes current drafts',async()=>{
 const h=setup({otherJobs:[{id:'other',user_id:'owner',state:'outlined',source_book:'Other source',lesson:{lessons:[{...draft,id:'approved-unit'}],current:{title:'Unapproved secret draft'}}}]});
 await h.invoke({action:'plan'});const input=JSON.parse(h.calls[0].input[0].content[0].text);
 assert.equal(input.existing_lessons.approved[0].id,'approved-unit');
 assert.ok(!JSON.stringify(input).includes('Unapproved secret draft'));
});
