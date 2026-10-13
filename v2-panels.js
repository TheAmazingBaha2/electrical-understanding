import {renderSourceSection,renderMathPractice,renderChapterDashboard} from './source-navigation.js';
const safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const percent=(a,b)=>b?Math.round(a/b*100):0;
const bar=n=>'<div class="v2-meter" role="progressbar" aria-valuenow="'+n+'" aria-valuemin="0" aria-valuemax="100"><span style="width:'+n+'%"></span></div>';
function sourceRows(lessons,c){return (lessons||[]).map(l=>{const a=c.progress[l.id]?.answers||{};return {id:l.id,title:l.title,lesson:l,correct:l.questions.filter(q=>a[q.id]?.correct===true).length,answered:l.questions.filter(q=>typeof a[q.id]?.correct==='boolean').length,total:l.questions.length,done:c.hasPassed(l)};});}
export const v2Dashboard=renderChapterDashboard;
function unreferencedRows(c){
 const lessons=c.archivedUnreferencedLessons||[];
 if(!lessons.length)return '<p class="muted">No unreferenced companions are currently archived.</p>';
 return lessons.map((lesson,i)=>{
  const state=c.progress[lesson.id]||{},answers=state.answers||{};
  const correct=lesson.questions.filter(q=>answers[q.id]?.correct===true).length;
  const answered=lesson.questions.filter(q=>typeof answers[q.id]?.correct==='boolean').length;
  const available=c.canOpenArchive?.(lesson)??true;
  const mastered=c.hasPassed(lesson),reason=c.legacyReason?.(lesson)||'Original independent practice';
  const origin=lesson.subtrack==='math'?'Mathematics Companion':lesson.subtrack==='guide'?'Exam Preparation · CETa Study Guide':'Other original instruction';
  return '<article class="legacy-source-row"><div class="legacy-source-row-head"><span class="v2-pill">'+safe(lesson.subtrack==='math'?'MATHEMATICS':'EXAM PREPARATION')+'</span><span class="legacy-lesson-state">'+(mastered?'Mastered':available?'Available':'Prerequisite not yet reached')+'</span></div>'+
   '<h3>'+safe(lesson.title)+'</h3><p class="muted sm">'+safe(lesson.description)+'</p>'+
   '<p class="legacy-source-meta">'+safe(origin)+' · '+safe(lesson.minutes)+' min · '+answered+' / '+lesson.questions.length+' checks answered'+(answered?' · '+correct+' correct':'')+'</p>'+
   '<p class="legacy-source-reason">'+safe(reason)+'</p>'+
   '<button type="button" class="'+(mastered?'outline':'primary')+' small-button" data-goto="lesson" data-lesson="'+safe(lesson.id)+'" '+(available?'':'disabled')+'>'+
   (mastered?'Revisit archived lesson →':available?'Open original lesson →':'Complete a linked topic first')+'</button></article>';
 }).join('');
}
function archivedChapterRows(c){
 const rows=sourceRows(c.archivedGeneratedLessons,c);
 if(!rows.length)return '<p class="muted">Loading approved source-backed legacy companions…</p>';
 return rows.map((r,i)=>{
  const label=r.lesson.kind==='math'?'MATHEMATICS':r.lesson.libraryView==='reviews'?'REINFORCEMENT':'SOURCE-BASED STUDY';
  return '<article class="legacy-source-row"><div class="legacy-source-row-head"><span class="v2-pill">'+safe(label)+'</span><span class="legacy-lesson-state">'+(r.done?'Mastered':'Available')+'</span></div>'+
   '<h3>'+safe(r.title)+'</h3><p class="muted sm">'+safe(r.lesson.description)+'</p>'+
   '<p class="legacy-source-meta">'+safe(r.lesson.module)+' · '+r.answered+' / '+r.total+' answered · '+r.correct+' correct</p>'+
   '<p class="legacy-source-reason">Approved scan-derived workbench preserved in Legacy; source citations and interactive activities are retained.</p>'+
   '<button type="button" class="'+(r.done?'outline':'primary')+' small-button" data-goto="generated-lesson" data-lesson="'+safe(r.id)+'">'+(r.done?'Revisit':'Study archived lesson')+' →</button></article>';
 }).join('');
}
function legacyView(c){
 const pilot=c.archivedPilotLessons||c.lessons.filter(l=>l.legacy===true||/^L\d{2,}$/.test(l.id));
 const unreferenced=c.archivedUnreferencedLessons||[];
 const pilotDone=pilot.filter(c.hasPassed).length,unrefDone=unreferenced.filter(c.hasPassed).length;
 const archivedChapter=c.archivedGeneratedLessons||[],chapterDone=archivedChapter.filter(c.hasPassed).length;
 return '<header class="legacy-heading"><p class="v2-kicker">PRESERVED STUDY MATERIAL</p><h2>Legacy Lessons</h2>'+
  '<p class="muted">Original teaching stays available without being mistaken for verified textbook-derived material. All archived groups retain the same lesson IDs, worked examples, scores and scheduled reviews.</p>'+
  '<button class="legacy-back" type="button" data-goto="ceta">← Back to Exam Preparation</button></header>'+
  '<div class="legacy-groups-grid" aria-label="Original legacy lesson groups">'+
  '<section id="legacy-pilot" class="v2-panel legacy-listing legacy-group-panel" aria-labelledby="legacy-pilot-title">'+
  '<div class="legacy-group-eyebrow"><span>01</span> ORIGINAL COURSE</div><h3 id="legacy-pilot-title">CETa Pilot Lessons</h3>'+
  '<p class="muted sm">The five foundational lessons from the original learning workbench, preserved with their interactive activities.</p>'+
  '<div class="legacy-group-summary"><strong>'+pilotDone+' / '+pilot.length+'</strong><span>lessons mastered</span></div>'+bar(percent(pilotDone,pilot.length))+
  '<div class="legacy-list">'+(c.legacyRows||c.coreRows||'<p class="muted">No pilot lessons recorded.</p>')+'</div></section>'+
  '<section id="legacy-unreferenced" class="v2-panel legacy-listing legacy-group-panel legacy-original-panel" aria-labelledby="legacy-original-title">'+
  '<div class="legacy-group-eyebrow"><span>02</span> INDEPENDENT PRACTICE</div><h3 id="legacy-original-title">Original / Unreferenced Lessons</h3>'+
  '<p class="muted sm">Lessons without verified supporting textbook chapter pages. These remain useful for learning, but are no longer presented as source-backed chapters.</p>'+
  '<div class="legacy-group-summary"><strong>'+unrefDone+' / '+unreferenced.length+'</strong><span>lessons mastered</span></div>'+bar(percent(unrefDone,unreferenced.length))+
  '<div class="legacy-list">'+unreferencedRows(c)+'</div></section></div>'+
  '<section id="legacy-scanned-chapter" class="v2-panel legacy-listing legacy-group-panel" aria-labelledby="legacy-scanned-title">'+
  '<div class="legacy-group-eyebrow"><span>03</span> APPROVED CHAPTER ARCHIVE</div><h3 id="legacy-scanned-title">CETa Study Guide · Chapter 3 · Math for Electronics</h3>'+
  '<p class="muted sm">All 16 approved source and reinforcement lessons are archived here by request. The five-tab workbenches, existing quizzes, interactions, textbook citations and synced progress stay available. This does not archive future chapters from the book.</p>'+
  '<div class="legacy-group-summary"><strong>'+chapterDone+' / '+archivedChapter.length+'</strong><span>approved lessons mastered</span></div>'+bar(percent(chapterDone,archivedChapter.length))+
  '<div class="legacy-list">'+archivedChapterRows(c)+'</div></section>'+
  '<p class="legacy-archive-note">Archiving changes organization only. No lesson, quiz result, achievement, or review schedule is erased or reset. Future source-grounded replacements can be built in the active tracks.</p>';
}

export function v2Page(name,c,subId){
 if(name==='legacy'||name==='curriculum')return legacyView(c);
 if(name==='math')return renderMathPractice(c);
 if(name==='subtrack'){
  if(subId==='core')return legacyView(c);
  return renderSourceSection(['guide','exam'].includes(subId)?'ceta':['basic','analog','fpga','rp2040'].includes(subId)?'labs':'textbooks',c,subId==='guide'?'associate-cet:3':subId==='basic'?'basic:PreLab':subId==='geier'?'geier:6':subId);
 }
 if(['ceta','textbooks','labs'].includes(name))return renderSourceSection(name,c,subId);
 return v2Dashboard(c);
}
