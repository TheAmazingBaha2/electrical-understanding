import {assertSerializable} from '../data-contract.js';
import {domainSchema,ENTITY_KINDS} from './contracts.js';
import {assertAssessmentSemantics} from './assessment-rules.js';

// Bounded Draft 2020-12 evaluator for exactly the vocabulary used by these contracts.
// Unknown vocabulary fails closed; schemas are reviewed application code, never input.
const keywords=new Set(['type','properties','required','additionalProperties','items','minItems','enum','const','pattern','minLength','minimum','maximum','anyOf','$ref']);
function check(schema,value,path){
 for(const key of Object.keys(schema))if(!keywords.has(key))throw Error('Unsupported schema vocabulary: '+key);
 if(schema.$ref){const target=domainSchema.$defs[schema.$ref.replace('#/$defs/','')];if(!target)throw Error('Unknown schema reference');return check(target,value,path);}
 if(schema.anyOf){if(!schema.anyOf.some(s=>{try{check(s,value,path);return true;}catch{return false;}}))throw Error(path+' matches no allowed contract');return;}
 if(Object.hasOwn(schema,'const')&&value!==schema.const)throw Error(path+' has invalid constant');
 if(schema.enum&&!schema.enum.includes(value))throw Error(path+' has invalid value');
 if(schema.type){const ok=schema.type==='null'?value===null:schema.type==='array'?Array.isArray(value):schema.type==='object'?value!==null&&typeof value==='object'&&!Array.isArray(value):schema.type==='integer'?Number.isInteger(value):typeof value===schema.type;
  if(!ok)throw Error(path+' must be '+schema.type);}
 if(typeof value==='string'){
  if(schema.minLength&&value.length<schema.minLength)throw Error(path+' is empty');
  if(schema.pattern&&!new RegExp(schema.pattern).test(value))throw Error(path+' has invalid format');
 }
 if(typeof value==='number'&&((schema.minimum!==undefined&&value<schema.minimum)||(schema.maximum!==undefined&&value>schema.maximum)))throw Error(path+' is outside allowed range');
 if(Array.isArray(value)){if(schema.minItems&&value.length<schema.minItems)throw Error(path+' has too few entries');if(schema.items)value.forEach((v,i)=>check(schema.items,v,path+'['+i+']'));}
 if(schema.properties){for(const key of schema.required||[])if(!Object.hasOwn(value,key))throw Error(path+' missing '+key);for(const [key,v] of Object.entries(value)){
  if(!Object.hasOwn(schema.properties,key)){if(schema.additionalProperties===false)throw Error(path+' unknown property '+key);}else check(schema.properties[key],v,path+'.'+key);
 }}
}
export const revisionKey=e=>e.kind+':'+e.id+(e.version?'@'+e.version:'');
export function validateEntity(entity,kind=entity?.kind){
 assertSerializable(entity);if(!ENTITY_KINDS.includes(kind))throw Error('Unsupported entity kind');
 check(domainSchema.$defs[kind],entity,kind);
 if(kind==='SourceLocator'){
  for(const pages of [entity.printedPages,entity.digitalPages])if(pages&&pages.end<pages.start)throw Error('Reversed source page range');
  if(!entity.printedPages&&!entity.pageLabel&&!entity.section)throw Error('SourceLocator must preserve a page or section locator');
 }
 if(kind==='ContentBlock'&&entity.origin!=='source-independent'&&!entity.evidence.length)throw Error('Source-derived assertion needs evidence');
 if(kind==='EvidenceClaim'&&entity.state==='disputed'&&!entity.conflictsWith.length)throw Error('Disputed evidence needs explicit conflict');
 if(kind==='AssessmentTemplate')assertAssessmentSemantics(entity);
 if(kind==='LabModuleReference'){
  if(new Set(entity.activityIds).size!==entity.activityIds.length)throw Error('Duplicate practical activity ID');
  if(!entity.adapter.startsWith(entity.platform+'-'))throw Error('Lab adapter/platform mismatch');
 }
 if(kind==='IngestionProposal'&&entity.confidence<.7&&entity.decision!=='DEFER')throw Error('Low-confidence proposals must DEFER');
 if(kind==='LegacyMapping'&&entity.credit==='explicit-equivalent'&&(entity.disposition!=='MIGRATED_EQUIVALENT'||!entity.targets.length))throw Error('Credit needs reviewed equivalent mapping');
 if(kind==='LegacyMapping'&&!['REQUIRES_REVIEW','HISTORICAL_ONLY','INTENTIONALLY_RETIRED'].includes(entity.disposition)&&!entity.targets.length)throw Error('Migration disposition requires explicit targets');
 if(kind==='ProgressEvent'){
  if(!Number.isFinite(Date.parse(entity.timestamp)))throw Error('Invalid event timestamp');
  if(new Date(entity.timestamp).toISOString()!==entity.timestamp.replace(/Z$/,entity.timestamp.includes('.')?'Z':'.000Z'))throw Error('Nonexistent calendar timestamp');
  const lab=entity.eventType.startsWith('lab-');if(lab&&(entity.platform==='core'||!entity.module))throw Error('Lab event needs independent platform/module revision');
  if(entity.eventType.startsWith('question-')&&entity.platform!=='core')throw Error('Common quiz event must be core');
  if(entity.eventType.startsWith('question-')&&(!entity.instanceId||entity.module))throw Error('Question event needs exact instance and no practical module');
  if(entity.eventType.endsWith('-result')&&typeof entity.correct!=='boolean')throw Error('Result needs immutable correctness');
  if(!entity.eventType.endsWith('-result')&&Object.hasOwn(entity,'correct'))throw Error('Only result events contain correctness');
  if(entity.eventType==='review-scheduled'&&(!entity.reviewDue||!Number.isFinite(Date.parse(entity.reviewDue))))throw Error('Review event needs valid due date');
 }
 return entity;
}
export function validateBundle(bundle){
 assertSerializable(bundle);check(domainSchema.$defs.Bundle,bundle,'Bundle');
 const index=new Map(),identityKinds=new Map(),ownerRevisions=new Set();for(const entity of bundle.entities){validateEntity(entity);const key=revisionKey(entity);if(index.has(key))throw Error('Duplicate entity revision '+key);if(identityKinds.has(entity.id)&&identityKinds.get(entity.id)!==entity.kind)throw Error('UUID reused across entity kinds');identityKinds.set(entity.id,entity.kind);const owner=entity.kind==='LessonRevision'?entity.lessonId:entity.kind==='TopicRevision'?entity.topicId:null;if(owner){const ownerKey=entity.kind+':'+owner+'@'+entity.version;if(ownerRevisions.has(ownerKey))throw Error('Ambiguous owner revision '+ownerKey);ownerRevisions.add(ownerKey);}index.set(key,entity);}
 const get=(kind,id,version)=>{const e=index.get(kind+':'+id+(version?'@'+version:''));if(!e)throw Error('Broken reference '+kind+':'+id+(version?'@'+version:''));return e;};
 const getRef=(kind,r)=>get(kind,r.id,r.version);
 const evidence=refs=>refs.forEach(r=>getRef('EvidenceClaim',r));
 for(const e of bundle.entities){
  if(e.evidence)evidence(e.evidence);
  switch(e.kind){
   case 'SourceEdition':get('SourceWork',e.workId);break;
   case 'SourceLocator':get('SourceEdition',e.editionId);break;
   case 'EvidenceClaim':e.locatorIds.forEach(id=>get('SourceLocator',id));e.conflictsWith.forEach(r=>{getRef('EvidenceClaim',r);if(r.id===e.id&&r.version===e.version)throw Error('Self-conflicting evidence');});break;
   case 'TopicRevision':get('Topic',e.topicId);e.blockIds.forEach(id=>get('ContentBlock',id));e.objectiveIds.forEach(id=>get('LearningObjective',id));if(e.supersedes){const old=getRef('TopicRevision',e.supersedes);if(old.topicId!==e.topicId||old.id===e.id&&old.version===e.version)throw Error('Invalid topic supersession');}break;
   case 'TopicRelation':get('Topic',e.fromTopicId);get('Topic',e.toTopicId);if(e.fromTopicId===e.toTopicId)throw Error('Self topic relation');break;
   case 'LessonRevision':{
    get('LessonDefinition',e.lessonId);if(!e.topicRevisions.length)throw Error('Lesson must compose canonical topics');e.topicRevisions.forEach(r=>{const topic=getRef('TopicRevision',r);if(e.status==='published'&&topic.status!=='published')throw Error('Published lesson depends on unpublished topic');});e.additionalBlockIds.forEach(id=>get('ContentBlock',id));e.objectives.forEach(id=>get('LearningObjective',id));e.assessments.forEach(r=>{const template=getRef('AssessmentTemplate',r);if(e.status==='published'&&template.status!=='published')throw Error('Published lesson depends on unpublished assessment');});e.prerequisites.forEach(r=>getRef('LessonRevision',r));
    const desktop=e.labs.desktop?getRef('LabModuleReference',e.labs.desktop):null,mobile=e.labs.mobile?getRef('LabModuleReference',e.labs.mobile):null;
    if(desktop&&desktop.platform!=='desktop'||mobile&&mobile.platform!=='mobile')throw Error('Wrong practical platform');
    if(desktop&&mobile&&(desktop.id===mobile.id||desktop.activityIds.some(id=>mobile.activityIds.includes(id))))throw Error('Practical identities must be independent');
    if([...(desktop?.activityIds||[]),...(mobile?.activityIds||[])].some(id=>e.assessments.some(a=>a.id===id)))throw Error('Practical activity cannot duplicate common quiz identity');
    if(e.labs.completionPolicy==='both-platforms'&&(!desktop||!mobile)||e.labs.completionPolicy==='either-platform'&&!desktop&&!mobile)throw Error('Practical completion policy missing modules');
    if(e.supersedes){const old=getRef('LessonRevision',e.supersedes);if(old.lessonId!==e.lessonId||old.id===e.id&&old.version===e.version)throw Error('Invalid lesson supersession');}break;
   }
  }
 }
 function acyclic(edges,label){const graph=new Map();for(const [a,b] of edges){if(!graph.has(a))graph.set(a,[]);graph.get(a).push(b);}const visiting=new Set(),done=new Set();function visit(id){if(visiting.has(id))throw Error(label+' cycle');if(done.has(id))return;visiting.add(id);for(const next of graph.get(id)||[])visit(next);visiting.delete(id);done.add(id);}for(const id of graph.keys())visit(id);}
 const topics=bundle.entities.filter(e=>e.kind==='TopicRelation');
 acyclic(topics.filter(e=>e.relation==='prerequisite').map(e=>[e.fromTopicId,e.toTopicId]),'Prerequisite');
 acyclic(topics.filter(e=>['broader','narrower'].includes(e.relation)).map(e=>e.relation==='broader'?[e.fromTopicId,e.toTopicId]:[e.toTopicId,e.fromTopicId]),'Topic hierarchy');
 acyclic(bundle.entities.filter(e=>e.kind==='LessonRevision').flatMap(e=>e.prerequisites.map(r=>[revisionKey(e),'LessonRevision:'+r.id+'@'+r.version])),'Lesson prerequisite');
 return bundle;
}
