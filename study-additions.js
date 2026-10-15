// Transitional study-bank adapter for the canonical modular UUID/alias registry.
// Uses the existing StudyStore/journal; optional requirements never enter core.
import {UUID_PATTERN,VERSION_PATTERN} from './data-contract.js';
import {studyState,evidenceEvents} from './study-journal.js';
const uuid=new RegExp(UUID_PATTERN),version=new RegExp(VERSION_PATTERN);
export function canonicalHome(bank,id){return (bank.canonicalLessons||[]).find(l=>l.id===id||l.aliases.includes(id));}
export function validateStudyAdditions(bank){
 const homes=new Set(),aliases=new Set();for(const l of bank.canonicalLessons||[]){if(!uuid.test(l.id)||homes.has(l.id)||!Array.isArray(l.aliases)||l.aliases.some(a=>typeof a!=='string'||aliases.has(a)))throw Error('Invalid canonical UUID/alias registry');homes.add(l.id);for(const a of l.aliases)aliases.add(a);}
 const identities=new Set();
 for(const a of bank.additions||[]){
  const key=a.id+'@'+a.version;if(!uuid.test(a.id)||!version.test(a.version)||identities.has(key)||homes.has(a.id)||bank.lessons.some(l=>l.id===a.id)||!homes.has(a.homeLessonId)||!a.title||!Array.isArray(a.importAliases)||!a.importAliases.length)throw Error('Invalid supplemental identity, version or canonical home');identities.add(key);
  if(!Array.isArray(a.sourceIds)||!a.sourceIds.length||a.sourceIds.some(id=>!bank.sources.some(s=>s.id===id)))throw Error('Unresolved addition sources');
  if(!Number.isInteger(a.requiredCheckCount)||a.requiredCheckCount<1||!Array.isArray(a.questionPoolIds)||new Set(a.questionPoolIds).size!==a.questionPoolIds.length||a.requiredCheckCount>a.questionPoolIds.length||a.questionPoolIds.some(id=>!bank.questions.some(q=>q.id===id)))throw Error('Invalid finite addition requirements');
  if(!['either-platform','both-platforms'].includes(a.completionPolicy)||!a.variants||!a.teaching?.steps?.length)throw Error('Authored addition teaching and practical variants required');
  if(a.variants.desktop?.challengeId===a.variants.mobile?.challengeId)throw Error('Platform variants need independent authored challenge identities');
  const activityIds=new Set();for(const p of ['desktop','mobile']){const v=a.variants[p];if(!v||!uuid.test(v.id)||!version.test(v.version)||activityIds.has(v.id)||!bank.challenges.some(c=>c.id===v.challengeId))throw Error('Independent authored platform activity required');activityIds.add(v.id);}
 }
}
export function additionAssets(bank){return (bank?.additions||[]).map(a=>({...a.teaching,id:a.id,title:a.title,contentRevision:a.version,studyModule:true,supplemental:true,addition:a,canonicalLessonId:a.homeLessonId,sourceIds:a.sourceIds,requiredIds:a.questionPoolIds.slice(0,a.requiredCheckCount),challengeId:a.variants.desktop.challengeId,questions:[],independent:true,subtrack:'private-study',curriculum:{...a.teaching.curriculum,section:'lessons'}}));}
export const additionTarget=lesson=>'addition.'+lesson.id+'@'+lesson.contentRevision;
export function additionActivityComplete(activity,attempts,challengeId){return !!activity?.comparisonAttempted&&activity.attemptedWorking?.actionCount>=activity.minimumActions&&attempts.some(a=>a.id===activity.attemptId&&a.item.id===challengeId);}
export function additionCompletion(lesson,state,events){
 const a=lesson.addition,attempts=events.filter(e=>e.type==='attempt'&&e.sessionId===state?.id&&e.scope?.kind==='addition'&&e.scope.id===a.id&&e.scope.version===a.version),platform={};
 for(const p of ['desktop','mobile']){const activity=state?.platform===p?state.activity:state?.practical?.[p];platform[p]={complete:additionActivityComplete(activity,attempts,a.variants[p].challengeId),attempts:attempts.filter(e=>e.scope.platform===p),activity};}
 const checks=state?.requiredItems?.map(q=>q.id)||[],checksDone=checks.filter(id=>attempts.some(e=>e.item.id===id&&e.scope.platform==='shared')).length,steps=lesson.steps.filter(s=>!s.optional),stepsDone=steps.filter(s=>state?.acknowledged?.includes(s.id)).length,activityAttempted=a.completionPolicy==='either-platform'?platform.desktop.complete||platform.mobile.complete:platform.desktop.complete&&platform.mobile.complete;
 return {complete:checks.length===a.requiredCheckCount&&checksDone===checks.length&&stepsDone===steps.length&&activityAttempted,checksDone,checksTotal:checks.length,stepsDone,stepsTotal:steps.length,activityAttempted,platform,attempts};
}
export function additionGauge(lesson,state,events){const c=additionCompletion(lesson,state,events),done=c.checksDone+Number(c.activityAttempted&&c.stepsDone===c.stepsTotal),total=lesson.addition.requiredCheckCount+1;return {...c,done,total,percent:Math.round(done/total*100),correct:c.attempts.filter(a=>a.scope.platform==='shared'&&a.result.correct&&!a.assisted).length,assisted:c.attempts.filter(a=>a.assisted).length,misses:c.attempts.filter(a=>!a.result.correct).length};}
export function renderAdditionCards(bank,journal,homeId,{escape:e,context='lesson'}={}){
 if(!bank?.additions?.length)return '';const home=canonicalHome(bank,homeId);if(!home)return '';
 const all=additionAssets(bank).filter(l=>l.canonicalLessonId===home.id);if(!all.length)return '';
 const byId=new Map();for(const l of all){const entries=byId.get(l.id)||[];entries.push(l);byId.set(l.id,entries);}
 let enrolledDone=0,enrolledTotal=0;
 const cards=[...byId.values()].map(versions=>{
  const enrolled=versions.filter(l=>studyState(journal,additionTarget(l)).candidates.length),earned=enrolled.filter(l=>additionCompletion(l,studyState(journal,additionTarget(l)).value,evidenceEvents(journal)).complete),active=earned.at(-1)||enrolled.at(-1)||versions.at(-1),saved=studyState(journal,additionTarget(active)),g=additionGauge(active,saved.value,evidenceEvents(journal));
  if(enrolled.length){enrolledTotal++;if(earned.length)enrolledDone++;}
  const newer=versions.some(l=>!enrolled.includes(l)&&l!==active);
  return '<article class="study-addition-card" data-addition="'+e(active.id)+'"><h5>'+e(active.title)+'</h5><p>'+g.done+' / '+g.total+' requirements · '+(g.complete?'Completed at earned revision '+e(active.contentRevision):saved.candidates.length?'In progress':'Not started')+'</p><progress max="'+g.total+'" value="'+g.done+'" aria-label="Addition completion"></progress><button class="outline" data-goto="addition" data-lesson="'+e(active.id)+'" data-revision="'+e(active.contentRevision)+'">Continue addition</button>'+(newer?'<p>New additions available · earned completion is retained.</p><button class="outline" data-goto="addition" data-lesson="'+e(versions.at(-1).id)+'" data-revision="'+e(versions.at(-1).contentRevision)+'">Explore new optional revision</button>':'')+'<details><summary>Practice results and platform activity</summary><p>'+g.correct+' correct independent checks · '+g.misses+' misses · '+g.assisted+' assisted responses.</p><p>Desktop '+(g.platform.desktop.complete?'attempted':'unfinished')+' · Mobile '+(g.platform.mobile.complete?'attempted':'unfinished')+'. Either-platform credit never fills the other variant.</p></details></article>';
 }).join('');
 return '<details class="study-additions" data-entry-context="'+e(context)+'"><summary>Additions · '+enrolledDone+' / '+enrolledTotal+' enrolled completed</summary><p>Optional work has separate requirements and results. It contributes nothing to core progress.</p>'+cards+'</details>';
}
