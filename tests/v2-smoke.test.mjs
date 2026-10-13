import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {lessons} from '../lessons.js';
import {labLessons} from '../lab-lessons.js';
import {bookLessons} from '../book-lessons.js';
import {mathLessons} from '../math-lessons.js';
import {legacyReason} from '../legacy-groups.js';
import {cetaLessons} from '../ceta-lessons.js';
import {cetaWidgetKinds} from '../ceta-widgets.js';
import {dmmWidgetKinds} from '../dmm-widgets.js';
import {catalog,catalogSubtrack,cetaGuideUnits,eimBasicExperiments} from '../course-catalog.js';
import {v2Dashboard,v2Page} from '../v2-panels.js';
import {lessonActivities,learningContent,renderLessonTabs,renderLearnSteps} from '../lesson-tabs.js';
import {tabbedLesson} from '../lesson-view.js';
import {lessonOverview} from '../lesson-overviews.js';

function context(progress={}) {
 return {
  lessons, labLessons, bookLessons, cetaLessons, activeCetaLessons:[], activeMathLessons:[], archivedPilotLessons:lessons, archivedUnreferencedLessons:[...cetaLessons,...mathLessons], legacyReason, progress, reviews:0, banner:'',
  coreRows:'<p>Existing pilot cards</p>',
  hasPassed:l=>Boolean(progress[l.id]?.complete),
  unlocked:i=>i===0||Boolean(progress[lessons[i-1].id]?.complete)
 };
}
test('the five original pilot lesson IDs and question data remain intact',()=>{
 assert.deepEqual(lessons.map(l=>l.id),['L01','L02','L03','L04','L05']);
 assert.ok(lessons.every(l=>l.questions.length>=5));
});
test('four tracks have three source subtrack families and a flat math companion',()=>{
 assert.deepEqual(catalog.map(t=>t.id),['ceta','textbooks','labs','math']);
 assert.deepEqual(catalog.find(t=>t.id==='math').subtracks,[]);
 const ids=catalog.flatMap(t=>t.subtracks.map(s=>s.id));
 assert.equal(new Set(ids).size,ids.length);
 assert.ok(catalogSubtrack('guide'));assert.equal(catalog[0].subtracks.length,1);assert.equal(catalog[1].subtracks.length,1);
});
test('guide contents agree with the supplied chapter outline',()=>{
 assert.equal(cetaGuideUnits.length,9);
 assert.equal(cetaGuideUnits.flatMap(u=>u.chapters).length,22);
 assert.deepEqual(cetaGuideUnits[0].chapters[0],['1','CET Program Description',1]);
 assert.deepEqual(cetaGuideUnits[8].chapters.at(-1),['22','Technical Writing',188]);
});
test('EIM basic catalog has the PreLab plus nineteen numbered experiments',()=>{
 assert.equal(eimBasicExperiments.length,20);
 assert.equal(eimBasicExperiments.filter(e=>e[3]==='source-reviewed').length,2);
 assert.equal(eimBasicExperiments.find(e=>e[0]==='DC 02')[2],21);
});
test('analog stays paused while FPGA and RP2040 wait',()=>{
 assert.equal(catalogSubtrack('analog').status,'paused');
 assert.equal(catalogSubtrack('fpga').status,'waiting');
 assert.equal(catalogSubtrack('rp2040').status,'waiting');
});
test('empty progress produces true zeros, not imaginary completion',()=>{
 const html=v2Dashboard(context());
 assert.match(html,/Your chapter progress will appear here/);assert.doesNotMatch(html,/role="img"/);
});
test('persisted lesson IDs count in the dashboard without renaming records',()=>{
 const p={L01:{complete:true,answers:{u1:{correct:true}},updatedAt:1760000000000}};
 const html=v2Dashboard(context(p));
 assert.doesNotMatch(html,/L01/);assert.equal(p.L01.answers.u1.correct,true);assert.match(v2Page('legacy',context(p)),/1 \/ 5/);
});
test('guide, lab, catalog and Scan Inbox views are renderable',()=>{
 const c=context();
 for(const name of ['ceta','textbooks','labs','math','scan-inbox','legacy'])assert.ok(v2Page(name,c).length>150);
 assert.match(v2Page('subtrack',c,'guide'),/Chapter 22/);
 assert.match(v2Page('subtrack',c,'basic'),/DC 02/);
 assert.match(v2Page('subtrack',c,'analog'),/Paused/);
});
test('navigation and script imports are wired up',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
 for(const name of ['ceta','textbooks','labs','math','reviews','account'])assert.ok(html.includes('data-view="'+name+'"'));
 assert.ok(app.includes("from './v2-panels.js'"));
 assert.ok(app.includes('v2Page(view,v2Context(),activeLesson)'));
 assert.ok(!app.includes('Find this in your books'));
});
test('colors and site icon match approved branding',()=>{
 const icon=readFileSync(new URL('../icon.svg',import.meta.url),'utf8');
 const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
 for(const color of ['#FFF0A6','#FFD84D','#F5AF27'])assert.ok(icon.includes(color));
 for(const color of ['#83CFFF','#35E0F2'])assert.ok(css.includes(color));
});

