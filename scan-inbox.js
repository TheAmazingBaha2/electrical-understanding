// Private scan review workspace. Source files live in protected Supabase Storage, not public assets.
// Never inserts generated drafts into legacy lessons or graded progress automatically.
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const bucket="eu-private-scans";
const supported=new Map([["application/pdf","pdf"],["image/jpeg","jpg"],["image/png","png"],["image/webp","webp"]]);
let selectedId=null, operation=false, lastUsage=null;
const by=s=>document.querySelector(s);
function humanState(state){
 return ({uploaded:"Awaiting Astra interpretation",analyzed:"Ready for Sol lesson draft",
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
   <label>Private scanned pages<input id="scan-file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp" required></label>
   <label class="scan-consent"><input id="scan-share-consent" type="checkbox" required> I authorize sending this particular scan to OpenAI when I explicitly start Sol planning, Astra analysis or review. My files stay private in Supabase; they are not automatically published.</label>
   <button class="primary" type="submit" id="scan-upload">Upload privately (no AI charge)</button>
  </form></div>
 <div class="scan-library-panel panel"><div class="scan-heading"><h3>2 · Your scan library</h3><button type="button" id="scan-refresh" class="outline small-button">Refresh</button></div>
  <div id="scan-status" class="flash" role="status" aria-live="polite">Checking your private library…</div>
  <div id="scan-list" class="scan-list"></div>
 </div>
 <div id="scan-detail" class="scan-detail"></div>
 <p class="muted sm">The first Analyze click runs Sol planning followed by Astra analysis (two paid requests). Draft and Review each trigger one paid model request, subject to the same private quotas as your tutor. Astra is limited to two calls per rolling 24 hours. No automatic background generation or graded-progress changes.</p>
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
function explainLesson(data){
 if(!data)return "";
 return `<div class="scan-lesson"><h3>${esc(data.title)}</h3><p>${esc(data.description)}</p>
 <h4>Learning goals</h4><ul>${(data.objectives||[]).map(x=>'<li>'+esc(x)+'</li>').join('')}</ul>
 ${(data.sections||[]).map((part,i)=>'<section class="scan-lesson-section"><h4>'+(i+1)+'. '+esc(part.heading)+'</h4><p>'+esc(part.body)+'</p><small>Evidence: '+esc((part.source_ids||[]).join(', '))+'</small></section>').join('')}
 <h4>Practice & worked explanations</h4>${(data.questions||[]).map((q,i)=>`<details class="scan-quiz-item"><summary>Question ${i+1}: ${esc(q.prompt)}</summary><div>${bubble('Expected answer',q.answer)}${bubble('Explanation',q.explanation)}<small>Evidence: ${esc((q.source_ids||[]).join(', '))}</small></div></details>`).join('')}
 </div>`;
}
function explainReview(data){
 if(!data)return "";
 return `<section class="scan-review"><h3>Astra technical review</h3><p><strong>${data.ready?"Ready for your review":"Not yet acceptable"}</strong> — ${esc(data.summary)}</p>
 ${(data.findings||[]).map(x=>'<div class="scan-finding"><strong>'+esc(x.severity)+'</strong> '+esc(x.description)+' <small>'+esc(x.source_id)+'</small></div>').join('')}
 </section>`;
}
function buttonFor(job){
 if(job.state==="uploaded")return '<button class="primary" data-scan-action="analyze">Run Sol planning → Astra analysis</button>';
 if(job.state==="analyzed")return '<button class="primary" data-scan-action="draft">Have Sol draft the lesson</button>';
 if(job.state==="drafted")return '<button class="primary" data-scan-action="review">Have Astra review the lesson</button>';
 if(job.state==="needs_revision")return '<button class="primary" data-scan-action="draft">Revise lesson with Sol</button>';
 if(job.state==="reviewed")return '<button class="primary" data-scan-action="approve">Approve for my private lesson library (no AI charge)</button>';
 return '<div class="success">Approved · available in your private lesson library below.</div>';
}
function detail(job){
 const provenance=job.lesson?.source?'<p class="muted sm">Stable lesson ID: '+esc(job.draft_id)+' · source '+esc(job.title)+'</p>':'';
 return '<section class="scan-source-card panel"><h2>'+esc(job.title)+'</h2><p class="muted sm">'+humanState(job.state)+' · '+new Date(job.created_at).toLocaleDateString()+' · '+Math.ceil(job.source_bytes/1024)+' KB</p>'+
 '<button class="outline small-button" id="scan-download-source">Download original private source</button> <button class="outline small-button" id="scan-delete-source">Delete scan & generated content</button>'+
 '<div class="scan-stages">'+['Astra interpretation','Sol lesson draft','Astra review','Your approval'].map((x,i)=>'<span class="'+(i<=({uploaded:-1,analyzed:0,drafted:1,needs_revision:2,reviewed:2,approved:3}[job.state]??-1)?'complete':'')+'">'+(i+1)+'. '+x+'</span>').join('')+'</div>'+
 (job.analysis?.planning_brief?'<details><summary>Sol’s saved teaching brief</summary>'+bubble('Your instructions',job.analysis.planning_brief.learner_context||'Default teaching guidance')+bubble('Astra extraction',job.analysis.planning_brief.astra_guidance)+bubble('Lesson drafting',job.analysis.planning_brief.lesson_guidance)+bubble('Technical review',job.analysis.planning_brief.review_guidance)+'</details>':'')+
 (job.state==='uploaded'&&!job.analysis?.planning_brief?'<label>Additional instructions for Sol (optional)<textarea id="scan-learner-context" maxlength="2000" rows="4" placeholder="Leave blank for Sol to plan from the scanned pages."></textarea></label>':'')+
 explainAnalysis(job.analysis)+explainLesson(job.lesson)+explainReview(job.review)+provenance+
 '<div class="scan-approve-actions">'+buttonFor(job)+'</div>'+
 '<p class="muted sm">Model outputs are drafts, not definitive references. Compare important formulas and safety guidance against the actual scanned pages before approving. Approved lessons are read-only study companions; they do not award scores.</p></section>';
}
export function attachScanInbox(supabase,user,notify=()=>{}){
 const root=by('#scan-root');
 if(!root||!supabase||!user)return;
 const id=user.id;
 let jobs=[],preparedFile=null,preparing=null,pendingUpload=null;
 const fileInput=root.querySelector("#scan-file");
 fileInput.addEventListener("change",()=>{
  preparedFile=fileInput.files[0]||null;pendingUpload=null;
  preparing=preparedFile?prepareScanFile(preparedFile):null;
  // Attach the error handler immediately; the original promise is awaited on submit.
  preparing?.catch(error=>status(error.message));
 });
 const status=(text)=>{if(root.isConnected)root.querySelector('#scan-status').textContent=text;};
 const invoke=async body=>{
  const {data,error}=await supabase.functions.invoke('scan-lesson-pipeline',{body});
  if(error){
   const parsed=await error.context?.json?.().catch?.(()=>null);
   throw Error(parsed?.error||error.message||'Private pipeline request failed');
  }
  return data;
 };
 const draw=()=>{
  if(!root.isConnected)return;
  const list=root.querySelector('#scan-list');
  list.innerHTML=jobs.length?jobs.map(j=>'<button type="button" class="scan-list-row'+(selectedId===j.id?' selected':'')+'" data-select-scan="'+esc(j.id)+'"><strong>'+esc(j.title)+'</strong><span>'+esc(humanState(j.state))+'</span></button>').join(''):'<p class="muted">No scans uploaded yet. Your first private source will appear here.</p>';
  list.querySelectorAll('[data-select-scan]').forEach(b=>b.addEventListener('click',()=>{selectedId=b.dataset.selectScan;draw()}));
  const job=jobs.find(j=>j.id===selectedId);
  const div=root.querySelector('#scan-detail');
  div.innerHTML=job?detail(job):'<section class="panel"><h3>3 · Select a scan</h3><p>Choose an uploaded source to review its evidence and build a draft.</p></section>';
  if(!job)return;
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
  div.querySelector('[data-scan-action]')?.addEventListener('click',async e=>{
   if(operation)return;
   const action=e.currentTarget.dataset.scanAction;
   if(action==='approve'&&!window.confirm('Approve this reviewed draft into your private study library? It will not affect graded lessons.'))return;
   operation=true;
   const button=e.currentTarget;button.disabled=true;
   status(action==='approve'?'Saving your approval…':action==='analyze'?'Running Sol planning → Astra analysis (up to two paid requests)…':'Running '+action+' — one paid AI request, please wait…');
   try{
    let planningUsage=null;
    if(action==='analyze'&&!job.analysis?.planning_brief){
     const planned=await invoke({action:'plan',jobId:job.id,learnerContext:div.querySelector('#scan-learner-context')?.value||''});
     planningUsage=planned.usage;
     status('Sol brief saved. Running Astra source analysis…');
    }
    const result=await invoke({action,jobId:job.id});
    if(planningUsage&&result.usage)result.usage.estimatedUSD+=planningUsage.estimatedUSD;
    if(result.usage){lastUsage=result.usage;}
    await refresh(false);
    status('Completed '+action+'. '+(result.usage?'Estimated cost: $'+Number(result.usage.estimatedUSD).toFixed(5)+'. ':'')+'Review the results before moving on.');
   }catch(error){await refresh(false);status('Could not '+action+': '+error.message+' Any saved Sol brief will be reused on retry.');notify(error.message)}
   finally{operation=false;if(button.isConnected)button.disabled=false;}
  });
 };
 const refresh=async announce=>{
  try{
   const {data,error}=await supabase.from('scan_lesson_jobs').select('id,title,source_kind,source_path,source_bytes,state,analysis,lesson,review,draft_id,created_at,updated_at,revision')
    .order('created_at',{ascending:false}).limit(30);
   if(error)throw error;
   if(!root.isConnected)return;
   jobs=data||[];if(!jobs.some(j=>j.id===selectedId))selectedId=jobs[0]?.id||null;
   draw();if(announce)status(jobs.length+' private source(s) loaded. No paid model requests were made.');
  }catch(e){status('Private Scan Inbox unavailable: '+e.message);}
 };
 root.querySelector('#scan-refresh').addEventListener('click',()=>void refresh(true));
 root.querySelector('#scan-upload-form').addEventListener('submit',async e=>{
  e.preventDefault();if(operation)return;
  const name=root.querySelector('#scan-title').value.trim(),file=root.querySelector('#scan-file').files[0],
   approved=root.querySelector('#scan-share-consent').checked;
  if(!approved||!name||!file)return;
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
   const registered=await invoke({action:'register',path:pending.path,title:name});
   selectedId=registered.jobId;root.querySelector('#scan-upload-form').reset();
   preparedFile=null;preparing=null;pendingUpload=null;
   await refresh(false);status('Source uploaded. No AI charges yet. Select Run Sol planning → Astra analysis when ready.');
   button.textContent='Upload privately (no AI charge)';
  }catch(error){
   status('Upload failed while '+phase+': '+error.message+'. Tap Retry upload to try again.');
   button.textContent='Retry upload (no AI charge)';notify(error.message);
  }
  finally{operation=false;button.disabled=false}
 });
 void (async()=>{
  try{await invoke({action:'status'});await refresh(true)}
  catch(e){status('Private scan authorization unavailable: '+e.message);root.querySelector('#scan-upload').disabled=true}
 })();
}

