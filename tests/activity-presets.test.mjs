import test from 'node:test';import assert from 'node:assert/strict';
import {learningFixture} from './modular-learning-fixture.mjs';import {makeActivityProject,activityProjectId} from '../hosts/activity-presets.js';import {activityGuide,activityStepFeedback} from '../hosts/private-activity-guide.js';
import {validateEntity,validateBundle} from '../modular/validation.js';import {validateProject} from '../project-store.js';import {probeContact} from '../circuit-model.js';import {evaluatePracticalState} from '../modular/practical-rules.js';
const preset=template=>({version:'1.0.0',start:'guided',template,allowExample:true});
test('activity presets are additive bounded data, with unchanged original entities and rejected incompatible templates',async()=>{
 const {bundle}=await learningFixture({published:false,rich:true}),original=structuredClone(bundle),d=bundle.entities.find(e=>e.kind==='LabModuleDefinition'&&e.platform==='desktop'),a=d.activities[0];a.experiment=preset('divider-construction@1');validateBundle(bundle);delete a.experiment;assert.deepEqual(bundle,original);
 a.experiment={...preset('divider-construction@1'),script:'alert(1)'};assert.throws(()=>validateEntity(d));a.experiment=preset('resistor-bands@1');assert.throws(()=>validateEntity(d),/incompatible/);a.experiment={...preset('divider-construction@1'),start:'completed-example'};assert.throws(()=>validateEntity(d),/learner work/);
});
test('desktop minimal/blank starts contain no hidden divider and do not mutate prior projects',async()=>{
 const {bundle}=await learningFixture({published:false}),d=bundle.entities.find(e=>e.kind==='LabModuleDefinition'&&e.platform==='desktop'),a=d.activities[0];a.experiment=preset('divider-construction@1');
 const p=makeActivityProject(d,a,'desktop');validateProject(p);assert.equal(p.circuit.components.length,1);assert.equal(p.circuit.components[0].type,'dc-source');assert.equal(p.circuit.state.powered,false);assert.equal(p.circuit.connections.length,0);assert.equal(probeContact(p.circuit,'red').state,'unattached');
 assert.equal(makeActivityProject(d,a,'desktop',{mode:'blank'}).circuit.components.length,0);assert.equal(activityProjectId(d,a),p.id);assert.notEqual(activityProjectId({...d,version:'2.0.0'},a),p.id);
 assert.equal(activityStepFeedback(a,'desktop',{...p.experimentState.activitySession,stepId:'build'},p).ready,false);
});
test('completed examples come from actual shared models and are explicitly ungraded session states',async()=>{
 const {bundle}=await learningFixture({published:false,rich:true});for(const d of bundle.entities.filter(e=>e.kind==='LabModuleDefinition'))for(const a of d.activities){const r=a.rubric;a.experiment=preset(r.kind==='resistor-bands@1'?'resistor-bands@1':r.kind==='meter-state@1'?'meter-connections@1':'divider-construction@1');const p=makeActivityProject(d,a,d.platform,{mode:'completed-example'});validateProject(p);assert.equal(p.experimentState.activitySession.example,true);const state={...p.experimentState.activitySession,stepId:'measure',predictions:{predict:1}};assert.equal(activityStepFeedback(a,d.platform,state,p).ready,true);assert.equal(activityGuide(a,d.platform).steps.length,6);}
});
test('phone band construction starts at a different value; incorrect predictions never become grades',async()=>{
 const {bundle}=await learningFixture({published:false,rich:true}),d=bundle.entities.find(e=>e.kind==='LabModuleDefinition'&&e.platform==='mobile'),a=d.activities[1];a.experiment=preset('resistor-bands@1');const p=makeActivityProject(d,a,'mobile');assert.equal(p.circuit.components.length,1);assert.equal(p.circuit.components[0].properties.resistanceOhms,100);
 const s={...p.experimentState.activitySession,predictions:{predict:0}};assert.equal(activityStepFeedback(a,'mobile',s,p).ready,true);assert.equal(activityStepFeedback(a,'mobile',{...s,stepId:'build'},p).ready,false);assert.equal(evaluatePracticalState(a.rubric,{colors:['brown','black','brown','gold']}).correct,false);
});
