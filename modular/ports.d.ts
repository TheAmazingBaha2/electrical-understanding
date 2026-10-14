// Storage/host API contracts. Values must additionally pass Schema V3 validation.
export type Json = null | boolean | number | string | Json[] | {[key:string]:Json};
export interface Entity {schemaVersion:3; kind:string; id:string; [key:string]:Json;}
export interface RevisionRef {id:string; version:string;}
export interface Bundle {schemaVersion:3; id:string; version:string; entities:Entity[];}
// Content is an immutable in-memory snapshot after an asynchronous host load.
// SQLite/filesystem/web loaders must not turn a renderer lookup into hidden I/O.
export interface ContentRepository {
 get(kind:string,id:string,version?:string):Entity|null;
 list(kind?:string):Entity[];
 importBundle(bundle:Bundle):Bundle;
 exportBundle(id:string,version:string):string;
}
export interface ScopedRepository {get(id:string,version?:string):Entity|null; list():Entity[];}
export interface EvidenceRepository extends ScopedRepository {}
export interface TopicRepository extends ScopedRepository {}
export interface LessonRepository extends ScopedRepository {}
export interface AssessmentRepository extends ScopedRepository {}
export interface PresentationRepository extends ScopedRepository {}
export interface LabModuleRepository extends ScopedRepository {}
export interface ProgressRepository {append(event:Entity):Entity; list():Entity[]; import(events:Entity[]):Entity[];}
export interface MergeResult {events:Entity[]; conflicts:{id:string; variants:Entity[]}[];}
export interface SyncProvider {
 readonly transportEnabled:boolean;
 mergeAttempts(left:Entity[],right:Entity[]):MergeResult;
}
export interface SearchProvider {searchTopics(query:string):Entity[];}
export interface IngestionProvider {
 // Developer/private-authoring port only; proposals never publish themselves.
 // Explicit authorized input is passed in, not fetched from ChatGPT or private files.
 prepare(input:Json,context:{topics:Entity[]; evidence:Entity[];editions:Entity[];locators:Entity[];lessons:Entity[]}):Promise<{batch:Entity; proposals:Entity[];diffs:Json[];contextHash:string}>;
 validate(batch:Entity,proposals:Entity[]):{valid:boolean; issues:string[]};
}
export interface PrivateHostStorage {
 readonly ownerId:string;
 loadApprovedContent():Promise<ContentRepository>;
 // Mutable private events/projects require an atomic revision-aware transaction.
 readPrivateDocument(namespace:string):Promise<{revision:string|null; value:Json|null}>;
 compareAndSwap(namespace:string,expectedRevision:string|null,value:Json):Promise<{saved:boolean; revision:string; conflicts:Json[]}>;
 exportRecovery(namespace:string):Promise<Json>;
 // Import retains both heads and every variant. It does not choose a conflict winner.
 importRecovery(namespace:string,recovery:Json):Promise<{heads:string[];conflicted:boolean}>;
 restoreRevision(namespace:string,revision:string,expectedRevision:string|null):Promise<{saved:boolean;revision:string;conflicts:Json[]}>;
}
