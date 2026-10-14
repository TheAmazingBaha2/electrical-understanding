// Experiment content is separate from lesson progress and device layout. No cloud backend.
import {validateCircuit,dividerCircuit} from './circuit-model.js';
import {assertSerializable} from './data-contract.js';
import {compileBreadboard} from './breadboard-model.js';
import {widgetFor} from './widget-registry.js';
export function validateProject(p){
 assertSerializable(p);if(p?.schemaVersion!==1||typeof p.id!=='string'||!p.id||!p.metadata||typeof p.metadata.title!=='string')throw Error('Unsupported or incomplete project; original input remains unchanged');
 validateCircuit(p.circuit);
 if(p.experimentState?.breadboard){const b=p.experimentState.breadboard;if(b.schemaVersion!==1||!Array.isArray(b.undo)||!Array.isArray(b.redo))throw Error('Unsupported breadboard history');const c=compileBreadboard(b.state);for(const k of ['groundNode','nodes','externalTerminals','components','connections','instruments','state'])if(JSON.stringify(c[k])!==JSON.stringify(p.circuit[k]))throw Error('Breadboard state and circuit disagree; original input preserved');}
 for(const key of ['componentInventory','widgetInstances','measurementResults','snapshots','lessonReferences'])if(!Array.isArray(p[key]))throw Error('Missing project '+key);
 if(!p.instrumentSettings||!p.experimentState||typeof p.notes!=='string')throw Error('Incomplete experiment');
 if(p.experimentState.recordedMeasurements!==undefined){if(!Array.isArray(p.experimentState.recordedMeasurements))throw Error('Invalid measurement history');for(const r of p.experimentState.recordedMeasurements){if(typeof r.id!=='string'||typeof r.recordedAt!=='string'||!Array.isArray(r.measurements)||!r.instrumentSettings)throw Error('Invalid recorded measurement');validateCircuit(r.circuit);}}
 for(const w of p.widgetInstances)if(!widgetFor(w.widgetId,w.version)||typeof w.instanceId!=='string')throw Error('Unknown project widget/version');
 if(new Set(p.widgetInstances.map(w=>w.instanceId)).size!==p.widgetInstances.length)throw Error('Duplicate widget instance');
 const snapshotIds=new Set();for(const s of p.snapshots){if(!s.id||snapshotIds.has(s.id)||typeof s.name!=='string'||!s.experiment)throw Error('Invalid snapshot');snapshotIds.add(s.id);validateCircuit(s.experiment.circuit);}
 return p;
}
export function newProject(id='divider-project'){return {
 schemaVersion:1,id,metadata:{title:'DC divider experiment',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},circuit:dividerCircuit(),
 componentInventory:[{componentId:'V1',quantity:1},{componentId:'R1',quantity:1},{componentId:'R2',quantity:1}],
 widgetInstances:[{instanceId:'circuit-view',widgetId:'circuit-dc',version:'1.0.0'},{instanceId:'meter-view',widgetId:'dmm-shared',version:'1.0.0'}],
 instrumentSettings:{DMM1:{presentation:'realistic',difficulty:'beginner'}},measurementResults:[],notes:'',experimentState:{},snapshots:[],lessonReferences:[]
};}
export function addSnapshot(p,name,id){validateProject(p);if(typeof name!=='string'||!name.trim()||p.snapshots.some(s=>s.id===id))throw Error('Snapshot needs a unique ID and name');
 const {circuit,componentInventory,widgetInstances,instrumentSettings,measurementResults,notes,experimentState}=structuredClone(p);
 return {...structuredClone(p),snapshots:[...structuredClone(p.snapshots),{id,name:name.trim(),createdAt:new Date().toISOString(),experiment:{circuit,componentInventory,widgetInstances,instrumentSettings,measurementResults,notes,experimentState}}]};
}
export function restoreSnapshot(p,id){validateProject(p);const s=p.snapshots.find(s=>s.id===id);if(!s)throw Error('Snapshot not found');const result={...structuredClone(p),...structuredClone(s.experiment)};
 // Early v1 snapshots omitted inventory. Restore known component entries without
 // changing the stored historical snapshot or retaining unrelated current parts.
 if(!Object.hasOwn(s.experiment,'componentInventory'))result.componentInventory=result.circuit.components.map(c=>structuredClone(p.componentInventory.find(i=>i.componentId===c.id)||{componentId:c.id,quantity:1}));
 validateProject(result);return result;}
