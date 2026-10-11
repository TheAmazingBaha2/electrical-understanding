import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './config.js';
import { lessons, books } from './lessons.js';
import { v2Dashboard, v2Page } from './v2-panels.js';
import { labLessons } from './lab-lessons.js';
import { attachLabWidgets } from './lab-widgets.js';
import { tabbedLesson } from './lesson-view.js';

const $ = (s) => document.querySelector(s);
const esc = (value='') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const duration = ms => new Date(ms).toLocaleDateString(undefined,{month:'short',day:'numeric'});
const now = () => Date.now();
const DAY = 24*60*60*1000;
const allLessons=[...lessons,...labLessons];
const findLesson=id=>allLessons.find(l=>l.id===id);
const labUnlocked=l=>l?.id===labLessons[0].id || Boolean(labLessons.length && hasPassed(labLessons[0]));
let supabase=null, user=null, view='dashboard', activeLesson=null, focusQuestion=null, progress={}, busy=false;
let lessonTab='overview', activityIndex=0, quizIndex=0;
// Treat every Cloudflare-hosted preview as local-only; never write to production Supabase.
const stagingPreview = /(^|\.)(?:pages|workers)\.dev$/i.test(window.location.hostname);
// Cloudflare staging is isolated from production Supabase progress by design.
const configured = !stagingPreview && Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
let toastTimer;
function notify(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),4200)}
function deviceKey(){return user?`eu_progress_v1_${user.id}`:'eu_demo_v1'}
function localLoad(){try{return JSON.parse(localStorage.getItem(deviceKey())||'{}')}catch{return {}}}
function persistLocal(){localStorage.setItem(deviceKey(),JSON.stringify(progress))}
function getState(id){return progress[id] || {answers:{},complete:false,updatedAt:0}}
function getAccuracy(lesson){const a=getState(lesson.id).answers||{};const done=Object.values(a).filter(v=>v.correct===true).length;return {correct:done,total:lesson.questions.length,answered:Object.values(a).filter(v=>typeof v.correct==='boolean').length}}
function hasPassed(lesson){const state=getState(lesson.id);if(state.complete===true)return true;const a=state.answers||{};const hits=lesson.questions.filter(q=>a[q.id]?.correct===true).length;
  return lesson.questions.every(q=>typeof a[q.id]?.correct==='boolean') && hits>=Math.ceil(.8*lesson.questions.length) && lesson.questions.filter(q=>q.safety).every(q=>a[q.id]?.correct===true);
}
function unlocked(index){return index===0 || hasPassed(lessons[index-1]);}
function finishedCount(){return lessons.filter(hasPassed).length}
function reviewQueue(){return allLessons.flatMap((lesson,index)=>(index<lessons.length?!unlocked(index):!labUnlocked(lesson))?[]:lesson.questions.flatMap(q=>{
 const a=getState(lesson.id).answers?.[q.id];return a&&typeof a.correct==='boolean'&&a.reviewDue<=now()?[{lesson,q,a}]:[];
})).sort((a,b)=>a.a.reviewDue-b.a.reviewDue)}
function syncLabel(text,isOnline=false){$('#sync-status').textContent=text;$('#status-dot').classList.toggle('online',isOnline);$('#account-pill').textContent=user?'Cloud account':configured?'Sign in':'Local practice'}
async function connect(){
 progress=localLoad();
 if(!configured){syncLabel(stagingPreview?'Staging preview · local practice only':'Local only · cloud not configured');render();return}
 try {
   const pkg=await import('https://esm.sh/@supabase/supabase-js@2');
   supabase=pkg.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
   supabase.auth.onAuthStateChange((_event,session)=>{
     if(session?.user?.id!==user?.id){user=session?.user||null;progress=localLoad();syncLabel(user?'Cloud connected':'Sign in to synchronize',!!user);render();if(user)void loadCloud();}
   });
   const {data,error}=await supabase.auth.getSession();if(error)throw error;
   user=data.session?.user||null;progress=localLoad();syncLabel(user?'Cloud connected':'Sign in to synchronize',!!user);
   if(user)await loadCloud();
 }catch(err){syncLabel('Cloud connection unavailable');notify('Cloud unavailable. Local progress remains on this device.');console.error(err)}
 render();
}
async function loadCloud(){
 if(!supabase||!user)return;
 const id=user.id;
 const {data,error}=await supabase.from('lesson_progress').select('lesson_id,data,updated_at').eq('user_id',id);
 if(error){notify('Could not load cloud progress: '+error.message);syncLabel('Sync error · local copy only');return}
 if(user?.id!==id)return;
 const fromCloud=Object.fromEntries((data||[]).map(row=>[row.lesson_id,row.data]));
 const currentLocal=localLoad();const merged={...fromCloud};
 for(const [key,value] of Object.entries(currentLocal)){
   if(!merged[key] || (value.updatedAt||0)>(merged[key].updatedAt||0))merged[key]=value;
 }
 progress=merged;persistLocal();
 // Upload only local records newer than cloud, never overwrite newer cloud records.
 const pending=Object.entries(currentLocal).filter(([k,v])=>!fromCloud[k]||(v.updatedAt||0)>(fromCloud[k].updatedAt||0));
 for(const [lessonId,state] of pending)await saveCloud(lessonId,state);
 syncLabel('Cloud synced',true);render();
}
async function saveCloud(lessonId,state){
 if(!supabase||!user)return;
 const {error}=await supabase.from('lesson_progress').upsert({user_id:user.id,lesson_id:lessonId,data:state,updated_at:new Date().toISOString()},{onConflict:'user_id,lesson_id'});
 if(error){syncLabel('Sync error · cached locally');notify('Saved locally; cloud sync failed: '+error.message);return}
 syncLabel('Saved to cloud',true);
}
async function saveLesson(lessonId){const s=getState(lessonId);s.complete=s.complete===true || hasPassed(findLesson(lessonId));s.updatedAt=now();progress[lessonId]=s;persistLocal();if(user)await saveCloud(lessonId,s);else syncLabel(configured?'Sign in to sync · local only':'Local only · cloud not configured');}
function switchTo(next,id=null,qid=null){
 const startingLesson=next==='lesson'&&(view!=='lesson'||activeLesson!==id);
 if(startingLesson){lessonTab=qid?'quiz':'overview';activityIndex=0;quizIndex=Math.max(0,findLesson(id)?.questions.findIndex(q=>q.id===qid)||0);}
 view=next;activeLesson=id;focusQuestion=qid;
 $('.sidebar').classList.remove('open');render();window.scrollTo({top:0,behavior:'instant'});
 if(qid)setTimeout(()=>document.getElementById('question-'+qid)?.scrollIntoView({behavior:'smooth',block:'center'}),70);
}
function bindNavigation(){document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>switchTo(b.dataset.view)));
 $('#menu-toggle').addEventListener('click',()=>$('.sidebar').classList.toggle('open'));
 $('#account-pill').addEventListener('click',()=>switchTo('account'));
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&user&&supabase)void loadCloud()});
 window.addEventListener('online',()=>{if(user)void loadCloud()});
}
function v2Context(){return {lessons,progress,hasPassed,unlocked,reviews:reviewQueue().length,banner:cloudBanner(),coreRows:lessonRows(lessons),labLessons};}
function setNav(){const current=view==='lesson'?'curriculum':view==='subtrack'?(activeLesson==='core'?'curriculum':['guide','exam'].includes(activeLesson)?'ceta':['geier','teach','principles','cabling'].includes(activeLesson)?'textbooks':'labs'):view;
 document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',current===b.dataset.view));}
function render(){setNav();const names={dashboard:'Your learning dashboard',ceta:'CETa preparation',curriculum:'Pilot Unit 1',textbooks:'Textbook companions',labs:'Hands-on laboratory',subtrack:'Learning sub-track',lesson:'Lesson workbench',reviews:'Spaced review',library:'Textbook companions','scan-inbox':'Scan Inbox',account:'Your study account'};
 $('#page-title').textContent=names[view]||names.dashboard;
 const main=$('#main');
 main.innerHTML=view==='dashboard'?renderDashboard():view==='lesson'?renderLesson():view==='reviews'?renderReviews():view==='account'?renderAccount():view==='library'?renderLibrary():v2Page(view,v2Context(),activeLesson);
 main.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>switchTo(b.dataset.goto,b.dataset.lesson||null,b.dataset.question||null)));
 main.querySelectorAll('[data-lesson-tab]').forEach(b=>b.addEventListener('click',()=>{lessonTab=b.dataset.lessonTab;render()}));
 main.querySelectorAll('[data-activity-index]').forEach(b=>b.addEventListener('click',()=>{activityIndex=Number(b.dataset.activityIndex);render()}));
 main.querySelectorAll('[data-quiz-index]').forEach(b=>b.addEventListener('click',()=>{quizIndex=Number(b.dataset.quizIndex);render()}));
 main.querySelectorAll('[data-quiz-jump]').forEach(b=>b.addEventListener('click',()=>{quizIndex=Number(b.dataset.quizJump);lessonTab='quiz';render()}));
 const pathToggle=main.querySelector('[data-toggle-paths]');const courseMenu=main.querySelector('#course-paths-menu');
 if(pathToggle&&courseMenu){pathToggle.addEventListener('click',()=>{courseMenu.hidden=!courseMenu.hidden;pathToggle.setAttribute('aria-expanded',String(!courseMenu.hidden))});
   courseMenu.addEventListener('keydown',e=>{if(e.key==='Escape'){courseMenu.hidden=true;pathToggle.setAttribute('aria-expanded','false');pathToggle.focus()}})}
 if(view==='lesson'){attachQuiz();if(lessonTab==='interact'){renderExperiment();attachLabWidgets()}}
 if(view==='account')attachAuth();
}
function cloudBanner(){if(user)return `<div class="success sm">Signed in. Your completed lessons and answers are saved to your cloud account.</div>`;
  if(stagingPreview)return `<div class="flash sm"><b>Safe staging mode:</b> This Cloudflare preview stores trial answers only in this browser. Production Supabase sign-in and syncing are intentionally disabled until a separate test database is configured. Your live study progress is protected.</div>`;
 return `<div class="flash sm"><b>${configured?'Sign in required for cross-device sync':'Cloud connection not configured yet'}.</b> You can explore this prototype and save locally, but that practice does <em>not</em> synchronize between your phone and desktop. <button class="outline small-button" data-goto="account">Account setup</button></div>`;
}
function renderDashboard(){return v2Dashboard(v2Context());}
function lessonRows(group){return group.map(l=>{const i=lessons.indexOf(l),a=getAccuracy(l),passed=hasPassed(l),lock=!unlocked(i);return `<div class="lesson-row"><div class="lesson-num">${lock?'⌁':passed?'✓':String(i+1).padStart(2,'0')}</div><div class="lesson-info"><p class="smallcaps">${esc(l.module)} · ${l.minutes} MIN</p><h3>${esc(l.title)}</h3><p>${esc(l.description)}</p>${a.answered?`<p class="muted sm">${a.correct}/${a.total} checks correct</p>`:''}</div><button class="${lock?'ghost':passed?'outline':'primary'} small-button" ${lock?'disabled':''} data-goto="lesson" data-lesson="${l.id}">${lock?'Locked':passed?'Revisit':'Study lesson'}</button></div>`}).join('')}
function renderCurriculum(){return v2Page('curriculum',v2Context());}
function renderLibrary(){return v2Page('textbooks',v2Context());}
function renderReviews(){const queue=reviewQueue();return `<p class="muted">Reviews are scheduled after each check: one day after a missed answer, seven days after an initial success, and 21 days after a successful retry. Open a question to answer again.</p>${cloudBanner()}<div class="panel"><h2>${queue.length} review${queue.length===1?'':'s'} due</h2>${queue.length?queue.map(({lesson,q,a})=>`<div class="review-item"><div><b>${esc(lesson.title)}</b><p class="muted sm">${esc(q.prompt)}<br>Scheduled ${duration(a.reviewDue)}</p></div><button class="primary small-button" data-goto="lesson" data-lesson="${lesson.id}" data-question="${q.id}">Review →</button></div>`).join(''):`<div class="empty"><h3>You're caught up.</h3><p>When your completed questions become due, they'll appear here.</p></div>`}</div>`}
function renderLesson(){const lesson=findLesson(activeLesson);if(!lesson)return '<p>Lesson not found.</p>';
 const idx=lessons.indexOf(lesson),isPilot=idx>=0;
 if((isPilot&&!unlocked(idx))||(!isPilot&&!labUnlocked(lesson)))return '<div class="panel"><h2>Lesson locked</h2><p>Complete the previous lesson’s checks before continuing.</p><button class="primary" data-goto="'+(isPilot?'curriculum':'subtrack')+'" '+(isPilot?'':'data-lesson="basic"')+'>Back</button></div>';
 const score=getAccuracy(lesson),passed=hasPassed(lesson),nextLesson=isPilot?lessons[idx+1]:labLessons[labLessons.indexOf(lesson)+1];
 return tabbedLesson({lesson,isPilot,idx,score,passed,nextLesson,tab:lessonTab,activityIndex,quizIndex,answers:getState(lesson.id).answers||{},questionHtml});
}
function questionHtml(lesson,q,i){const a=getState(lesson.id).answers?.[q.id];const valid=typeof a?.correct==='boolean';const cls=valid?(a.correct?'good':'needs'):'';const val=a?.value||'';
 let input=q.type==='choice'?`<div class="options">${q.choices.map((c,j)=>`<label class="option"><input type="radio" name="${q.id}" value="${j}" ${String(val)===String(j)?'checked':''}>${esc(c)}</label>`).join('')}</div>`:q.type==='number'?`<input class="question-input" inputmode="decimal" type="text" aria-label="Numerical answer" placeholder="Enter number in ${esc(q.unit)}" value="${esc(val)}"> <span class="muted sm">${esc(q.unit)}</span>`:`<textarea class="short-answer" aria-label="Your explanation" placeholder="Explain your reasoning in your own words…">${esc(val)}</textarea>`;
 const feedback=a?.pending&&q.type==='reflection'?`<div class="feedback"><b>Compare your response to this rubric:</b><p>${esc(q.rubric)}</p><div class="actions"><button class="primary small-button" data-mark="pass">My answer covers this</button><button class="outline small-button" data-mark="retry">I need more practice</button></div></div>`:valid?`<div class="feedback ${a.correct?'good':'needs'}"><b>${a.correct?'Meets the check':'Review this concept'}</b><p>${esc(q.explain)}</p>${q.type==='reflection'?`<p><b>Rubric:</b> ${esc(q.rubric)}</p>`:''}<p class="muted sm">Review scheduled: ${duration(a.reviewDue)} · Attempts: ${a.attempts||1}</p></div>`:'';
 return `<article class="quiz-card ${cls}" id="question-${q.id}" data-qid="${q.id}"><div class="question-meta">CHECK ${i+1} / ${lesson.questions.length} · ${q.type==='choice'?'Multiple choice':q.type==='number'?'Calculation':'Explain'} ${q.safety?'· SAFETY CRITICAL':''}</div><h3>${esc(q.prompt)}</h3>${input}<div class="actions" style="margin-top:14px"><button class="primary small-button" data-submit="${q.id}">${q.type==='reflection'?'Compare to rubric':'Check answer'}</button>${valid?`<span class="muted sm">You can retry this check at any time.</span>`:''}</div>${feedback}</article>`;
}
function attachQuiz(){const lesson=findLesson(activeLesson);if(!lesson)return;document.querySelectorAll('[data-submit]').forEach(b=>b.addEventListener('click',async()=>{
 if(busy)return;const q=lesson.questions.find(q=>q.id===b.dataset.submit);const card=b.closest('article');let value;
 if(q.type==='choice')value=card.querySelector(`input[name="${q.id}"]:checked`)?.value;
 else if(q.type==='number')value=card.querySelector('input.question-input')?.value?.trim();
 else value=card.querySelector('textarea')?.value?.trim();
 if(value===undefined||value===''){notify('Enter or select an answer before submitting.');return}
 const a=getState(lesson.id).answers||{};const prev=a[q.id];const attempts=(prev?.attempts||0)+1;
 if(q.type==='reflection')a[q.id]={value,pending:true,attempts,correct:undefined};
 else {const correct=q.type==='choice'?Number(value)===q.correct:
   (Number.isFinite(Number(value))&&Math.abs(Number(value)-q.answer)<=q.tolerance);
   a[q.id]={value,correct,pending:false,attempts,reviewDue:now()+(correct?(attempts>1?21:7):1)*DAY};}
 const state=getState(lesson.id);state.answers=a;progress[lesson.id]=state;busy=true;await saveLesson(lesson.id);busy=false;render();document.getElementById('question-'+q.id)?.scrollIntoView({block:'center'});
 }));
 document.querySelectorAll('[data-mark]').forEach(b=>b.addEventListener('click',async()=>{
 if(busy)return;const card=b.closest('article');const qid=card.dataset.qid;const s=getState(lesson.id);const a=s.answers[qid];if(!a||!a.pending)return;
 a.pending=false;a.correct=b.dataset.mark==='pass';a.reviewDue=now()+(a.correct?7:1)*DAY;busy=true;await saveLesson(lesson.id);busy=false;render();document.getElementById('question-'+qid)?.scrollIntoView({block:'center'});
 }));
}
function expControl(label,id,min,max,value,unit,step=1){return `<div class="control"><label for="${id}">${label}: <b id="${id}-label">${value} ${unit}</b></label><input id="${id}" type="range" min="${min}" max="${max}" value="${value}" step="${step}"></div>`}
function renderExperiment(){const l=findLesson(activeLesson);const body=$('#experiment-body');if(!l||!body||l.experiment==='embedded')return;
 const type=l.experiment;
 if(type==='power'||type==='ohm'||type==='meters'){
  body.innerHTML=`<svg class="experiment-graph" viewBox="0 0 500 145" role="img" aria-label="Simple DC circuit with battery and resistor"><g fill="none" stroke="#b1c8d6" stroke-width="3"><path d="M88 70 V25 H215 M280 25 H410 V117 H88 V90"/><path d="M215 25 l10 -8 10 16 10 -16 10 16 10 -8 h15"/><path d="M75 70 H101 M81 77 H95"/><circle cx="88" cy="80" r="16"/></g><text x="250" y="12" text-anchor="middle" font-size="13" fill="#83CFFF">Resistor</text><text x="45" y="79" fill="#b1c8d6" font-size="12">DC</text><text x="305" y="135" fill="#a8b8c9" font-size="12">Simple load circuit</text></svg><div class="controls">${expControl('Voltage','exp-v',1,24,12,'V')}${expControl('Resistance','exp-r',1,24,6,'kΩ')}</div><p class="reading-stat" id="exp-out"></p><p class="muted sm">Predict what happens when voltage doubles or resistance doubles. These are ideal component values.</p>`;
  const update=()=>{const v=Number($('#exp-v').value),r=Number($('#exp-r').value);$('#exp-v-label').textContent=v+' V';$('#exp-r-label').textContent=r+' kΩ';$('#exp-out').textContent=`Current: ${(v/r).toFixed(2)} mA  ·  Power: ${(v*v/r).toFixed(2)} mW`};
  for(const x of ['exp-v','exp-r'])$('#'+x).addEventListener('input',update);update();
  if(type==='meters')$('#experiment-caption').textContent='This simple circuit calculates voltage, current and power; remember meter connections: voltage across, current through.';
 } else if(type==='parallel'){
  body.innerHTML=`<svg class="experiment-graph" viewBox="0 0 500 145" role="img" aria-label="Two parallel resistive branches"><g stroke="#b1c8d6" stroke-width="3" fill="none"><path d="M75 35 H420 V121 H75 V50 M200 35 V57 L190 66 L210 76 L190 86 L210 96 L200 106 V121 M350 35 V57 L340 66 L360 76 L340 86 L360 96 L350 106 V121"/><circle cx="75" cy="43" r="14"/></g><text x="197" y="20" text-anchor="middle" fill="#83CFFF">R1</text><text x="352" y="20" text-anchor="middle" fill="#83CFFF">R2</text></svg><div class="controls">${expControl('R1','exp-r1',1,24,6,'Ω')}${expControl('R2','exp-r2',1,24,3,'Ω')}</div><p class="reading-stat" id="exp-out"></p>`;
  const update=()=>{let r1=Number($('#exp-r1').value),r2=Number($('#exp-r2').value);$('#exp-r1-label').textContent=r1+' Ω';$('#exp-r2-label').textContent=r2+' Ω';let i1=12/r1,i2=12/r2;$('#exp-out').textContent=`Rtotal: ${(r1*r2/(r1+r2)).toFixed(2)} Ω · I1: ${i1.toFixed(2)} A · I2: ${i2.toFixed(2)} A · Itotal: ${(i1+i2).toFixed(2)} A`};
  for(const x of ['exp-r1','exp-r2'])$('#'+x).addEventListener('input',update);update();
 }else{
  body.innerHTML=`<div class="controls">${expControl('Resistance','exp-r',1,20,10,'kΩ')}${expControl('Capacitance','exp-c',1,100,10,'nF')}</div><p class="reading-stat" id="exp-out"></p><svg class="experiment-graph" id="exp-plot" viewBox="0 0 500 145" role="img" aria-label="RC low-pass relative output amplitude against frequency"></svg><p class="muted sm">The plot is a simplified magnitude response for an ideal first-order RC low-pass filter; frequency increases from left to right.</p>`;
  const update=()=>{let r=Number($('#exp-r').value),c=Number($('#exp-c').value),fc=1/(2*Math.PI*r*1000*c*1e-9);$('#exp-r-label').textContent=r+' kΩ';$('#exp-c-label').textContent=c+' nF';$('#exp-out').textContent=`Cutoff frequency: ${Math.round(fc).toLocaleString()} Hz`;let plot=$('#exp-plot'),coords=[];for(let i=0;i<=80;i++){const f=10*Math.pow(10,i/80*4);const gain=1/Math.sqrt(1+(f/fc)**2);coords.push(`${30+i*5.4},${125-gain*105}`)}plot.innerHTML=`<path d="M30 12 V125 H476" fill="none" stroke="#8599ac" stroke-width="1.5"/><path d="M${coords.join(' L')}" fill="none" stroke="#35E0F2" stroke-width="3"/><text x="32" y="13" fill="#adbfcc" font-size="12">Output amplitude</text><text x="370" y="140" fill="#adbfcc" font-size="12">Frequency →</text>`};
  for(const x of ['exp-r','exp-c'])$('#'+x).addEventListener('input',update);update();
 }
}
function renderAccount(){return `<div class="auth-card"><div class="panel"><h2>Account and cross-device sync</h2>${user?`<div class="success">Connected as <b>${esc(user.email||'your account')}</b>.<br>Lesson results are saved locally and to your Supabase account whenever you submit an answer.</div><div class="actions"><button id="refresh-sync" class="outline">Refresh cloud progress</button><button id="sign-out" class="ghost">Sign out</button></div>`:
 stagingPreview?`<div class="flash"><b>Staging mode: production sync disabled.</b> This site intentionally uses browser-only practice progress. Use your production GitHub Pages site for cloud-synced study until a separate test Supabase environment is configured.</div>`:
  configured?`<p class="muted">Sign in with the same email address on your phone and your computer. You'll receive an email with a secure sign-in link.</p><label for="email">Email address</label><input class="email-input" type="email" id="email" autocomplete="email" placeholder="you@example.com"><div class="actions"><button id="email-login" class="primary">Email me a sign-in link</button></div>`:`<div class="flash"><b>Cloud service not configured.</b> This starter can be previewed in local practice mode, but it cannot synchronize devices until the Supabase connection is set up.</div><p class="muted sm">Follow SETUP.md in the project to create a Supabase project, apply the database rules and enter its URL and <em>publishable</em> key into <code>site/config.js</code>. Never put a secret/service-role key in the site.</p>`}
 <hr class="divider"><h3>Progress storage</h3><p class="muted sm">${user?'You are in cloud mode.':'You are in device-only practice mode.'} Local storage is used as a cache. Cloud records are private to the authenticated account through database access policies.</p>${user&&Object.keys(localDemo()).length?`<button id="import-demo" class="outline small-button">Import this device's local practice</button><p class="muted sm">Only practice data from this device will be merged; newer cloud data is retained.</p>`:''}
 <div class="actions" style="margin-top:20px"><button id="export-progress" class="outline small-button">Export my progress (JSON)</button></div>
 </div><div class="panel" style="margin-top:16px"><h3>How synchronization behaves</h3><p class="muted sm">A submitted answer is saved locally and then sent to your account. Switching devices loads the newest saved record. If the cloud cannot be reached, the device keeps a local copy and retries when you return online. In this starter, simultaneous edits to the <em>same lesson</em> on different devices may use last-write-wins rather than a fine-grained merge.</p></div></div>`}
function localDemo(){try{return JSON.parse(localStorage.getItem('eu_demo_v1')||'{}')}catch{return {}}}
function attachAuth(){const login=$('#email-login');if(login)login.addEventListener('click',async()=>{const email=$('#email').value.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){notify('Enter a valid email address.');return}login.disabled=true;login.textContent='Sending…';const {error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:location.origin+location.pathname}});login.disabled=false;login.textContent='Email me a sign-in link';notify(error?'Sign-in failed: '+error.message:'Check your email for the sign-in link.');});
 $('#sign-out')?.addEventListener('click',async()=>{await supabase.auth.signOut();user=null;progress=localLoad();syncLabel('Sign in to synchronize');render()});
 $('#refresh-sync')?.addEventListener('click',()=>void loadCloud());
 $('#import-demo')?.addEventListener('click',async()=>{const demo=localDemo();let changed=0;for(const [key,value] of Object.entries(demo)){if(!progress[key]||(value.updatedAt||0)>(progress[key].updatedAt||0)){progress[key]=value;await saveCloud(key,value);changed++}}persistLocal();notify(`Imported ${changed} newer practice record(s).`);render()});
 $('#export-progress')?.addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify({version:1,exportedAt:new Date().toISOString(),progress},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='electrical-understanding-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1200)});
}
bindNavigation();void connect();
