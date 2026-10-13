import {isArchivedScanChapter} from './legacy-groups.js';
// Owner-only, read-only library of human-approved scan-derived companions.
// Existing graded lesson IDs and spaced-review records are never changed here.
const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const BOOK_TRACKS=new Set(["geier","teach","principles","cabling","other"]);
const safeList=value=>Array.isArray(value)?value:[];
// Source-approved legacy drafts sometimes accidentally prefix a learner question
// with Sol's editorial label. Remove only this leading label, never the answer,
// citation, original stored source, or stable question ID.
export function cleanGeneratedPrompt(value){
 return String(value??"").replace(/^\s*newly[\s-]+authored\s+(?:practice|question|exercise)\s*(?::|[—–-])\s*/i,"").trim();
}

function attribution(job,ids=[]){
 const book=job.source_book||job.lesson?.source?.book||"Publication not recorded";
 const pages=job.source_pages||job.lesson?.source?.pages||"Page reference not recorded";
 const facts=[...safeList(job.analysis?.facts),...safeList(job.analysis?.continuity?.sources).flatMap(s=>safeList(s.facts))];
 const evidence=safeList(ids).map(id=>{
  const loc=facts.find(f=>f.id===id)?.location;
  const f=facts.find(f=>f.id===id);
  return String(id)+(f?.source_job_id?" — "+f.book+" · "+f.pages:"")+(loc?" ("+String(loc)+")":"");
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
   h+='<details class="generated-exercise"><summary>Exercise '+(i+1)+': '+esc(cleanGeneratedPrompt(q.prompt))+'</summary>'+
    '<p><b>Answer:</b> '+esc(q.answer)+'</p><p><b>Why:</b> '+esc(q.explanation)+'</p>'+
    '<small>Source: '+attribution(job,q.source_ids)+'</small></details>';
  }
 }
 return h+'</div>';
}

