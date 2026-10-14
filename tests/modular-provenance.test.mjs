import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {extractPreservedEvidence} from '../scripts/content/extract-preserved-evidence.mjs';
import {exportPrivateBundle} from '../scripts/content/modular-file-repository.mjs';

test('private extraction preserves every available analysis fact/formula/safety reference and every recorded gap',async()=>{
 const {jobs}=JSON.parse(await readFile(new URL('../content/approved/source-jobs.json',import.meta.url),'utf8'));
 for(const job of jobs){const result=extractPreservedEvidence(job),claims=result.bundle.entities.filter(e=>e.kind==='EvidenceClaim'),locators=result.bundle.entities.filter(e=>e.kind==='SourceLocator');assert.equal(claims.length,36);assert.equal(locators.length,18);
  for(const fact of job.analysis.facts){assert.ok(claims.some(c=>c.text===fact.claim));assert.ok(locators.some(l=>l.section===fact.location&&l.verification==='preserved-reference'));}
  for(const gap of job.analysis.gaps)assert.ok(result.batch.gaps.includes(gap));assert.ok(claims.every(c=>c.state==='under-review'));assert.equal(result.coverage.rawDeletionSafe,false);
  const broken=structuredClone(job);broken.analysis.equations[0].source_id='missing';assert.throws(()=>extractPreservedEvidence(broken),/Unresolved/);
  await assert.rejects(exportPrivateBundle(result.bundle,new URL('../content/modular/prohibited-private.json',import.meta.url).pathname),/outside/);
 }
});
test('new modular/public content paths exclude raw binary sources, private records and executable schemas',async()=>{
 const root=new URL('../content/modular/',import.meta.url),paths=await readdir(root);assert.deepEqual(paths.sort(),['domain.schema.json','legacy-inventory.json']);
 for(const path of paths){assert.ok(path.endsWith('.json'));const source=await readFile(new URL(path,root),'utf8');assert.doesNotMatch(source,/%PDF-|service_role|sb_secret_|storage_path|access_token|refresh_token/);JSON.parse(source);}
 const build=await readFile(new URL('../scripts/build.mjs',import.meta.url),'utf8');assert.doesNotMatch(build,/modular\/|private-authoring|\.pdf["']/);
});