export function renameSnapshot(p,id,name){
 validateProject(p);if(typeof name!=='string'||!name.trim())throw Error('Snapshot name cannot be blank');
 const result=structuredClone(p),s=result.snapshots.find(s=>s.id===id);if(!s)throw Error('Snapshot not found');
 s.name=name.trim();s.renamedAt=new Date().toISOString();return result;
}
export function deleteSnapshot(p,id){
 validateProject(p);if(!p.snapshots.some(s=>s.id===id))throw Error('Snapshot not found');
 const result=structuredClone(p);result.snapshots=result.snapshots.filter(s=>s.id!==id);
 result.snapshotTombstones=[...(result.snapshotTombstones||[]),{id,deletedAt:new Date().toISOString()}];return result;
}
export class ProjectStore{
 constructor(storage,namespace='local',locks=globalThis.navigator?.locks){this.locks=locks;this.storage=storage;this.prefix='eu_projects_v1:'+encodeURIComponent(namespace)+':';}
 readDocument(id){const raw=this.storage.getItem(this.prefix+encodeURIComponent(id));if(!raw)return null;let d;try{d=JSON.parse(raw)}catch{throw Error('Project storage is unreadable; export original before recovery');}if(d.schemaVersion!==1||!Number.isInteger(d.revision)||d.revision<0||!Array.isArray(d.conflicts))throw Error('Unsupported project storage; preserve original');validateProject(d.project);return d;}
 read(id){const d=this.readDocument(id);return d?.deleted?null:d;}
 list({includeDeleted=false}={}){
  const records=[];for(let i=0;i<this.storage.length;i++){const key=this.storage.key(i);if(!key?.startsWith(this.prefix))continue;const id=decodeURIComponent(key.slice(this.prefix.length));try{const d=this.readDocument(id);if(d&&(includeDeleted||!d.deleted))records.push({id,revision:d.revision,title:d.project.metadata.title,description:typeof d.project.metadata.description==='string'?d.project.metadata.description:'',updatedAt:typeof d.project.metadata.updatedAt==='string'?d.project.metadata.updatedAt:null,deleted:Boolean(d.deleted),deletedAt:d.deletedAt||null});}catch{records.push({id,title:'Unreadable project · original preserved',unreadable:true});}}
  return records;
 }
 async save(project,expectedRevision=0){
  if(!this.locks?.request)throw Error('Safe project saving requires browser locks; export the experiment instead');
  const copy=structuredClone(project);validateProject(copy);
  return this.locks.request(this.prefix+encodeURIComponent(copy.id),()=>this.saveUnderLock(copy,expectedRevision));
 }
 saveUnderLock(project,expectedRevision=0){validateProject(project);const current=this.readDocument(project.id),revision=current?.revision||0;
  if(current?.deleted)throw Error('Project is in recovery; restore it explicitly before saving');
  if(revision!==expectedRevision){if(!current)throw Error('Project disappeared from storage; export the unsaved version before recovery');const preserved={...current,schemaVersion:1,revision:revision+1,project:current.project,conflicts:[...current.conflicts,{id:'conflict-'+(revision+1),baseRevision:expectedRevision,savedAt:new Date().toISOString(),project:structuredClone(project)}]};this.storage.setItem(this.prefix+encodeURIComponent(project.id),JSON.stringify(preserved));return {...preserved,conflict:true};}
  const saved={...current,schemaVersion:1,revision:revision+1,project:structuredClone(project),conflicts:current?.conflicts||[]};this.storage.setItem(this.prefix+encodeURIComponent(project.id),JSON.stringify(saved));return {...saved,conflict:false};
 }
 async archiveProject(id,expectedRevision){return this.changeDeletion(id,expectedRevision,true);}
 async restoreProject(id,expectedRevision){return this.changeDeletion(id,expectedRevision,false);}
 async changeDeletion(id,expectedRevision,deleted){
  if(!this.locks?.request)throw Error('Safe project management requires browser locks');
  return this.locks.request(this.prefix+encodeURIComponent(id),()=>{
   const current=this.readDocument(id);if(!current||current.revision!==expectedRevision)throw Error('Project changed; refresh before deleting or restoring');
   if(current.conflicts.length)throw Error('Resolve saved copies before project deletion or restoration');
   const result={...current,revision:current.revision+1,deleted,deletedAt:deleted?new Date().toISOString():null};this.storage.setItem(this.prefix+encodeURIComponent(id),JSON.stringify(result));return result;
  });
 }
 async resolveConflict(projectId,conflictId,useIncoming,expectedRevision){
  if(!this.locks?.request)throw Error('Safe resolution requires browser locks');
  return this.locks.request(this.prefix+encodeURIComponent(projectId),()=>{
   const current=this.read(projectId);if(!current||current.revision!==expectedRevision)throw Error('Saved copies changed; refresh before resolving');
   const conflict=current.conflicts.find(c=>c.id===conflictId);if(!conflict)throw Error('Conflict not found');validateProject(conflict.project);
   const result={...current,revision:current.revision+1,project:structuredClone(useIncoming?conflict.project:current.project),conflicts:current.conflicts.filter(c=>c.id!==conflictId),resolvedConflicts:[...(current.resolvedConflicts||[]),{id:conflictId,resolvedAt:new Date().toISOString(),choice:useIncoming?'incoming':'current',current:structuredClone(current.project),incoming:structuredClone(conflict.project)}]};
   this.storage.setItem(this.prefix+encodeURIComponent(projectId),JSON.stringify(result));return result;
  });
 }
 export(id){return this.storage.getItem(this.prefix+encodeURIComponent(id));}
}
