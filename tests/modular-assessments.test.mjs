import test from 'node:test';
import assert from 'node:assert/strict';
import {generateAssessment,evaluateAssessment,validateAssessmentTemplate,assessmentText} from '../modular/assessments.js';
import {validateBundle} from '../modular/validation.js';
import {modularFixture} from './modular-fixture.mjs';
const template=()=>modularFixture().entities.find(e=>e.kind==='AssessmentTemplate');

test('same reviewed template, version and seed reproduce exact question identity, values and grading',async()=>{
 const t=template(),a=await generateAssessment(t,'attempt-one'),b=await generateAssessment(t,'attempt-one');assert.deepEqual(a,b);assert.equal(a.expected,a.parameters[0].value/a.parameters[1].value);
 assert.match(assessmentText(t.prompt,a),/Calculate current for (5|10) V and (1000|2000) Ω/);
 assert.equal((await evaluateAssessment(t,a,{value:a.expected,unit:'A'})).correct,true);
 assert.equal((await evaluateAssessment(t,a,{value:a.expected,unit:'V'})).correct,false);
 assert.equal((await evaluateAssessment(t,a,{value:a.expected+.1,unit:'A'})).correct,false);
 const differentVersion={...t,version:'2.0.0'};await assert.rejects(evaluateAssessment(differentVersion,a,{value:a.expected,unit:'A'}),/revision mismatch/);
 await assert.rejects(evaluateAssessment(t,{...a,expected:1},{value:1,unit:'A'}),/mismatch/);
 await assert.rejects(evaluateAssessment({...t,explanation:'Changed same-version meaning'},a,{value:a.expected,unit:'A'}),/mismatch/);
 const values=new Set();for(let seed=0;seed<24;seed++){const q=await generateAssessment(t,String(seed));values.add(q.parameters.map(p=>p.value).join(':'));assert.ok(t.parameters.every((p,i)=>p.values.includes(q.parameters[i].value)));}assert.equal(values.size,4);
});
test('reviewed arithmetic operators calculate divider, series, parallel, voltage and static choice correctly',async()=>{
 for(const [op,params,unit,expected] of [['voltage-divider',[9,1000,2000],'V',6],['series-resistance',[100,200,300],'Ω',600],['parallel-resistance',[100,100],'Ω',50],['ohm-voltage',[.02,1000],'V',20]]){
  const t=template();t.parameters=params.map((value,i)=>({name:'p'+i,values:[value]}));t.constraints=[];t.evaluator={op,inputs:t.parameters.map(p=>p.name)};t.prompt='Synthetic safe arithmetic';t.unit=unit;const q=await generateAssessment(t,'fixed');assert.equal(q.expected,expected);
 }
 const t=template();Object.assign(t,{type:'static-choice',parameters:[],constraints:[],renderer:'selectable-choice@1',evaluator:{op:'choice',inputs:[],correctIndex:1},prompt:'Choose the correct synthetic option.',choices:['Wrong','Correct'],unit:''});const q=await generateAssessment(t,'choice');assert.equal((await evaluateAssessment(t,q,{value:1,unit:''})).correct,true);assert.equal((await evaluateAssessment(t,q,{value:0,unit:''})).correct,false);
});
test('templates reject unsafe code, wrong units, unknown parameters, invalid physics and infeasible constraints before import',async()=>{
 for(const mutate of [t=>t.evaluator={op:'eval',inputs:[],code:'fetch()'},t=>t.parameters[1].values=[0],t=>t.unit='V',t=>t.prompt='{{missing}}',t=>t.constraints=[{op:'greater-than',inputs:['resistance','voltage']} ,{op:'greater-than',inputs:['voltage','resistance']}],t=>t.evaluator.inputs=['missing','resistance'],t=>t.parameters[0].name='constructor',t=>t.parameters[0].values=[5,5]]){
  const t=template();mutate(t);assert.throws(()=>validateAssessmentTemplate(t));const b=modularFixture();b.entities[9]=t;assert.throws(()=>validateBundle(b));
 }
 const constrained=template();constrained.parameters[0].values=[-5,5];constrained.constraints.push({op:'positive',inputs:['voltage']});for(let i=0;i<8;i++)assert.equal((await generateAssessment(constrained,String(i))).parameters[0].value,5);
 await assert.rejects(generateAssessment({...template(),status:'draft'},'seed'),/Unreviewed/);
});
