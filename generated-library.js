// Owner-only, read-only library of human-approved scan-derived companions.
// Existing graded lesson IDs and spaced-review records are never changed here.
const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const BOOK_TRACKS=new Set(["geier","teach","principles","cabling","other"]);
const safeList=value=>Array.isArray(value)?value:[];
function attribution(job,ids=[]){
 const book=job.source_book||job.lesson?.source?.book||"Publication not recorded";
 const pages=job.source_pages||job.lesson?.source?.pages||"Page reference not recorded";
 const facts=safeList(job.analysis?.facts);
 const evidence=safeList(ids).map(id=>{
  const loc=facts.find(f=>f.id===id)?.location;
  return String(id)+(loc?" ("+String(loc)+")":"");
 }).join("; ");
 return esc(book+" · "+pages+(evidence?" · Evidence "+evidence:""));
}
function lessonContent(lesson,job,idPrefix){
 let h='<div class="generated-reading">';
 for(const [i,part] of safeList(lesson.sections).entries()){
  h+='<section class="generated-reading-part"><h4>'+esc(part.heading)+'</h4><p>'+esc(part.body)+'</p>'+
   '<small>Source: '+attribution(job,part.source_ids)+'</small></section>';
 }
 if(safeList(lesson.questions).length){
  h+='<h4>Practice from another angle</h4>';
  for(const [i,q] of lesson.questions.entries()){
   h+='<details class="generated-exercise"><summary>Exercise '+(i+1)+': '+esc(q.prompt)+'</summary>'+
    '<p><b>Answer:</b> '+esc(q.answer)+'</p><p><b>Why:</b> '+esc(q.explanation)+'</p>'+
    '<small>Source: '+attribution(job,q.source_ids)+'</small></details>';
  }
 }
 return h+'</div>';
}
function cards(jobs,filter){
 const entries=[];
 for(const job of jobs){
  if(!["outlined","drafted","reviewed","needs_revision","approved"].includes(job.state)||!job.lesson)continue;
  const track=job.source_track||job.lesson?.source?.track||"other";
  const approvedUnits=Array.isArray(job.lesson.lessons)?job.lesson.lessons:
   job.state==="approved"?[job.lesson]:[];
  for(const unit of approvedUnits){
   const kind=unit.plan?.kind||unit.kind||"concept";
   const destination=unit.plan?.destination||unit.destination||"source";
   const meta=unit.plan||unit;
   if(filter==="review"){
    for(const [i,review] of safeList(unit.review_lessons).entries()){
     entries.push({job,lesson:review,kind:"review",order:i,meta});
    }
   }else if((filter==="math"&&kind==="math")||
    (filter==="textbooks"&&BOOK_TRACKS.has(track))||
    (filter==="ceta"&&track==="guide")||
    (filter==="labs"&&track==="basic")||filter===track){
    if(destination==="source"&&safeList(unit.sections).length){
     entries.push({job,lesson:unit,kind:"unique",order:0,meta});
    }
   }
  }
 }
 if(!entries.length)return '<p class="muted">No approved '+(filter==="review"?'reinforcement lessons':'source-specific lessons')+
  ' here yet. Completed chapter units appear as you approve them; drafts remain private in Scan Inbox.</p>';
 return entries.map(({job,lesson,kind,order,meta})=>{
  const insight=kind==="review"?'<p><b>What this source adds:</b> '+esc(lesson.new_perspective)+'</p>':'<p>'+esc(lesson.description)+'</p>';
  const related=kind==="review"&&safeList(lesson.related_lessons).length?'<p class="muted sm">Related lessons: '+esc(lesson.related_lessons.join("; "))+'</p>':'';
  const sequence=meta?.ordering==="sequential"?
   'Suggested sequential study'+(safeList(meta.prerequisites).length?' · Prior unit(s): '+meta.prerequisites.join(', '):''):
   'Independent / self-paced';
  return '<details class="generated-library-entry"><summary><span class="generated-library-title">'+esc(lesson.title)+'</span>'+
   '<small>'+attribution(job)+'</small><small>'+esc(sequence)+' · '+esc(meta?.kind||"concept")+'</small></summary>'+
   '<div class="generated-library-body">'+insight+related+
   '<p class="muted sm">The page range is user-entered. Evidence positions come from the saved Astra extraction; compare against the original pages.</p>'+
   lessonContent(lesson,job,kind+'-'+order)+'</div></details>';
 }).join("");
}
export function generatedLibrarySlot(filter){
 const review=filter==="review";
 return '<section class="generated-library-panel panel" aria-label="'+(review?'Review and Reinforcement':'Approved source-specific lessons')+'">'+
  '<div class="generated-library-top"><div><p class="v2-kicker">'+(review?'CROSS-BOOK LEARNING TRACK':'ORIGINAL SOURCE COMPANIONS')+'</p>'+
  '<h2>'+(review?'Review & Reinforcement lessons':'Approved source-specific lessons')+'</h2>'+
  '<p class="muted sm">'+(review?'Repeated concepts live here when a new publication contributes a different explanation, worked method, safety detail or exercise. This is separate from your scheduled quiz reviews.':
  'Unique material remains with its source track. Overlapping concepts are directed to Review & Reinforcement.')+'</p></div>'+
  '<button type="button" class="outline small-button" data-refresh-generated>Refresh library</button></div>'+
  '<div id="generated-library-list" data-track="'+esc(filter)+'">Loading private approved lessons…</div></section>';
}
export function attachGeneratedLibrary(supabase,user,notify=()=>{}){
 const region=document.querySelector('#generated-library-list');
 if(!region||!user||!supabase)return;
 const container=region.closest('.generated-library-panel');
 const refresh=async()=>{
  if(!region.isConnected)return;
  const button=container.querySelector('[data-refresh-generated]');
  if(button)button.disabled=true;
  try{
   const {data,error}=await supabase.from('scan_lesson_jobs')
    .select('id,title,source_book,source_pages,source_track,state,lesson,analysis,approved_at,created_at')
    .in('state',['outlined','drafted','reviewed','needs_revision','approved']).order('created_at',{ascending:false}).limit(200);
   if(error)throw error;
   if(!region.isConnected)return;
   region.innerHTML=cards(data||[],region.dataset.track);
  }catch(error){if(region.isConnected)region.textContent='Approved lessons could not be loaded: '+error.message;}
  finally{if(button?.isConnected)button.disabled=false;}
 };
 container.querySelector('[data-refresh-generated]')?.addEventListener('click',()=>void refresh());
 void refresh();
}
