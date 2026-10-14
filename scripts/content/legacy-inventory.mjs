// Inventory existing repository artifacts only. Never reads accounts, remote data or scans.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {lessons} from '../../lessons.js';
import {labLessons} from '../../lab-lessons.js';
import {bookLessons} from '../../book-lessons.js';
import {geierWorkshops,reviseDmmLessons} from '../../geier-workshops.js';
import {cetaLessons} from '../../ceta-lessons.js';
import {mathLessons} from '../../math-lessons.js';
import {preservedLessons} from '../../approved-lessons.js';
import {publishedLessons} from '../../published-lessons.js';
import {learningSources,placementForLesson,lessonReferencePages} from '../../learning-structure.js';
import {lessonActivities} from '../../lesson-tabs.js';
import {canonicalJSON} from '../../modular/repositories.js';
import {validateEntity} from '../../modular/validation.js';

// Legacy renderer objects contain optional undefined fields. Fingerprint their JSON
// representation without rewriting the originals; raw module hashes preserve bytes.
const digest=value=>createHash('sha256').update(typeof value==='string'?value:canonicalJSON(JSON.parse(JSON.stringify(value)))).digest('hex');
// RFC 9562 UUIDv5: reproducible migration identity, not a source storage identifier.
export function migrationId(name){const namespace=Buffer.from('684e518783ae4ca6823194cb13fde5d1','hex'),bytes=createHash('sha1').update(namespace).update(name).digest().subarray(0,16);bytes[6]=(bytes[6]&15)|80;bytes[8]=(bytes[8]&63)|128;const hex=bytes.toString('hex');return [hex.slice(0,8),hex.slice(8,12),hex.slice(12,16),hex.slice(16,20),hex.slice(20)].join('-');}
export function legacyRuntimeInventory(){
 return [...lessons,...labLessons,...reviseDmmLessons(bookLessons),...geierWorkshops,...cetaLessons,...mathLessons,...preservedLessons,...publishedLessons];
}
export async function buildLegacyInventory(){
 const runtime=legacyRuntimeInventory();if(new Set(runtime.map(l=>l.id)).size!==runtime.length)throw Error('Runtime lesson ID collision; review actual routes');
 const mappings=[],sourceCandidates=new Map(),lessonRows=[];
 function mapping(kind,legacyId,lesson,hash){const entry={schemaVersion:3,kind:'LegacyMapping',id:migrationId(kind+':'+lesson.id+':'+legacyId),legacyKind:kind,legacyId,lessonId:lesson.id,sourceArtifactHash:hash,disposition:'REQUIRES_REVIEW',targets:[],credit:'none',notes:'Inventory only; legacy content and historical progress remain live. No migration credit inferred.'};validateEntity(entry);mappings.push(entry);}
 for(const lesson of runtime){
  const hash=digest(lesson),placement=placementForLesson(lesson),pageLabel=lessonReferencePages(lesson),source=learningSources.find(s=>s.id===placement.source_id);
  const independent=pageLabel==='Original practice · no book pages';
  if(!independent&&!sourceCandidates.has(placement.source_id))sourceCandidates.set(placement.source_id,{key:placement.source_id,title:source?.book||placement.source_title||lesson.module||'Unresolved source title',edition:placement.source_id==='geier'?'Third edition':null,editionVerifiedFrom:'repository metadata; original binary not inspected',lessonIds:[],pageLabels:[],status:'requires-source-review'});
  if(!independent){const candidate=sourceCandidates.get(placement.source_id);candidate.lessonIds.push(lesson.id);if(!candidate.pageLabels.includes(pageLabel))candidate.pageLabels.push(pageLabel);}
  mapping('lesson',lesson.id,lesson,hash);
  const questionIds=(lesson.questions||[]).map(q=>q.id);if(new Set(questionIds).size!==questionIds.length||questionIds.some(id=>!id))throw Error('Missing/duplicate question identity in '+lesson.id);
  for(const id of questionIds)mapping('question',id,lesson,hash);
  const activities=lessonActivities(lesson).map((a,i)=>({id:a.id||'implicit-activity:'+i,identityOrigin:a.id?'explicit':'legacy-renderer-position',kind:a.kind||'unknown',hash:digest(a)}));
  for(const a of activities)mapping('activity',a.id,lesson,hash);
  const references=[...new Set([...(lesson.teachingSections||[]).flatMap(s=>s.source_ids||[]),...(lesson.questions||[]).flatMap(q=>q.source_ids||[]),...(lesson.activities||[]).flatMap(a=>a.source_ids||[]),...(lesson.activities||[]).map(a=>a.pages).filter(Boolean)])];
  // Page-level citations are independent dependencies even without evidence IDs.
  if(!independent)references.push('printed-reference:'+pageLabel);
  for(const id of new Set(references))mapping('source-reference',id,lesson,hash);
  lessonRows.push({id:lesson.id,title:lesson.title,archived:Boolean(lesson.archived),preservedApproval:preservedLessons.some(l=>l.id===lesson.id),artifactHash:hash,gradingHash:digest(lesson.questions||[]),placement,pageLabel,sourceCandidate:independent?null:placement.source_id,questionIds,activities,sourceReferenceIds:[...new Set(references)],safetyQuestionIds:(lesson.questions||[]).filter(q=>q.safety).map(q=>q.id),topicCandidates:[lesson.title],disposition:'REQUIRES_REVIEW',progressDependencies:['answers','complete','attempts','reviewDue',...(lesson.workshop?['workshopChecks']:[]),...(lesson.labs?['labModules.desktop','labModules.mobile']:[])]});
 }
 const structured=JSON.parse(await readFile(new URL('../../content/approved/source-jobs.json',import.meta.url),'utf8'));
 const sourceAnalysis={artifactHash:digest(structured),jobCount:structured.jobs.length,factCount:structured.jobs.reduce((n,j)=>n+(j.analysis?.facts?.length||0),0),equationCount:structured.jobs.reduce((n,j)=>n+(j.analysis?.equations?.length||0),0),safetyNoteCount:structured.jobs.reduce((n,j)=>n+(j.analysis?.safety_notes?.length||0),0),recordedGaps:structured.jobs.reduce((n,j)=>n+(j.analysis?.gaps?.length||0),0),evidenceMigrated:0,verification:'Preserved structured artifact inspected; unavailable raw PDF not verified. No raw/job/account identifiers copied into this report.'};
 const fileHashes=[];for(const path of ['lessons.js','lab-lessons.js','book-lessons.js','geier-workshops.js','ceta-lessons.js','math-lessons.js','approved-lessons.js','published-lessons.js','content/approved/source-jobs.json'])fileHashes.push({path,hash:digest(await readFile(new URL('../../'+path,import.meta.url),'utf8'))});
 return {schemaVersion:3,report:'legacy-migration-inventory',fileHashes,totals:{legacyLessons:runtime.length,legacyQuestions:lessonRows.reduce((n,l)=>n+l.questionIds.length,0),preservedApprovedLessons:preservedLessons.length,preservedApprovedQuestions:preservedLessons.reduce((n,l)=>n+l.questions.length,0),activities:lessonRows.reduce((n,l)=>n+l.activities.length,0),sourceCandidates:sourceCandidates.size,knownEditionLabels:[...sourceCandidates.values()].filter(s=>s.edition).length,sourceReferences:lessonRows.reduce((n,l)=>n+l.sourceReferenceIds.length,0),safetyCriticalQuestions:lessonRows.reduce((n,l)=>n+l.safetyQuestionIds.length,0),migratedLessons:0,requiresReview:mappings.length},sources:[...sourceCandidates.values()],sourceAnalysis,topicReview:{candidates:lessonRows.map(l=>({lessonId:l.id,title:l.title})),duplicateConcepts:'not classified',unmappedConcepts:'all candidates require canonical topic review',conflicts:'not independently assessed; absence of recorded conflicts is not evidence of agreement'},lessons:lessonRows,mappings,demolitionAllowed:false};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const report=await buildLegacyInventory();await writeFile(new URL('../../content/modular/legacy-inventory.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.totals));
}
