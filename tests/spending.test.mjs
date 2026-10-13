import test from 'node:test';
import assert from 'node:assert/strict';
import {setup} from './scan-harness.mjs';
import {readFileSync} from 'node:fs';
test('budget denial blocks provider submission and retains diagnostic attempt',async()=>{
 const h=setup({budgetDenied:true});const r=await h.invoke({action:'plan'});
 assert.equal(r.status,502);assert.equal(h.calls.length,0);assert.equal(h.spending.length,1);assert.match(h.attempts[0].error_message,/Budget/);
});
test('missing budget identity fails before quota or provider',async()=>{
 const h=setup();assert.equal((await h.invoke({action:'plan',budgetSessionId:null})).status,409);
 assert.equal(h.quotas.length,0);assert.equal(h.calls.length,0);
});
test('dispatch claim failure blocks generation even after reservation',async()=>{
 const h=setup({dispatchDenied:true});await h.invoke({action:'plan'});assert.equal(h.calls.length,0);assert.equal(h.spending.length,1);
});
test('resume alone never means start a new paid stage',async()=>{
 const h=setup();assert.equal((await h.invoke({action:'resume'})).status,409);assert.equal(h.calls.length,0);
});
test('polling and applying saved output never reserve another amount',async()=>{
 const h=setup({background:true});await h.invoke({action:'plan'});
 await h.invoke({action:'check',attemptId:h.attempts[0].id});
 assert.equal(h.spending.length,1);assert.equal(h.calls.filter(c=>c.method!=='GET').length,1);
 assert.equal(h.calls[0].service_tier,'default');assert.equal(h.calls[0].max_output_tokens,1800);
});
test('uncertain submission retains attempt and does not auto authorize retry',async()=>{
 const h=setup({networkError:true});await h.invoke({action:'plan'});
 const first=h.attempts[0];await h.invoke({action:'check',attemptId:first.id,retry:true,retryOf:first.id});
 assert.equal(h.calls.length,1);assert.equal(h.spending.length,1);assert.equal(first.status,'unknown');
});
test('ledger migration preserves original reservations, isolates RLS and denies client financial writes',()=>{
 const s=readFileSync(new URL('../supabase/migrations/20261013004258_staging_spending_ledger.sql',import.meta.url),'utf8');
 assert.match(s,/for update/);assert.match(s,/attempt_id uuid primary key/);
 assert.match(s,/revoke all on function public.ai_reserve_attempt.*authenticated/);
 assert.match(s,/provider_billed_usd is null/);assert.match(s,/Conflicting invoice reconciliation/);
});

test('all new pipeline stages advertise Sol while retaining distinct stage identities',async()=>{
 const h=setup();const r=await h.invoke({action:'status'});const data=await r.json();
 assert.deepEqual(data.pipeline,['plan','analyze','outline','draft','review','approve']);
 assert.deepEqual(Object.values(data.models),Array(5).fill('gpt-6.1-sol'));
});
