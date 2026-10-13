import test from 'node:test';
import assert from 'node:assert/strict';
import {setup} from './scan-harness.mjs';
import {runChapterBatch} from '../scan-inbox.js';
const section={heading:'Worked example',body:'Explain the known values, symbols, units and the calculation step by step. '.repeat(3),source_ids:['S1']};
const qs=Array.from({length:10},(_,i)=>({prompt:'Calculate and explain example '+(i+1)+'.',answer:'2',explanation:'Substitute the supplied values and check units.',source_ids:['S1']}));
const activities=[{title:'Predict the result',prompt:'What result do you expect?',expected:'2',explanation:'Substitute and calculate.',source_ids:['S1']},
 {title:'Predict the effect of changing a value',prompt:'Which input determines the result?',expected:'The given independent value',explanation:'Trace the given quantities first.',source_ids:['S1']}];
const draft={title:'Practice',description:'Apply the equation.',objectives:['Explain','Calculate'],sections:[section,section],questions:qs,activities,review_lessons:[]};
const units=[1,2,3].map(i=>({key:'U0'+i,title:'Unit '+i,goal:'Use the equation',focus:'Teach the method',kind:'math',destination:'source',ordering:'independent',prerequisites:[],source_ids:['S1']}));
async function chapter(options={}){
 const h=setup({payloads:{eu_outline:{chapter_title:'Chapter',rationale:'Three skills.',units},eu_draft:draft,eu_review:{ready:true,summary:'Checked arithmetic.',findings:[]}},...options});
 for(const action of ['plan','analyze','outline'])assert.equal((await h.invoke({action})).status,200);
 return h;
}
const controller=h=>({getJob:()=>({...h.job,attempts:[...h.attempts].reverse()}),refresh:async()=>{},stage:async body=>{const r=await h.invoke(body);if(!r.ok)throw Error((await r.json()).error);return r.json();}});
test('batch reviews every unit without human approval, then explicit free approval publishes all',async()=>{
 const h=await chapter();await runChapterBatch(controller(h));
 assert.equal(h.calls.length,9);assert.equal(h.job.state,'reviewed');assert.equal(h.job.lesson.lessons.length,0);assert.equal(h.job.lesson.pending.length,3);
 assert.equal(h.job.lesson.current,null);assert.equal(h.spending.length,9);
 const saved=structuredClone(h.job.lesson.pending);
 const stale=h.job.revision-1;assert.equal((await h.invoke({action:'approve-batch',expectedRevision:stale})).status,409);
 assert.equal((await h.invoke({action:'approve-batch'})).status,200);
 assert.equal(h.job.state,'approved');assert.equal(h.job.lesson.pending.length,0);assert.equal(h.job.lesson.lessons.length,3);
 assert.equal(h.job.review.ready,true);assert.equal(h.job.review.unit_reviews.length,3);assert.ok(h.job.approved_at);
 assert.equal(h.calls.length,9);assert.equal(h.spending.length,9);
 assert.deepEqual(h.job.lesson.lessons[0].sections,saved[0].sections);
 assert.equal(h.job.lesson.lessons[0].dashboard_track,'math');
 assert.equal(h.job.lesson.lessons[0].dashboard_ready,true);
});
test('pause and restart retain reviewed pending units and earlier approved objects exactly',async()=>{
 const h=await chapter();for(const action of ['draft','review','approve'])await h.invoke({action});
 const first=structuredClone(h.job.lesson.lessons[0]);let stop=false;
 const c=controller(h),stage=c.stage;
 await runChapterBatch({...c,stopped:()=>stop,stage:async body=>{const r=await stage(body);if(body.action==='queue-reviewed')stop=true;return r;}});
 const pending=structuredClone(h.job.lesson.pending[0]);assert.equal(h.job.lesson.pending.length,1);assert.equal(h.calls.length,7);
 await runChapterBatch(controller(h));assert.equal(h.calls.length,9);assert.deepEqual(h.job.lesson.pending[0],pending);
 await h.invoke({action:'approve-batch'});assert.deepEqual(h.job.lesson.lessons[0],first);
});
test('failed technical review halts before any next paid draft or automatic revision',async()=>{
 const h=await chapter({payloads:{eu_outline:{chapter_title:'Chapter',rationale:'Three skills.',units},eu_draft:draft,eu_review:{ready:false,summary:'Needs correction.',findings:[{severity:'blocker',description:'Fix arithmetic.',source_id:'S1'}]}}});
 await assert.rejects(runChapterBatch(controller(h)),/review requested changes/);assert.equal(h.calls.length,5);assert.equal(h.job.state,'needs_revision');assert.equal(h.job.lesson.pending?.length||0,0);
});
test('queue checkpoint is free, revision-guarded and duplicate queue cannot add a second unit',async()=>{
 const h=await chapter();await h.invoke({action:'draft'});await h.invoke({action:'review'});const revision=h.job.revision;
 const results=await Promise.all([h.invoke({action:'queue-reviewed',expectedRevision:revision}),h.invoke({action:'queue-reviewed',expectedRevision:revision})]);
 assert.equal(results.filter(r=>r.status===200).length,1);assert.equal(h.job.lesson.pending.length,1);assert.equal(h.calls.length,5);
 assert.equal((await h.invoke({action:'approve-batch'})).status,409);
});
test('batch stops on unknown or invalid saved attempts without spending or retrying',async()=>{
 const h=await chapter();h.attempts.push({id:'lost',phase:'draft',job_id:h.job.id,user_id:'owner',base_revision:h.job.revision,status:'unknown'});
 await assert.rejects(runChapterBatch(controller(h)),/separately confirmed retry/);assert.equal(h.calls.length,3);
});

