import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {verifyStaging} from '../scripts/verify-staging.mjs';
const sha='a'.repeat(40),bytes=new TextEncoder().encode('fixture'),assets=[{name:'app.js',hash:createHash('sha256').update(bytes).digest('hex')}];
const info={commit:sha,branch:'draft/v2-dmm-companion',worker:'eu-v2-staging'};
test('read-back verifies exact commit and actual static asset bytes only',async()=>{
 const requests=[];const fetcher=async url=>{requests.push(url);return url.includes('build-info')?Response.json(info):new Response(bytes);};
 const r=await verifyStaging(sha,assets,{fetcher,tries:1});assert.equal(r.assetCount,1);assert.ok(requests.every(u=>u.startsWith('https://eu-v2-staging.vanguardcorbett.workers.dev/')));assert.ok(requests.every(u=>!u.includes('supabase')&&!u.includes('functions')));
});
test('stale deployment, wrong branch and mixed assets fail rather than claiming a publish',async()=>{
 await assert.rejects(verifyStaging(sha,assets,{fetcher:async()=>Response.json({...info,commit:'b'.repeat(40)}),tries:1}),/unverified/);
 await assert.rejects(verifyStaging(sha,assets,{fetcher:async()=>Response.json({...info,branch:'main'}),tries:1}),/unverified/);
 await assert.rejects(verifyStaging(sha,assets,{fetcher:async url=>url.includes('build-info')?Response.json(info):new Response('different'),tries:1}),/differs/);
});
