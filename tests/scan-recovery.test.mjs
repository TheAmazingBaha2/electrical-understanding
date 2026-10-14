import test from 'node:test';
import assert from 'node:assert/strict';
import {setup} from './scan-harness.mjs';
import {buttonFor} from '../archive/authoring/scan-inbox.js';
test('background Resume polls the original response and does not reserve another paid call',async()=>{
 const h=setup({background:true});
 const start=await h.invoke({action:'plan',learnerContext:'Fractions'});assert.equal(start.status,202);
 const pending=await start.json();assert.ok(h.attempts[0].response_id);assert.equal(h.attempts[0].status,'running');
 const done=await h.invoke({action:'check',attemptId:pending.attemptId});assert.equal(done.status,200);
 assert.equal(h.quotas.length,1);assert.equal(h.calls[1].method,'GET');assert.equal(h.job.analysis.planning_brief.learner_context,'Fractions');
 assert.equal(h.attempts[0].status,'applied');assert.ok(h.attempts[0].raw_response);
 assert.equal((await h.invoke({action:'check',attemptId:pending.attemptId})).status,200);assert.equal(h.calls.length,2);
});
test('invalid JSON remains downloadable and retry reuses saved output without changing original attempt',async()=>{
 const h=setup({invalid:true});assert.equal((await h.invoke({action:'plan'})).status,502);
 const old=h.attempts[0];assert.equal(old.output_text,'{broken');assert.equal(old.status,'invalid');assert.equal(h.job.revision,0);assert.ok(old.error_message);
 assert.equal((await h.invoke({action:'resume'})).status,409);assert.equal(h.calls.length,1);
 await h.invoke({action:'resume',retry:true});assert.equal(h.calls.length,2);assert.equal(h.attempts.length,2);
 assert.match(JSON.stringify(h.calls[1].input),/previous_unverified_output/);assert.equal(old.output_text,'{broken');
});
test('incomplete response retains its reason, usage and output',async()=>{
 const h=setup({incomplete:true});assert.equal((await h.invoke({action:'plan'})).status,502);
 assert.equal(h.attempts[0].status,'incomplete');assert.match(h.attempts[0].error_message,/max_output_tokens/);
 assert.equal(h.attempts[0].usage.output_tokens,10);assert.ok(h.attempts[0].output_text);assert.equal(h.job.analysis,null);
});
test('provider error and uncertain network acceptance are retained with no automatic retry',async()=>{
 const h=setup({httpError:true});await h.invoke({action:'plan'});assert.equal(h.attempts[0].status,'failed');assert.match(h.attempts[0].raw_response,/provider test error/);
 const n=setup({networkError:true});await n.invoke({action:'plan'});assert.equal(n.attempts[0].status,'unknown');await n.invoke({action:'resume'});assert.equal(n.calls.length,1);
});
test('two simultaneous starts only admit one paid request',async()=>{
 const h=setup({background:true});await Promise.all([h.invoke({action:'plan'}),h.invoke({action:'plan'})]);assert.equal(h.calls.length,1);assert.equal(h.quotas.length,1);
});
test('quota errors create persistent attempt records without a model call',async()=>{
 const h=setup({quotaDenied:true});assert.equal((await h.invoke({action:'plan'})).status,429);assert.equal(h.calls.length,0);assert.equal(h.attempts[0].status,'failed');
});
test('resume labels distinguish free retrieval, paid continuation, and saved Sol work',()=>{
 assert.match(buttonFor({state:'uploaded',analysis:{planning_brief:{}},revision:1}),/Start Sol extraction/);
 assert.match(buttonFor({revision:1,attempts:[{base_revision:1,status:'running'}]}),/no new AI call/);
 assert.match(buttonFor({revision:1,attempts:[{base_revision:1,status:'invalid',output_text:'partial'}]}),/Revalidate saved .*free/);
});
