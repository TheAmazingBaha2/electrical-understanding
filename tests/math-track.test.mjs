import test from 'node:test';
import assert from 'node:assert/strict';
import {mathLessons,mathAvailability,relatedMath,mathById} from '../math-lessons.js';
import {mathWidgetKinds,renderMathWidget} from '../math-widgets.js';
import {renderMathTrack} from '../math-track.js';
import {lessonActivities,renderLearnSteps} from '../lesson-tabs.js';
import {tabbedLesson} from '../lesson-view.js';
import {lessons} from '../lessons.js';
import {labLessons} from '../lab-lessons.js';
import {bookLessons} from '../book-lessons.js';
import {cetaLessons} from '../ceta-lessons.js';
import {catalog} from '../course-catalog.js';
import {readFileSync} from 'node:fs';
const sources=[...lessons,...labLessons,...bookLessons,...cetaLessons];
const canSource=l=>['L01','EIM-BEC-PRELAB','BDMM-01','CETA-G03-01'].includes(l.id);
const active=l=>mathAvailability(l,sources,canSource);
test('math companion is one fourth track with zero subtracks and six permanent lessons',()=>{
 assert.deepEqual(catalog.map(t=>t.id),['ceta','textbooks','labs','math']);
 assert.deepEqual(catalog[3].subtracks,[]);
 assert.deepEqual(mathLessons.map(l=>l.id),['MATH-001','MATH-002','MATH-003','MATH-004','MATH-005','MATH-006']);
 assert.equal(new Set(mathLessons.map(l=>l.id)).size,mathLessons.length);
});
test('each authored math concept maps to existing stable source IDs and does not replace them',()=>{
 for(const l of mathLessons){
  assert.ok(l.sourceLessonIds.length>0);
  assert.ok(l.sourceLessonIds.every(id=>sources.some(s=>s.id===id)),l.id+' references a missing source');
  assert.equal(l.questions.length,6);
  assert.equal(new Set(l.questions.map(q=>q.id)).size,6);
  assert.ok(l.questions.every(q=>q.type==='number'||q.type==='choice'));
  assert.ok(l.html.includes('<h3>4.'));
  assert.ok(lessonActivities(l).length>=1);
  assert.ok(mathById(l.id)===l);
 }
 assert.equal(new Set(mathLessons.flatMap(l=>l.questions.map(q=>q.id))).size,36);
 assert.ok(relatedMath('BDMM-01').some(l=>l.id==='MATH-004'));
});
test('all math is accessible regardless of source or completion',()=>{
 assert.equal(active(mathById('MATH-001')),true);
 assert.equal(active(mathById('MATH-002')),true);
 assert.equal(active(mathById('MATH-003')),true);
 assert.equal(active(mathById('MATH-004')),true);
 assert.equal(active(mathById('MATH-005')),true);
 assert.equal(active(mathById('MATH-006')),true);
 const labAll=l=>canSource(l)||l.id==='EIM-BEC-DC02';
 assert.equal(mathAvailability(mathById('MATH-003'),sources,labAll),true);
 assert.equal(mathAvailability(mathById('MATH-006'),sources,l=>l.id==='L05'),true);
 assert.equal(mathAvailability(mathById('MATH-006'),sources,()=>false),true);
});
test('a new math companion needs no source completion gate',()=>{
 const future={...mathById('MATH-006'),sourceLessonIds:['NEW-SOURCE-2027']};
 assert.equal(mathAvailability(future,sources,()=>true),true);
 assert.equal(mathAvailability(future,[...sources,{id:'NEW-SOURCE-2027'}],x=>x.id==='NEW-SOURCE-2027'),true);
});
test('standalone math view exposes all supplied math lessons without locks',()=>{
 const html=renderMathTrack({sourceLessons:sources,mathIsAvailable:active,sourceIsAvailable:canSource,hasPassed:()=>false,progress:{}});
 assert.match(html,/Mathematics Companion/);
 assert.match(html,/6 ready/);
 assert.match(html,/MATH 01/);
 assert.doesNotMatch(html,/Waiting for a linked source lesson/);
 assert.match(html,/data-lesson="MATH-001"/);
 assert.match(html,/data-lesson="CETA-G03-01"/);
 assert.doesNotMatch(html,/data-goto="subtrack"/);
});
test('math progress counts separately and never implies other-track mastery',()=>{
 const p={'MATH-001':{complete:true,answers:{m001q01:{correct:true}}},L01:{complete:false}};
 const html=renderMathTrack({sourceLessons:sources,mathIsAvailable:active,sourceIsAvailable:canSource,hasPassed:l=>Boolean(p[l.id]?.complete),progress:p});
 assert.match(html,/1 \/ 6 reachable companions mastered/);
 assert.match(html,/1 \/ 6 correct/);
 assert.doesNotMatch(html,/L01.*Mastered/);
});
test('every math widget is a safe offline step-by-step equation explorer',()=>{
 for(const w of mathWidgetKinds){
  const html=renderMathWidget(w);
  assert.match(html,/data-math-kind=/);
  assert.match(html,/1\. Equation/);
  assert.match(html,/2\. Substitution/);
  assert.match(html,/3\. Result/);
  assert.match(html,/type="range"/);
  assert.doesNotMatch(html,/fetch\(|api\.openai\.com/);
 }
 assert.equal(mathWidgetKinds.length,13);
});
test('math lessons use the same five-step reader and quiz without altering existing question IDs',()=>{
 const l=mathById('MATH-003');
 const learn=renderLearnSteps(l,0);
 assert.match(learn,/CONCEPT 1 OF 4/);
 const tab=tabbedLesson({lesson:l,isPilot:false,idx:-1,score:{correct:0,total:6},passed:false,tab:'quiz',quizIndex:0,answers:{},questionHtml:()=>'<article class="quiz-card"></article>'});
 assert.equal((tab.match(/class="quiz-card"/g)||[]).length,1);
 assert.match(tab,/CROSS-TRACK MATHEMATICS/);
 assert.match(tab,/data-quiz-index/);
 assert.deepEqual(lessons.map(l=>l.id),['L01','L02','L03','L04','L05']);
});
test('staging asset allowlist includes math files but no paid server secrets',()=>{
 const build=readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
 const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
 assert.match(build,/"math-lessons\.js", "math-widgets\.js", "math-track\.js"/);
 assert.match(app,/mathAvailability/);
 assert.match(app,/relatedMath\(lesson\.id\)/);
 assert.doesNotMatch(build,/SUPABASE_SERVICE_ROLE_KEY/);
});
