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
 if(Number(req.headers.get("content-length")||0)>4000)return response({error:"Request too large"},413,origin);
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
  authorized:true,ready:apiKey.startsWith("sk-"),
  models:MODELS,
  cases:CASES.map(({id,topic,title})=>({id,topic,title})),
  limits:{perMinute:2,perHour:6,per24Hours:24,astraPer24Hours:2,maxOutputTokens:700},
  note:"Cost-bearing inference is disabled until an OpenAI API key is configured in staging Edge Function secrets."
 },200,origin);
 if(input.action!=="run")return response({error:"Unknown action"},400,origin);
 if(!apiKey.startsWith("sk-"))return response({error:"Live OpenAI model tests are not enabled; set OPENAI_API_KEY in staging Edge Function secrets."},503,origin);
 if(typeof input.model!=="string"||!MODELS.includes(input.model as any))return response({error:"Model not allowed"},400,origin);
 if(typeof input.caseId!=="string")return response({error:"Missing case ID"},400,origin);
 const scenario=CASES.find(x=>x.id===input.caseId);
 if(!scenario)return response({error:"Unknown test scenario"},400,origin);
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
    input:scenario.prompt,max_output_tokens:700,
    tools:[]
   }),
   signal:AbortSignal.timeout(35000)
  });
  if(!upstream.ok)return response({error:"Model API request failed",providerStatus:upstream.status},502,origin);
  const out=await upstream.json();
  const reply=textFromResponse(out).slice(0,4500);
  const usage=out.usage||{};
  const tokens={input:Math.max(0,Number(usage.input_tokens)||0),output:Math.max(0,Number(usage.output_tokens)||0)};
  const price=PRICE[input.model as keyof typeof PRICE];
  const estimatedUSD=(tokens.input*price.input+tokens.output*price.output)/1e6;
  // Keyword match is a navigation aid, NOT a certified grade or safety approval.
  const heuristic=scenario.check.map(s=>reply.toLowerCase().includes(s.toLowerCase()));
  return response({model:input.model,caseId:scenario.id,reply,elapsedMs:Date.now()-started,
   tokens,estimatedUSD,checkCount:heuristic.filter(Boolean).length,checkTotal:heuristic.length,
   disclaimer:"Quick text checks are not an accuracy or safety certification. Review the actual explanation before using it."},200,origin);
 }catch(e){return response({error:"Model request could not complete; quota reservation is retained to prevent retries from causing excessive cost."},502,origin)}
});
