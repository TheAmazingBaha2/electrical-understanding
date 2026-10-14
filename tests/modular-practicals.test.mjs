import test from 'node:test';
import assert from 'node:assert/strict';
import {entity,uid,ref,modularFixture} from './modular-fixture.mjs';
import {validateEntity,validateBundle} from '../modular/validation.js';
import {evaluatePractical} from '../modular/practical-rubrics.js';
import {dividerCircuit} from '../circuit-model.js';
import {prepareCurrentConnection} from '../shared-multimeter.js';
import {generateAssessment,validateAssessmentTemplate} from '../modular/assessments.js';

export const definition=(rubric={kind:'divider-voltage@1',sourceVolts:5,upperOhms:1000,lowerOhms:1000,fault:'none',expectedVolts:2.5,tolerance:.00001})=>entity('LabModuleDefinition',60,{version:'1.0.0',platform:'desktop',status:'reviewed',activities:[{id:uid(21),title:'Synthetic electrical check',prompt:'Measure the output.',hint:'Verify both contacts.',explanation:'The shared model determines the result.',required:true,objectiveIds:[uid(6)],evidence:[ref(4)],rubric}]});
const state=()=>({circuit:dividerCircuit(),settings:{mode:'voltage',jack:'VΩ'}});
test('practical rubrics grade actual topology, parameters, fault state and safe measurement, never clicks or a claimed number',()=>{
 const d=definition(),s=state();assert.equal(evaluatePractical(d,uid(21),s).correct,true);
 for(const mutate of [s=>s.settings.jack='A',s=>s.circuit.instruments[0].redNode='common',s=>s.circuit.components[0].state.open=true,s=>s.circuit.components[1].properties.resistanceOhms=2000,s=>s.circuit.state.powered=false,s=>s.circuit.components[1].terminals[1].nodeId='source']){const bad=state();mutate(bad);assert.equal(evaluatePractical(d,uid(21),bad).correct,false);}
 assert.throws(()=>evaluatePractical(d,uid(21),{...s,claimedReading:2.5}),/Unsupported/);
 const renamed=state();renamed.circuit.components.forEach((p,i)=>p.id='part-'+i);assert.equal(evaluatePractical(d,uid(21),renamed).correct,true);
 const fault=definition({...d.activities[0].rubric,fault:'upper-open',expectedVolts:0});s.circuit.components[1].state.open=true;assert.equal(evaluatePractical(fault,uid(21),s).correct,true);
 const floating=definition({...d.activities[0].rubric,fault:'source-open',expectedVolts:0});s.circuit.components[1].state.open=false;s.circuit.components[0].state.open=true;assert.equal(evaluatePractical(floating,uid(21),s).correct,true);
 assert.throws(()=>validateEntity(definition({...d.activities[0].rubric,expectedVolts:999})),/disagrees/);
 assert.throws(()=>validateEntity(definition({...d.activities[0].rubric,sourceVolts:25})),/bench limit/);
 assert.throws(()=>evaluatePractical({...d,status:'draft'},uid(21),state()),/Unreviewed/);assert.equal(evaluatePractical({...d,status:'draft'},uid(21),state(),{purpose:'practice'}).creditEligible,false);
});
test('separate resistance, continuity and current outcomes preserve existing shared meter safety requirements',()=>{
 const r={kind:'meter-state@1',mode:'resistance',powered:false,redRole:'output',blackRole:'common',expectedValue:1000,tolerance:.001},s=state();s.circuit.state.powered=false;s.settings.mode='resistance';
 assert.equal(evaluatePractical(definition(r),uid(21),s).correct,true);s.circuit.state.powered=true;assert.equal(evaluatePractical(definition(r),uid(21),s).correct,false);
 assert.throws(()=>validateEntity(definition({...r,powered:true})),/unsafe/);
 s.circuit.state.powered=false;s.settings={mode:'current',jack:'A',currentConnection:prepareCurrentConnection(s.circuit,'R1')};s.circuit.state.powered=true;
 const a={...r,mode:'current',powered:true,branchRole:'upper',magnitude:true,expectedValue:.0025};assert.equal(evaluatePractical(definition(a),uid(21),s).correct,true);
 delete s.settings.currentConnection;assert.equal(evaluatePractical(definition(a),uid(21),s).correct,false);
 const c=state();c.circuit.state.powered=false;c.circuit.instruments[0].redNode='common';c.settings.mode='continuity';assert.equal(evaluatePractical(definition({...r,mode:'continuity',redRole:'common',expectedValue:0}),uid(21),c).correct,true);
});
test('four/five band outcomes and additive module definitions retain existing bundle versions',()=>{
 const d=definition({kind:'resistor-bands@1',nominalOhms:857,tolerancePercent:1,bandCount:5});assert.equal(evaluatePractical(d,uid(21),{colors:['gray','green','violet','black','brown']}).correct,true);
 assert.equal(evaluatePractical(d,uid(21),{colors:['grey','green','black','brown']}).correct,false);assert.throws(()=>validateEntity(definition({...d.activities[0].rubric,bandCount:4})),/Unrepresentable/);
 const b=modularFixture();b.entities.push(definition());b.entities[10].definition=ref(60);validateBundle(b);b.entities[10].activityIds=[uid(22)];assert.throws(()=>validateBundle(b),/mismatch/);
});
test('color-code and tolerance families use the shared resistor arithmetic and reject invalid combinations',async()=>{
 for(const [op,values,expected] of [['four-band-value',[1,0,100],1000],['five-band-value',[8,5,7,1],857],['tolerance-lower',[1000,5],950],['tolerance-upper',[1000,5],1050]]){
  const t=modularFixture().entities[9];Object.assign(t,{parameters:values.map((v,i)=>({name:'p'+i,values:[v]})),constraints:[],prompt:'Synthetic safe arithmetic',unit:'Ω',renderer:op.includes('band')?'resistor-bands@1':'numeric-unit@1',evaluator:{op,inputs:values.map((_,i)=>'p'+i)}});assert.equal((await generateAssessment(t,'same')).expected,expected);
  if(op.includes('band')){t.parameters[0].values=[0];assert.throws(()=>validateAssessmentTemplate(t));t.parameters[0].values=[1.5];assert.throws(()=>validateAssessmentTemplate(t));}
 }
});