test('saved reviewed drafts enter the next unit prompt but are not treated as human-approved',async()=>{
 const h=await chapter();for(const action of ['draft','review','queue-reviewed','draft'])assert.equal((await h.invoke({action})).status,200);
 const input=JSON.parse(h.calls.at(-1).input);assert.equal(input.selected_unit.id,'U02');assert.equal(input.reviewed_chapter_drafts.length,1);assert.equal(input.approved_chapter_lessons.length,0);
 const before=structuredClone(h.job.lesson.pending);await h.invoke({action:'review'});assert.deepEqual(h.job.lesson.pending,before);
});

import {chapterBatchExposure} from '../scan-inbox.js';
const price={model:'gpt-6.1-sol',tier:'default',valid_until:'2099-01-01',context_tokens:1050000,input_rate:2,cached_rate:.1,write_rate:2.5,long_input:2,output_rate:10,long_output:1.5,safety_multiplier:1.1};
test('batch exposure counts only unfinished calls and fails closed on pricing',async()=>{
 const h=await chapter();const e=chapterBatchExposure(h.job,price);assert.equal(e.requests,6);assert.ok(e.requiredUSD>=35.15984&&e.requiredUSD<=35.15986);
 await h.invoke({action:'draft'});assert.equal(chapterBatchExposure(h.job,price).requests,5);
 await h.invoke({action:'review'});assert.equal(chapterBatchExposure(h.job,price).requests,4);
 await h.invoke({action:'queue-reviewed'});assert.equal(chapterBatchExposure(h.job,price).requests,4);
 assert.throws(()=>chapterBatchExposure(h.job,{...price,valid_until:'2000-01-01'}),/pricing unavailable/);
 assert.throws(()=>chapterBatchExposure(h.job,{...price,output_rate:NaN}),/bounds unavailable/);
});
test('explicit batch restart can retry one proven pre-submission budget denial but never a later failure',async()=>{
 const options={budgetDenied:true,payloads:{eu_outline:{chapter_title:'Chapter',rationale:'Three skills.',units},eu_draft:draft,eu_review:{ready:true,summary:'Checked.',findings:[]}}};
 const h=await chapter();h.attempts.push({id:'denied',job_id:h.job.id,user_id:'owner',base_revision:h.job.revision,phase:'draft',status:'failed',error_message:'Budget reservation refused. No provider request was sent.'});
 await runChapterBatch({...controller(h),initialRetryOf:'denied'});assert.equal(h.job.lesson.pending.length,3);assert.equal(h.calls.length,9);
});


test('approval retains every unit warning and database rejection preserves all pending work',async()=>{
 const h=await chapter({approvalSaveError:true,payloads:{eu_outline:{chapter_title:'Chapter',rationale:'Three skills.',units},eu_draft:draft,eu_review:{ready:true,summary:'Checked with notes.',findings:[{severity:'warning',source_id:'S1',description:'Verify the contextual claim.'}]}}});
 await runChapterBatch(controller(h));const pending=structuredClone(h.job.lesson.pending),calls=h.calls.length;
 const r=await h.invoke({action:'approve-batch'});assert.equal(r.status,503);assert.equal(h.job.state,'reviewed');assert.deepEqual(structuredClone(h.job.lesson.pending),pending);assert.equal(h.calls.length,calls);
 const good=await chapter({payloads:{eu_outline:{chapter_title:'Chapter',rationale:'Three skills.',units},eu_draft:draft,eu_review:{ready:true,summary:'Checked with notes.',findings:[{severity:'warning',source_id:'S1',description:'Verify the contextual claim.'}]}}});
 await runChapterBatch(controller(good));assert.equal((await good.invoke({action:'approve-batch'})).status,200);assert.equal(good.job.review.findings.length,3);assert.equal(good.job.review.findings[0].unit_id,'U01');assert.equal(good.calls.length,9);
});

test('paid Sol draft checkpoints strip generation labels before saving, without extra calls',async()=>{
 const prefixed={...draft,questions:draft.questions.map((question,i)=>({...question,
  prompt:i===0?'Newly authored practice: Calculate the result for the first example.':question.prompt}))};
 const h=await chapter({payloads:{eu_outline:{chapter_title:'Chapter',rationale:'Three skills.',units},
   eu_draft:prefixed,eu_review:{ready:true,summary:'Checked arithmetic.',findings:[]}}});
 const calls=h.calls.length;
 assert.equal((await h.invoke({action:'draft'})).status,200);
 assert.equal(h.calls.length,calls+1);
 assert.equal(h.job.lesson.current.questions[0].prompt,'Calculate the result for the first example.');
 assert.equal(h.job.lesson.current.questions.length,10);
 assert.equal(h.job.state,'drafted');
 assert.equal(prefixed.questions[0].prompt,'Newly authored practice: Calculate the result for the first example.');
});
