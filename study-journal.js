// Independent V3 policy. No legacy grade, project or scheduler is mutated.
import {ProgressStore,equal} from './persistence.js';
import {assertSerializable} from './data-contract.js';
import {orderedEvents} from './review-engine.js';
import {answerStudyItem,sameValue} from './study-bank.js';
export function emptyStudyJournal(owner=null){return {schemaVersion:1,format:'eu-introduced-practice@1',owner,events:[],conflicts:[]};}
export function validateStudyJournal(input,owner=input?.owner) {
 assertSerializable(input);
 if(input?.schemaVersion!==1||input.format!=='eu-introduced-practice@1'||input.owner!==owner||!Array.isArray(input.events)||!Array.isArray(input.conflicts))throw Error('Unsupported practice journal; original retained');
 const ids=new Set();for(const e of input.events){
  if(typeof e.id!=='string'||ids.has(e.id)||!Number.isFinite(Date.parse(e.at))||new Date(e.at).toISOString()!==e.at||!['introduction','attempt','flag','state','resolution','presentation'].includes(e.type))throw Error('Invalid practice event; original retained');ids.add(e.id);
  if(e.type==='introduction'&&(!e.stepId||!Array.isArray(e.conceptIds)||!e.conceptIds.length||!Array.isArray(e.sourceIds)))throw Error('Invalid introduction record');
  if(e.type==='attempt'){
   if(typeof e.sessionId!=='string'||typeof e.assisted!=='boolean'||!e.item?.variantId||!Array.isArray(e.sourceIds)||!sameValue(answerStudyItem(e.item,e.answer,{caseId:e.caseId}),e.result))throw Error('Invalid frozen attempt result');
  }
  if(e.type==='state'&&(!e.target||!Object.hasOwn(e,'parentId')||e.id===e.parentId||!e.value||typeof e.value!=='object'))throw Error('Invalid working-state record');
  if(e.type==='flag'&&(!e.conceptId||typeof e.flagged!=='boolean'))throw Error('Invalid flag record');
 }
 return structuredClone(input);
}
export function mergeStudyJournals(a,b) {
 validateStudyJournal(a);validateStudyJournal(b,a.owner);const out=structuredClone(a),byId=new Map(out.events.map(e=>[e.id,e]));
 for(const event of b.events){const previous=byId.get(event.id);if(!previous){out.events.push(structuredClone(event));byId.set(event.id,event);}else if(!equal(previous,event)){const conflict={kind:'event-id',id:event.id,copies:[previous,event]};if(!out.conflicts.some(c=>equal(c,conflict)))out.conflicts.push(structuredClone(conflict));}}
 for(const c of b.conflicts)if(!out.conflicts.some(x=>equal(x,c)))out.conflicts.push(structuredClone(c));out.events=orderedEvents(out.events);return out;
}
export function evidenceEvents(journal){const withheld=new Set(journal.conflicts.filter(c=>c.kind==='event-id').map(c=>c.id));return journal.events.filter(e=>!withheld.has(e.id));}
function hydrate(value,journal){
 if(Array.isArray(value))return value.map(v=>hydrate(v,journal));
 if(value&&typeof value==='object'){
  if(Object.keys(value).length===1&&value.studyItemRef){const p=journal.events.find(e=>e.type==='presentation'&&e.id===value.studyItemRef);if(!p)throw Error('Saved presentation missing; recover the original journal');return structuredClone(p.item);}
  return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,hydrate(v,journal)]));
 }return value;
}
async function freezePresentations(value,journal,at,extra){
 if(Array.isArray(value))return Promise.all(value.map(v=>freezePresentations(v,journal,at,extra)));
 if(value&&typeof value==='object'){
  if(['single_choice','widget_challenge'].includes(value.kind)&&value.variantId){const bytes=new TextEncoder().encode(JSON.stringify(value)),hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),n=>n.toString(16).padStart(2,'0')).join(''),id='presentation:'+hash;
   if(!journal.events.some(e=>e.id===id)&&!extra.some(e=>e.id===id))extra.push({id,type:'presentation',at,item:structuredClone(value)});return {studyItemRef:id};}
  const entries=[];for(const [k,v] of Object.entries(value))entries.push([k,await freezePresentations(v,journal,at,extra)]);return Object.fromEntries(entries);
 }return value;
}
export function studyState(journal,target) {
 const nodes=journal.events.filter(e=>e.type==='state'&&e.target===target),resolutions=orderedEvents(journal.events.filter(e=>e.type==='resolution'&&e.target===target));
 const overridden=new Set(resolutions.flatMap(e=>e.discardedIds||[])),parents=new Set(nodes.map(e=>e.parentId).filter(Boolean));
 const leaves=nodes.filter(e=>!parents.has(e.id)&&!overridden.has(e.id));
 return {event:leaves.length===1?leaves[0]:null,conflicted:leaves.length>1,candidates:leaves,value:leaves.length===1?hydrate(leaves[0].value,journal):null};
}
export class StudyStore {
 constructor(storage,owner=null,locks=globalThis.navigator?.locks){this.storage=storage;this.userId=owner;this.owner=owner;this.key='eu_introduced_practice_v1:'+encodeURIComponent(owner||'anonymous');this.locks=locks;}
 read(){const raw=this.storage.getItem(this.key);return raw===null?emptyStudyJournal(this.owner):validateStudyJournal(JSON.parse(raw),this.owner);}
 backup(reason,doc=this.read()){return ProgressStore.prototype.backup.call(this,reason,doc);}
 backups(){return ProgressStore.prototype.backups.call(this);}
 async change(fn){
  const result=await ProgressStore.prototype.change.call(this,fn);
  // The append-only current journal already retains every working revision. Keep
  // two redundant full backups; never prune a copy containing unique evidence.
  const keys=this.backups();for(const key of keys.slice(2)){try{const backup=JSON.parse(this.storage.getItem(key));if(backup.events?.every(e=>result.events.some(current=>equal(e,current)))&&backup.conflicts?.every(c=>result.conflicts.some(current=>equal(c,current))))this.storage.removeItem?.(key);}catch{/* Unfamiliar/corrupt backups remain exportable. */}}
  return result;
 }
 async append(events){return this.change(doc=>{Object.assign(doc,mergeStudyJournals(doc,{...emptyStudyJournal(this.owner),events}));});}
 async updateState(target,parentId,value,events=[],{id=crypto.randomUUID(),at=new Date().toISOString()}={}) {
  let conflicted=false;const document=await this.change(async doc=>{
   const current=studyState(doc,target);conflicted=current.conflicted||(current.event?.id||null)!==parentId;
   const presentations=[],frozen=await freezePresentations(value,doc,at,presentations);
   Object.assign(doc,mergeStudyJournals(doc,{...emptyStudyJournal(this.owner),events:[...events,...presentations,{id,type:'state',target,parentId,value:frozen,at}]}));
  });return {document,conflicted};
 }
 async merge(input){validateStudyJournal(input,this.owner);return this.change(doc=>{Object.assign(doc,mergeStudyJournals(doc,input));});}
 export(){const backups=this.backups().map(key=>({key,raw:this.storage.getItem(key)}));try{return JSON.stringify({format:'eu-practice-recovery@1',journal:this.read(),backups},null,2);}catch{return JSON.stringify({format:'eu-practice-raw-recovery@1',owner:this.owner,raw:this.storage.getItem(this.key),backups},null,2);}}
 async import(input){if(input.format!=='eu-practice-recovery@1')throw Error('Unsupported recovery file');return this.merge(input.journal);}
 async resolve(target,chosenId){return this.change(doc=>{const s=studyState(doc,target);if(!s.conflicted||!s.candidates.some(c=>c.id===chosenId))throw Error('Recovery choice is no longer current');doc.events.push({id:crypto.randomUUID(),type:'resolution',target,chosenId,discardedIds:s.candidates.filter(c=>c.id!==chosenId).map(c=>c.id),at:new Date().toISOString()});});}
 // A future transport can exchange validated journals. Existing V2 sync is not reused as a backend.
 async sync(){throw Error('Practice cloud transport is not configured; local events retained');}
}
