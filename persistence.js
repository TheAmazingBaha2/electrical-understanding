export const SCHEMA_VERSION = 3;
export const PROJECT = 'hkwmtjhgrskidaizamwy';
const copy = value => structuredClone(value);
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const own = (value, key) => Object.hasOwn(value, key);
function checkObject(value, label) { if (!object(value)) throw new Error(`Invalid ${label}; original data retained.`); }
function safeKeys(value) {
 if (!object(value) && !Array.isArray(value)) return;
 for (const [key, item] of Object.entries(value)) {
  if (['__proto__','constructor','prototype'].includes(key)) throw new Error('Unsafe JSON key; original data retained.');
  safeKeys(item);
 }
}
function version(value) {
 const n = value.schemaVersion ?? value.version ?? 1;
 if (!Number.isInteger(n) || n < 1 || n > SCHEMA_VERSION) throw new Error('Unsupported progress version; export and use a newer app. Original data retained.');
 return n;
}
function entries(value) { checkObject(value, 'progress map'); return Object.entries(value); }
export function migrateLesson(input) {
 checkObject(input, 'lesson'); safeKeys(input); version(input);
 if (input.answers !== undefined) {
  checkObject(input.answers, 'answers');
  for (const [, answer] of entries(input.answers)) { checkObject(answer, 'answer'); version(answer); }
 }
 return {...copy(input), schemaVersion: SCHEMA_VERSION, answers: copy(input.answers ?? {})};
}
export function migrate(input) {
 checkObject(input, 'progress');
 safeKeys(input);
 const wrapped = own(input, 'progress');
 if (wrapped) version(input);
 const progress = Object.fromEntries(entries(wrapped ? input.progress : input).map(([id, lesson]) => [id, migrateLesson(lesson)]));
 return {...(wrapped ? copy(input) : {}), schemaVersion: SCHEMA_VERSION, progress};
}
function canonical(value) {
 if (Array.isArray(value)) return value.map(canonical);
 if (object(value)) return Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])]));
 return value;
}
export const equal = (a, b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
export const storageKey = userId => `eu_progress:${PROJECT}:${userId || 'anonymous'}`;
export const legacyKey = userId => userId ? `eu_staging_progress_v1_${userId}` : 'eu_demo_v1';

// One origin-wide Web Lock serializes tabs. Without locks, fail closed to read/export.
// Network waits never hold the lock; revision checks handle cross-device races.
export class ProgressStore {
 constructor(storage, userId, locks = globalThis.navigator?.locks) {
  this.storage = storage; this.userId = userId || null; this.key = storageKey(userId); this.locks = locks;
 }
 read() {
  const raw = this.storage.getItem(this.key);
  if (raw !== null) {
   const result = migrate(JSON.parse(raw));
   if (result.owner !== this.userId || result.project !== PROJECT) throw new Error('Progress owner or project mismatch.');
   checkObject(result.bases, 'sync bases'); checkObject(result.conflicts, 'conflicts');
   return result;
  }
  const old = this.storage.getItem(legacyKey(this.userId));
  return {...migrate(old === null ? {} : JSON.parse(old)), owner:this.userId, project:PROJECT, bases:{}, conflicts:{}};
 }
 async change(fn) {
  if (!this.locks) throw new Error('Safe storage requires Web Locks. Export your data or use a current browser.');
  return this.locks.request(this.key, async () => {
   const doc = this.read();
   const before = copy(doc);
   await fn(doc);
   // Backup must succeed before any replacement. Quota failures abort the write.
   if (!equal(doc, before) || this.storage.getItem(this.key) === null) {
    this.backup('before-write', before);
    this.storage.setItem(this.key, JSON.stringify(doc));
   }
   return copy(doc);
  });
 }
 backup(reason, doc = this.read()) {
  const key = `${this.key}:backup:${Date.now()}:${globalThis.crypto.randomUUID()}`;
  this.storage.setItem(key, JSON.stringify({reason, ...copy(doc)}));
  return key;
 }
 backups() {
  return Array.from({length:this.storage.length}, (_, i) => this.storage.key(i)).filter(k => k?.startsWith(`${this.key}:backup:`)).sort().reverse();
 }
 export() {
  // Raw source remains exportable even if parsing/migration is blocked.
  return JSON.stringify({format:'electrical-understanding-backup', schemaVersion:3, project:PROJECT, owner:this.userId,
   exportedAt:new Date().toISOString(), raw:this.storage.getItem(this.key), legacyRaw:this.storage.getItem(legacyKey(this.userId)),
   backups:this.backups().map(key => ({key, raw:this.storage.getItem(key)}))}, null, 2);
 }
 async edit(id, fn) {
  return this.change(doc => {
   const lesson = migrateLesson(doc.progress[id] ?? {answers:{},complete:false,updatedAt:0});
   fn(lesson); doc.progress[id] = migrateLesson(lesson);
  });
 }
 async import(input) {
  if (input.format === 'electrical-understanding-backup') {
   if (input.project !== PROJECT || input.owner !== this.userId) throw new Error('Backup belongs to a different account or project.');
   input = JSON.parse(input.raw ?? input.legacyRaw ?? '{}');
  }
  if (input.project !== undefined && input.project !== PROJECT) throw new Error('Wrong project.');
  if (input.owner !== undefined && input.owner !== this.userId) throw new Error('Wrong account.');
  const imported = migrate(input); // Validate entire file before any writes.
  return this.change(doc => {
   this.backup('import-source', imported);
   for (const [id, lesson] of entries(imported.progress)) {
    if (!own(doc.progress,id)) doc.progress[id] = lesson;
    else if (!equal(doc.progress[id], lesson)) doc.conflicts[id] = {kind:'import', incoming:lesson};
   }
   // Preserve unfamiliar envelope fields without overriding current metadata.
   for (const [key, value] of entries(imported)) if (!own(doc,key)) doc[key] = value;
  });
 }
 async resolve(id, useIncoming) {
  return this.change(doc => {
   const conflict = doc.conflicts[id];
   if (!conflict) return;
   if (useIncoming) {
    if (conflict.incoming === null) throw new Error('Remote deletion requires manual recovery; local copy retained.');
    doc.progress[id] = migrateLesson(conflict.incoming);
   }
   if (conflict.kind === 'cloud') doc.bases[id] = conflict.remote;
   delete doc.conflicts[id];
  });
 }
 async sync(transport, isCurrent = () => true) {
  const rows = await transport.list();
  if (!isCurrent()) return;
  const remote = Object.fromEntries(rows.map(row => [row.lesson_id, row]));
  const pending = [];
  await this.change(doc => {
   for (const id of new Set([...Object.keys(doc.progress), ...Object.keys(remote)])) {
    const row = remote[id] ?? null;
    if (row && (!Number.isSafeInteger(row.revision) || row.revision < 0)) throw new Error('Cloud migration required; local data retained.');
    const incoming = row ? migrateLesson(row.data) : null;
    const local = doc.progress[id] ?? null;
    const known = own(doc.bases, id);
    const base = doc.bases[id] ?? null;
    const baseline = base ? migrateLesson(base.data) : null;
    // Another tab may have acknowledged a newer revision after this download.
    if (row && base && row.revision < base.revision) continue;
    if (doc.conflicts[id]) continue;
    if (equal(local, incoming)) { doc.bases[id] = row; continue; }
    if (local === null || (known && equal(local, baseline) && incoming !== null)) {
     doc.progress[id] = incoming; doc.bases[id] = row; continue;
    }
    if ((known && equal(incoming, baseline)) || (!known && row === null)) {
     pending.push({id, state:copy(local), row}); continue;
    }
    // No trusted common ancestor (legacy) or two changed copies: never guess by clock.
    doc.conflicts[id] = {kind:'cloud', incoming, remote:row};
   }
  });
  for (const {id, state, row} of pending) {
   if (!isCurrent()) return;
   const saved = await transport.compareAndSet(id, state, row?.revision ?? null);
   if (!isCurrent()) return;
   if (!saved) throw new Error('Cloud changed during sync. Local answers retained; refresh to review conflict.');
   await this.change(doc => { if ((doc.bases[id]?.revision ?? -1) < saved.revision) doc.bases[id] = saved; });
   // If edited during upload, the newer local value stays dirty against this base.
  }
 }
}
export function cloudTransport(client, userId) {
 return {
  async list() {
   // Paginate; Supabase's default row limit must never look like deletion.
   const rows = []; let start = 0;
   for (;;) {
    const {data,error} = await client.from('lesson_progress').select('lesson_id,data,revision,updated_at').eq('user_id',userId).order('lesson_id').range(start,start+499);
    if (error) throw error;
    rows.push(...data); if (data.length < 500) return rows; start += 500;
   }
  },
  async compareAndSet(id, state, revision) {
   let query;
   if (revision === null) query = client.from('lesson_progress').insert({user_id:userId,lesson_id:id,data:state,revision:0});
   else query = client.from('lesson_progress').update({data:state,revision:revision+1}).eq('user_id',userId).eq('lesson_id',id).eq('revision',revision);
   const {data,error} = await query.select('lesson_id,data,revision,updated_at');
   if (error?.code === '23505') return null;
   if (error) throw error;
   return data?.[0] ?? null;
  }
 };
}
