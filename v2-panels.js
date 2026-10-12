import { catalog, catalogSubtrack } from './course-catalog.js';
import {renderMathTrack} from './math-track.js';
// Presentation functions: never invent assessment results or private records.
const safe = x => String(x == null ? '' : x).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={active:'Current focus',indexed:'Contents catalogued',drafted:'Lesson designs drafted',planned:'Planned',paused:'Paused',waiting:'Waiting','awaiting-book':'Awaiting book'};
const percent=(a,b)=>b?Math.round(a/b*100):0;
const tag=s=>'<span class="v2-pill v2-state-'+safe(s)+'">'+safe(labels[s]||s)+'</span>';
const bar=n=>'<div class="v2-meter" role="progressbar" aria-valuenow="'+n+'" aria-valuemin="0" aria-valuemax="100"><span style="width:'+n+'%"></span></div>';
function stats(c){
 const rows=c.lessons.map(l=>{const s=c.progress[l.id]||{},a=s.answers||{};return {id:l.id,title:l.title,done:c.hasPassed(l),correct:Object.values(a).filter(x=>x.correct===true).length,answered:Object.values(a).filter(x=>typeof x.correct==='boolean').length,total:l.questions.length,saved:s.updatedAt||0}});
 return {rows,done:rows.filter(x=>x.done).length,total:rows.length,correct:rows.reduce((n,x)=>n+x.correct,0),answered:rows.reduce((n,x)=>n+x.answered,0)};
}
function stat(label,value,description){return '<div class="v2-stat"><p class="v2-label">'+safe(label)+'</p><strong>'+safe(value)+'</strong><p class="muted sm">'+safe(description)+'</p></div>'}
function ring(n){const c=2*Math.PI*57;return '<svg class="v2-donut" viewBox="0 0 160 160" role="img" aria-label="'+n+'% of active lab companions completed"><circle class="v2-ring-bg" cx="80" cy="80" r="57"/><circle class="v2-ring-fg" cx="80" cy="80" r="57" stroke-dasharray="'+(c*n/100)+' '+c+'" transform="rotate(-90 80 80)"/><text class="v2-ring-num" x="80" y="79" text-anchor="middle">'+n+'%</text><text class="v2-ring-desc" x="80" y="100" text-anchor="middle">ACTIVE LABS</text></svg>'}
function subcard(s){
 const highlights=s.id==='guide'?'<div class="path-card-details"><div><strong>09</strong><span>Units indexed</span></div><div><strong>22</strong><span>Chapters mapped</span></div><div><strong>1</strong><span>Published lesson</span></div></div>':
 s.id==='exam'?'<div class="path-plan-points"><span>Fault diagnosis</span><span>Mixed-topic checks</span><span>Spaced review</span></div>':'';
 return '<article class="v2-subcard">'+tag(s.status)+'<h3>'+safe(s.title)+'</h3><p class="muted sm">'+safe(s.summary)+'</p>'+highlights+'<button class="outline small-button" data-goto="subtrack" data-lesson="'+safe(s.id)+'">Explore sub-track →</button></article>';
}

