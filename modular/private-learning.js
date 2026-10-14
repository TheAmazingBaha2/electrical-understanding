// Private append-only learning journal. Hosts provide bytes; renderers never grade.
import {ContentRepository,orderedBundle,canonicalJSON,artifactHash} from './repositories.js';
import {generateAssessment,generatePractice,evaluateAssessment,evaluatePractice} from './assessments.js';
import {evaluatePractical} from './practical-rubrics.js';
import {requirePublication} from './publication.js';
import {validateEntity} from './validation.js';
import {privateScope} from './private-documents.js';
import {assertSerializable} from '../data-contract.js';
import {projectPracticalProgress} from './progress-events.js';
const same=(a,b)=>canonicalJSON(a)===canonicalJSON(b),reference=e=>({id:e.id,version:e.version});
const timestamp=value=>{if(!Number.isFinite(Date.parse(value))||new Date(value).toISOString()!==value)throw Error('Exact UTC journal timestamp required');};
function journal(ownerId,value){
 if(value===null)return {format:'eu-private-learning@1',ownerId,records:[]};assertSerializable(value);
 if(value.format!=='eu-private-learning@1'||value.ownerId!==ownerId||!Array.isArray(value.records)||Object.keys(value).sort().join(',')!=='format,ownerId,records')throw Error('Unknown private learning format/identity; retain original and export recovery');
 return structuredClone(value);
}
function mergeRecords(left,right){const values=new Map();for(const r of [...left,...right])values.set(canonicalJSON(r),structuredClone(r));return [...values.values()].sort((a,b)=>a.id.localeCompare(b.id)||canonicalJSON(a).localeCompare(canonicalJSON(b)));}
export function journalConflicts(records){
 const groups=new Map();for(const r of records){const key=r.id,g=groups.get(key)||[];if(!g.some(x=>same(x,r)))g.push(r);groups.set(key,g);}
 const clean=[...groups.values()].filter(g=>g.length===1).map(g=>g[0]),byAttempt=new Map();for(const r of clean.filter(r=>r.kind.endsWith('-result'))){const g=byAttempt.get(r.attemptId)||[];g.push(r);byAttempt.set(r.attemptId,g);}
 const duplicates=new Set(),meaning=r=>({kind:r.kind,attemptId:r.attemptId,input:r.answer??r.submission,result:r.result});
 const conflicts=[...groups].filter(([,g])=>g.length>1).map(([id,variants])=>({id,variants}));for(const [id,variants] of byAttempt)if(variants.length>1){if(variants.every(r=>same(meaning(r),meaning(variants[0]))))variants.sort((a,b)=>a.id.localeCompare(b.id)).slice(1).forEach(r=>duplicates.add(r.id));else conflicts.push({id:'attempt:'+id,variants});}
 return {conflicts,clean:clean.filter(r=>!duplicates.has(r.id)&&!conflicts.some(c=>c.id===r.id||c.id==='attempt:'+r.attemptId))};
}
async function validateRecords(records){
 const starts=new Map();for(const r of records){assertSerializable(r);privateScope(r.id,'record');timestamp(r.createdAt);
  if(r.kind.endsWith('-start')){privateScope(r.lesson?.id,'record');if(!/^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/.test(r.lesson?.version))throw Error('Invalid pinned lesson revision');}
  if(r.kind==='question-start'){
   if(!['practice','graded'].includes(r.purpose))throw Error('Unknown assessment purpose');validateEntity(r.template,'AssessmentTemplate');validateEntity(r.instance,'AssessmentInstance');
   const reproduced=await (r.purpose==='graded'?generateAssessment:generatePractice)(r.template,r.instance.seed);if(!same(reproduced,r.instance)||r.subject.id!==r.template.id||r.subject.version!==r.template.version)throw Error('Historical question snapshot mismatch');
   if(r.platform!=='core'||r.purpose==='graded'&&(!r.authorization||r.template.status!=='published'))throw Error('Unauthorized graded question record');starts.set(r.id,r);
  }else if(r.kind==='lab-start'){
   validateEntity(r.definition,'LabModuleDefinition');if(!['practice','graded'].includes(r.purpose)||r.platform!==r.definition.platform||!r.definition.activities.some(a=>a.id===r.subject.id)||r.subject.version!==r.definition.version||r.module.version!==r.definition.version)throw Error('Practical revision mismatch');
   if(r.purpose==='graded'&&(!r.authorization||r.definition.status!=='published'))throw Error('Unauthorized graded practical record');starts.set(r.id,r);
  }else if(!['question-result','lab-result'].includes(r.kind))throw Error('Unknown journal record kind; original retained');
 }
 for(const r of records.filter(r=>r.kind.endsWith('-result'))){const start=starts.get(r.attemptId);if(!start||start.kind.replace('-start','-result')!==r.kind)throw Error('Orphan historical result');
  const result=r.kind==='question-result'?await (start.purpose==='graded'?evaluateAssessment:evaluatePractice)(start.template,start.instance,r.answer):evaluatePractical(start.definition,start.subject.id,r.submission,{purpose:start.purpose});
  if(!same(result,r.result))throw Error('Historical result/rubric mismatch; never silently regrade');
  if(start.purpose==='graded'){privateScope(r.reviewEventId,'review');timestamp(r.reviewDue);}
 }
}
export class PrivateLearningStore {
 static async open({host,ownerId,bundle,publication=null,previous=null,widgetLookup=()=>null,clock=()=>new Date().toISOString()}={}){
  privateScope(ownerId,'learning');if(host.ownerId!==ownerId)throw Error('Host identity mismatch');
  const store=new PrivateLearningStore();Object.assign(store,{host,ownerId,bundle:orderedBundle(bundle),publication,previous,widgetLookup,clock,namespace:'learning'});store.repo=new ContentRepository();store.repo.importBundle(bundle);await store.read();return store;
 }
 async read(){const raw=await this.host.readPrivateDocument(this.namespace),value=journal(this.ownerId,raw.value);await validateRecords(value.records);return {...raw,value};}
 async append(records){
  for(let retry=0;retry<8;retry++){const before=await this.read(),value={...before.value,records:mergeRecords(before.value.records,records)};await validateRecords(value.records);const result=await this.host.compareAndSwap(this.namespace,before.revision,value);if(result.saved)return value;}
  throw Error('Learning updates remain busy; all candidates retained in recovery');
 }
 async authorization(purpose){if(!['practice','graded'].includes(purpose))throw Error('Unknown assessment purpose');if(purpose==='practice')return null;if(!this.publication)throw Error('Owner-approved publication required before learner grades');const r=await requirePublication(this.bundle,this.publication,{previous:this.previous,widgetLookup:this.widgetLookup});return {bundleHash:r.bundleHash,manifestHash:r.manifestHash};}
 lesson(ref){const l=this.repo.get('LessonRevision',ref.id,ref.version);if(!l)throw Error('Unknown lesson revision');return l;}
 async startQuestion(lessonRef,templateRef,{seed,purpose='practice'}={}){
  const lesson=this.lesson(lessonRef);if(!lesson.assessments.some(r=>same(r,templateRef)))throw Error('Assessment is not in this lesson revision');
  const authorization=await this.authorization(purpose);if(purpose==='graded'&&lesson.status!=='published')throw Error('Draft lesson cannot grade');
  const template=this.repo.get('AssessmentTemplate',templateRef.id,templateRef.version),instance=await (purpose==='graded'?generateAssessment:generatePractice)(template,seed);
  const record={id:globalThis.crypto.randomUUID(),kind:'question-start',createdAt:this.clock(),purpose,lesson:structuredClone(lessonRef),subject:structuredClone(templateRef),platform:'core',template,instance,authorization};await this.append([record]);return structuredClone(record);
 }
 async startLab(lessonRef,platform,activityId,{purpose='practice'}={}){
  if(!['desktop','mobile'].includes(platform))throw Error('Independent practical platform required');const lesson=this.lesson(lessonRef),moduleRef=lesson.labs[platform],module=moduleRef&&this.repo.get('LabModuleReference',moduleRef.id,moduleRef.version),definition=module?.definition&&this.repo.get('LabModuleDefinition',module.definition.id,module.definition.version);
  if(!definition||!definition.activities.some(a=>a.id===activityId))throw Error('Implemented activity definition required');const authorization=await this.authorization(purpose);if(purpose==='graded'&&lesson.status!=='published')throw Error('Draft lesson cannot grade');
  const record={id:globalThis.crypto.randomUUID(),kind:'lab-start',createdAt:this.clock(),purpose,lesson:structuredClone(lessonRef),module:structuredClone(moduleRef),subject:{id:activityId,version:definition.version},platform,definition,authorization};await this.append([record]);return structuredClone(record);
 }
 async submit(attemptId,input){
  const {value}=await this.read(),{clean,conflicts}=journalConflicts(value.records);if(conflicts.some(c=>c.id===attemptId))throw Error('Conflicting attempt identity needs explicit review');
  const start=clean.find(r=>r.id===attemptId&&r.kind.endsWith('-start'));if(!start)throw Error('Unknown or disputed attempt');
  const question=start.kind==='question-start',result=question?await (start.purpose==='graded'?evaluateAssessment:evaluatePractice)(start.template,start.instance,input):evaluatePractical(start.definition,start.subject.id,input,{purpose:start.purpose});
  const existing=clean.find(r=>r.attemptId===attemptId&&same(question?r.answer:r.submission,input));if(existing)return structuredClone(existing);
  const createdAt=this.clock(),prior=clean.some(r=>r.kind===start.kind&&r.purpose==='graded'&&same(r.lesson,start.lesson)&&same(r.subject,start.subject)&&r.id!==start.id),days=!result.correct?1:prior?21:7;
  const record={id:globalThis.crypto.randomUUID(),kind:question?'question-result':'lab-result',createdAt,attemptId,...(question?{answer:structuredClone(input)}:{submission:structuredClone(input)}),result,...(start.purpose==='graded'?{reviewDue:new Date(Date.parse(createdAt)+days*86400000).toISOString(),reviewEventId:globalThis.crypto.randomUUID()}: {})};
  await this.append([record]);return structuredClone(record);
 }
 async project(lessonRef){
  const {value}=await this.read(),{clean,conflicts}=journalConflicts(value.records),starts=new Map(clean.filter(r=>r.kind.endsWith('-start')).map(r=>[r.id,r])),events=[];
  for(const r of clean.filter(r=>r.kind.endsWith('-result'))){const s=starts.get(r.attemptId);if(!s||s.purpose!=='graded')continue;
   const base={schemaVersion:3,kind:'ProgressEvent',streamId:this.ownerId,lesson:s.lesson,subject:s.subject,platform:s.platform,...(s.module?{module:s.module}:{instanceId:s.instance.id}),attemptId:s.id,sequence:0,timestamp:r.createdAt};
   events.push({...base,id:r.id,eventType:r.kind,correct:r.result.correct},{...base,id:r.reviewEventId,eventType:'review-scheduled',reviewDue:r.reviewDue});
  }
  const l=this.lesson(lessonRef),platform=p=>{const module=l.labs[p],m=module&&this.repo.get('LabModuleReference',module.id,module.version),d=m?.definition&&this.repo.get('LabModuleDefinition',m.definition.id,m.definition.version);return {module,subjects:(d?.activities||[]).filter(a=>a.required).map(a=>({id:a.id,version:d.version}))};};
  return {...projectPracticalProgress(events,{streamId:this.ownerId,lesson:lessonRef,coreSubjects:l.assessments,safetySubjects:l.assessments.filter(r=>this.repo.get('AssessmentTemplate',r.id,r.version).safety),desktop:platform('desktop'),mobile:platform('mobile'),completionPolicy:l.labs.completionPolicy}),journalConflicts:conflicts,practiceAttempts:clean.filter(r=>r.kind.endsWith('-start')&&r.purpose==='practice').length,events};
 }
 async exportRecovery(){return this.host.exportRecovery(this.namespace);}
 async importRecovery(recovery){
  // Identity/hash validation is done by the host before any imported state is used.
  await this.host.importRecovery(this.namespace,recovery);const imported=[];for(const r of recovery.records){const j=journal(this.ownerId,r.value);await validateRecords(j.records);imported.push(...j.records);}return this.append(imported);
 }
 async fingerprint(){return artifactHash((await this.read()).value);}
}
