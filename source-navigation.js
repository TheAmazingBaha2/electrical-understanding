import {lessonCatalog,catalogSection} from './lesson-catalog.js';
import {studySections,studyInventory,sourceIndex,learningProgress,chapterLabel,sectionView,lessonReferencePages} from './learning-structure.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const openLesson=l=>'data-goto="'+(l.generated?'generated-lesson':'lesson')+'" data-lesson="'+esc(l.id)+'"';
function available(l,c){if(l.generated||l.independent)return true;return c.sourceIsAvailable?.(l)??(l.id==='EIM-BEC-DC02'?Boolean(c.hasPassed?.((c.labLessons||[])[0])):l.id==='BDMM-02'?Boolean(c.hasPassed?.((c.bookLessons||[])[0])):true);}
export function progressPie(p,label,small=false){
 const a=p.total?p.correct/p.total*360:0,b=p.total?(p.correct+p.incorrect)/p.total*360:0;
 return '<span class="chapter-pie'+(small?' lesson-pie':'')+'" role="img" aria-label="'+esc(label)+': '+p.correct+' correct, '+p.incorrect+' needs review, '+p.unanswered+' unanswered out of '+p.total+' checks" style="--correct-end:'+a+'deg;--retry-end:'+b+'deg"><span><b>'+p.percent+'%</b><small>correct</small></span></span>';
}
function progressBar(p,label){
 const correct=p.total?p.correct/p.total*100:0,retry=p.total?p.incorrect/p.total*100:0;
 return '<div class="lesson-progress-bar" role="progressbar" aria-label="'+esc(label)+' correct checks" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+p.percent+'" aria-valuetext="'+p.correct+' correct, '+p.incorrect+' needs review, '+p.unanswered+' unanswered out of '+p.total+' checks"><span class="lesson-progress-correct" style="width:'+correct+'%"></span><span class="lesson-progress-retry" style="width:'+retry+'%"></span></div>';
}
function lessonRows(lessons,c){
 return lessons.map(l=>{const p=learningProgress([l],c,{includePractice:true}),ready=available(l,c);
 const copy='<div class="chapter-lesson-copy">'+(l.chapterSummary?'<span class="v2-kicker">CHAPTER WRAP-UP</span>':l.workshop?'<span class="v2-kicker">WORKSHOP · SELF-PACED</span>':'')+'<h4>'+esc(l.title)+'</h4><p>'+esc(l.description)+'</p><p class="lesson-page-reference"><strong>Reference pages:</strong> '+esc(lessonReferencePages(l))+'</p>'+progressBar(p,l.title)+'<small>'+p.correct+' / '+p.total+' correct · '+(p.total-p.unanswered)+' attempted'+(p.mastered?(l.studyModule?' · Completed':' · Mastered'):'')+'</small></div>';
 const action='<button type="button" class="'+(p.mastered?'outline':'primary')+' small-button" '+(ready?openLesson(l):'disabled')+'>'+(p.mastered?'Review':ready?(l.workshop?'Open workshop':'Study'):'Previous lesson required')+' →</button>';
 return '<article class="chapter-lesson" data-content-lesson="'+esc(l.id)+'"><span class="chapter-lesson-number">'+esc(l.curriculum?.order?String(l.curriculum.order).padStart(2,'0'):'•')+'</span>'+copy+action+(c.additionCards?.(l.id,'catalog')||'')+'</article>';
 }).join('');
}
function chapterMenu(source,ch,c,selected){
 const key=source.id+':'+ch.id;
 return '<details class="content-chapter" data-disclosure="contents:'+esc(key)+'" '+(selected===key?'open':'')+'><summary><span class="chapter-number">'+esc(chapterLabel(ch))+'</span><span class="chapter-menu-title">'+esc(ch.title)+'</span><small>'+(ch.lessons.length?ch.lessons.length+' lessons':ch.page?'p. '+esc(ch.page)+' · No lessons yet':'No lessons yet')+'</small><span class="disclosure-chevron" aria-hidden="true">⌄</span></summary><div class="chapter-body">'+(ch.coverage?'<p class="chapter-coverage">'+esc(ch.coverage)+'</p>':'')+(ch.lessons.length?lessonRows(ch.lessons,c):'<p class="chapter-empty">Listed from the supplied contents. Lessons will appear here when they are ready.</p>')+'</div></details>';
}
export function renderSourceSection(view,c={},selected=''){
 const section=studySections.find(s=>s.id===(view==='textbooks'?'lessons':view)),sources=section.section==='lessons'?lessonCatalog(studyInventory(c)):sourceIndex(c).filter(s=>s.section===section.section);
 if(section.section==='lessons'&&selected&&!selected.includes('electricity-foundations:')&&!selected.includes('practical-electronics:')){const match=studyInventory(c).find(l=>l.curriculum.source_id+':'+l.curriculum.chapter_id===selected);if(match){const t=lessonCatalog([match])[0];selected=t.id+':'+t.chapters[0].id;}}
 return '<div class="source-page"><header class="source-heading"><p class="v2-kicker">YOUR STUDY LIBRARY</p><h2>'+esc(section.title)+'</h2><p>'+esc(section.description)+'</p></header>'+(section.section==='lessons'?(c.studyContentStatus?.()||''):'')+sources.map(s=>'<section class="source-book" data-source="'+esc(s.id)+'"><header class="source-book-heading"><div><p class="v2-kicker">'+(s.section==='lessons'?'LESSON SERIES':s.section==='exam'?'CERTIFICATION':s.section==='labs'?'LAB MANUAL':'BOOK')+'</p><h3>'+esc(s.title)+'</h3>'+(s.note?'<p class="muted sm">'+esc(s.note)+'</p>':'')+'</div><span class="source-count">'+s.chapters.length+' '+(s.section==='lessons'?'topic groups':s.section==='labs'?'chapters / experiments':'chapters')+' · '+s.chapters.reduce((n,ch)=>n+ch.lessons.length,0)+' lessons</span></header><div class="source-chapters">'+(s.chapters.length?s.chapters.map(ch=>chapterMenu(s,ch,c,selected)).join(''):'<p class="chapter-empty">The chapter list will appear after its table of contents is supplied.</p>')+'</div></section>').join('')+(section.section==='lessons'?(c.optionalAdditionHomes?.()||'')+(c.additionReadingLists?.()||''):'')+'</div>';
}
export function renderMathPractice(c={}){
 const lessons=studyInventory(c).filter(l=>l.curriculum.section==='math');
 return '<header class="source-heading"><p class="v2-kicker">KEEP THE FOUNDATIONS FRESH</p><h2>Math Practice</h2><p>Periodic refreshers on the mathematics behind electricity. These stand on their own, without requiring a book.</p></header><section class="source-book">'+(lessons.length?lessonRows(lessons,c):'<div class="chapter-empty"><h3>A place for your math refreshers</h3><p>Chapter 3’s full lessons are in Exam Prep → Associate CET. Refresher lessons will appear here as we add them.</p><button class="outline small-button" data-goto="ceta" data-lesson="associate-cet:3">Open Associate CET · Chapter 3 →</button></div>')+'</section>'+(c.additionContextCards?.('math')||'');
}
export function renderSavedReinforcement(c={}){
 const lessons=studyInventory(c).filter(l=>l.curriculum.section==='reviews');
 return lessons.length?'<section class="source-book"><header class="source-book-heading"><div><p class="v2-kicker">PREVIOUSLY PUBLISHED PRACTICE</p><h3>Saved reinforcement lessons</h3><p>These existing lessons remain available while the broader review format is decided.</p></div></header><div class="source-chapters">'+lessonRows(lessons,c)+'</div></section>':'';
}
const legend='<span class="pie-legend"><i class="legend-correct"></i>Correct <i class="legend-retry"></i>Needs review <i class="legend-unanswered"></i>Unanswered</span>';
function collapseControl(id,label){
 return '<button type="button" class="dashboard-expand" data-toggle-panel="'+esc(id)+'" data-panel-label="'+esc(label)+'" aria-controls="'+esc(id)+'" aria-expanded="true" aria-label="Collapse '+esc(label)+'"><span class="disclosure-chevron" aria-hidden="true">⌄</span></button>';
}
function dashboardBook(s,c){
 return '<section class="dashboard-book source-book" data-dashboard-source="'+esc(s.id)+'"><div class="dashboard-split-heading"><button type="button" class="source-book-heading dashboard-book-link" data-goto="'+sectionView(s.section)+'" aria-label="Open contents: '+esc(s.book)+'"><span class="dashboard-book-copy"><strong>'+esc(s.book)+'</strong><span>'+s.chapters.length+' chapter'+(s.chapters.length===1?'':'s')+' with lessons</span></span></button>'+collapseControl('dashboard-book-panel-'+s.id,s.book)+'</div><div class="dashboard-book-body" id="'+esc('dashboard-book-panel-'+s.id)+'"><div class="dashboard-chapters">'+s.chapters.map(ch=>{
 const p=learningProgress(ch.lessons,c);
 return '<details class="dashboard-chapter" data-disclosure="dashboard:'+esc(s.id+':'+ch.id)+'"><summary><span class="dashboard-chapter-copy"><small>'+esc(chapterLabel(ch))+'</small><strong>'+esc(ch.title)+'</strong><span>'+p.mastered+' / '+p.lessons+(ch.lessons.every(l=>l.studyModule)?' lessons completed · ':' lessons mastered · ')+p.total+' checks</span></span><span class="disclosure-chevron" aria-hidden="true">⌄</span></summary><div class="dashboard-lesson-list"><div class="dashboard-chapter-progress">'+progressPie(p,chapterLabel(ch))+'<div>'+legend+(ch.coverage?'<p class="dashboard-coverage">'+esc(ch.coverage)+'</p>':'')+'</div></div>'+lessonRows(ch.lessons,c)+'</div></details>';
 }).join('')+'</div></div></section>';
}
export function renderChapterDashboard(c={}){
 const sources=[...sourceIndex(c).filter(s=>s.section!=='textbooks'&&s.section!=='lessons'),...lessonCatalog(studyInventory(c))].map(s=>({...s,chapters:s.chapters.filter(ch=>ch.lessons.some(l=>l.curriculum.dashboard!==false)).map(ch=>({...ch,lessons:ch.lessons.filter(l=>l.curriculum.dashboard!==false)}))})).filter(s=>s.chapters.length);
 return '<div class="chapter-dashboard"><header class="dashboard-welcome"><h2>Your learning dashboard</h2></header><div class="dashboard-categories">'+studySections.map(section=>{
 const books=sources.filter(s=>s.section===section.section);
 return '<section class="dashboard-category" data-dashboard-category="'+section.id+'"><div class="dashboard-split-heading"><button type="button" class="dashboard-category-heading" data-goto="'+section.id+'"><span><strong>'+esc(section.title)+'</strong><span>'+esc(section.description)+'</span></span></button>'+collapseControl('dashboard-category-panel-'+section.id,section.title)+'</div><div class="dashboard-books" id="'+esc('dashboard-category-panel-'+section.id)+'">'+(books.length?books.map(s=>dashboardBook(s,c)).join(''):'<p class="dashboard-category-empty">TBD · No published graded lessons yet.</p>')+(section.id==='lessons'?(c.optionalAdditionHomes?.()||'')+(c.additionReadingLists?.()||''):'')+'</div></section>';
 }).join('')+'</div>'+(c.banner||'')+'</div>';
}
