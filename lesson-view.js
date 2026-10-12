import {lessonTabs, renderLessonTabs, renderActivitySelector, renderLearnSteps, lessonActivities} from "./lesson-tabs.js";
import {lessonOverview} from "./lesson-overviews.js";
// Five focused stages. Only one quiz question and one interactive challenge are rendered at a time.
const e=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function quizPanel(ctx){
 const {lesson,answers,quizIndex,questionHtml,score,passed}=ctx;
 const page=Math.max(0,Math.min(lesson.questions.length-1,quizIndex));
 const jump=lesson.questions.map((q,i)=>{
  const v=answers[q.id],valid=typeof v?.correct==="boolean",status=v?.pending?" pending":valid?(v.correct?" correct":" incorrect"):"";
  return '<button type="button" class="quiz-step'+status+(i===page?' current':'')+'" data-quiz-index="'+i+'" aria-label="Question '+(i+1)+': '+(valid?(v.correct?'correct':'needs review'):'not graded')+'" aria-current="'+(i===page?'step':'false')+'">'+(i+1)+'</button>';
 }).join("");
 return '<section class="lesson-quiz"><div class="lesson-subtitle"><div><span class="v2-kicker">CHECK YOUR UNDERSTANDING</span><h3>One question at a time</h3></div><span class="quiz-count">'+score.correct+' / '+score.total+' correct</span></div>'+
 '<p class="muted">Questions are graded one at a time. You can revisit any answer without losing earlier results. Written explanations use a self-check rubric.</p>'+
 '<div class="quiz-step-list" role="group" aria-label="Choose a question">'+jump+'</div>'+
 questionHtml(lesson,lesson.questions[page],page)+
 '<div class="lesson-step-footer"><button class="outline small-button" data-quiz-index="'+Math.max(0,page-1)+'" '+(page===0?'disabled':'')+'>← Previous</button><span class="muted sm">Question '+(page+1)+' of '+lesson.questions.length+'</span>'+
 '<button class="primary small-button" '+(page===lesson.questions.length-1?'data-lesson-tab="review"':'data-quiz-index="'+(page+1)+'"')+'>'+(page===lesson.questions.length-1?'View results →':'Next question →')+'</button></div>'+
 (passed?'<p class="lesson-success">All completion requirements have been met. Visit Review for your next lesson.</p>':'')+'</section>';
}
function reviewPanel(ctx){
 const {lesson,answers,passed,score,nextLesson,isPilot}=ctx;
 const attempted=Object.values(answers).filter(a=>typeof a?.correct==="boolean").length;
 const due=lesson.questions.filter(q=>typeof answers[q.id]?.correct==="boolean" && answers[q.id].reviewDue<=Date.now()).length;
 return '<section class="lesson-summary"><span class="v2-kicker">YOUR LEARNING RECORD</span><h3>'+(passed?'Lesson mastered':'Your progress so far')+'</h3>'+
 '<div class="lesson-summary-stats"><div><strong>'+score.correct+' / '+score.total+'</strong><span>Correct checks</span></div><div><strong>'+attempted+' / '+score.total+'</strong><span>Graded checks</span></div><div><strong>'+due+'</strong><span>Due for review</span></div></div>'+
 '<p class="muted">Pass when all questions have been graded, at least '+Math.ceil(.8*score.total)+' are correct, and every safety-critical check is correct. This lesson does not certify physical measurement skills.</p>'+
 '<div class="lesson-review-items">'+lesson.questions.map((q,i)=>{
  const a=answers[q.id];const valid=typeof a?.correct==="boolean";const label=a?.pending?'Self-check pending':valid?(a.correct?'Understood':'Needs another attempt'):'Not yet answered';
  return '<button type="button" class="lesson-review-item" data-quiz-jump="'+i+'"><span><b>'+e("Question "+(i+1))+'</b> '+e(q.prompt)+'</span><small>'+label+' →</small></button>';
 }).join("")+'</div><div class="actions"><button class="outline" data-lesson-tab="quiz">Return to quiz</button>'+
 (passed&&nextLesson?'<button class="primary" data-goto="lesson" data-lesson="'+e(nextLesson.id)+'">Next lesson →</button>':'')+
 '<button class="outline" data-goto="'+(lesson.subtrack==='math'?'math':isPilot?'legacy':'subtrack')+'" '+(lesson.subtrack==='math'||isPilot?'':'data-lesson="'+e(lesson.subtrack||'basic')+'"')+'>'+(lesson.subtrack==='math'?'Back to Mathematics Companion':isPilot?'Legacy lesson library':lesson.subtrack==='geier'?'Back to DMM companion':lesson.subtrack==='guide'?'Back to CETa Study Guide':'Back to lab manual')+'</button></div></section>';
}
export function tabbedLesson(ctx) {
 const {lesson,isPilot,idx,score,passed,tab,activityIndex}=ctx;
 const active=lessonTabs.some(t=>t.id===tab)?tab:"overview";
 const answers=ctx.answers||{};
 const graded=Object.values(answers).filter(v=>typeof v?.correct==="boolean").length;
 const sections=lessonActivities(lesson).length;
 let contents="";
 if(active==="overview"){
  contents=lessonOverview(lesson);
 } else if (active==="learn"){
  contents='<section class="panel reading lesson-reading"><p class="v2-kicker">THE CONCEPTS</p>'+renderLearnSteps(lesson,ctx.learnIndex||0)+(isPilot?'<p class="muted sm">Pilot Unit 1 is self-contained. Textbook-specific study is in the companion sub-tracks.</p>':'')+'</section>'+
  '<div class="lesson-step-footer"><span class="muted sm">Read at your own pace</span><button class="primary" data-lesson-tab="interact">Try the interactive example →</button></div>';
 } else if (active==="interact"){
  contents=renderActivitySelector(lesson,activityIndex);
 } else if (active==="quiz"){
  contents=quizPanel(ctx);
 } else {
  contents=reviewPanel(ctx);
 }
 return '<div class="learning learning-tabbed"><div class="bread">'+e(lesson.module)+' / '+(isPilot?'LEGACY LESSON '+(idx+1)+' OF 5':lesson.subtrack==='geier'?'TEXTBOOK · DMM COMPANION':lesson.subtrack==='guide'?'CETA · STUDY GUIDE COMPANION':lesson.subtrack==='math'?'CROSS-TRACK MATHEMATICS':'EIM LAB COMPANION')+'</div>'+
 '<div class="lesson-header"><h2>'+e(lesson.title)+'</h2><p class="muted">'+e(lesson.description)+'</p><span class="chip">About '+lesson.minutes+' minutes · '+graded+'/'+score.total+' graded</span></div>'+
 renderLessonTabs(active,graded,score.total)+
 '<div class="lesson-stage" id="lesson-panel" role="tabpanel" tabindex="-1" aria-labelledby="lesson-tab-'+active+'">'+contents+'</div></div>';
}
