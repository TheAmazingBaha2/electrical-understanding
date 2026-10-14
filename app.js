import {renderElectronicsWorkspace,attachElectronicsWorkspace} from './electronics-workspace.js';
import {renderSavedReinforcement} from './source-navigation.js';
import {placementForLesson,sectionView,nextSourceLesson,lessonReferencePages,studySections,studyInventory,learningProgress} from './learning-structure.js';
import { ProgressStore, cloudTransport } from './persistence.js';
import { preservedLessons } from './approved-lessons.js';
import {publishedLessons} from './published-lessons.js';
import { mountAIChat, updateAIChatSession, refreshAIChatContext } from './ai-chat-widget.js';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_ENVIRONMENT } from './config.js';
import { lessons, books } from './lessons.js';
import { v2Dashboard, v2Page } from './v2-panels.js';
import { labLessons } from './lab-lessons.js';
import { bookLessons as originalBookLessons } from './book-lessons.js';
import {geierWorkshops,reviseDmmLessons} from './geier-workshops.js';
import {attachWorkshopWidgets} from './workshop-widgets.js';
import {lessonRequirementsMet,workshopCheckUpdate} from './workshop-progress.js';
const bookLessons=[...reviseDmmLessons(originalBookLessons),...geierWorkshops];
import { cetaLessons } from './ceta-lessons.js';
import {mathLessons, mathAvailability,relatedMath} from './math-lessons.js';
import {legacyGroup,legacyReason,isArchivedLesson} from './legacy-groups.js';
import {attachMathWidgets} from './math-widgets.js';
import { attachGeneratedSimulations } from './generated-simulations.js';
import { attachLabWidgets } from './lab-widgets.js';
import { attachDmmWidgets } from './dmm-widgets.js';
import { attachCetaWidgets } from './ceta-widgets.js';
import { tabbedLesson } from './lesson-view.js';
import { attachGeneratedPredictions } from './lesson-tabs.js';