function simulationForTitle(title){
 const name=String(title||"").toLowerCase();
 const choices=[["scientific notation|prefix conversions","prefixes"],["variables|formula rearrangement","algebra"],["resistor network","network"],
 ["internal resistance|terminal voltage","internal"],["sinusoid|amplitude measure","sine"],["period and frequency","period"],
 ["charge and stored energy","energy"],["capacitor network","capnetwork"],["time constant|exponential response","rc"],
 ["capacitive reactance","xc"],["combining inductors|inductance and","inductors"],["inductive reactance","xl"],
 ["series.rlc|phasor interpretation","rlc"],["resonan","resonance"],["ohm.s law|power calculation","ohm"]];
 return choices.find(([expression])=>new RegExp(expression).test(name))?.[1]||null;
}
export function makeWorkbenchLesson(job, unit, content, kind, order) {
 const rawId=String(unit.id||job.draft_id||job.id);
 const archived=!unit.curated&&isArchivedScanChapter(job);
 const id=kind==="review"?rawId+"-R"+String(order+1).padStart(2,"0"):rawId;
 const sections=safeList(content.sections), original=safeList(content.questions);
 const prompts=original.map((q,i)=>{
   const value=String(q.answer||"").trim().replace(/,/g,"");
   const parsed=value.match(/^([+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:e[+-]?[0-9]+)?)\s*([a-zA-ZµμΩ%°/]+)?$/i);
   const result={id:id+"-Q"+String(i+1).padStart(2,"0"),
     type:"reflection",prompt:cleanGeneratedPrompt(q.prompt),explain:String(q.explanation||""),
     rubric:"Expected answer: "+String(q.answer||"")+"\nReasoning: "+String(q.explanation||""),
     safety:false,source_ids:safeList(q.source_ids)};
   if(q.type==="choice"&&Array.isArray(q.choices)&&Number.isInteger(q.correct)&&q.correct>=0&&q.correct<q.choices.length){
     result.type="choice";result.choices=q.choices.map(String);result.correct=q.correct;
   }else if(q.type!=="reflection"&&parsed&&Number.isFinite(Number(parsed[1]))){
     result.type="number";result.answer=Number(parsed[1]);result.unit=parsed[2]||"";
     result.tolerance=Math.max(1e-10,Math.abs(result.answer)*0.01);
   }
   return result;
 });
 // Older approved drafts have 2–9 questions. Add source-grounded, explicitly
 // self-graded retrieval checks without generating new technical facts or AI costs.
 const styles=[
   heading=>"Explain the main idea from “"+heading+"” in your own words.",
   heading=>"Use the explanation under “"+heading+"” to walk through its reasoning.",
   heading=>"What assumptions, quantities or definitions matter under “"+heading+"”?",
   heading=>"How would you check that you understood “"+heading+"” correctly?"
 ];
 for(let i=prompts.length;!original.some(q=>q.type)&&i<10;i++){
   const part=sections.length?sections[(i-original.length)%sections.length]:null;
   const sample=original.length?original[(i-original.length)%original.length]:null;
   const prompt=part?styles[(i-original.length)%styles.length](String(part.heading)):
     "Revisit this approved question and explain the reasoning, not just its answer: "+cleanGeneratedPrompt(sample?.prompt||content.title);
   const reference=part?String(part.body):("Expected: "+String(sample?.answer||"")+"; Explanation: "+String(sample?.explanation||""));
   prompts.push({id:id+"-P"+String(i+1).padStart(2,"0"),type:"reflection",prompt,
     explain:"Compare your explanation with the saved source-backed material.",
     rubric:reference,safety:false,source_ids:safeList(part?.source_ids||sample?.source_ids)});
 }
 const activitySource=safeList(content.activities);
 const activities=activitySource.length?activitySource.map((a,i)=>({
   title:String(a.title||"Guided activity "+(i+1)),prompt:cleanGeneratedPrompt(a.prompt||"Make a prediction."),
   answer:String(a.expected||a.answer||""),explanation:String(a.explanation||""),
   source_ids:safeList(a.source_ids),kind:a.kind,choices:safeList(a.choices),correct:a.correct,simulator:a.simulator})):
   original.slice(0,Math.max(2,Math.min(4,original.length))).map((q,i)=>({
     title:"Prediction "+(i+1),prompt:cleanGeneratedPrompt(q.prompt),answer:String(q.answer),
     explanation:String(q.explanation||""),source_ids:safeList(q.source_ids)}));
 const citation=[job.source_book||"Publication not recorded",job.source_pages||"Page reference not recorded"].join(" · ");
 const html='<p>'+esc(content.description||content.new_perspective||"Follow the approved source-backed explanation step by step.")+'</p>'+
 sections.map(part=>'<h3>'+esc(part.heading)+'</h3><p>'+esc(part.body).replace(/\r?\n|\\n/g,'</p><p>')+'</p><p class="muted sm">Source: '+attribution(job,part.source_ids)+'</p>').join("");
 return {id,generated:true,subtrack:"generated",title:String(content.title||unit.plan?.title||"Approved lesson"),
   description:String(content.description||content.new_perspective||"Source-backed practice"),
   module:job.source_book||job.title||"Source-backed chapter",sourceAttribution:citation,teachingSections:sections.map(part=>({heading:String(part.heading),source_ids:safeList(part.source_ids)})),
   objectives:safeList(content.objectives),html,experiment:"generated",activities,questions:prompts,
   minutes:Math.max(10,sections.length*6+10),simulator:simulationForTitle(unit.plan?.title||content.title),kind:unit.plan?.kind||unit.kind||"concept",
   ordering:unit.plan?.ordering||unit.ordering||"independent",sourceUnitId:rawId,scanId:String(job.id),archived,curatedSeries:Boolean(unit.curated),seriesId:unit.series_id||null,seriesOrder:unit.series_order||null,overview:unit.overview||null,sourceTrack:job.source_track||"other",libraryView:archived?"legacy":kind==="review"?"reviews":(["math","ceta","labs","textbooks"].includes(unit.dashboard_track)?unit.dashboard_track:(unit.plan?.kind||unit.kind)==="math"?"math":job.source_track==="guide"?"ceta":job.source_track==="basic"?"labs":"textbooks")};
}


