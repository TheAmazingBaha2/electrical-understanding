// Private benchmark UI. AI responses are plain text, never HTML.
const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
let labResults = [], labResultsOwner = null;
const appendBubble=(parent,role,text)=>{
 const article=document.createElement('div');
 article.className='ai-dialogue-bubble ai-dialogue-'+role;
 const label=document.createElement('strong');label.textContent=role==='question'?'Scenario question':'Model answer';
 const content=document.createElement('div');content.className='ai-dialogue-copy';content.textContent=text;
 article.append(label,content);parent.append(article);return content;
};
export function renderAIModelLab(user){
 const nextOwner=user?.id||null;
 if(nextOwner!==labResultsOwner){labResults=[];labResultsOwner=nextOwner}
 if(!user)return '<section class="panel"><h2>Private AI Model Lab</h2><p>Sign in to your study account to access the private GPT evaluation tools.</p><button class="primary" data-goto="account">Go to account sign-in →</button></section>';
 return '<section class="panel ai-lab-panel"><p class="v2-kicker">OWNER-ONLY EXPERIMENT · NOT A COURSE GRADE</p><h2>Private AI Model Lab</h2>'+
 '<p>Read the full scenario and compare the answers from Luna, Sol and Astra. All results stay separate from your graded study progress.</p>'+
 '<div id="ai-lab-status" class="flash" role="status" aria-live="polite">Checking private access and API readiness…</div>'+
 '<div class="ai-lab-controls"><label class="lab-control">Scenario<select id="ai-case" disabled><option>Checking access…</option></select></label>'+
 '<label class="lab-control">Model<select id="ai-model" disabled><option>Select a model</option></select></label>'+
 '<button class="primary" id="ai-run" disabled>Run one model test</button></div>'+
 '<div class="ai-lab-question-box"><h3>Scenario to test</h3><p id="ai-case-prompt">Choose a scenario to see its question here.</p></div>'+
 '<p class="muted sm">Each Run uses paid API tokens. Shared limits: 2/minute, 6/hour, 24/day. Astra additionally: 2 per rolling 24 hours.</p>'+
 '<div id="ai-lab-output" class="ai-lab-output" aria-label="Model test conversations" aria-live="polite"></div></section>';
}
export function attachAIModelLab(supabase,notify){
 const status=document.querySelector('#ai-lab-status'),sel=document.querySelector('#ai-case'),model=document.querySelector('#ai-model'),button=document.querySelector('#ai-run'),out=document.querySelector('#ai-lab-output'),preview=document.querySelector('#ai-case-prompt');
 if(!status||!sel||!model||!button||!supabase)return;
 const call=async body=>{
  const {data,error}=await supabase.functions.invoke('ai-model-lab',{body});
  if(error){const extra=await error.context?.json?.().catch?.(()=>null);throw new Error(extra?.error||error.message||'Private endpoint unavailable');}
  return data;
 };
 const buildResult=(data)=>{
  const card=document.createElement('article');card.className='ai-result';
  const header=document.createElement('div');header.className='ai-result-head';
  const title=document.createElement('h3');title.textContent=data.model+' · '+(data.title||data.caseId);
  const details=document.createElement('p');details.className='muted sm';
  if(data.tokens)details.textContent=data.elapsedMs+' ms · '+data.tokens.input+' input / '+data.tokens.output+' output tokens · approx. $'+Number(data.estimatedUSD).toFixed(5)+' · '+data.checkCount+'/'+data.checkTotal+' simple checks (not a grade)';
  header.append(title,details);card.append(header);
  const dialogue=document.createElement('div');dialogue.className='ai-dialogue';
  appendBubble(dialogue,'question',data.question||data.fallbackQuestion||'Scenario question');
  appendBubble(dialogue,'answer',data.reply||'(The model returned no readable text.)');
  card.append(dialogue);
  if(data.disclaimer){const warn=document.createElement('p');warn.className='muted sm';warn.textContent=data.disclaimer;card.append(warn);}
  return card;
 };
 labResults.slice(0,10).forEach(item=>out.append(buildResult(item)));
 let cases=[];
 (async()=>{
  try{
   const info=await call({action:'status'});
   if(!info.authorized)throw new Error('You are not authorized for this private lab');
   cases=info.cases||[];
   sel.innerHTML=cases.map(c=>'<option value="'+safe(c.id)+'">'+safe(c.topic)+' · '+safe(c.title)+'</option>').join('');
   model.innerHTML=info.models.map(m=>'<option value="'+safe(m)+'">'+safe(m)+'</option>').join('');
   sel.disabled=false;model.disabled=false;button.disabled=!info.ready;
   const updatePreview=()=>{preview.textContent=cases.find(c=>c.id===sel.value)?.prompt||'Scenario unavailable';};
   sel.addEventListener('change',updatePreview);updatePreview();
   const costNote=document.createElement('p');costNote.className='muted sm';costNote.id='ai-model-cost-note';model.insertAdjacentElement('afterend',costNote);
   const updateCostNote=()=>{costNote.textContent=model.value==='gpt-6-astra'
     ?'Astra: $10 per million input tokens and $50 per million output tokens. Maximum 2 Astra tests per rolling 24 hours.'
     :'Clicking Run uses metered API tokens. Choose another model to compare the same question.';};
   model.addEventListener('change',updateCostNote);updateCostNote();
   status.textContent=info.ready?'Ready: choose a model, then run the scenario.':(info.note||'New generation is paused pending spending protection.');
  }catch(e){status.textContent='Private access unavailable: '+e.message;}
 })();
 button.addEventListener('click',async()=>{
  if(button.disabled)return;
  const selected=cases.find(c=>c.id===sel.value);
  button.disabled=true;status.textContent='Waiting for '+model.value+'…';
  const pending=buildResult({model:model.value,title:selected?.title,caseId:sel.value,question:selected?.prompt,reply:'Generating an answer…'});
  out.prepend(pending);
  // The active result stays in view even on a narrow phone screen.
  pending.scrollIntoView({behavior:'smooth',block:'start'});
  try{
   const data=await call({action:'run',model:model.value,caseId:sel.value});
   const record={...data,title:selected?.title,question:data.question||selected?.prompt};
   pending.replaceWith(buildResult(record));
   labResults.unshift(record);labResults=labResults.slice(0,10);
   status.textContent='Test complete. Compare the full dialogue below.';
  }catch(e){
   pending.querySelector('.ai-dialogue-answer .ai-dialogue-copy').textContent='Request failed: '+e.message;
   status.textContent='Test failed: '+e.message;
   notify?.(e.message);
  }finally{button.disabled=false;}
 });
}
