import test from 'node:test';
import assert from 'node:assert/strict';
import {makeWorkbenchLesson,approvedWorkbenchLessons,cleanGeneratedPrompt} from '../generated-library.js';
import {lessonActivities,renderLearnSteps,renderActivitySelector} from '../lesson-tabs.js';
const source_ids=['S1'];
const q=Array.from({length:6},(_,i)=>({prompt:'Explain example '+i,answer:'Use the equation',explanation:'Check units',source_ids}));
const s=[{heading:'First concept',body:'Work through the first idea carefully.',source_ids},{heading:'Second concept',body:'Check the meaning and assumptions.',source_ids}];
const unit={id:'GEN-EXAMPLE-U06',kind:'mixed',destination:'source',title:'Battery EMF, Internal Resistance and Terminal Voltage',description:'Practice safely.',sections:s,questions:q};
const job={state:'approved',source_track:'guide',source_book:'Study Guide',source_pages:'pp. 10-20',lesson:{lessons:[unit]}};
test('approved chapter uses ten stable checks, stepped learning and real activities',()=>{
 const lesson=makeWorkbenchLesson(job,unit,unit,'unique',0);
 assert.equal(lesson.questions.length,10);
 assert.equal(new Set(lesson.questions.map(x=>x.id)).size,10);
 assert.match(renderLearnSteps(lesson,0),/CONCEPT 1 OF 2/);
 assert.match(renderLearnSteps(lesson,1),/CONCEPT 2 OF 2/);
 assert.equal(lesson.simulator,'internal');
 assert.match(renderActivitySelector(lesson,0),/data-generated-reveal/);
 assert.match(renderActivitySelector(lesson,lessonActivities(lesson).length-1),/data-generated-simulator/);
 assert.equal(approvedWorkbenchLessons([job]).length,1);
});

test('model authoring labels never appear in learner questions or predictions',()=>{
 const before='Newly authored practice: Write 470000 and 0.000032 in scientific notation.';
 assert.equal(cleanGeneratedPrompt(before),'Write 470000 and 0.000032 in scientific notation.');
 assert.equal(cleanGeneratedPrompt('NEWLY-AUTHORED QUESTION — Calculate current.'),'Calculate current.');
 assert.equal(cleanGeneratedPrompt('Explain why the words newly authored practice might appear in a log.'),
  'Explain why the words newly authored practice might appear in a log.');
 const prefixed={...unit,questions:[{...q[0],prompt:before}],activities:[]};
 const lesson=makeWorkbenchLesson(job,prefixed,prefixed,'unique',0);
 assert.equal(lesson.questions[0].prompt,'Write 470000 and 0.000032 in scientific notation.');
 assert.equal(lesson.activities[0].prompt,'Write 470000 and 0.000032 in scientific notation.');
 assert.equal(lesson.questions[0].id,prefixed.id+'-Q01');
 assert.equal(prefixed.questions[0].prompt,before,'preserve approved raw evidence');
});
