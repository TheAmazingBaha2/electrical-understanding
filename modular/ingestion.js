// Deterministic developer/private authoring proposals. No AI, fetching or mutations.
import {assertSerializable} from '../data-contract.js';
import {canonicalJSON,artifactHash} from './repositories.js';
import {validateEntity} from './validation.js';
import {privateScope} from './private-documents.js';
const normalize=t=>String(t).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
async function idFor(value){const namespace='ef8aa2455aac474db8ef004a397eab56',name=new TextEncoder().encode(canonicalJSON(value)),input=new Uint8Array(16+name.length);for(let i=0;i<16;i++)input[i]=parseInt(namespace.slice(i*2,i*2+2),16);input.set(name,16);const bytes=new Uint8Array(await crypto.subtle.digest('SHA-1',input)).slice(0,16);bytes[6]=(bytes[6]&15)|80;bytes[8]=(bytes[8]&63)|128;const h=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');return [h.slice(0,8),h.slice(8,12),h.slice(12,16),h.slice(16,20),h.slice(20)].join('-');}
export function ingestionContext(repo){return {topics:repo.list('Topic').map(t=>({...t,aliases:[...new Set([...t.aliases,...repo.list('TopicRevision').filter(r=>r.topicId===t.id).flatMap(r=>[r.title,...(r.aliases||[])].filter(Boolean))])]})),evidence:repo.list('EvidenceClaim'),editions:repo.list('SourceEdition'),locators:repo.list('SourceLocator'),lessons:repo.list('LessonDefinition')};}
function inputContract(input){
 assertSerializable(input);if(input.format!=='eu-ingestion-input@1'||Object.keys(input).some(k=>!['format','editionIds','items'].includes(k))||!Array.isArray(input.editionIds)||!Array.isArray(input.items)||!input.items.length||input.items.length>256)throw Error('Explicit bounded private authoring input required');
 for(const edition of input.editionIds)privateScope(edition,'source');const ids=new Set();
 for(const item of input.items){privateScope(item.id,'proposal');if(ids.has(item.id))throw Error('Duplicate supplied proposal identity');ids.add(item.id);
  if(Object.keys(item).some(k=>!['id','summary','locatorIds','topicHints','topicIds','lessonIds','intent','contradicts','objectives'].includes(k))||typeof item.summary!=='string'||!item.summary.trim()||item.summary.length>16000||!['fact','new-evidence','subtopic','new-lesson','split','merge'].includes(item.intent)||!['locatorIds','topicHints','topicIds','lessonIds','objectives','contradicts'].every(k=>Array.isArray(item[k])))throw Error('Malformed authoring proposal; original retained');
  for(const list of [item.locatorIds,item.topicIds,item.lessonIds])for(const id of list)privateScope(id,'reference');if([...item.topicHints,...item.objectives].some(x=>typeof x!=='string'||!x.trim()))throw Error('Topic/objective descriptions must be explicit');
  for(const r of item.contradicts){if(!r||Object.keys(r).sort().join(',')!=='id,version'||typeof r.version!=='string')throw Error('Explicit conflicting evidence reference required');privateScope(r.id,'evidence');}
 }
}
export class DeterministicIngestionProvider {
 async prepare(input,context){
  inputContract(input);const {topics=[],evidence=[],editions=[],locators=[],lessons=[]}=context;for(const e of [...topics,...evidence,...editions,...locators,...lessons])validateEntity(e);
  const inputHash=await artifactHash(input),contextHash=await artifactHash(context),batchId=await idFor(['ingestion@1',inputHash,contextHash]),batch={schemaVersion:3,kind:'IngestionBatch',id:batchId,editionIds:[...input.editionIds],inputHash,status:'proposed',gaps:[]},proposals=[],diffs=[];
  for(const item of input.items){
   const exactClaims=evidence.filter(e=>normalize(e.text)===normalize(item.summary)),hints=item.topicHints.map(normalize),matches=topics.filter(t=>item.topicIds.includes(t.id)||[t.title,...t.aliases].some(a=>hints.includes(normalize(a)))),knownLessons=lessons.filter(l=>item.lessonIds.includes(l.id));
   let decision='DEFER',confidence=0,reason='Taxonomy/evidence relation is insufficient; a human must resolve it.';
   const validCitation=input.editionIds.length&&input.editionIds.every(id=>editions.some(e=>e.id===id))&&item.locatorIds.length&&item.locatorIds.every(id=>locators.some(l=>l.id===id&&input.editionIds.includes(l.editionId)&&l.verification!=='unresolved'));
   const ambiguousHint=hints.some(h=>topics.filter(t=>[t.title,...t.aliases].some(a=>normalize(a)===h)).length>1);
   if(!validCitation){reason='Missing, ambiguous or unresolved source/edition locator; no page or passage inferred.';batch.gaps.push(item.id+': '+reason);}
   else if(ambiguousHint||item.topicIds.some(id=>!topics.some(t=>t.id===id))||item.lessonIds.some(id=>!lessons.some(l=>l.id===id))){reason='Ambiguous alias or unknown canonical identity; review before reuse.';batch.gaps.push(item.id+': '+reason);}
   else if(item.contradicts.length){const targets=item.contradicts.map(r=>evidence.find(e=>e.id===r.id&&e.version===r.version));if(targets.every(Boolean)&&targets.every(t=>normalize(t.text)!==normalize(item.summary))){decision='CONFLICT';confidence=1;reason='Author explicitly identifies differing evidence; preserve both claims and citations for technical review. No automatic correction.';}else reason='Contradiction target missing or identical; conflict cannot be inferred.';}
   else if(item.intent==='split'&&knownLessons.length===1&&matches.length>=2&&item.objectives.length>=2){decision='SPLIT_LESSON';confidence=.75;reason='Explicit one-lesson/multiple-topic proposal with distinct supplied objectives; assess coherence, migration and grade effects before any split.';}
   else if(item.intent==='merge'&&knownLessons.length>=2&&matches.length){decision='MERGE_LESSONS';confidence=.75;reason='Explicit multiple-lesson proposal; preserve their identities/history and review concept/grade coverage before any merge.';}
   else if(item.intent==='new-lesson'&&!knownLessons.length&&item.objectives.length){decision='CREATE_LESSON';confidence=.75;reason='Author proposes a coherent new objective grouping; check existing lesson coverage and prerequisites before creating it.';}
   else if(item.intent==='subtopic'&&matches.length===1){decision='CREATE_SUBTOPIC';confidence=.8;reason='Explicit narrower-concept proposal under an identified canonical topic; no hierarchy mutation is applied.';}
   else if(exactClaims.length&&matches.length===1){const newLocator=item.locatorIds.some(id=>!exactClaims.some(e=>e.locatorIds.includes(id)));decision=newLocator?'EXTEND_TOPIC':'DUPLICATE';confidence=1;reason=newLocator?'Same recorded claim with additional source evidence; extend evidence on the existing topic rather than duplicate the lesson.':'Same normalized claim and recorded citations; propose reuse of the existing fact.';}
   else if(matches.length===1&&['fact','new-evidence'].includes(item.intent)){decision='EXTEND_TOPIC';confidence=.8;reason='An explicit unambiguous canonical topic matches; proposed new explanation/evidence still needs source and educational review.';}
   else if(!matches.length&&item.intent==='fact'){decision='CREATE_TOPIC';confidence=.7;reason='No exact title/alias identity matched; candidate new concept only. Similarity is not proof that a new topic is necessary.';}
   const refs=[...exactClaims,...evidence.filter(e=>item.contradicts.some(r=>r.id===e.id&&r.version===e.version))].map(e=>({id:e.id,version:e.version}));
   const proposal={schemaVersion:3,kind:'IngestionProposal',id:await idFor([batchId,item.id]),batchId,decision,confidence,reason,existingTopicIds:matches.map(t=>t.id).sort(),evidence:refs,proposedEntityIds:[item.id],review:'pending'};validateEntity(proposal);proposals.push(proposal);
   diffs.push({proposalId:proposal.id,inputItemId:item.id,decision,before:exactClaims.map(e=>({id:e.id,version:e.version,text:e.text,locatorIds:e.locatorIds})),proposedText:item.summary,locatorIds:[...item.locatorIds],topicIds:proposal.existingTopicIds,lessonIds:[...item.lessonIds],objectives:[...item.objectives],gradeImpact:'UNKNOWN — requires explicit equivalence/rubric review; no credit transferred',requiredReviews:['source-rights','source/edition','technical','educational','owner'],reason});
  }
  validateEntity(batch);return {batch,proposals,diffs,contextHash};
 }
 validate(batch,proposals){const issues=[];try{validateEntity(batch,'IngestionBatch');const ids=new Set();for(const p of proposals){validateEntity(p,'IngestionProposal');if(p.batchId!==batch.id||ids.has(p.id)||p.review!=='pending')throw Error('Proposal batch/identity/pending review mismatch');ids.add(p.id);}}catch(e){issues.push(e.message);}return {valid:issues.length===0,issues};}
}
