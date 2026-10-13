import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderScanInbox} from '../scan-inbox.js';
const source=readFileSync(new URL('../supabase/functions/scan-lesson-pipeline/index.ts',import.meta.url),'utf8');
const schema=readFileSync(new URL('../supabase/migrations/20261011223000_private_scan_lesson_pipeline.sql',import.meta.url),'utf8');
const build=readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
test('anonymous users cannot access upload form',()=>{
 const html=renderScanInbox(null);
 assert.match(html,/Sign in/);
 assert.doesNotMatch(html,/id="scan-upload-form"/);
});
test('signed-in scan upload requires explicit consent and shows all four stages',()=>{
 const html=renderScanInbox({id:'account'});
 assert.match(html,/id="scan-share-consent" type="checkbox" required/);
 assert.match(html,/Upload privately \(no AI charge\)/);
 assert.match(html,/Sol extracts.*Sol writes.*Sol reviews/);
});
test('staging source and API secrets never appear in public assets',()=>{
 assert.match(build,/"scan-inbox.js"/);
 assert.doesNotMatch(build,/"supabase\/functions\/scan-lesson-pipeline\/index.ts"/);
 assert.doesNotMatch(app,/SUPABASE_SERVICE_ROLE_KEY|OPENAI_API_KEY/);
});
test('backend verifies an authenticated user and explicit single account allowlist first',()=>{
 assert.match(source,/owner\.auth\.getUser\(token\)/);
 assert.match(source,/ai_test_allowed_users/);
 assert.match(source,/if\(!allowed\)return fail/);
 assert.match(source,/SUPABASE_SERVICE_ROLE_KEY/);
 assert.match(source,/STAGING_PROJECT|PROJECT="hkwmtjhgrskidaizamwy"/);
});
test('backend only accepts private owner path and sniffs source format',()=>{
 assert.match(source,/path\.startsWith\(userId\+"\/"\)/);
 assert.match(source,/function typeOf/);
 assert.match(source,/application\/pdf/);
 assert.match(source,/image\/webp/);
 assert.match(source,/data64\(source\.bytes\)/);
 assert.match(source,/sourceInput=.*job\.source_kind/);
});
test('models and steps are fixed, sequential, paid only through atomic quota',()=>{
 assert.match(source,/const model="gpt-6\.1-sol"/);
 assert.match(source,/admin\.rpc\("scan_reserve_stage"/);
 assert.match(source,/outline:"analyzed"/);
 assert.match(source,/if\(action==="approve"\)/);
 assert.match(source,/nextState="approved"/);
 assert.match(source,/revision:job\.revision\+1/);
});
test('no automatic lesson publishing or graded progress writes',()=>{
 assert.doesNotMatch(source,/lesson_progress|history|from\("lessons"\)/);
 assert.match(source,/GEN-/);
 assert.match(source,/source_ids/);
 assert.match(source,/if\(!job\.review\?\.ready/);
});
test('structured outputs include source attribution, safety notes and human review',()=>{
 assert.match(source,/json_schema/);
 assert.match(source,/safety_notes/);
 assert.match(source,/uncertain/);
 assert.match(source,/Findings|findings/);
 assert.match(source,/source_ids/);
 assert.match(source,/blocker/);
});
test('bucket RLS restricts uploads to owner and no client write rights to drafts',()=>{
 assert.match(schema,/public=false/);
 assert.match(schema,/file_size_limit=5242880/);
 assert.match(schema,/storage\.foldername\(name\)/);
 assert.match(schema,/ai_test_allowed_users/);
 assert.match(schema,/revoke all on public\.scan_lesson_jobs from public,anon,authenticated/);
 assert.match(schema,/grant select on public\.scan_lesson_jobs to authenticated/);
 assert.doesNotMatch(schema,/grant insert on public\.scan_lesson_jobs to authenticated/);
});

