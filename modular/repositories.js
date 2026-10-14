import {validateBundle,revisionKey} from './validation.js';
import {assertSerializable} from '../data-contract.js';

export function canonicalJSON(value){
 assertSerializable(value);
 const normalize=v=>Array.isArray(v)?v.map(normalize):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,normalize(v[k])])):v;
 return JSON.stringify(normalize(value));
}
export async function artifactHash(value,digest=globalThis.crypto?.subtle){
 if(!digest)throw Error('SHA-256 provider required');
 const bytes=await digest.digest('SHA-256',new TextEncoder().encode(canonicalJSON(value)));
 return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
}
export function orderedBundle(bundle){
 validateBundle(bundle);
 return {...structuredClone(bundle),entities:structuredClone(bundle.entities).sort((a,b)=>revisionKey(a)<revisionKey(b)?-1:revisionKey(a)>revisionKey(b)?1:0)};
}

// Immutable, defensive-copy repository. Host adapters load approved local JSON into it.
// Contract: get(kind,id,version?), list(kind), importBundle(bundle), exportBundle(id,version).
export class ContentRepository {
 #entities=new Map();#bundles=new Map();
 importBundle(input){
  const bundle=orderedBundle(input),key=bundle.id+'@'+bundle.version;
  const prior=this.#bundles.get(key);if(prior&&canonicalJSON(prior)!==canonicalJSON(bundle))throw Error('Immutable bundle revision conflict; retain both inputs for review');
  for(const e of bundle.entities){const old=this.#entities.get(revisionKey(e));if(old&&canonicalJSON(old)!==canonicalJSON(e))throw Error('Immutable entity revision conflict: '+revisionKey(e));}
  for(const e of bundle.entities)this.#entities.set(revisionKey(e),e);
  this.#bundles.set(key,bundle);return structuredClone(bundle);
 }
 get(kind,id,version){const e=this.#entities.get(kind+':'+id+(version?'@'+version:''));return e?structuredClone(e):null;}
 list(kind){return [...this.#entities.values()].filter(e=>!kind||e.kind===kind).map(e=>structuredClone(e));}
 exportBundle(id,version){const bundle=this.#bundles.get(id+'@'+version);if(!bundle)throw Error('Unknown bundle revision');return canonicalJSON(bundle)+'\n';}
}
export function createDomainRepositories(content=new ContentRepository()){
 const scope=kind=>Object.freeze({get:(id,version)=>content.get(kind,id,version),list:()=>content.list(kind)});
 const SearchProvider=Object.freeze({searchTopics(query){const words=String(query).toLowerCase().trim().split(/\s+/).filter(Boolean);return content.list('Topic').filter(e=>{const revisions=content.list('TopicRevision').filter(r=>r.topicId===e.id);return words.every(w=>[e.title,...e.aliases,...revisions.flatMap(r=>[r.title||'',...(r.aliases||[])])].join(' ').toLowerCase().includes(w));});}});
 return Object.freeze({ContentRepository:content,EvidenceRepository:scope('EvidenceClaim'),TopicRepository:scope('Topic'),LessonRepository:scope('LessonRevision'),AssessmentRepository:scope('AssessmentTemplate'),PresentationRepository:scope('PresentationProfile'),LabModuleRepository:scope('LabModuleReference'),SearchProvider});
}
