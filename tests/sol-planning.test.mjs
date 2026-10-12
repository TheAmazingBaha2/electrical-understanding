import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import vm from 'node:vm';
import {setup} from './scan-harness.mjs';
test('Astra cannot run before Sol; blank context plans once and survives retry',async()=>{
 const h=setup();assert.equal((await h.invoke({action:'analyze'})).status,409);assert.equal(h.calls.length,0);
 assert.equal((await h.invoke({action:'plan'})).status,200);assert.equal(h.job.state,'uploaded');assert.equal(h.job.analysis.planning_brief.learner_context,'');
 assert.equal((await h.invoke({action:'plan'})).status,200);assert.equal(h.calls.length,1);
 assert.equal((await h.invoke({action:'analyze'})).status,200);assert.equal(h.job.state,'analyzed');assert.equal(h.job.analysis.planning_brief.lesson_guidance,'Explain every operation.');
 assert.deepEqual(h.quotas,['gpt-6.1-sol','gpt-6-astra']);assert.match(h.calls[1].input[0].content[0].text,/Verify equations and units/);
});
test('optional context reaches Sol and is persisted; oversized context spends nothing',async()=>{
 const h=setup();assert.equal((await h.invoke({action:'plan',learnerContext:'x'.repeat(2001)})).status,400);assert.equal(h.calls.length,0);
 assert.equal((await h.invoke({action:'plan',learnerContext:'Focus on fractions'})).status,200);
 assert.match(h.calls[0].input[0].content[0].text,/Focus on fractions/);assert.equal(h.job.analysis.planning_brief.learner_context,'Focus on fractions');
});

test('delete removes only stored owner path and generated record without AI calls; retry is safe',async()=>{
 const h=setup();
 assert.equal((await h.invoke({action:'delete',path:'other/scan.pdf'})).status,200);
 assert.deepEqual(h.removed,['owner/source.pdf']);assert.equal(h.isDeleted(),true);
 assert.equal((await h.invoke({action:'delete'})).status,200);assert.equal(h.removed.length,1);
 assert.equal(h.calls.length,0);assert.equal(h.quotas.length,0);
});
test('delete preserves library record if storage removal fails and rejects foreign stored path',async()=>{
 const h=setup({storageError:{message:'unavailable'}});
 assert.equal((await h.invoke({action:'delete'})).status,503);assert.equal(h.isDeleted(),false);
 const other=setup();other.job.source_path='someone-else/scan.pdf';
 assert.equal((await other.invoke({action:'delete'})).status,403);assert.equal(other.removed.length,0);
 const missing=setup();assert.equal((await missing.invoke({action:'delete',jobId:'22222222-2222-2222-2222-222222222222'})).status,200);assert.equal(missing.removed.length,0);
});