function pathDropdown(){
 return '<div class="course-menu-wrap"><button class="outline" id="course-paths-trigger" type="button" data-toggle-paths aria-expanded="false" aria-controls="course-paths-menu">Course paths <span aria-hidden="true">⌄</span></button>'+
 '<div class="course-menu" id="course-paths-menu" hidden><div class="course-menu-heading"><strong>Choose a learning path</strong><span class="muted sm">Browse here; open only when you choose a sub-track</span></div>'+
 catalog.map((track,i)=>'<section class="course-menu-group"><h3><span>0'+(i+1)+'</span> '+safe(track.title)+'</h3>'+
  (track.id==='math'?'<button type="button" class="course-path-option" data-goto="math"><span><strong>Mathematics Companion</strong><small>Adapts to your other learning tracks</small></span><span aria-hidden="true">↗</span></button>':track.subtracks.filter(sub=>sub.id!=='core').map(sub=>'<button type="button" class="course-path-option" data-goto="subtrack" data-lesson="'+safe(sub.id)+'"><span><strong>'+safe(sub.title)+'</strong><small>'+safe(labels[sub.status]||sub.status)+'</small></span><span aria-hidden="true">↗</span></button>').join(''))+
 '</section>').join('')+'</div></div>';
}
function scopeDonut(title,completed,total,description,tone){
 const pct=percent(completed,total);
 return '<div class="v2-scope-donut"><div class="v2-frost-ring '+tone+'" role="img" aria-label="'+safe(title)+': '+completed+' of '+total+' published lessons complete" style="--completion:'+pct+'%"><span><strong>'+pct+'%</strong><small>'+completed+' / '+total+'</small></span></div><div><b>'+safe(title)+'</b><p class="muted sm">'+safe(description)+'</p></div></div>';
}
function assessmentPie(rows){
 const possible=rows.reduce((sum,r)=>sum+r.total,0);
 const correct=rows.reduce((sum,r)=>sum+r.correct,0);
 const incorrect=rows.reduce((sum,r)=>sum+Math.max(0,r.answered-r.correct),0);
 const unattempted=Math.max(0,possible-correct-incorrect);
 const correctDeg=possible?correct/possible*360:0;
 const incorrectDeg=possible?incorrect/possible*360:0;
 return '<div class="v2-evidence-card"><div class="v2-evidence-pie" style="--correct-end:'+correctDeg+'deg;--incorrect-end:'+(correctDeg+incorrectDeg)+'deg" role="img" aria-label="'+correct+' correct, '+incorrect+' needs review, '+unattempted+' unanswered questions out of '+possible+' published checks"><span><b>'+possible+'</b><small>checks</small></span></div>'+
 '<div class="v2-pie-legend"><p><i class="dot-correct"></i><span>Correct</span><b>'+correct+'</b></p><p><i class="dot-retry"></i><span>Needs review</span><b>'+incorrect+'</b></p><p><i class="dot-unseen"></i><span>Not attempted</span><b>'+unattempted+'</b></p></div></div>';
}

