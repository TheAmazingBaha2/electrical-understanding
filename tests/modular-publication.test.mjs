import test from 'node:test';import assert from 'node:assert/strict';import {mkdtemp,rm,readFile} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {learningFixture} from './modular-learning-fixture.mjs';import {preparePublication,publicationDiff,inspectPublication} from '../modular/publication.js';import {exportReviewedBundle} from '../scripts/content/publish-reviewed-bundle.mjs';import {readPrivateBundle} from '../scripts/content/modular-file-repository.mjs';
test('developer publication exports immutable local approved artifacts with review hashes, rollback and no activation',async()=>{
 const root=await mkdtemp(join(tmpdir(),'eu-approved-export-'));try{
  const {bundle,publication}=await learningFixture(),out=await exportReviewedBundle(bundle,publication,root);assert.equal(out.activated,false);assert.ok((await readPrivateBundle(join(root,'approved.bundle.json'))).entities.length);assert.equal(JSON.parse(await readFile(join(root,'release.json'),'utf8')).publicationHash,out.publicationHash);await assert.rejects(exportReviewedBundle(bundle,publication,root),/EEXIST/);
  const draft=await learningFixture({published:false});await assert.rejects(exportReviewedBundle(draft.bundle,draft.publication,root),/Publication blocked/);
 }finally{await rm(root,{recursive:true,force:true});}
});
test('content/grade impact is order independent and blocks same-version rewriting even with a newly prepared review form',async()=>{
 const {bundle}=await learningFixture(),reordered=structuredClone(bundle);reordered.entities.reverse();assert.deepEqual(await preparePublication(bundle),await preparePublication(reordered));
 const changed=structuredClone(bundle);changed.version='3.0.0';changed.entities.find(e=>e.kind==='AssessmentTemplate').explanation='Changed grading context';const diff=publicationDiff(bundle,changed);assert.ok(diff.immutableConflicts.length);const manifest=await preparePublication(changed,{previous:bundle});const result=await inspectPublication(changed,manifest,{previous:bundle,widgetLookup:()=>true});assert.equal(result.valid,false);assert.ok(result.issues.includes('Previously identified immutable content changed'));
});
