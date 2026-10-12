// Private scan review workspace. Source files live in protected Supabase Storage, not public assets.
// Never inserts generated drafts into legacy lessons or graded progress automatically.
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const bucket="eu-private-scans";
// Book titles and editions are private, reusable reference metadata, not uploaded book files.
const catalogBookTitle=book=>String(book?.title||'').trim()+
 (book?.edition?' ('+String(book.edition).trim()+')':'');
const catalogTracks=new Set(['geier','teach','principles','cabling','guide','basic','other']);

const supported=new Map([["application/pdf","pdf"],["image/jpeg","jpg"],["image/png","png"],["image/webp","webp"]]);
let selectedId=null, operation=false, lastUsage=null;
const by=s=>document.querySelector(s);
const pauseKey='eu-scan-inbox-auto-sync-paused';
let pauseFallback=false;
// A tab-local preference: no scan contents or personal data are written here.
export function scanInboxAutoUpdatesPaused(){
 try{return sessionStorage.getItem(pauseKey)==='1'}catch{return pauseFallback}
}
function setScanInboxAutoUpdatesPaused(paused){
 pauseFallback=paused;
 try{sessionStorage.setItem(pauseKey,paused?'1':'0')}catch{/* Browsers may disable session storage. */}
}
function humanState(state){
 return ({uploaded:"Awaiting Astra interpretation",analyzed:"Ready for Sol chapter outline",outlined:"Ready for next chapter lesson",
  drafted:"Ready for Astra technical review",reviewed:"Ready for your approval",
  needs_revision:"Review found problems — revise with Sol",approved:"Approved for your private lesson library"})[state]||state;
}
// Detach Android content-provider files immediately, before another app changes the file handle.
export async function prepareScanFile(file){
 if(!file||file.size<1||file.size>5242880)throw Error('Choose a file of 5 MB or less.');
 let bytes;
 try{bytes=await file.arrayBuffer()}catch{throw Error('Your phone could not read this file. Save the scan to Downloads, then select it again.')}
 if(bytes.byteLength!==file.size)throw Error('The selected file changed while reading. Select it again.');
 const b=new Uint8Array(bytes),prefix=n=>Array.from(b.slice(0,n)).join(',');
 const type=prefix(4)==='37,80,68,70'?'application/pdf'
  :prefix(8)==='137,80,78,71,13,10,26,10'?'image/png'
  :prefix(3)==='255,216,255'?'image/jpeg'
  :String.fromCharCode(...b.slice(0,4))==='RIFF'&&String.fromCharCode(...b.slice(8,12))==='WEBP'?'image/webp':null;
 if(!type)throw Error('Choose a valid PDF, PNG, JPEG or WebP scan.');
 return {bytes,type,extension:supported.get(type)};
}
export function renderScanInbox(user){
 if(!user)return '<header class="v2-intro"><p class="v2-kicker">PRIVATE SOURCE LIBRARY</p><h2>Scan Inbox</h2><p>Sign in to your staging study account before uploading and building lessons.</p><button class="primary" data-goto="account">Sign in →</button></header>';
 return `<section id="scan-root" class="scan-workbench">
 <header class="v2-intro"><p class="v2-kicker">SOURCE-BASED LEARNING · PRIVATE STAGING</p><h2>Scan Inbox & lesson studio</h2>
  <p>Upload a short, legible textbook excerpt. Sol prepares a teaching brief, Astra extracts the evidence, Sol writes a teaching draft, and Astra reviews its accuracy. Only your manual approval adds it to your private lesson library.</p></header>
 <div class="scan-upload-panel panel"><h3>1 · Add a private source</h3>
  <p class="muted sm">PDF, JPG, PNG or WebP · up to 5 MB each. For affordable, reliable interpretation, upload 1–3 clear pages per source. Do not include personal identifying information.</p>
  <form id="scan-upload-form" class="scan-upload-form">
   <label>Source label<input id="scan-title" type="text" maxlength="140" required placeholder="e.g. CETa Chapter 4 — Series circuits"></label>
   <div class="scan-book-picker">
    <label for="scan-book">Book / publication</label>
    <div class="scan-book-picker-row"><select id="scan-book" required aria-describedby="scan-books-hint">
     <option value="">Loading your books…</option>
    </select><button type="button" class="outline small-button" id="scan-book-refresh">Refresh books</button></div>
    <p class="muted sm" id="scan-books-hint" aria-live="polite">Your saved book list is private and shared between your signed-in devices.</p>
    <div id="scan-new-book-panel" class="scan-new-book-panel" hidden>
     <h4>Add / import a book into your library</h4>
     <p class="muted sm">Save the book's information once. This does not upload an entire book or use AI credits; you will still choose the scanned pages separately below.</p>
     <div class="scan-new-book-grid">
      <label>Book title<input id="scan-new-book-title" type="text" maxlength="180" placeholder="Full book title"></label>
      <label>Author (optional)<input id="scan-new-book-author" type="text" maxlength="180" placeholder="Author or editor"></label>
      <label>Edition (optional)<input id="scan-new-book-edition" type="text" maxlength="50" placeholder="e.g. 7th edition"></label>
      <label>Usual study track<select id="scan-new-book-track">
       <option value="other">Other book / source</option><option value="guide">Exam Preparation / CETa</option>
       <option value="teach">Teach Yourself Electricity and Electronics</option>
       <option value="principles">Electronics: Principles and Applications</option>
       <option value="geier">Geier / DMM companion</option><option value="cabling">Cabling / Networking</option>
       <option value="basic">Hands-On Laboratory</option>
      </select></label>
     </div>
     <div class="scan-book-actions"><button type="button" class="primary small-button" id="scan-add-book">Save book to my library (free)</button>
      <button type="button" class="outline small-button" id="scan-cancel-new-book">Cancel</button></div>
    </div>
   </div>
   <label>Printed pages shown in this scan<input id="scan-pages" type="text" maxlength="80" required placeholder="e.g. pp. 104–106 or Figure 3.2, p. 45"></label>
   <label>Destination track<select id="scan-track"><option value="other">Other book / source</option><option value="geier">How to Diagnose and Fix Everything Electronic</option><option value="teach">Teach Yourself Electricity and Electronics</option><option value="principles">Electronics: Principles and Applications</option><option value="cabling">Cabling / Networking</option><option value="guide">Associate CET Study Guide</option><option value="basic">Hands-On Laboratory</option></select></label>
   <p class="muted sm">Use the printed page numbers, not the PDF reader's position. These source details will accompany every generated lesson and review exercise.</p>
   <label>Private scanned pages<input id="scan-file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp" required></label>
   <label class="scan-consent"><input id="scan-share-consent" type="checkbox" required> I authorize sending this particular scan to OpenAI when I explicitly start Sol planning, Astra analysis or review. My files stay private in Supabase; they are not automatically published.</label>
   <button class="primary" type="submit" id="scan-upload">Upload privately (no AI charge)</button>
  </form></div>
 <div class="scan-library-panel panel"><div class="scan-heading"><h3>2 · Your scan library</h3><button type="button" id="scan-refresh" class="outline small-button">Refresh</button></div>
  <div id="scan-status" class="flash" role="status" aria-live="polite">Checking your private library…</div>
  <label class="scan-auto-updates"><input type="checkbox" id="scan-pause-updates" ${scanInboxAutoUpdatesPaused()?'checked':''}> Pause automatic background sync while reading</label>
  <p class="muted sm scan-auto-updates-hint">Manual Refresh and scan actions still work. This setting lasts for this browser tab.</p>
  <div id="scan-list" class="scan-list"></div>
 </div>
 <div id="scan-detail" class="scan-detail"></div>
 <p class="muted sm">The first Analyze click runs Sol planning followed by Astra analysis (two paid requests). Draft and Review each trigger one paid model request, subject to the same private quotas as your tutor. Shared limits: 10 calls/minute, 60/hour, 200/day, including 40 Astra calls/day. One started scan may use up to four completion calls beyond the limits per rolling 24 hours. Only your clicks start paid generation. Running requests can continue if you close this page. Responses are retained by OpenAI for recovery and saved privately here; incomplete output is not approved lesson content.</p>
 </section>`;
}
const bubble=(name,content)=>'<div class="ai-dialogue-bubble ai-dialogue-answer"><strong>'+esc(name)+'</strong><div class="ai-dialogue-copy">'+esc(content)+'</div></div>';
function explainAnalysis(data){
 if(!data?.facts)return "";
 return `<div class="scan-evidence"><h3>Astra: extracted source evidence</h3><p>${esc(data.overview)}</p>
 <h4>Source-grounded observations</h4>${(data.facts||[]).map(f=>`<div class="scan-evidence-row"><strong>${esc(f.id)} · ${esc(f.location)} ${f.confidence==="uncertain"?"· uncertain":""}</strong><p>${esc(f.claim)}</p></div>`).join('')}
 ${data.equations?.length?'<h4>Equations</h4>'+data.equations.map(e=>'<p>'+esc(e.equation)+' — '+esc(e.meaning)+' ('+esc(e.source_id)+')</p>').join(''):''}
 ${data.safety_notes?.length?'<h4>Source safety notes</h4>'+data.safety_notes.map(n=>'<p>'+esc(n.note)+' ('+esc(n.source_id)+')</p>').join(''):''}
 ${data.gaps?.length?'<h4>Unclear or missing information</h4>'+data.gaps.map(g=>'<p>'+esc(g)+'</p>').join(''):''}</div>`;
}
function scanCite(job,ids=[]){
 const book=job?.source_book||"Source publication not recorded";
 const pages=job?.source_pages||"Printed pages not recorded";
 const facts=job?.analysis?.facts||[];
 const refs=(ids||[]).map(id=>{
  const fact=facts.find(row=>row.id===id);
  return id+(fact?.location?" — "+fact.location:"");
 }).join("; ");
 return book+" · "+pages+(refs?" · Evidence: "+refs:"");
}
function lessonSections(sections,job,namespace){
 return (sections||[]).map((part,i)=>'<section class="scan-lesson-section"><h4>'+(i+1)+'. '+esc(part.heading)+'</h4><p>'+esc(part.body)+'</p><small>Source: '+esc(scanCite(job,part.source_ids))+'</small></section>').join('');
}
function lessonExercises(questions,job,namespace){
 return (questions||[]).map((q,i)=>'<details class="scan-quiz-item" data-scan-expand="'+esc(namespace)+'-quiz-'+i+'"><summary>Exercise '+(i+1)+': '+esc(q.prompt)+'</summary><div>'+bubble('Expected answer',q.answer)+bubble('Explanation',q.explanation)+'<small>Source: '+esc(scanCite(job,q.source_ids))+'</small></div></details>').join('');
}
function explainLesson(data,job){
 if(!data)return "";
 if(Array.isArray(data.lessons)){
  const rendered=data.lessons.map((unit,i)=>'<section class="scan-chapter-accepted"><p class="v2-kicker">Approved lesson '+(i+1)+'</p>'+
   '<p class="muted sm">'+esc(unit.plan?.kind||unit.kind||'concept')+' · '+esc(unit.plan?.ordering||unit.ordering||'independent')+'</p>'+
   explainLesson(unit,job)+'</section>').join('');
  const pending=data.current?'<section class="scan-chapter-current"><p class="v2-kicker">Current draft · '+esc(data.current.plan?.id||'')+'</p>'+
   explainLesson(data.current,job)+'</section>':'';
  return rendered+pending;
 }
 const unique=(data.sections||[]).length>0;
 const original='<section class="scan-lesson"><p class="v2-kicker">Source-specific material · '+esc(job.source_track||"other")+'</p>'+
  (unique?'<h3>'+esc(data.title)+'</h3><p>'+esc(data.description)+'</p><h4>Learning goals</h4><ul>'+(data.objectives||[]).map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>'+
   lessonSections(data.sections,job,'unique')+'<h4>Source-specific practice</h4>'+lessonExercises(data.questions,job,'unique'):
   '<h3>No separate source-specific lesson needed</h3><p>This material overlaps existing concepts. Look below for distinct reinforcement perspectives and exercises.</p>')+
  '<p class="muted sm">Reference: '+esc(scanCite(job))+'. Printed pages are supplied by you; compare them against the scan before approval.</p></section>';
 const reviews=(data.review_lessons||[]).map((part,i)=>'<section class="scan-lesson"><p class="v2-kicker">Review & Reinforcement · Lesson '+(i+1)+'</p>'+
  '<h3>'+esc(part.title)+'</h3><p><strong>New perspective:</strong> '+esc(part.new_perspective)+'</p>'+
  (part.related_lessons?.length?'<p class="muted sm">Related coverage: '+esc(part.related_lessons.join('; '))+'</p>':'')+
  lessonSections(part.sections,job,'review-'+i)+'<h4>Different-angle practice</h4>'+lessonExercises(part.questions,job,'review-'+i)+'</section>').join('');
 return original+reviews;
}
function explainOutline(job){
 const outline=job.analysis?.chapter_outline;
 if(!outline?.units?.length)return '';
 const approved=(job.lesson?.lessons||[]).length;
 const rows=outline.units.map((unit,i)=>{
  const completed=i<approved;
  return '<li class="scan-outline-item'+(completed?' complete':'')+'"><div><strong>'+
   esc(unit.id)+' · '+esc(unit.title)+'</strong><span class="muted sm">'+
   esc(unit.kind)+' · '+esc(unit.destination==='review'?'Review & Reinforcement':'Source-specific')+
   ' · '+esc(unit.ordering==='sequential'?'Suggested sequential study':'Self-paced / independent')+
   (unit.prerequisites?.length?' · Builds on '+esc(unit.prerequisites.join(', ')):'')+
   '</span></div><p>'+esc(unit.focus)+'</p><small>Source: '+esc(scanCite(job,unit.source_ids))+'</small>'+
   (completed?'<span class="scan-outline-done">Approved</span>':'')+'</li>';
 }).join('');
 return '<section class="scan-chapter-outline panel"><p class="v2-kicker">SOL · FLEXIBLE CHAPTER PLAN</p>'+
  '<h3>'+esc(outline.chapter_title)+'</h3><p>'+esc(outline.rationale)+'</p>'+
  '<p class="muted sm">'+approved+' of '+outline.units.length+' chapter lessons approved. Sol chooses the count by educational need, not a fixed target of 12.</p>'+
  '<ol>'+rows+'</ol><p class="muted sm">Mathematics is self-paced. Sequential ordering applies only to concept-dependent lessons, and every new paid draft is started separately.</p></section>';
}
function explainReview(data){
 if(!data)return "";
 return `<section class="scan-review"><h3>Astra technical review</h3><p><strong>${data.ready?"Ready for your review":"Not yet acceptable"}</strong> — ${esc(data.summary)}</p>
 ${(data.findings||[]).map(x=>'<div class="scan-finding"><strong>'+esc(x.severity)+'</strong> '+esc(x.description)+' <small>'+esc(x.source_id)+'</small></div>').join('')}
 </section>`;
}
export function buttonFor(job){
 const attempt=job.attempts?.find(a=>a.base_revision===job.revision);
 if(attempt&&["starting","running","received"].includes(attempt.status))return '<button class="primary" data-scan-action="check" data-scan-attempt="'+esc(attempt.id)+'">Resume / check saved request (no new AI call)</button>';
 if(attempt?.status==="invalid"&&attempt.output_text)
  return '<button class="primary" data-scan-action="recover" data-scan-attempt="'+esc(attempt.id)+'">Revalidate saved '+esc(attempt.phase)+' response (free · no AI call)</button>';
 if(attempt&&["failed","incomplete","invalid","unknown"].includes(attempt.status))
  return '<button class="primary" data-scan-action="resume" data-scan-retry="true">Retry unfinished stage (new paid request)</button>';
 if(job.state==="uploaded"&&job.analysis?.planning_brief)return '<button class="primary" data-scan-action="analyze">Resume Astra analysis — Sol brief saved</button>';
 if(job.state==="uploaded")return '<button class="primary" data-scan-action="analyze">Run Sol planning → Astra analysis</button>';
 if(job.state==="analyzed")return '<button class="primary" data-scan-action="outline">Ask Sol to outline the full chapter (paid call)</button>';
 if(job.state==="outlined"){
  const total=job.analysis?.chapter_outline?.units?.length||0,done=job.lesson?.lessons?.length||0;
  return '<button class="primary" data-scan-action="draft">Draft lesson '+(done+1)+' of '+total+' with Sol (paid call)</button>';
 }
 if(job.state==="drafted")return '<button class="primary" data-scan-action="review">Have Astra review the lesson</button>';
 if(job.state==="needs_revision")return '<button class="primary" data-scan-action="draft">Revise lesson with Sol</button>';
 if(job.state==="reviewed"){
  const total=job.analysis?.chapter_outline?.units?.length;
  const index=(job.lesson?.lessons?.length||0)+1;
  return '<button class="primary" data-scan-action="approve">Approve '+(total?'lesson '+index+' of '+total:'draft')+' (free)</button>';
 }
 return '<div class="success">Approved · available in your private lesson library below.</div>';
}
function attemptLog(job){
 if(!job.attempts?.length)return '';
 return '<section class="panel"><h3>Saved attempts & errors</h3><p class="muted sm">Raw output is preserved even when incomplete or invalid. It must pass checks before becoming lesson content.</p>'+job.attempts.map(a=>
 '<details data-scan-expand="attempt-'+esc(a.id)+'" '+(a.error_message?'open':'')+'><summary>'+esc(a.phase)+' · '+esc(a.status)+' · '+new Date(a.created_at).toLocaleString()+'</summary>'+
 (a.error_message?'<p role="alert">'+esc(a.error_message)+'</p>':'')+
 (a.response_id?'<p class="muted sm">Saved response: '+esc(a.response_id)+'</p>':'')+
 (a.usage?'<p class="muted sm">Tokens reported: '+esc(a.usage.input_tokens||0)+' input / '+esc(a.usage.output_tokens||0)+' output.</p>':'')+
 (a.output_text?'<details data-scan-expand="output-'+esc(a.id)+'"><summary>View unverified saved output</summary><pre style="white-space:pre-wrap;overflow-wrap:anywhere">'+esc(a.output_text)+'</pre></details>':'')+
 '<button class="outline small-button" data-download-attempt="'+esc(a.id)+'">Download saved response & error</button></details>').join('')+'</section>';
}

