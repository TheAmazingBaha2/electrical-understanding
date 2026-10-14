// Additive practical records; core quiz/workshop data is never copied or replaced.
import {assertSerializable} from './data-contract.js';
import {validateCircuit} from './circuit-model.js';
import {sharedMeterReading} from './shared-multimeter.js';
export const labPlatforms=['desktop','mobile'];
const identifier=v=>typeof v==='string'&&!['constructor','prototype','__proto__'].includes(v)&&/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(v);
const plain=v=>v&&typeof v==='object'&&!Array.isArray(v);
function fields(value,allowed,label){if(!plain(value))throw Error('Invalid '+label);for(const k of Object.keys(value))if(!allowed.includes(k))throw Error('Unknown '+label+' field: '+k);}
function text(value,label){if(typeof value!=='string'||!value.trim())throw Error('Missing '+label);}
export function validateLabModules(labs,{references=[],reservedIds=[]}={}){
 assertSerializable(labs);fields(labs,['completionPolicy','desktop','mobile'],'labs');
 if(labs.completionPolicy!=='either')throw Error('Practical policy must be either; core quiz remains required');
 const ids=new Set(reservedIds),refs=new Set(references);
 for(const platform of labPlatforms){
  const m=labs[platform];fields(m,['id','version','title','activities'],'lab module');
  if(!identifier(m.id)||!/^\d+\.\d+\.\d+$/.test(m.version))throw Error('Invalid lab module identity/version');
  if(ids.has(m.id))throw Error('Duplicate module/activity/core ID');ids.add(m.id);text(m.title,'module title');
  if(!Array.isArray(m.activities)||!m.activities.length)throw Error('Lab activities required');
  for(const a of m.activities){
   fields(a,['id','title','prompt','source_ids','required','assessment'],'lab activity');
   if(!identifier(a.id)||ids.has(a.id))throw Error('Duplicate or invalid module/activity/core ID');ids.add(a.id);
   text(a.title,'activity title');text(a.prompt,'activity prompt');
   if(typeof a.required!=='boolean')throw Error('Explicit required activity flag needed');
   if(!Array.isArray(a.source_ids)||!a.source_ids.length||a.source_ids.some(id=>!refs.has(id)))throw Error('Missing/unknown lab source reference');
   const r=a.assessment;
   if(r?.type==='choice'){
    fields(r,['type','choices','correct','explanation'],'choice assessment');
    if(!Array.isArray(r.choices)||r.choices.length<2||!Number.isInteger(r.correct)||r.correct<0||r.correct>=r.choices.length)throw Error('Invalid practical choice grading');
    r.choices.forEach(v=>text(v,'choice'));text(r.explanation,'explanation');
   }else if(r?.type==='dc-voltage'){
    fields(r,['type','redNode','blackNode','valueVolts','toleranceVolts','explanation'],'voltage assessment');
    if(!identifier(r.redNode)||!identifier(r.blackNode)||r.redNode===r.blackNode||!Number.isFinite(r.valueVolts)||!Number.isFinite(r.toleranceVolts)||r.toleranceVolts<0)throw Error('Invalid DC voltage assessment');
    text(r.explanation,'explanation');
   }else throw Error('Unsupported lab assessment; no arbitrary code or self-certified electrical checks');
  }
  if(!m.activities.some(a=>a.required))throw Error('At least one required activity needed per module');
 }
 return labs;
}
export const labModuleKey=m=>m.id+'@'+m.version;
export function labModuleProgress(lesson,state={},platform){
 const m=lesson.labs?.[platform];if(!m)return {available:false,complete:false,correct:0,total:0,attempts:0};
 const record=state.labModules?.[platform]?.[labModuleKey(m)],results=record?.results||{},required=m.activities.filter(a=>a.required);
 return {available:true,moduleId:m.id,version:m.version,complete:required.every(a=>results[a.id]?.correct===true),correct:m.activities.filter(a=>results[a.id]?.correct===true).length,total:m.activities.length,attempts:m.activities.reduce((n,a)=>n+(results[a.id]?.attempts||0),0)};
}
export function practicalCompletion(lesson,state={}){
 if(!lesson.labs)return {required:false,complete:true,desktop:null,mobile:null};
 const desktop=labModuleProgress(lesson,state,'desktop'),mobile=labModuleProgress(lesson,state,'mobile');
 return {required:true,complete:desktop.complete||mobile.complete,desktop,mobile};
}
export function evaluateLabActivity(a,submission){
 assertSerializable(submission);const r=a.assessment;
 if(r.type==='choice')return {correct:Number.isInteger(submission.choice)&&submission.choice===r.correct,value:submission.choice??null,explanation:r.explanation};
 if(r.type!=='dc-voltage')throw Error('Unsupported practical assessment');
 validateCircuit(submission.circuit);
 const meter=submission.circuit.instruments.find(i=>i.id==='DMM1'),reading=sharedMeterReading(submission.circuit,submission.settings||{});
 const correct=meter?.redNode===r.redNode&&meter?.blackNode===r.blackNode&&reading.mode==='voltage'&&reading.status==='valid'&&Number.isFinite(reading.value)&&Math.abs(reading.value-r.valueVolts)<=r.toleranceVolts;
 return {correct,value:reading.value??null,explanation:r.explanation,measurement:{status:reading.status,mode:reading.mode,redNode:meter?.redNode??null,blackNode:meter?.blackNode??null}};
}
export function recordLabActivity(lesson,state,platform,activityId,submission,time=Date.now()){
 if(!labPlatforms.includes(platform)||!lesson.labs?.[platform])throw Error('Lab module unavailable');
 const m=lesson.labs[platform],a=m.activities.find(a=>a.id===activityId);if(!a)throw Error('Unknown module activity');
 if(!Number.isFinite(time))throw Error('Invalid assessment timestamp');
 const result=evaluateLabActivity(a,submission),next=structuredClone(state),key=labModuleKey(m);
 next.labModules??={};next.labModules[platform]??={};
 const record=next.labModules[platform][key]??={moduleId:m.id,version:m.version,results:{}};
 const previous=record.results[a.id]||{};
 record.results[a.id]={...previous,...result,attempts:(previous.attempts||0)+1,checkedAt:time};
 record.complete=labModuleProgress(lesson,next,platform).complete;
 record.gradeCounters={correct:labModuleProgress(lesson,next,platform).correct,total:m.activities.length,attempts:labModuleProgress(lesson,next,platform).attempts};
 record.updatedAt=time;return next;
}
