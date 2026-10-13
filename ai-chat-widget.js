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
function bindLauncherDrag(button){
 const key='eu_tutor_position_v1',positions={};let drag=null,suppressClick=false;
 try{Object.assign(positions,JSON.parse(localStorage.getItem(key)||'{}'))}catch{}
 const mode=()=>innerWidth<=700?'mobile':'desktop';
 function bounds(){return {x:Math.max(8,innerWidth-button.offsetWidth-8),y:Math.max(8,innerHeight-button.offsetHeight-8)}}
 function place(x,y){const b=bounds();button.style.left=Math.max(8,Math.min(b.x,x))+'px';button.style.top=Math.max(8,Math.min(b.y,y))+'px';button.style.right='auto';button.style.bottom='auto'}
 function restore(){const p=positions[mode()];if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.y))return;const b=bounds();place(8+p.x*(b.x-8),8+p.y*(b.y-8))}
 button._restoreDragPosition=restore;
 button.title='Tap to open; hold and drag to move. Alt + arrow keys also move it.';
 button.addEventListener('pointerdown',event=>{
  if(event.button!==0)return;const box=button.getBoundingClientRect();drag={id:event.pointerId,x:event.clientX,y:event.clientY,left:box.left,top:box.top,start:Date.now(),touch:event.pointerType==='touch',moved:false};button.setPointerCapture(event.pointerId);
 });
 button.addEventListener('pointermove',event=>{
  if(drag?.id!==event.pointerId)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
  if(!drag.moved&&(Math.hypot(dx,dy)<6||drag.touch&&Date.now()-drag.start<220))return;
  drag.moved=true;button.classList.add('is-dragging');place(drag.left+dx,drag.top+dy);
 });
 function save(){const box=button.getBoundingClientRect(),b=bounds();positions[mode()]={x:(box.left-8)/Math.max(1,b.x-8),y:(box.top-8)/Math.max(1,b.y-8)};try{localStorage.setItem(key,JSON.stringify(positions))}catch{}}
 function finish(event){if(drag?.id!==event.pointerId)return;if(drag.moved){save();suppressClick=true;setTimeout(()=>{suppressClick=false},250)}drag=null;button.classList.remove('is-dragging')}
 button.addEventListener('pointerup',finish);button.addEventListener('pointercancel',finish);button.addEventListener('lostpointercapture',finish);
 button.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopImmediatePropagation()}},true);
 button.addEventListener('keydown',event=>{if(!event.altKey||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();const box=button.getBoundingClientRect();place(box.left+(event.key==='ArrowLeft'?-16:event.key==='ArrowRight'?16:0),box.top+(event.key==='ArrowUp'?-16:event.key==='ArrowDown'?16:0));save()});
 window.addEventListener('resize',restore);window.visualViewport?.addEventListener('resize',restore);
}
export function mountAIChat(getLesson=()=>null){
 lessonGetter=getLesson;
 if(root)return;
 root=document.createElement('div');root.className='ai-chat-root';
 root.innerHTML=`<button type="button" id="ai-chat-launch" class="ai-chat-launch" aria-controls="ai-chat-panel" aria-expanded="false" hidden><img src="./icon.svg?v=3" width="24" height="24" alt=""> Study tutor</button>
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
 bindLauncherDrag(by('ai-chat-launch'));
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
 if(id&&client)by('ai-chat-launch')._restoreDragPosition?.();
 if(open)syncLessonLabel();
 setControls();
}