export function v2Dashboard(c){
 const v=stats(c),rate=percent(v.done,v.total);
 const labNext=(c.labLessons||[]).find((l,i)=>(i===0||c.hasPassed(c.labLessons[0]))&&!c.hasPassed(l));
 const labRows=(c.labLessons||[]).map(l=>{const st=c.progress[l.id]||{},a=st.answers||{};return {id:l.id,title:l.title,correct:Object.values(a).filter(x=>x.correct===true).length,answered:Object.values(a).filter(x=>typeof x.correct==="boolean").length,total:l.questions.length,done:c.hasPassed(l),saved:st.updatedAt||0}});
 const bookRows=(c.bookLessons||[]).map(l=>{const st=c.progress[l.id]||{},a=st.answers||{};return {id:l.id,title:l.title,correct:Object.values(a).filter(x=>x.correct===true).length,answered:Object.values(a).filter(x=>typeof x.correct==="boolean").length,total:l.questions.length,done:c.hasPassed(l),saved:st.updatedAt||0}});
 const bookComplete=bookRows.filter(x=>x.done).length;
 const guideRows=(c.cetaLessons||[]).map(l=>{const st=c.progress[l.id]||{},a=st.answers||{};return {id:l.id,title:l.title,correct:Object.values(a).filter(x=>x.correct===true).length,answered:Object.values(a).filter(x=>typeof x.correct==="boolean").length,total:l.questions.length,done:c.hasPassed(l),saved:st.updatedAt||0}});
 const guideComplete=guideRows.filter(x=>x.done).length;
 const mathRows=(c.mathLessons||[]).filter(l=>c.mathIsAvailable?.(l)).map(l=>{const st=c.progress[l.id]||{},a=st.answers||{};return {id:l.id,title:l.title,correct:l.questions.filter(q=>a[q.id]?.correct===true).length,answered:l.questions.filter(q=>typeof a[q.id]?.correct==='boolean').length,total:l.questions.length,done:c.hasPassed(l),saved:st.updatedAt||0}});
 const mathComplete=mathRows.filter(x=>x.done).length;

 const labComplete=labRows.filter(x=>x.done).length;
 const allAnswerRows=[...v.rows,...labRows,...bookRows,...guideRows,...mathRows],answeredAcrossTracks=allAnswerRows.reduce((n,x)=>n+x.answered,0),correctAcrossTracks=allAnswerRows.reduce((n,x)=>n+x.correct,0);
 const trackCards=catalog.map(t=>'<div class="v2-track-row"><div class="v2-track-header"><strong>'+safe(t.title)+'</strong><button data-goto="'+safe(t.id)+'" class="outline small-button">Explore →</button></div>'+(t.id==='math'?'<div class="v2-subrow"><span>Linked math companions · no subtracks</span><span>'+mathComplete+' / '+mathRows.length+' available lessons mastered</span></div>':t.subtracks.filter(s=>s.id!=='core').map(s=>'<div class="v2-subrow"><span>'+safe(s.title)+'</span><span>'+ (s.id==='core'?(v.done+' / '+v.total+' mastered'):s.id==='basic'?(labComplete+' / '+labRows.length+' virtual companions passed'):s.id==='geier'?(bookComplete+' / '+bookRows.length+' DMM companions passed'):s.id==='guide'?(guideComplete+' / '+guideRows.length+' guide companions passed'):safe(labels[s.status]||s.status))+'</span></div>').join(''))+'</div>').join('');
 const skills=v.rows.map(x=>'<div class="v2-skill"><div class="v2-skill-label"><span>'+safe(x.title)+'</span><strong>'+x.correct+' / '+x.total+'</strong></div>'+bar(percent(x.correct,x.total))+'</div>').join('');
 const recent=[...v.rows,...labRows,...bookRows,...guideRows,...mathRows].filter(x=>x.saved>0).sort((a,b)=>b.saved-a.saved).slice(0,5).map(x=>'<div class="v2-history"><span class="v2-history-dot"></span><div><strong>'+safe(x.id)+' · '+safe(x.title)+'</strong><p class="muted sm">Saved '+new Date(x.saved).toLocaleDateString()+'</p></div></div>').join('');
 return '<div class="v2-wrap"><section class="v2-hero"><div><p class="v2-kicker">EXAM PREP · TEXTBOOKS · HANDS-ON LABORATORY · MATH</p><h2>Everything you learn, connected.</h2><p>Study electrical theory, explore circuits, and build real skills. Your results stay linked across your learning tracks.</p><div class="actions"><button class="primary" data-goto="'+(labNext?'lesson':'subtrack')+'" data-lesson="'+safe(labNext?labNext.id:'basic')+'">'+(labNext?'Continue '+safe(labNext.id==='EIM-BEC-PRELAB'?'Bench Readiness':'Three-Resistor Challenge'):'Explore Basic Electric Circuits')+' →</button>'+pathDropdown()+'</div></div><div class="v2-donut-box">'+ring(percent(labComplete,labRows.length))+'<p class="muted sm">Based on '+labRows.length+' released virtual lab companions</p></div></section>'+
 '<div class="v2-stats">'+stat('Legacy lessons completed',v.done+' / '+v.total,'Original CETa course, preserved')+stat('Saved answers',answeredAcrossTracks,'Across all currently published lessons')+stat('Correct saved answers',correctAcrossTracks,answeredAcrossTracks?percent(correctAcrossTracks,answeredAcrossTracks)+'% of answered checks':'No checks recorded yet')+stat('Virtual lab lessons',labComplete+' / '+labRows.length,'Physical laboratory work tracked separately')+stat('Textbook DMM lessons',bookComplete+' / '+bookRows.length,'Independent Chapter 6 companion')+stat('CETa guide companions',guideComplete+' / '+guideRows.length,'Original Chapter 3 foundation')+stat('Mathematics Companion',mathComplete+' / '+mathRows.length,'Math topics tied to your reachable source lessons')+stat('Reviews due',c.reviews,'Based on saved review dates')+'</div>'+c.banner+
 '<section class="v2-visual-grid" aria-label="Progress charts"><div class="v2-panel v2-frost-card"><div class="v2-panel-heading"><h2>Current learning paths</h2><span class="muted sm">Published lessons only</span></div><div class="v2-scope-chart-grid">'+
  scopeDonut("Legacy CETa",v.done,v.total,"Preserved earlier course","ice")+
  scopeDonut("Virtual laboratories",labComplete,labRows.length,"Two active EIM companions","cyan")+
  scopeDonut("DMM textbook",bookComplete,bookRows.length,"Geier Chapter 6 companion","ice")+
  scopeDonut("CETa Guide",guideComplete,guideRows.length,"One Chapter 3 topic published","cyan")+
  scopeDonut("Mathematics",mathComplete,mathRows.length,"Linked math companions now in reach","ice")+
  scopeDonut("All published lessons",v.done+labComplete+bookComplete+guideComplete+mathComplete,v.total+labRows.length+bookRows.length+guideRows.length+mathRows.length,"Known course scope — not unreleased chapters","aurora")+
  '</div></div><div class="v2-panel v2-frost-card"><div class="v2-panel-heading"><h2>Answer breakdown</h2><span class="muted sm">All released graded questions</span></div>'+
  assessmentPie(allAnswerRows)+
  '<p class="muted sm">Unanswered means not attempted, not failed. New lessons will expand the total.</p></div></section>'+
  '<div class="v2-panels"><section class="v2-panel"><div class="v2-panel-heading"><h2>Progress by track</h2><span class="muted sm">Live status</span></div>'+trackCards+'</section><section class="v2-panel"><div class="v2-panel-heading"><h2>Knowledge checks</h2><span class="muted sm">Pilot evidence only</span></div>'+skills+'<p class="muted sm">Each bar counts correct answers in one existing lesson; it is not a CETa pass prediction.</p><h3 class="v2-lab-subheading">Interactive lab understanding</h3>'+labRows.map(x=>'<div class="v2-skill"><div class="v2-skill-label"><span>'+safe(x.title)+'</span><strong>'+x.correct+' / '+x.total+'</strong></div>'+bar(percent(x.correct,x.total))+'</div>').join('')+'<p class="muted sm">Virtual assessment progress; physical measurements have not yet been verified by this site.</p><h3 class="v2-lab-subheading">CETa Study Guide companion</h3>'+guideRows.map(x=>'<div class="v2-skill"><div class="v2-skill-label"><span>'+safe(x.title)+'</span><strong>'+x.correct+' / '+x.total+'</strong></div>'+bar(percent(x.correct,x.total))+'</div>').join('')+'<h3 class="v2-lab-subheading">Digital multimeter textbook companion</h3>'+bookRows.map(x=>'<div class="v2-skill"><div class="v2-skill-label"><span>'+safe(x.title)+'</span><strong>'+x.correct+' / '+x.total+'</strong></div>'+bar(percent(x.correct,x.total))+'</div>').join('')+'</section>'+
 '<section class="v2-panel"><div class="v2-panel-heading"><h2>Recent activity</h2><span class="muted sm">Latest saved activity</span></div>'+(recent||'<div class="v2-placeholder">Start a lesson to build your history.</div>')+'</section><section class="v2-panel"><div class="v2-panel-heading"><h2>What to work on next</h2></div><div class="v2-todo"><div><b>Interactive laboratory</b><p class="muted sm">The source-backed PreLab and DC 02 are ready as virtual companions, with simulations and graded checks.</p><button class="outline small-button" data-goto="subtrack" data-lesson="basic">Open the lab companions →</button></div><div><b>Basic Electric Circuits</b><p class="muted sm">Practice the five visual challenges in each published companion before trying the physical bench.</p><button class="outline small-button" data-goto="subtrack" data-lesson="basic">See lab plan →</button></div><div><b>Scan Inbox</b><p class="muted sm">No new pages needed to plan v2.0.</p><button class="outline small-button" data-goto="scan-inbox">Open inbox →</button></div></div></section></div></div>';
}
function trackView(t,c){
 const displayed=t.id==='ceta'?t.subtracks.filter(s=>s.id!=='core'):t.subtracks;
 const legacyFooter=t.id==='ceta'?'<div class="legacy-footnote"><span>Looking for the original CETa pilot?</span> <button type="button" class="legacy-minilink" data-goto="legacy">Legacy lessons <span aria-hidden="true">↗</span></button><small>Earlier lessons and any future archived material live here, with their progress preserved.</small></div>':'';
 return '<header class="v2-intro"><p class="v2-kicker">TRACK '+(catalog.indexOf(t)+1)+' OF 4</p><h2>'+safe(t.title)+'</h2><p>'+safe(t.tagline)+'</p></header>'+
 '<div class="v2-subcards">'+displayed.map(subcard).join('')+'</div>'+legacyFooter;
}
function legacyView(c){
 const archived=c.lessons.filter(l=>l.legacy===true||/^L\d{2,}$/.test(l.id));
 const done=archived.filter(c.hasPassed).length;
 return '<header class="legacy-heading"><p class="v2-kicker">CETa / EARLIER MATERIAL</p><h2>Legacy Lessons</h2><p class="muted">The original foundations course is available here whenever you want to revisit it. Existing lesson IDs, answers and review schedules are unchanged.</p>'+
 '<button class="legacy-back" type="button" data-goto="ceta">← Back to Exam Preparation</button></header>'+
 '<section class="v2-panel legacy-listing"><div class="v2-panel-heading"><h2>Archived lesson library</h2><span class="muted sm">'+done+' / '+archived.length+' completed</span></div>'+bar(percent(done,archived.length))+
 '<div class="legacy-list">'+(c.legacyRows||c.coreRows||'<p class="muted">No archived lesson cards are available yet.</p>')+'</div></section>'+
 '<p class="legacy-archive-note">Future retired lessons can join this library without replacing the material already here.</p>';
}
function guideView(c){
 const units=catalogSubtrack('guide').units;
 const first=(c.cetaLessons||[])[0],passed=first?c.hasPassed(first):false,st=first?(c.progress[first.id]||{}):{},answers=st.answers||{};
 const graded=Object.values(answers).filter(x=>typeof x.correct==="boolean").length;
 const launch=first?'<section class="guide-feature"><div class="guide-feature-top"><span class="v2-kicker">NEW / UNIT 2 · CHAPTER 3 · P. 16</span><span class="v2-pill">'+(passed?'Mastered':'Available now')+'</span></div><h3>'+safe(first.title)+'</h3>'+
 '<p>'+safe(first.description)+'</p><div class="guide-feature-numbers"><div><strong>05</strong><span>Guided concept simulations</span></div><div><strong>10</strong><span>Graded questions</span></div><div><strong>'+graded+'/10</strong><span>Answered on this device</span></div></div>'+
 '<p class="muted sm">Based on the chapter title and its listed powers-of-ten topic in your table of contents. The chapter pages themselves have not been reviewed; this is original teaching, not a chapter summary.</p>'+
 '<button class="primary" data-goto="lesson" data-lesson="'+safe(first.id)+'">'+(passed?'Revisit':'Start')+' foundation lesson →</button></section>':'';
 const tree='<div class="v2-unitlist">'+units.map(u=>'<details class="v2-unit" '+(u.id==='G02'?'open':'')+'><summary><strong>'+safe(u.title)+'</strong><span>'+u.chapters.length+' chapters · '+(u.id==='G02'?'one topic live':'indexed')+'</span></summary>'+u.chapters.map(ch=>'<div class="v2-chapter"><b>Chapter '+safe(ch[0])+'</b><span>'+safe(ch[1])+'</span><small>p. '+ch[2]+'</small></div>').join('')+'</details>').join('')+'</div>';
 return launch+'<div class="guide-index-intro"><h3>Study guide chapter map</h3><p class="muted">9 units and 22 chapter starting pages are verified from the contents scan. All chapters remain indexed; only the first Chapter 3 topic has a published companion lesson. Other chapter content will be developed from original teaching and additional source context when appropriate.</p></div>'+tree;
}
function basicView(c){const labs=c.labLessons||[];
 const launches=labs.map((l,i)=>{const passed=c.hasPassed(l),ready=i===0||c.hasPassed(labs[0]);return '<div class="v2-lab-lesson"><div><span class="v2-pill">'+(passed?'Completed':ready?'Available':'Prerequisite: PreLab')+'</span><h3>'+safe(l.title)+'</h3><p class="muted sm">'+safe(l.description)+'</p><small class="muted">10 graded questions · '+l.minutes+' min · original source-backed explanations</small></div><button class="'+(ready?'primary':'outline')+' small-button" '+(ready?'data-goto="lesson" data-lesson="'+safe(l.id)+'"':'disabled')+'>'+(passed?'Revisit →':ready?'Start interactive lesson →':'Locked')+'</button></div>'}).join('');
 return '<div class="v2-lab-intro"><h3>Interactive companion lessons</h3><p class="muted sm">These lessons use your scanned PreLab and DC 02 to teach predictions, measurements, simulated faults and safe meter connections. Completing a virtual lesson is not the same as completing the physical experiment.</p>'+launches+'</div><h3 class="v2-index-title">Manual experiment index</h3><p class="muted sm">Only PreLab and DC 02 have detailed scanned source pages; other experiments are indexed by title.</p><div class="v2-unitlist">'+catalogSubtrack('basic').units.map(u=>'<div class="v2-experiment"><strong>'+safe(u.id)+' · '+safe(u.title)+'</strong><span>'+safe(u.source==='source-reviewed'?'Source reviewed':'Indexed only')+' · p. '+u.page+'</span></div>').join('')+'</div>';
}
function geierView(c){
 const published=c.bookLessons||[];
 const planned=[
  ["BDMM-03","AC voltage — RMS versus peak"],
  ["BDMM-04","Resistance and continuity — power off"],
  ["BDMM-05","Current measurement — series only"],
  ["BDMM-06","Diode-test reasoning"],
  ["BDMM-07","Silent indicator — troubleshooting capstone"]
 ];
 const publishedHtml=published.map((l,i)=>{
  const ready=i===0||c.hasPassed(published[0]),passed=c.hasPassed(l),state=c.progress[l.id]||{},a=state.answers||{};
  const answered=Object.values(a).filter(v=>typeof v.correct==="boolean").length;
  return '<article class="dmm-lesson-entry"><div class="dmm-lesson-num">0'+(i+1)+'</div><div class="dmm-lesson-main"><span class="v2-pill">'+(passed?'Mastered':ready?'Ready to study':'Previous lesson required')+'</span>'+
  '<h3>'+safe(l.title)+'</h3><p class="muted sm">'+safe(l.description)+'</p><span class="muted sm">'+safe(l.module)+' · '+l.minutes+' minutes · '+answered+'/10 graded</span></div>'+
  '<button class="'+(ready?'primary':'outline')+' small-button" '+(ready?'data-goto="lesson" data-lesson="'+safe(l.id)+'"':'disabled')+'>'+(passed?'Revisit →':ready?'Start lesson →':'Locked')+'</button></article>';
 }).join('');
 return '<section class="dmm-introduction"><div class="dmm-book-kicker">BOOK 01 / CHAPTER 6</div><h3>Digital multimeter study companion</h3>'+
 '<p>Start by reading a meter intelligently, then practice measuring voltage between two points. Each lesson separates small concepts, five interactive visual challenges, and ten scored checks.</p>'+
 '<p class="muted sm"><b>Book:</b> Michael Jay Geier, third edition, Chapter 6. Lessons 01–02 draw on pp. 97–99. The source is an orientation reference; the explanations and diagrams here are original.</p>'+
 '<div class="dmm-safety">Virtual, low-voltage examples only. No live mains, powered resistance tests, or unverified ground connections.</div></section>'+
 '<section class="dmm-lessons"><h3 class="v2-index-title">Available now</h3>'+publishedHtml+'</section>'+
 '<div class="dmm-upcoming"><h3>Later in this chapter</h3><p class="muted sm">The following are written lesson plans, not yet released activities or completed progress.</p>'+
 planned.map(([id,title])=>'<div class="dmm-upcoming-row"><strong>'+id+'</strong><span>'+safe(title)+'</span><span class="v2-pill">Planned</span></div>').join('')+'</div>';
}

