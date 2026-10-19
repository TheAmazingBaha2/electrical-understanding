import {test} from 'node:test';import assert from 'node:assert/strict';
import {reviewedAssetType,reviewAssetInventory} from '../assets.mjs';
test('reviewed application paths include the actual editor icon font but never private data',()=>{
  assert.equal(reviewedAssetType('assets/codicon-DfX.ttf'),'font/ttf');
  assert.equal(reviewedAssetType('electronics/recovery.js'),'text/javascript');
  assert.equal(reviewedAssetType('private/coding-text.json'),null);
  for(const file of ['private/extra.json','suite-google-web.json','assets/app.js.map','assets/page.png','source.ts','assets/../private/coding-text.json','/index.html','assets/%2e%2e/a.js','assets/app.js?token=x','assets\\app.js'])assert.throws(()=>reviewedAssetType(file));
});
test('release inventories refuse missing dependencies, duplicate paths and invalid identities',()=>{
  const entry={path:'index.html',bytes:100,sha256:'a'.repeat(64)};
  assert.throws(()=>reviewAssetInventory([entry]),/Missing/);
  assert.throws(()=>reviewAssetInventory([entry,{...entry,path:'INDEX.HTML'}]),/duplicate/);
  for(const row of [{...entry,bytes:-1},{...entry,bytes:Infinity},{...entry,sha256:'wrong'}])assert.throws(()=>reviewAssetInventory([row]),/Invalid/);
});
