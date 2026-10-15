// Transitional study-bank adapter for the canonical modular UUID/alias registry.
// Uses the existing StudyStore/journal; optional requirements never enter core.
import {UUID_PATTERN,VERSION_PATTERN} from './data-contract.js';
import {studyState,evidenceEvents} from './study-journal.js';
const uuid=new RegExp(UUID_PATTERN),version=new RegExp(VERSION_PATTERN);
export function canonicalHome(bank,id){return (bank.canonicalLessons||[]).find(l=>l.id===id||l.aliases.includes(id));}
export function validateStudyAdditions(bank){
 const homes=new Set(),aliases=new Set();for(const l of bank.canonicalLessons||[]){if(!uuid.test(l.id)||homes.has(l.id)||!Array.isArray(l.aliases)||l.aliases.some(a=>typeof a!=='string'||aliases.has(a)))throw Error('Invalid canonical UUID/alias registry');if(l.optionalOnly&&(!l.title||bank.lessons.some(core=>l.aliases.includes(core.id))))throw Error('Optional-only home needs a title and must not duplicate an existing core home');homes.add(l.id);for(const a of l.aliases)aliases.add(a);}
 const identities=new Set(),unitAliases=new Map();
 for(const a of bank.additions||[]){
  if(a.requirementHash!==undefined&&!/^[a-f0-9]{64}$/.test(a.requirementHash))throw Error('Invalid immutable requirement hash');
  const key=a.id+'@'+a.version;if(!uuid.test(a.id)||!version.test(a.version)||identities.has(key)||homes.has(a.id)||bank.lessons.some(l=>l.id===a.id)||!homes.has(a.homeLessonId)||!a.title||!Array.isArray(a.importAliases)||!a.importAliases.length)throw Error('Invalid supplemental identity, version or canonical home');identities.add(key);
  for(const alias of a.importAliases){if(typeof alias!=='string'||!alias||unitAliases.has(alias)&&unitAliases.get(alias)!==a.id)throw Error('Supplement alias has more than one completion owner');unitAliases.set(alias,a.id);}
  if(!Array.isArray(a.sourceIds)||!a.sourceIds.length||a.sourceIds.some(id=>!bank.sources.some(s=>s.id===id)))throw Error('Unresolved addition sources');
  if(!Number.isInteger(a.requiredCheckCount)||a.requiredCheckCount<1||!Array.isArray(a.questionPoolIds)||new Set(a.questionPoolIds).size!==a.questionPoolIds.length||a.requiredCheckCount>a.questionPoolIds.length||a.questionPoolIds.some(id=>!bank.questions.some(q=>q.id===id)))throw Error('Invalid finite addition requirements');
  if(!['either-platform','both-platforms'].includes(a.completionPolicy)||!a.variants||!a.teaching?.steps?.length)throw Error('Authored addition teaching and practical variants required');
  const activityIds=new Set();for(const p of ['desktop','mobile']){const v=a.variants[p];if(!v||!uuid.test(v.id)||!version.test(v.version)||activityIds.has(v.id)||!bank.challenges.some(c=>c.id===v.challengeId))throw Error('Independent authored platform activity required');activityIds.add(v.id);}
 }
}
export function additionAssets(bank){return (bank?.additions||[]).map(a=>({...a.teaching,id:a.id,title:a.title,contentRevision:a.version,studyModule:true,supplemental:true,addition:a,canonicalLessonId:a.homeLessonId,sourceIds:a.sourceIds,requiredIds:a.questionPoolIds.slice(0,a.requiredCheckCount),challengeId:a.variants.desktop.challengeId,questions:[],independent:true,subtrack:'private-study',curriculum:{...a.teaching.curriculum,section:'lessons'}}));}
export const additionTarget=lesson=>'addition.'+lesson.id+'@'+lesson.contentRevision;
export function additionActivityComplete(activity,attempts,challengeId){return !!activity?.comparisonAttempted&&(activity.caseCount?activity.caseAnswers?.length>=activity.caseCount&&activity.caseAnswers.every(c=>attempts.some(a=>a.id===c.attemptId&&a.item.id===challengeId)):activity.attemptedWorking?.actionCount>=activity.minimumActions&&attempts.some(a=>a.id===activity.attemptId&&a.item.id===challengeId));}
export function additionCompletion(lesson,state,events){
 const a=lesson.addition,attempts=events.filter(e=>e.type==='attempt'&&e.sessionId===state?.id&&e.scope?.kind==='addition'&&e.scope.id===a.id&&e.scope.version===a.version),platform={};
 for(const p of ['desktop','mobile']){const activity=state?.platform===p?state.activity:state?.practical?.[p];platform[p]={complete:additionActivityComplete(activity,attempts.filter(e=>e.scope.platform===p&&e.scope.variant?.id===a.variants[p].id&&e.scope.variant?.version===a.variants[p].version),a.variants[p].challengeId),attempts:attempts.filter(e=>e.scope.platform===p),activity};}
 const checks=state?.requiredItems?.map(q=>q.id)||[],checksDone=checks.filter(id=>attempts.some(e=>e.item.id===id&&e.scope.platform==='shared')).length,steps=lesson.steps.filter(s=>!s.optional),stepsDone=steps.filter(s=>state?.acknowledged?.includes(s.id)).length,activityAttempted=a.completionPolicy==='either-platform'?platform.desktop.complete||platform.mobile.complete:platform.desktop.complete&&platform.mobile.complete;
 return {complete:checks.length===a.requiredCheckCount&&checksDone===checks.length&&stepsDone===steps.length&&activityAttempted,checksDone,checksTotal:checks.length,stepsDone,stepsTotal:steps.length,activityAttempted,platform,attempts};
}
export function additionGauge(lesson,state,events){const c=additionCompletion(lesson,state,events),done=c.checksDone+Number(c.activityAttempted&&c.stepsDone===c.stepsTotal),total=lesson.addition.requiredCheckCount+1;return {...c,done,total,percent:Math.round(done/total*100),correct:c.attempts.filter(a=>a.scope.platform==='shared'&&a.result.correct&&!a.assisted).length,assisted:c.attempts.filter(a=>a.assisted).length,misses:c.attempts.filter(a=>!a.result.correct).length};}
export function renderAdditionCards(bank,journal,homeId,{escape:e,context='lesson',unitIds=null}={}){
 if(!bank?.additions?.length)return '';const home=canonicalHome(bank,homeId);if(!home)return '';
 const all=additionAssets(bank).filter(l=>l.canonicalLessonId===home.id&&(!unitIds||unitIds.includes(l.id)));if(!all.length)return '';
 const byId=new Map();for(const l of all){const entries=byId.get(l.id)||[];entries.push(l);byId.set(l.id,entries);}
 let enrolledDone=0,enrolledTotal=0,inProgress=0,newUnits=0;
 const cards=[...byId.values()].map(versions=>{
  const enrolled=versions.filter(l=>studyState(journal,additionTarget(l)).candidates.length),earned=enrolled.filter(l=>additionCompletion(l,studyState(journal,additionTarget(l)).value,evidenceEvents(journal)).complete),active=earned.at(-1)||enrolled.at(-1)||versions.at(-1),saved=studyState(journal,additionTarget(active)),g=additionGauge(active,saved.value,evidenceEvents(journal));
  if(enrolled.length){enrolledTotal++;if(earned.length)enrolledDone++;else inProgress++;}else newUnits++;
  const newer=versions.indexOf(active)<versions.length-1;
  const otherVersions=versions.filter(l=>l!==active).map(l=>{const saved=studyState(journal,additionTarget(l)),g=additionGauge(l,saved.value,evidenceEvents(journal));return '<p>Revision '+e(l.contentRevision)+' · '+g.done+' / '+g.total+' requirements · '+(g.complete?'Completed':saved.candidates.length?'In progress':'Not started')+'</p><button class="outline" data-goto="addition" data-lesson="'+e(l.id)+'" data-revision="'+e(l.contentRevision)+'">Continue revision '+e(l.contentRevision)+'</button>';}).join('');
  return '<article class="study-addition-card" data-addition="'+e(active.id)+'"><h5>'+e(active.title)+'</h5><p class="lesson-page-reference">Reference pages: '+active.sourceIds.map(id=>{const source=bank.sources.find(s=>s.id===id);return e(source.book)+' · printed p. '+e(source.printedPage)+(source.pageStatus?' · '+e(source.pageStatus):'');}).join('; ')+'</p><p>'+g.done+' / '+g.total+' requirements · '+(g.complete?'Completed at earned revision '+e(active.contentRevision):saved.candidates.length?'In progress':'Not started')+'</p><progress max="'+g.total+'" value="'+g.done+'" aria-label="Addition completion"></progress><button class="outline" data-goto="addition" data-lesson="'+e(active.id)+'" data-revision="'+e(active.contentRevision)+'">Continue addition</button>'+(newer?'<p>New additions available · earned completion is retained.</p><button class="outline" data-goto="addition" data-lesson="'+e(versions.at(-1).id)+'" data-revision="'+e(versions.at(-1).contentRevision)+'">Explore new optional revision</button>':'')+(otherVersions?'<details><summary>Other optional requirement revisions</summary>'+otherVersions+'</details>':'')+'<details><summary>Practice results and platform activity</summary><p>'+g.correct+' correct independent checks · '+g.misses+' misses · '+g.assisted+' assisted responses.</p><p>Desktop '+(g.platform.desktop.complete?'attempted':'unfinished')+' · Mobile '+(g.platform.mobile.complete?'attempted':'unfinished')+'. Either-platform credit never fills the other variant.</p>'+['desktop','mobile'].map(p=>{const attempts=g.platform[p].attempts;return '<p>'+e(p)+': '+attempts.filter(a=>a.result.correct&&!a.assisted).length+' correct independent / '+attempts.length+' submitted predictions; '+attempts.filter(a=>a.assisted).length+' assisted.</p>';}).join('')+'</details></article>';
 }).join('');
 return '<details class="study-additions" data-disclosure="additions:'+e(context)+':'+e(home.id)+'" data-entry-context="'+e(context)+'"><summary>Additions · '+enrolledDone+' / '+enrolledTotal+' enrolled completed · '+inProgress+' in progress · '+newUnits+' new</summary><p>Optional work has separate requirements and results. It contributes nothing to core progress.</p>'+cards+'</details>';
}
export function renderOptionalAdditionHomes(bank,journal,{escape:e}={}){
 return (bank?.canonicalLessons||[]).filter(h=>(h.optionalOnly||!bank.lessons.some(l=>h.aliases.includes(l.id)))&&(bank.additions||[]).some(a=>a.homeLessonId===h.id)).map(h=>'<section class="panel" data-optional-topic-home="'+e(h.id)+'"><p class="v2-kicker">'+(h.optionalOnly?'OPTIONAL TOPIC EXPANSION':'CANONICAL LESSON ADDITIONS')+'</p><h3>'+e(h.title)+'</h3><p>'+(h.optionalOnly?'No core completion requirement. All practice is tracked in its own additions.':'The core module is not included in this preview; its existing grades are preserved separately. These additions use their own progress.')+'</p>'+renderAdditionCards(bank,journal,h.id,{escape:e,context:'lessons'})+'</section>').join('');
}

