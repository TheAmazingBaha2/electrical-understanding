// Offline-first synchronization contract only. No transport, account or database access.
import {validateProject} from './project-store.js';
const experimentKeys=['circuit','componentInventory','widgetInstances','instrumentSettings','measurementResults','experimentState'];
const canonical=v=>JSON.stringify(v,(_k,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const equal=(a,b)=>canonical(a)===canonical(b);
export function mergeProjectCopies(base,local,remote){
 for(const p of [base,local,remote])validateProject(p);if(new Set([base.id,local.id,remote.id]).size!==1)throw Error('Project identities differ');
 const conflicts=[];
 function merge(b,l,r,path){
  if(equal(l,r))return structuredClone(l);
  if(equal(l,b))return structuredClone(r);
  if(equal(r,b))return structuredClone(l);
  conflicts.push(path);return structuredClone(l);
 }
 const result={},keys=new Set([...Object.keys(base),...Object.keys(local),...Object.keys(remote)]);
 const experiment=p=>Object.fromEntries(experimentKeys.map(k=>[k,p[k]]));
 const combined=merge(experiment(base),experiment(local),experiment(remote),'experiment');Object.assign(result,combined);
 for(const key of keys){
  if(experimentKeys.includes(key)||key==='syncOrigins')continue;
  if(key==='metadata'){
   result.metadata={};for(const k of new Set([...Object.keys(base.metadata),...Object.keys(local.metadata),...Object.keys(remote.metadata)])){
    if(k==='updatedAt'){result.metadata[k]=local.metadata[k];continue;}
    const value=merge(base.metadata[k],local.metadata[k],remote.metadata[k],'metadata.'+k);if(value!==undefined)result.metadata[k]=value;
   }
  }else if(key==='snapshots'||key==='snapshotTombstones'){
   const lists=[base,local,remote].map(p=>p[key]||[]);if(lists.some(list=>new Set(list.map(s=>s.id)).size!==list.length))throw Error('Duplicate synchronized identity');
   const ids=new Set(lists.flat().map(s=>s.id));result[key]=[];for(const id of ids){const value=merge(...lists.map(list=>list.find(s=>s.id===id)),key+'.'+id);if(value!==undefined)result[key].push(value);}
  }else{const value=merge(base[key],local[key],remote[key],key);if(value!==undefined)result[key]=value;}
 }
 result.syncOrigins=[...(local.syncOrigins||[]),...(remote.syncOrigins||[]),{baseUpdatedAt:base.metadata.updatedAt||null,localUpdatedAt:local.metadata.updatedAt||null,remoteUpdatedAt:remote.metadata.updatedAt||null}];
 if(conflicts.length)return {schemaVersion:1,status:'conflict',conflicts,base:structuredClone(base),local:structuredClone(local),remote:structuredClone(remote)};
 try{validateProject(result)}catch{return {schemaVersion:1,status:'conflict',conflicts:['merged-contract'],base:structuredClone(base),local:structuredClone(local),remote:structuredClone(remote)};}
 return {schemaVersion:1,status:'merged',project:result};
}
export function projectSyncEnvelope(project,{revision,parentRevision,deviceId,mutationId}){
 validateProject(project);if(!Number.isInteger(revision)||revision<0||!Number.isInteger(parentRevision)||parentRevision<0||!deviceId||!mutationId)throw Error('Invalid synchronization envelope');
 return {schemaVersion:1,projectId:project.id,revision,parentRevision,deviceId,mutationId,project:structuredClone(project)};
}
