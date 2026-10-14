import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {stripTypeScriptTypes} from 'node:module';
import {approvedWorkbenchLessons} from '../generated-library.js';
import {preservedLessons} from '../approved-lessons.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('exported approvals preserve every runtime lesson, ID, question, rule, activity and reference',()=>{
 const source=read('content/approved/source-jobs.json'),{jobs}=JSON.parse(source);
 const inventory=JSON.parse(read('content/approved/inventory.json'));
 assert.equal(inventory.sourceHash,createHash('sha256').update(source).digest('hex'));
 assert.deepEqual(preservedLessons,approvedWorkbenchLessons(jobs));
 assert.equal(preservedLessons.length,33);
 assert.equal(preservedLessons.filter(l=>l.archived).length,16);
 assert.equal(preservedLessons.filter(l=>l.curatedSeries).length,17);
 assert.equal(preservedLessons.reduce((n,l)=>n+l.questions.length,0),336);
 assert.ok(preservedLessons.every(l=>l.sourcePages&&l.html&&l.questions.length));
 assert.equal(new Set(preservedLessons.map(l=>l.id)).size,33);
});
test('every legacy backend action is rejected without auth, storage, database or paid calls',async()=>{
 for(const gateway of ['scan-lesson-pipeline','ai-model-lab']){
  let handler;let calls=0;
  vm.runInNewContext(stripTypeScriptTypes(read('supabase/functions/'+gateway+'/index.ts')),{Deno:{serve:f=>handler=f},Response,fetch:()=>{calls++;throw Error('Network forbidden');}});
  for(const action of ['register','plan','analyze','outline','draft','review','approve','delete','resume','chat','run','status']){
   const response=await handler(new Request('https://fixture.test',{method:'POST',body:JSON.stringify({action})}));
   assert.equal(response.status,410);assert.equal((await response.json()).ready,false);
  }
  assert.equal(calls,0);
 }
});
test('no authoring module or control is reachable from the V3 application or build',()=>{
 const app=read('app.js'),build=read('scripts/build.mjs'),chat=read('ai-chat-widget.js');
 assert.doesNotMatch(app,/import.*(?:scan-inbox|ai-model-lab)|renderScanInbox|attachScanInbox|scan_lesson_jobs|data-goto="scan-inbox"/);
 assert.doesNotMatch(build,/"(?:scan-inbox|ai-model-lab)\.js"|archive\/authoring/);
 assert.doesNotMatch(chat,/functions\.invoke|fetch\(/);
 assert.match(app,/const stagingBackend = false/);
 assert.match(chat,/authorized=false/);
});
