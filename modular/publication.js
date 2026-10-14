// Developer-controlled publication review; no network, upload, signing or auto-approval.
import {validateBundle,revisionKey} from './validation.js';
import {ContentRepository,artifactHash,orderedBundle,canonicalJSON} from './repositories.js';
import {composeLesson,presentationPlan,validateLabCapabilities} from './composition.js';
import {assertSerializable} from '../data-contract.js';
const ref=e=>({id:e.id,version:e.version});
export function publicationDiff(previous,next){
 next=orderedBundle(next);if(previous)previous=orderedBundle(previous);
 const before=new Map((previous?.entities||[]).map(e=>[revisionKey(e),e])),after=new Map(next.entities.map(e=>[revisionKey(e),e]));
 const added=[...after.keys()].filter(k=>!before.has(k)).sort(),removed=[...before.keys()].filter(k=>!after.has(k)).sort(),changed=[...after.keys()].filter(k=>before.has(k)&&canonicalJSON(before.get(k))!==canonicalJSON(after.get(k))).sort();
 const grading=e=>e.kind==='AssessmentTemplate'?e:e.kind==='LabModuleDefinition'?e:e.kind==='LessonRevision'?{id:e.id,version:e.version,assessments:e.assessments,labs:e.labs,objectives:e.objectives,reviewPolicy:e.reviewPolicy||null}:null;
 return {content:{added,removed,changed},grading:{previous:(previous?.entities||[]).map(grading).filter(Boolean),next:next.entities.map(grading).filter(Boolean)},immutableConflicts:changed};
}
export async function preparePublication(bundle,{previous=null,target='private'}={}){
 if(!['private','public'].includes(target))throw Error('Unknown publication target');
 const ordered=orderedBundle(bundle),diff=publicationDiff(previous,ordered);
 return {format:'eu-publication-review@1',target,bundleHash:await artifactHash(ordered),previousBundleHash:previous?await artifactHash(orderedBundle(previous)):null,contentDiffHash:await artifactHash(diff.content),gradeDiffHash:await artifactHash(diff.grading),lessonRevisions:ordered.entities.filter(e=>e.kind==='LessonRevision'&&e.status==='published').map(ref),profiles:ordered.entities.filter(e=>e.kind==='PresentationProfile').map(ref),reviews:[],rights:[],editionReviews:[],locatorReviews:[],rollback:{previousBundleHash:previous?await artifactHash(orderedBundle(previous)):null,procedure:'Retain old bundle and private records; restore content pointer explicitly. Do not rewrite past attempts.'}};
}
const validReview=r=>r&&typeof r.reviewer==='string'&&r.reviewer.trim()&&typeof r.rationale==='string'&&r.rationale.trim()&&Number.isFinite(Date.parse(r.reviewedAt));
export async function inspectPublication(bundle,manifest,{previous=null,widgetLookup=()=>null}={}){
 const issues=[];try{validateBundle(bundle);assertSerializable(manifest);}catch(e){return {valid:false,issues:[e.message]};}
 let candidate;try{candidate=await preparePublication(bundle,{previous,target:manifest.target});}catch(e){return {valid:false,issues:[e.message]};}
 if(manifest.format!==candidate.format||Object.keys(manifest).sort().join(',')!==Object.keys(candidate).sort().join(','))issues.push('Unknown publication manifest format/fields');
 for(const k of ['bundleHash','previousBundleHash','contentDiffHash','gradeDiffHash','lessonRevisions','profiles','rollback'])if(canonicalJSON(manifest[k]??null)!==canonicalJSON(candidate[k]))issues.push('Review does not bind exact '+k);
 for(const role of ['technical','educational','owner','source-rights'])if(!manifest.reviews?.some(r=>r.role===role&&r.decision==='approved'&&validReview(r)))issues.push('Missing explicit '+role+' approval');
 if(publicationDiff(previous,bundle).immutableConflicts.length)issues.push('Previously identified immutable content changed');
 const text=canonicalJSON(bundle);if(/eu-private-scans|service_role|sb_secret_[A-Za-z0-9_-]+|\/storage\/v1\/object\/(?:sign|authenticated)|-----BEGIN .*PRIVATE KEY-----/i.test(text))issues.push('Private storage reference or secret-like material is not publishable');
 const repo=new ContentRepository();repo.importBundle(bundle);
 if(!candidate.lessonRevisions.length)issues.push('No published lesson revision selected');
 if(!candidate.profiles.length)issues.push('No compatible presentation profile');
 for(const edition of repo.list('SourceEdition')){
  const rights=manifest.rights?.find(r=>r.editionId===edition.id);if(!rights||!validReview(rights)||!['private-use','public-redistributable'].includes(rights.decision)||manifest.target==='public'&&rights.decision!=='public-redistributable')issues.push('Missing source-rights decision for edition '+edition.id);
  const review=manifest.editionReviews?.find(r=>r.editionId===edition.id);if(!review||!validReview(review)||!['verified','unknown-explicitly-accepted'].includes(review.decision)||(!edition.edition&&review.decision!=='unknown-explicitly-accepted'))issues.push('Edition status needs explicit review '+edition.id);
 }
 for(const locator of repo.list('SourceLocator'))if(!manifest.locatorReviews?.some(r=>r.locatorId===locator.id&&validReview(r)&&r.decision===(locator.verification==='source-verified'?'source-verified':'preserved-reference-accepted')&&locator.verification!=='unresolved'))issues.push('Locator needs traceable review '+locator.id);
 for(const lesson of repo.list('LessonRevision').filter(e=>e.status==='published')){
  const c=composeLesson(repo,ref(lesson));
  if(!c.objectives.length||!c.assessments.length||!c.assessments.some(t=>t.safety))issues.push('Objectives, core assessments and safety checks required');
  if(!lesson.reviewPolicy)issues.push('Explicit common review policy required');
  if(c.evidence.some(e=>['under-review','disputed','historical','superseded'].includes(e.state)))issues.push('Unreviewed/conflicting evidence in published lesson');
  if(c.assessments.some(t=>!t.objectiveIds?.length||!t.evidence.length))issues.push('Assessment objective/evidence coverage missing');
  for(const platform of ['desktop','mobile']){const d=c.labDefinitions[platform];if(!d||d.status!=='published'||d.activities.some(a=>!a.objectiveIds.length||!a.evidence.length))issues.push('Independent reviewed '+platform+' practical definitions required');}
  const assessed=[...c.assessments,...Object.values(c.labDefinitions).filter(Boolean).flatMap(d=>d.activities)].flatMap(a=>a.objectiveIds||[]);
  if(c.objectives.some(o=>!assessed.includes(o.id))||assessed.some(id=>!c.objectives.some(o=>o.id===id)))issues.push('Objective coverage is incomplete or references another lesson objective');
  try{validateLabCapabilities(c,widgetLookup);for(const profile of repo.list('PresentationProfile'))presentationPlan(c,profile,{});}catch(e){issues.push(e.message);}
 }
 return {valid:issues.length===0,issues,bundleHash:candidate.bundleHash,manifestHash:await artifactHash(manifest)};
}
export async function requirePublication(bundle,manifest,options){const result=await inspectPublication(bundle,manifest,options);if(!result.valid)throw Error('Publication blocked: '+result.issues.join('; '));return result;}
