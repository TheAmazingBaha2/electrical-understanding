import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import vm from 'node:vm';
export function setup(options={}){
 const job={id:'11111111-1111-1111-1111-111111111111',user_id:'owner',title:'Math',source_book:'Test source',source_pages:'1',source_track:'guide',state:'uploaded',revision:0,source_kind:'application/pdf',source_path:'owner/source.pdf',analysis:null};
 const brief={astra_guidance:'Verify equations and units.',lesson_guidance:'Explain every operation.',review_guidance:'Check worked arithmetic.'};
 const spending=[],attempts=[],calls=[],quotas=[],removed=[],responses=new Map();let handler,deleted=false,seq=0;
 const client={auth:{getUser:async()=>({data:{user:{id:'owner'}}})},storage:{from:()=>({download:async()=>({data:new Blob(['%PDF-test'])}),remove:async paths=>{removed.push(...paths);return {error:options.storageError||null}}})},rpc:async(name,v)=>{if(name==='ai_reserve_attempt'){spending.push(v);return options.budgetDenied?{error:{message:'budget insufficient'}}:{data:{reserved_usd:30}}}if(name==='ai_dispatch_attempt')return {data:!options.dispatchDenied};if(name==='ai_record_recovery')return {data:true};if(name==='scan_apply_attempt'){const a=attempts.find(a=>a.id===v.p_attempt);if(options.applyError)return {error:{message:'simulated apply failure'}};if(a.status==='applied')return {data:true};if(a.status!=='received'||a.base_revision!==job.revision)return {data:false};Object.assign(job,v.p_patch,{state:v.p_next,revision:job.revision+1});a.status='applied';a.error_message=null;return {data:true}}quotas.push('gpt-6.1-sol');return {data:!options.quotaDenied}},from(table){
  let patch,insert,isDelete=false,limit=null,single=false;const filters=[];
  const execute=()=>{
   let rows=table==='ai_spend_ledger'?[]:table==='ai_price_versions'?[{model:'gpt-6-astra',input_rate:10,cached_rate:1,write_rate:12.5,output_rate:50,long_threshold:272000,long_input:2,long_output:1.5},{model:'gpt-6.1-sol',input_rate:2,cached_rate:.1,write_rate:2.5,output_rate:10,long_threshold:272000,long_input:2,long_output:1.5}]:table==='ai_test_allowed_users'?[{user_id:'owner'}]:table==='scan_model_attempts'?attempts:table==='scan_quota_completion'?[]:deleted?[]:[job,...(options.otherJobs||[])];
   if(insert&&table==='scan_lesson_jobs'){
    Object.assign(job,insert,{id:job.id,revision:0,created_at:new Date().toISOString()});return {data:structuredClone(job)};
   }
   if(insert){
    if(attempts.some(a=>a.job_id===insert.job_id&&['starting','running','received'].includes(a.status)))return {error:{code:'23505'}};
    const value={...insert,id:'attempt-'+(++seq),created_at:new Date(Date.now()+seq).toISOString(),updated_at:new Date().toISOString()};attempts.push(value);return {data:structuredClone(value)};
   }
   rows=rows.filter(row=>filters.every(([key,value,op])=>op==='in'?value.includes(row[key]):op==='neq'?row[key]!==value:row[key]===value));
   if(table==='scan_model_attempts')rows=[...rows].reverse();
   if(limit)rows=rows.slice(0,limit);
   if(isDelete){deleted=true;return {error:null};}
   if(table==='scan_lesson_jobs'&&patch?.state==='approved'&&rows.some(row=>!(patch.lesson??row.lesson)||!(Object.hasOwn(patch,'review')?patch.review:row.review)||!(patch.approved_at??row.approved_at)))return {data:null,error:{code:'23514',message:'scan_lesson_jobs_check'}};
   if(table==='scan_lesson_jobs'&&patch?.state==='approved'&&options.approvalSaveError)return {data:null,error:{code:'XX000',message:'simulated database failure'}};
   if(patch)rows.forEach(row=>Object.assign(row,patch));
   return {data:structuredClone(single?rows[0]||null:rows),error:null};
  };
  const q={select(){return q},eq(k,v){filters.push([k,v,'eq']);return q},neq(k,v){filters.push([k,v,'neq']);return q},in(k,v){filters.push([k,v,'in']);return q},order(){return q},limit(n){limit=n;return q},delete(){isDelete=true;return q},update(v){patch=v;return q},insert(v){insert=v;return q},then(resolve,reject){return Promise.resolve().then(execute).then(resolve,reject)},single:async()=>{single=true;return execute()},maybeSingle:async()=>{single=true;return execute()}};return q;
 }};
 const source=readFileSync(new URL('../supabase/functions/scan-lesson-pipeline/index.ts',import.meta.url),'utf8');
 const code=stripTypeScriptTypes(source.replace(/^import .*;$/m,''));
 const provider=async(url,opts)=>{
  if(opts.method==='GET'){calls.push({method:'GET'});if(options.pollError)return new Response('upstream unavailable',{status:502});return Response.json(responses.get(url.split('/').pop()),{headers:{'x-request-id':'req-poll'}});}
  const body=JSON.parse(opts.body);calls.push(body);
  if(options.networkError)throw Error('test network failure');
  if(options.httpError)return new Response('{"error":{"message":"provider test error"}}',{status:429});
  const payload=options.payloads?.[body.text.format.name]||(body.text.format.name==='eu_plan'?brief:{source_title:'Math',overview:'Two verified concepts.',facts:[{id:'S1',claim:'First fact',location:'p1',confidence:'high'},{id:'S2',claim:'Second fact',location:'p1',confidence:'high'}],equations:[],safety_notes:[],gaps:[]});
  const id='resp_'+calls.length;
  const raw={id,status:options.incomplete?'incomplete':'completed',incomplete_details:options.incomplete?{reason:'max_output_tokens'}:null,output_text:options.invalid?'{broken':JSON.stringify(payload),usage:{input_tokens:10,output_tokens:10}};
  responses.set(id,raw);
  return Response.json(options.background?{id,status:'queued'}:raw,{headers:{'x-request-id':'req-start'}});
 };
 vm.runInNewContext(code,{createClient:()=>client,Deno:{env:{get:n=>({SUPABASE_URL:'https://hkwmtjhgrskidaizamwy.supabase.co',SUPABASE_ANON_KEY:'public',SUPABASE_SERVICE_ROLE_KEY:'private',OPENAI_API_KEY:'sk-test'})[n]},serve:f=>handler=f},Response,Request,Blob,Uint8Array,AbortSignal,btoa,fetch:provider});
 return {job,attempts,calls,quotas,spending,removed,isDeleted:()=>deleted,invoke:body=>handler(new Request('https://example.test',{method:'POST',headers:{authorization:'Bearer test',origin:'https://eu-v2-staging.vanguardcorbett.workers.dev'},body:JSON.stringify({jobId:job.id,budgetSessionId:'22222222-2222-2222-2222-222222222222',expectedRevision:job.revision,retryOf:attempts.at(-1)?.id,...body})}))};
}