// An attribution/reading view into the same compositions, never a book-owned copy.
export function renderAdditionReadingLists(bank,journal,{escape:e}={}){
 const groups=new Map();
 for(const lesson of additionAssets(bank)){
  const source=bank.sources.find(s=>s.id===lesson.sourceIds[0]);if(!source)continue;
  const key=JSON.stringify([source.book,source.edition,source.chapter]);
  if(!groups.has(key))groups.set(key,{source,units:new Map()});
  groups.get(key).units.set(lesson.id,lesson);
 }
 if(!groups.size)return '';
 return '<details class="panel study-source-contributions" data-disclosure="source-contributions"><summary>Source contributions · ordered reading lists</summary><p>References into the same optional additions. Reading-batch coverage is separate from core completion; opening this list grants no credit.</p>'+[...groups].map(([key,{source,units}])=>'<details data-disclosure="contributions:'+e(key)+'"><summary>'+e(source.book)+' · '+e(source.edition)+' · Chapter '+e(source.chapter)+'</summary>'+[...units.values()].sort((a,b)=>(a.addition.readingOrder??a.curriculum.order)-(b.addition.readingOrder??b.curriculum.order)).map(l=>renderAdditionCards(bank,journal,l.canonicalLessonId,{escape:e,context:'source',unitIds:[l.id]})).join('')+'</details>').join('')+'</details>';
}

