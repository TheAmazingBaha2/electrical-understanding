import test from 'node:test';
import assert from 'node:assert/strict';
import {validateLessonPackage,lessonFromPackage,assertSerializable} from '../lesson-package.js';
import {widgetRegistry,widgetFor,searchWidgets,renderRegisteredWidget} from '../widget-registry.js';
import {prioritizeImprovements} from '../widget-improvements.js';
import {lessonActivities,renderActivitySelector} from '../lesson-tabs.js';
import {packageFixture} from './lesson-package-fixture.mjs';
test('registry IDs are unique, versioned, reusable and expose limitations/contracts',()=>{
 assert.equal(new Set(widgetRegistry.map(w=>w.id)).size,widgetRegistry.length);
 assert.ok(widgetFor('lab-breadboard'));assert.ok(widgetFor('dmm-probes'));assert.ok(widgetFor('workshop-simulation'));
 assert.equal(widgetFor('dmm-probes','2.0.0'),null);
 assert.deepEqual(searchWidgets({capabilities:['shared-state']}).map(w=>w.id),['circuit-dc','dmm-shared']);
 for(const w of widgetRegistry)for(const k of ['inputContract','outputContract','limitations','assets','regressionRequirements','compatibleLessonSchemas'])assert.ok(w[k]);
 assert.match(renderRegisteredWidget({id:'simulation-ohm',version:'1.0.0',config:{}}),/data-generated-simulator="ohm"/);
});
test('external package integrates five-tab data and registered activities without script execution',()=>{
 const p=packageFixture();p.sections[0].body='<script>globalThis.bad=true</script>';
 const lesson=lessonFromPackage(p);assert.match(lesson.html,/&lt;script&gt;/);assert.doesNotMatch(lesson.html,/<script>/);
 assert.equal(lesson.questions[0].id,'TEST-Q1');assert.equal(lessonActivities(lesson)[0].widget.id,'simulation-ohm');
 assert.match(renderActivitySelector(lesson),/data-generated-simulator="ohm"/);
 p.activities=[];assert.match(renderActivitySelector(lessonFromPackage(p)),/no interactive activities/);
});
test('malformed, unsafe and incompatible packages fail before publication',()=>{
 const changes=[p=>p.schemaVersion=2,p=>p.html='<script>',p=>p.questions[0].answer=NaN,p=>p.questions[0].tolerance=-1,p=>p.questions[0].source_ids=['missing'],p=>p.questions.push(p.questions[0]),p=>p.activities[0].widget.version='9.0.0',p=>p.activities[0].widget.config={code:'x'},p=>p.prerequisites=['missing'],p=>p.reviewRules.passFraction=.5,p=>p.approval.status='draft',p=>p.questions[0]={...p.questions[0],type:'reflection',rubric:'Self check',safety:true}];
 for(const change of changes){const p=packageFixture();change(p);assert.throws(()=>validateLessonPackage(p));}
 assert.throws(()=>validateLessonPackage(packageFixture(),{knownLessonIds:['TEST-EXTERNAL-01']}),/already exists/);
 assert.throws(()=>assertSerializable({fn:()=>{}}));assert.throws(()=>assertSerializable(JSON.parse('{"__proto__":{}}')));
});
test('critical refinement comes first and always requires review',()=>{
 const item={id:'bug',widgetId:'dmm-shared',widgetVersion:'1.0.0',suggestion:'Check display',priority:'normal',affectedLessons:[],affectedProjects:[],testingRequirements:['reading polarity'],proposedChange:'Review',compatibilityRequirements:'Keep saved measurements'};
 const queue=prioritizeImprovements([item,{...item,id:'safety',priority:'critical-safety'}]);
 assert.equal(queue[0].id,'safety');assert.ok(queue.every(i=>i.status==='pending-owner-review'));
});