const SCAN_STAGE_DEFINITIONS=[
 {label:'Astra interpretation',hint:'Sol plans · Astra extracts evidence'},
 {label:'Sol chapter plan & lessons',hint:'Flexible outline and one sourced lesson at a time'},
 {label:'Astra review',hint:'Verify accuracy and safety'},
 {label:'Your approval',hint:'Add the reviewed lesson to your library'}
];
const SCAN_ATTEMPT_PENDING=new Set(['starting','running','received']);
const SCAN_ATTEMPT_INTERRUPTED=new Set(['failed','incomplete','invalid','unknown']);
function currentScanPhase(job){
 return ({uploaded:job.analysis?.planning_brief?'analyze':'plan',
  analyzed:'outline',outlined:'draft',drafted:'review',needs_revision:'draft',reviewed:'approve'})[job.state]||null;
}
function scanStageStates(job,livePhase=null){
 const finishedThrough=({uploaded:-1,analyzed:0,outlined:0,drafted:1,needs_revision:0,reviewed:2,approved:3})[job.state]??-1;
 const activeIndex=({uploaded:0,analyzed:1,outlined:1,drafted:2,needs_revision:1,reviewed:3})[job.state]??-1;
 const phase=currentScanPhase(job);
 const currentAttempt=job.attempts?.find(a=>a.base_revision===job.revision&&a.phase===phase);
 return SCAN_STAGE_DEFINITIONS.map((definition,index)=>{
  let state=index<=finishedThrough?'complete':'pending';
  if(job.state==='needs_revision'&&index===2)state='revision';
  if(index===activeIndex){
   state='ready';
   if(currentAttempt&&SCAN_ATTEMPT_PENDING.has(currentAttempt.status))state='running';
   if(currentAttempt&&SCAN_ATTEMPT_INTERRUPTED.has(currentAttempt.status))state='failed';
   if(livePhase===phase)state='running';
  }
  const statuses={
   complete:'Complete',pending:'Upcoming',ready:'Ready',running:'Processing',
   failed:'Interrupted',revision:'Changes requested'
  };
  let hint=definition.hint;
  if(state==='complete')hint='Stage finished';
  if(state==='failed')hint='Review the saved error or retry';
  if(state==='revision')hint='Review requested corrections';
  if(state==='ready'&&phase==='analyze'&&index===0)hint='Sol brief saved · Astra is next';
  if(state==='running'&&phase==='plan'&&index===0)hint='Sol is preparing the teaching brief';
  if(state==='running'&&phase==='analyze'&&index===0)hint='Astra is interpreting the source';
  if(state==='running'&&phase==='outline')hint='Sol is outlining chapter learning units';
   if(state==='running'&&phase==='draft')hint='Sol is drafting one chapter lesson';
  if(state==='running'&&phase==='review')hint='Astra is checking the draft';
  if(state==='running'&&phase==='approve')hint='Saving your approval';
  return {...definition,index,state,status:statuses[state],hint};
 });
}
function scanTrackerMarkup(job,livePhase=null){
 const stages=scanStageStates(job,livePhase);
 return '<div class="scan-stage-tracker" role="list" aria-label="Scan pipeline progress">'+stages.map(stage=>{
  const focused=['ready','running','failed'].includes(stage.state);
  return '<div class="scan-stage-card '+stage.state+'" role="listitem"'+(focused?' aria-current="step"':'')+'>'+
   '<div class="scan-stage-top"><span class="scan-stage-number" aria-hidden="true">'+(stage.state==='complete'?'✓':stage.index+1)+'</span>'+
   '<span class="scan-stage-label">'+esc(stage.label)+'</span></div>'+
   '<span class="scan-stage-status">'+esc(stage.status)+'</span>'+
   '<span class="scan-stage-hint">'+esc(stage.hint)+'</span></div>';
 }).join('')+'</div>';
}
function scanPhaseMessage(job,livePhase=null){
 const stages=scanStageStates(job,livePhase);
 if(job.state==='approved')return 'Pipeline complete · All four stages finished.';
 const active=stages.find(stage=>['ready','running','failed'].includes(stage.state));
 if(!active)return 'Scan pipeline status is available below.';
 if(active.state==='running')return 'Stage '+(active.index+1)+' of 4 · '+active.label+' is processing.';
 if(active.state==='failed')return 'Stage '+(active.index+1)+' of 4 · '+active.label+' was interrupted. Check Saved attempts & errors to resume or retry.';
 if(job.state==='needs_revision')return 'Revision requested · Sol needs to revise the lesson before another Astra review.';
 return 'Stage '+(active.index+1)+' of 4 · '+active.label+' is ready. No AI request is running.';
}
function detail(job){
 const provenance=job.lesson?.source?'<p class="muted sm">Stable lesson ID: '+esc(job.draft_id)+' · source '+esc(job.title)+'</p>':'';
 return '<section class="scan-source-card panel"><h2>'+esc(job.title)+'</h2><p class="muted sm">'+humanState(job.state)+' · '+new Date(job.created_at).toLocaleDateString()+' · '+Math.ceil(job.source_bytes/1024)+' KB</p>'+
 '<div class="scan-citation-panel"><strong>Publication and page citation</strong><p>'+esc(scanCite(job))+'</p>'+
 (job.state!=="approved"?'<div class="scan-citation-editor"><label>Book or publication<input id="scan-edit-book" maxlength="180" value="'+esc(job.source_book||'')+'" placeholder="Full book title and edition"></label>'+
 '<label>Printed pages<input id="scan-edit-pages" maxlength="80" value="'+esc(job.source_pages||'')+'" placeholder="e.g. pp. 20–23"></label>'+
 '<label>Track<select id="scan-edit-track">'+['other','geier','teach','principles','cabling','guide','basic'].map(track=>'<option value="'+track+'"'+((job.source_track||'other')===track?' selected':'')+'>'+esc({other:'Other book/source',geier:'Geier',teach:'Teach Yourself',principles:'Principles & Applications',cabling:'Cabling',guide:'CETa Study Guide',basic:'Lab Manual'}[track])+'</option>').join('')+'</select></label>'+
 '<button class="outline small-button" id="scan-save-citation">Save citation metadata (free)</button></div>':'')+
 '<p class="muted sm">Book and page labels are user-entered. Source fact locations below must be checked against the original pages.</p></div>'+
 '<button class="outline small-button" id="scan-download-source">Download original private source</button> <button class="outline small-button" id="scan-delete-source">Delete scan & generated content</button>'+
 '<p class="scan-phase-banner" role="status">'+esc(scanPhaseMessage(job))+'</p>'+scanTrackerMarkup(job)+
 (job.analysis?.planning_brief?'<details data-scan-expand="sol-brief"><summary>Sol’s saved teaching brief</summary>'+bubble('Your instructions',job.analysis.planning_brief.learner_context||'Default teaching guidance')+bubble('Astra extraction',job.analysis.planning_brief.astra_guidance)+bubble('Lesson drafting',job.analysis.planning_brief.lesson_guidance)+bubble('Technical review',job.analysis.planning_brief.review_guidance)+'</details>':'')+
 (job.state==='uploaded'&&!job.analysis?.planning_brief?'<label>Additional instructions for Sol (optional)<textarea id="scan-learner-context" maxlength="2000" rows="4" placeholder="Leave blank for Sol to plan from the scanned pages."></textarea></label>':'')+
 explainAnalysis(job.analysis)+explainOutline(job)+explainLesson(job.lesson,job)+explainReview(job.review)+provenance+
 attemptLog(job)+'<div class="scan-approve-actions"><button type="button" class="outline" id="scan-free-preflight">Check pipeline readiness (free)</button>'+buttonFor(job)+'</div>'+
 '<div id="scan-free-preflight-result" class="scan-preflight-result" role="status" aria-live="polite" hidden></div>'+
 '<p class="muted sm">Model outputs are drafts, not definitive references. Compare important formulas and safety guidance against the actual scanned pages before approving. Approved lessons are read-only study companions; they do not award scores.</p></section>';
}
export function attachScanInbox(supabase,user,notify=()=>{}){
 const root=by('#scan-root');
 if(!root||!supabase||!user)return;
 const id=user.id;
 let jobs=[],preparedFile=null,preparing=null,pendingUpload=null;
  let books=[],bookCatalogReady=false,bookCatalogBusy=false;
 let renderedJobId=null,renderedSignature=null;
 const openedPanelsByJob=new Map();
 const pauseToggle=root.querySelector("#scan-pause-updates");
 pauseToggle?.addEventListener("change",()=>{
  setScanInboxAutoUpdatesPaused(pauseToggle.checked);
  status(pauseToggle.checked?"Automatic background progress sync paused for this tab. Manual Refresh remains available.":"Automatic background progress sync resumed.");
 });
 const fileInput=root.querySelector("#scan-file");
 fileInput.addEventListener("change",()=>{
  preparedFile=fileInput.files[0]||null;pendingUpload=null;
  preparing=preparedFile?prepareScanFile(preparedFile):null;
  // Attach the error handler immediately; the original promise is awaited on submit.
  preparing?.catch(error=>status(error.message));
 });
 const status=(text)=>{if(root.isConnected)root.querySelector('#scan-status').textContent=text;};
  const bookSelect=root.querySelector('#scan-book');
  const bookPanel=root.querySelector('#scan-new-book-panel');
  const bookHint=root.querySelector('#scan-books-hint');
  const uploadButton=root.querySelector('#scan-upload');
  const setBookPanelVisible=visible=>{
   bookPanel.hidden=!visible;
   if(visible)root.querySelector('#scan-new-book-track').value=root.querySelector('#scan-track').value;
  };
  const chooseBook=id=>{
   bookSelect.value=id||'';
   const book=books.find(item=>item.id===bookSelect.value);
   if(book)root.querySelector('#scan-track').value=book.source_track||'other';
   setBookPanelVisible(bookSelect.value==='__new__');
  };
  const renderBookChoices=preferredId=>{
   const keep=preferredId||bookSelect.value;
   bookSelect.innerHTML='<option value="">Choose a saved book…</option>'+
    books.map(item=>'<option value="'+esc(item.id)+'">'+esc(catalogBookTitle(item))+
     (item.author?' · '+esc(item.author):'')+'</option>').join('')+
    '<option value="__new__">＋ Add / import a new book…</option>';
   chooseBook(books.some(book=>book.id===keep)?keep:(keep==='__new__'?keep:''));
   bookHint.textContent=books.length+' saved book'+(books.length===1?'':'s')+
    ' · Synced with your study account on phone and desktop.';
  };
  const loadBooks=async preferredId=>{
   if(!root.isConnected)return;
   bookCatalogReady=false;
   uploadButton.disabled=true;
   const {data,error}=await supabase.from('study_books')
    .select('id,title,author,edition,source_track').eq('user_id',id)
    .order('title',{ascending:true}).limit(200);
   if(error){
    bookHint.textContent='Could not load your book library. Use Refresh books to retry.';
    throw Error('Private book library unavailable: '+error.message);
   }
   if(!root.isConnected)return;
   books=data||[];
   bookCatalogReady=true;
   uploadButton.disabled=operation||bookCatalogBusy;
   renderBookChoices(preferredId);
  };
  const rememberBook=async(title,track)=>{
   const clean=String(title||'').trim();
   if(!clean||books.some(item=>catalogBookTitle(item).toLowerCase()===clean.toLowerCase()))return;
   const {error}=await supabase.from('study_books').insert({
    user_id:id,title:clean,source_track:catalogTracks.has(track)?track:'other'
   });
   if(error&&error.code!=='23505')throw Error(error.message);
   await loadBooks();
  };
  bookSelect.addEventListener('change',()=>{
   const chosen=books.find(book=>book.id===bookSelect.value);
   if(chosen)root.querySelector('#scan-track').value=chosen.source_track;
   setBookPanelVisible(bookSelect.value==='__new__');
   if(bookSelect.value==='__new__')root.querySelector('#scan-new-book-title').focus();
  });
  root.querySelector('#scan-book-refresh').addEventListener('click',async event=>{
   const button=event.currentTarget;
   if(bookCatalogBusy)return;
   bookCatalogBusy=true;button.disabled=true;
   try{await loadBooks();status('Your saved book list has been refreshed. No AI charges.')}
   catch(error){status(error.message)}
   finally{bookCatalogBusy=false;button.disabled=false;uploadButton.disabled=!bookCatalogReady||operation}
  });
  root.querySelector('#scan-cancel-new-book').addEventListener('click',()=>chooseBook(''));
  bookPanel.addEventListener('keydown',event=>{
   if(event.key==='Enter'&&event.target.matches('input')){
    event.preventDefault();
    root.querySelector('#scan-add-book').click();
   }
  });
  root.querySelector('#scan-add-book').addEventListener('click',async event=>{
   if(bookCatalogBusy||operation)return;
   const title=root.querySelector('#scan-new-book-title').value.trim();
   const author=root.querySelector('#scan-new-book-author').value.trim();
   const edition=root.querySelector('#scan-new-book-edition').value.trim();
   const source_track=root.querySelector('#scan-new-book-track').value;
   const citation=catalogBookTitle({title,edition});
   if(!title||citation.length>180||!catalogTracks.has(source_track)){
    status('Enter a book title. The combined title and edition must be 180 characters or fewer.');return;
   }
   const button=event.currentTarget;
   bookCatalogBusy=true;button.disabled=true;
   try{
    const {data,error}=await supabase.from('study_books').insert({
     user_id:id,title,author:author||null,edition:edition||null,source_track
    }).select('id').single();
    if(error)throw Error(error.code==='23505'?'This book and edition are already in your library. Select it above.':error.message);
    await loadBooks(data.id);
    root.querySelector('#scan-new-book-title').value='';
    root.querySelector('#scan-new-book-author').value='';
    root.querySelector('#scan-new-book-edition').value='';
    status('Book saved to your private study library. No AI charge.');
   }catch(error){status('Could not save book: '+error.message)}
   finally{bookCatalogBusy=false;if(button.isConnected)button.disabled=false;uploadButton.disabled=!bookCatalogReady||operation}
  });
 const invoke=async body=>{
  const {data,error}=await supabase.functions.invoke('scan-lesson-pipeline',{body});
  if(error){
   const parsed=await error.context?.json?.().catch?.(()=>null);
   throw Error(parsed?.error||error.message||'Private pipeline request failed');
  }
  return data;
 };
 const runStage=async body=>{
  let result=await invoke(body);
  for(let n=0;result?.pending&&n<40&&root.isConnected;n++){
   status('Request saved and running. You can leave this page and use Resume later without starting over.');
   await new Promise(resolve=>setTimeout(resolve,3000));
   if(!root.isConnected)break;
   result=await invoke({action:'check',jobId:body.jobId,attemptId:result.attemptId});
  }
  if(result?.pending)throw Error('Still running in the background. Select Resume / check saved request to collect the result; this does not start another AI call.');
  return result;
 };
 const rememberExpandedPanels=()=>{
  if(!renderedJobId)return;
  const previous=root.querySelector('#scan-detail');
  const openStates=new Map();
  previous?.querySelectorAll('details[data-scan-expand]').forEach(panel=>openStates.set(panel.dataset.scanExpand,panel.open));
  openedPanelsByJob.set(renderedJobId,openStates);
 };
 const draw=()=>{
  if(!root.isConnected)return;
  const previousId=renderedJobId,previousScrollY=window.scrollY;
  rememberExpandedPanels();
  const list=root.querySelector('#scan-list');
  list.innerHTML=jobs.length?jobs.map(j=>'<button type="button" class="scan-list-row'+(selectedId===j.id?' selected':'')+'" data-select-scan="'+esc(j.id)+'"><strong>'+esc(j.title)+'</strong><span>'+esc(humanState(j.state))+'</span></button>').join(''):'<p class="muted">No scans uploaded yet. Your first private source will appear here.</p>';
  list.querySelectorAll('[data-select-scan]').forEach(b=>b.addEventListener('click',()=>{selectedId=b.dataset.selectScan;draw()}));
  const job=jobs.find(j=>j.id===selectedId);
  const signature=job?JSON.stringify(job):'no-selection';
  // Unchanged results retain their original DOM, expanded panels and scroll position.
  if(renderedJobId===(job?.id||null)&&renderedSignature===signature)return;
  const div=root.querySelector('#scan-detail');
  div.innerHTML=job?detail(job):'<section class="panel"><h3>3 · Select a scan</h3><p>Choose an uploaded source to review its evidence and build a draft.</p></section>';
  renderedJobId=job?.id||null;
  renderedSignature=signature;
  if(!job)return;
  const openStates=openedPanelsByJob.get(job.id);
  if(openStates)div.querySelectorAll('details[data-scan-expand]').forEach(panel=>{
   if(openStates.has(panel.dataset.scanExpand))panel.open=openStates.get(panel.dataset.scanExpand);
  });
  // New data for the same scan must not jump back to the beginning.
  if(previousId===job.id)window.scrollTo(0,previousScrollY);
  div.querySelectorAll('[data-download-attempt]').forEach(button=>button.addEventListener('click',async()=>{
   try{
    const {data,error}=await supabase.from('scan_model_attempts').select('*').eq('id',button.dataset.downloadAttempt).eq('job_id',job.id).single();
    if(error)throw error;
    const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
    const a=document.createElement('a');a.href=url;a.download='scan-attempt-'+data.id+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
   }catch(error){status('Could not download saved attempt: '+error.message)}
  }));
  div.querySelector('#scan-save-citation')?.addEventListener('click',async event=>{
   if(operation)return;
   const button=event.currentTarget;
   operation=true;button.disabled=true;
   try{
    const editedBook=div.querySelector('#scan-edit-book').value.trim();
    const editedTrack=div.querySelector('#scan-edit-track').value;
    await invoke({action:'update-source',jobId:job.id,
     book:editedBook,pages:div.querySelector('#scan-edit-pages').value.trim(),
     track:editedTrack});
    let catalogWarning='';
    try{await rememberBook(editedBook,editedTrack)}
    catch(error){catalogWarning=' Book saved to scan but not to the dropdown: '+error.message}
    await refresh(false);
    status('Book and page citation saved. No AI charges.'+catalogWarning);
   }catch(error){status('Source citation could not be saved: '+error.message)}
   finally{operation=false;if(button.isConnected)button.disabled=false;uploadButton.disabled=!bookCatalogReady||bookCatalogBusy}
  });
  div.querySelector('#scan-delete-source')?.addEventListener('click',async e=>{
   if(operation)return;
   if(!window.confirm('Permanently delete “'+job.title+'”, its original scan, analysis, and any generated lesson? This cannot be undone.'))return;
   operation=true;const button=e.currentTarget;button.disabled=true;
   status('Deleting scan and generated content…');
   try{
    await invoke({action:'delete',jobId:job.id});
    if(selectedId===job.id)selectedId=null;
    await refresh(false);status('Scan and its generated content deleted. No AI charge.');
   }catch(error){status('Delete failed: '+error.message+' You can retry.');notify(error.message)}
   finally{operation=false;if(button.isConnected)button.disabled=false}
  });
  div.querySelector('#scan-download-source')?.addEventListener('click',async()=>{
   try{
    const {data,error}=await supabase.storage.from(bucket).download(job.source_path);
    if(error)throw error;
    const url=URL.createObjectURL(data),a=document.createElement('a');a.href=url;a.download=job.title.replace(/[^a-z0-9 -]/gi,'').slice(0,60)+'.'+job.source_path.split('.').pop();a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
   }catch(e){status('Download unavailable: '+e.message);}
  });
  const updateLiveStage=(phase=null)=>{
   if(renderedJobId!==job.id)return;
   const tracker=div.querySelector('.scan-stage-tracker');
   if(tracker)tracker.outerHTML=scanTrackerMarkup(job,phase);
   const banner=div.querySelector('.scan-phase-banner');
   if(banner)banner.textContent=scanPhaseMessage(job,phase);
  };
  div.querySelector('#scan-free-preflight')?.addEventListener('click',async e=>{
   const button=e.currentTarget,output=div.querySelector('#scan-free-preflight-result');
   if(operation)return;
   button.disabled=true;output.hidden=false;
   output.textContent='Checking local pipeline prerequisites. No AI request will be started…';
   try{
    const check=await invoke({action:'preflight',jobId:job.id});
    if(!output.isConnected)return;
    const messages=[...(check.errors||[]),...(check.notes||[])];
    output.classList.toggle('needs-attention',!check.ready);
    output.innerHTML='<strong>'+(check.ready?'Preflight passed · no charge':'Fix these prerequisites before running AI')+'</strong>'+
     '<p>Next stage: '+esc(check.stage||'unknown')+' · Paid model calls started by this check: 0</p>'+
     '<ul>'+messages.map(message=>'<li>'+esc(message)+'</li>').join('')+'</ul>';
    status(check.ready?'Preflight complete. No AI credits used.':'Preflight found issues. No AI credits used.');
   }catch(error){
    if(output.isConnected)output.textContent='Readiness check could not complete: '+error.message+' No AI request was started.';
    status('Free readiness check failed: '+error.message);
   }finally{if(button.isConnected)button.disabled=false;}
  });
  div.querySelector('[data-scan-action]')?.addEventListener('click',async e=>{
   if(operation)return;
   const action=e.currentTarget.dataset.scanAction;
   const retry=e.currentTarget.dataset.scanRetry==='true';
   if(retry){
    const failedAttempt=job.attempts?.find(a=>a.base_revision===job.revision&&
     ['failed','incomplete','invalid','unknown'].includes(a.status));
    const uncertainCharge=failedAttempt&&!failedAttempt.response_id;
    const warning=uncertainCharge
     ?'The last request has no saved provider response ID. It may already have incurred a charge, and its output cannot be recovered. A retry starts an ADDITIONAL paid request. The saved Sol brief and earlier stages remain intact. Continue anyway?'
     :'This starts one NEW paid request for the unfinished stage. Any saved output is reference material, not a guaranteed free continuation. Earlier charges still apply. Continue?';
    if(!window.confirm(warning))return;
   }
   if(action==='approve'&&!window.confirm('Approve this reviewed draft into your private study library? It will not affect graded lessons.'))return;
   operation=true;
   updateLiveStage(action==='resume'?currentScanPhase(job):action);
   const button=e.currentTarget;button.disabled=true;
   status(action==='recover'?'Revalidating saved model output locally (free, no AI call)…':action==='approve'?'Saving your lesson approval (free)…':action==='analyze'?'Running Sol planning → Astra analysis (up to two paid requests)…':action==='outline'?'Sol is planning an adaptable chapter curriculum — one paid request…':'Running '+action+' — one paid AI request, please wait…');
   try{
    let planningUsage=null,expectedRevision=job.revision;
    if(action==='analyze'&&!job.analysis?.planning_brief){
     const planned=await runStage({action:'plan',jobId:job.id,expectedRevision,learnerContext:div.querySelector('#scan-learner-context')?.value||''});
     planningUsage=planned.usage;expectedRevision=job.revision+1;
     status('Sol brief saved. Running Astra source analysis…');
     updateLiveStage('analyze');
    }
    const result=await runStage({action,jobId:job.id,retry,expectedRevision,
      ...(retry?{retryOf:job.attempts?.find(a=>a.base_revision===job.revision)?.id}:{}),
      ...(["recover","check"].includes(action)?{attemptId:button.dataset.scanAttempt}:{})});
    if(planningUsage&&result.usage)result.usage.estimatedUSD+=planningUsage.estimatedUSD;
    if(result.usage){lastUsage=result.usage;}
    await refresh(false);
    status('Completed '+action+'. '+(result.usage?'Estimated cost: $'+Number(result.usage.estimatedUSD).toFixed(5)+'. ':'')+'Review the results before moving on.');
   }catch(error){await refresh(false);status('Could not '+action+': '+error.message+' Any saved Sol brief will be reused on retry.');notify(error.message)}
   finally{
    operation=false;
    if(button.isConnected)button.disabled=false;
    const latest=jobs.find(item=>item.id===selectedId);
    if(latest&&renderedJobId===job.id){
     const tracker=div.querySelector('.scan-stage-tracker');
     if(tracker)tracker.outerHTML=scanTrackerMarkup(latest);
     const banner=div.querySelector('.scan-phase-banner');
     if(banner)banner.textContent=scanPhaseMessage(latest);
    }
   }
  });
 };
 const refresh=async announce=>{
  try{
   const {data,error}=await supabase.from('scan_lesson_jobs').select('id,title,source_book,source_pages,source_track,source_kind,source_path,source_bytes,state,analysis,lesson,review,draft_id,created_at,updated_at,revision')
    .order('created_at',{ascending:false}).limit(200);
   if(error)throw error;
   if(!root.isConnected)return;
   const attemptsResult=await supabase.from('scan_model_attempts').select('id,job_id,base_revision,phase,status,response_id,error_message,output_text,usage,created_at').order('created_at',{ascending:false}).limit(200);
   if(attemptsResult.error)throw attemptsResult.error;
   jobs=(data||[]).map(job=>({...job,attempts:(attemptsResult.data||[]).filter(a=>a.job_id===job.id)}));if(!jobs.some(j=>j.id===selectedId))selectedId=jobs[0]?.id||null;
   draw();if(announce)status(jobs.length+' private source(s) loaded. No paid model requests were made.');
  }catch(e){status('Private Scan Inbox unavailable: '+e.message);}
 };
 root.querySelector('#scan-refresh').addEventListener('click',()=>void refresh(true));
 root.querySelector('#scan-upload-form').addEventListener('submit',async e=>{
  e.preventDefault();if(operation)return;
  const name=root.querySelector('#scan-title').value.trim();
  const selectedBook=books.find(item=>item.id===bookSelect.value);
  const book=selectedBook?catalogBookTitle(selectedBook):'';
  const pages=root.querySelector('#scan-pages').value.trim();
  const track=root.querySelector('#scan-track').value;
  const file=root.querySelector('#scan-file').files[0];
  const approved=root.querySelector('#scan-share-consent').checked;
  if(!bookCatalogReady){status('Load your saved books before uploading.');return}
  if(!selectedBook){status('Select a saved book, or choose Add / import a new book to save one first.');return}
  if(book.length>180){status('Book title plus edition is too long for a citation.');return}
  if(!approved||!name||!pages||!file)return;
  operation=true;const button=root.querySelector('#scan-upload');button.disabled=true;
  let phase='reading the selected file';
  status('Reading scan from your device…');
  try{
   if(preparedFile!==file||!preparing){preparedFile=file;preparing=prepareScanFile(file);}
   const prepared=await preparing;
   if(!pendingUpload)pendingUpload={path:id+'/'+crypto.randomUUID()+'.'+prepared.extension,uploaded:false};
   const pending=pendingUpload;
   if(!pending.uploaded){
    phase='sending the scan';status('Uploading scan bytes privately…');
    // An earlier network failure may have occurred after Storage accepted the upload.
    if(pending.attempted){
     const existing=await supabase.storage.from(bucket).download(pending.path);
     if(!existing.error&&existing.data?.size===prepared.bytes.byteLength)pending.uploaded=true;
    }
    if(!pending.uploaded){
     pending.attempted=true;
     const upload=await supabase.storage.from(bucket).upload(pending.path,prepared.bytes,{upsert:false,contentType:prepared.type,cacheControl:'0'});
     if(upload.error)throw upload.error;
     pending.uploaded=true;
    }
   }
   phase='adding the scan to your library';status('Upload received. Adding to your private library…');
   const registered=await invoke({action:'register',path:pending.path,title:name,book,pages,track});
   selectedId=registered.jobId;root.querySelector('#scan-upload-form').reset();
   chooseBook('');preparedFile=null;preparing=null;pendingUpload=null;
   await refresh(false);status('Source uploaded. No AI charges yet. Select Run Sol planning → Astra analysis when ready.');
   button.textContent='Upload privately (no AI charge)';
  }catch(error){
   status('Upload failed while '+phase+': '+error.message+'. Tap Retry upload to try again.');
   button.textContent='Retry upload (no AI charge)';notify(error.message);
  }
  finally{operation=false;button.disabled=!bookCatalogReady}
 });
 void (async()=>{
  try{
   await invoke({action:'status'});
   await refresh(true);
   try{await loadBooks()}catch(error){status(error.message)}
  }catch(e){status('Private scan authorization unavailable: '+e.message);uploadButton.disabled=true}
 })();
}


