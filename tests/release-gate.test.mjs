import test from 'node:test';
import assert from 'node:assert/strict';
import {requireCI,verifiedRun} from '../scripts/require-ci.mjs';
const sha='a'.repeat(40),run={id:1,head_sha:sha,head_branch:'draft/v2-dmm-companion',path:'.github/workflows/v2-checks.yml',event:'push',status:'completed',conclusion:'success'};
test('promotion requires successful complete CI on exact branch and commit',()=>{
 assert.equal(verifiedRun({workflow_runs:[run]},sha),true);
 for(const patch of [{head_sha:'b'.repeat(40)},{head_branch:'main'},{conclusion:'failure'},{status:'in_progress'},{path:'other.yml'}])assert.equal(verifiedRun({workflow_runs:[{...run,...patch}]},sha),false);
 assert.equal(verifiedRun({workflow_runs:[run,{...run,id:2,conclusion:'failure'}]},sha),false);
});
test('quality gate fails closed on unavailable or unfinished CI',async()=>{
 await assert.rejects(requireCI(sha,{fetcher:async()=>({ok:false,status:403})}),/HTTP 403/);
 await assert.rejects(requireCI(sha,{fetcher:async()=>({ok:true,json:async()=>({workflow_runs:[]})}),tries:1}),/has not passed/);
});
