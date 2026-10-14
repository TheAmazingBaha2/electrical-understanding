import {test} from 'node:test';
import assert from 'node:assert/strict';
import {packageFixture} from './lesson-package-fixture.mjs';
import {validateLessonPackage,lessonFromPackage} from '../lesson-package.js';
import {recordLabActivity,labModuleProgress,practicalCompletion} from '../lab-modules.js';
import {lessonRequirementsMet} from '../workshop-progress.js';
import {dividerCircuit} from '../circuit-model.js';
import {migrate} from '../persistence.js';
export function dualFixture(){const p=packageFixture();p.schemaVersion=2;p.labs={completionPolicy:'either'};for(const platform of ['desktop','mobile'])p.labs[platform]={id:'TEST-'+platform,version:'1.0.0',title:platform+' lab',activities:[{id:'TEST-'+platform+'-measure',title:'Measure output',prompt:'Connect red to output and black to common.',required:true,source_ids:['REF1'],assessment:{type:'dc-voltage',redNode:'output',blackNode:'common',valueVolts:2.5,toleranceVolts:.001,explanation:'Equal resistors divide 5 V in half.'}}]};return p;}
test('dual packages preserve core IDs and reject unsupported or cross-platform ID collisions',()=>{
 const p=dualFixture(),old=packageFixture();validateLessonPackage(p);assert.deepEqual(lessonFromPackage(p).questions,old.questions);assert.deepEqual(lessonFromPackage(old).questions,old.questions);
 for(const mutate of [p=>p.labs.desktop.activities[0].id=p.questions[0].id,p=>p.labs.mobile.activities[0].id=p.labs.desktop.activities[0].id,p=>p.labs.completionPolicy='both',p=>p.labs.mobile.activities[0].assessment.type='script',p=>p.labs.desktop.activities[0].source_ids=['missing'],p=>p.labs.desktop.activities[0].assessment.code='evil()']){const v=dualFixture();mutate(v);assert.throws(()=>validateLessonPackage(v));}
});
test('either lab satisfies only new practical requirement; independent results and versions survive',()=>{
 const lesson=lessonFromPackage(dualFixture()),historical={answers:{'TEST-Q1':{correct:true,attempts:5,reviewDue:42}},complete:false,workshopChecks:{old:{correct:true}},unknown:{keep:true}};
 assert.equal(lessonRequirementsMet(lesson,historical),false);
 let state=recordLabActivity(lesson,historical,'mobile','TEST-mobile-measure',{circuit:dividerCircuit(),settings:{mode:'voltage',jack:'VΩ'}},100);
 assert.equal(lessonRequirementsMet(lesson,state),true);assert.equal(labModuleProgress(lesson,state,'desktop').complete,false);assert.equal(practicalCompletion(lesson,state).complete,true);assert.deepEqual(state.answers,historical.answers);assert.deepEqual(state.workshopChecks,historical.workshopChecks);assert.equal(state.complete,false);
 const mobile=structuredClone(state.labModules.mobile);const c=dividerCircuit();c.instruments[0].redNode='common';c.instruments[0].blackNode='output';
 state=recordLabActivity(lesson,state,'desktop','TEST-desktop-measure',{circuit:c,settings:{mode:'voltage',jack:'VΩ'}},101);assert.equal(labModuleProgress(lesson,state,'desktop').correct,0);assert.deepEqual(state.labModules.mobile,mobile);assert.equal(lessonRequirementsMet(lesson,state),true);
 state=recordLabActivity(lesson,state,'desktop','TEST-desktop-measure',{circuit:dividerCircuit(),settings:{mode:'voltage',jack:'VΩ'}},102);assert.equal(labModuleProgress(lesson,state,'desktop').attempts,2);assert.equal(labModuleProgress(lesson,state,'desktop').correct,1);assert.deepEqual(state.labModules.mobile,mobile);
 const old=structuredClone(state);lesson.labs.desktop.version='2.0.0';assert.equal(labModuleProgress(lesson,state,'desktop').complete,false);state=recordLabActivity(lesson,state,'desktop','TEST-desktop-measure',{circuit:dividerCircuit(),settings:{mode:'voltage',jack:'VΩ'}},103);assert.deepEqual(state.labModules.desktop['TEST-desktop@1.0.0'],old.labModules.desktop['TEST-desktop@1.0.0']);assert.deepEqual(migrate({L:state}).progress.L.labModules,state.labModules);
 assert.equal(lessonRequirementsMet({questions:lesson.questions},historical),true);
});
test('practical voltage checks use engine readings and reject live resistance, wrong jacks and floating probes',()=>{
 const l=lessonFromPackage(dualFixture());for(const settings of [{mode:'resistance',jack:'VΩ'},{mode:'voltage',jack:'A'}])assert.equal(recordLabActivity(l,{},'desktop','TEST-desktop-measure',{circuit:dividerCircuit(),settings}).labModules.desktop['TEST-desktop@1.0.0'].complete,false);
 const c=dividerCircuit();c.components[1].state.open=true;c.components[2].state.open=true;assert.equal(recordLabActivity(l,{},'mobile','TEST-mobile-measure',{circuit:c,settings:{mode:'voltage',jack:'VΩ'}}).labModules.mobile['TEST-mobile@1.0.0'].complete,false);
 assert.throws(()=>recordLabActivity(l,{},'mobile','wrong',{circuit:c}));
});