const $ = (s) => document.querySelector(s);
const esc = (value='') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const duration = ms => new Date(ms).toLocaleDateString(undefined,{month:'short',day:'numeric'});
const now = () => Date.now();
const DAY = 24*60*60*1000;
const sourceLessons=[...lessons,...labLessons,...bookLessons,...cetaLessons];
const allLessons=[...sourceLessons,...mathLessons];
// Previously approved lessons use repository assets, independent of retired authoring.
// Their IDs and existing graded answers are never rewritten on library refresh.
const generatedLessons=new Map([...preservedLessons,...publishedLessons].map(lesson=>[lesson.id,lesson]));
const findLesson=id=>allLessons.find(l=>l.id===id)||generatedLessons.get(id);
const labUnlocked=l=>l?.id===labLessons[0].id || Boolean(labLessons.length && hasPassed(labLessons[0]));
const bookUnlocked=l=>l?.independent===true || l?.id===bookLessons[0].id || Boolean(bookLessons.length && hasPassed(bookLessons[0]));
const guideUnlocked=l=>l?.id===cetaLessons[0].id || Boolean(cetaLessons.length && hasPassed(cetaLessons[cetaLessons.findIndex(original=>original.id===l.id)-1]));
const canOpenLesson=l=>{
 if(!l)return false;if(l.publicationPackage&&l.prerequisites.some(id=>!hasPassed(findLesson(id))))return false;if(l.generated||l.subtrack==='math')return true;
 const pilotIndex=lessons.findIndex(original=>original.id===l.id);
 if(pilotIndex>=0)return unlocked(pilotIndex);
 if(l.subtrack==='geier')return bookUnlocked(l);
 if(l.subtrack==='guide')return guideUnlocked(l);
 return labLessons.some(original=>original.id===l.id)&&labUnlocked(l);
};
let supabase=null, user=null, view='dashboard', activeLesson=null, focusQuestion=null, progress={}, busy=false;
let lessonTab='overview', activityIndex=0, quizIndex=0, learnIndex=0;
// Only Cloudflare preview hosts may connect to the isolated staging project.
const stagingPreview = /(^|\.)(?:pages|workers)\.dev$/i.test(window.location.hostname);
// Cloudflare staging is isolated from production Supabase progress by design.
const stagingBackend = false; // Separate V3 backend requires explicit authorization.
const configured = stagingPreview && stagingBackend && Boolean(SUPABASE_PUBLISHABLE_KEY);
// Fail closed if this development build is opened anywhere other than Cloudflare's staging domain.
let toastTimer;
function notify(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),4200)}
let store = new ProgressStore(localStorage, null), storageError = null;
function localLoad(){
 store = new ProgressStore(localStorage, user?.id); storageError = null;
 try{return store.read().progress}catch(error){storageError=error.message;notify(error.message);return {}}
}
function getAnonymousSnapshot(){return new ProgressStore(localStorage,null).read().progress}
function getState(id){return progress[id] || {answers:{},complete:false,updatedAt:0}}
function getAccuracy(lesson){const a=getState(lesson.id).answers||{};const done=lesson.questions.filter(q=>a[q.id]?.correct===true).length;return {correct:done,total:lesson.questions.length,answered:lesson.questions.filter(q=>typeof a[q.id]?.correct==='boolean').length}}
function hasPassed(lesson){if(!lesson)return false;const state=getState(lesson.id);if(lesson.workshop||lesson.labs)return lessonRequirementsMet(lesson,state);if(state.complete===true)return true;const a=state.answers||{};const hits=lesson.questions.filter(q=>a[q.id]?.correct===true).length;
  return lesson.questions.every(q=>typeof a[q.id]?.correct==='boolean') && hits>=Math.ceil(.8*lesson.questions.length) && lesson.questions.filter(q=>q.safety).every(q=>a[q.id]?.correct===true);
}
function unlocked(index){return index===0 || hasPassed(lessons[index-1]);}
function finishedCount(){return lessons.filter(hasPassed).length}
function reviewQueue(){return [...allLessons,...generatedLessons.values()].flatMap((lesson,index)=>!canOpenLesson(lesson,index)?[]:lesson.questions.flatMap(q=>{
 const a=getState(lesson.id).answers?.[q.id];return a&&typeof a.correct==='boolean'&&a.reviewDue<=now()?[{lesson,q,a}]:[];
})).sort((a,b)=>a.a.reviewDue-b.a.reviewDue)}
function syncLabel(text,isOnline=false){$('#sync-status').textContent=text;$('#status-dot').classList.toggle('online',isOnline)}
async function connect(){
 progress=localLoad();
 if(!configured){syncLabel('V3 development · local practice');render();return}
 try {
   const pkg=await import('https://esm.sh/@supabase/supabase-js@2.57.4');
   supabase=pkg.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
   supabase.auth.onAuthStateChange((_event,session)=>{
     if(session?.user?.id!==user?.id){user=session?.user||null;progress=localLoad();updateAIChatSession(user,supabase);syncLabel(user?'Staging cloud connected':'Sign in for staging sync',!!user);render();if(user){void loadCloud();void loadApprovedInventory();}}
   });
   const {data,error}=await supabase.auth.getSession();if(error)throw error;
   user=data.session?.user||null;progress=localLoad();updateAIChatSession(user,supabase);syncLabel(user?'Cloud connected':'Sign in to synchronize',!!user);
   if(user){await loadCloud();await loadApprovedInventory();}
 }catch(err){syncLabel('Cloud connection unavailable');notify('Cloud unavailable. Local progress remains on this device.');console.error(err)}
 render();
}
async function loadApprovedInventory(){
 // Repository-owned approved artifacts are already registered. No authoring database needed.
 return preservedLessons;
}
let syncTask = null, syncAgain = false;
async function loadCloud(){
 if(!supabase||!user)return;
 if(syncTask){syncAgain=true;return syncTask}
 const currentStore=store, id=user.id;
 syncTask=(async()=>{
  try {
   await currentStore.sync(cloudTransport(supabase,id),()=>store===currentStore&&user?.id===id);
   if(store!==currentStore)return;
   progress=currentStore.read().progress;
   const count=Object.keys(currentStore.read().conflicts).length;
   syncLabel(count?`${count} sync conflict(s) · review Account`:'Cloud synced',!count);
   if(count)notify('Both copies are safe. Open Account to review sync conflicts.');
  }catch(error){if(store===currentStore){syncLabel('Sync paused · local copy retained');notify(error.message)}}
  finally {if(store===currentStore&&!['lesson','scan-inbox','reviews','textbooks','subtrack','ceta','labs','legacy','math'].includes(view)&&!document.activeElement?.matches('input,textarea,select'))render()}
 })();
 try{await syncTask}finally{syncTask=null;if(syncAgain){syncAgain=false;void loadCloud()}}
}
async function saveWorkshopCheck(lessonId,activityId,value,correct){
 const currentStore=store,lesson=findLesson(lessonId);if(!lesson?.workshop||!lesson.activities.some(a=>a.id===activityId&&a.required!==false)||busy)return false;busy=true;
 try{
  if(storageError)throw new Error(storageError);
  const doc=await currentStore.edit(lessonId,s=>{s.workshopChecks??={};s.workshopChecks[activityId]=workshopCheckUpdate(s.workshopChecks[activityId],value,correct);s.complete=lessonRequirementsMet(lesson,s);s.updatedAt=now();});
  if(store!==currentStore)return false;progress=doc.progress;syncLabel(user?'Activity saved · syncing':'Activity saved on this device');if(user)void loadCloud();return true;
 }catch(error){notify('Activity not saved: '+error.message);return false;}finally{busy=false;}
}
async function saveAnswer(lessonId,qid,update){
 const currentStore=store;let saved=false;busy=true;
 try{
  if(storageError)throw new Error(storageError);
  const doc=await currentStore.edit(lessonId,s=>{
   s.answers[qid]=update(s.answers[qid]||{});
   const lesson=findLesson(lessonId),a=s.answers;
   s.complete=lesson.workshop||lesson.labs?lessonRequirementsMet(lesson,s):s.complete===true||(lesson.questions.every(q=>typeof a[q.id]?.correct==='boolean')&&lesson.questions.filter(q=>a[q.id]?.correct===true).length>=Math.ceil(.8*lesson.questions.length)&&lesson.questions.filter(q=>q.safety).every(q=>a[q.id]?.correct===true));
   s.updatedAt=now();
  });
  if(store!==currentStore)return;
  progress=doc.progress;saved=true;syncLabel(user?'Saved on device · syncing':'Saved on this device');if(user)void loadCloud();
 }catch(error){notify('Answer not saved: '+error.message);syncLabel('Storage blocked · export your progress')}
 finally{busy=false;if(saved)render()}
}
async function switchTo(next,id=null,qid=null){
 await workspaceCleanup?.();workspaceCleanup=null;
 if(['scan-inbox','ai-lab'].includes(next))next='account';
 const startingLesson=['lesson','generated-lesson'].includes(next)&&(view!==next||activeLesson!==id);
 if(startingLesson){lessonTab=qid?'quiz':'overview';activityIndex=0;learnIndex=0;quizIndex=Math.max(0,findLesson(id)?.questions.findIndex(q=>q.id===qid)||0);}
 view=next;activeLesson=id;focusQuestion=qid;
 setSidebarOpen(false);render();window.scrollTo({top:0,behavior:'instant'});
 if(qid)setTimeout(()=>document.getElementById('question-'+qid)?.scrollIntoView({behavior:'smooth',block:'center'}),70);
 if(next==='legacy'&&id==='unreferenced')setTimeout(()=>document.getElementById('legacy-unreferenced')?.scrollIntoView({behavior:'smooth',block:'start'}),90);
 if(next==='legacy'&&id==='chapter')setTimeout(()=>document.getElementById('legacy-scanned-chapter')?.scrollIntoView({behavior:'smooth',block:'start'}),90);
 if(view!=='scan-inbox'&&user&&supabase&&['dashboard','legacy','reviews','ceta','textbooks','math','labs','subtrack'].includes(next))void loadApprovedInventory();
}
function allowAutomaticCloudSync(){return true}
function setSidebarOpen(open){
 $('.sidebar').classList.toggle('open',open);
 $('#menu-toggle').setAttribute('aria-expanded',String(open));
}
function bindSidebarResize(){
 const sidebar=$('.sidebar'),handle=$('#sidebar-resize'),root=document.documentElement;
 const media=window.matchMedia('(max-width:920px)'),key='eu_sidebar_width_v1';
 const preferred={desktop:245,mobile:250};
 try{const saved=JSON.parse(localStorage.getItem(key)||'{}');for(const mode of ['desktop','mobile'])if(Number.isFinite(saved[mode])&&saved[mode]>=200&&saved[mode]<=480)preferred[mode]=saved[mode]}catch{}
 const mode=()=>media.matches?'mobile':'desktop';
 const bounds=()=>({min:200,max:media.matches?Math.min(420,window.innerWidth-44):Math.min(480,window.innerWidth-480)});
 function apply(width,remember=false){
  const {min,max}=bounds(),value=Math.round(Math.max(min,Math.min(max,width)));
  root.style.setProperty('--sidebar-width',value+'px');
  handle.setAttribute('aria-valuemin',String(min));handle.setAttribute('aria-valuemax',String(max));handle.setAttribute('aria-valuenow',String(value));handle.setAttribute('aria-valuetext',value+' pixels');
  if(remember){preferred[mode()]=value;try{localStorage.setItem(key,JSON.stringify(preferred))}catch{}}
 }
 let drag=null;
 handle.addEventListener('pointerdown',event=>{
  if(event.button!==0)return;
  drag={id:event.pointerId,start:event.clientX,width:sidebar.getBoundingClientRect().width};
  handle.setPointerCapture(event.pointerId);handle.focus();root.classList.add('sidebar-resizing');event.preventDefault();
 });
 handle.addEventListener('pointermove',event=>{if(drag?.id===event.pointerId)apply(drag.width+event.clientX-drag.start)});
 function finish(event){if(drag?.id!==event.pointerId)return;apply(Number(handle.getAttribute('aria-valuenow')),true);drag=null;root.classList.remove('sidebar-resizing')}
 handle.addEventListener('pointerup',finish);handle.addEventListener('pointercancel',finish);handle.addEventListener('lostpointercapture',finish);
 handle.addEventListener('keydown',event=>{
  const {min,max}=bounds(),width=Number(handle.getAttribute('aria-valuenow')),step=event.shiftKey?40:10;
  const next={ArrowLeft:width-step,ArrowRight:width+step,Home:min,End:max}[event.key];
  if(next!==undefined){event.preventDefault();apply(next,true)}
 });
 window.addEventListener('resize',()=>apply(preferred[mode()]));apply(preferred[mode()]);
}
function bindNavigation(){document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>switchTo(b.dataset.view)));
 $('#menu-toggle').addEventListener('click',()=>setSidebarOpen(!$('.sidebar').classList.contains('open')));
 $('#sidebar-close').addEventListener('click',()=>{setSidebarOpen(false);$('#menu-toggle').focus()});
 bindSidebarResize();
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&$('.sidebar').classList.contains('open')){setSidebarOpen(false);$('#menu-toggle').focus()}});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&user&&supabase&&allowAutomaticCloudSync())void loadCloud()});
 window.addEventListener('online',()=>{if(user&&allowAutomaticCloudSync())void loadCloud()});
 window.addEventListener('storage',event=>{if(event.key===store.key){try{progress=store.read().progress;if(!['lesson','scan-inbox','reviews','textbooks','subtrack','ceta','labs','legacy','math'].includes(view)&&!document.activeElement?.matches('input,textarea,select'))render()}catch(error){storageError=error.message;notify(error.message)}}});
 setInterval(()=>{if(user&&navigator.onLine&&document.visibilityState==='visible'&&allowAutomaticCloudSync())void loadCloud()},30000);
}
function v2Context(){
 const archivedPilotLessons=lessons.filter(l=>legacyGroup(l)==='pilot');
 const archivedUnreferencedLessons=[...cetaLessons,...mathLessons].filter(l=>legacyGroup(l)==='unreferenced');
 const approvedGeneratedLessons=[...generatedLessons.values()];
 const archivedGeneratedLessons=approvedGeneratedLessons.filter(l=>l.archived);
 const activeGeneratedLessons=approvedGeneratedLessons.filter(l=>!l.archived);
 return {lessons,progress,hasPassed,unlocked,reviews:reviewQueue().length,banner:cloudBanner(),
 coreRows:lessonRows(lessons),legacyRows:lessonRows(archivedPilotLessons),
 archivedPilotLessons,archivedUnreferencedLessons,archivedGeneratedLessons,activeGeneratedLessons,legacyReason,
 canOpenArchive:l=>canOpenLesson(l,allLessons.indexOf(l)),
 labLessons,bookLessons,cetaLessons,activeCetaLessons:cetaLessons.filter(l=>!isArchivedLesson(l)),
 mathLessons,activeMathLessons:mathLessons.filter(l=>!isArchivedLesson(l)),
 sourceLessons,mathIsAvailable:l=>canOpenLesson(l,allLessons.indexOf(l)),
 sourceIsAvailable:l=>canOpenLesson(l,sourceLessons.indexOf(l))};
}
function setNav(){const current=view==='generated-lesson'?(generatedLessons.get(activeLesson)?.archived?'account':sectionView(placementForLesson(generatedLessons.get(activeLesson)||{}).section)):view==='lesson'?(isArchivedLesson(activeLesson)?'account':mathLessons.some(l=>l.id===activeLesson)?'math':lessons.some(l=>l.id===activeLesson)?'ceta':bookLessons.some(l=>l.id===activeLesson)?'textbooks':cetaLessons.some(l=>l.id===activeLesson)?'ceta':'labs'):(view==='legacy'||view==='curriculum')?'account':view==='subtrack'?(activeLesson==='core'||['guide','exam'].includes(activeLesson)?'ceta':['geier','teach','principles','cabling'].includes(activeLesson)?'textbooks':'labs'):view;
 document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',current===b.dataset.view));
 const context=v2Context(),inventory=studyInventory(context);
 for(const section of studySections){const status=$('[data-nav-status="'+section.id+'"]');if(status){const graded=learningProgress(inventory.filter(l=>l.curriculum.section===section.section),context).total;status.textContent=graded||(section.id==='reviews'&&context.reviews)?'':'TBD'}}
}
const dashboardPanelStates=new Map();
let workspaceCleanup=null;
function render(){setNav();refreshAIChatContext();const names={'generated-lesson':'Approved lesson workbench',dashboard:'Your learning dashboard',ceta:'Exam Prep',curriculum:'Legacy lessons',legacy:'Legacy lessons',textbooks:'Textbook companions',labs:'Labs',math:'Math Practice',subtrack:'Learning sub-track',lesson:'Lesson workbench',reviews:'Review',workbench:'Electronics lab',library:'Textbook companions','scan-inbox':'Scan Inbox',account:'Your study account','ai-lab':'Private AI model tests'};
 $('#page-title').textContent=names[view]||names.dashboard;
 const main=$('#main');
 workspaceCleanup?.();workspaceCleanup=null;
 const disclosures=new Set([...main.querySelectorAll('details[data-disclosure][open]')].map(el=>el.dataset.disclosure));
 main.innerHTML=view==='workbench'?renderElectronicsWorkspace():view==='dashboard'?renderDashboard():['lesson','generated-lesson'].includes(view)?renderLesson():view==='reviews'?'<header class="source-heading"><p class="v2-kicker">RETURN TO THE IDEAS</p><h2>Review</h2><p>Review brings ideas from your regular lessons back into practice. The broader format is still to be decided; your scheduled quiz checks remain available below.</p></header>'+renderReviews():view==='account'?renderAccount():view==='library'?renderLibrary():v2Page(view,v2Context(),activeLesson);
 for(const el of main.querySelectorAll('details[data-disclosure]'))if(disclosures.has(el.dataset.disclosure))el.open=true;
 main.querySelectorAll('[data-toggle-panel]').forEach(button=>{
  const panel=document.getElementById(button.dataset.togglePanel);if(!panel)return;
  function apply(expanded){panel.hidden=!expanded;button.setAttribute('aria-expanded',String(expanded));button.setAttribute('aria-label',(expanded?'Collapse ':'Expand ')+button.dataset.panelLabel)}
  apply(dashboardPanelStates.get(button.dataset.togglePanel)??true);
  button.addEventListener('click',()=>{const expanded=panel.hidden;dashboardPanelStates.set(button.dataset.togglePanel,expanded);apply(expanded)});
 });
 main.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>switchTo(b.dataset.goto,b.dataset.lesson||null,b.dataset.question||null)));
 main.querySelectorAll('[data-lesson-tab]').forEach(b=>b.addEventListener('click',()=>{lessonTab=b.dataset.lessonTab;render()}));
 main.querySelectorAll('[data-reveal-insight]').forEach(b=>b.addEventListener('click',()=>{const p=main.querySelector('#starting-insight');if(!p)return;p.hidden=!p.hidden;b.setAttribute('aria-expanded',String(!p.hidden));b.innerHTML=p.hidden?'Reveal the starting insight <span aria-hidden="true">⌄</span>':'Hide the starting insight <span aria-hidden="true">⌃</span>'; }));
 main.querySelectorAll('[data-activity-index]').forEach(b=>b.addEventListener('click',()=>{activityIndex=Number(b.dataset.activityIndex);render()}));
 main.querySelectorAll('[data-learn-index]').forEach(b=>b.addEventListener('click',()=>{learnIndex=Number(b.dataset.learnIndex);render()}));
 main.querySelectorAll('[data-quiz-index]').forEach(b=>b.addEventListener('click',()=>{quizIndex=Number(b.dataset.quizIndex);render()}));
 main.querySelectorAll('[data-workshop-jump]').forEach(b=>b.addEventListener('click',()=>{activityIndex=Number(b.dataset.workshopJump);lessonTab='interact';render()}));
 main.querySelectorAll('[data-quiz-jump]').forEach(b=>b.addEventListener('click',()=>{quizIndex=Number(b.dataset.quizJump);lessonTab='quiz';render()}));
 const pathToggle=main.querySelector('[data-toggle-paths]');const courseMenu=main.querySelector('#course-paths-menu');
 if(pathToggle&&courseMenu){
   const closePaths=()=>{courseMenu.hidden=true;pathToggle.setAttribute('aria-expanded','false')};
   pathToggle.addEventListener('click',()=>{courseMenu.hidden=!courseMenu.hidden;pathToggle.setAttribute('aria-expanded',String(!courseMenu.hidden))});
   for(const node of [courseMenu,pathToggle])node.addEventListener('keydown',e=>{if(e.key==='Escape'){closePaths();pathToggle.focus()}});
   main.onclick=e=>{if(!e.target.closest('.course-menu-wrap'))closePaths()};
 } else main.onclick=null;
 const tabButtons=[...main.querySelectorAll('.lesson-tab')];
 tabButtons.forEach((button,i)=>button.addEventListener('keydown',event=>{
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
   event.preventDefault();
   const next=event.key==='Home'?0:event.key==='End'?tabButtons.length-1:(i+(event.key==='ArrowRight'?1:tabButtons.length-1))%tabButtons.length;
   lessonTab=tabButtons[next].dataset.lessonTab;render();main.querySelector('.lesson-tab.selected')?.focus();
 }));
 if(['lesson','generated-lesson'].includes(view)){attachQuiz();if(lessonTab==='interact'){
  renderExperiment();attachLabWidgets();attachDmmWidgets();attachCetaWidgets();attachMathWidgets();attachGeneratedSimulations(main);
  attachGeneratedPredictions(main,notify);
}const workshop=findLesson(activeLesson);if(workshop?.workshop)attachWorkshopWidgets(main,workshop,getState(workshop.id),(id,value,correct)=>saveWorkshopCheck(workshop.id,id,value,correct));}
 if(view==='account')attachAuth();
 if(view==='workbench')workspaceCleanup=attachElectronicsWorkspace(main);

}
function cloudBanner(){
 if(user)return '';
 return '<div class="sync-notice"><span>'+ (configured?'Sign in to keep your lessons and progress synced across devices.':'V3 development uses local practice. Your official V2 progress stays separate.')+'</span><button class="outline small-button" data-goto="account">Account & sync →</button></div>';
}
function renderDashboard(){return v2Dashboard(v2Context());}
function lessonRows(group){return group.map(l=>{const i=lessons.indexOf(l),a=getAccuracy(l),passed=hasPassed(l),lock=!unlocked(i);return `<div class="lesson-row"><div class="lesson-num">${lock?'⌁':passed?'✓':String(i+1).padStart(2,'0')}</div><div class="lesson-info"><p class="smallcaps">${esc(l.module)} · ${l.minutes} MIN</p><h3>${esc(l.title)}</h3><p>${esc(l.description)}</p><p class="lesson-page-reference"><strong>Reference pages:</strong> ${esc(lessonReferencePages(l))}</p>${a.answered?`<p class="muted sm">${a.correct}/${a.total} checks correct</p>`:''}</div><button class="${lock?'ghost':passed?'outline':'primary'} small-button" ${lock?'disabled':''} data-goto="lesson" data-lesson="${l.id}">${lock?'Locked':passed?'Revisit':'Study lesson'}</button></div>`}).join('')}
function renderCurriculum(){return v2Page('curriculum',v2Context());}
function renderLibrary(){return v2Page('textbooks',v2Context());}
function renderReviews(){const queue=reviewQueue();return renderSavedReinforcement(v2Context())+`<p class="muted">Reviews are scheduled after each check: one day after a missed answer, seven days after an initial success, and 21 days after a successful retry. Open a question to answer again.</p>${cloudBanner()}<div class="panel"><h2>Scheduled quiz reviews · ${queue.length} review${queue.length===1?'':'s'} due</h2>${queue.length?queue.map(({lesson,q,a})=>`<div class="review-item"><div><b>${esc(lesson.title)}</b><p class="muted sm">${esc(q.prompt)}<br>Scheduled ${duration(a.reviewDue)}</p></div><button class="primary small-button" data-goto="${lesson.generated?'generated-lesson':'lesson'}" data-lesson="${lesson.id}" data-question="${q.id}">Review →</button></div>`).join(''):`<div class="empty"><h3>You're caught up.</h3><p>When your completed questions become due, they'll appear here.</p></div>`}</div>`}
function renderLesson(){const lesson=findLesson(activeLesson);if(!lesson)return '<p>Lesson not found.</p>';
 const idx=lessons.indexOf(lesson),isPilot=idx>=0;
 if(lesson.generated){
  const score=getAccuracy(lesson),passed=hasPassed(lesson);
  return tabbedLesson({lesson,isPilot:false,isLegacyArchived:lesson.archived,idx:0,score,passed,
    nextLesson:lesson.seriesId?[...generatedLessons.values()].find(l=>l.seriesId===lesson.seriesId&&l.seriesOrder===lesson.seriesOrder+1)||null:null,tab:lessonTab,activityIndex,learnIndex,quizIndex,
    answers:getState(lesson.id).answers||{},workshopState:getState(lesson.id),questionHtml});
 }
 if(!canOpenLesson(lesson,allLessons.indexOf(lesson)))return '<div class="panel"><h2>Lesson not yet available</h2><p>'+ (lesson.subtrack==='math'?'Reach one of the linked electronics topics to unlock this mathematics companion.':'Complete the preceding lesson in this source track before continuing.')+'</p><button class="primary" data-goto="'+(isArchivedLesson(lesson)?'legacy':lesson.subtrack==='math'?'math':isPilot?'legacy':'subtrack')+'" '+(isArchivedLesson(lesson)||lesson.subtrack==='math'||isPilot?'':'data-lesson="'+(lesson.subtrack||'basic')+'"')+'>Back</button></div>';
 const score=getAccuracy(lesson),passed=hasPassed(lesson),nextLesson=lesson.seriesId?bookLessons.find(l=>l.seriesId===lesson.seriesId&&l.seriesOrder===lesson.seriesOrder+1)||null:lesson.subtrack==='math'?null:isPilot?lessons[idx+1]:lesson.subtrack==='geier'?nextSourceLesson(lesson,bookLessons):lesson.subtrack==='guide'?cetaLessons[cetaLessons.indexOf(lesson)+1]:labLessons[labLessons.indexOf(lesson)+1];
 const lessonView=tabbedLesson({lesson,isPilot,isLegacyArchived:isArchivedLesson(lesson),legacyGroup:legacyGroup(lesson),idx,score,passed,nextLesson,tab:lessonTab,activityIndex,learnIndex,quizIndex,answers:getState(lesson.id).answers||{},workshopState:getState(lesson.id),questionHtml});
 if(lesson.subtrack==='math')return lessonView;
 const math=relatedMath(lesson.id);
 return math.length?lessonView+'<aside class="math-related-panel panel"><div><strong>Math behind this topic</strong><p class="muted sm">Strengthen the equations and units that explain this lesson.</p></div>'+
 math.map(m=>'<button type="button" class="outline small-button" data-goto="lesson" data-lesson="'+esc(m.id)+'">'+esc(m.title)+' →</button>').join('')+'</aside>':lessonView;
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
 await saveAnswer(lesson.id,q.id,prev=>{
  const attempts=(prev.attempts||0)+1;
  if(q.type==='reflection')return {...prev,value,pending:true,attempts,correct:null};
  const correct=q.type==='choice'?Number(value)===q.correct:(Number.isFinite(Number(value))&&Math.abs(Number(value)-q.answer)<=q.tolerance);
  return {...prev,value,correct,pending:false,attempts,reviewDue:now()+(correct?(attempts>1?21:7):1)*DAY};
 });
 document.getElementById('question-'+q.id)?.scrollIntoView({block:'center'});
 }));
 document.querySelectorAll('[data-mark]').forEach(b=>b.addEventListener('click',async()=>{
 if(busy)return;const qid=b.closest('article').dataset.qid;
 await saveAnswer(lesson.id,qid,a=>a.pending?{...a,pending:false,correct:b.dataset.mark==='pass',reviewDue:now()+(b.dataset.mark==='pass'?7:1)*DAY}:a);
 document.getElementById('question-'+qid)?.scrollIntoView({block:'center'});
 }));
}
function expControl(label,id,min,max,value,unit,step=1){return `<div class="control"><label for="${id}">${label}: <b id="${id}-label">${value} ${unit}</b></label><input id="${id}" type="range" min="${min}" max="${max}" value="${value}" step="${step}"></div>`}
function renderExperiment(){const l=findLesson(activeLesson);const body=$('#experiment-body');if(!l||!body||l.experiment==='embedded'||l.generated)return;
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
function conflictCopy(state){
 if(!state)return '<p>No incoming record. This device retains its copy.</p>';
 return `<p>${state.complete?'Lesson marked complete':'Lesson in progress'}</p><ul>${Object.entries(state.answers||{}).map(([id,a])=>`<li><b>${esc(id)}</b>: ${esc(a.value??'No response')} · ${a.pending?'Awaiting self-check':a.correct===true?'Correct':a.correct===false?'Needs review':'Ungraded'}</li>`).join('')}</ul>`;
}
function recoveryPanel(){
 let doc;try{doc=store.read()}catch(error){return `<p class="flash">${esc(error.message)}</p>`}
 return `<h3>Backups and conflicts</h3><label>Import a progress JSON file <input id="import-file" type="file" accept="application/json,.json"></label>
 <p class="muted sm">Import preserves existing answers. Differences require review. Export includes local backups and both conflict copies.</p>
 ${Object.entries(doc.conflicts).map(([id,c])=>`<div class="panel"><b>${esc(id)} · ${esc(c.kind)} conflict</b><details><summary>Compare saved copies</summary><p>This device</p>${conflictCopy(doc.progress[id])}<p>Incoming</p>${conflictCopy(c.incoming)}</details><button data-resolve="${esc(id)}" data-incoming="false">Keep this device's copy</button> <button data-resolve="${esc(id)}" data-incoming="true">Use incoming copy</button><p class="muted sm">Both versions are backed up before resolution.</p></div>`).join('')}
 <label>Local recovery point <select id="backup-select">${store.backups().map(k=>`<option value="${esc(k)}">${esc(new Date(Number(k.split(':backup:')[1].split(':')[0])).toLocaleString())}</option>`).join('')}</select></label><button id="restore-backup">Restore through conflict review</button>`;
}
function renderAccount(){return `<div class="auth-card"><div class="panel"><h2>Account and cross-device sync</h2>${user?`<div class="success">Connected as <b>${esc(user.email||'your account')}</b>.<br>Answers save on this device first. Check the sync status for cloud confirmation or conflicts.</div><div class="actions"><button id="refresh-sync" class="outline">Refresh cloud progress</button><button id="sign-out" class="ghost">Sign out</button></div>`:
 !configured?`<div class="flash"><b>V3 development workspace.</b> Cloud sync and paid AI are disabled here to protect official V2 progress.</div>`:
  configured?`<p class="muted">Sign in with the same email address on your phone and your computer. You'll receive an email with a secure sign-in link.</p><label for="email">Email address</label><input class="email-input" type="email" id="email" autocomplete="email" placeholder="you@example.com"><div class="actions"><button id="email-login" class="primary">Email me a sign-in link</button></div>`:`<div class="flash"><b>Cloud service not configured.</b> This starter can be previewed in local practice mode, but it cannot synchronize devices until the Supabase connection is set up.</div><p class="muted sm">Follow SETUP.md in the project to create a Supabase project, apply the database rules and enter its URL and <em>publishable</em> key into <code>site/config.js</code>. Never put a secret/service-role key in the site.</p>`}
 <hr class="divider"><details class="account-maintenance"><summary>Archived study material</summary><p class="muted sm">Previously approved lessons and their study history stay available here.</p><div class="actions"><button class="outline small-button" data-goto="legacy">Archived study material</button></div></details><h3>Progress storage</h3><p class="muted sm">${user?'You are in cloud mode.':'You are in device-only practice mode.'} Local storage is used as a cache. Cloud records are private to the authenticated account through database access policies.</p>${user&&!storageError?`<button id="import-demo" class="outline small-button">Import this device's local practice</button><p class="muted sm">Practice stays separate until you import it. Differences require review.</p>`:''}
 ${recoveryPanel()}<div class="actions" style="margin-top:20px"><button id="export-progress" class="outline small-button">Export my progress (JSON)</button></div>
 </div><div class="panel" style="margin-top:16px"><h3>How synchronization behaves</h3><p class="muted sm">A submitted answer is saved locally and then sent to your account. Switching devices checks cloud revisions. If the cloud cannot be reached, the device keeps a local copy and retries when you return online. Simultaneous changes to the same lesson pause synchronization for that lesson. Both copies remain available in Account for explicit review. Device clocks never decide which answers survive.</p></div></div>`}
function attachAuth(){const login=$('#email-login');if(login)login.addEventListener('click',async()=>{const email=$('#email').value.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){notify('Enter a valid email address.');return}login.disabled=true;login.textContent='Sending…';const {error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:location.origin+location.pathname}});login.disabled=false;login.textContent='Email me a sign-in link';notify(error?'Sign-in failed: '+error.message:'Check your email for the sign-in link.');});
 $('#sign-out')?.addEventListener('click',async()=>{await supabase.auth.signOut();user=null;progress=localLoad();updateAIChatSession(null,supabase);syncLabel('Sign in to synchronize');render()});
 $('#refresh-sync')?.addEventListener('click',()=>void loadCloud());
 const importData=async(input)=>{const currentStore=store;try{const doc=await currentStore.import(input);if(store!==currentStore)return;progress=doc.progress;notify('Imported. Review any differences below.');render();if(user)void loadCloud()}catch(error){notify(error.message)}};
 $('#import-demo')?.addEventListener('click',()=>{try{void importData({schemaVersion:3,progress:getAnonymousSnapshot()})}catch(error){notify(error.message)}});
 $('#import-file')?.addEventListener('change',async event=>{try{const file=event.target.files[0];if(file){const readingStore=store;const text=await file.text();if(store!==readingStore)throw new Error('Account changed while reading file. Select it again.');await importData(JSON.parse(text))}}catch(error){notify('Import failed: '+error.message)}});
 $('#restore-backup')?.addEventListener('click',()=>{try{const key=$('#backup-select').value;if(key)void importData(JSON.parse(localStorage.getItem(key)))}catch(error){notify(error.message)}});
 document.querySelectorAll('[data-resolve]').forEach(button=>button.addEventListener('click',async()=>{const currentStore=store;try{const doc=await currentStore.resolve(button.dataset.resolve,button.dataset.incoming==='true');if(store!==currentStore)return;progress=doc.progress;render();if(user)void loadCloud()}catch(error){notify(error.message)}}));
 $('#export-progress')?.addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([store.export()],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='electrical-understanding-progress-v3.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1200)});
}
mountAIChat(()=>{const lesson=view==='lesson'?findLesson(activeLesson):null;
 return lesson?{title:lesson.title,module:lesson.module||'',description:(lesson.description||'').slice(0,180)}:null;});
bindNavigation();void connect();
