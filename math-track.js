// One continuously growing math track; NO subtracks. Each lesson unlocks with the
// source topic it supports. It never gates progress in the other three tracks.
import {mathLessons,mathAvailability} from './math-lessons.js';
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export function renderMathTrack(ctx={}){
 const sourceLessons=ctx.sourceLessons||[];
 const available=ctx.mathIsAvailable||(()=>false);
 const prog=ctx.progress||{};
 const passed=ctx.hasPassed||(()=>false);
 const open=mathLessons.filter(available),completed=mathLessons.filter(l=>available(l)&&passed(l)).length;
 return '<div class="math-track"><header class="v2-intro"><p class="v2-kicker">TRACK 4 · CROSS-TRACK COMPANION</p>'+
  '<h2>Mathematics Companion</h2><p>Understand the equations behind the electrical concepts you are learning, right when you encounter them. No subtracks, no separate math prerequisite ladder, and no pressure to memorize formulas before their meaning makes sense.</p></header>'+
  '<section class="math-track-overview panel"><div><p class="v2-kicker">CURRENT MATH PATH</p><h3>'+completed+' / '+open.length+' reachable companions mastered</h3>'+
  '<p class="muted sm">Your original electronics lessons control which math topics become available. Completing a math lesson never blocks CETa, textbooks or laboratory work.</p></div>'+
  '<div class="math-track-meters"><span>'+open.length+' ready</span><span>'+completed+' mastered</span><span>'+(mathLessons.length-open.length)+' upcoming</span></div></section>'+
  '<div class="math-track-list">'+mathLessons.map((lesson,i)=>{
   const unlocked=available(lesson),done=unlocked&&passed(lesson);
   const s=prog[lesson.id]||{},a=s.answers||{};
   const correct=lesson.questions.filter(q=>a[q.id]?.correct===true).length;
   const answered=lesson.questions.filter(q=>typeof a[q.id]?.correct==='boolean').length;
   const linked=lesson.sourceLessonIds.map(id=>sourceLessons.find(l=>l.id===id)).filter(Boolean);
   const links=linked.map(l=>'<button type="button" class="math-source-link" data-goto="lesson" data-lesson="'+esc(l.id)+'" '+(!ctx.sourceIsAvailable?.(l)?'disabled':'')+'>'+esc(l.module?.split('·')[0]||'Lesson')+' · '+esc(l.title)+' →</button>').join('');
   return '<article class="math-topic-card'+(unlocked?'':' locked')+'"><div class="math-topic-head"><span class="v2-kicker">MATH '+String(i+1).padStart(2,'0')+'</span>'+
    '<span class="v2-pill">'+(done?'Mastered':unlocked?'Available':'Waiting for a linked source lesson')+'</span></div>'+
    '<h3>'+esc(lesson.title)+'</h3><p>'+esc(lesson.description)+'</p>'+
    '<div class="math-topic-metadata"><span>'+lesson.minutes+' min</span><span>'+lesson.questions.length+' knowledge checks</span>'+
    (unlocked?'<span>'+correct+' / '+lesson.questions.length+' correct · '+answered+' attempted</span>':'<span>Unlocks automatically with the linked topic</span>')+'</div>'+
    '<div class="math-topic-links"><strong>Connected electronics lessons</strong>'+links+'</div>'+
    '<button type="button" class="'+(done?'outline':'primary')+' small-button" data-goto="lesson" data-lesson="'+esc(lesson.id)+'" '+(unlocked?'':'disabled')+'>'+
    (done?'Review this math':unlocked?'Learn the math →':'Not reached yet')+'</button></article>';
  }).join('')+'</div>'+
  '<section class="panel"><h3>How this track grows</h3><p>As additional CETa chapters, textbooks and lab companions are released, the math track can gain new companions connected by permanent lesson IDs. Existing math answers remain stored separately. New mathematical content is reviewed and published deliberately, not invented on a timer.</p></section></div>';
}
