import {validateEntity} from './validation.js';
import {canonicalJSON} from './repositories.js';

// A private append-only port; never a field in a public curriculum bundle.
export class ProgressRepository {
 #events=new Map();
 append(event){validateEntity(event,'ProgressEvent');const prior=this.#events.get(event.id);if(prior&&canonicalJSON(prior)!==canonicalJSON(event))throw Error('Immutable event ID conflict; retain both versions');this.#events.set(event.id,structuredClone(event));return structuredClone(event);}
 list(){return [...this.#events.values()].map(e=>structuredClone(e));}
 import(events){const next=new ProgressRepository();for(const event of [...this.list(),...events])next.append(event);for(const event of next.list())this.append(event);return this.list();}
}
export function mergeProgressEvents(left,right){
 const events=new Map(),conflicts=new Map();for(const event of [...left,...right]){
  validateEntity(event,'ProgressEvent');const prior=events.get(event.id);if(prior&&canonicalJSON(prior)!==canonicalJSON(event)){const variants=conflicts.get(event.id)||[prior];if(!variants.some(e=>canonicalJSON(e)===canonicalJSON(event)))variants.push(structuredClone(event));conflicts.set(event.id,variants);}else events.set(event.id,structuredClone(event));
 }
 const attempts=new Map();for(const event of events.values())if(event.eventType.endsWith('-result')&&!conflicts.has(event.id)){
  const key=canonicalJSON([event.streamId,event.lesson,event.platform,event.module||null,event.subject,event.attemptId]);const variants=attempts.get(key)||[];variants.push(event);attempts.set(key,variants);
 }
 for(const [key,variants] of attempts)if(variants.some(e=>e.correct!==variants[0].correct)){conflicts.set('attempt:'+key,variants);for(const e of variants)events.delete(e.id);}
 // Conflicting event/attempt identities contribute no grade; every variant survives.
 return {events:[...events.values()].filter(e=>!conflicts.has(e.id)).sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0),conflicts:[...conflicts.entries()].sort(([a],[b])=>a<b?-1:a>b?1:0).map(([id,variants])=>({id,variants:variants.sort((a,b)=>canonicalJSON(a)<canonicalJSON(b)?-1:1)}))};
}
export const SyncProvider=Object.freeze({mergeAttempts:mergeProgressEvents,transportEnabled:false});
export function projectPracticalProgress(events,{streamId,lesson,coreSubjects,desktop,mobile,completionPolicy='either-platform',passFraction=.8,safetySubjects=[]}){
 if(!streamId)throw Error('Explicit private progress stream required');
 const {events:clean,conflicts}=mergeProgressEvents([],events);
 const matching=clean.filter(e=>e.streamId===streamId&&e.lesson.id===lesson.id&&e.lesson.version===lesson.version);
 const summarize=(platform,module,subjects)=>{
  const candidates=matching.filter(e=>e.platform===platform&&e.eventType===(platform==='core'?'question-result':'lab-result')&&(platform==='core'||e.module?.id===module?.id&&e.module?.version===module?.version)&&subjects.some(s=>s.id===e.subject.id&&s.version===e.subject.version));
  const attempts=new Map();for(const e of candidates){const key=e.attemptId+':'+e.subject.id+'@'+e.subject.version;const variants=attempts.get(key)||[];variants.push(e);attempts.set(key,variants);}
  const results=[...attempts.values()].filter(group=>group.every(e=>e.correct===group[0].correct)).map(group=>group[0]);
  const grouped=subjects.map(subject=>{const attempts=results.filter(e=>e.subject.id===subject.id&&e.subject.version===subject.version);return {subject:structuredClone(subject),attempts:attempts.length,correct:attempts.some(e=>e.correct)};});
  const correct=grouped.filter(g=>g.correct).length;return {module,attempts:results.length,correct,total:subjects.length,percentage:subjects.length?100*correct/subjects.length:0,complete:subjects.length>0&&correct===subjects.length,subjects:grouped};
 };
 const core=summarize('core',null,coreSubjects),d=summarize('desktop',desktop?.module||null,desktop?.subjects||[]),m=summarize('mobile',mobile?.module||null,mobile?.subjects||[]);
 if(passFraction!==.8)throw Error('Unreviewed common quiz pass rule');
 core.complete=core.total>0&&core.correct/core.total>=passFraction&&safetySubjects.every(s=>core.subjects.some(g=>g.subject.id===s.id&&g.subject.version===s.version&&g.correct));
 const practical=completionPolicy==='no-required-lab'?true:completionPolicy==='either-platform'?d.complete||m.complete:completionPolicy==='both-platforms'?d.complete&&m.complete:(()=>{throw Error('Unknown practical completion policy');})();
 return {core,desktop:d,mobile:m,practicalComplete:practical,complete:core.complete&&practical,conflicts};
}
