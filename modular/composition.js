// Renderer-neutral joins. No DOM, grading writes or duplicated simulation logic.
import {validateEntity} from './validation.js';

export function composeLesson(repository,revision){
 const require=(kind,id,version)=>{const e=repository.get(kind,id,version);if(!e)throw Error('Missing composition reference '+kind+':'+id);return e;};
 const lesson=require('LessonRevision',revision.id,revision.version),definition=require('LessonDefinition',lesson.lessonId);
 const topics=lesson.topicRevisions.map(r=>require('TopicRevision',r.id,r.version));
 const blocks=[...new Set([...topics.flatMap(t=>t.blockIds),...lesson.additionalBlockIds])].map(id=>require('ContentBlock',id));
 const objectives=[...new Set([...topics.flatMap(t=>t.objectiveIds),...lesson.objectives])].map(id=>require('LearningObjective',id));
 const assessments=lesson.assessments.map(r=>require('AssessmentTemplate',r.id,r.version));
 const labs={completionPolicy:lesson.labs.completionPolicy,desktop:lesson.labs.desktop?require('LabModuleReference',lesson.labs.desktop.id,lesson.labs.desktop.version):null,mobile:lesson.labs.mobile?require('LabModuleReference',lesson.labs.mobile.id,lesson.labs.mobile.version):null};
 const labDefinitions=Object.fromEntries(['desktop','mobile'].map(p=>[p,labs[p]?.definition?require('LabModuleDefinition',labs[p].definition.id,labs[p].definition.version):null]));
 const claimRefs=[...topics,...blocks,...objectives,...assessments,...[labs.desktop,labs.mobile].filter(Boolean),...Object.values(labDefinitions).filter(Boolean).flatMap(d=>d.activities)].flatMap(e=>e.evidence);
 const claims=new Map();const queue=[...claimRefs];while(queue.length){const r=queue.shift(),key=r.id+'@'+r.version;if(claims.has(key))continue;const e=require('EvidenceClaim',r.id,r.version);claims.set(key,e);queue.push(...e.conflictsWith);}
 const locators=[...new Set([...claims.values()].flatMap(c=>c.locatorIds))].map(id=>require('SourceLocator',id));
 const editions=[...new Set(locators.map(l=>l.editionId))].map(id=>require('SourceEdition',id));
 const sources=[...new Set(editions.map(e=>e.workId))].map(id=>require('SourceWork',id));
 return {definition,lesson,title:lesson.title||definition.title,description:lesson.description||definition.description,topics,blocks,objectives,assessments,evidence:[...claims.values()],locators,editions,sources,labs,labDefinitions};
}
export function presentationPlan(composition,profile,progressProjection){
 validateEntity(profile,'PresentationProfile');
 const known=new Set(profile.regions.flatMap(r=>r.blockTypes));
 if(composition.blocks.some(b=>!known.has(b.type)))throw Error('Presentation would silently omit semantic content');
 return {profile:{id:profile.id,version:profile.version,renderer:profile.renderer},lesson:{id:composition.definition.id,revisionId:composition.lesson.id,version:composition.lesson.version},regions:profile.regions.map(region=>({name:region.name,blocks:composition.blocks.filter(b=>region.blockTypes.includes(b.type))})),assessmentRefs:composition.lesson.assessments,labRefs:composition.lesson.labs,citations:composition.locators.map(l=>({id:l.id,citation:l.citation,verification:l.verification})),progress:structuredClone(progressProjection)};
}
export function validateLabCapabilities(composition,widgetLookup){
 for(const module of [composition.labs.desktop,composition.labs.mobile].filter(Boolean))for(const capability of module.capabilities)if(!widgetLookup(capability.widgetId,capability.version))throw Error('Unavailable registered lab capability: '+capability.widgetId+'@'+capability.version);
 return true;
}
