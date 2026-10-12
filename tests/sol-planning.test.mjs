import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import vm from 'node:vm';
const source=readFileSync(new URL('../supabase/functions/scan-lesson-pipeline/index.ts',import.meta.url),'utf8');
function setup(){
 const job={id:'11111111-1111-1111-1111-111111111111',user_id:'owner',title:'Math',state:'uploaded',revision:0,source_kind:'application/pdf',source_path:'owner/source.pdf',analysis:null};
 const brief={astra_guidance:'Verify equations and units.',lesson_guidance:'Explain every operation.',review_guidance:'Check worked arithmetic.'};
 const calls=[],quotas=[];let handler;
 const client={auth:{getUser:async()=>({data:{user:{id:'owner'}}})},storage:{from:()=>({download:async()=>({data:new Blob(['%PDF-test'])})})},rpc:async(_,v)=>{quotas.push(v.p_model);return {data:true}},from(table){
  let patch;const q={select(){return q},eq(){return q},update(v){patch=v;return q},async maybeSingle(){if(table==='ai_test_allowed_users')return {data:{user_id:'owner'}};if(patch){Object.assign(job,patch);return {data:{id:job.id}}}return {data:structuredClone(job)}}};return q;
 }};
 const code=stripTypeScriptTypes(source.replace(/^import .*;$/m,''));
 vm.runInNewContext(code,{createClient:()=>client,Deno:{env:{get:n=>({SUPABASE_URL:'https://hkwmtjhgrskidaizamwy.supabase.co',SUPABASE_ANON_KEY:'public',SUPABASE_SERVICE_ROLE_KEY:'private',OPENAI_API_KEY:'sk-test'})[n]},serve:f=>handler=f},Response,Request,Blob,Uint8Array,AbortSignal,btoa,fetch:async(_,options)=>{const body=JSON.parse(options.body);calls.push(body);const payload=body.text.format.name==='eu_plan'?brief:{source_title:'Math',overview:'Two verified concepts.',facts:[{claim:'First fact',location:'p1',confidence:'high'},{claim:'Second fact',location:'p1',confidence:'high'}],equations:[],safety_notes:[],gaps:[]};return Response.json({status:'completed',output_text:JSON.stringify(payload),usage:{input_tokens:10,output_tokens:10}})}});
 return {job,calls,quotas,invoke:body=>handler(new Request('https://example.test',{method:'POST',headers:{authorization:'Bearer test',origin:'https://eu-v2-staging.vanguardcorbett.workers.dev'},body:JSON.stringify({jobId:job.id,...body})}))};
}
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