function subView(id,c){const s=catalogSubtrack(id);if(!s)return '<div class="v2-panel">Unknown sub-track.</div>';if(id==='core')return legacyView(c);
 let body=(id==='guide'?guideView(c):id==='basic'?basicView(c):id==='geier'?geierView(c):s.units.length?'<div class="v2-unitlist">'+s.units.map(u=>'<div class="v2-experiment"><strong>'+safe(u.title)+'</strong><span>'+safe(u.summary||'Reference indexed')+'</span></div>').join('')+'</div>':'<div class="v2-placeholder">No lessons are due here. This sub-track is '+safe(labels[s.status]||s.status).toLowerCase()+'.</div>');
 return '<header class="v2-intro"><p class="v2-kicker">'+safe(s.trackTitle)+'</p><h2>'+safe(s.title)+'</h2>'+tag(s.status)+'<p>'+safe(s.summary)+'</p></header><section class="v2-panel">'+body+'</section>';
}
export function v2Page(name,c,subId){
 if(name==='legacy'||name==='curriculum')return legacyView(c);
 if(name==='math')return renderMathTrack(c);
 if(name==='subtrack')return subView(subId,c);
 if(name==='scan-inbox')return '<header class="v2-intro"><p class="v2-kicker">SOURCE LIBRARY</p><h2>Scan Inbox</h2><p>Just-in-time requests will appear when a chosen lesson needs specific source pages.</p></header><section class="v2-panel"><h2>No scans required right now</h2><p class="muted">Your CETa guide contents, Geier DMM section and Basic Electric Circuits PreLab/DC 02 are reviewed. Analog is paused. Private uploads and automatic scan requests are scheduled for a later implementation phase; this is a read-only preview.</p></section>';
 const track=catalog.find(t=>t.id===name);
 return track?trackView(track,c):v2Dashboard(c);
}
