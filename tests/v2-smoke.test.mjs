import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {lessons} from '../lessons.js';
import {labLessons} from '../lab-lessons.js';
import {catalog,catalogSubtrack,cetaGuideUnits,eimBasicExperiments} from '../course-catalog.js';
import {v2Dashboard,v2Page} from '../v2-panels.js';
import {lessonActivities,learningContent,renderLessonTabs,renderLearnSteps} from '../lesson-tabs.js';
import {tabbedLesson} from '../lesson-view.js';

function context(progress={}) {
 return {
  lessons, labLessons, progress, reviews:0, banner:'',
  coreRows:'<p>Existing pilot cards</p>',
  hasPassed:l=>Boolean(progress[l.id]?.complete),
  unlocked:i=>i===0||Boolean(progress[lessons[i-1].id]?.complete)
 };
}
test('the five original pilot lesson IDs and question data remain intact',()=>{
 assert.deepEqual(lessons.map(l=>l.id),['L01','L02','L03','L04','L05']);
 assert.ok(lessons.every(l=>l.questions.length>=5));
});
test('three tracks have distinct subtrack ids',()=>{
 assert.deepEqual(catalog.map(t=>t.id),['ceta','textbooks','labs']);
 const ids=catalog.flatMap(t=>t.subtracks.map(s=>s.id));
 assert.equal(new Set(ids).size,ids.length);
 assert.ok(catalogSubtrack('core')&&catalogSubtrack('guide'));
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
 assert.match(html,/0 \/ 5/);
 assert.match(html,/0% of pilot lessons mastered/);
 assert.match(html,/No checks recorded yet/);
});
test('persisted lesson IDs count in the dashboard without renaming records',()=>{
 const p={L01:{complete:true,answers:{u1:{correct:true}},updatedAt:1760000000000}};
 const html=v2Dashboard(context(p));
 assert.match(html,/1 \/ 5/);
 assert.match(html,/L01/);
});
test('guide, lab, catalog and Scan Inbox views are renderable',()=>{
 const c=context();
 for(const name of ['ceta','textbooks','labs','scan-inbox','curriculum'])assert.ok(v2Page(name,c).length>150);
 assert.match(v2Page('subtrack',c,'guide'),/Chapter 22/);
 assert.match(v2Page('subtrack',c,'basic'),/DC 02/);
 assert.match(v2Page('subtrack',c,'analog'),/Paused/);
});
test('navigation and script imports are wired up',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
 for(const name of ['ceta','textbooks','labs','scan-inbox','curriculum','reviews'])assert.ok(html.includes('data-view="'+name+'"'));
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
 assert.match(html,/1 \/ 2/);
 assert.match(html,/0 \/ 5/);
 assert.match(html,/physical/i);
});

test('course paths expands without leaving the dashboard and exposes all sub-tracks',()=>{
 const html=v2Dashboard(context());
 assert.match(html,/id="course-paths-menu" hidden/);
 assert.match(html,/data-toggle-paths/);
 assert.equal((html.match(/class="course-menu-group"/g)||[]).length,3);
 assert.ok(html.includes('data-goto="subtrack" data-lesson="guide"'));
 assert.ok(html.includes('data-goto="subtrack" data-lesson="basic"'));
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
 assert.equal((html.match(/v2-frost-ring/g)||[]).length,3);
 assert.equal((html.match(/v2-evidence-pie/g)||[]).length,1);
 assert.match(html,/All published lessons/);
 assert.match(html,/Virtual laboratories/);
 assert.match(html,/1 of 2 published lessons complete/);
});

test('source-backed Learn sections display a single teaching concept at a time',()=>{
 const lesson=labLessons[0];
 const first=renderLearnSteps(lesson,0),third=renderLearnSteps(lesson,2);
 assert.equal((first.match(/class="learning-concept-reading"/g)||[]).length,1);
 assert.equal((first.match(/class="concept-step/g)||[]).length,6); // five buttons and container
 assert.match(third,/power limit/);
 assert.doesNotMatch(third,/data-lab-kind/);
});
