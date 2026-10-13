// Persistent floating study tutor. It does not write to lesson_progress.
// The only paid API is the owner-authorized staging Supabase Edge Function.
let root=null, currentId=null, client=null, lessonGetter=()=>null, messages=[], pending=false, authorized=false, open=false;
const by=id=>root?.querySelector('#'+id);
function append(role,text,meta=''){
 const area=by('ai-chat-messages');if(!area)return;
 const bubble=document.createElement('div');bubble.className='ai-dialogue-bubble ai-dialogue-'+(role==='user'?'question':'answer');
 const who=document.createElement('strong');who.textContent=role==='user'?'You':'Study tutor';
 const copy=document.createElement('div');copy.className='ai-dialogue-copy';copy.textContent=text;
 bubble.append(who,copy);
 if(meta){const stats=document.createElement('small');stats.className='ai-chat-bubble-meta';stats.textContent=meta;bubble.append(stats)}
 area.append(bubble);area.scrollTop=area.scrollHeight;return bubble;
}
function setStatus(message){const n=by('ai-chat-status');if(n)n.textContent=message}
function setControls(){
 const send=by('ai-chat-send'),text=by('ai-chat-input'),model=by('ai-chat-model');
 if(send)send.disabled=!authorized||pending;
 if(text)text.disabled=!authorized||pending;
 if(model)model.disabled=!authorized||pending;
}
async function verifyAccess(){
 const id=currentId,usedClient=client;
 authorized=false;setControls();setStatus('Checking private tutor access…');
 if(!id||!usedClient)return;
 try{
  const {data,error}=await usedClient.functions.invoke('ai-model-lab',{body:{action:'status'}});
  if(id!==currentId||usedClient!==client)return;
  if(error)throw new Error(error.message||'Private gateway unavailable');
  if(!data?.authorized)throw new Error('Account is not authorized for the private tutor');
  if(!data.ready)throw new Error(data.note||'New tutor generation is paused pending spending protection');
  authorized=true;setStatus('Private tutor ready · metered calls · shared hourly quota');
 }catch(e){if(id===currentId)setStatus('Private tutor unavailable: '+e.message)}
 setControls();
}
function syncLessonLabel(){
 const ctx=lessonGetter?.();
 by('ai-chat-context').textContent=ctx?.title?'Discussing: '+ctx.title:'General electronics questions';
}
export function mountAIChat(getLesson=()=>null){
 lessonGetter=getLesson;
 if(root)return;
 root=document.createElement('div');root.className='ai-chat-root';
 root.innerHTML=`<button type="button" id="ai-chat-launch" class="ai-chat-launch" aria-controls="ai-chat-panel" aria-expanded="false" hidden>⚡ Study tutor</button>
 <section id="ai-chat-panel" class="ai-chat-panel" role="dialog" aria-label="Private AI study tutor" hidden>
  <div class="ai-chat-head">
   <div><strong>Private study tutor</strong><small id="ai-chat-context">General electronics questions</small></div>
   <div class="ai-chat-actions"><button type="button" id="ai-chat-new" aria-label="Start a new chat">New</button><button type="button" id="ai-chat-close" aria-label="Close chat">✕</button></div>
  </div>
  <div class="ai-chat-toolbar"><label for="ai-chat-model">Model</label><select id="ai-chat-model"><option value="gpt-6-luna">Luna · quick hints</option><option value="gpt-6.1-sol">Sol · deeper explanation</option></select></div>
  <div class="ai-chat-scroll" id="ai-chat-messages" role="log" aria-label="Tutor conversation" aria-live="polite" aria-relevant="additions text"></div>
  <div id="ai-chat-status" class="ai-chat-status" role="status">Sign in to unlock your private tutor.</div>
  <form id="ai-chat-form" class="ai-chat-form"><label for="ai-chat-input">Ask your tutor</label><textarea id="ai-chat-input" rows="2" maxlength="800" placeholder="Ask about the circuit or a lesson concept…" disabled></textarea>
    <button id="ai-chat-send" class="primary" type="submit" disabled>Send</button>
  </form>
  <p class="ai-chat-footnote">Private to your account · API usage is billed · Chats are temporary and never change lesson grades.</p>
 </section>`;
 document.body.append(root);
 by('ai-chat-launch').addEventListener('click',()=>toggleAIChat(true));
 by('ai-chat-close').addEventListener('click',()=>toggleAIChat(false));
 by('ai-chat-new').addEventListener('click',()=>{
  messages=[];by('ai-chat-messages').replaceChildren();append('assistant','New conversation started. Ask me about electronics, measurements, or the current lesson.');
 });
 by('ai-chat-form').addEventListener('submit',async event=>{
  event.preventDefault();
  if(!authorized||pending||!currentId)return;
  const area=by('ai-chat-input'),message=area.value.trim();
  if(!message||message.length>800){setStatus('Enter a question up to 800 characters.');return}
  const history=messages.slice(-8).map(m=>({role:m.role,content:m.content}));
  // Keep recent context within the backend size limit, even after long replies.
  while(history.length && history.reduce((sum,m)=>sum+m.content.length,0)>3200)history.shift();
  const id=currentId,usedClient=client,context=lessonGetter?.();
  const selected=by('ai-chat-model').value;
  messages.push({role:'user',content:message});append('user',message);
  area.value='';pending=true;setControls();setStatus('Waiting for '+selected+'…');
  const working=append('assistant','Thinking…');
  try{
   const {data,error}=await usedClient.functions.invoke('ai-model-lab',{
     body:{action:'chat',model:selected,message,history,context:context||undefined}
   });
   if(id!==currentId||usedClient!==client)return;
   if(error){const detail=await error.context?.json?.().catch?.(()=>null);throw new Error(detail?.error||error.message||'Request failed')}
   const reply=data?.reply||'(No readable response was returned.)';
   working.querySelector('.ai-dialogue-copy').textContent=reply;
   const summary=data?.tokens?data.tokens.input+' input · '+data.tokens.output+' output tokens · approximately $'+Number(data.estimatedUSD).toFixed(5):'';
   if(summary){const small=document.createElement('small');small.className='ai-chat-bubble-meta';small.textContent=summary;working.append(small)}
   messages.push({role:'assistant',content:reply.slice(0,1000)});
   setStatus('Ready · each message uses your private API quota');
  }catch(error){
   if(id===currentId&&usedClient===client){
    working.querySelector('.ai-dialogue-copy').textContent='Could not complete the request: '+error.message;
    // Failed prompts are displayed but excluded from model history on retry.
    messages.pop();setStatus('Not sent · '+error.message);
   }
  }finally{
   if(id===currentId&&usedClient===client){pending=false;setControls();by('ai-chat-messages').scrollTop=by('ai-chat-messages').scrollHeight;}
  }
 });
 append('assistant','Ask me to explain a concept, troubleshoot a simulated circuit, or help with the lesson you are studying.');
}
export function toggleAIChat(value){
 if(!root||!currentId)return;
 open=Boolean(value);
 by('ai-chat-panel').hidden=!open;
 by('ai-chat-launch').setAttribute('aria-expanded',String(open));
 if(open){
  syncLessonLabel();if(!authorized)void verifyAccess();
  by('ai-chat-input').focus();
 }else by('ai-chat-launch').focus();
}
export function refreshAIChatContext(){if(root&&open)syncLessonLabel()}
export function updateAIChatSession(user,supabase){
 if(!root)return;
 const id=user?.id||null;
 if(id!==currentId){
  currentId=id;client=supabase||null;messages=[];pending=false;authorized=false;open=false;
  by('ai-chat-messages').replaceChildren();
  by('ai-chat-panel').hidden=true;by('ai-chat-launch').setAttribute('aria-expanded','false');
  if(id)append('assistant','Ask about a lesson or an electronics concept. I can explain step by step.');
  setStatus(id?'Open the tutor to verify private access.':'Sign in to unlock your private tutor.');
 }else if(supabase)client=supabase;
 by('ai-chat-launch').hidden=!id||!client;
 if(open)syncLessonLabel();
 setControls();
}
