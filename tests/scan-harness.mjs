import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import vm from 'node:vm';
export function setup(options={}){
 const job={id:'11111111-1111-1111-1111-111111111111',user_id:'owner',title:'Math',state:'uploaded',revision:0,source_kind:'application/pdf',source_path:'owner/source.pdf',analysis:null};
 const brief={astra_guidance:'Verify equations and units.',lesson_guidance:'Explain every operation.',review_guidance:'Check worked arithmetic.'};
 const attempts=[],calls=[],quotas=[],removed=[],responses=new Map();let handler,deleted=false,seq=0;
 const client={auth:{getUser:async()=>({data:{user:{id:'owner'}}})},storage:{from:()=>({download:async()=>({data:new Blob(['%PDF-test'])}),remove:async paths=>{removed.push(...paths);return {error:options.storageError||null}}})},rpc:async(name,v)=>{if(name==='scan_apply_attempt'){const a=attempts.find(a=>a.id===v.p_attempt);Object.assign(job,v.p_patch,{state:v.p_next,revision:job.revision+1});a.status='applied';a.error_message=null;return {data:true}}quotas.push(v.p_stage==='plan'||v.p_stage==='draft'?'gpt-6.1-sol':'gpt-6-astra');return {data:!options.quotaDenied}},from(table){
  let patch,insert,isDelete=false,limit=null;const filters=[];
  const execute=()=>{
   let rows=table==='ai_test_allowed_users'?[{user_id:'owner'}]:table==='scan_model_attempts'?attempts:table==='scan_quota_completion'?[]:deleted?[]:[job];
   if(insert){
    if(attempts.some(a=>a.job_id===insert.job_id&&['starting','running','received'].includes(a.status)))return {error:{code:'23505'}};
    const value={...insert,id:'attempt-'+(++seq),created_at:new Date(Date.now()+seq).toISOString(),updated_at:new Date().toISOString()};attempts.push(value);return {data:structuredClone(value)};
   }
   rows=rows.filter(row=>filters.every(([key,value,op])=>op==='in'?value.includes(row[key]):row[key]===value));
   if(table==='scan_model_attempts')rows=[...rows].reverse();
   if(limit)rows=rows.slice(0,limit);
   if(isDelete){deleted=true;return {error:null};}
   if(patch)rows.forEach(row=>Object.assign(row,patch));
   return {data:structuredClone(rows[0]||null),error:null};
  };
  const q={select(){return q},eq(k,v){filters.push([k,v,'eq']);return q},in(k,v){filters.push([k,v,'in']);return q},order(){return q},limit(n){limit=n;return q},delete(){isDelete=true;return q},update(v){patch=v;return q},insert(v){insert=v;return q},then(resolve,reject){return Promise.resolve().then(execute).then(resolve,reject)},single:async()=>execute(),maybeSingle:async()=>execute()};return q;
 }};
 const source=readFileSync(new URL('../supabase/functions/scan-lesson-pipeline/index.ts',import.meta.url),'utf8');
 const code=stripTypeScriptTypes(source.replace(/^import .*;$/m,''));
 const provider=async(url,opts)=>{
  if(opts.method==='GET'){calls.push({method:'GET'});return Response.json(responses.get(url.split('/').pop()),{headers:{'x-request-id':'req-poll'}});}
  const body=JSON.parse(opts.body);calls.push(body);
  if(options.networkError)throw Error('test network failure');
  if(options.httpError)return new Response('{"error":{"message":"provider test error"}}',{status:429});
  const payload=body.text.format.name==='eu_plan'?brief:{source_title:'Math',overview:'Two verified concepts.',facts:[{claim:'First fact',location:'p1',confidence:'high'},{claim:'Second fact',location:'p1',confidence:'high'}],equations:[],safety_notes:[],gaps:[]};
  const id='resp_'+calls.length;
  const raw={id,status:options.incomplete?'incomplete':'completed',incomplete_details:options.incomplete?{reason:'max_output_tokens'}:null,output_text:options.invalid?'{broken':JSON.stringify(payload),usage:{input_tokens:10,output_tokens:10}};
  responses.set(id,raw);
  return Response.json(options.background?{id,status:'queued'}:raw,{headers:{'x-request-id':'req-start'}});
 };
 vm.runInNewContext(code,{createClient:()=>client,Deno:{env:{get:n=>({SUPABASE_URL:'https://hkwmtjhgrskidaizamwy.supabase.co',SUPABASE_ANON_KEY:'public',SUPABASE_SERVICE_ROLE_KEY:'private',OPENAI_API_KEY:'sk-test'})[n]},serve:f=>handler=f},Response,Request,Blob,Uint8Array,AbortSignal,btoa,fetch:provider});
 return {job,attempts,calls,quotas,removed,isDeleted:()=>deleted,invoke:body=>handler(new Request('https://example.test',{method:'POST',headers:{authorization:'Bearer test',origin:'https://eu-v2-staging.vanguardcorbett.workers.dev'},body:JSON.stringify({jobId:job.id,...body})}))};
}
