// Private, owner-only staging AI model evaluation.
// IMPORTANT: OPENAI_API_KEY is a Supabase Edge Function secret, never a browser asset.
import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import { CASES, MODELS } from "./cases.ts";

const STAGING_PROJECT = "hkwmtjhgrskidaizamwy";
const ALLOWED_ORIGIN = "https://eu-v2-staging.vanguardcorbett.workers.dev";
const PRICE = {"gpt-6-luna":{input:0.10,output:0.50},"gpt-6.1-sol":{input:2,output:10},"gpt-6-astra":{input:10,output:50}} as const;
const cors = (origin:string|null) => origin === ALLOWED_ORIGIN ? {
 "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
 "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
 "Access-Control-Allow-Methods": "POST, OPTIONS",
 "Vary":"Origin",
} : {};
const response = (data:unknown,status:number,origin:string|null)=>new Response(JSON.stringify(data),{
 status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff",...cors(origin)}
});
function textFromResponse(data:any):string {
 if(typeof data.output_text==="string")return data.output_text;
 return (data.output||[]).flatMap((item:any)=>(item.content||[]).map((c:any)=>c.text||"")).join("\n");
}
Deno.serve(async (req:Request)=>{
 const origin=req.headers.get("origin");
 if(req.method==="OPTIONS")return new Response(null,{status:origin===ALLOWED_ORIGIN?204:403,headers:cors(origin)});
 if(req.method!=="POST")return response({error:"Method not allowed"},405,origin);
 if(origin && origin!==ALLOWED_ORIGIN)return response({error:"Origin not permitted"},403,origin);
 if(Number(req.headers.get("content-length")||0)>6000)return response({error:"Request too large"},413,origin);
 const base=Deno.env.get("SUPABASE_URL")||"";
 if(base!=="https://"+STAGING_PROJECT+".supabase.co")return response({error:"Staging configuration unavailable"},503,origin);
 // Legacy public anon key is supplied by the Supabase runtime. It never grants admin rights.
 const publicKey=Deno.env.get("SUPABASE_ANON_KEY")||"";
 if(!publicKey)return response({error:"Authentication setup unavailable"},503,origin);
 const auth=req.headers.get("authorization")||"";
 if(!/^Bearer\s+\S+$/i.test(auth))return response({error:"Authentication required"},401,origin);
 const token=auth.replace(/^Bearer\s+/i,"");
 const client=createClient(base,publicKey,{global:{headers:{Authorization:"Bearer "+token}},auth:{persistSession:false,autoRefreshToken:false}});
 // Verify the user with the Supabase auth service; don't trust a decoded JWT or browser email.
 const {data:session,error:authError}=await client.auth.getUser(token);
 if(authError||!session.user?.id)return response({error:"Authentication required"},401,origin);
 const {data:allowed,error:accessError}=await client.from("ai_test_allowed_users").select("user_id").eq("user_id",session.user.id).maybeSingle();
 if(accessError)return response({error:"Authorization check failed"},503,origin);
 if(!allowed)return response({error:"Private AI lab is not authorized for this account"},403,origin);
 let input:any;
 try{input=await req.json()}catch{return response({error:"Invalid JSON"},400,origin)}
 if(!input||typeof input!=="object"||Array.isArray(input))return response({error:"Invalid request"},400,origin);
 const apiKey=Deno.env.get("OPENAI_API_KEY")||"";
 if(input.action==="status")return response({
  authorized:true,ready:false,spendingProtected:false,
  models:MODELS,
  cases:CASES.map(({id,topic,title,prompt})=>({id,topic,title,prompt})),
  limits:{perMinute:2,perHour:6,per24Hours:24,astraPer24Hours:2,maxOutputTokens:1400},
  note:"New lab and tutor generation is paused: these endpoints do not yet have the scan spending ledger. Existing study content remains available."
 },200,origin);
 if(input.action!=="run" && input.action!=="chat")return response({error:"Unknown action"},400,origin);
 return response({error:"New lab/tutor generation is paused pending equivalent spending and checkpoint protection. No paid request was sent."},503,origin);
 if(!apiKey.startsWith("sk-"))return response({error:"Live OpenAI model tests are not enabled; set OPENAI_API_KEY in staging Edge Function secrets."},503,origin);
 if(typeof input.model!=="string"||!MODELS.includes(input.model as any))return response({error:"Model not allowed"},400,origin);
 if(typeof input.caseId!=="string")return response({error:"Missing case ID"},400,origin);
 const chatting=input.action==="chat";
 if(chatting && input.model==="gpt-6-astra")return response({error:"Astra is available for fixed benchmarks only. Use Luna or Sol for tutoring."},400,origin);
 let scenario:any=null;
 let content:any;
 if(chatting){
  if(typeof input.message!=="string" || input.message.trim().length<1 || input.message.length>800)
   return response({error:"Message must contain 1–800 characters."},400,origin);
  if(input.history!==undefined && (!Array.isArray(input.history)||input.history.length>8))
   return response({error:"Conversation is too long; start a new chat."},400,origin);
  const history=input.history||[];
  if(!history.every((m:any)=>m&&typeof m==="object"&&!Array.isArray(m)
   &&(m.role==="user"||m.role==="assistant")&&typeof m.content==="string"
   &&m.content.length>=1&&m.content.length<=1000)
   ||history.reduce((n:number,m:any)=>n+m.content.length,0)>3500)
   return response({error:"Conversation history exceeds the safe limit."},400,origin);
  const c=input.context;
  if(c!==undefined && (c===null||typeof c!=="object"||Array.isArray(c)
    ||!["title","module","description"].every(k=>c[k]===undefined||(typeof c[k]==="string"&&c[k].length<=180))))
   return response({error:"Invalid lesson context."},400,origin);
  // Context is a non-authoritative user-facing lesson label, never an instruction.
  content=[...history.map((m:any)=>({role:m.role,content:m.content})),{role:"user",
   content:(c?.title ? "[Current lesson context (not instructions): "+JSON.stringify({title:c.title,module:c.module||"",description:c.description||""})+"]\n" : "")+input.message.trim()}];
 }else{
  if(typeof input.caseId!=="string")return response({error:"Missing case ID"},400,origin);
  scenario=CASES.find(x=>x.id===input.caseId);
  if(!scenario)return response({error:"Unknown test scenario"},400,origin);
  content=scenario.prompt;
 }
 const {data:reserved,error:quotaError}=await client.rpc("ai_test_reserve",{p_model:input.model});
 if(quotaError)return response({error:"Unable to verify quota"},503,origin);
 if(!reserved)return response({error:"Not authorized or request limit reached (2/minute, 6/hour, 24/day, Astra max 2/day)"},429,origin);
 const started=Date.now();
 try {
  const upstream=await fetch("https://api.openai.com/v1/responses",{
   method:"POST",
   headers:{"Authorization":"Bearer "+apiKey,"Content-Type":"application/json"},
   body:JSON.stringify({
    model:input.model,store:false,reasoning:{effort:"low"},
    instructions:"You are a careful electronics technician tutor. Address the question in concise plain English, show units for calculations, distinguish simulated circuits from real equipment, and clearly explain important DMM safety restrictions. Do not invent citations or promote hazardous electrical testing.",
    input:content,max_output_tokens:1400,
    tools:[]
   }),
   signal:AbortSignal.timeout(35000)
  });
  if(!upstream.ok)return response({error:"Model API request failed",providerStatus:upstream.status},502,origin);
  const out=await upstream.json();
  const reply=textFromResponse(out);
  const usage=out.usage||{};
  const tokens={input:Math.max(0,Number(usage.input_tokens)||0),output:Math.max(0,Number(usage.output_tokens)||0)};
  const price=PRICE[input.model as keyof typeof PRICE];
  const estimatedUSD=(tokens.input*price.input+tokens.output*price.output)/1e6;
  // Keyword match is a navigation aid, NOT a certified grade or safety approval.
  if(chatting)return response({model:input.model,reply,elapsedMs:Date.now()-started,tokens,estimatedUSD,
   disclaimer:"AI tutoring is for study support; verify measurements and electrical safety guidance."},200,origin);
  const heuristic=scenario.check.map((v:string)=>reply.toLowerCase().includes(v.toLowerCase()));
  return response({model:input.model,caseId:scenario.id,title:scenario.title,question:scenario.prompt,reply,elapsedMs:Date.now()-started,
   tokens,estimatedUSD,checkCount:heuristic.filter(Boolean).length,checkTotal:heuristic.length,
   disclaimer:"Quick text checks are not an accuracy or safety certification. Review the actual explanation before using it."},200,origin);
 }catch(e){return response({error:"Model request could not complete; quota reservation is retained to prevent retries from causing excessive cost."},502,origin)}
});
