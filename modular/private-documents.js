// Portable private-document protocol. Hosts supply transactions and durable bytes.
import {assertSerializable} from '../data-contract.js';
import {canonicalJSON,artifactHash} from './repositories.js';
export function privateScope(ownerId,namespace){
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[457][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(ownerId)||!/^[a-z][a-z0-9.-]{0,63}$/.test(namespace))throw Error('Explicit private identity and safe namespace required');
 return ownerId+':'+namespace;
}
const keys=(o,names)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).sort().join(',')===[...names].sort().join(',');
export function emptyPrivateDocument(ownerId,namespace){privateScope(ownerId,namespace);return {format:'eu-private-document@1',ownerId,namespace,head:null,records:[]};}
export async function privateRecord(ownerId,namespace,previousRevision,value){
 privateScope(ownerId,namespace);assertSerializable(value);if(previousRevision!==null&&!/^[a-f0-9]{64}$/.test(previousRevision))throw Error('Invalid expected private revision');
 const material={ownerId,namespace,previousRevision,value:structuredClone(value)};
 return {revision:await artifactHash(material),previousRevision,value:material.value};
}
export async function validatePrivateDocument(document,ownerId,namespace){
 privateScope(ownerId,namespace);assertSerializable(document);
 if(!keys(document,['format','ownerId','namespace','head','records'])||document.format!=='eu-private-document@1'||document.ownerId!==ownerId||document.namespace!==namespace||!Array.isArray(document.records))throw Error('Private document format/identity mismatch; original retained');
 const ids=new Set();for(const r of document.records){if(!keys(r,['revision','previousRevision','value'])||ids.has(r.revision)||r.revision!==(await privateRecord(ownerId,namespace,r.previousRevision,r.value)).revision)throw Error('Private record corruption; recover from an explicit backup');ids.add(r.revision);}
 if(document.head!==null&&!ids.has(document.head))throw Error('Private document head missing');
 // A stale revision from another device may not be in this export. Preserve it;
 // never infer a winner or require a Git-like ancestry UI.
 return structuredClone(document);
}
export function privateHead(document){const r=document.records.find(r=>r.revision===document.head);return {revision:document.head,value:r?structuredClone(r.value):null};}
export function applyPrivateCAS(document,candidate,expectedRevision){
 const next=structuredClone(document),saved=document.head===expectedRevision;
 if(!next.records.some(r=>r.revision===candidate.revision))next.records.push(structuredClone(candidate));
 if(saved)next.head=candidate.revision;
 return {document:next,result:{saved,revision:next.head,conflicts:saved?[]:[{expectedRevision,candidate:structuredClone(candidate),current:privateHead(document)}]}};
}
export async function mergePrivateRecovery(current,recovery){
 await validatePrivateDocument(recovery,current.ownerId,current.namespace);const next=structuredClone(current);
 for(const record of recovery.records)if(!next.records.some(r=>r.revision===record.revision))next.records.push(structuredClone(record));
 // Import preserves all bytes but makes no silent choice between heads.
 if(!next.head)next.head=recovery.head;
 return {document:next,heads:[...new Set([current.head,recovery.head].filter(Boolean))],conflicted:!!current.head&&!!recovery.head&&current.head!==recovery.head};
}
export const samePrivateDocument=(a,b)=>canonicalJSON(a)===canonicalJSON(b);
