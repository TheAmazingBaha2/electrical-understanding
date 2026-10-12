// Private benchmark UI only; never sends OpenAI keys from the browser.
const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
export function renderAIModelLab(user){
 if(!user)return '<section class="panel"><h2>Private AI Model Lab</h2><p>Sign in to your staging study account to access your private GPT evaluation tools.</p><button class="primary" data-goto="account">Go to account sign-in →</button></section>';
 return '<section class="panel ai-lab-panel"><p class="v2-kicker">OWNER-ONLY EXPERIMENT · NOT A COURSE GRADE</p><h2>Private AI Model Lab</h2>'+
 '<p>Compare GPT responses using the same prepared electronics challenge. These tests never change your study progress, and every paid request must be manually started.</p>'+
 '<div id="ai-lab-status" class="flash" role="status" aria-live="polite">Checking private access and API readiness…</div>'+
 '<div class="ai-lab-controls"><label class="lab-control">Scenario<select id="ai-case" disabled><option>Checking access…</option></select></label>'+
 '<label class="lab-control">Model<select id="ai-model" disabled><option>Select a model</option></select></label>'+
 '<button class="primary" id="ai-run" disabled>Run one model test</button></div>'+
 '<p class="muted sm">Each click triggers at most one request. Owner allowance: two per minute, six per hour, and twenty-four per 24 hours. Astra is limited to two tests per rolling 24 hours and costs more per token than Luna and Sol. Arbitrary prompts remain disabled.</p>'+
 '<div id="ai-lab-output" class="ai-lab-output" aria-live="polite"></div></section>';
}
export function attachAIModelLab(supabase,notify){
 const status=document.querySelector("#ai-lab-status"),sel=document.querySelector("#ai-case"),model=document.querySelector("#ai-model"),button=document.querySelector("#ai-run"),out=document.querySelector("#ai-lab-output");
 if(!status||!sel||!model||!button||!supabase)return;
 const call=async body=>{
  const {data,error}=await supabase.functions.invoke("ai-model-lab",{body});
  if(error){const extra=await error.context?.json?.().catch?.(()=>null);throw new Error(extra?.error||error.message||"Private endpoint unavailable");}
  return data;
 };
 (async()=>{
  try{
   const info=await call({action:"status"});
   if(!info.authorized)throw new Error("You are not authorized for this private lab");
   sel.innerHTML=info.cases.map(c=>'<option value="'+safe(c.id)+'">'+safe(c.topic)+' · '+safe(c.title)+'</option>').join("");
   model.innerHTML=info.models.map(m=>'<option value="'+safe(m)+'">'+safe(m)+'</option>').join("");
   sel.disabled=false;model.disabled=false;
   button.disabled=!info.ready;
   const costNote=document.createElement("p");
   costNote.className="muted sm";
   costNote.id="ai-model-cost-note";
   model.insertAdjacentElement("afterend",costNote);
   const updateCostNote=()=>{
     costNote.textContent=model.value==="gpt-6-astra"
       ?"Astra is premium-priced: $10 per million input tokens and $50 per million output tokens. Maximum 2 Astra tests per rolling 24 hours. Clicking Run uses paid API tokens."
       :"Clicking Run uses metered API tokens. You can switch models to compare results.";
   };
   model.addEventListener("change",updateCostNote);
   updateCostNote();
   status.textContent=info.ready?"Ready: each model test uses your private OpenAI API quota.":"Gateway secured and benchmark scenarios loaded. Live inference is awaiting your OpenAI API key in staging Supabase Edge Function secrets.";
  }catch(e){status.textContent="Private access unavailable: "+e.message}
 })();
 button.addEventListener("click",async()=>{
  button.disabled=true;status.textContent="Running one verified scenario; please wait…";
  try{
   const data=await call({action:"run",model:model.value,caseId:sel.value});
   const card=document.createElement("article");card.className="ai-result";
   const heading=document.createElement("h3");heading.textContent=data.model+" · "+data.caseId;
   const details=document.createElement("p");details.className="muted sm";
   details.textContent=data.elapsedMs+" ms · "+data.tokens.input+" input / "+data.tokens.output+" output tokens · approx. $"+Number(data.estimatedUSD).toFixed(5)+" · "+data.checkCount+"/"+data.checkTotal+" simple answer checks (not a grade)";
   const text=document.createElement("pre");text.className="ai-result-text";text.textContent=data.reply||"(The model returned no readable text.)";
   const warn=document.createElement("p");warn.className="muted sm";warn.textContent=data.disclaimer;
   card.append(heading,details,text,warn);out.prepend(card);
   status.textContent="Test complete. You may select another model or scenario.";
  }catch(e){status.textContent="No result: "+e.message;notify?.(e.message)}
  finally{button.disabled=false}
 });
}