export function renderStudyContentStatus(bank,{escape:e}={}){
 if(!bank)return '<aside class="study-content-status" role="status">Private lesson content is not installed in this public build. Use the matching private preview package; clearing progress cannot install lessons.</aside>';
 return '<aside class="study-content-status" role="status">Installed content: '+e(bank.title)+' · revision '+e(bank.revision)+' · '+bank.lessons.filter(l=>l.kind!=='recap').length+' teaching lessons · '+new Set((bank.additions||[]).map(a=>a.id)).size+' optional additions. Content identity: '+e(bank.id)+'.</aside>';
}

export function additionRouteHash(id,revision){
 if(!uuid.test(id)||!version.test(revision))throw Error('Invalid addition route identity');return '#addition='+id+'@'+revision;
}
export function parseAdditionRoute(hash){
 const match=String(hash).match(/^#addition=([^@]+)@(.+)$/);return match&&uuid.test(match[1])&&version.test(match[2])?{id:match[1],version:match[2]}:null;
}

export function additionRequirementDescriptor(a){
 return {schemaVersion:1,id:a.id,version:a.version,creditScope:'supplemental',countsTowardCore:false,countsTowardRequiredDashboard:false,
  questionPoolIds:[...a.questionPoolIds],selectedCheckIds:a.questionPoolIds.slice(0,a.requiredCheckCount),
  completionUnits:[{kind:'guided-activity',id:a.id+':guided'},...a.questionPoolIds.slice(0,a.requiredCheckCount).map(id=>({kind:'question-check',id}))],
  stepIds:a.teaching.steps.filter(s=>!s.optional).map(s=>s.id),variants:structuredClone(a.variants),completionPolicy:a.completionPolicy};
}

// Old distinct-template attempt IDs remain unchanged. A shared reusable template
// needs authored-activity identity in the event key to keep platform attempts apart.
export function additionActivityAttemptSuffix(lesson,platform){
 if(!lesson?.supplemental||lesson.addition.variants.desktop.challengeId!==lesson.addition.variants.mobile.challengeId)return '';
 const v=lesson.addition.variants[platform];if(!v)throw Error('Choose the authored activity variant');return '/activity/'+v.id+'@'+v.version;
}

// Change only a fragment, retaining file/custom-protocol origins for native hosts.
export function additionRouteURL(href,id=null,revision=null){
 const url=new URL(href);url.hash=id?additionRouteHash(id,revision):'';return url.href;
}
