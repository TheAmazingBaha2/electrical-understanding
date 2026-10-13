import test from 'node:test';
import assert from 'node:assert/strict';
import {ProgressStore,migrate,migrateLesson,equal,legacyKey,storageKey,PROJECT} from '../persistence.js';
class Storage {
 data=new Map(); get length(){return this.data.size} key(i){return [...this.data.keys()][i]??null}
 getItem(k){return this.data.get(k)??null} setItem(k,v){this.data.set(k,v)}
}
class Locks {
 tail=Promise.resolve(); request(k,fn){const task=this.tail.then(fn);this.tail=task.catch(()=>{});return task}
}
const make=(storage=new Storage(),id='alice',locks=new Locks())=>new ProgressStore(storage,id,locks);
const lesson=(value='a')=>({answers:{u1:{value,correct:true}},complete:false,updatedAt:1});
const edit=(s,id='L01',value='a')=>s.edit(id,l=>{l.answers.u1={value,correct:true}});
function cloud(){
 const rows=new Map();let fail=false;
 return {rows,set fail(v){fail=v},async list(){if(fail)throw Error('offline');return structuredClone([...rows.values()])},async compareAndSet(id,data,revision){
  if(fail)throw Error('offline');const row=rows.get(id);if((row?.revision??null)!==revision)return null;
  const saved={lesson_id:id,data:structuredClone(data),revision:revision===null?0:revision+1};rows.set(id,saved);return structuredClone(saved);
 }};
}
test('v1 raw map and v1/v2 exports migrate to v3 idempotently without changing IDs',()=>{
 for(const input of [{L01:lesson()},{version:1,progress:{L01:lesson()}},{schemaVersion:2,progress:{L01:{...lesson(),schemaVersion:2}}}]){
  const result=migrate(input);assert.equal(result.schemaVersion,3);assert.equal(result.progress.L01.schemaVersion,3);assert.deepEqual(result.progress.L01.answers,lesson().answers);assert.deepEqual(migrate(result),result);
 }
});
test('unknown envelope, lesson, answer fields and archived IDs survive',()=>{
 const doc=migrate({schemaVersion:2,extension:{x:[1,2]},progress:{retired:{...lesson(),custom:{x:1},answers:{old:{value:0,extra:{a:2}}}}}});
 assert.deepEqual(doc.extension,{x:[1,2]});assert.equal(doc.progress.retired.answers.old.extra.a,2);assert.equal(doc.progress.retired.custom.x,1);
});
test('future/malformed versions reject without overwriting source and raw export works',async()=>{
 for(const raw of ['{bad',JSON.stringify({schemaVersion:4,progress:{}}),JSON.stringify({L01:{schemaVersion:4,answers:{}}}),JSON.stringify({L01:{answers:[]}})]){
  const s=make();s.storage.setItem(legacyKey('alice'),raw);assert.throws(()=>s.read());await assert.rejects(edit(s));assert.equal(s.storage.getItem(legacyKey('alice')),raw);assert.equal(s.storage.getItem(s.key),null);assert.equal(JSON.parse(s.export()).legacyRaw,raw);
 }
});
test('legacy migration keeps old key and makes backup before first write',async()=>{
 const s=make(),raw=JSON.stringify({L01:lesson()});s.storage.setItem(legacyKey('alice'),raw);await edit(s,'L01','new');assert.equal(s.storage.getItem(legacyKey('alice')),raw);assert.equal(s.backups().length,1);assert.equal(JSON.parse(s.storage.getItem(s.backups()[0])).progress.L01.answers.u1.value,'a');
});
test('local storage quota failure leaves old document intact',async()=>{
 const s=make();await edit(s);const raw=s.storage.getItem(s.key);s.storage.setItem=()=>{throw Error('quota')};await assert.rejects(edit(s,'L01','b'),/quota/);assert.equal(s.storage.getItem(s.key),raw);
});
test('two local tabs serialize edits instead of overwriting another question',async()=>{
 const storage=new Storage(),locks=new Locks(),a=make(storage,'alice',locks),b=make(storage,'alice',locks);
 await Promise.all([a.edit('L01',l=>{l.answers.a={value:1}}),b.edit('L01',l=>{l.answers.b={value:2}})]);
 assert.deepEqual(Object.keys(a.read().progress.L01.answers),['a','b']);
});
test('no Web Locks fails closed',async()=>{const s=make();s.locks=null;await assert.rejects(edit(s),/Web Locks/)});
test('user and anonymous storage are isolated; scoped backups reject other accounts',async()=>{
 const storage=new Storage(),a=make(storage),b=make(storage,'bob'),anon=make(storage,null);await edit(a);assert.deepEqual(b.read().progress,{});assert.deepEqual(anon.read().progress,{});await assert.rejects(b.import(JSON.parse(a.export())),/different account/);assert.notEqual(storageKey('alice'),storageKey('bob'));
});
test('offline restart reconnects and uploads retained answers',async()=>{
 const s=make(),c=cloud();await edit(s);c.fail=true;await assert.rejects(s.sync(c),/offline/);const restarted=make(s.storage);c.fail=false;await restarted.sync(c);assert.equal(c.rows.get('L01').data.answers.u1.value,'a');assert.equal(restarted.read().bases.L01.revision,0);
});
test('different lessons synchronize independently',async()=>{
 const a=make(),b=make(),c=cloud();await edit(a,'L01','a');await edit(b,'L02','b');await a.sync(c);await b.sync(c);await a.sync(c);assert.equal(a.read().progress.L02.answers.u1.value,'b');assert.equal(b.read().progress.L01.answers.u1.value,'a');
});
test('same lesson conflicts keep both copies, ignore clocks, and resolve with a backup',async()=>{
 const a=make(),b=make(),c=cloud();await edit(a);await a.sync(c);await b.sync(c);await edit(a,'L01','phone');await edit(b,'L01','desktop');await a.sync(c);await b.sync(c);
 assert.equal(b.read().progress.L01.answers.u1.value,'desktop');assert.equal(b.read().conflicts.L01.incoming.answers.u1.value,'phone');assert.equal(c.rows.get('L01').data.answers.u1.value,'phone');
 await b.resolve('L01',false);await b.sync(c);assert.equal(c.rows.get('L01').data.answers.u1.value,'desktop');assert.ok(b.backups().some(k=>JSON.parse(b.storage.getItem(k)).conflicts.L01));
});
test('cloud changed again after conflict resolution re-conflicts safely',async()=>{
 const a=make(),b=make(),c=cloud();await edit(a);await a.sync(c);await b.sync(c);await edit(a,'L01','a2');await a.sync(c);await edit(b,'L01','b2');await b.sync(c);await b.resolve('L01',false);await edit(a,'L01','a3');await a.sync(c);await b.sync(c);assert.equal(b.read().conflicts.L01.incoming.answers.u1.value,'a3');
});
test('conditional-write race never replaces remote data',async()=>{
 const s=make(),c=cloud();await edit(s);await s.sync(c);await edit(s,'L01','local');const original=c.compareAndSet;c.compareAndSet=async(...args)=>{c.rows.get('L01').revision++;c.rows.get('L01').data= migrateLesson(lesson('concurrent'));return original(...args)};
 await assert.rejects(s.sync(c),/changed during sync/);assert.equal(s.read().progress.L01.answers.u1.value,'local');assert.equal(c.rows.get('L01').data.answers.u1.value,'concurrent');
});
test('lost response is idempotently recovered on retry',async()=>{
 const s=make(),c=cloud();await edit(s);const original=c.compareAndSet;c.compareAndSet=async(...args)=>{await original(...args);throw Error('response lost')};await assert.rejects(s.sync(c));c.compareAndSet=original;await s.sync(c);assert.equal(c.rows.get('L01').revision,0);assert.equal(s.read().bases.L01.revision,0);
});
test('edit during upload stays dirty and uploads on next retry',async()=>{
 const s=make(),c=cloud();await edit(s);const original=c.compareAndSet;c.compareAndSet=async(...args)=>{await edit(s,'L01','new');return original(...args)};await s.sync(c);assert.equal(s.read().progress.L01.answers.u1.value,'new');c.compareAndSet=original;await s.sync(c);assert.equal(c.rows.get('L01').data.answers.u1.value,'new');
});
test('auth change during download prevents local or cloud writes',async()=>{
 const s=make(),c=cloud();await edit(s);const raw=s.storage.getItem(s.key);await s.sync(c,()=>false);assert.equal(s.storage.getItem(s.key),raw);assert.equal(c.rows.size,0);
});
test('future cloud records block writes and are never downgraded',async()=>{
 const s=make(),c=cloud();await edit(s);c.rows.set('L01',{lesson_id:'L01',revision:0,data:{schemaVersion:4,answers:{},future:42}});const raw=s.storage.getItem(s.key);await assert.rejects(s.sync(c),/Unsupported/);assert.equal(c.rows.get('L01').data.schemaVersion,4);assert.equal(s.storage.getItem(s.key),raw);
});
test('rollback import keeps current data until explicit review and preserves original backup',async()=>{
 const s=make();await edit(s,'L01','original');const backup=JSON.parse(s.export());await edit(s,'L01','new');await s.import(backup);assert.equal(s.read().progress.L01.answers.u1.value,'new');await s.resolve('L01',true);assert.equal(s.read().progress.L01.answers.u1.value,'original');assert.ok(s.backups().some(k=>JSON.parse(s.storage.getItem(k)).progress.L01?.answers.u1.value==='new'));
});
test('unknown fields survive answer update and export/import',async()=>{
 const s=make();await s.import({version:1,extra:{a:1},progress:{retired:{answers:{q:{value:1,extension:'keep'}},extension:'keep'}}});await s.edit('retired',l=>{l.answers.q={...l.answers.q,value:2}});const target=make();await target.import(JSON.parse(s.export()));assert.equal(target.read().progress.retired.answers.q.extension,'keep');assert.deepEqual(target.read().extra,{a:1});
});
test('missing cloud row is a conflict, not an inferred delete',async()=>{
 const s=make(),c=cloud();await edit(s);await s.sync(c);c.rows.clear();await s.sync(c);assert.ok(s.read().progress.L01);assert.equal(s.read().conflicts.L01.incoming,null);
});
import {readFileSync} from 'node:fs';
import {lessons} from '../lessons.js';
import {labLessons} from '../lab-lessons.js';
import {bookLessons} from '../book-lessons.js';
import {cetaLessons} from '../ceta-lessons.js';
test('published IDs are immutable and unique across layout redesigns',()=>{
 const frozen=JSON.parse(readFileSync(new URL('./stable-ids.json',import.meta.url)));
 const all=[...lessons,...labLessons,...bookLessons,...cetaLessons];
 assert.equal(new Set(all.map(l=>l.id)).size,all.length);
 for(const l of all){assert.equal(new Set(l.questions.map(q=>q.id)).size,l.questions.length)}
 for(const [id,ids] of Object.entries(frozen)){
  const current=all.find(l=>l.id===id);assert.ok(current,`Keep ${id} in catalog or explicitly archive its immutable ID in the registry`);
  for(const qid of ids)assert.ok(current.questions.some(q=>q.id===qid),`Do not rename/reuse ${id}/${qid}`);
 }
});
test('hostile prototype keys are rejected without writes',async()=>{
 const s=make();await assert.rejects(s.import(JSON.parse('{"__proto__":{"answers":{}}}')),/Unsafe/);assert.equal(s.storage.length,0);
});
test('an older download cannot roll back a revision acknowledged by another tab',async()=>{
 const s=make(),c=cloud();await edit(s);await s.sync(c);
 const original=c.list;c.list=async()=>{const rows=await original();await edit(s,'L01','new');const saved=await c.compareAndSet('L01',s.read().progress.L01,0);await s.change(d=>{d.bases.L01=saved});return rows};
 await s.sync(c);assert.equal(s.read().progress.L01.answers.u1.value,'new');assert.equal(s.read().bases.L01.revision,1);
});
