import {validateEntity} from './validation.js';
import {canonicalJSON} from './repositories.js';

import {assertAssessmentSemantics,parameterSets,answerFor} from './assessment-rules.js';

export function validateAssessmentTemplate(template){validateEntity(template,'AssessmentTemplate');return assertAssessmentSemantics(template);}
// FNV-1a over UTF-16 code units is frozen as part of finite-product@1.
function seedIndex(text){let h=2166136261;for(let i=0;i<text.length;i++)h=Math.imul(h^text.charCodeAt(i),16777619);return h>>>0;}
async function instanceId(text){
 const namespace='c071d10b6cb24ee0b9f22c4944d2e744';const name=new TextEncoder().encode(text),input=new Uint8Array(16+name.length);for(let i=0;i<16;i++)input[i]=parseInt(namespace.slice(i*2,i*2+2),16);input.set(name,16);
 const bytes=new Uint8Array(await globalThis.crypto.subtle.digest('SHA-1',input)).slice(0,16);bytes[6]=(bytes[6]&15)|80;bytes[8]=(bytes[8]&63)|128;const hex=Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('');return [hex.slice(0,8),hex.slice(8,12),hex.slice(12,16),hex.slice(16,20),hex.slice(20)].join('-');
}
export async function generateAssessment(template,seed){
 validateAssessmentTemplate(template);if(!['reviewed','published'].includes(template.status))throw Error('Unreviewed assessment cannot grade');
 if(typeof seed!=='string'||!seed.trim()||seed.length>256)throw Error('A reproducible seed of 1–256 characters is required');
 const material=template.id+'@'+template.version+':'+seed,sets=parameterSets(template),parameters=sets[seedIndex(material)%sets.length];
 const instance={schemaVersion:3,kind:'AssessmentInstance',id:await instanceId(material),template:{id:template.id,version:template.version},seed,generator:'finite-product@1',parameters:structuredClone(parameters),expected:answerFor(template,parameters),unit:template.unit};
 validateEntity(instance);return instance;
}
export async function evaluateAssessment(template,instance,answer){
 validateEntity(instance,'AssessmentInstance');const reproduced=await generateAssessment(template,instance.seed);
 if(canonicalJSON(reproduced)!==canonicalJSON(instance))throw Error('Assessment instance/revision mismatch; preserve historical attempt');
 if(!answer||typeof answer.value!=='number'||!Number.isFinite(answer.value)||typeof answer.unit!=='string')throw Error('Answer requires finite value and explicit unit');
 const tolerance=template.type==='static-choice'?0:Math.max(template.tolerance.absolute,Math.abs(instance.expected)*template.tolerance.relative);
 const correct=answer.unit===instance.unit&&Math.abs(answer.value-instance.expected)<=tolerance;
 return {correct,expected:instance.expected,unit:instance.unit,tolerance,explanation:assessmentText(template.explanation,instance)};
}
export function assessmentText(text,instance){const values=Object.fromEntries(instance.parameters.map(p=>[p.name,p.value]));return text.replace(/\{\{([^}]+)\}\}/g,(_,name)=>{if(!Object.hasOwn(values,name))throw Error('Unknown prompt parameter');return String(values[name]);});}
