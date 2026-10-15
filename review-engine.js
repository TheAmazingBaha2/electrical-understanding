import {additionCompletion} from './study-additions.js';
import {isLegacyClassifier} from './foundation-continuation-model.js';
import {allStudyItems,studyPresentation,answerStudyItem} from './study-bank.js';
export const REVIEW_POLICY=Object.freeze({id:'introduced-practice@1',intervalDays:[1,3,7,14,30],retainingSuccesses:3,defaultTasks:5,maxTasks:6});
export const DAY_MS=86400000;
export function orderedEvents(events){return [...events].sort((a,b)=>a.at.localeCompare(b.at)||(a.type==='introduction'?0:1)-(b.type==='introduction'?0:1)||a.id.localeCompare(b.id));}
export function introducedConcepts(events){return new Set(events.filter(e=>e.type==='introduction').flatMap(e=>e.conceptIds));}
export function conceptEvidence(events,{now=Date.now(),policy=REVIEW_POLICY}={}) {
 const states={};
 for(const e of orderedEvents(events)) {
  if(e.type==='introduction')for(const id of e.conceptIds)states[id]??={id,introducedAt:e.at,attempts:0,independent:0,assisted:0,misses:0,qualifying:0,stage:-1,variants:[],needsPractice:false,dueAt:null,lastSpacingAdvancementAt:null,lastMissAt:null,presentations:{}};
  if(e.type!=='attempt')continue;
  const id=e.item.primaryConceptId,s=states[id];if(!s)continue;
  if(e.item.practiceCoverage?.kind==='limited-supplement')s.limitedCoverage=true;
  const at=Date.parse(e.at),previous=s.presentations[e.item.variantId];s.attempts++;s[e.assisted?'assisted':'independent']++;
  s.presentations[e.item.variantId]=at;s.lastAttemptAt=e.at;
  if(!e.result.correct){s.misses++;s.needsPractice=true;s.lastMissAt=at;s.misconception=e.result.misconception;s.qualifying=0;s.variants=[];s.stage=-1;s.dueAt=at+policy.intervalDays[0]*DAY_MS;continue;}
  if(e.assisted||(previous!==undefined&&at-previous<DAY_MS)||(s.lastSpacingAdvancementAt!==null&&at-s.lastSpacingAdvancementAt<DAY_MS)||(s.lastMissAt!==null&&at-s.lastMissAt<DAY_MS))continue;
  s.qualifying++;s.stage=Math.min(s.stage+1,s.limitedCoverage?0:policy.intervalDays.length-1);s.variants=[...new Set([...s.variants,e.item.variantId])];s.needsPractice=false;s.lastSpacingAdvancementAt=at;s.dueAt=at+policy.intervalDays[s.stage]*DAY_MS;
 }
 for(const s of Object.values(states)){s.label=s.needsPractice?'Needs practice':s.limitedCoverage?'Limited coverage':s.qualifying>=policy.retainingSuccesses&&s.variants.length>=2?'Retaining':s.qualifying?'Building confidence':'Introduced';s.ready=s.dueAt!==null&&s.dueAt<=now;}
 return states;
}
export function eligibleStudyItems(bank,events) {
 if(!bank?.approved)return [];
 const introduced=introducedConcepts(events);
 return allStudyItems(bank).filter(i=>!i.retired&&i.requiresIntroducedConceptIds.every(c=>introduced.has(c)));
}
export function reviewCandidates(bank,events,{now=Date.now(),exclude=[]}={}) {
 const stats=conceptEvidence(events,{now}),flags={};for(const e of orderedEvents(events))if(e.type==='flag')flags[e.conceptId]=e.flagged;
 const previous={};for(const e of events)if(e.type==='attempt')previous[e.item.variantId]=Math.max(previous[e.item.variantId]||0,Date.parse(e.at));
 const expanded=eligibleStudyItems(bank,events).flatMap(i=>isLegacyClassifier(i)?i.config.cases.map(c=>({...i,variantId:(i.variantId||i.id+'@'+i.revision)+':case='+c.id,config:{...i.config,cases:[c]}})):[i]);
 return expanded.filter(i=>!exclude.includes(i.variantId||i.id+'@'+i.revision)).map(i=>{
  const s=stats[i.primaryConceptId],v=i.variantId||i.id+'@'+i.revision,last=previous[v]||0;
  const reason=s.needsPractice?'recent error':s.ready?'ready for another look':flags[i.primaryConceptId]?'you flagged this':'recently introduced';
  const limited=bank.concepts.find(c=>c.id===i.primaryConceptId)?.practiceCoverage;
  return {item:i,last,reason:reason+(limited?' · limited supplemental coverage: '+limited.reason:'')+(last&&now-last<DAY_MS?' · repeated item, same-day practice cannot advance spacing':''),priority:s.needsPractice?0:s.ready?1:flags[i.primaryConceptId]?2:3};
 }).sort((a,b)=>a.priority-b.priority||a.last-b.last||a.item.id.localeCompare(b.item.id));
}
export function startReview(bank,events,{id,at,limit=5,interactive=false}={}) {
 if(!id||!Number.isFinite(Date.parse(at))||!Number.isInteger(limit)||limit<4||limit>6)throw Error('Review needs an identity, timestamp and a 4–6 task budget');
 const pool=reviewCandidates(bank,events,{now:Date.parse(at)}),chosen=[],concepts=new Set();let widgets=0;
 for(const candidate of pool){const i=candidate.item;if(chosen.length===limit)break;if(concepts.has(i.primaryConceptId)||(!interactive&&i.kind==='widget_challenge'&&widgets))continue;
  // Prefer selectable checks; a compact challenge fills a gap rather than opening a full lab.
  if(i.kind==='widget_challenge'&&pool.some(x=>x.item.kind==='single_choice'&&x.item.primaryConceptId===i.primaryConceptId))continue;
  chosen.push(candidate);concepts.add(i.primaryConceptId);if(i.kind==='widget_challenge')widgets++;
 }
 if(!widgets&&chosen.length>1){const last=chosen.at(-1),compact=pool.find(x=>x.item.kind==='widget_challenge'&&x.item.primaryConceptId===last.item.primaryConceptId);if(compact)chosen[chosen.length-1]=compact;}
 return {id,at,budget:limit,cursor:0,repairs:{},status:chosen.length?'active':'finished',tasks:chosen.map((x,index)=>({id:id+'.'+index,item:studyPresentation(bank,x.item,id+'.'+index),reason:x.reason,assisted:false,parentAttemptId:null,phase:'prediction'}))};
}
export function makeStudyAttempt({id,sessionId,item,answer,at,assisted=false,parentAttemptId=null,caseId=null,working=null}) {
 if(!id||!sessionId||!Number.isFinite(Date.parse(at)))throw Error('Attempt identity/time required');
 const frozen=structuredClone(item);if(caseId&&!frozen.variantId?.endsWith(':case='+caseId))frozen.variantId=(frozen.variantId||frozen.id+'@'+frozen.revision)+':case='+caseId;
 return {id,type:'attempt',at,sessionId,item:frozen,answer:structuredClone(answer),result:answerStudyItem(frozen,answer,{caseId}),assisted:!!assisted,parentAttemptId,caseId,working:working?structuredClone(working):null,sourceIds:[...item.sourceIds]};
}
export function repairReview(bank,events,session,attempt) {
 const next=structuredClone(session),task=next.tasks[next.cursor];if(!task||task.id!==attempt.taskId)throw Error('Attempt does not target the current review task');
 task.attemptId=attempt.id;task.phase='feedback';task.firstAnswer=structuredClone(attempt.answer);
 const concept=attempt.item.primaryConceptId;
 if(!attempt.result.correct&&!next.repairs[concept]&&next.cursor+1<next.budget) {
  const excluded=next.tasks.map(t=>t.item.variantId),candidate=reviewCandidates(bank,events,{now:Date.parse(attempt.at),exclude:excluded}).find(x=>x.item.primaryConceptId===concept&&x.item.kind==='single_choice'&&x.item.variantFamilyId!==attempt.item.variantFamilyId);
  if(candidate){const t={id:next.id+'.repair.'+concept,item:studyPresentation(bank,candidate.item,next.id+'.repair.'+concept),reason:'assisted comparison after a recent error',assisted:true,parentAttemptId:attempt.id,phase:'prediction'};next.tasks.splice(next.cursor+1,0,t);next.tasks=next.tasks.slice(0,next.budget);next.repairs[concept]=1;}
 }
 return next;
}
export function lessonCompletion(lesson,state,events) {
 if(lesson.supplemental)return additionCompletion(lesson,state,events);
 const acknowledged=new Set(state?.acknowledged||[]),requiredSteps=[...(lesson.preparation||[]),...lesson.steps].filter(s=>!s.optional);
 const attempts=events.filter(e=>e.type==='attempt'&&e.sessionId===state?.id),checks=state?.requiredItems?.map(i=>i.id)||lesson.requiredIds;
 if(lesson.kind==='recap')return {complete:!!state?.started&&checks.length>0&&checks.every(id=>attempts.some(a=>a.item.id===id)),stepsDone:0,stepsTotal:0,checksDone:checks.filter(id=>attempts.some(a=>a.item.id===id)).length,checksTotal:checks.length,activityAttempted:false};
 const a=state?.activity,activity=!!a?.comparisonAttempted&&(a.caseCount? a.caseAnswers.length>=a.caseCount&&a.caseAnswers.every(c=>attempts.some(e=>e.id===c.attemptId&&e.item.id===lesson.challengeId)):a.attemptedWorking?.actionCount>=a.minimumActions&&attempts.some(e=>e.id===a.attemptId&&e.item.id===lesson.challengeId));
 return {complete:requiredSteps.every(s=>acknowledged.has(s.id))&&activity&&checks.every(id=>attempts.some(a=>a.item.id===id)),stepsDone:requiredSteps.filter(s=>acknowledged.has(s.id)).length,stepsTotal:requiredSteps.length,checksDone:checks.filter(id=>attempts.some(a=>a.item.id===id)).length,checksTotal:checks.length,activityAttempted:!!activity};
}