export function approvedUnitsFor(job){
 const original=Array.isArray(job.lesson?.lessons)?job.lesson.lessons:job.state==='approved'&&job.lesson?[job.lesson]:[];
 const curated=job.state==='approved'&&job.lesson?.curated_series?.status==='ready'?safeList(job.lesson.curated_series.lessons).map(unit=>({...unit,curated:true})):[];
 return [...original,...curated];
}
function cards(jobs,filter,register=()=>{}){
 const entries=[];
 for(const job of jobs){
  if(!["outlined","drafted","reviewed","needs_revision","approved"].includes(job.state)||!job.lesson)continue;
  const track=job.source_track||job.lesson?.source?.track||"other";
  // Archived chapters remain in their own Legacy collection, not in active paths.
  const approvedUnits=approvedUnitsFor(job);
  for(const unit of approvedUnits){
   if((!unit.curated&&isArchivedScanChapter(job))!==(filter==="legacy"))continue;
   const kind=unit.plan?.kind||unit.kind||"concept";
   const destination=unit.plan?.destination||unit.destination||"source";
   const meta=unit.plan||unit;
   if(filter==="legacy"||filter==="review"||(filter==="math"&&kind==="math")){
    for(const [i,review] of safeList(unit.review_lessons).entries()){
     entries.push({job,unit,lesson:review,kind:"review",order:i,meta});
    }
   }
   if(filter!=="review"&&(filter==="legacy"||(filter==="math"&&kind==="math")||
    (filter==="textbooks"&&BOOK_TRACKS.has(track))||
    (filter==="ceta"&&track==="guide")||
    (filter==="labs"&&track==="basic")||filter===track)){
    if(destination==="source"&&safeList(unit.sections).length){
     entries.push({job,unit,lesson:unit,kind:"unique",order:0,meta});
    }
   }
  }
 }
 if(!entries.length)return '<p class="muted">No approved '+(filter==="review"?'reinforcement lessons':'source-specific lessons')+
  ' here yet. Completed chapter units appear as you approve them; drafts remain private in Scan Inbox.</p>';
 return entries.map(({job,unit,lesson,kind,order,meta})=>{
  const workbench=makeWorkbenchLesson(job,unit,lesson,kind,order);
  register(workbench);
  const insight=kind==="review"?'<p><b>What this source adds:</b> '+esc(lesson.new_perspective)+'</p>':'<p>'+esc(lesson.description)+'</p>';
  const related=kind==="review"&&safeList(lesson.related_lessons).length?'<p class="muted sm">Related lessons: '+esc(lesson.related_lessons.join("; "))+'</p>':'';
  const sequence=meta?.ordering==="sequential"?
   'Suggested sequential study'+(safeList(meta.prerequisites).length?' · Prior unit(s): '+meta.prerequisites.join(', '):''):
   'Independent / self-paced';
  return '<details class="generated-library-entry"><summary><span class="generated-library-title">'+esc(lesson.title)+'</span>'+
   '<small>'+attribution(job)+'</small><small>'+esc(sequence)+' · '+esc(meta?.kind||"concept")+'</small></summary>'+
   '<div class="generated-library-body"><button type="button" class="primary small-button" data-generated-lesson="'+esc(workbench.id)+'">Study in the five-tab workbench →</button>'+insight+related+
   '<p class="muted sm">The page range is user-entered. Evidence positions come from the saved model extraction; compare against the original pages.</p>'+
   lessonContent(lesson,job,kind+'-'+order)+'</div></details>';
 }).join("");
}

// Full private learning inventory (only approved units; never pending model drafts).
export function approvedWorkbenchLessons(jobs){
 const lessons=[];
 for(const job of safeList(jobs)){
  const approvedUnits=approvedUnitsFor(job);
  for(const unit of approvedUnits){
   if(safeList(unit.sections).length)lessons.push(makeWorkbenchLesson(job,unit,unit,"unique",0));
   safeList(unit.review_lessons).forEach((review,i)=>lessons.push(makeWorkbenchLesson(job,unit,review,"review",i)));
  }
 }
 return lessons;
}

export function generatedLibrarySlot(filter){
 const review=filter==="review",legacy=filter==="legacy";
 return '<section class="generated-library-panel panel" aria-label="'+(review?'Review and Reinforcement':'Approved source-specific lessons')+'">'+
  '<div class="generated-library-top"><div><p class="v2-kicker">'+(legacy?'LEGACY · APPROVED SOURCE CHAPTER':review?'CROSS-BOOK LEARNING TRACK':'ORIGINAL SOURCE COMPANIONS')+'</p>'+
  '<h2>'+(legacy?'Archived Chapter 3 companions':review?'Review & Reinforcement lessons':'Approved source-specific lessons')+'</h2>'+
  '<p class="muted sm">'+(legacy?'This chapter has been archived by request. The approved source material, lesson IDs, explanations, interactions and progress are preserved.':review?'Repeated concepts live here when a new publication contributes a different explanation, worked method, safety detail or exercise. This is separate from your scheduled quiz reviews.':
  'Unique material remains with its source track. Overlapping concepts are directed to Review & Reinforcement.')+'</p></div>'+
  '<button type="button" class="outline small-button" data-refresh-generated>Refresh library</button></div>'+
  '<div id="generated-library-list" data-track="'+esc(filter)+'">Loading private approved lessons…</div></section>';
}
export function attachGeneratedLibrary(supabase,user,notify=()=>{},onRegister=()=>{},onOpen=()=>{}){
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
   region.innerHTML=cards(data||[],region.dataset.track,onRegister);
   region.querySelectorAll('[data-generated-lesson]').forEach(button=>button.addEventListener('click',()=>onOpen(button.dataset.generatedLesson)));
  }catch(error){if(region.isConnected)region.textContent='Approved lessons could not be loaded: '+error.message;}
  finally{if(button?.isConnected)button.disabled=false;}
 };
 container.querySelector('[data-refresh-generated]')?.addEventListener('click',()=>void refresh());
 void refresh();
}