test('each source-backed lab has five concept interactions and ten assessed questions',()=>{
 assert.equal(labLessons.length,2);
 for(const l of labLessons){
  assert.equal(l.questions.length,10);
  assert.ok((l.html.match(/data-lab-kind=/g)||[]).length>=5);
  assert.ok(l.questions.some(q=>q.safety===true));
  assert.ok(l.id.startsWith('EIM-BEC-'));
 }
});
test('PreLab is available first and DC 02 unlocks after its prerequisite',()=>{
 const c=context();
 let html=v2Page('subtrack',c,'basic');
 assert.match(html,/data-lesson="EIM-BEC-PRELAB"/);
 assert.doesNotMatch(html,/data-lesson="EIM-BEC-DC02"/);
 c.progress['EIM-BEC-PRELAB']={complete:true};
 html=v2Page('subtrack',c,'basic');
 assert.match(html,/data-lesson="EIM-BEC-DC02"/);
});
test('lab progress is counted separately from Pilot Unit 1',()=>{
 const c=context({'EIM-BEC-PRELAB':{complete:true}});
 const html=v2Dashboard(c);
 assert.doesNotMatch(html,/chapter-pie/);assert.match(v2Page('labs',c),/Mastered/);
});

test('course paths expands without leaving the dashboard and exposes all sub-tracks',()=>{
 const html=v2Dashboard(context());
 assert.match(html,/data-goto="ceta"/);assert.match(html,/data-goto="account"/);assert.doesNotMatch(html,/course-paths-menu/);
});
test('lab prose and five visual activities are in separate focused lesson views',()=>{
 const lesson=labLessons[0],activities=lessonActivities(lesson);
 assert.equal(activities.length,5);
 assert.ok(!learningContent(lesson).includes('class="lab-widget"'));
 const ctx={lesson,idx:-1,isPilot:false,score:{correct:0,total:10},passed:false,tab:'interact',activityIndex:0,quizIndex:0,answers:{},questionHtml:()=>'<article class="quiz-card"></article>'};
 const interactive=tabbedLesson(ctx);
 assert.equal((interactive.match(/data-lab-kind=/g)||[]).length,1);
 assert.match(interactive,/role="tablist"/);
 assert.equal((renderLessonTabs('quiz',0,10).match(/role="tab"/g)||[]).length,5);
 const assessment=tabbedLesson({...ctx,tab:'quiz'});
 assert.equal((assessment.match(/class="quiz-card"/g)||[]).length,1);
 assert.equal((assessment.match(/class="quiz-step/g)||[]).length,11); // ten steps plus list class
});
test('dashboard pie and track rings use real published course denominators',()=>{
 const html=v2Dashboard(context({'EIM-BEC-PRELAB':{complete:true}}));
 assert.doesNotMatch(html,/v2-frost-ring|v2-evidence-pie|v2-meter/);
});

test('source-backed Learn sections display a single teaching concept at a time',()=>{
 const lesson=labLessons[0];
 const first=renderLearnSteps(lesson,0),third=renderLearnSteps(lesson,2);
 assert.equal((first.match(/class="learning-concept-reading"/g)||[]).length,1);
 assert.equal((first.match(/class="concept-step/g)||[]).length,5); // five concept buttons
 assert.match(third,/power limit/);
 assert.doesNotMatch(third,/data-lab-kind/);
});

test('CETa main track has no dedicated original pilot card; Legacy link is at the bottom',()=>{
 const html=v2Page('ceta',context());
 assert.ok(!html.includes('data-goto="legacy"'));
 assert.ok(!html.includes('data-lesson="core"'));
 assert.ok(!html.includes('Core CETa Course</h3>'));
 assert.equal((html.match(/data-source="associate-cet"/g)||[]).length,1);
 const menu=v2Dashboard(context());
 assert.ok(!menu.includes('data-lesson="core"'));
});
test('Legacy Lessons library preserves L01–L05 IDs, index, completion and link behavior',()=>{
 const p={L01:{complete:true,answers:{u1:{correct:true}},updatedAt:1760000000000}};
 const c=context(p);
 c.legacyRows=lessons.map(l=>'<button data-lesson="'+l.id+'" data-goto="lesson">'+l.title+'</button>').join('');
 const html=v2Page('legacy',c);
 for(const id of ['L01','L02','L03','L04','L05'])assert.ok(html.includes('data-lesson="'+id+'"'));
 assert.match(html,/1 \/ 5<\/strong><span>lessons mastered/);
 assert.match(html,/Back to Exam Preparation/);
 assert.equal(catalogSubtrack('core'),undefined);
 assert.match(html,/Original \/ Unreferenced Lessons/);
});
test('Overview is a topic-specific mission, not copies of existing Learn/Interact/Quiz tabs',()=>{
 for(const lesson of [...lessons,...labLessons]){
  const html=lessonOverview(lesson);
  assert.match(html,/data-reveal-insight/);
  assert.match(html,/class="briefing-facts"/);
  assert.match(html,/class="overview-figure"/);
  assert.match(html,/data-lesson-tab="learn"/);
  assert.ok(!html.includes('class="lesson-journey"'));
  assert.ok(!html.includes('Explore 5 visual circuit challenges'));
 }
 assert.match(lessonOverview(labLessons[0]),/1,080/);
 assert.match(lessonOverview(labLessons[1]),/15 mA/);
});

test('CETa cards show actual source inventory and label exam plans without claiming completion',()=>{
 const html=v2Page('ceta',context());
 assert.match(html,/22 chapters · 0 lessons/);assert.equal((html.match(/class="content-chapter"/g)||[]).length,22);
 assert.ok(!html.includes('data-goto="lesson" data-lesson="L01"'));
});
test('dashboard prioritizes active virtual laboratories, not archived pilot lessons',()=>{
 const html=v2Dashboard(context());
 assert.match(html,/Explore Associate CET/);assert.doesNotMatch(html,/data-lesson="EIM-BEC-PRELAB"/);
 assert.ok(!html.includes('data-goto="lesson" data-lesson="L01"'));
});


test('Geier book companions have page attribution, ten graded checks and five usable visual activities',()=>{
 assert.deepEqual(bookLessons.map(l=>l.id),['BDMM-01','BDMM-02']);
 assert.equal(dmmWidgetKinds.length,10);
 const widgetKinds=new Set(dmmWidgetKinds);
 for (const l of bookLessons){
  assert.equal(l.questions.length,10);
  assert.ok(l.questions.some(q=>q.safety===true));
  assert.equal(lessonActivities(l).length,5);
  assert.equal((l.html.match(/data-lab-kind=/g)||[]).length,5);
  assert.ok(lessonActivities(l).every(a=>widgetKinds.has(a.kind)));
  assert.ok(l.module.includes('pp. '));
  assert.ok(!learningContent(l).includes('class="lab-widget"'));
 }
 assert.match(lessonOverview(bookLessons[0]),/5.04 V/);
 assert.match(lessonOverview(bookLessons[1]),/black probe/);
});
test('DMM book track launches first lesson and locks second until first passes',()=>{
 const c=context();
 let html=v2Page('subtrack',c,'geier');
 assert.match(html,/data-lesson="BDMM-01"/);
 assert.doesNotMatch(html,/data-lesson="BDMM-02"/);
 assert.match(html,/supplied table of contents/);
 c.progress['BDMM-01']={complete:true,answers:{},updatedAt:Date.now()};
 html=v2Page('subtrack',c,'geier');
 assert.match(html,/data-lesson="BDMM-02"/);
 assert.match(v2Page('subtrack',c,'basic'),/EIM/);
});
test('DMM published scope contributes to overall charts without changing saved CETa or lab IDs',()=>{
 const c=context({'BDMM-01':{complete:true,answers:{b101:{correct:true},b102:{correct:false}},updatedAt:Date.now()}});
 const html=v2Dashboard(c);
 assert.doesNotMatch(html,/chapter-pie/);assert.match(v2Page('textbooks',c),/Mastered/);assert.equal(c.progress['BDMM-01'].answers.b102.correct,false);
});
test('DMM activities reuse five top tabs with one live question and review returning to correct textbook track',()=>{
 const l=bookLessons[0];
 const html=tabbedLesson({lesson:l,isPilot:false,idx:-1,tab:'interact',activityIndex:0,quizIndex:0,
  score:{correct:0,total:10},passed:false,nextLesson:bookLessons[1],answers:{},questionHtml:()=>'<article class="quiz-card"></article>'});
 assert.match(html,/dmm-signal/);
 assert.equal((html.match(/data-lab-kind=/g)||[]).length,1);
 const quiz=tabbedLesson({lesson:l,isPilot:false,idx:-1,tab:'quiz',activityIndex:0,quizIndex:0,
  score:{correct:0,total:10},passed:false,nextLesson:bookLessons[1],answers:{},questionHtml:()=>'<article class="quiz-card"></article>'});
 assert.equal((quiz.match(/class="quiz-card"/g)||[]).length,1);
 const review=tabbedLesson({lesson:l,isPilot:false,idx:-1,tab:'review',activityIndex:0,quizIndex:0,
  score:{correct:0,total:10},passed:false,nextLesson:bookLessons[1],answers:{},questionHtml:()=>''});
 assert.match(review,/data-lesson="geier"/);
});


test('CETa study-guide first lesson has 5 meaningful activities and 10 graded checks with independent IDs',()=>{
 assert.equal(cetaLessons.length,1);
 const l=cetaLessons[0];
 assert.equal(l.id,'CETA-G03-01');
 assert.equal(l.questions.length,10);
 assert.equal(l.questions.filter(q=>q.safety===true).length,1);
 assert.equal(lessonActivities(l).length,5);
 assert.deepEqual(lessonActivities(l).map(x=>x.kind),cetaWidgetKinds);
 assert.match(l.html,/chapter's teaching pages/);
 assert.match(lessonOverview(l),/5 A/);
 assert.equal(catalogSubtrack('guide').status,'indexed');
});
test('CETa guide preserves 22 source headings and routes original practice to Legacy',()=>{
 const c=context();
 const html=v2Page('subtrack',c,'guide');
 assert.match(html,/Associate CET/);
 assert.doesNotMatch(html,/data-goto="lesson" data-lesson="CETA-G03-01"/);
 assert.match(v2Page("legacy",c),/data-goto="lesson" data-lesson="CETA-G03-01"/);
 assert.match(html,/Chapter 22/);
 assert.match(html,/p\. 16/);
 assert.match(html,/Associate CET/);
 assert.equal((html.match(/class="content-chapter"/g)||[]).length,22);
 assert.ok(!html.includes('data-lesson="L01"'));
});
test('CETa progress is independent of lab, textbook and archived lessons in dashboard metrics',()=>{
 const c=context({'CETA-G03-01':{complete:true,updatedAt:Date.now(),answers:{c30101:{correct:true},c30102:{correct:false}}}});
 const html=v2Dashboard(c);
 assert.doesNotMatch(html,/chapter-pie/);assert.equal(c.progress['CETA-G03-01'].answers.c30102.correct,false);
});

test('staging Supabase uses separate preview project and cannot target production',()=>{
 const config=readFileSync(new URL('../config.js',import.meta.url),'utf8');
 const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
 assert.match(config,/SUPABASE_ENVIRONMENT = 'staging'/);
 assert.match(config,/hkwmtjhgrskidaizamwy\.supabase\.co/);
 assert.doesNotMatch(config,/wwvpzyqcgwlwcetwlime/);
 assert.match(app,/stagingPreview && stagingBackend/);
 assert.match(readFileSync(new URL('../persistence.js',import.meta.url),'utf8'),/eu_staging_progress_v1_/);
});
