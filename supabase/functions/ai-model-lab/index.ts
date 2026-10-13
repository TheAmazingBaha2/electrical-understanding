// Private, owner-only staging AI model evaluation.
// IMPORTANT: OPENAI_API_KEY is a Supabase Edge Function secret, never a browser asset.
import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import { CASES, MODELS } from "./cases.ts";

const STAGING_PROJECT = "hkwmtjhgrskidaizamwy";
const ALLOWED_ORIGINS = ["https://electrical-understanding.vanguardcorbett.workers.dev","https://theamazingbaha2.github.io"];
const cors = (origin:string|null) => ALLOWED_ORIGINS.includes(origin||"") ? {
 "Access-Control-Allow-Origin": origin!,
 "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
 "Access-Control-Allow-Methods": "POST, OPTIONS",
 "Vary":"Origin",
} : {};
const response = (data:unknown,status:number,origin:string|null)=>new Response(JSON.stringify(data),{
 status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff",...cors(origin)}
});
Deno.serve(async (req:Request)=>{
 const origin=req.headers.get("origin");
 if(req.method==="OPTIONS")return new Response(null,{status:ALLOWED_ORIGINS.includes(origin||"")?204:403,headers:cors(origin)});
 if(req.method!=="POST")return response({error:"Method not allowed"},405,origin);
 if(origin && !ALLOWED_ORIGINS.includes(origin))return response({error:"Origin not permitted"},403,origin);
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
 if(input.action==="status")return response({
  authorized:true,ready:false,spendingProtected:false,
  models:MODELS,
  cases:CASES.map(({id,topic,title,prompt})=>({id,topic,title,prompt})),
  limits:{perMinute:2,perHour:6,per24Hours:24,astraPer24Hours:2,maxOutputTokens:1400},
  note:"New lab and tutor generation is paused: these endpoints do not yet have the scan spending ledger. Existing study content remains available."
 },200,origin);
 if(input.action!=="run" && input.action!=="chat")return response({error:"Unknown action"},400,origin);
 return response({error:"New lab/tutor generation is paused pending equivalent spending and checkpoint protection. No paid request was sent."},503,origin);
});
