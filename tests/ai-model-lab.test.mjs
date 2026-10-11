import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderAIModelLab} from '../ai-model-lab.js';
const edge=readFileSync(new URL('../supabase/functions/ai-model-lab/index.ts',import.meta.url),'utf8');
const fixtures=readFileSync(new URL('../supabase/functions/ai-model-lab/cases.ts',import.meta.url),'utf8');
const schema=readFileSync(new URL('../supabase/migrations/20261011_private_ai_model_lab.sql',import.meta.url),'utf8');
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const build=readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
test('anonymous visitors cannot use the test interface',()=>{
 const html=renderAIModelLab(null);
 assert.match(html,/Sign in/);
 assert.doesNotMatch(html,/id="ai-run"/);
});
test('signed-in visitor sees comparison controls initially disabled until authorization',()=>{
 const html=renderAIModelLab({id:'opaque'});
 assert.match(html,/id="ai-run" disabled/);
 assert.match(html,/id="ai-case" disabled/);
});
test('model endpoint validates JWT and matches an owner row before test requests',()=>{
 assert.match(edge,/client\.auth\.getUser\(token\)/);
 assert.match(edge,/ai_test_allowed_users/);
 assert.match(edge,/if\(!allowed\)return response\(\{error:"Private AI lab/);
});
test('endpoint has a fixed model allowlist and no Astra',()=>{
 assert.match(fixtures,/"gpt-6-luna","gpt-6\.1-sol"/);
 assert.doesNotMatch(fixtures,/gpt-6-astra/);
 assert.match(edge,/MODELS\.includes\(input\.model/);
});
test('paid calls fail closed without server-side API key',()=>{
 assert.match(edge,/OPENAI_API_KEY/);
 assert.match(edge,/if\(!apiKey\.startsWith\("sk-"\)\)return response/);
 assert.match(edge,/client\.rpc\("ai_test_reserve"/);
 assert.match(edge,/store:false/);
});
test('staging project and origin are exact; no production URL is embedded',()=>{
 assert.match(edge,/hkwmtjhgrskidaizamwy/);
 assert.match(edge,/eu-v2-staging\.vanguardcorbett\.workers\.dev/);
 assert.doesNotMatch(edge,/wwvpzyqcgwlwcetwlime/);
});
test('quota SQL serializes and caps owner requests',()=>{
 assert.match(schema,/pg_advisory_xact_lock/);
 assert.match(schema,/ai_test_reserve/);
 for(const str of ['1 minute','1 hour','24 hours'])assert.ok(schema.includes(str));
 assert.match(schema,/grant select on public\.ai_test_allowed_users to authenticated/);
 assert.match(schema,/revoke all on public\.ai_test_request_log from public, anon, authenticated/);
});
test('test fixtures span electronics topics but no scans or progress records',()=>{
 const ids=[...fixtures.matchAll(/\{id:"([^"]+)"/g)].map(m=>m[1]);
 assert.ok(ids.length>=12);
 assert.equal(new Set(ids).size,ids.length);
 for(const v of ['CETa','DMM','Safety','Audio'])assert.ok(fixtures.includes(v));
 assert.doesNotMatch(fixtures,/L01\/L02/);
});
test('public build contains UI only, never Edge Function or prompt fixtures',()=>{
 assert.match(build,/"ai-model-lab\.js"/);
 assert.doesNotMatch(build,/"supabase\/functions\/ai-model-lab\/index\.ts"/);
 assert.doesNotMatch(app,/api\.openai\.com|OPENAI_API_KEY/);
});
test('private lab does not alter lesson IDs or local progress',()=>{
 assert.match(app,/view==='ai-lab'\?renderAIModelLab\(user\)/);
 assert.match(app,/attachAIModelLab\(supabase,notify\)/);
 assert.ok(!edge.includes("lesson_progress"));
});
